import { Metadata } from 'next';

interface BlogPageProps {
  params: Record<string, never>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export const metadata: Metadata = {
  title: 'Blog | Wedding Vendors',
  description: 'Coming soon - Wedding planning tips, vendor spotlights, and inspiration for your special day.',
  openGraph: {
    title: 'Blog | Wedding Vendors',
    description: 'Coming soon - Wedding planning tips, vendor spotlights, and inspiration for your special day.',
    type: 'website',
    siteName: 'WeddingVendors',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wedding Vendors Blog',
    description: 'Coming soon - Wedding planning tips, vendor spotlights, and inspiration for your special day.',
  },
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogPage({
  params,
  searchParams,
}: BlogPageProps) {
  return (
    <main className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid gap-8">
        <article className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-gray-600">
            Our blog section is currently under development. Check back soon for wedding planning tips,
            vendor spotlights, and inspiration for your special day.
          </p>
        </article>
      </div>
    </main>
  );
}
