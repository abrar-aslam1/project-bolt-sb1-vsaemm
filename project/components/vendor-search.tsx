'use client';

import { useState } from 'react';
import { MapPin, ChevronDown, Search } from 'lucide-react';

const vendorCategories = [
  'All Categories',
  'Wedding Planners',
  'Photographers',
  'Florists',
  'DJs & Bands',
  'Caterers',
  'Venues',
  'Decorators'
];

export function VendorSearch() {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('All Categories');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Will be implemented in later phases
  };

  return (
    <section className="relative">
      <div className="absolute inset-0 wedding-gradient opacity-90" />
      <div className="relative py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6 text-center text-white">
            Find Your Perfect Wedding Vendors
          </h2>
          <p className="text-xl mb-12 text-center text-white/90 font-light max-w-2xl mx-auto">
            Discover and connect with top-rated professionals who will make your special day truly unforgettable
          </p>
          
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto backdrop-blur-sm bg-white/10 p-6 rounded-2xl shadow-xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/70 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter location (city, state, or zip code)"
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-foreground bg-card border border-border/50 
                    placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20
                    hover:border-primary/30 transition-all duration-300"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <select
                  className="appearance-none bg-card text-foreground w-full md:w-72 pl-4 pr-12 py-4 rounded-xl
                    border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20
                    hover:border-primary/30 transition-all duration-300"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {vendorCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary/70 w-5 h-5 pointer-events-none" />
              </div>
              
              <button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground py-4 px-8 rounded-xl
                  transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2
                  focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-white/80 text-sm">
              Popular searches: Wedding Venues, Photographers, Wedding Planners
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
