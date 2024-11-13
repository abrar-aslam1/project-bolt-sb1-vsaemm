'use client';

import { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { vendorCategories } from '@/lib/constants';

export function VendorSearch() {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('All Categories');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Will be implemented in later phases
  };

  return (
    <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Find the Perfect Wedding Vendors</h2>
        <p className="text-xl mb-8 text-center">Discover top-rated professionals for your special day</p>
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter location (city, state, or zip code)"
                className="w-full pl-10 pr-4 py-3 rounded-md text-gray-800"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="appearance-none bg-white text-gray-800 w-full md:w-64 pl-4 pr-10 py-3 rounded-md"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {vendorCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <button type="submit" className="bg-accent hover:bg-accent/90 text-white py-3 px-6 rounded-md transition duration-300">
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}