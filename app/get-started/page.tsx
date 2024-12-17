import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Get Started | Wedding Vendors Directory',
  description: 'Start planning your perfect wedding with our comprehensive guide. Learn how to find and book the best wedding vendors for your special day.',
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get Started with Wedding Planning</h1>
          <p className="text-xl text-gray-600">
            Your step-by-step guide to finding and booking the perfect wedding vendors
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-6">1. Define Your Wedding Vision</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">✓</span>
                  <div>
                    <h3 className="font-medium">Set Your Budget</h3>
                    <p className="text-gray-600">Determine how much you want to spend on each vendor category</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">✓</span>
                  <div>
                    <h3 className="font-medium">Choose Your Style</h3>
                    <p className="text-gray-600">Decide on your wedding theme and overall aesthetic</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">✓</span>
                  <div>
                    <h3 className="font-medium">Pick Your Date</h3>
                    <p className="text-gray-600">Select your wedding date or preferred season</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">2. Find Your Vendors</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Essential Vendors</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Venue</li>
                    <li>• Photographer</li>
                    <li>• Caterer</li>
                    <li>• Florist</li>
                    <li>• DJ/Band</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Additional Services</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Wedding Planner</li>
                    <li>• Videographer</li>
                    <li>• Hair & Makeup</li>
                    <li>• Transportation</li>
                    <li>• Rentals</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6">
                <Link 
                  href="/vendors" 
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Vendors
                </Link>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">3. Compare & Book</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-blue-500 mr-3">1.</span>
                  <p className="text-gray-600">Read reviews and compare vendors in your area</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-3">2.</span>
                  <p className="text-gray-600">Contact multiple vendors to get quotes and check availability</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-3">3.</span>
                  <p className="text-gray-600">Schedule meetings or tastings to make your final decision</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-3">4.</span>
                  <p className="text-gray-600">Review and sign contracts to secure your vendors</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Our team is here to assist you every step of the way
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
