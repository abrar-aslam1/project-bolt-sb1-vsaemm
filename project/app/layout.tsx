import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WeddingVendors - Find Perfect Wedding Professionals',
  description: 'Discover top-rated wedding vendors for your special day. From photographers to planners, find the perfect professionals in your area.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="h-full min-h-screen bg-gradient-to-b from-background-start-rgb to-background-end-rgb">{children}</body>
    </html>
  );
}
