import { Metadata } from 'next';
import SearchResults from '@/components/search/search-results';

export const metadata: Metadata = {
  title: 'Search Wedding Vendors | Find Local Wedding Services',
  description: 'Search and find the perfect wedding vendors for your special day. Browse through our curated list of professional wedding services.',
};

export default function Page() {
  return <SearchResults />;
}
