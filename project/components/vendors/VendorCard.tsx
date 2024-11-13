import { Vendor } from '@/types';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import Link from 'next/link';

export default function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{vendor.name}</h3>
      <div className="space-y-2 text-gray-600">
        <p className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {vendor.location}
        </p>
        {vendor.phone && (
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {vendor.phone}
          </p>
        )}
        {vendor.email && (
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <a
              href={`mailto:${vendor.email}`}
              className="text-primary hover:underline"
            >
              {vendor.email}
            </a>
          </p>
        )}
        {vendor.website && (
          <p className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <a
              href={vendor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Visit Website
            </a>
          </p>
        )}
      </div>
    </div>
  );
}