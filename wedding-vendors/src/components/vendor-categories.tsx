import Link from 'next/link';

const categories = [
  { name: 'Wedding Venues', slug: 'wedding-venues', type: 'Venue', description: 'Find local venues' },
  { name: 'Photographers', slug: 'photographers', type: 'Photographer', description: 'Find local photographers' },
  { name: 'Caterers', slug: 'caterers', type: 'Caterer', description: 'Find local caterers' },
  { name: 'Florists', slug: 'florists', type: 'Florist', description: 'Find local florists' },
  { name: 'DJs & Entertainment', slug: 'djs', type: 'DJ', description: 'Find local djs' },
  { name: 'Wedding Planners', slug: 'planners', type: 'Planner', description: 'Find local planners' },
  { name: 'Dress Shops', slug: 'dress-shops', type: 'Dress Shop', description: 'Find local dress shops' },
  { name: 'Beauty & Makeup', slug: 'beauty', type: 'Beauty', description: 'Find local beauty services' }
];

export default function VendorCategories() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/vendors/${category.slug}`}
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center flex flex-col items-center justify-center min-h-[120px] group"
        >
          <span className="text-lg font-medium text-gray-800 group-hover:text-pink-600 transition-colors">
            {category.name}
          </span>
          <span className="text-sm text-gray-500 mt-1">
            {category.description}
          </span>
        </Link>
      ))}
    </div>
  );
}
