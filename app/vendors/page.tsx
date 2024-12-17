import { Metadata } from 'next';

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
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        <p className="text-gray-600">
          Please wait while we load the vendors.
        </p>
      </div>
    </div>
  );
}
