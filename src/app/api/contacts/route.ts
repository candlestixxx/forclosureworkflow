import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Ensure Lead exists
    const lead = await prisma.lead.findUnique({ where: { id: body.leadId } });
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const newContact = await prisma.leadContact.create({
      data: {
        leadId: body.leadId,
        type: body.type, // 'Phone' or 'Email'
        value: body.value,
        isPrimary: body.isPrimary || false,
        confidence: body.confidence ? parseInt(body.confidence, 10) : null,
        source: body.source || "Manual Enrichment",
      },
    });

    // If marked primary, sync to the Lead directly
    if (body.isPrimary) {
       await prisma.lead.update({
         where: { id: body.leadId },
         data: body.type === "Phone" ? { bestPhone: body.value } : { email: body.value }
       });
    }

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error("Failed to create contact:", error);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}
