import Link from 'next/link';

const categories = [
  { name: 'Wedding Venues', slug: 'wedding-venues', type: 'Venue' },
  { name: 'Photographers', slug: 'photographers', type: 'Photographer' },
  { name: 'Caterers', slug: 'caterers', type: 'Caterer' },
  { name: 'Florists', slug: 'florists', type: 'Florist' },
  { name: 'DJs & Entertainment', slug: 'djs', type: 'DJ' },
  { name: 'Wedding Planners', slug: 'planners', type: 'Planner' },
  { name: 'Dress Shops', slug: 'dress-shops', type: 'Dress Shop' },
  { name: 'Beauty & Makeup', slug: 'beauty', type: 'Beauty' }
];

export default function VendorCategories() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/vendors/${category.slug}`}
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center flex flex-col items-center justify-center min-h-[120px]"
        >
          <span className="text-lg font-medium text-gray-800">{category.name}</span>
          <span className="text-sm text-gray-500 mt-1">Find local {category.type.toLowerCase()}s</span>
        </Link>
      ))}
    </div>
  );
}
