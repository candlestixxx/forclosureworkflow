import { Lead } from "@prisma/client";

/**
 * Calculates a dynamic quality score for a lead based on data completeness and urgency.
 * Max score is technically unbound, but generally falls between 0 and 100.
 */
export function calculateLeadScore(lead: Partial<Lead>): number {
  let score = 0;

  // Base Source Points
  if (lead.source === "Automated Intake Workflow") score += 10;
  else if (lead.source === "CSV Import") score += 5;

  // Contact Enrichment
  if (lead.bestPhone) score += 25;
  if (lead.email) score += 15;

  // Geospatial Data
  if (!lead.needsAddressMatch) score += 10;
  if (lead.latitude && lead.longitude) score += 10;

  // Urgency (Sale Date)
  if (lead.saleDate) {
    const saleDateObj = new Date(lead.saleDate);
    const now = new Date();
    const diffDays = Math.ceil((saleDateObj.getTime() - now.getTime()) / (1000 * 3600 * 24));

    // Urgent: Sale is within 14 days
    if (diffDays >= 0 && diffDays <= 14) {
      score += 30;
    }
    // Approaching: Sale is within 30 days
    else if (diffDays > 14 && diffDays <= 30) {
      score += 15;
    }
  }

  return score;
}
