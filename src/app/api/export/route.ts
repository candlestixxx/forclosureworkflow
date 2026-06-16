import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (leads.length === 0) {
      return new NextResponse("No leads available to export", { status: 400 });
    }

    const headers = ["ID", "Owner Name", "Property Address", "City", "Zip", "Sale Date", "Status", "Phone", "Email", "Source", "Needs Address Match", "Created At"];
    const csvRows = [headers.join(",")];

    for (const lead of leads) {
      const row = [
        lead.id,
        `"${lead.ownerName || ""}"`,
        `"${lead.propertyAddress || ""}"`,
        `"${lead.city || ""}"`,
        `"${lead.zip || ""}"`,
        lead.saleDate ? new Date(lead.saleDate).toISOString().split('T')[0] : "",
        lead.noticeStatus,
        `"${lead.bestPhone || ""}"`,
        `"${lead.email || ""}"`,
        `"${lead.source || ""}"`,
        lead.needsAddressMatch ? "Yes" : "No",
        new Date(lead.createdAt).toISOString().split('T')[0]
      ];
      csvRows.push(row.join(","));
    }

    const csvContent = csvRows.join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="leads_export.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate CSV export" }, { status: 500 });
  }
}
