import SearchBar from '@/components/search-bar';
import { searchBusinesses } from '@/lib/dataforseo-client';
import { locationCoordinates } from '@/lib/locations';

interface VendorResult {
  business_id: string;
  name: string;
  category?: string;
  address: string;
  website?: string;
  rating?: {
    value: number;
    votes_count: number;
  };
  main_image?: string;
}

function findLocationInQuery(query: string): string | undefined {
  // Convert query to lowercase for case-insensitive matching
  const lowerQuery = query.toLowerCase();
  
  // Get all location keys (e.g., ['phoenix', 'los-angeles', etc.])
  const locations = Object.keys(locationCoordinates);
  
  // Find the longest matching location name in the query
  // This helps prevent matching "york" instead of "new-york"
  return locations
    .sort((a, b) => b.length - a.length) // Sort by length descending
    .find(location => {
      // Convert location to lowercase for case-insensitive comparison
      const locationWords = location.toLowerCase().split('-');
      const locationRegex = new RegExp(locationWords.join('[\\s-]'), 'i');
      return locationRegex.test(lowerQuery);
    });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q || '';
  let results: VendorResult[] = [];
  let totalResults = 0;

  if (query) {
    // Convert query to lowercase for consistent matching
    const lowerQuery = query.toLowerCase();
    
    // Find location in query
    const locationSlug = findLocationInQuery(lowerQuery);
    console.log('Found location slug:', locationSlug);

    // Remove location from service query if found
    let servicePart = lowerQuery;
    if (locationSlug) {
      const locationWords = locationSlug.split('-').join(' ');
      servicePart = lowerQuery.replace(locationWords, '').trim();
      
      try {
        const searchResults = await searchBusinesses({
          keyword: servicePart || 'wedding venue',
          locationName: locationSlug,
          limit: 20,
          minRating: 4
        });

        results = searchResults.data;
        totalResults = searchResults.pagination.totalResults;
      } catch (error) {
        console.error('Error searching vendors:', error);
      }
    } else {
      console.log('No location found in query:', lowerQuery);
      console.log('Available locations:', Object.keys(locationCoordinates));
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar className="mb-8" />
        
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">
            {query ? `Search Results for "${query}"` : 'Search Vendors'}
          </h1>
          <p className="text-gray-600">
            {totalResults} {totalResults === 1 ? 'result' : 'results'} found
          </p>
        </div>

        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={`${result.business_id}-${index}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{result.name}</h2>
                    <p className="text-gray-600 mb-1">{result.category}</p>
                    <p className="text-gray-500 text-sm">{result.address}</p>
                    {result.rating && (
                      <div className="flex items-center mt-2">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-gray-600">{result.rating.value}</span>
                        <span className="text-gray-400 text-sm ml-1">
                          ({result.rating.votes_count} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                  {result.website && (
                    <a
                      href={result.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:text-pink-600"
                    >
                      View Details →
                    </a>
                  )}
                </div>
                {result.main_image && (
                  <div className="mt-4">
                    <img
                      src={result.main_image}
                      alt={result.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No results found for your search.</p>
            <p className="text-gray-500">Try different keywords or browse our categories below.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
