import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Location {
  city: string;
  state_name: string;
  business?: string;
  category?: string;
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

async function getLocationsByState(category: string): Promise<Record<string, Location[]>> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/data/locations.csv`);
    const fileContent = await response.text();
    const rows = fileContent.split('\n').slice(1); // Skip header
    
    const stateLocations: Record<string, Location[]> = {};
    const categoryPattern = new RegExp(category.replace(/-/g, ' '), 'i');

    rows.forEach(row => {
      const columns = row.split(',');
      if (columns.length >= 7) {
        const city = columns[0]?.replace(/"/g, '');
        const state_name = columns[1]?.replace(/"/g, '');
        const business = columns[3]?.replace(/"/g, '');
        const category = columns[4]?.replace(/"/g, '');
        
        if (city && state_name && categoryPattern.test(category)) {
          if (!stateLocations[state_name]) {
            stateLocations[state_name] = [];
          }
          stateLocations[state_name].push({
            city,
            state_name,
            business,
            category
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
  const title = categoryTitles[params.category];

  if (!title) {
    notFound();
  }

  const stateLocations = await getLocationsByState(params.category);

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
                      {location.business && (
                        <p className="text-gray-600 text-sm mb-1">{location.business}</p>
                      )}
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
