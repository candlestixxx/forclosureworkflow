import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // GoHighLevel sends a dense payload on pipeline stage changes.
    // We expect the user to map our internal Lead ID to a custom field in GHL named "crm_lead_id".
    // Alternatively, we can try to match by email or phone as a fallback.

    let targetLeadId: string | undefined = undefined;

    // Check custom fields (GHL payload structure varies, assuming standard customField array or flat object)
    if (body.customData && body.customData.crm_lead_id) {
        targetLeadId = body.customData.crm_lead_id;
    } else if (body.custom_fields) {
        const idField = body.custom_fields.find((f: any) => f.name === 'crm_lead_id' || f.id === 'crm_lead_id');
        if (idField) targetLeadId = idField.value;
    }

    let lead;
    if (targetLeadId) {
       lead = await prisma.lead.findUnique({ where: { id: targetLeadId } });
    }

    // Fallback lookup by email or phone
    if (!lead && body.email) {
       lead = await prisma.lead.findFirst({ where: { email: body.email } });
    }

    if (!lead && body.phone) {
       lead = await prisma.lead.findFirst({ where: { bestPhone: body.phone } });
    }

    if (!lead) {
      await logAudit("GHL_INBOUND_WEBHOOK", `Failed to match incoming GHL contact. Payload: ${JSON.stringify(body).substring(0, 100)}...`, "FAILURE");
      // Return 200 anyway so GHL doesn't aggressively retry and clog the system
      return NextResponse.json({ success: true, message: "Lead not found locally, ignored." });
    }

    // Extract the new status.
    // GHL sends 'pipeline_stage' or 'status'. We map this loosely.
    const rawStage = body.pipeline_stage || body.status || "Attempted";

    // Convert to our internal statuses (New, Ready, Attempted, Dead)
    let internalStatus = "Attempted";
    const lowerStage = rawStage.toLowerCase();

    if (lowerStage.includes("dead") || lowerStage.includes("lost") || lowerStage.includes("dnc")) {
        internalStatus = "Dead";
    } else if (lowerStage.includes("ready") || lowerStage.includes("new")) {
        internalStatus = "Ready";
    }

    await prisma.lead.update({
        where: { id: lead.id },
        data: { noticeStatus: internalStatus }
    });

    await prisma.leadNote.create({
        data: {
            leadId: lead.id,
            content: `[System: GHL Webhook] Lead pipeline stage changed to: ${rawStage}`
        }
    });

    await logAudit("GHL_INBOUND_WEBHOOK", `Updated Lead ${lead.id} status to ${internalStatus} via GHL.`, "SUCCESS");

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("GHL Inbound Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
