import TopPlacesClient from './top-places-client';
import { headers } from 'next/headers';
import { categoryMapping } from 'lib/services/places-service';
import { locationCoordinates } from 'lib/locations';

interface TopPlacesPageProps {
  params: {
    category: string;
    city: string;
    state: string;
  }
}

interface Place {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  totalRatings?: number;
  priceLevel?: string;
  website?: string;
}

interface Location {
  city: string;
  state: string;
  state_name: string;
  category: string;
}

const normalizeString = (str: string): string => {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').trim();
};

async function getPlaces(category: string, city: string, state: string): Promise<Place[]> {
  try {
    const headersList = headers();
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    const host = headersList.get('host') || '';
    const baseUrl = `${protocol}://${host}`;

    console.log('Making request to:', `${baseUrl}/api/places/top`);
    console.log('Request body:', { category, city, state });

    const response = await fetch(`${baseUrl}/api/places/top`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        category: normalizeString(category),
        city: normalizeString(city),
        state: state.toLowerCase()
      }),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Places API error:', errorText);
      throw new Error(`Failed to fetch places: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
}

export default async function TopPlacesPage({ params }: TopPlacesPageProps) {
  try {
    const { category, city, state } = params;
    console.log('Page params:', { category, city, state });
    
    // Validate category
    const normalizedCategory = normalizeString(category);
    if (!Object.keys(categoryMapping).includes(normalizedCategory)) {
      console.error('Invalid category:', normalizedCategory);
      throw new Error(`Invalid category: ${category}`);
    }

    // Validate city
    const normalizedCity = normalizeString(city);
    if (!locationCoordinates[normalizedCity]) {
      console.error('City not supported:', normalizedCity);
      throw new Error(`City not supported: ${city}`);
    }

    const places = await getPlaces(category, city, state);
    console.log('Places fetched:', places.length);
    
    if (places.length === 0) {
      const formattedCategory = category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      const mappedCategory = categoryMapping[normalizedCategory];

      return (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              No Results Found
            </h1>
            <p className="text-gray-700 mb-6">
              Sorry, we couldn't find any {mappedCategory || formattedCategory} listings in {city}, {state}.
            </p>
            <div className="mt-6">
              <a 
                href="/"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Return to Homepage
              </a>
            </div>
          </div>
        </div>
      );
    }

    return <TopPlacesClient initialPlaces={places} params={params} />;
  } catch (error) {
    console.error('Page Error:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Content
          </h1>
          <p className="text-gray-700 mb-6">
            We encountered an error while loading the content. This could be because:
          </p>
          <ul className="list-disc text-left max-w-md mx-auto mb-6 text-gray-700">
            <li className="mb-2">The category is not available in this location</li>
            <li className="mb-2">The location is not currently supported</li>
            <li className="mb-2">There was a temporary service disruption</li>
          </ul>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-4 text-left text-sm bg-gray-100 p-4 rounded max-w-2xl mx-auto">
              {error instanceof Error ? error.message : 'Unknown error'}
            </pre>
          )}
          <div className="mt-6">
            <a 
              href="/"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Return to Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }
}
