import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { logAudit } from "@/lib/audit";

const SmsPayloadSchema = z.object({
  leadId: z.string(),
  to: z.string().min(10),
  message: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const validation = SmsPayloadSchema.safeParse(rawBody);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { leadId, to, message } = validation.data;

    const settings = await prisma.setting.findUnique({ where: { id: "global" } });

    if (!settings || !settings.twilioAccountSid || !settings.twilioAuthToken || !settings.twilioFromNumber) {
      return NextResponse.json({ error: "Twilio credentials not configured." }, { status: 400 });
    }

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${settings.twilioAccountSid}/Messages.json`;
    const encodedCredentials = Buffer.from(`${settings.twilioAccountSid}:${settings.twilioAuthToken}`).toString('base64');

    const formData = new URLSearchParams();
    formData.append('To', to);
    formData.append('From', settings.twilioFromNumber);
    formData.append('Body', message);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Twilio API Error:", errorData);
      return NextResponse.json({ error: "Failed to send SMS via Twilio" }, { status: 502 });
    }

    // Log the communication as a note
    await prisma.leadNote.create({
      data: {
        leadId,
        content: `[System: SMS Sent] To: ${to}\nMessage: ${message}`
      }
    });

    // Update lead status
    await prisma.lead.update({
      where: { id: leadId },
      data: { noticeStatus: "Attempted" }
    });

    await logAudit("SMS_SENT", `Sent SMS to Lead ${leadId}`, "SUCCESS");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SMS route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
