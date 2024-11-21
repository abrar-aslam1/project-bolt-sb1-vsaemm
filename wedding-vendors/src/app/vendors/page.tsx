import VendorCategories from '@/components/vendor-categories';
import SearchBar from '@/components/search-bar';

export default function VendorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Vendors</h1>
        <p className="text-xl text-gray-600 mb-8">
          Browse through our categories or search to find the perfect vendors for your wedding
        </p>
        <div className="max-w-2xl mx-auto">
          <SearchBar placeholder="Search vendors by name, category, or location..." />
        </div>
      </div>

      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
        <VendorCategories />
      </section>
    </div>
  );
}
