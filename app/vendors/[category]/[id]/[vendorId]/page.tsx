import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { PlacesService } from '@/lib/services/places-service';
import { VendorImage } from '../vendor-image';

interface VendorPageProps {
  params: { 
    category: string; 
    id: string; 
    vendorId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

interface VendorDetails {
  name: string;
  category?: string;
  address: string;
  phone_number?: string;
  website?: string;
  rating?: number;
  totalRatings?: number;
  latitude: number;
  longitude: number;
  photos?: string[];
  placeId: string;
  description?: string;
  priceLevel?: string;
}

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

export async function generateMetadata({ 
  params 
}: VendorPageProps): Promise<Metadata> {
  const cityName = formatCityName(params.id);
  const categoryTitle = params.category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Fetch vendor details for accurate metadata
  const vendor = await getVendorDetails(params.category, params.id, params.vendorId);
  if (!vendor) {
    return {
      title: 'Vendor Not Found',
      description: 'The requested vendor could not be found.'
    };
  }

  const title = `${vendor.name} - ${categoryTitle} in ${cityName} | WeddingVendors`;
  const description = `${vendor.name} is a ${categoryMap[params.category]} in ${cityName}. View photos, read reviews, and get contact information.`;

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
      canonical: `/vendors/${params.category}/${params.id}/${params.vendorId}`,
    },
  };
}

async function getVendorDetails(category: string, citySlug: string, vendorId: string): Promise<VendorDetails | null> {
  const city = formatCityName(citySlug);
  
  try {
    const places = await PlacesService.searchPlaces(category, city, 'us');

    if (!places || places.length === 0) {
      return null;
    }

    const vendor = places.find(place => place.placeId === vendorId);
    
    if (!vendor) {
      return null;
    }

    return {
      name: vendor.name,
      category: categoryMap[category],
      address: vendor.address,
      website: vendor.website,
      rating: vendor.rating,
      totalRatings: vendor.totalRatings,
      latitude: vendor.location.coordinates[1],
      longitude: vendor.location.coordinates[0],
      placeId: vendor.placeId,
      priceLevel: vendor.priceLevel,
      description: `${vendor.name} is a ${categoryMap[category]} located in ${city}.`
    };
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    return null;
  }
}

export default async function VendorDetailsPage({ params }: VendorPageProps) {
  const vendor = await getVendorDetails(params.category, params.id, params.vendorId);

  if (!vendor) {
    notFound();
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
          href={`/vendors/${params.category}/${params.id}`}
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to {categoryTitle} in {cityName}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          <VendorImage 
            src={vendor.photos?.[0]} 
            alt={vendor.name}
            priority
            className="h-96"
          />
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">{vendor.name}</h1>
              {vendor.rating && (
                <div className="flex items-center mb-4">
                  <span className="text-yellow-400 text-2xl mr-2">★</span>
                  <span className="text-xl">{vendor.rating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-2">({vendor.totalRatings} reviews)</span>
                </div>
              )}
            </div>
            <div className="text-right">
              {vendor.website && (
                <a 
                  href={vendor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mb-3"
                >
                  Visit Website
                </a>
              )}
              {vendor.phone_number && (
                <a 
                  href={`tel:${vendor.phone_number}`}
                  className="block text-blue-600 hover:text-blue-800"
                >
                  {vendor.phone_number}
                </a>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 mt-6 pt-6">
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p className="text-gray-600 mb-6">{vendor.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Location</h3>
                <p className="text-gray-600">{vendor.address}</p>
              </div>
              
              {vendor.priceLevel && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Price Level</h3>
                  <p className="text-gray-600">{'$'.repeat(vendor.priceLevel.length)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
