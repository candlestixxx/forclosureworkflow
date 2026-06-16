import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { IntakePayloadSchema } from "@/lib/validations";
import { geocodeAddress } from "@/lib/geocoder";
import { NoticeParser } from "@/lib/parsers/core";
import { MacombCountyParser } from "@/lib/parsers/michigan_macomb";
import { LLMNoticeParser } from "@/lib/parsers/llm_parser";
import { calculateLeadScore } from "@/lib/scoring";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    // Security check - Allow UI manual testing (if authenticated session exists) OR Vercel Cron Secret
    const session = await getServerSession(authOptions);
    const isCronAuthed = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!isCronAuthed && !session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const rawBody = await request.json();

    // Validate generic payload shape using Zod
    const validation = IntakePayloadSchema.safeParse(rawBody);
    if (!validation.success) {
        await logAudit("INTAKE_RUN", "Invalid JSON payload structure rejected.", "FAILURE");
        return NextResponse.json({ error: "Invalid payload structure", details: validation.error.format() }, { status: 400 });
    }

    const notices = Array.isArray(validation.data.notices) ? validation.data.notices : [validation.data.notices];

    if (!notices || notices.length === 0) {
      return NextResponse.json({ error: "No notice text provided" }, { status: 400 });
    }

    // Dynamic Module Routing
    let activeParser: NoticeParser;
    const settings = await prisma.setting.findUnique({ where: { id: "global" } });

    if (validation.data.countyConfig === "LLM_AUTO") {
      if (!settings || !settings.openAiApiKey) {
        await logAudit("INTAKE_RUN", "LLM_AUTO requested but OpenAI API Key is missing from settings.", "FAILURE");
        return NextResponse.json({ error: "OpenAI API Key not configured" }, { status: 400 });
      }
      activeParser = new LLMNoticeParser(settings.openAiApiKey);
    } else if (validation.data.countyConfig === "MI_MACOMB") {
      activeParser = new MacombCountyParser();
    } else {
      await logAudit("INTAKE_RUN", `Unsupported county configuration requested: ${validation.data.countyConfig}`, "FAILURE");
      return NextResponse.json({ error: "Unsupported county configuration" }, { status: 400 });
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
        let parsedData;

        if (activeParser instanceof LLMNoticeParser) {
           parsedData = await activeParser.parseAsync(text, validation.data.source || "LLM Automated Intake Workflow");
        } else {
           parsedData = activeParser.parse(text, validation.data.source || "Automated Intake Workflow");
        }

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

        let coords = null;
        if (!parsedData.needsAddressMatch) {
          coords = await geocodeAddress(parsedData.propertyAddress, parsedData.city, parsedData.zip);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit OSM Nominatim
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
            latitude: coords?.lat || null,
            longitude: coords?.lon || null,
            leadScore: calculateLeadScore({ source: parsedData.source, saleDate: parsedData.saleDate ? new Date(parsedData.saleDate) : null, needsAddressMatch: parsedData.needsAddressMatch, latitude: coords?.lat || null, longitude: coords?.lon || null })
          }
        });

        results.created++;
      } catch (err) {
        console.error("Intake parser error:", err);
        results.errors++;
        await logAudit("INTAKE_RUN", `Parser error on text snippet: ${text.substring(0, 50)}...`, "FAILURE");
      }
    }

    await logAudit("INTAKE_RUN", `Completed intake for ${activeParser.countyIdentifier}. Created: ${results.created}, Duplicates: ${results.duplicates}, Errors: ${results.errors}`, "SUCCESS");

    await prisma.notification.create({
      data: {
        title: "Intake Workflow Complete",
        message: `${activeParser.countyIdentifier} run finished. ${results.created} new leads added.`
      }
    });

    return NextResponse.json({
      message: "Intake processing complete",
      results
    }, { status: 200 });

  } catch (error) {
    console.error("Fatal intake route error:", error);
    return NextResponse.json({ error: "Failed to process intake" }, { status: 500 });
  }
}
