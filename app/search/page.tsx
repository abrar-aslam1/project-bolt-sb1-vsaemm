import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import SearchBar from '@/components/search-bar';

interface Location {
  city: string;
  state: string;
  zipCode?: string;
  business?: string;
  category?: string;
}

async function searchLocations(query: string): Promise<Location[]> {
  try {
    const filePath = path.join(process.cwd(), 'locations.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const rows = fileContent.split('\n').slice(1); // Skip header
    
    const results: Location[] = [];
    const searchTerms = query.toLowerCase().split(' ');

    rows.forEach(row => {
      const columns = row.split(',');
      if (columns.length >= 8) {
        const city = columns[0]?.replace(/"/g, '');
        const state = columns[3]?.replace(/"/g, '');
        const business = columns[8]?.replace(/"/g, '');
        const category = columns[9]?.replace(/"/g, '');
        
        // Include all fields in the searchable text
        const searchableText = `${city} ${state} ${business} ${category}`.toLowerCase();
        
        // Match if all search terms are found in any of the fields
        if (searchTerms.every(term => searchableText.includes(term))) {
          results.push({
            city,
            state,
            business,
            category
          });
        }
      }
    });

    return results;
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q || '';
  const results = await searchLocations(query);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar className="mb-8" />
        
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">
            {query ? `Search Results for "${query}"` : 'Search Vendors'}
          </h1>
          <p className="text-gray-600">
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </p>
        </div>

        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={`${result.business}-${index}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{result.business}</h2>
                    <p className="text-gray-600 mb-1">{result.category}</p>
                    <p className="text-gray-500 text-sm">
                      {result.city}, {result.state}
                    </p>
                  </div>
                  <Link
                    href={`/vendors`}
                    className="text-pink-500 hover:text-pink-600"
                  >
                    View Details →
                  </Link>
                </div>
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
