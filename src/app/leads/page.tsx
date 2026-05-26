import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, Search } from "lucide-react";
import { Pagination } from "@/components/Pagination";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const filter = typeof resolvedParams.filter === 'string' ? resolvedParams.filter : undefined;

  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1;
  const limit = 20; // Hardcoded limit for standard views
  const skip = (page - 1) * limit;

  let whereClause = {};
  if (filter === 'enrichment') {
    whereClause = {
      OR: [
        { bestPhone: null },
        { needsAddressMatch: true }
      ]
    };
  } else if (filter === 'new') {
    whereClause = { noticeStatus: 'New' };
  }

  // Execute efficient dual-query pattern for Prisma pagination
  const [leads, totalCount] = await Promise.all([
    prisma.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { tags: true }
    }),
    prisma.lead.count({ where: whereClause })
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  // Preserve existing filters when generating pagination URLs
  const currentQueryParams: Record<string, string> = {};
  if (filter) currentQueryParams['filter'] = filter;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Leads Database</h1>
        <Link href="/leads/new" className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex gap-2">
            <Link href="/leads" className={`px-3 py-1.5 rounded-md text-sm font-medium ${!filter ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}>All</Link>
            <Link href="/leads?filter=new" className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === 'new' ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}>New</Link>
            <Link href="/leads?filter=enrichment" className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === 'enrichment' ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}>Needs Enrichment</Link>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">Owner Name</th>
                <th className="px-6 py-3 font-medium">Property Address</th>
                <th className="px-6 py-3 font-medium">Sale Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No leads found. Create one or wait for the Friday intake.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{lead.ownerName}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {lead.propertyAddress}<br/>
                      <span className="text-xs text-gray-400">{lead.city}, MI {lead.zip}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {lead.saleDate ? format(new Date(lead.saleDate), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${lead.noticeStatus === 'New' ? 'bg-blue-100 text-blue-800' :
                          lead.noticeStatus === 'Ready' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {lead.noticeStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {lead.bestPhone || <span className="text-gray-400 italic">Missing</span>}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/leads/${lead.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Component */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/leads"
          queryParams={currentQueryParams}
        />
      </div>
    </div>
  );
}
