import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import VendorList from '@/components/vendors/VendorList';

const validCategories = [
  'wedding-planners',
  'photographers',
  'florists',
  'djs-bands',
  'caterers',
  'venues',
  'decorators'
];

export default async function CategoryPage({
  params
}: {
  params: { category: string }
}) {
  const category = params.category;
  
  if (!validCategories.includes(category)) {
    notFound();
  }

  // Convert URL-friendly category to display format
  const displayCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{displayCategory}</h1>
      <VendorList />
    </div>
  );
}

export async function generateStaticParams() {
  return validCategories.map((category) => ({
    category,
  }));
}
