import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { searchBusinesses } from '@/lib/dataforseo-client';
import { VendorImage } from './vendor-image';

interface VendorDetails {
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
}

interface BusinessData {
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
}

interface SearchResult {
  vendors: VendorDetails[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
  };
}

const ITEMS_PER_PAGE = 20;
const MIN_RATING = 4; // Only show vendors with 4+ rating

const categoryMap: Record<string, string> = {
  'wedding-venues': 'wedding venue',
  'photographers': 'wedding photographer',
  'caterers': 'wedding caterer',
  'florists': 'wedding florist',
  'djs': 'wedding dj',
  'planners': 'wedding planner',
  'dress-shops': 'bridal shop',
  'beauty': 'wedding makeup artist'
};

const categoryDescriptions: Record<string, string> = {
  'wedding-venues': 'Find the perfect wedding venue for your special day. Browse top-rated wedding venues with photos, reviews, and detailed information.',
  'photographers': 'Discover talented wedding photographers who will capture your precious moments. View portfolios, packages, and reviews.',
  'caterers': 'Explore wedding catering services offering delicious menus for your reception. Compare options, pricing, and reviews.',
  'florists': 'Browse wedding florists creating stunning floral arrangements for ceremonies and receptions. View designs and get custom quotes.',
  'djs': 'Find experienced wedding DJs and entertainment services to keep your guests dancing all night. Read reviews and compare packages.',
  'planners': 'Connect with professional wedding planners who will make your dream wedding a reality. View portfolios and services.',
  'dress-shops': 'Explore bridal shops offering beautiful wedding dresses and accessories. Find your perfect dress with expert assistance.',
  'beauty': 'Discover wedding makeup artists and beauty professionals who will help you look stunning on your big day.'
};

function formatCityName(citySlug: string): string {
  const decodedCity = decodeURIComponent(citySlug);
  return decodedCity
    .split(/[-\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ 
  params 
}: { 
  params: { category: string; id: string } 
}): Promise<Metadata> {
  const cityName = formatCityName(params.id);
  const categoryTitle = params.category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const title = `${categoryTitle} in ${cityName} | WeddingVendors`;
  const description = `${categoryDescriptions[params.category]} Find the best ${categoryMap[params.category]}s in ${cityName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'WeddingVendors',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/vendors/${params.category}/${params.id}`,
    },
    keywords: [
      'wedding',
      params.category.replace('-', ' '),
      cityName,
      'wedding planning',
      'wedding services',
      'wedding vendors',
    ],
  };
}

async function getVendorsByCity(category: string, citySlug: string, page: number = 1): Promise<SearchResult> {
  const city = formatCityName(citySlug);
  
  try {
    console.log('Searching for:', categoryMap[category], 'in city:', city);
    const data = await searchBusinesses({
      keyword: categoryMap[category],
      locationName: city,
      limit: ITEMS_PER_PAGE,
      minRating: MIN_RATING
    });

    if (!data || !data.data) {
      console.error('No data returned from API for:', categoryMap[category], 'in', city);
      return {
        vendors: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalResults: 0
        }
      };
    }

    const vendors = data.data.map((business: BusinessData) => ({
      name: business.name,
      category: business.category || categoryMap[category],
      address: business.address,
      phone_number: business.phone_number,
      website: business.website,
      rating: business.rating,
      latitude: business.latitude,
      longitude: business.longitude,
      photos: business.photos,
      business_id: business.business_id,
      description: business.description,
      hours: business.hours,
      attributes: business.attributes,
      price_level: business.price_level,
      is_claimed: business.is_claimed
    }));

    console.log(`Found ${vendors.length} vendors for ${city}`);

    return {
      vendors,
      pagination: {
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        totalResults: data.pagination.totalResults
      }
    };
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return {
      vendors: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalResults: 0
      }
    };
  }
}

function PaginationControls({ 
  currentPage, 
  totalPages, 
  category, 
  citySlug 
}: { 
  currentPage: number; 
  totalPages: number; 
  category: string; 
  citySlug: string; 
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={`/vendors/${category}/${citySlug}?page=${currentPage - 1}`}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          Previous
        </Link>
      )}
      
      {pages.map(page => (
        <Link
          key={page}
          href={`/vendors/${category}/${citySlug}?page=${page}`}
          className={`px-4 py-2 rounded ${
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={`/vendors/${category}/${citySlug}?page=${currentPage + 1}`}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          Next
        </Link>
      )}
    </div>
  );
}

export default async function VendorLocationPage({ 
  params,
  searchParams 
}: { 
  params: { category: string; id: string };
  searchParams: { page?: string };
}) {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const { vendors, pagination } = await getVendorsByCity(params.category, params.id, currentPage);

  if (vendors.length === 0 && currentPage === 1) {
    notFound();
  }

  const cityName = formatCityName(params.id);
  const categoryTitle = params.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href={`/vendors/${params.category}`}
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to {categoryTitle}
        </Link>
        <h1 className="text-4xl font-bold">
          {categoryTitle} in {cityName}
        </h1>
        <p className="text-gray-600 mt-2">
          {pagination.totalResults > 0 ? (
            `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(currentPage * ITEMS_PER_PAGE, pagination.totalResults)} of ${pagination.totalResults} vendors in ${cityName}`
          ) : (
            `No vendors found in ${cityName}`
          )}
        </p>
        <p className="text-gray-600 mt-4">
          {categoryDescriptions[params.category]}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor, index) => (
          <Link 
            key={index} 
            href={`/vendors/${params.category}/${params.id}/${vendor.business_id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <VendorImage 
              src={vendor.photos?.[0]} 
              alt={vendor.name}
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{vendor.name}</h2>
              <div className="space-y-2 text-gray-600">
                {vendor.rating && (
                  <p className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    {vendor.rating.toFixed(1)}
                  </p>
                )}
                <p>{vendor.category}</p>
                <p>{vendor.address}</p>
                {vendor.price_level && (
                  <p>Price: {vendor.price_level}</p>
                )}
                {vendor.phone_number && (
                  <p>
                    <span className="text-blue-600">
                      {vendor.phone_number}
                    </span>
                  </p>
                )}
                {vendor.website && (
                  <p>
                    <span className="text-blue-600">
                      Visit Website
                    </span>
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          category={params.category}
          citySlug={params.id}
        />
      )}
    </div>
  );
}
