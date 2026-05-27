import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { calculateLeadScore } from "@/lib/scoring";
import { MyPlusLeadsConnector } from "@/lib/connectors/myplus";
import { TaxAssessorConnector } from "@/lib/connectors/tax_assessor";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, connectorType } = body;

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    let connector;
    if (connectorType === "MyPlusLeads") {
      connector = new MyPlusLeadsConnector();
    } else if (connectorType === "TaxAssessor") {
      connector = new TaxAssessorConnector();
    } else {
      return NextResponse.json({ error: "Unknown connector type" }, { status: 400 });
    }

    const result = await connector.execute(lead);

    if (result.success) {
      // Handle Tax Assessor specific resolutions
      if (connectorType === "TaxAssessor" && result.resolvedAddress) {
         await prisma.lead.update({
             where: { id: lead.id },
             data: {
                 propertyAddress: result.resolvedAddress,
                 city: result.resolvedCity || lead.city,
                 zip: result.resolvedZip || lead.zip,
                 needsAddressMatch: false
             }
         });
      }

      // Automatically save the enriched data into the database
      if (result.phones.length > 0) {
        await prisma.leadContact.createMany({
          data: result.phones.map(p => ({
            leadId: lead.id,
            type: "Phone",
            value: p.value,
            confidence: p.confidence,
            source: connectorType
          }))
        });

        // Auto-update primary phone if null
        if (!lead.bestPhone) {
            await prisma.lead.update({
                where: { id: lead.id },
                data: { bestPhone: result.phones[0].value }
            });
        }
      }

      if (result.emails.length > 0) {
        await prisma.leadContact.createMany({
          data: result.emails.map(e => ({
            leadId: lead.id,
            type: "Email",
            value: e.value,
            confidence: e.confidence,
            source: connectorType
          }))
        });
      }

      // Drop an audit note
      await prisma.leadNote.create({
          data: {
              leadId: lead.id,
              content: `[System] Automated Enrichment via ${connectorType} ran successfully.`
          }
      });
    }


    // Recalculate score after enrichment completes
    const updatedLeadForScore = await prisma.lead.findUnique({ where: { id: lead.id } });
    if (updatedLeadForScore) {
       await prisma.lead.update({
          where: { id: lead.id },
          data: { leadScore: calculateLeadScore(updatedLeadForScore) }
       });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Enrichment API Error:", error);
    return NextResponse.json({ error: "Failed to run enrichment connector" }, { status: 500 });
  }
}
