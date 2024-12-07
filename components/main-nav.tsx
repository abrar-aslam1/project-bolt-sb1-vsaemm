import Link from 'next/link';

export default function MainNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-pink-500">
            WeddingVendors
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/vendors" className="text-gray-600 hover:text-pink-500">
              Browse Vendors
            </Link>
            <Link href="/locations" className="text-gray-600 hover:text-pink-500">
              Locations
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-pink-500">
              Contact
            </Link>
            <Link href="/get-started" className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
