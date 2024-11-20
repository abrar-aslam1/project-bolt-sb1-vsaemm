import { Suspense } from 'react';
import VendorList from '@/components/vendors/VendorList';
import VendorCategories from '@/components/vendors/VendorCategories';

export default function VendorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Vendors</h1>
      
      <div className="mb-8">
        <VendorCategories />
      </div>

      <Suspense fallback={<div>Loading vendors...</div>}>
        <VendorList />
      </Suspense>
    </div>
  );
}
