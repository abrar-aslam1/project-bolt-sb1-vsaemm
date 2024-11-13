import { notFound } from 'next/navigation';
import { db } from '@/db';
import { vendors } from '@/db/schema';
import { eq } from 'drizzle-orm';
import VendorList from '@/components/vendors/VendorList';

const validCategories = [
  'wedding-planners',
  'photographers',
  'videographers',
  'florists',
  'caterers',
  'venues',
  'djs-bands',
  'cake-designers',
  'bridal-shops',
  'makeup-artists',
  'hair-stylists'
];

export default async function VendorCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  if (!validCategories.includes(params.category)) {
    notFound();
  }

  // Convert URL-friendly category to display format
  const displayCategory = params.category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const categoryVendors = await db
    .select()
    .from(vendors)
    .where(eq(vendors.category, displayCategory));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{displayCategory}</h1>
      <VendorList vendors={categoryVendors} />
    </div>
  );
}