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

interface VendorResult {
  name: string;
  category?: string;
  address: string;
  phone_number?: string;
  website?: string;
  rating?: number;
  latitude: number;
  longitude: number;
  photos?: string[];
  business_id: string;
  description?: string;
  hours?: Record<string, string>;
  attributes?: {
    available_attributes?: Record<string, string[]>;
    unavailable_attributes?: Record<string, string[]>;
  };
  price_level?: string;
  is_claimed?: boolean;
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

// Cache search results for 24 hours
export const searchBusinesses = unstable_cache(
  async ({ 
    keyword, 
    locationName, 
    locationCode = 2840, 
    languageCode = 'en',
    limit = 20,
    minRating = 4 
  }: SearchParams): Promise<SearchResponse> => {
    try {
      // Enhance the search keyword with location context
      const searchKeyword = locationName 
        ? `${keyword} ${locationName}`
        : keyword;

      // Add wedding-specific terms if not already present
      const weddingKeyword = searchKeyword.toLowerCase().includes('wedding') 
        ? searchKeyword 
        : `wedding ${searchKeyword}`;

      const response = await axios({
        method: 'post',
        url: 'https://api.dataforseo.com/v3/business_data/business_listings/search/live',
        auth: {
          username: DATAFORSEO_USERNAME,
          password: DATAFORSEO_PASSWORD
        },
        data: [{
          // Use specific categories for better targeting
          categories: [
            keyword.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            'wedding_service',
            'event_venue'
          ],
          description: weddingKeyword,
          title: weddingKeyword,
          is_claimed: true, // Only verified businesses
          location_name: locationName,
          filters: [
            ["rating.value", ">", minRating],
            ["rating.votes_count", ">", 5] // Ensure sufficient reviews
          ],
          limit: limit,
          order_by: ["rating.value,desc"],
          // Additional search parameters for better results
          search_parameters: {
            include_keywords: ["wedding", "bridal", "bride", "ceremony"],
            exclude_keywords: ["funeral", "corporate"]
          }
        }],
        headers: {
          'content-type': 'application/json'
        }
      });

      const result = response.data?.tasks?.[0]?.result?.[0];
      
      if (!result || !result.items) {
        console.warn('No results found for:', weddingKeyword);
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

      const vendors: VendorResult[] = result.items.map((item: any) => ({
        name: item.title,
        category: item.category,
        address: item.address,
        phone_number: item.phone,
        website: item.url,
        rating: item.rating?.value,
        latitude: item.latitude,
        longitude: item.longitude,
        photos: [item.main_image].filter(Boolean),
        business_id: item.place_id || String(item.cid),
        description: item.description,
        hours: item.work_time?.work_hours?.timetable,
        attributes: item.attributes,
        price_level: item.price_level,
        is_claimed: item.is_claimed,
        reviews: item.reviews?.map((review: any) => ({
          rating: review.rating,
          text: review.text,
          author: review.author,
          date: review.date
        }))
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