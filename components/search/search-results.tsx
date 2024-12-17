'use client';

import SearchBar from '@/components/search-bar';
import VendorList from '@/components/vendors/VendorList';
import { useSearchParams } from 'next/navigation';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Search Wedding Vendors</h1>
        <p className="text-xl text-gray-600 mb-8">
          Find the perfect vendors for your wedding day
        </p>
        <div className="max-w-2xl mx-auto">
          <SearchBar placeholder="Search by vendor name, category, or location" />
        </div>
      </div>

      {query ? (
        <>
          <h2 className="text-2xl font-semibold mb-6">
            Search Results for "{query}"
          </h2>
          <VendorList query={query} />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            Enter a search term to find wedding vendors
          </p>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Search by Name</h3>
              <p className="text-gray-600">
                Find specific vendors you've heard about
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Search by Category</h3>
              <p className="text-gray-600">
                Browse vendors by service type
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Search by Location</h3>
              <p className="text-gray-600">
                Find vendors in your area
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
