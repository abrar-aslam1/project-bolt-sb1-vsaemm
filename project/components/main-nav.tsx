import Link from 'next/link';
import { Heart } from 'lucide-react';

export function MainNav() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-primary" />
          <span className="text-3xl font-bold text-primary">WeddingVendors</span>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link></li>
            <li><Link href="/vendors" className="text-gray-600 hover:text-primary transition-colors">Vendors</Link></li>
            <li><Link href="/blog" className="text-gray-600 hover:text-primary transition-colors">Blog</Link></li>
            <li><Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}