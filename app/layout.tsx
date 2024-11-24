import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MainNav from 'components/main-nav';
import { CookieConsent } from 'components/cookie-consent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://findmyweddingvendor.com'),
  title: 'Find My Wedding Vendor - Discover Local Wedding Professionals',
  description: 'Connect with exceptional wedding professionals to create unforgettable celebrations of love. Find trusted vendors, venues, and services for your perfect wedding day.',
  keywords: 'wedding vendors, wedding professionals, wedding planning, wedding venues, wedding services, find wedding vendors',
  authors: [{ name: 'Find My Wedding Vendor' }],
  creator: 'Find My Wedding Vendor',
  publisher: 'Find My Wedding Vendor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://findmyweddingvendor.com',
    title: 'Find My Wedding Vendor - Discover Local Wedding Professionals',
    description: 'Connect with exceptional wedding professionals to create unforgettable celebrations of love. Find trusted vendors, venues, and services for your perfect wedding day.',
    siteName: 'Find My Wedding Vendor',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Find My Wedding Vendor - Your Wedding Planning Partner'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find My Wedding Vendor - Discover Local Wedding Professionals',
    description: 'Connect with exceptional wedding professionals to create unforgettable celebrations of love.',
    images: ['/twitter-image.jpg'],
    creator: '@findmyweddingvendor',
    site: '@findmyweddingvendor',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://findmyweddingvendor.com'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <MainNav />
        <main className="pt-16">{children}</main>
        <CookieConsent />
        <footer className="bg-white border-t mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-gray-600">
              <p>© {new Date().getFullYear()} Find My Wedding Vendor. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
