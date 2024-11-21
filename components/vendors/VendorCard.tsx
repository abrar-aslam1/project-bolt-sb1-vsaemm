"use client";

import Link from 'next/link';
import type { Vendor } from '@/types';

interface VendorCardProps {
  vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
  const categorySlug = vendor.category.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="bg-card rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/50 backdrop-blur-sm">
      <div className="p-8">
        <h3 className="text-2xl font-playfair mb-3 font-semibold">
          <Link 
            href={`/vendors/${categorySlug}/${vendor.id}`}
            className="text-primary hover:wedding-text-gradient transition-all duration-300"
          >
            {vendor.name}
          </Link>
        </h3>
        
        <div className="mb-5 space-y-2">
          <div className="flex items-center text-muted-foreground group">
            <svg className="w-5 h-5 mr-3 group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
            </svg>
            <span className="font-medium">{vendor.category}</span>
          </div>
          <div className="flex items-center text-muted-foreground group">
            <svg className="w-5 h-5 mr-3 group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">{vendor.location}</span>
          </div>
        </div>
        
        {vendor.description && (
          <p className="text-muted-foreground mb-5 line-clamp-3 leading-relaxed">
            {vendor.description}
          </p>
        )}
        
        <div className="space-y-3 text-sm border-t border-border/50 pt-5">
          {vendor.phone && (
            <a href={`tel:${vendor.phone}`} className="flex items-center text-muted-foreground hover:text-primary transition-colors duration-300 group">
              <svg className="w-5 h-5 mr-3 group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-medium">{vendor.phone}</span>
            </a>
          )}
          {vendor.email && (
            <a href={`mailto:${vendor.email}`} className="flex items-center text-muted-foreground hover:text-primary transition-colors duration-300 group">
              <svg className="w-5 h-5 mr-3 group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{vendor.email}</span>
            </a>
          )}
          {vendor.website && (
            <a
              href={vendor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-muted-foreground hover:text-primary transition-colors duration-300 group"
            >
              <svg className="w-5 h-5 mr-3 group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="font-medium">Visit Website</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
