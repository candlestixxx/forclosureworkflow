import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { addDays } from "date-fns";

const EnrollSchema = z.object({
  leadId: z.string(),
  sequence: z.enum(["7_DAY_AGGRESSIVE", "30_DAY_NURTURE"]),
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const validation = EnrollSchema.safeParse(rawBody);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { leadId, sequence } = validation.data;

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const now = new Date();
    const tasksToCreate = [];

    if (sequence === "7_DAY_AGGRESSIVE") {
      tasksToCreate.push({
        leadId,
        title: "Drip: Day 1 SMS",
        description: JSON.stringify({ type: "sms", body: "Hi, I saw your property might be heading to auction. Are you open to a cash offer? Reply STOP to opt out." }),
        dueDate: addDays(now, 1),
        type: "Automated_Sequence_SMS",
        status: "Pending"
      });
      tasksToCreate.push({
        leadId,
        title: "Drip: Day 3 Email",
        description: JSON.stringify({ type: "email", subject: "Foreclosure Options", body: "Hello,\n\nWe can help you stop the foreclosure process by buying your home fast. Let's talk.\n\nBest,\nYour Local Investor" }),
        dueDate: addDays(now, 3),
        type: "Automated_Sequence_Email",
        status: "Pending"
      });
      tasksToCreate.push({
        leadId,
        title: "Drip: Day 7 SMS",
        description: JSON.stringify({ type: "sms", body: "Last attempt - time is running out before the auction. Call us if you want to sell and walk away with cash." }),
        dueDate: addDays(now, 7),
        type: "Automated_Sequence_SMS",
        status: "Pending"
      });
    } else if (sequence === "30_DAY_NURTURE") {
       tasksToCreate.push({
        leadId,
        title: "Drip: Day 2 Email",
        description: JSON.stringify({ type: "email", subject: "Exploring Your Options", body: "Hi,\n\nWe buy houses in your area. If you're interested in a no-obligation cash offer, let us know.\n\nThanks!" }),
        dueDate: addDays(now, 2),
        type: "Automated_Sequence_Email",
        status: "Pending"
      });
      tasksToCreate.push({
        leadId,
        title: "Drip: Day 15 Email",
        description: JSON.stringify({ type: "email", subject: "Checking In", body: "Hi again,\n\nJust checking to see if you still own the property and if you have considered selling.\n\nBest regards." }),
        dueDate: addDays(now, 15),
        type: "Automated_Sequence_Email",
        status: "Pending"
      });
      tasksToCreate.push({
        leadId,
        title: "Drip: Day 30 Email",
        description: JSON.stringify({ type: "email", subject: "Still Buying Houses", body: "Hi,\n\nOur cash offer stands. If you ever need to sell fast, reply to this email.\n\nThanks." }),
        dueDate: addDays(now, 30),
        type: "Automated_Sequence_Email",
        status: "Pending"
      });
    }

    await prisma.leadTask.createMany({
      data: tasksToCreate
    });

    await prisma.leadNote.create({
      data: {
        leadId,
        content: `[System] Enrolled lead in Follow-Up Sequence: ${sequence}. Scheduled ${tasksToCreate.length} automated touches.`
      }
    });

    await prisma.leadTag.create({
        data: { leadId, name: `drip-${sequence.toLowerCase()}` },
        skipDuplicates: true
    });

    return NextResponse.json({ success: true, message: `Enrolled in ${sequence}` });
  } catch (error) {
    console.error("Sequence Enrollment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
