import { Metadata } from 'next';
import SearchBar from '@/components/search-bar';
import VendorCategories from '@/components/vendors/VendorCategories';

export const metadata: Metadata = {
  title: 'Wedding Vendors | Find Local Wedding Services',
  description: 'Discover and connect with the best local wedding vendors. Find venues, photographers, caterers, florists, DJs, planners, dress shops, and beauty services for your perfect wedding day.',
  openGraph: {
    title: 'Wedding Vendors | Find Local Wedding Services',
    description: 'Discover and connect with the best local wedding vendors. Find venues, photographers, caterers, florists, DJs, planners, dress shops, and beauty services for your perfect wedding day.',
    type: 'website',
    siteName: 'WeddingVendors',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wedding Vendors | Find Local Wedding Services',
    description: 'Discover and connect with the best local wedding vendors. Find venues, photographers, caterers, florists, DJs, planners, dress shops, and beauty services for your perfect wedding day.',
  },
  alternates: {
    canonical: '/vendors',
  },
  keywords: [
    'wedding vendors',
    'wedding venues',
    'wedding photographers',
    'wedding caterers',
    'wedding florists',
    'wedding djs',
    'wedding planners',
    'wedding dresses',
    'wedding makeup',
    'wedding services',
    'local wedding vendors',
    'wedding planning'
  ],
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Wedding Vendors Directory</h1>
        <p className="text-xl text-gray-600 mb-8">
          Find and connect with the best local wedding vendors for your special day
        </p>
        <div className="max-w-2xl mx-auto">
          <SearchBar placeholder="Search for vendors by name, category, or location" />
        </div>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
        <VendorCategories />
      </section>

      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Why Choose Our Vendors?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
            <p className="text-gray-600">
              All our vendors are carefully vetted to ensure the highest quality of service for your special day.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Real Reviews</h3>
            <p className="text-gray-600">
              Read authentic reviews from couples who have worked with our vendors.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Easy Comparison</h3>
            <p className="text-gray-600">
              Compare vendors side by side to find the perfect match for your wedding.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
