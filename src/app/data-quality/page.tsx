import { prisma } from "@/lib/prisma";
import { DataQualityClient } from "./DataQualityClient";

export const dynamic = "force-dynamic";

export default async function DataQualityPage() {
  const totalLeads = await prisma.lead.count();

  // We need to pass data to the client to render Recharts.
  // Calculate Enrichment Success rates
  const enrichedLeads = await prisma.lead.count({
    where: {
      OR: [
        { bestPhone: { not: null } },
        { email: { not: null } }
      ]
    }
  });

  const addressMatched = await prisma.lead.count({
    where: { needsAddressMatch: false }
  });

  const missingBoth = totalLeads - enrichedLeads;
  const missingAddress = totalLeads - addressMatched;

  // Let's get contacts breakdown
  const totalContacts = await prisma.leadContact.count();
  const emailsCount = await prisma.leadContact.count({ where: { type: "Email" } });
  const phonesCount = await prisma.leadContact.count({ where: { type: "Phone" } });

  const metrics = {
    totalLeads,
    enrichedLeads,
    missingBoth,
    addressMatched,
    missingAddress,
    totalContacts,
    emailsCount,
    phonesCount,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Quality Dashboard</h1>
        <p className="text-gray-500 mt-2">Track the completeness and enrichment success of your lead database.</p>
      </div>

      <DataQualityClient metrics={metrics} />
    </div>
  );
}
