import { MongoClient } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
            <p className="text-gray-600">
              Please wait while we fetch the vendor details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
