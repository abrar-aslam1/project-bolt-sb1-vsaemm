import TopPlacesClient from './top-places-client';
import { categoryMapping } from '@/lib/services/places-service';
import { locationCoordinates } from '@/lib/locations';

const normalizeString = (str: string): string => {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').trim();
};

async function getPlaces(category: string, city: string, state: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const queryParams = new URLSearchParams({
      category: normalizeString(category),
      city: normalizeString(city),
      state: state.toLowerCase()
    });

    const response = await fetch(`${baseUrl}/api/places/top?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch places: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
}

type PageProps = {
  params: Promise<{
    category: string;
    city: string;
    state: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  try {
    // Wait for params to resolve
    const resolvedParams = await params;

    // Validate params
    if (!resolvedParams?.category || !resolvedParams?.city || !resolvedParams?.state) {
      throw new Error('Missing required parameters');
    }

    // Fetch the places data
    const places = await getPlaces(
      resolvedParams.category,
      resolvedParams.city,
      resolvedParams.state
    );

    // Pass both the places data and the params to the client component
    return <TopPlacesClient initialPlaces={places} params={resolvedParams} />;
  } catch (error) {
    console.error('Error in page:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">
            Error Loading Content
          </h1>
          <p className="text-gray-700">
            {error instanceof Error ? error.message : 'An error occurred while loading the content. Please try again later.'}
          </p>
        </div>
      </div>
    );
  }
}
