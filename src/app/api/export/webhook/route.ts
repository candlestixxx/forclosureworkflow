import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { pushToWebhook } from "@/lib/webhook";
import { logAudit } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId } = body;

    // Fetch the target URL securely from the database config
    const settings = await prisma.setting.findUnique({ where: { id: "global" } });
    const targetUrl = settings?.webhookUrl;

    if (!targetUrl) {
      return NextResponse.json({ error: "No target webhook URL is configured in settings." }, { status: 400 });
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
      await logAudit("WEBHOOK_PUSH", `Failed to push lead ${leadId} to ${targetUrl}`, "FAILURE");
      return NextResponse.json({ error: "Webhook transmission failed. Check the target URL." }, { status: 502 });
    }

    await logAudit("WEBHOOK_PUSH", `Successfully pushed lead ${leadId} to webhook`, "SUCCESS");

    // Tag the lead to indicate sync success
    await prisma.leadNote.create({
      data: {
        leadId: lead.id,
        content: `[System] Lead automatically pushed to CRM Webhook on ${new Date().toLocaleString()}`
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Webhook route error:", error);
    await logAudit("WEBHOOK_PUSH", `Fatal error during push: ${error}`, "FAILURE");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
