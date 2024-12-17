import Link from 'next/link';
import { Metadata } from 'next';

interface VendorsPageProps {
  params: Record<string, never>;
  searchParams: { [key: string]: string | string[] | undefined };
}

const categories = [
  {
    id: 'wedding-venues',
    title: 'Wedding Venues',
    description: 'Find the perfect venue for your special day',
    icon: '🏰'
  },
  {
    id: 'photographers',
    title: 'Wedding Photographers',
    description: 'Capture your precious moments',
    icon: '📸'
  },
  {
    id: 'caterers',
    title: 'Wedding Caterers',
    description: 'Delicious food for your reception',
    icon: '🍽️'
  },
  {
    id: 'florists',
    title: 'Wedding Florists',
    description: 'Beautiful floral arrangements',
    icon: '💐'
  },
  {
    id: 'djs',
    title: 'DJs & Entertainment',
    description: 'Keep your guests dancing all night',
    icon: '🎵'
  },
  {
    id: 'planners',
    title: 'Wedding Planners',
    description: 'Expert help planning your big day',
    icon: '📋'
  },
  {
    id: 'dress-shops',
    title: 'Wedding Dress Shops',
    description: 'Find your perfect wedding dress',
    icon: '👗'
  },
  {
    id: 'beauty',
    title: 'Beauty & Makeup',
    description: 'Look stunning on your wedding day',
    icon: '💄'
  }
];

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

export default function VendorsPage({
  params,
  searchParams,
}: VendorsPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Wedding Vendors</h1>
        <p className="text-gray-600 mt-2">
          Find and connect with trusted wedding vendors in your area
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/vendors/${category.id}`}
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="text-4xl mb-4">{category.icon}</div>
              <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
              <p className="text-gray-600">{category.description}</p>
              <div className="mt-4 text-blue-600 hover:text-blue-800">
                Browse {category.title.toLowerCase()} →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Why Choose Our Wedding Vendors?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Trusted Professionals</h3>
            <p className="text-gray-600">
              Connect with experienced vendors who have a proven track record of creating perfect weddings.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Local Expertise</h3>
            <p className="text-gray-600">
              Find vendors who know your area and can provide the best local wedding services.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Easy Comparison</h3>
            <p className="text-gray-600">
              Compare vendors, read reviews, and make informed decisions for your special day.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Planning?</h2>
        <p className="text-gray-600 mb-4">
          Choose a category above to browse vendors in your area, or get in touch with us for personalized recommendations.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contact Us for Help
        </Link>
      </div>
    </div>
  );
}
