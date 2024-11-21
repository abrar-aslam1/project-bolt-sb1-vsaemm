import VendorCategories from '@/components/vendors/VendorCategories';
import SearchBar from '@/components/search-bar';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Wedding Vendors</h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover and connect with the best wedding professionals in your area
        </p>
        <div className="max-w-2xl mx-auto">
          <SearchBar placeholder="Search for vendors, categories, or locations..." />
        </div>
      </div>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
        <VendorCategories />
      </section>

      <section className="bg-pink-50 rounded-lg p-6 md:p-8 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Why Choose WeddingVendors?</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Trusted Professionals</h3>
              <p className="text-gray-600">Connect with experienced and reliable wedding vendors</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
              <p className="text-gray-600">Find the best vendors in your area with local knowledge</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Easy Planning</h3>
              <p className="text-gray-600">Streamline your wedding planning process with our tools</p>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Start Planning?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Browse our categories above to find your perfect wedding vendors
        </p>
        <button className="bg-pink-500 text-white px-8 py-3 rounded-lg hover:bg-pink-600 transition-colors">
          Get Started
        </button>
      </section>
    </main>
  );
}
