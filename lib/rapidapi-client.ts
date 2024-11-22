import axios from 'axios';

const RAPIDAPI_KEY = 'a10d6ce342mshebe3660d6f26f76p15bf55jsna1ad871ba1f5';
const RAPIDAPI_HOST = 'local-business-data.p.rapidapi.com';

// Expanded list of city coordinates
const cityCoordinates: Record<string, { lat: string; lng: string }> = {
  'san-francisco': { lat: '37.7749', lng: '-122.4194' },
  'new-york': { lat: '40.7128', lng: '-74.0060' },
  'los-angeles': { lat: '34.0522', lng: '-118.2437' },
  'chicago': { lat: '41.8781', lng: '-87.6298' },
  'houston': { lat: '29.7604', lng: '-95.3698' },
  'phoenix': { lat: '33.4484', lng: '-112.0740' },
  'philadelphia': { lat: '39.9526', lng: '-75.1652' },
  'san-antonio': { lat: '29.4241', lng: '-98.4936' },
  'san-diego': { lat: '32.7157', lng: '-117.1611' },
  'dallas': { lat: '32.7767', lng: '-96.7970' },
  'austin': { lat: '30.2672', lng: '-97.7431' },
  'seattle': { lat: '47.6062', lng: '-122.3321' },
  'denver': { lat: '39.7392', lng: '-104.9903' },
  'boston': { lat: '42.3601', lng: '-71.0589' },
  'miami': { lat: '25.7617', lng: '-80.1918' },
  'atlanta': { lat: '33.7490', lng: '-84.3880' },
  'las-vegas': { lat: '36.1699', lng: '-115.1398' },
  'portland': { lat: '45.5155', lng: '-122.6789' },
  'nashville': { lat: '36.1627', lng: '-86.7816' },
  'new-orleans': { lat: '29.9511', lng: '-90.0715' }
};

export interface BusinessSearchParams {
  query: string;
  citySlug: string;
  page?: number;
  limit?: number;
}

function normalizeCitySlug(citySlug: string): string {
  // First decode any URL encoding
  const decoded = decodeURIComponent(citySlug);
  // Replace spaces with hyphens and convert to lowercase
  return decoded.replace(/\s+/g, '-').toLowerCase();
}

async function getCityCoordinates(citySlug: string) {
  const normalizedSlug = normalizeCitySlug(citySlug);
  console.log('Looking up coordinates for:', normalizedSlug);
  
  if (cityCoordinates[normalizedSlug]) {
    return cityCoordinates[normalizedSlug];
  }
  
  console.warn(`No coordinates found for city: ${normalizedSlug}`);
  // Default to Los Angeles if no coordinates found
  return cityCoordinates['los-angeles'];
}

export async function searchBusinesses({ query, citySlug, page = 1, limit = 100 }: BusinessSearchParams) {
  const coordinates = await getCityCoordinates(citySlug);
  console.log('Using coordinates:', coordinates, 'for city:', citySlug);

  const options = {
    method: 'GET',
    url: 'https://local-business-data.p.rapidapi.com/search',
    params: {
      query,
      lat: coordinates.lat,
      lng: coordinates.lng,
      limit: limit.toString(),
      zoom: '13',
      language: 'en',
      region: 'us',
      extract_emails_and_contacts: 'false',
      photos: 'true', // Enable photos in the response
      max_photos: '1' // Request only 1 photo per business
    },
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST
    }
  };

  try {
    console.log('Making API request with params:', options.params);
    const response = await axios.request(options);
    
    if (!response.data || !response.data.data || response.data.data.length === 0) {
      console.warn(`No results found for query: ${query} in city: ${citySlug}`);
      console.log('API Response:', response.data);
    } else {
      console.log(`Found ${response.data.data.length} results`);
    }
    
    const totalResults = response.data?.data?.length || 0;
    const totalPages = Math.ceil(totalResults / limit);
    const currentPage = page;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      ...response.data,
      pagination: {
        totalResults,
        totalPages,
        currentPage,
        limit
      },
      data: response.data?.data?.slice(startIndex, endIndex) || []
    };
  } catch (error) {
    console.error('Error fetching business data:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Response:', error.response?.data);
    }
    return {
      data: [],
      pagination: {
        totalResults: 0,
        totalPages: 0,
        currentPage: page,
        limit
      }
    };
  }
}
