import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { searchBusinesses } from '@/lib/dataforseo-client';
import { VendorImage } from '../vendor-image';

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
  reviews?: Array<{
    rating: number;
    text: string;
    author: string;
    date: string;
  }>;
  attributes?: {
    available_attributes?: Record<string, string[]>;
    unavailable_attributes?: Record<string, string[]>;
  };
  price_level?: string;
  is_claimed?: boolean;
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
}: { 
  params: { category: string; id: string; vendorId: string } 
}): Promise<Metadata> {
  const cityName = formatCityName(params.id);
  const categoryTitle = params.category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Fetch vendor details for accurate metadata
  const vendor = await getVendorDetails(params.category, params.id, params.vendorId);
  if (!vendor) return notFound();

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
    const data = await searchBusinesses({
      keyword: categoryMap[category],
      locationName: city,
      minRating: 4
    });

    if (!data || !data.data) {
      return null;
    }

    const vendor = data.data.find(business => business.business_id === vendorId);
    
    if (!vendor) {
      return null;
    }

    return {
      name: vendor.name,
      category: vendor.category || categoryMap[category],
      address: vendor.address,
      phone_number: vendor.phone_number,
      website: vendor.website,
      rating: vendor.rating,
      latitude: vendor.latitude,
      longitude: vendor.longitude,
      photos: vendor.photos,
      business_id: vendor.business_id,
      description: vendor.description,
      hours: vendor.hours,
      reviews: vendor.reviews,
      attributes: vendor.attributes,
      price_level: vendor.price_level,
      is_claimed: vendor.is_claimed
    };
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    return null;
  }
}

export default async function VendorDetailsPage({ 
  params 
}: { 
  params: { category: string; id: string; vendorId: string } 
}) {
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
                </div>
              )}
              {vendor.price_level && (
                <div className="text-gray-600 mb-4">
                  Price Level: {vendor.price_level}
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
            <p className="text-gray-600 mb-6">{vendor.description || `${vendor.name} is a ${vendor.category} located in ${cityName}.`}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Location</h3>
                <p className="text-gray-600">{vendor.address}</p>
              </div>
              
              {vendor.hours && Object.keys(vendor.hours).length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Business Hours</h3>
                  <div className="space-y-2">
                    {Object.entries(vendor.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="font-medium">{day}</span>
                        <span className="text-gray-600">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {vendor.attributes?.available_attributes && Object.keys(vendor.attributes.available_attributes).length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Features & Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(vendor.attributes.available_attributes).map(([category, items]) => (
                    <div key={category} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 capitalize">{category.replace(/_/g, ' ')}</h4>
                      <ul className="space-y-1">
                        {items.map((item, index) => (
                          <li key={index} className="text-gray-600 text-sm">
                            • {item.replace(/_/g, ' ')}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {vendor.reviews && vendor.reviews.length > 0 && (
            <div className="border-t border-gray-200 mt-8 pt-8">
              <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
              <div className="space-y-6">
                {vendor.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-400 mr-2">★</span>
                      <span className="font-medium">{review.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-gray-600 mb-2">{review.text}</p>
                    <div className="text-sm text-gray-500">
                      <span>{review.author}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
