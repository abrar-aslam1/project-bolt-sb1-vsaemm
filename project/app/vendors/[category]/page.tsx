import { notFound } from 'next/navigation';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';

interface Location {
  city: string;
  state: string;
  zipCode: string;
  latitude: string;
  longitude: string;
}

const categoryTitles: Record<string, string> = {
  'wedding-venues': 'Wedding Venues',
  'photographers': 'Wedding Photographers',
  'caterers': 'Wedding Caterers',
  'florists': 'Wedding Florists',
  'djs': 'DJs & Entertainment',
  'planners': 'Wedding Planners',
  'dress-shops': 'Wedding Dress Shops',
  'beauty': 'Beauty & Makeup Artists'
};

async function getLocationsByState(): Promise<Record<string, Location[]>> {
  try {
    const filePath = path.join(process.cwd(), 'locations.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const rows = fileContent.split('\n').slice(1); // Skip header
    
    const stateLocations: Record<string, Location[]> = {};

    rows.forEach(row => {
      const columns = row.split(',');
      if (columns.length >= 8) {
        const city = columns[0]?.replace(/"/g, '');
        const zipCode = columns[1]?.replace(/"/g, '');
        const state = columns[3]?.replace(/"/g, '');
        const latitude = columns[6]?.replace(/"/g, '');
        const longitude = columns[7]?.replace(/"/g, '');
        
        if (city && state) {
          if (!stateLocations[state]) {
            stateLocations[state] = [];
          }
          stateLocations[state].push({
            city,
            state,
            zipCode,
            latitude,
            longitude
          });
        }
      }
    });

    // Sort locations within each state by city name
    Object.values(stateLocations).forEach(locations => {
      locations.sort((a, b) => a.city.localeCompare(b.city));
    });

    return stateLocations;
  } catch (error) {
    console.error('Error reading locations:', error);
    return {};
  }
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const stateLocations = await getLocationsByState();
  const title = categoryTitles[params.category];

  if (!title) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/vendors"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
        >
          <svg 
            className="w-4 h-4 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Back to All Categories
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">{title}</h1>
        <p className="text-gray-600 mt-2">Browse {title.toLowerCase()} by location</p>
      </div>

      <div className="space-y-6 md:space-y-8">
        {Object.entries(stateLocations)
          .sort(([stateA], [stateB]) => stateA.localeCompare(stateB))
          .map(([state, locations]) => (
            <div key={state} className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4">{state}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {locations.map((location, index) => (
                  <div
                    key={`${location.city}-${index}`}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{location.city}</h3>
                      <p className="text-sm text-gray-500">
                        {location.zipCode}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
