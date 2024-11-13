import { db } from '@/db';
import { vendors } from '@/db/schema';
import VendorCategories from '@/components/vendors/VendorCategories';

export default async function VendorsPage() {
  const allVendors = await db.select().from(vendors);
  
  // Get unique categories
  const categories = [...new Set(allVendors.map(vendor => vendor.category))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Wedding Vendors</h1>
      <VendorCategories categories={categories} />
    </div>
  );
}