import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { parseNoticeText } from "@/lib/parser";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    // Security check - Allow UI manual testing (if authenticated session exists) OR Vercel Cron Secret
    const session = await getServerSession(authOptions);
    const isCronAuthed = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!isCronAuthed && !session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const notices = Array.isArray(body.notices) ? body.notices : [body.notices];

    if (!notices || notices.length === 0) {
    }

    const results = {
      totalProcessed: 0,
      created: 0,
      duplicates: 0,
      errors: 0
    };

    for (const text of notices) {
      if (typeof text !== "string") continue;
      results.totalProcessed++;

      try {
        const parsedData = parseNoticeText(text, body.source || "Automated Intake Workflow");

        // Basic duplicate check by Address (AND Owner Name if available) to avoid false positives on Unknown Owners
        const whereCondition: any = { propertyAddress: { equals: parsedData.propertyAddress } };
        if (parsedData.ownerName && parsedData.ownerName !== "Unknown Owner") {
           whereCondition.ownerName = { equals: parsedData.ownerName };
        }

        const existingLead = await prisma.lead.findFirst({
          where: whereCondition
        });

        if (existingLead) {
          results.duplicates++;
          continue; // Skip creation
        }

        await prisma.lead.create({
          data: {
            ownerName: parsedData.ownerName,
            propertyAddress: parsedData.propertyAddress,
            city: parsedData.city,
            zip: parsedData.zip,
            saleDate: parsedData.saleDate ? new Date(parsedData.saleDate) : null,
            noticeStatus: "New",
            rawNoticeText: parsedData.rawNoticeText,
            source: parsedData.source,
            needsAddressMatch: parsedData.needsAddressMatch,
            leadScore: 10 // Base automated score
          }
        });

        results.created++;
      } catch (err) {
        console.error("Intake parser error:", err);
        results.errors++;
        await logAudit("INTAKE_RUN", `Parser error on text snippet: ${text.substring(0, 50)}...`, "FAILURE");
      }
    }

    await logAudit("INTAKE_RUN", `Completed intake. Created: ${results.created}, Duplicates: ${results.duplicates}, Errors: ${results.errors}`, "SUCCESS");

    return NextResponse.json({

      message: "Intake processing complete",
      results
    }, { status: 200 });

  } catch (error) {
    console.error("Fatal intake route error:", error);
    return NextResponse.json({ error: "Failed to process intake" }, { status: 500 });
  }
}
