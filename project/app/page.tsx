import { Search, MapPin, ChevronDown } from 'lucide-react';
import { VendorSearch } from '@/components/vendor-search';
import { CategoryGrid } from '@/components/category-grid';
import { WhyChooseUs } from '@/components/why-choose-us';
import { MainNav } from '@/components/main-nav';
import { SiteFooter } from '@/components/site-footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-grow">
        <VendorSearch />
        <CategoryGrid />
        <WhyChooseUs />
      </main>
      <SiteFooter />
    </div>
  );
}
