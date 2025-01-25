import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';
import clientPromise from '../mongodb';
import { Place, CachedSearch, initializeCollections } from '../db/schema';
import { locationCoordinates } from '../locations';

let collections: Awaited<ReturnType<typeof initializeCollections>>;

// Initialize collections on first use
async function getCollections() {
  if (!collections) {
    console.log('Initializing MongoDB collections...');
    const client = await clientPromise;
    console.log('Connected to MongoDB');
    collections = await initializeCollections(client);
    console.log('Collections initialized:', Object.keys(collections));
  }
  return collections;
}

const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

interface Location {
  city: string;
  state_id: string;
  state_name: string;
  lat: string;
  lng: string;
  business: string;
  category: string;
}

// Map URL slugs to category names
export const categoryMapping: Record<string, string> = {
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

export class PlacesService {
  private static normalizeString(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').trim();
  }

  private static normalizeCategory(category: string): string {
    // First check if there's a direct mapping
    const mappedCategory = categoryMapping[category.toLowerCase()];
    if (mappedCategory) {
      return mappedCategory;
    }

    // If no direct mapping, try to construct the category name
    const normalizedCategory = this.normalizeString(category);
    if (!normalizedCategory.includes('wedding')) {
      return `Wedding ${category.charAt(0).toUpperCase() + category.slice(1)}`;
    }

    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  public static async searchPlacesAPI(category: string, city: string, state: string): Promise<Place[]> {
    try {
      // Get coordinates from location mapping
      const locationKey = `${city.toLowerCase()}-${state.toLowerCase()}`;
      const coordinates = locationCoordinates[locationKey];
      
      if (!coordinates) {
        throw new Error(`No coordinates found for ${city}, ${state}`);
      }

      // Create Basic Auth header
      if (!process.env.DATAFORSEO_API_LOGIN || !process.env.DATAFORSEO_API_PASSWORD) {
        throw new Error('Missing DataForSEO API credentials - check environment variables');
      }
      const authString = Buffer.from(
        `${process.env.DATAFORSEO_API_LOGIN}:${process.env.DATAFORSEO_API_PASSWORD}`
      ).toString('base64');

      // Create properly formatted request body
      const post_array = [{
        keyword: `Wedding ${category} in ${city}, ${state}`,
        location_code: 2840,
        language_code: 'en',
        device: "desktop",
        os: "windows",
        depth: 10
      }];

      const response = await fetch('https://api.dataforseo.com/v3/serp/google/maps/task_post', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post_array, null, 2)
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorBody}`);
      }

      const { tasks } = await response.json();
      const result = tasks[0].result[0];
      
      return result.items.map((place: any) => ({
        placeId: place.place_id,
        name: place.title,
        address: place.address,
        rating: place.rating,
        totalRatings: place.reviews_count,
        priceLevel: place.price_level,
        website: place.website,
        location: {
          lat: place.gps_coordinates.latitude,
          lng: place.gps_coordinates.longitude
        }
      }));
    } catch (error) {
      console.error('Error fetching places:', error);
      throw error;
    }
  }

  private static async getCachedResults(category: string, city: string, state: string): Promise<CachedSearch | null> {
    try {
      const { cachedSearches } = await getCollections();
      
      const result = await cachedSearches.findOne({
        category: this.normalizeCategory(category),
        city: this.normalizeString(city),
        state: state.toLowerCase()
      });

      if (result && result.lastUpdated > new Date(Date.now() - CACHE_DURATION)) {
        return result;
      }
      return null;
    } catch (error) {
      console.error('Failed to get cached results:', error);
      return null;
    }
  }

  private static async cacheResults(places: Place[], category: string, city: string, state: string) {
    try {
      const { cachedSearches, places: placesCollection } = await getCollections();
      
      // Insert individual places
      if (places.length > 0) {
        await placesCollection.bulkWrite(
          places.map(place => ({
            updateOne: {
              filter: { placeId: place.placeId },
              update: { $set: { ...place, cached: new Date() } },
              upsert: true
            }
          }))
        );
      }

      // Cache the search results
      await cachedSearches.updateOne(
        {
          category: this.normalizeCategory(category),
          city: this.normalizeString(city),
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
      console.error('Failed to cache results:', error);
    }
  }

  static async searchPlaces(category: string, city: string, state: string): Promise<Place[]> {
    const mappedCategory = this.normalizeCategory(category);
    const normalizedCity = this.normalizeString(city);
    
    console.log('Searching for:', {
      category,
      mappedCategory,
      city: normalizedCity,
      state: state.toLowerCase()
    });
    
    // Check if the city is supported
    if (!locationCoordinates[normalizedCity]) {
      console.log('City not supported:', normalizedCity);
      throw new Error(`City ${city} is not currently supported`);
    }

    // Check if the category is valid
    if (!Object.values(categoryMapping).includes(mappedCategory)) {
      console.log('Invalid category:', {
        category: mappedCategory,
        availableCategories: Object.values(categoryMapping)
      });
      throw new Error(`Category ${category} is not valid`);
    }

    try {
      // Check cache first
      const cachedResults = await this.getCachedResults(category, city, state);
      if (cachedResults) {
        console.log('Returning cached results');
        return cachedResults.results;
      }
    } catch (error) {
      console.error('Cache lookup failed:', error);
      // Continue with fresh search
    }

    // If not in cache or cache failed, fetch from API
    console.log('Fetching from API for:', mappedCategory);
    const places = await this.searchPlacesAPI(
      mappedCategory,
      city,
      state
    );

    // Try to cache the results, but don't fail if caching fails
    try {
      console.log('Caching results');
      await this.cacheResults(places, category, city, state);
    } catch (error) {
      console.error('Failed to cache results:', error);
      // Continue without caching
    }

    return places;
  }

  static async getTopPlaces(category: string, city: string, state: string, limit = 10): Promise<Place[]> {
    const places = await this.searchPlaces(category, city, state);
    return places
      .sort((a, b) => {
        // Sort by rating first
        if (b.rating !== a.rating) {
          return (b.rating || 0) - (a.rating || 0);
        }
        // If ratings are equal, sort by number of ratings
        return (b.totalRatings || 0) - (a.totalRatings || 0);
      })
      .slice(0, limit);
  }

  static async getValidLocations(): Promise<{city: string, state: string, state_name: string, category: string}[]> {
    // Get all supported cities from locationCoordinates
    const cities = Object.keys(locationCoordinates).map(cityKey => {
      const [city, state] = cityKey.split('-');
      return {
        city: city.charAt(0).toUpperCase() + city.slice(1),
        state: state ? state.toUpperCase() : '',
        state_name: '', // Would need a mapping for full state names
        category: '' // Categories are handled separately
      };
    });

    return cities;
  }

  static async getValidCategories(): Promise<string[]> {
    const uniqueCategories = new Set(Object.values(categoryMapping));
    return Array.from(uniqueCategories);
  }
}
