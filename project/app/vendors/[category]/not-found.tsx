export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
      <p className="text-gray-600 mb-4">The vendor category you're looking for doesn't exist.</p>
      <a
        href="/vendors"
        className="text-primary hover:text-primary/80 underline transition-colors"
      >
        View all vendor categories
      </a>
    </div>
  );
}