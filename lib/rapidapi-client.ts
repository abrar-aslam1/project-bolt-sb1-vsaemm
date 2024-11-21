interface VendorSearchParams {
  category?: string;
  location?: string;
  limit?: number;
  lat?: number;
  lng?: number;
  zoom?: number;
  language?: string;
  region?: string;
}

const RAPIDAPI_KEY = 'a10d6ce342mshebe3660d6f26f76p15bf55jsna1ad871ba1f5';
const RAPIDAPI_HOST = 'local-business-data.p.rapidapi.com';
const BASE_URL = 'https://local-business-data.p.rapidapi.com';

export async function searchVendors({
  category = 'Wedding Planners',
  location = 'San Francisco, USA',
  limit = 20,
  lat = 37.359428,
  lng = -121.925337,
  zoom = 13,
  language = 'en',
  region = 'us'
}: VendorSearchParams = {}) {
  try {
    const query = `${category} in ${location}`;
    const params = new URLSearchParams({
      query,
      limit: limit.toString(),
      lat: lat.toString(),
      lng: lng.toString(),
      zoom: zoom.toString(),
      language,
      region,
      extract_emails_and_contacts: 'false'
    });

    const response = await fetch(`${BASE_URL}/search?${params}`, {
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error searching vendors:', error);
    throw error;
  }
}

// Example usage:
// searchVendors({ category: 'Wedding Planners', location: 'Los Angeles, USA' });
// searchVendors({ category: 'Photographers', location: 'New York, USA' });
// searchVendors({ category: 'Venues', location: 'Miami, USA' });
