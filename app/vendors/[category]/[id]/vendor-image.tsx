'use client';

import Image from 'next/image';

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=500&auto=format&fit=crop';

interface VendorImageProps {
  src?: string | null;
  alt: string;
  isPriority?: boolean;
}

export function VendorImage({ src, alt, isPriority = false }: VendorImageProps) {
  return (
    <div className="relative h-48 w-full bg-gray-100">
      {src || DEFAULT_PHOTO ? (
        <Image
          src={src || DEFAULT_PHOTO}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={isPriority}
          onError={(e: any) => {
            e.target.src = DEFAULT_PHOTO;
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <span className="text-gray-400">{alt}</span>
        </div>
      )}
    </div>
  );
}
