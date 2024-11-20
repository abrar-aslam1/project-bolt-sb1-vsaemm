"use client";

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const categories = [
  'All Categories',
  'Wedding Planners',
  'Photographers',
  'Florists',
  'DJs & Bands',
  'Caterers',
  'Venues',
  'Decorators'
];

export default function VendorCategories() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const currentCategory = searchParams.get('category') || 'All Categories';

  const handleCategoryChange = (category: string) => {
    const query = createQueryString('category', category);
    router.push(`/vendors?${query}`);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-10">
      <div className="w-full">
        <h2 className="font-playfair text-2xl mb-6 wedding-text-gradient">Browse by Category</h2>
      </div>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={`
            px-6 py-3 rounded-full text-sm font-medium transition-all duration-300
            border backdrop-blur-sm
            ${
              currentCategory === category
                ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                : 'bg-card/50 text-muted-foreground border-border/50 hover:border-primary/50 hover:text-primary hover:scale-105'
            }
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background
          `}
        >
          <span className="relative">
            {category}
            {currentCategory === category && (
              <span className="absolute inset-x-0 -bottom-px h-px bg-current opacity-50" />
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
