import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { logAudit } from "@/lib/audit";

const EmailPayloadSchema = z.object({
  leadId: z.string(),
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const validation = EmailPayloadSchema.safeParse(rawBody);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { leadId, to, subject, body } = validation.data;

    const settings = await prisma.setting.findUnique({ where: { id: "global" } });

    if (!settings || !settings.sendgridApiKey) {
      return NextResponse.json({ error: "SendGrid credentials not configured." }, { status: 400 });
    }

    const sendgridUrl = 'https://api.sendgrid.com/v3/mail/send';

    // Default system from-address, ideally this should be configurable too, but hardcoded here for MVP extension
    const fromEmail = "system@foreclosurecrm.local";

    const payload = {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: fromEmail, name: "Foreclosure CRM System" },
      subject: subject,
      content: [{ type: "text/plain", value: body }]
    };

    const response = await fetch(sendgridUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("SendGrid API Error:", errorData);
      return NextResponse.json({ error: "Failed to send Email via SendGrid" }, { status: 502 });
    }

    // Log the communication as a note
    await prisma.leadNote.create({
      data: {
        leadId,
        content: `[System: Email Sent] To: ${to}\nSubject: ${subject}\n\n${body}`
      }
    });

    // Update lead status
    await prisma.lead.update({
      where: { id: leadId },
      data: { noticeStatus: "Attempted" }
    });

    await logAudit("EMAIL_SENT", `Sent Email to Lead ${leadId}`, "SUCCESS");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
