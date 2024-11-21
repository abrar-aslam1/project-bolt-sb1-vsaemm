import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MainNav from '@/components/main-nav';
import { CookieConsent } from '@/components/cookie-consent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WeddingVendors - Find Local Wedding Professionals',
  description: 'Connect with exceptional wedding professionals to create unforgettable celebrations of love.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainNav />
        <main className="pt-16">{children}</main>
        <CookieConsent />
        <footer className="bg-white border-t mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-gray-600">
              <p>© {new Date().getFullYear()} WeddingVendors. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
