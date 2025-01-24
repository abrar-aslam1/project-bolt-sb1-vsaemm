import TopPlacesClient from './top-places-client';
import { normalizeString } from '@/lib/utils';
import { Place } from '@/lib/services/places-client';

async function getPlaces(category: string, city: string, state: string) {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8888' 
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/api/places-top`, {
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
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch places: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
}

interface PageParams {
  category: string;
  city: string;
  state: string;
}

interface PageSearchParams {
  [key: string]: string | string[] | undefined;
}

interface Props {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}

export default async function Page({ params, searchParams }: Props) {
  try {
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
    ) as Place[];

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
