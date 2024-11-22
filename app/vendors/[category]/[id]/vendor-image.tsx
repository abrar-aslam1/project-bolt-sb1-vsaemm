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
      <Image
        src={src || DEFAULT_PHOTO}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={isPriority}
        loading={isPriority ? 'eager' : 'lazy'}
      />
    </div>
  );
}
