export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 rounded-lg w-2/3 mx-auto mb-8"></div>
        <div className="max-w-xl mx-auto">
          <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
        </div>
      </div>

      <section className="mb-16">
        <div className="h-8 bg-gray-200 rounded-lg w-48 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
        <div className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
      </section>

      <section className="bg-gray-200 rounded-lg h-48 animate-pulse"></section>
    </div>
  );
}
