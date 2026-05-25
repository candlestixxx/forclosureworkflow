import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { pushToWebhook } from "@/lib/webhook";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, targetUrl } = body;

    if (!targetUrl) {
      return NextResponse.json({ error: "Missing target webhook URL." }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        contacts: true,
        relatives: true,
        notes: true,
        tags: true,
      }
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    const success = await pushToWebhook(targetUrl, lead);

    if (!success) {
      return NextResponse.json({ error: "Webhook transmission failed. Check the target URL." }, { status: 502 });
    }

    // Optionally tag the lead to indicate sync success
    // Using a basic Note here for the MVP audit trail
    await prisma.leadNote.create({
      data: {
        leadId: lead.id,
        content: `[System] Lead automatically pushed to CRM Webhook on ${new Date().toLocaleString()}`
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Webhook route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
