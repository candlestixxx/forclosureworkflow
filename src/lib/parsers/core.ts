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

export abstract class NoticeParser {
  public abstract countyIdentifier: string;

  /**
   * Primary abstract method. Given raw text from a legal notice source,
   * the parser must return a structured ParsedLead payload.
   */
  public abstract parse(text: string, source: string): ParsedLead;

  /**
   * Utility method to sanitize raw input before regex matching.
   */
  protected cleanText(text: string): string {
    return text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
  }
}
