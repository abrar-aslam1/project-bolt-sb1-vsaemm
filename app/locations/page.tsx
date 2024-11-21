import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';

async function getUniqueStates() {
  try {
    const filePath = path.join(process.cwd(), 'locations.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const rows = fileContent.split('\n').slice(1); // Skip header
    
    const statesMap = new Map();
    
    rows.forEach(row => {
      const columns = row.split(',');
      if (columns.length >= 4) {  // Ensure we have enough columns
        const stateId = columns[2]?.replace(/"/g, '');
        const stateName = columns[3]?.replace(/"/g, '');
        
        if (stateId && stateName) {
          statesMap.set(stateId, {
            state_id: stateId,
            state_name: stateName
          });
        }
      }
    });

    return Array.from(statesMap.values())
      .sort((a, b) => a.state_name.localeCompare(b.state_name));
  } catch (error) {
    console.error('Error reading locations:', error);
    return [];
  }
}

export default async function LocationsPage() {
  const states = await getUniqueStates();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Wedding Vendors by Location</h1>
        <p className="text-gray-600">
          Browse wedding vendors by state and city to find the perfect match for your special day
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {states.map((state) => (
          <Link
            key={state.state_id}
            href={`/${state.state_name.toLowerCase().replace(/ /g, '-')}`}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{state.state_name}</h2>
                <p className="text-gray-600 text-sm">{state.state_id}</p>
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
        ))}
      </div>
    </div>
  );
}
