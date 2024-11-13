import Link from 'next/link';

export default function VendorCategories({ categories }: { categories: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const urlCategory = category.toLowerCase().replace(/\s+/g, '-');
        
        return (
          <Link
            key={category}
            href={`/vendors/${urlCategory}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">{category}</h3>
            <p className="text-gray-600">Find top {category.toLowerCase()}</p>
          </Link>
        );
      })}
    </div>
  );
}