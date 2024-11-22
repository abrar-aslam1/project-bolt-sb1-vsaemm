import axios from 'axios';
import { unstable_cache } from 'next/cache';

const RAPIDAPI_KEY = 'a10d6ce342mshebe3660d6f26f76p15bf55jsna1ad871ba1f5';
const RAPIDAPI_HOST = 'local-business-data.p.rapidapi.com';

// Expanded list of city coordinates by state
const cityCoordinates: Record<string, { lat: string; lng: string }> = {
  // California
  'los-angeles': { lat: '34.0522', lng: '-118.2437' },
  'san-francisco': { lat: '37.7749', lng: '-122.4194' },
  'san-diego': { lat: '32.7157', lng: '-117.1611' },
  'sacramento': { lat: '38.5816', lng: '-121.4944' },
  'san-jose': { lat: '37.3382', lng: '-121.8863' },
  
  // New York
  'new-york': { lat: '40.7128', lng: '-74.0060' },
  'buffalo': { lat: '42.8864', lng: '-78.8784' },
  'rochester': { lat: '43.1566', lng: '-77.6088' },
  'albany': { lat: '42.6526', lng: '-73.7562' },
  
  // Texas
  'houston': { lat: '29.7604', lng: '-95.3698' },
  'dallas': { lat: '32.7767', lng: '-96.7970' },
  'austin': { lat: '30.2672', lng: '-97.7431' },
  'san-antonio': { lat: '29.4241', lng: '-98.4936' },
  'fort-worth': { lat: '32.7555', lng: '-97.3308' },
  
  // Florida
  'miami': { lat: '25.7617', lng: '-80.1918' },
  'orlando': { lat: '28.5383', lng: '-81.3792' },
  'tampa': { lat: '27.9506', lng: '-82.4572' },
  'jacksonville': { lat: '30.3322', lng: '-81.6557' },
  
  // Illinois
  'chicago': { lat: '41.8781', lng: '-87.6298' },
  'springfield': { lat: '39.7817', lng: '-89.6501' },
  'rockford': { lat: '42.2711', lng: '-89.0937' },
  
  // Pennsylvania
  'philadelphia': { lat: '39.9526', lng: '-75.1652' },
  'pittsburgh': { lat: '40.4406', lng: '-79.9959' },
  'harrisburg': { lat: '40.2732', lng: '-76.8867' },
  
  // Arizona
  'phoenix': { lat: '33.4484', lng: '-112.0740' },
  'tucson': { lat: '32.2226', lng: '-110.9747' },
  'scottsdale': { lat: '33.4942', lng: '-111.9261' },
  
  // Georgia
  'atlanta': { lat: '33.7490', lng: '-84.3880' },
  'savannah': { lat: '32.0809', lng: '-81.0912' },
  'augusta': { lat: '33.4735', lng: '-82.0105' },
  
  // Washington
  'seattle': { lat: '47.6062', lng: '-122.3321' },
  'spokane': { lat: '47.6588', lng: '-117.4260' },
  'tacoma': { lat: '47.2529', lng: '-122.4443' },
  
  // Massachusetts
  'boston': { lat: '42.3601', lng: '-71.0589' },
  'worcester': { lat: '42.2626', lng: '-71.8023' },
  'cambridge': { lat: '42.3736', lng: '-71.1097' },
  
  // Other Major Cities
  'las-vegas': { lat: '36.1699', lng: '-115.1398' },
  'portland': { lat: '45.5155', lng: '-122.6789' },
  'nashville': { lat: '36.1627', lng: '-86.7816' },
  'new-orleans': { lat: '29.9511', lng: '-90.0715' },
  'denver': { lat: '39.7392', lng: '-104.9903' }
};

// Group cities by state for better organization
export const citiesByState: Record<string, string[]> = {
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'],
  'New York': ['New York', 'Buffalo', 'Rochester', 'Albany'],
  'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
  'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
  'Illinois': ['Chicago', 'Springfield', 'Rockford'],
  'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Harrisburg'],
  'Arizona': ['Phoenix', 'Tucson', 'Scottsdale'],
  'Georgia': ['Atlanta', 'Savannah', 'Augusta'],
  'Washington': ['Seattle', 'Spokane', 'Tacoma'],
  'Massachusetts': ['Boston', 'Worcester', 'Cambridge'],
  'Nevada': ['Las Vegas'],
  'Oregon': ['Portland'],
  'Tennessee': ['Nashville'],
  'Louisiana': ['New Orleans'],
  'Colorado': ['Denver']
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
  
  if (cityCoordinates[normalizedSlug]) {
    return cityCoordinates[normalizedSlug];
  }
  
  console.warn(`No coordinates found for city: ${normalizedSlug}`);
  return { lat: '', lng: '' };
}

// Cache the search results for 24 hours
const cachedSearchBusinesses = unstable_cache(
  async ({ query, citySlug, page = 1, limit = 100 }: BusinessSearchParams) => {
    const coordinates = await getCityCoordinates(citySlug);

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
        photos: 'true',
        max_photos: '1'
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
  },
  ['business-search'],
  {
    revalidate: 86400 // Cache for 24 hours
  }
);

export const searchBusinesses = cachedSearchBusinesses;
