import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import type { Vendor, Review } from '@/types';

interface VendorDetailPageProps {
  params: {
    category: string;
    id: string;
  };
}

async function getVendor(id: string): Promise<Vendor & { reviews: Review[] }> {
  const vendor = await db.get(
    'SELECT * FROM vendors WHERE id = ?',
    [id]
  );

  if (!vendor) {
    notFound();
  }

  const reviews = await db.query(
    'SELECT * FROM reviews WHERE vendor_id = ? ORDER BY created_at DESC',
    [id]
  );

  return {
    ...vendor,
    reviews
  };
}

export default async function VendorDetailPage({ params }: VendorDetailPageProps) {
  const vendor = await getVendor(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{vendor.name}</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <span className="w-24 font-medium">Category:</span>
                  {vendor.category}
                </p>
                <p className="flex items-center text-gray-600">
                  <span className="w-24 font-medium">Location:</span>
                  {vendor.location}
                </p>
                {vendor.phone && (
                  <p className="flex items-center text-gray-600">
                    <span className="w-24 font-medium">Phone:</span>
                    <a href={`tel:${vendor.phone}`} className="hover:text-blue-600">
                      {vendor.phone}
                    </a>
                  </p>
                )}
                {vendor.email && (
                  <p className="flex items-center text-gray-600">
                    <span className="w-24 font-medium">Email:</span>
                    <a href={`mailto:${vendor.email}`} className="hover:text-blue-600">
                      {vendor.email}
                    </a>
                  </p>
                )}
                {vendor.website && (
                  <p className="flex items-center text-gray-600">
                    <span className="w-24 font-medium">Website:</span>
                    <a
                      href={vendor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600"
                    >
                      Visit Website
                    </a>
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600">{vendor.description}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {vendor.reviews.length > 0 ? (
            <div className="space-y-4">
              {vendor.reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{review.user_name}</p>
                    <div className="flex items-center">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-600">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
