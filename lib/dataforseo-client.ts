import axios from 'axios';
import { unstable_cache } from 'next/cache';

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
  price_level?: string;
  address_info?: AddressInfo;
  main_image?: string;
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

// Cache search results for 24 hours
export const searchBusinesses = unstable_cache(
  async ({ 
    keyword, 
    locationName = "New York, New York, United States",
    locationCode = 1023191, 
    languageCode = 'en',
    limit = 20,
    minRating = 4 
  }: SearchParams): Promise<SearchResponse> => {
    try {
      console.log('Searching with params:', { keyword, locationName, locationCode, limit });
      
      const instance = axios.create({
        timeout: 30000, // 30 second timeout
        headers: {
          'content-type': 'application/json'
        }
      });

      const requestData = [{
        keyword: `${keyword} ${locationName}`,
        language_code: languageCode,
        location_code: locationCode,
        limit: limit,
        filters: [
          ["rating.value", ">", minRating]
        ]
      }];

      console.log('Request data:', JSON.stringify(requestData, null, 2));

      const response = await instance({
        method: 'post',
        url: 'https://api.dataforseo.com/v3/serp/google/maps/live/advanced',
        auth: {
          username: DATAFORSEO_USERNAME,
          password: DATAFORSEO_PASSWORD
        },
        data: requestData
      });

      console.log('API Response Status:', response.data?.status_code, response.data?.status_message);
      
      const result = response.data?.tasks?.[0]?.result?.[0];
      
      if (!result || !result.items) {
        console.warn('No results found for:', keyword, 'in', locationName);
        console.log('API Response:', JSON.stringify(response.data, null, 2));
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

      console.log('Found items:', result.items.length);

      const vendors: VendorResult[] = result.items.map((item: any) => ({
        name: item.title || '',
        category: item.category,
        address: item.address || '',
        phone_number: item.phone,
        website: item.url,
        rating: item.rating,
        latitude: item.latitude || 0,
        longitude: item.longitude || 0,
        photos: [item.main_image].filter(Boolean) as string[],
        business_id: item.place_id || String(item.cid || ''),
        description: item.snippet,
        price_level: item.price_level,
        address_info: item.address_info,
        main_image: item.main_image
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
        if (error.code === 'ECONNABORTED') {
          console.error('Request timed out');
        }
        console.error('API Response:', error.response?.data);
      }
      throw error; // Let the error boundary handle it
    }
  },
  ['business-search'],
  {
    revalidate: 86400 // Cache for 24 hours
  }
);
