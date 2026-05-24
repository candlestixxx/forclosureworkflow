import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, AlertCircle, Clock, CalendarDays } from "lucide-react";

export default async function Dashboard() {
  const totalLeads = await prisma.lead.count();
  const newLeads = await prisma.lead.count({ where: { noticeStatus: "New" } });

  // Sale date within 7 days
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const upcomingSales = await prisma.lead.count({
    where: {
      saleDate: {
        gte: new Date(),
        lte: nextWeek,
      }
    }
  });

  const needsEnrichment = await prisma.lead.count({
    where: {
      OR: [
        { bestPhone: null },
        { needsAddressMatch: true }
      ]
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Leads</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalLeads}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New This Week</p>
              <h3 className="text-2xl font-bold text-gray-900">{newLeads}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Needs Enrichment</p>
              <h3 className="text-2xl font-bold text-gray-900">{needsEnrichment}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <CalendarDays className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Sales &lt; 7 Days</p>
              <h3 className="text-2xl font-bold text-gray-900">{upcomingSales}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/leads" className="flex justify-center items-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
            View All Leads
          </Link>
          <Link href="/leads?filter=enrichment" className="flex justify-center items-center py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium">
            Enrich Missing Data
          </Link>
          <Link href="/settings" className="flex justify-center items-center py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium">
            Configure Intake
          </Link>
        </div>
      </div>
    </div>
  );
}
