'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

interface LocationSuggestion {
  id: string;
  label: string;
  city: string;
  state: string;
}

export function VendorSearch() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [category, setCategory] = useState('All Categories');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchInput.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`/api/locations?q=${encodeURIComponent(searchInput)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  const handleLocationSelect = (location: string) => {
    if (!selectedLocations.includes(location)) {
      setSelectedLocations([...selectedLocations, location]);
    }
    setSearchInput('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const removeLocation = (locationToRemove: string) => {
    setSelectedLocations(selectedLocations.filter(loc => loc !== locationToRemove));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const queryParams = new URLSearchParams();
    if (category !== 'All Categories') {
      queryParams.set('category', category);
    }
    
    if (selectedLocations.length > 0) {
      queryParams.set('locations', selectedLocations.join(','));
    }
    
    router.push(`/vendors${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
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
                <MapPin className="absolute left-4 top-4 text-primary/70 w-5 h-5" />
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for cities..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-foreground bg-card border border-border/50 
                      placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20
                      hover:border-primary/30 transition-all duration-300"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      setShowSuggestions(true);
                    }}
                  />
                  
                  {/* Location suggestions dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div 
                      ref={suggestionsRef}
                      className="absolute z-10 w-full mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                    >
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          className="w-full px-4 py-2 text-left hover:bg-primary/10 focus:bg-primary/10 
                            focus:outline-none transition-colors duration-200"
                          onClick={() => handleLocationSelect(suggestion.label)}
                        >
                          {suggestion.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected locations tags */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedLocations.map((location) => (
                    <span
                      key={location}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-white 
                        rounded-full text-sm"
                    >
                      {location}
                      <button
                        type="button"
                        onClick={() => removeLocation(location)}
                        className="hover:text-primary/80 focus:outline-none"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
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
          
          <div className="mt-12 text-center">
            <p className="text-white/80 text-sm">
              Popular searches: Wedding Venues, Photographers, Wedding Planners
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
