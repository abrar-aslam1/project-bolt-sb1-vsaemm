import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wedding Vendors by Location | Find Local Wedding Services',
  description: 'Browse wedding vendors across all 50 US states. Find local wedding venues, photographers, caterers, florists, DJs, planners, and more in your area.',
};

interface State {
  state_id: string;
  state_name: string;
  cities: string[];
  businesses: number;
}

async function getStateData(): Promise<State[]> {
  try {
    const filePath = path.join(process.cwd(), 'locations.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const rows = fileContent.split('\n').slice(1); // Skip header
    
    const statesMap = new Map<string, State>();
    
    rows.forEach(row => {
      if (!row.trim()) return; // Skip empty rows
      
      const columns = row.split(',');
      if (columns.length >= 4) {
        const stateId = columns[2]?.replace(/"/g, '');
        const stateName = columns[3]?.replace(/"/g, '');
        const city = columns[0]?.replace(/"/g, '');
        
        if (stateId && stateName) {
          if (!statesMap.has(stateId)) {
            statesMap.set(stateId, {
              state_id: stateId,
              state_name: stateName,
              cities: [],
              businesses: 0
            });
          }
          
          const state = statesMap.get(stateId)!;
          if (!state.cities.includes(city)) {
            state.cities.push(city);
          }
          state.businesses += 1;
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
  const states = await getStateData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Wedding Vendors by Location</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse wedding vendors across all 50 US states. Whether you're planning a destination wedding 
          or looking for local vendors, find the perfect match for your special day.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {states.map((state) => (
          <Link
            key={state.state_id}
            href={`/vendors/wedding-venues/${state.state_name.toLowerCase().replace(/\s+/g, '-')}`}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{state.state_name}</h2>
                <span className="text-sm text-gray-500">{state.state_id}</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>{state.cities.length} {state.cities.length === 1 ? 'City' : 'Cities'}</p>
                <p>{state.businesses} {state.businesses === 1 ? 'Business' : 'Businesses'}</p>
              </div>
              <div className="text-blue-600 text-sm flex items-center mt-2">
                View Vendors
                <svg 
                  className="w-4 h-4 ml-1" 
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
            </div>
          </Link>
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
