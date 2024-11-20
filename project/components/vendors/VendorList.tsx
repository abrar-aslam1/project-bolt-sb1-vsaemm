"use client";

import { useEffect, useState } from 'react';
import VendorCard from './VendorCard';
import { useSearchParams } from 'next/navigation';
import type { Vendor } from '@/types';

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export default function VendorList() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const category = searchParams.get('category');
        const location = searchParams.get('location');
        const search = searchParams.get('search');
        const page = searchParams.get('page') || '1';

        const queryParams = new URLSearchParams({
          page,
          limit: '10',
          ...(category && category !== 'All Categories' && { category }),
          ...(location && { location }),
          ...(search && { search }),
        });

        const response = await fetch(`/api/vendors?${queryParams}`);
        const data = await response.json();

        if (response.ok) {
          setVendors(data.vendors);
          setPagination(data.pagination);
        } else {
          console.error('Error fetching vendors:', data.error);
        }
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="wedding-text-gradient text-3xl font-playfair animate-pulse">
            Finding Perfect Vendors
          </div>
          <p className="text-muted-foreground">Just a moment while we curate the best options for your special day...</p>
        </div>
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-8 rounded-xl bg-card border border-border/50">
          <div className="wedding-text-gradient text-3xl font-playfair mb-4">
            No Vendors Found
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We couldn't find any vendors matching your criteria. Try adjusting your search or explore different categories to discover the perfect match for your wedding day.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  );
}
