export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 rounded-lg w-2/3 mx-auto mb-8"></div>
        <div className="max-w-2xl mx-auto">
          <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
        </div>
      </div>

      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6 space-y-3">
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}
