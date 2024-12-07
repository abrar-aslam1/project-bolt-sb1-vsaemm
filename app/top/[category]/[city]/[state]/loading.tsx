export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-8"></div>
        
        {/* Title skeleton */}
        <div className="h-10 bg-gray-200 rounded w-3/4 mb-8"></div>

        {/* Places list skeleton */}
        <div className="space-y-8">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>

        {/* About section skeleton */}
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>
    </div>
  );
}
