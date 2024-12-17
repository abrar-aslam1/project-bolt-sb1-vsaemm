'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TestPlacesPageProps {
  params: Record<string, never>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function TestPlacesPage({
  params,
  searchParams,
}: TestPlacesPageProps) {
  const [category, setCategory] = useState('Wedding Venue');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const searchPlaces = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/places/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, city, state }),
      });

      if (!response.ok) {
        throw new Error('Failed to search places');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error searching places:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Test Places API</h1>
      
      <div className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Wedding Venue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g., New York"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <Input
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="e.g., NY"
          />
        </div>

        <Button 
          onClick={searchPlaces}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Searching...' : 'Search Places'}
        </Button>
      </div>

      {results && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Results</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
