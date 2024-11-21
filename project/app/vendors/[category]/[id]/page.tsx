import { notFound } from 'next/navigation';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';

interface VendorDetails {
  business: string;
  category: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: string;
  longitude: string;
}

const categoryMap: Record<string, string[]> = {
  'wedding-venues': ['Wedding Venue', 'Venue'],
  'photographers': ['Wedding Photographer', 'Photographer'],
  'caterers': ['Wedding Caterer', 'Caterer'],
  'florists': ['Wedding Florist', 'Florist'],
  'djs': ['Wedding DJ', 'DJ', 'Entertainment'],
  'planners': ['Wedding Planner', 'Planner'],
  'dress-shops': ['Bridal Shop', 'Dress Shop'],
  'beauty': ['Makeup Artist', 'Hair Stylist', 'Beauty']
};

async function getVendorDetails(category: string, id: string): Promise<VendorDetails | null> {
  try {
    const filePath = path.join(process.cwd(), 'locations.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const rows = fileContent.split('\n').slice(1); // Skip header
    
    const validCategories = categoryMap[category];
    if (!validCategories) {
      return null;
    }

    for (const row of rows) {
      const columns = row.split(',');
      if (columns.length >= 8) {
        const city = columns[0]?.replace(/"/g, '');
        const zipCode = columns[1]?.replace(/"/g, '');
        const state = columns[3]?.replace(/"/g, '');
        const business = columns[4]?.replace(/"/g, '');
        const vendorCategory = columns[5]?.replace(/"/g, '');
        const latitude = columns[6]?.replace(/"/g, '');
        const longitude = columns[7]?.replace(/"/g, '');
        
        if (city && state && business && validCategories.includes(vendorCategory)) {
          const businessSlug = business.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          
          if (businessSlug === id) {
            return {
              business,
              category: vendorCategory,
              city,
              state,
              zipCode,
              latitude,
              longitude
            };
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error reading vendor details:', error);
    return null;
  }
}

export default async function VendorPage({ params }: { params: { category: string; id: string } }) {
  const vendorDetails = await getVendorDetails(params.category, params.id);

  if (!vendorDetails) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href={`/vendors/${params.category}`}
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to {params.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </Link>
        <h1 className="text-4xl font-bold">{vendorDetails.business}</h1>
        <p className="text-gray-600 mt-2">{vendorDetails.category} in {vendorDetails.city}, {vendorDetails.state}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Location Details</h2>
            <div className="space-y-2">
              <p><strong>Address:</strong> {vendorDetails.city}, {vendorDetails.state} {vendorDetails.zipCode}</p>
              <p><strong>Coordinates:</strong> {vendorDetails.latitude}, {vendorDetails.longitude}</p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-2">
              <p>Contact information coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
