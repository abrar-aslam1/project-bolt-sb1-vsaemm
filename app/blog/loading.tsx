export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 rounded-lg w-2/3 mx-auto"></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <article key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-video bg-gray-200 animate-pulse"></div>
            <div className="p-6">
              <div className="flex items-center mb-2">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="mx-2">•</div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-16 bg-gray-50 p-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-3/4 mx-auto mb-6 animate-pulse"></div>
          <div className="flex gap-4 max-w-md mx-auto">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
