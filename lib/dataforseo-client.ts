import axios from 'axios';
import { unstable_cache } from 'next/cache';
import { locationCodes } from './locations';

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
    locationName,
    languageCode = 'en',
    limit = 20,
    minRating = 4 
  }: SearchParams): Promise<SearchResponse> => {
    try {
      // Convert location name to code
      console.log('Original location name:', locationName);
      const locationSlug = locationName?.toLowerCase().replace(/\s+/g, '-');
      console.log('Converted to slug:', locationSlug);
      console.log('Available location codes:', Object.keys(locationCodes));
      const locationCode = locationSlug ? locationCodes[locationSlug] : undefined;
      console.log('Found location code:', locationCode);

      if (!locationCode) {
        console.warn(`No location code found for: ${locationName} (slug: ${locationSlug})`);
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

      console.log('Searching with params:', { keyword, locationName, locationCode, limit });
      
      const instance = axios.create({
        timeout: 60000, // Increased to 60 second timeout
        headers: {
          'content-type': 'application/json'
        }
      });

      const requestData = [{
        keyword,
        language_code: languageCode,
        location_code: locationCode,
        limit: limit,
        filters: [
          ["rating.value", ">", minRating]
        ]
      }];

      console.log('Request data:', JSON.stringify(requestData, null, 2));

      try {
        const response = await instance({
          method: 'post',
          url: 'https://api.dataforseo.com/v3/serp/google/maps/live/advanced',
          auth: {
            username: DATAFORSEO_USERNAME,
            password: DATAFORSEO_PASSWORD
          },
          data: requestData
        });

        console.log('API Response Status:', response.status);
        console.log('API Response Data:', JSON.stringify(response.data, null, 2));

        if (response.data?.status_code !== 20000) {
          console.error('API Error:', response.data?.status_message);
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

        const task = response.data?.tasks?.[0];
        
        if (!task) {
          console.error('No task data in response');
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

        if (task.status_code !== 20000) {
          console.error('Task Error:', task.status_message);
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

        const result = task.result?.[0];
        
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

      } catch (apiError) {
        console.error('API request failed:', apiError);
        if (axios.isAxiosError(apiError)) {
          console.error('API Error Details:', {
            status: apiError.response?.status,
            data: apiError.response?.data,
            message: apiError.message
          });
        }
        throw apiError;
      }

    } catch (error) {
      console.error('Error in searchBusinesses:', error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          console.error('Request timed out');
        }
        if (error.response) {
          console.error('Error Response:', error.response.data);
        }
      }
      throw error; // Let the error boundary handle it
    }
  },
  ['business-search'],
  {
    revalidate: 86400 // Cache for 24 hours
  }
);
