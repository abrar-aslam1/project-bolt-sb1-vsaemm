import { notFound } from 'next/navigation';
import Link from 'next/link';
import { searchBusinesses } from '@/lib/rapidapi-client';
import { VendorImage } from './vendor-image';

interface VendorDetails {
  name: string;
  category: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  latitude: number;
  longitude: number;
  photo?: string | null;
}

interface SearchResult {
  vendors: VendorDetails[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
  };
}

const ITEMS_PER_PAGE = 25;
const ITEMS_PER_ROW = 3; // Number of items in one row based on grid layout

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

function formatCityName(citySlug: string): string {
  const decodedCity = decodeURIComponent(citySlug);
  return decodedCity
    .split(/[-\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function getVendorsByCity(category: string, citySlug: string, page: number = 1): Promise<SearchResult> {
  const city = formatCityName(citySlug);
  const searchQuery = `${categoryMap[category]} in ${city}`;
  
  try {
    console.log('Searching for:', searchQuery, 'in city:', city);
    const data = await searchBusinesses({
      query: searchQuery,
      citySlug: citySlug.toLowerCase(),
      limit: 100
    });

    if (!data || !data.data) {
      console.error('No data returned from API for:', searchQuery);
      return {
        vendors: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalResults: 0
        }
      };
    }

    const allVendors = data.data.map((business: any) => ({
      name: business.name,
      category: business.type || categoryMap[category],
      address: business.full_address || `${business.address}, ${city}`,
      phone: business.phone_number,
      website: business.website,
      rating: business.rating,
      latitude: business.latitude,
      longitude: business.longitude,
      photo: business.photos?.[0] || null
    }));

    console.log(`Found ${allVendors.length} vendors for ${city}`);

    const totalResults = allVendors.length;
    const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedVendors = allVendors.slice(startIndex, endIndex);

    return {
      vendors: paginatedVendors,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor, index) => {
          // Prioritize first row of images on first page
          const shouldPrioritize = currentPage === 1 && index < ITEMS_PER_ROW;
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <VendorImage 
                src={vendor.photo} 
                alt={vendor.name} 
                isPriority={shouldPrioritize}
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
                  {vendor.phone && (
                    <p>
                      <a href={`tel:${vendor.phone}`} className="text-blue-600 hover:text-blue-800">
                        {vendor.phone}
                      </a>
                    </p>
                  )}
                  {vendor.website && (
                    <p>
                      <a 
                        href={vendor.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Visit Website
                      </a>
                    </p>
                  )}
                  <div className="mt-4 pt-4 border-t">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full">
                      Contact Vendor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
