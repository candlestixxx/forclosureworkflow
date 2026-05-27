import { NoticeParser, ParsedLead } from "./core";
import OpenAI from "openai";

export class LLMNoticeParser extends NoticeParser {
  public countyIdentifier = "LLM_AUTO";
  private openai: OpenAI;

  constructor(apiKey: string) {
    super();
    this.openai = new OpenAI({ apiKey });
  }

  public async parseAsync(text: string, source: string = "LLM Automated Intake"): Promise<ParsedLead> {
    const cleanText = this.cleanText(text);

    const prompt = `
You are a highly accurate data extraction assistant specializing in legal foreclosure and sheriff sale public notices.
Extract the following information from the notice text. Return the result strictly as a valid JSON object.

JSON Schema required:
{
  "ownerName": "Full name of the property owner or mortgagor (default to 'Unknown Owner' if missing)",
  "propertyAddress": "The physical street address of the property. If only a legal description (e.g. 'Lot 5...') is provided, return the legal description here.",
  "city": "The city name, if explicitly stated.",
  "zip": "The 5-digit zip code, if explicitly stated.",
  "saleDate": "The ISO 8601 string of the foreclosure auction/sale date (e.g. '2023-11-20T10:00:00Z'). Null if missing.",
  "needsAddressMatch": true if the propertyAddress is only a legal description without a valid street number and name, otherwise false.
}

Notice Text:
"""
${cleanText}
"""
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const responseText = response.choices[0].message.content;
    if (!responseText) {
        throw new Error("LLM returned empty response");
    }

    const data = JSON.parse(responseText);

    return {
      ownerName: data.ownerName || "Unknown Owner",
      propertyAddress: data.propertyAddress || "Unknown Address",
      city: data.city || "",
      zip: data.zip || "",
      saleDate: data.saleDate || undefined,
      rawNoticeText: text,
      source,
      needsAddressMatch: data.needsAddressMatch || false,
    };
  }

  // Override the sync parse method to throw, as LLM is async
  public parse(text: string, source: string): ParsedLead {
      throw new Error("LLMNoticeParser must be called using parseAsync(). Sync parse() is unsupported.");
  }
}
