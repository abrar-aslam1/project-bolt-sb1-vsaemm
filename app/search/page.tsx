import { Metadata } from 'next';
import SearchBar from '@/components/search-bar';
import VendorList from '@/components/vendors/VendorList';

interface SearchPageProps {
  params: Record<string, never>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export const metadata: Metadata = {
  title: 'Search Wedding Vendors',
  description: 'Search for wedding vendors, venues, photographers, and more.',
};

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar placeholder="Search for vendors, categories, or locations..." />
      </div>

      <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
      <p className="text-gray-600 mb-8">
        Showing results for your search. You can refine your search or browse our categories below.
      </p>

      <VendorList query={query} />
    </div>
  );
}
