import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { MongoClient } from 'mongodb';

const DATAFORSEO_API_KEY = process.env.DATAFORSEO_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').trim();
}

async function searchDataForSEO(query: string, city: string, state: string): Promise<any[]> {
  if (!DATAFORSEO_API_KEY) {
    throw new Error('DATAFORSEO_API_KEY is not defined');
  }

  const url = 'https://api.dataforseo.com/v3/business_data/business_listings/search/live';
  
  // Format the query to be more specific for wedding services
  const formattedQuery = `${query} in ${city}, ${state}`;
  console.log('DataForSEO API Query:', formattedQuery);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${DATAFORSEO_API_KEY}:`).toString('base64')}`
      },
      body: JSON.stringify([{
        keyword: formattedQuery,
        location_name: `${city}, ${state}`,
        language_code: 'en',
        limit: 20
      }])
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DataForSEO API Error:', errorText);
      throw new Error(`DataForSEO API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('DataForSEO API Response:', JSON.stringify(data, null, 2));

    const results = data.tasks?.[0]?.result?.[0]?.items || [];
    
    return results.map((result: any) => ({
      placeId: result.business_id,
      name: result.name,
      address: result.address,
      rating: result.rating,
      totalRatings: result.reviews_count,
      priceLevel: result.price_level,
      website: result.website,
      location: {
        type: 'Point',
        coordinates: [result.longitude, result.latitude]
      },
      cached: new Date()
    }));
  } catch (error) {
    console.error('Error in searchDataForSEO:', error);
    throw error;
  }
}

async function getCachedResults(category: string, city: string, state: string): Promise<any | null> {
  try {
    const client = await connectToDatabase();
    const db = client.db('wedding_directory');
    const collection = db.collection('cached_searches');

    return await collection.findOne({
      category,
      city: normalizeString(city),
      state: state.toLowerCase(),
      lastUpdated: { $gt: new Date(Date.now() - CACHE_DURATION) }
    });
  } catch (error) {
    console.error('Error getting cached results:', error);
    return null;
  }
}

async function cacheResults(places: any[], category: string, city: string, state: string) {
  try {
    const client = await connectToDatabase();
    const db = client.db('wedding_directory');
    const collection = db.collection('cached_searches');
    const placesCollection = db.collection('places');

    // Insert individual places
    if (places.length > 0) {
      await placesCollection.insertMany(places, { ordered: false })
        .catch((error: Error) => console.log('Some places already exist in the database:', error.message));
    }

    // Cache the search results
    await collection.updateOne(
      {
        category,
        city: normalizeString(city),
        state: state.toLowerCase()
      },
      {
        $set: {
          query: `${category} in ${city}, ${state}`,
          results: places,
          lastUpdated: new Date(),
          totalResults: places.length
        }
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error caching results:', error);
  }
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  try {
    // Handle both POST and GET requests
  let category, city, state, limit = 10;
  
  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    category = body.category;
    city = body.city;
    state = body.state;
    limit = body.limit || 10;
  } else if (event.httpMethod === 'GET') {
    const params = event.queryStringParameters || {};
    category = params.category;
    city = params.city;
    state = params.state;
    limit = params.limit ? parseInt(params.limit) : 10;
  } else {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

    if (!category || !city || !state) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    console.log('Searching for:', {
      category,
      city: normalizeString(city),
      state: state.toLowerCase(),
      limit
    });

    // Check cache first
    const cachedResults = await getCachedResults(category, city, state);
    if (cachedResults) {
      console.log('Returning cached results');
      const sortedResults = [...cachedResults.results].sort((a, b) => {
        // Sort by rating first
        if (b.rating !== a.rating) {
          return (b.rating || 0) - (a.rating || 0);
        }
        // If ratings are equal, sort by number of ratings
        return (b.totalRatings || 0) - (a.totalRatings || 0);
      }).slice(0, limit);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          ...cachedResults,
          results: sortedResults,
          totalResults: sortedResults.length
        })
      };
    }

    // If not in cache, fetch from DataForSEO API
    console.log('Fetching from DataForSEO API');
    const places = await searchDataForSEO(category, city, state);

    // Sort and limit results
    const sortedResults = [...places].sort((a, b) => {
      // Sort by rating first
      if (b.rating !== a.rating) {
        return (b.rating || 0) - (a.rating || 0);
      }
      // If ratings are equal, sort by number of ratings
      return (b.totalRatings || 0) - (a.totalRatings || 0);
    }).slice(0, limit);

    // Cache all results
    console.log('Caching results');
    await cacheResults(places, category, city, state);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        query: `${category} in ${city}, ${state}`,
        results: sortedResults,
        lastUpdated: new Date(),
        totalResults: sortedResults.length
      })
    };
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      })
    };
  }
};
