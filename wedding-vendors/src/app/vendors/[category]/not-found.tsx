import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Category Not Found</h2>
        <p className="text-gray-600 mb-8">
          The vendor category you&apos;re looking for doesn&apos;t exist. Please check the URL or browse our available categories.
        </p>
        <Link
          href="/vendors"
          className="inline-flex items-center text-pink-500 hover:text-pink-600"
        >
          <svg 
            className="w-4 h-4 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Back to All Categories
        </Link>
      </div>
    </div>
  );
}
