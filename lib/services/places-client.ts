import { locationCoordinates } from '../locations';

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

export interface Place {
  placeId: string;
  name: string;
  address: string;
  rating: number;
  totalRatings: number;
  priceLevel?: string;
  website?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

export function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').trim();
}

export function normalizeCategory(category: string): string {
  // First check if there's a direct mapping
  const mappedCategory = categoryMapping[category.toLowerCase()];
  if (mappedCategory) {
    return mappedCategory;
  }

  // If no direct mapping, try to construct the category name
  const normalizedCategory = normalizeString(category);
  if (!normalizedCategory.includes('wedding')) {
    return `Wedding ${category.charAt(0).toUpperCase() + category.slice(1)}`;
  }

  return category.charAt(0).toUpperCase() + category.slice(1);
}

export async function searchPlaces(category: string, city: string, state: string): Promise<Place[]> {
  const mappedCategory = normalizeCategory(category);
  const normalizedCity = normalizeString(city);
  
  // Check if the category is valid
  if (!Object.values(categoryMapping).includes(mappedCategory)) {
    console.log('Invalid category:', {
      category: mappedCategory,
      availableCategories: Object.values(categoryMapping)
    });
    throw new Error(`Category ${category} is not valid`);
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const response = await fetch(`${baseUrl}/.netlify/functions/api/places-search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      category: normalizeString(category),
      city: normalizeString(city),
      state: state.toLowerCase()
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch places: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}

export async function getTopPlaces(category: string, city: string, state: string, limit = 10): Promise<Place[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const response = await fetch(`${baseUrl}/.netlify/functions/api/places-top`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      category: normalizeString(category),
      city: normalizeString(city),
      state: state.toLowerCase(),
      limit
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch top places: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}

export function getValidLocations(): {city: string, state: string}[] {
  return Object.keys(locationCoordinates).map(cityKey => {
    const [city, state] = cityKey.split('-');
    return {
      city: city.charAt(0).toUpperCase() + city.slice(1),
      state: state ? state.toUpperCase() : ''
    };
  });
}

export function getValidCategories(): string[] {
  const uniqueCategories = new Set(Object.values(categoryMapping));
  return Array.from(uniqueCategories);
}
