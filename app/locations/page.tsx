'use client';

import Link from 'next/link';
import { citiesByState, locationCoordinates } from '@/lib/locations';

interface State {
  state_name: string;
  cities: string[];
}

function getStateData(): State[] {
  const states = Object.entries(citiesByState).map(([state_name, cities]) => ({
    state_name,
    cities
  }));

  return states.sort((a, b) => a.state_name.localeCompare(b.state_name));
}

// Convert city name to match locationCoordinates keys
function cityToSlug(city: string): string {
  return city.toLowerCase().replace(/\s+/g, '-');
}

// Verify if a city slug exists in locationCoordinates
function isValidLocation(citySlug: string): boolean {
  return citySlug in locationCoordinates;
}

export default function LocationsPage() {
  const states = getStateData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Wedding Vendors by Location</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse wedding vendors across major US cities. Whether you're planning a destination wedding 
          or looking for local vendors, find the perfect match for your special day.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {states.map((state) => (
          <div
            key={state.state_name}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{state.state_name}</h2>
              </div>
              <div className="text-sm text-gray-600">
                <p>{state.cities.length} {state.cities.length === 1 ? 'City' : 'Cities'}</p>
              </div>
              <div className="mt-4 space-y-2">
                {state.cities.map((city) => {
                  const citySlug = cityToSlug(city);
                  // Only create links for cities that exist in locationCoordinates
                  if (isValidLocation(citySlug)) {
                    return (
                      <Link
                        key={`${state.state_name}-${city}`}
                        href={`/search?q=wedding venue ${citySlug}`}
                        className="block text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {city}
                        <span className="text-gray-400 text-xs ml-2">→</span>
                      </Link>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Why Browse by Location?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Local Expertise</h3>
            <p className="text-gray-600">
              Find vendors who know your area and understand local wedding traditions and venues.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Easy Meetings</h3>
            <p className="text-gray-600">
              Meet with local vendors in person to discuss your vision and see their work firsthand.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Support Local Business</h3>
            <p className="text-gray-600">
              Connect with and support talented wedding professionals in your community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
