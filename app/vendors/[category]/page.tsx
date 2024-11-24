import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { citiesByState } from '@/lib/locations';

const categoryTitles: Record<string, string> = {
  'wedding-venues': 'Wedding Venues',
  'photographers': 'Wedding Photographers',
  'caterers': 'Wedding Caterers',
  'florists': 'Wedding Florists',
  'djs': 'DJs & Entertainment',
  'planners': 'Wedding Planners',
  'dress-shops': 'Wedding Dress Shops',
  'beauty': 'Beauty & Makeup Artists'
};

const categoryDescriptions: Record<string, string> = {
  'wedding-venues': 'Find the perfect wedding venue for your special day. Browse top-rated wedding venues with photos, reviews, and detailed information.',
  'photographers': 'Discover talented wedding photographers who will capture your precious moments. View portfolios, packages, and reviews.',
  'caterers': 'Explore wedding catering services offering delicious menus for your reception. Compare options, pricing, and reviews.',
  'florists': 'Browse wedding florists creating stunning floral arrangements for ceremonies and receptions. View designs and get custom quotes.',
  'djs': 'Find experienced wedding DJs and entertainment services to keep your guests dancing all night. Read reviews and compare packages.',
  'planners': 'Connect with professional wedding planners who will make your dream wedding a reality. View portfolios and services.',
  'dress-shops': 'Explore bridal shops offering beautiful wedding dresses and accessories. Find your perfect dress with expert assistance.',
  'beauty': 'Discover wedding makeup artists and beauty professionals who will help you look stunning on your big day.'
};

export async function generateMetadata({ 
  params 
}: { 
  params: { category: string } 
}): Promise<Metadata> {
  const title = `${categoryTitles[params.category]} | Find Local Wedding Vendors`;
  const description = categoryDescriptions[params.category];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'WeddingVendors',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/vendors/${params.category}`,
    },
    keywords: [
      'wedding',
      params.category.replace('-', ' '),
      'wedding planning',
      'wedding services',
      'wedding vendors',
      ...Object.keys(citiesByState).map(state => `${state} wedding vendors`)
    ],
  };
}

export async function generateStaticParams() {
  return Object.keys(categoryTitles).map(category => ({
    category,
  }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const title = categoryTitles[params.category];

  if (!title) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/vendors"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
        >
          <svg 
            className="w-4 h-4 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Back to All Categories
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">{title}</h1>
        <p className="text-gray-600 mt-2">{categoryDescriptions[params.category]}</p>
        <p className="text-gray-600 mt-2">Browse {title.toLowerCase()} by location</p>
      </div>

      <div className="space-y-6 md:space-y-8">
        {Object.entries(citiesByState)
          .sort(([stateA], [stateB]) => stateA.localeCompare(stateB))
          .map(([state, cities]) => (
            <div key={state} className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{state}</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {cities.length} {cities.length === 1 ? 'city' : 'cities'} available
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {cities.map((city) => {
                  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <Link
                      key={city}
                      href={`/vendors/${params.category}/${citySlug}`}
                      className="group p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                    >
                      <div>
                        <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                          {city}
                        </h3>
                        <p className="text-sm text-gray-500 group-hover:text-blue-500 transition-colors">
                          Find {title.toLowerCase()} in {city}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
