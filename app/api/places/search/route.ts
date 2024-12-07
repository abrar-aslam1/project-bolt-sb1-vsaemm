import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Place, CachedSearch } from '@/lib/models/place';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

async function searchGooglePlaces(query: string): Promise<Place[]> {
  const url = `https://places.googleapis.com/v1/places:searchText`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY!,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.websiteUri,places.id'
    },
    body: JSON.stringify({
      textQuery: query,
      maxResultCount: 20
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch from Google Places API');
  }

  const data = await response.json();
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
    category: category.toLowerCase(),
    city: city.toLowerCase(),
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
  await placesCollection.insertMany(places, { ordered: false });

  // Cache the search results
  await collection.updateOne(
    {
      category: category.toLowerCase(),
      city: city.toLowerCase(),
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

    // Check cache first
    const cachedResults = await getCachedResults(category, city, state);
    if (cachedResults) {
      return NextResponse.json(cachedResults);
    }

    // If not in cache, fetch from Google Places API
    const query = `${category} in ${city}, ${state}`;
    const places = await searchGooglePlaces(query);

    // Cache the results
    await cacheResults(places, category, city, state);

    return NextResponse.json({
      query,
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
