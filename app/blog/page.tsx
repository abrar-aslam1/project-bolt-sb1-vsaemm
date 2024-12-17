import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Wedding Planning Blog | Tips & Inspiration',
  description: 'Get expert wedding planning advice, tips, and inspiration from our blog. Learn about the latest trends, ideas, and best practices for your special day.',
};

export default function Page() {
  // This would typically fetch blog posts from an API or CMS
  const blogPosts = [
    {
      id: 1,
      title: '10 Tips for Choosing Your Perfect Wedding Venue',
      excerpt: 'Finding the right venue sets the tone for your entire wedding. Here are our top tips for making the perfect choice...',
      date: '2024-01-15',
      category: 'Venues',
    },
    {
      id: 2,
      title: 'Wedding Photography Styles Explained',
      excerpt: 'From traditional to documentary, understand different photography styles to choose the right photographer...',
      date: '2024-01-12',
      category: 'Photography',
    },
    {
      id: 3,
      title: 'Creating Your Wedding Budget: A Complete Guide',
      excerpt: 'Learn how to allocate your wedding budget effectively and get the most value for your money...',
      date: '2024-01-10',
      category: 'Planning',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Wedding Planning Blog</h1>
        <p className="text-xl text-gray-600">
          Expert advice and inspiration for your perfect wedding day
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-video bg-gray-100"></div>
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>{post.category}</span>
                <span className="mx-2">•</span>
                <time>{new Date(post.date).toLocaleDateString()}</time>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/blog/${post.id}`} className="hover:text-blue-600 transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <Link 
                href={`/blog/${post.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Read More →
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-16 bg-gray-50 p-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6">
            Get the latest wedding planning tips and inspiration delivered directly to your inbox
          </p>
          <form className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
