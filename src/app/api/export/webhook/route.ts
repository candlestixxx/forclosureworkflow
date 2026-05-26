import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { pushToWebhook } from "@/lib/webhook";
import { pushToHubSpot } from "@/lib/integrations/hubspot";
import { logAudit } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId } = body;

    const settings = await prisma.setting.findUnique({ where: { id: "global" } });

    if (!settings || (!settings.webhookUrl && !settings.hubspotApiKey)) {
      return NextResponse.json({ error: "No target integrations configured." }, { status: 400 });
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

    let success = false;
    let pushTypes = [];

    // Trigger HubSpot Native Integration
    if (settings.hubspotApiKey) {
        const hsSuccess = await pushToHubSpot(settings.hubspotApiKey, lead);
        if (hsSuccess) {
            success = true;
            pushTypes.push("HubSpot");
            await logAudit("HUBSPOT_PUSH", `Successfully pushed lead ${leadId}`, "SUCCESS");
        } else {
            await logAudit("HUBSPOT_PUSH", `Failed to push lead ${leadId}`, "FAILURE");
        }
    }

    // Trigger Generic Webhook Integration
    if (settings.webhookUrl) {
        const whSuccess = await pushToWebhook(settings.webhookUrl, lead);
        if (whSuccess) {
            success = true;
            pushTypes.push("Webhook");
            await logAudit("WEBHOOK_PUSH", `Successfully pushed lead ${leadId} to webhook`, "SUCCESS");
        } else {
            await logAudit("WEBHOOK_PUSH", `Failed to push lead ${leadId} to webhook`, "FAILURE");
        }
    }

    if (!success) {
      return NextResponse.json({ error: "All configured integrations failed to transmit." }, { status: 502 });
    }

    // Tag the lead to indicate sync success
    await prisma.leadNote.create({
      data: {
        leadId: lead.id,
        content: `[System] Lead automatically synced via: ${pushTypes.join(", ")} on ${new Date().toLocaleString()}`
      }
    });

    await prisma.notification.create({
      data: {
        title: "CRM Sync Complete",
        message: `Lead ${leadId} was successfully pushed to ${pushTypes.join(" and ")}.`
      }
    });

    return NextResponse.json({ success: true, message: `Synced to ${pushTypes.join(", ")}` }, { status: 200 });

  } catch (error) {
    console.error("Export route error:", error);
    await logAudit("EXPORT_PUSH", `Fatal error during push: ${error}`, "FAILURE");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
