export default function LeadsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="h-6 bg-gray-200 rounded w-full mb-4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-gray-100 rounded w-full"></div>
          <div className="h-12 bg-gray-100 rounded w-full"></div>
          <div className="h-12 bg-gray-100 rounded w-full"></div>
          <div className="h-12 bg-gray-100 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}
