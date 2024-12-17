import Link from 'next/link';

interface Vendor {
  id: string;
  name: string;
  category?: string;
  description: string;
  location: string;
  rating: number;
  website?: string;
  image?: string;
}

interface VendorCardProps {
  vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
  // Convert category to lowercase and handle spaces/special characters
  const categorySlug = vendor.category?.toLowerCase().replace(/\s+/g, '-') || 'venue';
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden">
      {vendor.website ? (
        <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="block p-4">
          <VendorCardContent vendor={vendor} />
        </a>
      ) : (
        <div className="p-4">
          <VendorCardContent vendor={vendor} />
        </div>
      )}
    </div>
  );
}

function VendorCardContent({ vendor }: VendorCardProps) {
  return (
    <>
      {vendor.image && (
        <div className="mb-4 aspect-video relative overflow-hidden rounded-lg">
          <img
            src={vendor.image}
            alt={vendor.name}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{vendor.name}</h3>
      <p className="text-gray-600 mb-2">{vendor.location}</p>
      <div className="flex items-center mb-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i < vendor.rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="ml-2 text-gray-600">{vendor.rating.toFixed(1)}</span>
      </div>
      <p className="text-gray-600 line-clamp-2">{vendor.description}</p>
    </>
  );
}
