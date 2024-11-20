import './globals.css';
import { MainNav } from '@/components/main-nav';
import { SiteFooter } from '@/components/site-footer';

export const metadata = {
  title: 'Wedding Vendors - Find Local Wedding Services',
  description: 'Find and connect with the best wedding vendors in your area.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <MainNav />
          <main className="flex-grow">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
