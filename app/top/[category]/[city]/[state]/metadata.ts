import { Metadata } from 'next';

interface PageParams {
  category: string;
  city: string;
  state: string;
}

interface PageSearchParams {
  [key: string]: string | string[] | undefined;
}

interface Props {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { category, city, state } = resolvedParams;
  const formattedCategory = category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return {
    title: `Top 10 ${formattedCategory} in ${city}, ${state} - Best Rated Venues`,
    description: `Discover the top 10 best rated ${formattedCategory.toLowerCase()} venues in ${city}, ${state}. Comprehensive reviews, ratings, and details to help plan your perfect wedding.`,
    openGraph: {
      title: `Top 10 ${formattedCategory} in ${city}, ${state}`,
      description: `Find the best ${formattedCategory.toLowerCase()} venues in ${city}, ${state}. Compare ratings, reviews, and amenities to make the perfect choice for your special day.`,
    }
  };
}
