'use client'
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Location Not Found</h1>
        <p className="text-gray-600 mb-8">
          {error.message === 'Location not found in our directory'
            ? 'Sorry, we couldn\'t find this location in our directory. Please check the URL and try again.'
            : 'Something went wrong while loading this page. Please try again later.'}
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-block bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
