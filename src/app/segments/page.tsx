import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Hash, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SegmentsPage() {
  // Fetch all tags and group them by name to get counts
  const tags = await prisma.leadTag.groupBy({
    by: ['name'],
    _count: {
      leadId: true,
    },
    orderBy: {
      _count: {
        leadId: 'desc'
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Custom Segments</h1>
        <p className="text-sm text-gray-600">Organize and quickly access leads categorized by custom hashtags.</p>
      </div>

      {tags.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Hash className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No segments found</h3>
          <p className="text-gray-500 mt-1">Add hashtags to individual leads to automatically create segments here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tags.map((tag) => (
            <div key={tag.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Hash className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-3 truncate" title={tag.name}>
                    {tag.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-6">
                <Users className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{tag._count.leadId} leads attached</span>
              </div>

              <Link
                href={`/leads?query=${encodeURIComponent(tag.name)}`}
                className="block w-full text-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg transition-colors text-sm"
              >
                View Segment
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
