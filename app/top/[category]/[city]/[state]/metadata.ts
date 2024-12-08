import { Metadata } from 'next';
import { PlacesService } from 'lib/services/places-service';

interface MetadataProps {
  params: {
    category: string;
    city: string;
    state: string;
  }
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { category, city, state } = params;
  const formattedCategory = category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  try {
    // Check if this category exists in this location
    const locations = await PlacesService.getValidLocations();
    const hasCategory = locations.some(
      loc => 
        loc.city.toLowerCase() === city.toLowerCase() && 
        loc.state.toLowerCase() === state.toLowerCase() &&
        loc.category.toLowerCase().includes(formattedCategory.toLowerCase())
    );

    if (!hasCategory) {
      return {
        title: `${formattedCategory} Not Available in ${city}, ${state}`,
        description: `Explore alternative wedding vendor categories available in ${city}, ${state}. Find the perfect vendors for your special day.`,
      };
    }

    return {
      title: `Top 10 ${formattedCategory} in ${city}, ${state} - Best Rated Venues`,
      description: `Discover the top 10 best rated ${formattedCategory.toLowerCase()} venues in ${city}, ${state}. Comprehensive reviews, ratings, and details to help plan your perfect wedding.`,
      openGraph: {
        title: `Top 10 ${formattedCategory} in ${city}, ${state}`,
        description: `Find the best ${formattedCategory.toLowerCase()} venues in ${city}, ${state}. Compare ratings, reviews, and amenities to make the perfect choice for your special day.`,
      }
    };
  } catch (error) {
    // Fallback metadata
    return {
      title: `Wedding Vendors in ${city}, ${state}`,
      description: `Find the perfect wedding vendors in ${city}, ${state}. Browse through our comprehensive directory of wedding professionals.`,
    };
  }
}
