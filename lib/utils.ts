import { citiesByState } from './locations';
import { categoryMapping } from './services/places-client';

interface ParsedSearch {
  category?: string;
  city?: string;
  state?: string;
}

export function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').trim();
}

export function parseSearchQuery(query: string): ParsedSearch {
  const words = query.toLowerCase().split(/\s+/);
  const result: ParsedSearch = {};

  // Check for category matches
  for (const [key, value] of Object.entries(categoryMapping)) {
    if (words.some(word => 
      normalizeString(key).includes(word) || 
      normalizeString(value).includes(word)
    )) {
      result.category = key;
      break;
    }
  }

  // Check for city and state matches
  for (const [state, cities] of Object.entries(citiesByState)) {
    // Check if any word matches the state
    if (words.some(word => state.toLowerCase().includes(word))) {
      result.state = state;
    }

    // Check if any word matches a city in this state
    const matchedCity = cities.find(city => 
      words.some(word => city.toLowerCase().includes(word))
    );
    if (matchedCity) {
      result.city = matchedCity;
      result.state = state; // Set state when we find a matching city
    }
  }

  return result;
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}
