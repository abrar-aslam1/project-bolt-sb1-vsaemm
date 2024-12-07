import { Metadata } from 'next';
import { PlacesService } from '@/lib/services/places-service';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Place } from '@/lib/models/place';

interface TopPlacesPageProps {
  params: {
    category: string;
    city: string;
    state: string;
  }
}

export async function generateMetadata({ params }: TopPlacesPageProps): Promise<Metadata> {
  const { category, city, state } = params;
  const formattedCategory = category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return {
    title: `Top 10 ${formattedCategory} in ${city}, ${state} - Best Rated Venues`,
    description: `Discover the top 10 best rated ${formattedCategory.toLowerCase()} venues in ${city}, ${state}. Comprehensive reviews, ratings, and details to help plan your perfect wedding.`,
    openGraph: {
      title: `Top 10 ${formattedCategory} in ${city}, ${state}`,
      description: `Find the best ${formattedCategory.toLowerCase()} venues in ${city}, ${state}. Compare ratings, reviews, and amenities to make the perfect choice for your special day.`,
    }
  };
}

export default async function TopPlacesPage({ params }: TopPlacesPageProps) {
  const { category, city, state } = params;
  const formattedCategory = category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const places = await PlacesService.getTopPlaces(category, city, state);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Top Venues', href: '/top' },
    { label: formattedCategory, href: `/top/${category}` },
    { label: `${city}, ${state}`, href: `/top/${category}/${city}/${state}` },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbs} />
      
      <h1 className="text-4xl font-bold mb-8">
        Top 10 {formattedCategory} in {city}, {state}
      </h1>

      <div className="space-y-8">
        {places.map((place: Place, index: number) => (
          <div key={place.placeId} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  {index + 1}. {place.name}
                </h2>
                <p className="text-gray-600 mb-2">{place.address}</p>
                {place.rating && (
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{place.rating.toFixed(1)}</span>
                    {place.totalRatings && (
                      <span className="text-gray-500 ml-1">
                        ({place.totalRatings} reviews)
                      </span>
                    )}
                  </div>
                )}
                {place.priceLevel && (
                  <p className="text-gray-600 mb-2">
                    Price Level: {place.priceLevel}
                  </p>
                )}
              </div>
              {place.website && (
                <Link
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Visit Website
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">
          About {formattedCategory} in {city}, {state}
        </h2>
        <p className="text-gray-700 mb-4">
          Looking for the perfect {formattedCategory.toLowerCase()} venue in {city}, {state}? 
          Our comprehensive guide features the top 10 highest-rated venues, carefully selected 
          based on customer reviews, ratings, and overall quality of service. Each venue has 
          been thoroughly evaluated to ensure you find the perfect location for your special day.
        </p>
        <p className="text-gray-700">
          These venues represent the best that {city} has to offer, combining exceptional 
          service, stunning locations, and proven track records of creating memorable events. 
          Whether you're planning an intimate gathering or a grand celebration, these top-rated 
          venues provide the perfect setting for your wedding celebration.
        </p>
      </div>
    </div>
  );
}
