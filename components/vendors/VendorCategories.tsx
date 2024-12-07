import Link from 'next/link';

const categories = [
  {
    id: 'venues',
    name: 'Venues',
    description: 'Wedding venues and reception locations',
    icon: '🏰'
  },
  {
    id: 'photographers',
    name: 'Photographers',
    description: 'Wedding photographers and videographers',
    icon: '📸'
  },
  {
    id: 'catering',
    name: 'Catering',
    description: 'Wedding catering and food services',
    icon: '🍽️'
  },
  {
    id: 'florists',
    name: 'Florists',
    description: 'Wedding flowers and decorations',
    icon: '💐'
  },
  {
    id: 'music',
    name: 'Music',
    description: 'DJs, bands, and entertainment',
    icon: '🎵'
  },
  {
    id: 'planners',
    name: 'Planners',
    description: 'Wedding planners and coordinators',
    icon: '📋'
  }
];

export default function VendorCategories() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/vendors/${category.id}`}
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
        >
          <div className="flex items-center space-x-4">
            <span className="text-4xl">{category.icon}</span>
            <div>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
