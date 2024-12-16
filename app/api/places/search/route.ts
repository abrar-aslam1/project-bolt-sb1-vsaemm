import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Place, CachedSearch } from '@/lib/models/place';
import { locationCoordinates } from '@/lib/locations';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Map URL slugs to category names
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

async function searchGooglePlaces(query: string, city: string, state: string): Promise<Place[]> {
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

async function getCachedResults(category: string, city: string, state: string): Promise<CachedSearch | null> {
  const client = await clientPromise;
  const db = client.db('wedding_directory');
  const collection = db.collection('cached_searches');

  return await collection.findOne({
    category: normalizeCategory(category),
    city: normalizeString(city),
    state: state.toLowerCase(),
    lastUpdated: { $gt: new Date(Date.now() - CACHE_DURATION) }
  }) as CachedSearch | null;
}

async function cacheResults(places: Place[], category: string, city: string, state: string) {
  const client = await clientPromise;
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
      category: normalizeCategory(category),
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
}

export async function POST(request: Request) {
  try {
    const { category, city, state } = await request.json();

    if (!category || !city || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Searching for:', {
      category,
      normalizedCategory: normalizeCategory(category),
      city: normalizeString(city),
      state: state.toLowerCase()
    });

    // Check cache first
    const cachedResults = await getCachedResults(category, city, state);
    if (cachedResults) {
      console.log('Returning cached results');
      return NextResponse.json(cachedResults);
    }

    // If not in cache, fetch from Google Places API
    console.log('Fetching from Google Places API');
    const places = await searchGooglePlaces(
      normalizeCategory(category),
      city,
      state
    );

    // Cache the results
    console.log('Caching results');
    await cacheResults(places, category, city, state);

    return NextResponse.json({
      query: `${category} in ${city}, ${state}`,
      results: places,
      lastUpdated: new Date(),
      totalResults: places.length
    });
  } catch (error) {
    console.error('Error searching places:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
