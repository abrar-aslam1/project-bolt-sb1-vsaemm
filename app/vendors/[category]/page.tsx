'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { citiesByState } from '@/lib/locations';
import { categoryMapping } from '@/lib/services/places-service';

interface CategoryMapping {
  [key: string]: string;
}

function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').trim();
}

export default function Page() {
  const params = useParams();
  const category = params?.category as string;

  // Get the normalized category name for display
  const mapping = categoryMapping as CategoryMapping;
  const displayCategory = Object.entries(mapping).find(
    ([key]) => normalizeString(key) === normalizeString(category)
  )?.[1] || category;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Find {displayCategory} Near You
        </h1>
        <p className="text-gray-600">
          Select your location to browse {displayCategory.toLowerCase()} in your area
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {Object.entries(citiesByState).map(([state, cities]) => (
          <div key={state} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{state}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(cities as string[]).map((city: string) => (
                <Link
                  key={`${city}-${state}`}
                  href={`/top/${category}/${normalizeString(city)}/${normalizeString(state)}`}
                  className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="text-lg font-medium">{city}</div>
                  <div className="text-sm text-gray-500">{state}</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
