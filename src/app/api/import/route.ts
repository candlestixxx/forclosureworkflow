import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Papa from "papaparse";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();

    // Robust CSV parsing handling quoted strings, nested commas, and newlines
    const parsedData = Papa.parse(text, {
        header: false, // We rely on positional indices for generic ingest
        skipEmptyLines: true,
    });

    if (parsedData.errors.length > 0) {
        return NextResponse.json({ error: "CSV malformed", details: parsedData.errors }, { status: 400 });
    }

    const rows = parsedData.data as string[][];

    if (rows.length < 2) {
      return NextResponse.json({ error: "CSV appears empty or lacks data rows" }, { status: 400 });
    }

    const leadsCreated = [];
    let duplicates = 0;

    // Start at 1 to skip the header row
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];

      // Minimum viable columns (based on our standard export: ID(0), OwnerName(1), Address(2))
      const ownerName = cols[1]?.trim();
      const propertyAddress = cols[2]?.trim();

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
          city: cols[3]?.trim() || null,
          zip: cols[4]?.trim() || null,
          saleDate: cols[5] ? new Date(cols[5]) : null,
          noticeStatus: cols[6]?.trim() || "New",
          bestPhone: cols[7]?.trim() || null,
          email: cols[8]?.trim() || null,
          source: cols[9]?.trim() || "CSV Import",
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
