import { notFound } from 'next/navigation';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';

const BUSINESS_CATEGORIES = {
  'wedding-venues': 'Wedding Venues',
  'photographers': 'Photographers',
  'caterers': 'Caterers',
  'florists': 'Florists',
  'djs': 'DJs & Entertainment',
  'planners': 'Wedding Planners',
  'dress-shops': 'Dress Shops',
  'beauty': 'Beauty & Makeup'
} as const;

type CategoryId = keyof typeof BUSINESS_CATEGORIES;

async function getCityData(state: string, citySlug: string) {
  try {
    const filePath = path.join(process.cwd(), 'locations.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const rows = fileContent.split('\n').slice(1); // Skip header
    
    for (const row of rows) {
      const columns = row.split(',');
      if (columns.length >= 8) {  // Ensure we have enough columns
        const cityName = columns[0]?.replace(/"/g, '');
        const stateName = columns[3]?.replace(/"/g, '');
        const lat = columns[6]?.replace(/"/g, '');
        const lng = columns[7]?.replace(/"/g, '');
        
        if (cityName && stateName && lat && lng) {
          const slug = cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          if (stateName.toLowerCase() === state.toLowerCase().replace(/-/g, ' ') &&
              slug === citySlug) {
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
    return null;
  } catch (error) {
    console.error('Error reading locations:', error);
    return null;
  }
}

export default async function CategoryPage({ 
  params 
}: { 
  params: { state: string; city: string; category: string } 
}) {
  const cityData = await getCityData(params.state, params.city);
  const categoryName = BUSINESS_CATEGORIES[params.category as CategoryId];

  if (!cityData || !categoryName) {
    notFound();
  }

  // This is where you would fetch actual business listings for the category
  // For now, we'll show a placeholder message
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href={`/${params.state}/${params.city}`}
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to {cityData.city}
        </Link>
        <h1 className="text-4xl font-bold">{categoryName}</h1>
        <p className="text-gray-600 mt-2">
          Browse {categoryName.toLowerCase()} in {cityData.city}, {cityData.state_name}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
        <p className="text-gray-600">
          We're currently gathering the best {categoryName.toLowerCase()} in {cityData.city}. 
          Check back soon to discover amazing wedding vendors in your area!
        </p>
      </div>
    </div>
  );
}
