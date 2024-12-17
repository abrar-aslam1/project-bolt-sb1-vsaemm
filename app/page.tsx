import Link from 'next/link';
import VendorCategories from '@/components/vendors/VendorCategories';
import SearchBar from '@/components/search-bar';

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Wedding Vendors</h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with the best local wedding professionals for your special day
        </p>
        <SearchBar placeholder="Search for vendors..." />
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
        <VendorCategories />
      </section>

      <section className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Why Choose Us</h2>
          <ul className="space-y-3">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Verified Local Vendors
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Real Customer Reviews
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Easy Comparison Tools
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Free to Use
            </li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Get Started Today</h2>
          <p className="text-gray-600 mb-4">
            Ready to start planning your perfect wedding? Browse our curated list of top-rated vendors in your area.
          </p>
          <Link 
            href="/get-started" 
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Start Planning
          </Link>
        </div>
      </section>

      <section className="text-center bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
        <p className="text-gray-600 mb-4">
          Our team is here to assist you in finding the perfect vendors for your wedding day.
        </p>
        <Link 
          href="/contact" 
          className="inline-block bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Contact Us
        </Link>
      </section>
    </div>
  );
}
