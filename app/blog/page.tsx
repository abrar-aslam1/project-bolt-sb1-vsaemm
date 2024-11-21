export default function BlogPage() {
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
