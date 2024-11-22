import Image from 'next/image';

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=500&auto=format&fit=crop';

export interface VendorImageProps {
  src?: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
}

export function VendorImage({ src, alt, priority = false, className = "h-48" }: VendorImageProps) {
  // Always prioritize the default image since it's used as a fallback
  const imageUrl = src || DEFAULT_PHOTO;
  const shouldPrioritize = priority || imageUrl === DEFAULT_PHOTO;

  return (
    <div className={`relative w-full bg-gray-100 ${className}`}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={shouldPrioritize}
      />
    </div>
  );
}
