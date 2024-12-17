export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-2/3 mx-auto"></div>
        </div>

        <div className="space-y-12">
          {[...Array(3)].map((_, i) => (
            <section key={i}>
              <div className="h-8 bg-gray-200 rounded-lg w-64 mb-6 animate-pulse"></div>
              <div className="bg-white rounded-lg shadow-md p-6">
                {i === 0 && (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="flex items-start">
                        <div className="w-6 h-6 bg-gray-200 rounded-full mr-3 animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {i === 1 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, j) => (
                      <div key={j}>
                        <div className="h-6 bg-gray-200 rounded w-1/2 mb-3 animate-pulse"></div>
                        <div className="space-y-2">
                          {[...Array(5)].map((_, k) => (
                            <div key={k} className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="col-span-2 mt-6">
                      <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                    </div>
                  </div>
                )}
                {i === 2 && (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="flex items-start">
                        <div className="w-6 h-6 bg-gray-200 rounded mr-3 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 text-center animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-96 mx-auto mb-6"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-32 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
