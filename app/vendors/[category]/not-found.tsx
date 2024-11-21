import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Category Not Found</h2>
        <p className="text-gray-600 mb-8">The vendor category you're looking for doesn't exist.</p>
        <Link 
          href="/vendors"
          className="text-blue-600 hover:text-blue-800"
        >
          View all vendor categories
        </Link>
      </div>
    </div>
  );
}
