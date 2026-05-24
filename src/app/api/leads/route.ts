import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");

    let whereClause = {};
    if (filter === "enrichment") {
      whereClause = {
        OR: [{ bestPhone: null }, { needsAddressMatch: true }],
      };
    } else if (filter === "new") {
      whereClause = { noticeStatus: "New" };
    }

    const leads = await prisma.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newLead = await prisma.lead.create({
      data: {
        ownerName: body.ownerName,
        propertyAddress: body.propertyAddress,
        city: body.city,
        zip: body.zip,
        saleDate: body.saleDate ? new Date(body.saleDate) : null,
        noticeStatus: body.noticeStatus || "New",
        bestPhone: body.bestPhone,
        email: body.email,
        rawNoticeText: body.rawNoticeText,
        source: body.source,
        needsAddressMatch: body.needsAddressMatch || false,
      },
    });
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
