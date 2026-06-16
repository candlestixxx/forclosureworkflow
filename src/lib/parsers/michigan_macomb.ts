import { NoticeParser, ParsedLead } from "./core";

export class MacombCountyParser extends NoticeParser {
  public countyIdentifier = "MI_MACOMB";

  public parse(text: string, source: string = "Automated Intake"): ParsedLead {
    const cleanText = this.cleanText(text);

    let ownerName = "Unknown Owner";
    let propertyAddress = "Unknown Address";
    let city = "";
    let zip = "";
    let saleDateStr = undefined;
    let needsAddressMatch = false;

    // Heuristic 1: Sale Date
    const dateMatch = cleanText.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/i);
    if (dateMatch) {
      saleDateStr = new Date(dateMatch[0]).toISOString();
    }

    // Heuristic 2: Owner Name
    const mortgagorMatch = cleanText.match(/(?:made by|mortgagor\(s\),|mortgagor:)\s+([A-Za-z\s]+?)(?:,|to|husband|wife|an|a single)/i);
    if (mortgagorMatch && mortgagorMatch[1]) {
      ownerName = mortgagorMatch[1].trim();
    }

    // Heuristic 3: Property Address vs Legal Description
    const addressMatch = cleanText.match(/(\d+\s+[A-Za-z0-9\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Court|Ct|Lane|Ln|Trail|Way|Place|Pl)[A-Za-z0-9\s,]*)/i);

    if (addressMatch) {
      propertyAddress = addressMatch[1].trim();
      const miMatch = propertyAddress.match(/(.+?),\s*(.+?)(?:,\s*MI)?\s*(\d{5})?/i);
      if (miMatch) {
          if(miMatch[2]) city = miMatch[2].trim();
          if(miMatch[3]) zip = miMatch[3].trim();
      }
    } else {
      const legalDescMatch = cleanText.match(/(?:Lot|Parcel|Block)\s+[A-Za-z0-9\s,]+/i);
      if (legalDescMatch) {
        propertyAddress = legalDescMatch[0].trim();
        needsAddressMatch = true;
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
}
