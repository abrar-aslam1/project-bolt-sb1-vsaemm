import { Metadata } from 'next';
import SearchBar from '@/components/search-bar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Wedding Vendor Locations | Find Local Wedding Services',
  description: 'Browse wedding vendors by location. Find the best wedding services in your area.',
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Wedding Vendors Near You</h1>
        <p className="text-xl text-gray-600 mb-8">
          Browse wedding vendors by location to find the perfect services in your area
        </p>
        <div className="max-w-2xl mx-auto">
          <SearchBar placeholder="Search by city or state" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Popular Cities</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/vendors/new-york" className="text-blue-600 hover:underline">
                New York, NY
              </Link>
            </li>
            <li>
              <Link href="/vendors/los-angeles" className="text-blue-600 hover:underline">
                Los Angeles, CA
              </Link>
            </li>
            <li>
              <Link href="/vendors/chicago" className="text-blue-600 hover:underline">
                Chicago, IL
              </Link>
            </li>
            <li>
              <Link href="/vendors/houston" className="text-blue-600 hover:underline">
                Houston, TX
              </Link>
            </li>
            <li>
              <Link href="/vendors/miami" className="text-blue-600 hover:underline">
                Miami, FL
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Popular States</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/vendors/california" className="text-blue-600 hover:underline">
                California
              </Link>
            </li>
            <li>
              <Link href="/vendors/texas" className="text-blue-600 hover:underline">
                Texas
              </Link>
            </li>
            <li>
              <Link href="/vendors/florida" className="text-blue-600 hover:underline">
                Florida
              </Link>
            </li>
            <li>
              <Link href="/vendors/new-york" className="text-blue-600 hover:underline">
                New York
              </Link>
            </li>
            <li>
              <Link href="/vendors/illinois" className="text-blue-600 hover:underline">
                Illinois
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Featured Regions</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/vendors/northeast" className="text-blue-600 hover:underline">
                Northeast
              </Link>
            </li>
            <li>
              <Link href="/vendors/midwest" className="text-blue-600 hover:underline">
                Midwest
              </Link>
            </li>
            <li>
              <Link href="/vendors/south" className="text-blue-600 hover:underline">
                South
              </Link>
            </li>
            <li>
              <Link href="/vendors/west" className="text-blue-600 hover:underline">
                West
              </Link>
            </li>
            <li>
              <Link href="/vendors/pacific" className="text-blue-600 hover:underline">
                Pacific
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <section className="mt-12 bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Why Search by Location?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
            <p className="text-gray-600">
              Find vendors who know your area and have experience with local venues and conditions.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Convenience</h3>
            <p className="text-gray-600">
              Work with nearby vendors for easier meetings, tastings, and coordination.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Community Connection</h3>
            <p className="text-gray-600">
              Support local businesses and benefit from their established relationships.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
