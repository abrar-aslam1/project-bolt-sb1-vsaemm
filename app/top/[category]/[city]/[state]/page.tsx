import TopPlacesClient from './top-places-client';
import { headers } from 'next/headers';

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

async function getPlaces(category: string, city: string, state: string): Promise<Place[]> {
  try {
    const headersList = headers();
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    const host = headersList.get('host') || '';
    const baseUrl = `${protocol}://${host}`;

    const response = await fetch(`${baseUrl}/api/places/top`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category, city, state }),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Places API error:', errorText);
      throw new Error(`Failed to fetch places: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
}

async function getValidLocations(city: string, state: string): Promise<Location[]> {
  try {
    const headersList = headers();
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    const host = headersList.get('host') || '';
    const baseUrl = `${protocol}://${host}`;

    const response = await fetch(`${baseUrl}/api/places`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city, state }),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Locations API error:', errorText);
      throw new Error(`Failed to fetch locations: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.locations || [];
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

export default async function TopPlacesPage({ params }: TopPlacesPageProps) {
  try {
    const { category, city, state } = params;
    console.log('Fetching places for:', { category, city, state });
    
    const places = await getPlaces(category, city, state);
    console.log('Places fetched:', places.length);
    
    if (places.length === 0) {
      // Get available categories for this city
      console.log('No places found, fetching valid locations');
      const locations = await getValidLocations(city, state);
      console.log('Locations fetched:', locations.length);
      
      const cityLocations = locations.filter(
        (loc: Location) => loc.city.toLowerCase() === city.toLowerCase() && 
               loc.state.toLowerCase() === state.toLowerCase()
      );
      console.log('City locations filtered:', cityLocations.length);

      const formattedCategory = category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      return (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Category Not Available
            </h1>
            <p className="text-gray-700 mb-6">
              Sorry, we don't currently have any {formattedCategory} listings in {city}, {state}.
            </p>
            {cityLocations.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mb-3">
                  Available Categories in {city}:
                </h2>
                <ul className="list-disc pl-5 mb-6">
                  {cityLocations.map((loc: Location, index: number) => (
                    <li key={index} className="mb-2">
                      <a 
                        href={`/top/${loc.category.toLowerCase().replace(/wedding\s+/i, '').replace(/\s+/g, '-')}/${city.toLowerCase()}/${state.toLowerCase()}`}
                        className="text-blue-600 hover:underline"
                      >
                        {loc.category}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
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

    return <TopPlacesClient initialPlaces={places} params={params} />;
  } catch (error) {
    console.error('Error:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-red-600">
          Error: Unable to load venues. Please try again later.
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-4 text-left text-sm bg-gray-100 p-4 rounded">
              {error instanceof Error ? error.message : 'Unknown error'}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
