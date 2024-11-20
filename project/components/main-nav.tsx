import Link from 'next/link';
import { Heart } from 'lucide-react';

export function MainNav() {
  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link 
            href="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <Heart className="h-8 w-8 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:blur-2xl transition-all duration-300" />
            </div>
            <span className="text-2xl font-playfair font-bold wedding-text-gradient">
              WeddingVendors
            </span>
          </Link>

          <nav className="hidden md:block">
            <ul className="flex items-center space-x-8">
              {[
                { href: '/', label: 'Home' },
                { href: '/vendors', label: 'Vendors' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact' }
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link 
                    href={href} 
                    className="relative group py-2"
                  >
                    <span className="text-muted-foreground group-hover:text-primary transition-colors duration-300">
                      {label}
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/get-started"
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full
                    hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl
                    hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </nav>

          <button className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors duration-300">
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
