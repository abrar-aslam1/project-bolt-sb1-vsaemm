export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Skeleton loading for title */}
        <div className="h-8 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-12 animate-pulse"></div>

        {/* Skeleton loading for search bar */}
        <div className="h-12 bg-gray-200 rounded-lg mb-12 animate-pulse"></div>

        {/* Skeleton loading for categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-lg h-32 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
