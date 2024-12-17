import { Inter } from 'next/font/google';
import MainNav from '@/components/main-nav';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Wedding Vendors Directory | Find Local Wedding Services',
    template: '%s | Wedding Vendors Directory'
  },
  description: 'Find and connect with the best local wedding vendors for your special day. Browse venues, photographers, caterers, and more.',
  keywords: ['wedding vendors', 'wedding venues', 'wedding photographers', 'wedding planning'],
  authors: [{ name: 'Wedding Vendors Directory' }],
  creator: 'Wedding Vendors Directory',
  icons: {
    icon: [
      { url: 'https://cdn-icons-png.flaticon.com/32/2740/2740624.png', sizes: '32x32', type: 'image/png' },
      { url: 'https://cdn-icons-png.flaticon.com/16/2740/2740624.png', sizes: '16x16', type: 'image/png' }
    ]
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
        <link 
          rel="icon" 
          type="image/png" 
          sizes="32x32" 
          href="https://cdn-icons-png.flaticon.com/32/2740/2740624.png" 
        />
        <link 
          rel="icon" 
          type="image/png" 
          sizes="16x16" 
          href="https://cdn-icons-png.flaticon.com/16/2740/2740624.png" 
        />
      </head>
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <MainNav />
          <div className="flex-1 pt-16"> {/* Added pt-16 to account for the fixed navbar height */}
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
