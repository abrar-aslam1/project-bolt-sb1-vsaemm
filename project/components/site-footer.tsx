import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">WeddingVendors connects couples with the best wedding professionals in their area.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/vendors" className="hover:text-accent transition-colors">Find Vendors</Link></li>
              <li><Link href="/ideas" className="hover:text-accent transition-colors">Wedding Ideas</Link></li>
              <li><Link href="/tools" className="hover:text-accent transition-colors">Planning Tools</Link></li>
              <li><Link href="/blog" className="hover:text-accent transition-colors">Wedding Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-sm">Email: info@weddingvendors.com</p>
            <p className="text-sm">Phone: (123) 456-7890</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-accent transition-colors">
                <Facebook className="w-6 h-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-accent transition-colors">
                <Instagram className="w-6 h-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-accent transition-colors">
                <Twitter className="w-6 h-6" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} WeddingVendors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}