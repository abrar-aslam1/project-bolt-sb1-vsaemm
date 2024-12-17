import { Metadata } from 'next';

interface GetStartedPageProps {
  params: Record<string, never>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export const metadata: Metadata = {
  title: 'Get Started | Wedding Vendors',
  description: 'Start planning your perfect wedding by creating your profile and connecting with trusted wedding vendors.',
};

export default function GetStartedPage({
  params,
  searchParams,
}: GetStartedPageProps) {
  return (
    <main className="container mx-auto px-4 py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Get Started with WeddingVendors</h1>
        
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <span className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                1
              </span>
              <h2 className="text-2xl font-semibold">Create Your Wedding Profile</h2>
            </div>
            <p className="text-gray-600 ml-12">
              Tell us about your wedding vision, preferred date, location, and budget. This helps us
              match you with the perfect vendors for your special day.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <span className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                2
              </span>
              <h2 className="text-2xl font-semibold">Browse Curated Vendors</h2>
            </div>
            <p className="text-gray-600 ml-12">
              Explore our carefully selected vendors across various categories. Read reviews,
              compare packages, and find the perfect match for your needs.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <span className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                3
              </span>
              <h2 className="text-2xl font-semibold">Connect with Vendors</h2>
            </div>
            <p className="text-gray-600 ml-12">
              Reach out to vendors directly through our platform. Schedule consultations,
              request quotes, and start planning your dream wedding.
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center pt-8">
            <button className="bg-pink-500 text-white px-8 py-3 rounded-lg hover:bg-pink-600 transition-colors text-lg font-medium">
              Create Your Profile
            </button>
            <p className="mt-4 text-gray-600">
              Join thousands of couples who found their perfect wedding vendors through our platform
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
