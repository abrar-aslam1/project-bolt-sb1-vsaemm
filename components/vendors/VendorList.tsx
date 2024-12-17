'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VendorCard from './VendorCard';
import { parseSearchQuery, normalizeString, getBaseUrl } from '@/lib/utils';

interface Place {
  placeId: string;
  name: string;
  address: string;
  rating: number;
  totalRatings: number;
  priceLevel?: string;
  website?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

interface VendorListProps {
  query: string;
}

export default function VendorList({ query }: VendorListProps) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const parsed = parseSearchQuery(query);

        // If we have a category and location, redirect to the category page
        if (parsed.category && parsed.city && parsed.state) {
          router.push(
            `/top/${normalizeString(parsed.category)}/${normalizeString(parsed.city)}/${normalizeString(parsed.state)}`
          );
          return;
        }

        // Otherwise, search using the places API
        const searchParams = new URLSearchParams();
        if (parsed.category) searchParams.set('category', parsed.category);
        if (parsed.city) searchParams.set('city', parsed.city);
        if (parsed.state) searchParams.set('state', parsed.state);
        if (!parsed.category && !parsed.city && !parsed.state) {
          searchParams.set('q', query); // Use raw query if no structured data found
        }

        const response = await fetch(
          `${getBaseUrl()}/.netlify/functions/api/places-search?${searchParams.toString()}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }

        const data = await response.json();
        setPlaces(data.results || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchPlaces();
    }
  }, [query, router]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <p className="mt-4 text-gray-600">
          Please try again later or contact support if the problem persists.
        </p>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-xl text-gray-600">No results found for your search.</p>
        <p className="mt-4">
          Try searching by category (e.g., "venues") and location (e.g., "New York")
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {places.map((place) => (
        <VendorCard
          key={place.placeId}
          vendor={{
            id: place.placeId,
            name: place.name,
            location: place.address,
            rating: place.rating,
            description: `${place.totalRatings} reviews${place.priceLevel ? ` • ${place.priceLevel}` : ''}`,
            website: place.website,
            image: '/placeholder-venue.jpg'
          }}
        />
      ))}
    </div>
  );
}
