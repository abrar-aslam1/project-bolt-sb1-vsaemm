import { Metadata } from 'next';
import { PlacesService } from 'lib/services/places-service';

interface TopPlacesLayoutProps {
  params: {
    category: string;
    city: string;
    state: string;
  };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: TopPlacesLayoutProps): Promise<Metadata> {
  const { category, city, state } = params;
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

export default async function TopPlacesLayout({ children }: TopPlacesLayoutProps) {
  return <>{children}</>;
}
