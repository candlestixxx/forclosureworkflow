export default function LeadDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse p-4">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 bg-gray-100 rounded-xl"></div>
          <div className="h-64 bg-gray-100 rounded-xl"></div>
        </div>
        <div className="space-y-6">
          <div className="h-48 bg-gray-100 rounded-xl"></div>
          <div className="h-48 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
