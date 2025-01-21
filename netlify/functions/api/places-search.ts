import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { db } from '../../../lib/db';
import { Place } from '../../../lib/db/schema';
import path from 'path';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY environment variable is required');
}
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Location coordinates for Google Places API
const locationCoordinates: Record<string, string> = {
  // ... (same location coordinates as before)
};

function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').trim();
}

async function searchGooglePlaces(query: string, city: string, state: string): Promise<Place[]> {
  const location = locationCoordinates[`${city},${state}`];
  if (!location) {
    throw new Error(`Location not found for ${city}, ${state}`);
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', `${query} in ${city}, ${state}`);
  url.searchParams.set('key', GOOGLE_API_KEY as string);
  url.searchParams.set('location', location);
  url.searchParams.set('radius', '5000');
  url.searchParams.set('type', 'establishment');

  const response = await fetch(url.toString());
  const data = await response.json();

  if (data.status !== 'OK') {
    throw new Error(`Google Places API error: ${data.status}`);
  }

  return data.results.map((result: any) => ({
    placeId: result.place_id,
    name: result.name,
    address: result.formatted_address,
    rating: result.rating,
    totalRatings: result.user_ratings_total,
    priceLevel: result.price_level,
    website: result.website,
    location: {
      type: 'Point',
      coordinates: [result.geometry.location.lng, result.geometry.location.lat]
    },
    cached: new Date()
  }));
  // ... (same Google Places API implementation as before)
}

async function getCachedResults(category: string, city: string, state: string): Promise<any | null> {
  try {
    const normalizedCity = normalizeString(city);
    const normalizedState = state.toLowerCase();
    
    const result = await db.get(
      `SELECT * FROM cached_searches 
       WHERE category = ? AND city = ? AND state = ? 
       AND lastUpdated > ?`,
      [category, normalizedCity, normalizedState, Date.now() - CACHE_DURATION]
    );
    
    return result || null;
  } catch (error) {
    console.error('Error getting cached results:', error);
    return null;
  }
}

async function cacheResults(places: any[], category: string, city: string, state: string) {
  try {
    const normalizedCity = normalizeString(city);
    const normalizedState = state.toLowerCase();
    
    // Insert places
    await db.run('BEGIN TRANSACTION');
    
    for (const place of places) {
      await db.run(
        `INSERT OR IGNORE INTO places 
         (placeId, name, address, rating, totalRatings, priceLevel, website, location, cached)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          place.placeId,
          place.name,
          place.address,
          place.rating,
          place.totalRatings,
          place.priceLevel,
          place.website,
          JSON.stringify(place.location),
          place.cached.toISOString()
        ]
      );
    }
    
    // Cache the search results
    await db.run(
      `INSERT OR REPLACE INTO cached_searches
       (category, city, state, query, results, lastUpdated, totalResults)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        category,
        normalizedCity,
        normalizedState,
        `${category} in ${city}, ${state}`,
        JSON.stringify(places),
        new Date().toISOString(),
        places.length
      ]
    );
    
    await db.run('COMMIT');
  } catch (error) {
    await db.run('ROLLBACK');
    console.error('Error caching results:', error);
  }
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    const { query, city, state } = event.queryStringParameters || {};
    
    if (!query || !city || !state) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters: query, city, state' })
      };
    }

    // Check for cached results first
    const cached = await getCachedResults(query, city, state);
    if (cached) {
      return {
        statusCode: 200,
        body: JSON.stringify(cached.results)
      };
    }

    // Fetch new results from Google Places API
    const places = await searchGooglePlaces(query, city, state);
    
    // Cache the new results
    await cacheResults(places, query, city, state);

    return {
      statusCode: 200,
      body: JSON.stringify(places)
    };
  } catch (error) {
    console.error('Error in places search:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' })
    };
  }
  // ... (same handler implementation as before)
};
