import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { LeadCreationSchema } from "@/lib/validations";
import { geocodeAddress } from "@/lib/geocoder";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");

    // Pagination params
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    let whereClause = {};
    if (filter === "enrichment") {
      whereClause = {
        OR: [{ bestPhone: null }, { needsAddressMatch: true }],
      };
    } else if (filter === "new") {
      whereClause = { noticeStatus: "New" };
    }

    const [leads, totalCount] = await Promise.all([
      prisma.lead.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { tags: true } // Include tags for list view
      }),
      prisma.lead.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: leads,
      meta: {
        totalCount,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();

    // Zod Payload Validation
    const validation = LeadCreationSchema.safeParse(rawBody);
    if (!validation.success) {
        return NextResponse.json({ error: "Invalid payload data", details: validation.error.format() }, { status: 400 });
    }

    const body = validation.data;

    // Fix Duplicate Detection: Use AND condition to prevent dropping multiple properties owned by same entity
    // Also ignore "Unknown Owner" for string matching.
    const whereCondition: any = { propertyAddress: { equals: body.propertyAddress } };
    if (body.ownerName && body.ownerName !== "Unknown Owner") {
       whereCondition.ownerName = { equals: body.ownerName };
    }

    const existingLead = await prisma.lead.findFirst({
      where: whereCondition
    });

    if (existingLead) {
      return NextResponse.json(
        { error: "A lead with this exact property address and owner already exists." },
        { status: 409 }
      );
    }

    const coords = await geocodeAddress(body.propertyAddress, body.city, body.zip);

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
        latitude: coords?.lat || null,
        longitude: coords?.lon || null,
      },
    });
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
