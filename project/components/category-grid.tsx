import Link from 'next/link';
import { vendorCategories } from '@/lib/constants';

export function CategoryGrid() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Popular Vendor Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {vendorCategories.slice(1).map((category) => (
            <Link
              key={category}
              href={`/vendors/${category.toLowerCase().replace(/\s+/g, '-')}`}
              className="group bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition duration-300"
            >
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{category}</h3>
              <p className="text-gray-600">Find top {category.toLowerCase()}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}