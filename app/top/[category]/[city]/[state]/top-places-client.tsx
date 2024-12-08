'use client';

import { Breadcrumb } from 'components/ui/breadcrumb';
import Link from 'next/link';
import { useState } from 'react';

interface Place {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  totalRatings?: number;
  priceLevel?: string;
  website?: string;
  phoneNumber?: string;
}

interface TopPlacesClientProps {
  initialPlaces: Place[];
  params: {
    category: string;
    city: string;
    state: string;
  };
}

export default function TopPlacesClient({ initialPlaces, params }: TopPlacesClientProps) {
  const { category, city, state } = params;
  const formattedCategory = category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const [places] = useState<Place[]>(initialPlaces);
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set());

  const togglePlace = (placeId: string) => {
    setSelectedPlaces(prev => {
      const newSet = new Set(prev);
      if (newSet.has(placeId)) {
        newSet.delete(placeId);
      } else if (newSet.size < 3) {
        newSet.add(placeId);
      }
      return newSet;
    });
  };

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

      {selectedPlaces.size > 0 && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg flex justify-between items-center">
          <span>{selectedPlaces.size} venues selected for comparison</span>
          <Link href="#compare" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Compare Selected
          </Link>
        </div>
      )}

      <div className="space-y-8">
        {places.map((place: Place, index: number) => (
          <div key={place.placeId} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
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
              <div className="flex gap-2">
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
                <button
                  onClick={() => togglePlace(place.placeId)}
                  className={`px-4 py-2 rounded transition-colors ${
                    selectedPlaces.has(place.placeId)
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {selectedPlaces.has(place.placeId) ? 'Selected' : 'Compare'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div id="compare" className="mt-12">
        {selectedPlaces.size > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Compare Selected Venues</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from(selectedPlaces).map(placeId => {
                const place = places.find(p => p.placeId === placeId);
                if (!place) return null;
                
                return (
                  <div key={place.placeId} className="border rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-3">{place.name}</h3>
                    <div className="space-y-2">
                      <p><strong>Address:</strong> {place.address}</p>
                      {place.rating && (
                        <p>
                          <strong>Rating:</strong> {place.rating.toFixed(1)} ★
                          {place.totalRatings && ` (${place.totalRatings} reviews)`}
                        </p>
                      )}
                      {place.priceLevel && (
                        <p><strong>Price Level:</strong> {place.priceLevel}</p>
                      )}
                      {place.phoneNumber && (
                        <p><strong>Phone:</strong> {place.phoneNumber}</p>
                      )}
                      {place.website && (
                        <Link
                          href={place.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline block mt-2"
                        >
                          Visit Website
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
