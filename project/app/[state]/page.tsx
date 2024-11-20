import { notFound } from 'next/navigation';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';

async function getStateData(state: string) {
  try {
    const filePath = path.join(process.cwd(), 'locations.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const rows = fileContent.split('\n').slice(1); // Skip header
    
    console.log('State param:', state);
    
    const cities = rows
      .map(row => {
        const columns = row.split(',');
        if (columns.length >= 8) {  // Ensure we have enough columns
          const city = columns[0]?.replace(/"/g, '');
          const stateName = columns[3]?.replace(/"/g, '');
          const lat = columns[6]?.replace(/"/g, '');
          const lng = columns[7]?.replace(/"/g, '');
          
          if (city && stateName && lat && lng) {
            const slug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            console.log('Generated city slug:', slug, 'for city:', city);
            return {
              city,
              state_name: stateName,
              lat,
              lng,
              slug
            };
          }
        }
        return null;
      })
      .filter((location): location is NonNullable<typeof location> => {
        const matches = location !== null && 
          location.state_name.toLowerCase() === state.toLowerCase().replace(/-/g, ' ');
        if (matches) {
          console.log('Matched city:', location.city, 'with slug:', location.slug);
        }
        return matches;
      });

    if (cities.length === 0) {
      return null;
    }

    return {
      state_name: cities[0].state_name,
      cities: cities
    };
  } catch (error) {
    console.error('Error reading locations:', error);
    return null;
  }
}

export default async function StatePage({ params }: { params: { state: string } }) {
  const stateData = await getStateData(params.state);

  if (!stateData) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to States
        </Link>
        <h1 className="text-4xl font-bold">{stateData.state_name}</h1>
        <p className="text-gray-600 mt-2">Select a city to find local wedding vendors</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stateData.cities.map((city, index) => {
          const href = `/${params.state}/${city.slug}`;
          console.log('Generated city link:', href);
          return (
            <Link 
              key={`${city.city}-${index}`}
              href={href}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{city.city}</h2>
                  <p className="text-gray-600 text-sm">
                    {city.lat}, {city.lng}
                  </p>
                </div>
                <svg 
                  className="w-6 h-6 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
