/**
 * Foreclosure Notice Parser
 *
 * Extracts structured data from raw legal notice text.
 * Note: Real-world parsing often requires LLMs or highly specialized OCR/Regex rules per county.
 * This MVP parser relies on standard Michigan/Macomb heuristics.
 */

export interface ParsedLead {
  ownerName: string;
  propertyAddress: string;
  city?: string;
  zip?: string;
  saleDate?: string;
  rawNoticeText: string;
  source: string;
  needsAddressMatch: boolean;
}

export function parseNoticeText(text: string, source: string = "Automated Intake"): ParsedLead {
  const cleanText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');

  let ownerName = "Unknown Owner";
  let propertyAddress = "Unknown Address";
  let city = "";
  let zip = "";
  let saleDateStr = undefined;
  let needsAddressMatch = false;

  // Heuristic 1: Sale Date
  // Looks for common patterns like "will be sold... on [Date]" or "Friday, [Date]"
  const dateMatch = cleanText.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/i);
  if (dateMatch) {
    saleDateStr = new Date(dateMatch[0]).toISOString();
  }

  // Heuristic 2: Owner Name
  // Typically follows "made by" or "mortgagor"
  const mortgagorMatch = cleanText.match(/(?:made by|mortgagor\(s\),|mortgagor:)\s+([A-Za-z\s]+?)(?:,|to|husband|wife|an|a single)/i);
  if (mortgagorMatch && mortgagorMatch[1]) {
    ownerName = mortgagorMatch[1].trim();
  }

  // Heuristic 3: Property Address vs Legal Description
  // Looks for standard street designations
  const addressMatch = cleanText.match(/(\d+\s+[A-Za-z0-9\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Court|Ct|Lane|Ln|Trail|Way|Place|Pl)[A-Za-z0-9\s,]*)/i);

  if (addressMatch) {
    propertyAddress = addressMatch[1].trim();
    // Try to extract city/zip if possible from the address string suffix
    const miMatch = propertyAddress.match(/(.+?),\s*(.+?)(?:,\s*MI)?\s*(\d{5})?/i);
    if (miMatch) {
        if(miMatch[2]) city = miMatch[2].trim();
        if(miMatch[3]) zip = miMatch[3].trim();
    }
  } else {
    // Fallback: If no street address found, it might only be a legal description (e.g., "Lot 14 of Subdivision...")
    const legalDescMatch = cleanText.match(/(?:Lot|Parcel|Block)\s+[A-Za-z0-9\s,]+/i);
    if (legalDescMatch) {
      propertyAddress = legalDescMatch[0].trim();
      needsAddressMatch = true; // Flag for CRM that a real street address is missing
    }
  }

  return {
    ownerName,
    propertyAddress,
    city,
    zip,
    saleDate: saleDateStr,
    rawNoticeText: text,
    source,
    needsAddressMatch
  };
}
