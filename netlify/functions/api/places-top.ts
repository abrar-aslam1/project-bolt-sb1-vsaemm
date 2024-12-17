import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { MongoClient } from 'mongodb';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

// Location coordinates and category mapping
const categoryMapping: Record<string, string> = {
  'venue': 'Wedding Venue',
  'venues': 'Wedding Venue',
  'wedding-venues': 'Wedding Venue',
  'photographer': 'Wedding Photographer',
  'photographers': 'Wedding Photographer',
  'photography': 'Wedding Photographer',
  'caterer': 'Wedding Caterer',
  'caterers': 'Wedding Caterer',
  'catering': 'Wedding Caterer',
  'florist': 'Wedding Florist',
  'florists': 'Wedding Florist',
  'flowers': 'Wedding Florist',
  'planner': 'Wedding Planner',
  'planners': 'Wedding Planner',
  'planning': 'Wedding Planner',
  'dress': 'Wedding Dress Shop',
  'dresses': 'Wedding Dress Shop',
  'dress-shops': 'Wedding Dress Shop',
  'beauty': 'Wedding Makeup Artist',
  'makeup': 'Wedding Makeup Artist',
  'dj': 'Wedding DJ',
  'djs': 'Wedding DJ',
  'music': 'Wedding DJ'
};

const locationCoordinates: Record<string, string> = {
  'phoenix': '33.4484,-112.0740,10',
  'tucson': '32.2226,-110.9747,10',
  'scottsdale': '33.4942,-111.9261,10',
  'los-angeles': '34.1139,-118.4068,10',
  'san-francisco': '37.7749,-122.4194,10',
  'san-diego': '32.7157,-117.1611,10',
  'sacramento': '38.5816,-121.4944,10',
  'san-jose': '37.3382,-121.8863,10',
  'denver': '39.7392,-104.9903,10',
  'miami': '25.7617,-80.1918,10',
  'orlando': '28.5383,-81.3792,10',
  'tampa': '27.9506,-82.4572,10',
  'jacksonville': '30.3322,-81.6557,10',
  'atlanta': '33.7490,-84.3880,10',
  'savannah': '32.0809,-81.0912,10',
  'augusta': '33.4735,-81.9748,10',
  'chicago': '41.8781,-87.6298,10',
  'springfield': '39.7817,-89.6501,10',
  'rockford': '42.2711,-89.0937,10',
  'boston': '42.3601,-71.0589,10',
  'worcester': '42.2626,-71.8023,10',
  'cambridge': '42.3736,-71.1097,10',
  'las-vegas': '36.1699,-115.1398,10',
  'new-york': '40.7128,-74.0060,10',
  'buffalo': '42.8864,-78.8784,10',
  'rochester': '43.1566,-77.6088,10',
  'albany': '42.6526,-73.7562,10',
  'portland': '45.5155,-122.6789,10',
  'philadelphia': '39.9526,-75.1652,10',
  'pittsburgh': '40.4406,-79.9959,10',
  'harrisburg': '40.2732,-76.8867,10',
  'houston': '29.7604,-95.3698,10',
  'dallas': '32.7767,-96.7970,10',
  'austin': '30.2672,-97.7431,10',
  'san-antonio': '29.4241,-98.4936,10',
  'fort-worth': '32.7555,-97.3308,10',
  'seattle': '47.6062,-122.3321,10',
  'spokane': '47.6587,-117.4260,10',
  'tacoma': '47.2529,-122.4443,10',
  'nashville': '36.1627,-86.7816,10',
  'new-orleans': '29.9511,-90.0715,10'
};

function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').trim();
}

function normalizeCategory(category: string): string {
  const mappedCategory = categoryMapping[category.toLowerCase()];
  if (mappedCategory) {
    return mappedCategory;
  }

  const normalizedCategory = normalizeString(category);
  if (!normalizedCategory.includes('wedding')) {
    return `Wedding ${category.charAt(0).toUpperCase() + category.slice(1)}`;
  }

  return category.charAt(0).toUpperCase() + category.slice(1);
}

async function searchGooglePlaces(query: string, city: string, state: string): Promise<any[]> {
  const url = `https://places.googleapis.com/v1/places:searchText`;
  
  // Get coordinates for the city
  const cityKey = normalizeString(city);
  const coordinates = locationCoordinates[cityKey];
  
  if (!coordinates) {
    console.error('No coordinates found for city:', city);
    throw new Error(`Location coordinates not found for ${city}`);
  }

  const [lat, lng, radius] = coordinates.split(',').map(Number);
  
  // Format the query to be more specific for wedding services
  const formattedQuery = `${query} in ${city}, ${state}`;
  console.log('Google Places API Query:', formattedQuery);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY!,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.websiteUri,places.id'
    },
    body: JSON.stringify({
      textQuery: formattedQuery,
      locationBias: {
        circle: {
          center: {
            latitude: lat,
            longitude: lng
          },
          radius: radius * 1000 // Convert to meters
        }
      },
      maxResultCount: 20,
      languageCode: "en"
    })
  });

  if (!response.ok) {
    console.error('Google Places API Error:', await response.text());
    throw new Error('Failed to fetch from Google Places API');
  }

  const data = await response.json();
  console.log('Google Places API Response:', JSON.stringify(data, null, 2));

  if (!data.places || !Array.isArray(data.places)) {
    console.error('No places found in response');
    return [];
  }

  return data.places.map((place: any) => ({
    placeId: place.id,
    name: place.displayName.text,
    address: place.formattedAddress,
    rating: place.rating,
    totalRatings: place.userRatingCount,
    priceLevel: place.priceLevel,
    website: place.websiteUri,
    location: {
      type: 'Point',
      coordinates: [place.location.longitude, place.location.latitude]
    },
    cached: new Date()
  }));
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY not found in environment variables');
    }

    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Get parameters from query string
    const params = event.queryStringParameters || {};
    const { category, city, state } = params;

    if (!category || !city || !state) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Search for places
    const places = await searchGooglePlaces(
      normalizeCategory(category),
      city,
      state
    );

    // Sort results by rating and total ratings
    const sortedResults = places.sort((a: any, b: any) => {
      // Sort by rating first
      if (b.rating !== a.rating) {
        return (b.rating || 0) - (a.rating || 0);
      }
      // If ratings are equal, sort by number of ratings
      return (b.totalRatings || 0) - (a.totalRatings || 0);
    });

    // Take top 10 results
    const topResults = sortedResults.slice(0, 10);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        query: `${category} in ${city}, ${state}`,
        results: topResults,
        lastUpdated: new Date(),
        totalResults: topResults.length
      })
    };
  } catch (error) {
    console.error('Error getting top places:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      })
    };
  }
};
