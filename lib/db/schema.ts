import { MongoClient } from 'mongodb';

// MongoDB Schema Definitions
export interface Place {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  totalRatings?: number;
  priceLevel?: string;
  website?: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  cached?: Date;
}

export interface CachedSearch {
  category: string;
  city: string;
  state: string;
  query: string;
  results: Place[];
  lastUpdated: Date;
  totalResults: number;
}

// Initialize MongoDB Collections
export async function initializeCollections(client: MongoClient) {
  const db = client.db('wedding_directory');
  
  // Create places collection with geospatial index
  await db.collection('places').createIndex({ location: '2dsphere' });
  
  // Create cached_searches collection with TTL index
  await db.collection('cached_searches').createIndex(
    { lastUpdated: 1 },
    { expireAfterSeconds: 30 * 24 * 60 * 60 } // 30 days
  );
  
  return {
    places: db.collection<Place>('places'),
    cachedSearches: db.collection<CachedSearch>('cached_searches')
  };
}
