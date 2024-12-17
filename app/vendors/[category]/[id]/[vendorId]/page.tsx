import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PlacesService } from '@/lib/services/places-service';
import { VendorImage } from '../vendor-image';

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

async function getVendorDetails(category: string, citySlug: string, vendorId: string) {
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

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">
          Loading...
        </h1>
        <p className="text-gray-700">
          Please wait while we fetch the vendor details.
        </p>
      </div>
    </div>
  );
}
