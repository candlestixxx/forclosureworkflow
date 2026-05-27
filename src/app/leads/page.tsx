import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { ClientLeadsList } from "./ClientLeadsList";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const filter = typeof resolvedParams.filter === 'string' ? resolvedParams.filter : undefined;
  const query = typeof resolvedParams.query === 'string' ? resolvedParams.query : undefined;

  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1;
  const limit = 20; // Hardcoded limit for standard views
  const skip = (page - 1) * limit;

  // Build the base Prisma where clause
  let whereClause: any = {};

  // Apply standard filters
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

  // Inject text search constraint if provided
  if (query) {
    const searchFilter = {
      OR: [
        { ownerName: { contains: query, mode: "insensitive" } },
        { propertyAddress: { contains: query, mode: "insensitive" } },
        { tags: { some: { name: { equals: query, mode: "insensitive" } } } }
      ]
    };

    // If an existing OR filter is active (like enrichment), we must nest them under AND
    if (whereClause.OR) {
      whereClause = {
        AND: [
          { OR: whereClause.OR },
          searchFilter
        ]
      };
    } else {
      whereClause = { ...whereClause, ...searchFilter };
    }
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
  if (query) currentQueryParams['query'] = query;

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
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-2">
            <Link href="/leads" className={`px-3 py-1.5 rounded-md text-sm font-medium ${!filter ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}>All</Link>
            <Link href="/leads?filter=new" className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === 'new' ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}>New</Link>
            <Link href="/leads?filter=enrichment" className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === 'enrichment' ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}>Needs Enrichment</Link>
          </div>

          <SearchBar />
        </div>

        <ClientLeadsList leads={leads} />

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
