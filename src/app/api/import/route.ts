import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();
    const rows = text.split("\n").filter(row => row.trim().length > 0);

    if (rows.length < 2) {
      return NextResponse.json({ error: "CSV appears empty or invalid" }, { status: 400 });
    }

    // Very naive CSV parsing for MVP (expects standard headers from our own export)
    // ID,Owner Name,Property Address,City,Zip,Sale Date,Status,Phone,Email,Source,Needs Address Match,Created At
    const leadsCreated = [];
    let duplicates = 0;

    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i].split(",").map(c => c.replace(/^"|"$/g, "").trim());

      // Minimum viable columns: OwnerName (1) and PropertyAddress (2)
      const ownerName = cols[1];
      const propertyAddress = cols[2];

      if (!ownerName || !propertyAddress) continue;

      // Duplicate Check
      const existing = await prisma.lead.findFirst({
        where: {
          AND: [
            { propertyAddress: { equals: propertyAddress } },
            { ownerName: { equals: ownerName } }
          ]
        }
      });

      if (existing) {
        duplicates++;
        continue;
      }

      const newLead = await prisma.lead.create({
        data: {
          ownerName,
          propertyAddress,
          city: cols[3] || null,
          zip: cols[4] || null,
          saleDate: cols[5] ? new Date(cols[5]) : null,
          noticeStatus: cols[6] || "New",
          bestPhone: cols[7] || null,
          email: cols[8] || null,
          source: cols[9] || "CSV Import",
          needsAddressMatch: cols[10] === "Yes",
        }
      });
      leadsCreated.push(newLead);
    }

    return NextResponse.json({
      success: true,
      created: leadsCreated.length,
      duplicates
    }, { status: 201 });

  } catch (error) {
    console.error("CSV Import error:", error);
    return NextResponse.json({ error: "Failed to process CSV file" }, { status: 500 });
  }
}
