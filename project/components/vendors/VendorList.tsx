import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';

interface Location {
  city: string;
  state: string;
  stateSlug: string;
  citySlug: string;
  zipCode: string;
  vendors: {
    business: string;
    category: string;
    url: string;
  }[];
}

async function getLocationsWithVendors(): Promise<Location[]> {
  try {
    const filePath = path.join(process.cwd(), 'locations.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const rows = fileContent.split('\n').slice(1); // Skip header
    
    const locationMap = new Map<string, Location>();
    
    rows.forEach(row => {
      const columns = row.split(',');
      if (columns.length >= 8) {
        const city = columns[0]?.replace(/"/g, '');
        const state = columns[3]?.replace(/"/g, '');
        const zipCode = columns[1]?.replace(/"/g, '');
        const business = columns[4]?.replace(/"/g, '');
        const category = columns[5]?.replace(/"/g, '');
        
        if (city && state && zipCode && business && category) {
          const key = `${city}-${state}`;
          const stateSlug = state.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const businessSlug = business.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          
          if (!locationMap.has(key)) {
            locationMap.set(key, {
              city,
              state,
              stateSlug,
              citySlug,
              zipCode,
              vendors: []
            });
          }
          
          const location = locationMap.get(key)!;
          location.vendors.push({
            business,
            category,
            url: `/vendors/${categorySlug}/${businessSlug}`
          });
        }
      }
    });

    return Array.from(locationMap.values())
      .sort((a, b) => {
        // Sort by state first, then by city
        const stateCompare = a.state.localeCompare(b.state);
        if (stateCompare !== 0) return stateCompare;
        return a.city.localeCompare(b.city);
      });
  } catch (error) {
    console.error('Error reading locations:', error);
    return [];
  }
}

export default async function VendorList() {
  const locations = await getLocationsWithVendors();
  const stateGroups = locations.reduce((groups, location) => {
    if (!groups[location.state]) {
      groups[location.state] = [];
    }
    groups[location.state].push(location);
    return groups;
  }, {} as Record<string, Location[]>);

  return (
    <div className="space-y-8">
      {Object.entries(stateGroups).map(([state, locations]) => (
        <div key={state} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">{state}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <div
                key={`${location.city}-${location.zipCode}`}
                className="block p-4 bg-gray-50 rounded-lg"
              >
                <h3 className="text-lg font-semibold mb-2">{location.city}</h3>
                <div className="space-y-1">
                  {location.vendors.map((vendor, index) => (
                    <Link
                      key={`${vendor.business}-${index}`}
                      href={vendor.url}
                      className="block text-blue-600 hover:text-blue-800"
                    >
                      {vendor.business} ({vendor.category})
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
