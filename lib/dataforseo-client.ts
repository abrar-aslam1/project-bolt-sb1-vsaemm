import axios from 'axios';
import { unstable_cache } from 'next/cache';
import path from 'path';
import { promises as fs } from 'fs';

const DATAFORSEO_USERNAME = 'abrar@amarosystems.com';
const DATAFORSEO_PASSWORD = '69084d8c8dcf81cd';

interface SearchParams {
  keyword: string;
  locationName?: string;
  locationCode?: number;
  languageCode?: string;
  limit?: number;
  minRating?: number;
}

interface WorkHours {
  open: { hour: number; minute: number };
  close: { hour: number; minute: number };
}

interface BusinessHours {
  timetable: Record<string, WorkHours[]>;
  current_status: string;
}

interface Rating {
  value: number;
  votes_count: number;
}

interface AddressInfo {
  borough?: string;
  address: string;
  city: string;
  zip: string;
  region: string;
  country_code: string;
}

interface VendorResult {
  name: string;
  category?: string;
  address: string;
  phone_number?: string;
  website?: string;
  rating?: Rating;
  latitude: number;
  longitude: number;
  photos?: string[];
  business_id: string;
  description?: string;
  hours?: BusinessHours;
  attributes?: {
    available_attributes?: Record<string, string[]>;
    unavailable_attributes?: Record<string, string[]>;
  };
  price_level?: string;
  is_claimed?: boolean;
  address_info?: AddressInfo;
  main_image?: string;
  additional_categories?: string[];
  reviews?: Array<{
    rating: number;
    text: string;
    author: string;
    date: string;
  }>;
}

interface SearchResponse {
  data: VendorResult[];
  pagination: {
    totalResults: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

interface MapSearchItem {
  title: string;
  category?: string;
  address: string;
  phone?: string;
  url?: string;
  rating?: Rating;
  latitude: number;
  longitude: number;
  main_image?: string;
  place_id: string;
  cid?: string;
  snippet?: string;
  work_hours?: BusinessHours;
  address_info?: AddressInfo;
  additional_categories?: string[];
  is_claimed?: boolean;
}

interface LocationInfo {
  city: string;
  state: string;
  lat: string;
  lng: string;
}

// Cache location data for better performance
const getLocationInfo = async (locationName: string): Promise<LocationInfo | null> => {
  try {
    const filePath = path.join(process.cwd(), 'locations.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const rows = fileContent.split('\n').slice(1); // Skip header

    // Try to find exact state match first
    const stateRow = rows.find(row => {
      const columns = row.split(',');
      const stateName = columns[3]?.replace(/"/g, '');
      return stateName.toLowerCase() === locationName.toLowerCase();
    });

    if (stateRow) {
      const columns = stateRow.split(',');
      return {
        city: columns[0].replace(/"/g, ''),
        state: columns[3].replace(/"/g, ''),
        lat: columns[6].replace(/"/g, ''),
        lng: columns[7].replace(/"/g, '')
      };
    }

    // If no state match, try city match
    const cityRow = rows.find(row => {
      const columns = row.split(',');
      const city = columns[0]?.replace(/"/g, '');
      return city.toLowerCase() === locationName.toLowerCase();
    });

    if (cityRow) {
      const columns = cityRow.split(',');
      return {
        city: columns[0].replace(/"/g, ''),
        state: columns[3].replace(/"/g, ''),
        lat: columns[6].replace(/"/g, ''),
        lng: columns[7].replace(/"/g, '')
      };
    }

    return null;
  } catch (error) {
    console.error('Error reading locations:', error);
    return null;
  }
};

// Cache search results for 24 hours
export const searchBusinesses = unstable_cache(
  async ({ 
    keyword, 
    locationName = "New York, New York, United States",
    locationCode = 1023191, 
    languageCode = 'en',
    limit = 100,
    minRating = 4 
  }: SearchParams): Promise<SearchResponse> => {
    try {
      // Get location coordinates
      const locationInfo = await getLocationInfo(locationName.split(',')[0]);
      const coordinates = locationInfo 
        ? `${locationInfo.lat},${locationInfo.lng}`
        : "40.7128,-74.0060"; // Default to New York
      
      const response = await axios({
        method: 'post',
        url: 'https://api.dataforseo.com/v3/serp/google/maps/live/advanced',
        auth: {
          username: DATAFORSEO_USERNAME,
          password: DATAFORSEO_PASSWORD
        },
        data: [{
          keyword: `${keyword} in ${locationName}`,
          language_code: languageCode,
          coordinates: coordinates,
          radius: 100000, // 100km radius for better coverage
          limit: limit,
          filters: [
            ["rating", ">", minRating],
            ["reviews_count", ">", 10]
          ],
          sort_by: "rating.desc"
        }],
        headers: {
          'content-type': 'application/json'
        }
      });

      const result = response.data?.tasks?.[0]?.result?.[0];
      
      if (!result || !result.items) {
        console.warn('No results found for:', keyword, 'in', locationName);
        return {
          data: [],
          pagination: {
            totalResults: 0,
            totalPages: 0,
            currentPage: 1,
            limit
          }
        };
      }

      const vendors: VendorResult[] = (result.items as MapSearchItem[]).map(item => ({
        name: item.title,
        category: item.category,
        address: item.address,
        phone_number: item.phone,
        website: item.url,
        rating: item.rating,
        latitude: item.latitude,
        longitude: item.longitude,
        photos: [item.main_image].filter(Boolean) as string[],
        business_id: item.place_id || String(item.cid),
        description: item.snippet,
        hours: item.work_hours,
        address_info: item.address_info,
        main_image: item.main_image,
        additional_categories: item.additional_categories,
        is_claimed: item.is_claimed
      }));

      const totalResults = result.total_count || vendors.length;
      const totalPages = Math.ceil(totalResults / limit);

      return {
        data: vendors,
        pagination: {
          totalResults,
          totalPages,
          currentPage: 1,
          limit
        }
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
          currentPage: 1,
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
