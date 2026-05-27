import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    // Security check - Only Vercel Cron Secret allowed
    const isCronAuthed = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!isCronAuthed && process.env.NODE_ENV === "production") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const settings = await prisma.setting.findUnique({ where: { id: "global" } });
    if (!settings) {
       return NextResponse.json({ error: "System settings missing" }, { status: 500 });
    }

    const now = new Date();

    // Fetch all pending automated tasks whose due date has passed
    const pendingTasks = await prisma.leadTask.findMany({
      where: {
        status: "Pending",
        type: { startsWith: "Automated_Sequence_" },
        dueDate: { lte: now }
      },
      include: { lead: true }
    });

    if (pendingTasks.length === 0) {
      return NextResponse.json({ message: "No pending automated sequences to execute." }, { status: 200 });
    }

    let processed = 0;
    let failed = 0;

    for (const task of pendingTasks) {
       try {
          if (!task.description) throw new Error("Missing payload in description");
          const payload = JSON.parse(task.description);
          const lead = task.lead;

          let success = false;

          if (task.type === "Automated_Sequence_SMS") {
             if (!settings.twilioAccountSid || !settings.twilioAuthToken || !settings.twilioFromNumber) {
                throw new Error("Twilio credentials not configured");
             }
             if (!lead.bestPhone) {
                throw new Error("Lead missing phone number");
             }

             const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${settings.twilioAccountSid}/Messages.json`;
             const encodedCredentials = Buffer.from(`${settings.twilioAccountSid}:${settings.twilioAuthToken}`).toString('base64');

             const formData = new URLSearchParams();
             formData.append('To', lead.bestPhone);
             formData.append('From', settings.twilioFromNumber);
             formData.append('Body', payload.body);

             const res = await fetch(twilioUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${encodedCredentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
             });

             if (!res.ok) throw new Error(`Twilio API Error: ${await res.text()}`);
             success = true;

             await prisma.leadNote.create({
                 data: {
                     leadId: lead.id,
                     content: `[System: Sequence SMS Sent] To: ${lead.bestPhone}\nMessage: ${payload.body}`
                 }
             });
          } else if (task.type === "Automated_Sequence_Email") {
             if (!settings.sendgridApiKey) {
                throw new Error("SendGrid credentials not configured");
             }
             if (!lead.email) {
                throw new Error("Lead missing email address");
             }

             const sendgridUrl = 'https://api.sendgrid.com/v3/mail/send';
             const emailPayload = {
                personalizations: [{ to: [{ email: lead.email }] }],
                from: { email: "system@foreclosurecrm.local", name: "Foreclosure CRM System" },
                subject: payload.subject,
                content: [{ type: "text/plain", value: payload.body }]
             };

             const res = await fetch(sendgridUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${settings.sendgridApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailPayload)
             });

             if (!res.ok) throw new Error(`SendGrid API Error: ${await res.text()}`);
             success = true;

             await prisma.leadNote.create({
                 data: {
                     leadId: lead.id,
                     content: `[System: Sequence Email Sent] To: ${lead.email}\nSubject: ${payload.subject}\n\n${payload.body}`
                 }
             });
          }

          if (success) {
              await prisma.leadTask.update({
                  where: { id: task.id },
                  data: { status: "Completed" }
              });

              await prisma.lead.update({
                 where: { id: lead.id },
                 data: { noticeStatus: "Attempted" }
              });

              processed++;
          }
       } catch (err: any) {
           console.error(`Failed to process sequence task ${task.id}:`, err);
           await prisma.leadTask.update({
               where: { id: task.id },
               data: { status: "Failed", description: `${task.description}\n\n[ERROR: ${err.message}]` }
           });
           failed++;
       }
    }

    await logAudit("SEQUENCE_CRON_RUN", `Processed: ${processed}, Failed: ${failed}`, "SUCCESS");

    return NextResponse.json({ success: true, processed, failed });
  } catch (error) {
    console.error("Sequence execute route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
