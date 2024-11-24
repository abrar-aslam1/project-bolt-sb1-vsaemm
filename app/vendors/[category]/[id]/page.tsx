import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { searchBusinesses } from '@/lib/dataforseo-client';
import Image from 'next/image';

interface VendorDetails {
  name: string;
  category?: string;
  address: string;
  phone_number?: string;
  website?: string;
  rating?: {
    value: number;
    votes_count: number;
  };
  latitude: number;
  longitude: number;
  photos?: string[];
  business_id: string;
  description?: string;
  price_level?: string;
  address_info?: {
    borough?: string;
    address: string;
    city: string;
    zip: string;
    region: string;
    country_code: string;
  };
  main_image?: string;
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

async function getVendorsByCity(category: string, citySlug: string, page: number = 1): Promise<SearchResult> {
  const city = formatCityName(citySlug);
  
  try {
    console.log('Searching for:', categoryMap[category], 'in city:', city);
    const data = await searchBusinesses({
      keyword: categoryMap[category],
      locationName: city,
      limit: ITEMS_PER_PAGE,
      minRating: 4
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

    return {
      vendors: data.data,
      pagination: data.pagination
    };
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }
}

function VendorGrid({ vendors, category, citySlug }: { 
  vendors: VendorDetails[];
  category: string;
  citySlug: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.map((vendor) => {
        const vendorKey = `${vendor.business_id}-${vendor.name.toLowerCase().replace(/\s+/g, '-')}`;
        return (
          <Suspense 
            key={vendorKey}
            fallback={
              <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                </div>
              </div>
            }
          >
            <VendorCard 
              vendor={vendor} 
              category={category}
              citySlug={citySlug}
            />
          </Suspense>
        );
      })}
    </div>
  );
}

function VendorCard({ 
  vendor,
  category,
  citySlug 
}: { 
  vendor: VendorDetails;
  category: string;
  citySlug: string;
}) {
  return (
    <Link 
      href={`/vendors/${category}/${citySlug}/${vendor.business_id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <Suspense fallback={<div className="h-48 bg-gray-200 animate-pulse" />}>
        <div className="relative h-48 w-full">
          {vendor.main_image ? (
            <Image
              src={vendor.main_image}
              alt={vendor.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
      </Suspense>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{vendor.name}</h2>
        <div className="space-y-2 text-gray-600">
          {vendor.rating && (
            <p className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span>{vendor.rating.value.toFixed(1)}</span>
              <span className="text-gray-500 ml-2">({vendor.rating.votes_count} reviews)</span>
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
  );
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
  if (!categoryMap[params.category]) {
    console.log('Invalid category:', params.category);
    notFound();
  }

  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  console.log('Fetching vendors for:', {
    category: params.category,
    city: params.id,
    page: currentPage
  });

  try {
    const { vendors, pagination } = await getVendorsByCity(params.category, params.id, currentPage);
    console.log('Fetched vendors:', vendors.length);
    
    // If no vendors are found and it's not due to an unsupported location
    if (vendors.length === 0 && currentPage === 1) {
      console.log('No vendors found');
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link 
              href={`/vendors/${params.category}`}
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Back to Categories
            </Link>
            <h1 className="text-4xl font-bold">
              No Results Found
            </h1>
            <p className="text-gray-600 mt-4">
              We couldn't find any vendors in this location. This could be because:
            </p>
            <ul className="list-disc ml-8 mt-2 text-gray-600">
              <li>The location is not currently supported in our system</li>
              <li>There are no vendors matching your criteria in this area</li>
              <li>The location name might be misspelled</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Please try searching in a different location or contact us for assistance.
            </p>
          </div>
        </div>
      );
    }

    const cityName = formatCityName(params.id);
    const categoryTitle = params.category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

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

        <Suspense 
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <VendorGrid 
            vendors={vendors} 
            category={params.category}
            citySlug={params.id}
          />
        </Suspense>

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
  } catch (error) {
    console.error('Error in vendor page:', error);
    throw error; // Let error boundary handle it
  }
}
