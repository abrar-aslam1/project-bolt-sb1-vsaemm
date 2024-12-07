import SearchBar from '@/components/search-bar';
import VendorList from '@/components/vendors/VendorList';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q || '';

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
