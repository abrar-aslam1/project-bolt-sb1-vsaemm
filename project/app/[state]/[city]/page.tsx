import { notFound } from 'next/navigation';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';

const BUSINESS_CATEGORIES = [
  { id: 'wedding-venues', name: 'Wedding Venues' },
  { id: 'photographers', name: 'Photographers' },
  { id: 'caterers', name: 'Caterers' },
  { id: 'florists', name: 'Florists' },
  { id: 'djs', name: 'DJs & Entertainment' },
  { id: 'planners', name: 'Wedding Planners' },
  { id: 'dress-shops', name: 'Dress Shops' },
  { id: 'beauty', name: 'Beauty & Makeup' }
];

async function getCityData(state: string, citySlug: string) {
  try {
    const filePath = path.join(process.cwd(), 'locations.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const rows = fileContent.split('\n').slice(1); // Skip header
    
    console.log('Looking for city with slug:', citySlug, 'in state:', state);
    
    for (const row of rows) {
      const columns = row.split(',');
      if (columns.length >= 8) {  // Ensure we have enough columns
        const cityName = columns[0]?.replace(/"/g, '');
        const stateName = columns[3]?.replace(/"/g, '');
        const lat = columns[6]?.replace(/"/g, '');
        const lng = columns[7]?.replace(/"/g, '');
        
        if (cityName && stateName && lat && lng) {
          const slug = cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          console.log('Checking city:', cityName, 'with generated slug:', slug);
          
          if (stateName.toLowerCase() === state.toLowerCase().replace(/-/g, ' ') &&
              slug === citySlug) {
            console.log('Found matching city:', cityName);
            return {
              city: cityName,
              state_name: stateName,
              lat,
              lng,
              slug
            };
          }
        }
      }
    }
    console.log('No matching city found');
    return null;
  } catch (error) {
    console.error('Error reading locations:', error);
    return null;
  }
}

export default async function CityPage({ 
  params 
}: { 
  params: { state: string; city: string } 
}) {
  console.log('City page params:', params);
  const cityData = await getCityData(params.state, params.city);

  if (!cityData) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href={`/${params.state}`}
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to {cityData.state_name}
        </Link>
        <h1 className="text-4xl font-bold">{cityData.city}</h1>
        <p className="text-gray-600 mt-2">Find local wedding vendors in {cityData.city}, {cityData.state_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {BUSINESS_CATEGORIES.map((category) => {
          const href = `/${params.state}/${cityData.slug}/${category.id}`;
          console.log('Generated category link:', href);
          return (
            <Link
              key={category.id}
              href={href}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{category.name}</h2>
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
