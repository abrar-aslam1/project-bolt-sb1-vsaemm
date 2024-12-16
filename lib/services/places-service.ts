import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';
import clientPromise from '../mongodb';
import { Place, CachedSearch } from '../models/place';
import { locationCoordinates } from '../locations';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
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

// Map URL slugs to CSV category names
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

  private static async getLocations(): Promise<Location[]> {
    const csvPath = path.join(process.cwd(), 'locations.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    return parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });
  }

  private static async searchGooglePlaces(query: string, city: string, state: string): Promise<Place[]> {
    const url = `https://places.googleapis.com/v1/places:searchText`;
    
    // Get coordinates for the city
    const cityKey = this.normalizeString(`${city}`);
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
        'X-Goog-FieldMask': [
          'places.id',
          'places.displayName',
          'places.formattedAddress',
          'places.rating',
          'places.userRatingCount',
          'places.priceLevel',
          'places.websiteUri',
          'places.location'
        ].join(',')
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
      }
    }));
  }

  private static async getCachedResults(category: string, city: string, state: string): Promise<CachedSearch | null> {
    try {
      const client = await clientPromise;
      const db = client.db('wedding_directory');
      const collection = db.collection('cached_searches');

      const result = await collection.findOne({
        category: this.normalizeCategory(category),
        city: this.normalizeString(city),
        state: state.toLowerCase(),
        lastUpdated: { $gt: new Date(Date.now() - CACHE_DURATION) }
      });

      if (result) {
        // Remove MongoDB-specific fields
        const { _id, ...rest } = result;
        return rest as CachedSearch;
      }
    } catch (error) {
      console.error('Failed to get cached results:', error);
      // Return null to proceed with fresh search
    }

    return null;
  }

  private static async cacheResults(places: Place[], category: string, city: string, state: string) {
    try {
      const client = await clientPromise;
      const db = client.db('wedding_directory');
      const collection = db.collection('cached_searches');
      const placesCollection = db.collection('places');

      // Insert individual places
      if (places.length > 0) {
        await placesCollection.insertMany(
          places.map(place => ({ ...place, cached: new Date() })),
          { ordered: false }
        ).catch(err => {
          console.log('Some places already exist in the database');
        });
      }

      // Cache the search results
      await collection.updateOne(
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
      // Continue without caching
    }
  }

  static async searchPlaces(category: string, city: string, state: string): Promise<Place[]> {
    // Check if this is a valid location from our CSV
    const locations = await this.getLocations();
    const mappedCategory = this.normalizeCategory(category);
    
    console.log('Searching for:', {
      category,
      mappedCategory,
      city: this.normalizeString(city),
      state: state.toLowerCase()
    });
    
    // First check if the city exists in our supported locations
    const cityLocation = locations.find(
      loc => 
        this.normalizeString(loc.city) === this.normalizeString(city) && 
        loc.state_id.toLowerCase() === state.toLowerCase()
    );

    if (!cityLocation) {
      console.log('City not found:', {
        city: this.normalizeString(city),
        state: state.toLowerCase()
      });
      throw new Error('City not found in our directory');
    }

    // Check if the category is valid
    const validCategories = [...new Set(locations.map(l => l.category))];
    if (!validCategories.includes(mappedCategory)) {
      console.log('Invalid category:', {
        category: mappedCategory,
        availableCategories: validCategories
      });
      throw new Error('Invalid category');
    }

    try {
      // Check cache first
      const cachedResults = await this.getCachedResults(category, city, state);
      if (cachedResults) {
        console.log('Returning cached results');
        return cachedResults.results.map(place => {
          // Remove MongoDB-specific fields
          const { _id, ...rest } = place as any;
          return rest;
        });
      }
    } catch (error) {
      console.error('Cache lookup failed:', error);
      // Continue with fresh search
    }

    // If not in cache or cache failed, fetch from Google Places API
    console.log('Fetching from Google Places API for:', mappedCategory);
    const places = await this.searchGooglePlaces(
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
    const locations = await this.getLocations();
    return locations.map(loc => ({
      city: loc.city,
      state: loc.state_id,
      state_name: loc.state_name,
      category: loc.category
    }));
  }

  static async getValidCategories(): Promise<string[]> {
    const locations = await this.getLocations();
    const categories = new Set(locations.map(loc => loc.category));
    return Array.from(categories);
  }
}
