import Link from 'next/link';
import { Facebook, Instagram, Twitter, Heart } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="py-16">
          <div className="flex flex-col items-center mb-12">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-playfair font-bold wedding-text-gradient">WeddingVendors</span>
            </Link>
            <p className="text-muted-foreground text-center max-w-md">
              Connecting couples with exceptional wedding professionals to create unforgettable celebrations of love.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
            <div>
              <h3 className="font-playfair text-lg font-semibold mb-6 wedding-text-gradient">About Us</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                WeddingVendors is dedicated to making your wedding planning journey as beautiful as your special day. We connect couples with the finest wedding professionals in their area.
              </p>
            </div>

            <div>
              <h3 className="font-playfair text-lg font-semibold mb-6 wedding-text-gradient">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                {[
                  { href: '/vendors', label: 'Find Vendors' },
                  { href: '/ideas', label: 'Wedding Ideas' },
                  { href: '/tools', label: 'Planning Tools' },
                  { href: '/blog', label: 'Wedding Blog' }
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link 
                      href={href} 
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center group"
                    >
                      <span className="absolute w-0 group-hover:w-2 h-0.5 bg-primary -left-4 transition-all duration-300" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-playfair text-lg font-semibold mb-6 wedding-text-gradient">Contact</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@weddingvendors.com
                </p>
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (123) 456-7890
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-playfair text-lg font-semibold mb-6 wedding-text-gradient">Follow Us</h3>
              <div className="flex space-x-4">
                {[
                  { href: '#', icon: Facebook, label: 'Facebook' },
                  { href: '#', icon: Instagram, label: 'Instagram' },
                  { href: '#', icon: Twitter, label: 'Twitter' }
                ].map(({ href, icon: Icon, label }) => (
                  <Link 
                    key={label}
                    href={href} 
                    className="bg-secondary/50 p-2 rounded-full hover:bg-primary/10 hover:text-primary
                      transition-all duration-300 group"
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="sr-only">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} WeddingVendors. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
