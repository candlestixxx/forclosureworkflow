import { Lead, LeadContact } from "@prisma/client";

export async function pushToHubSpot(apiKey: string, lead: Lead & { contacts: LeadContact[] }): Promise<boolean> {
  const hubspotApiUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';

  // Extract names
  const nameParts = lead.ownerName.split(" ");
  const firstName = nameParts[0] || "Unknown";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Owner";

  // Map to HubSpot standard Contact schema
  const payload = {
    properties: {
      firstname: firstName,
      lastname: lastName,
      email: lead.email || "",
      phone: lead.bestPhone || "",
      address: lead.propertyAddress || "",
      city: lead.city || "",
      zip: lead.zip || "",
      lifecyclestage: "lead",
      hs_lead_status: "NEW",
      message: `Foreclosure Sale Date: ${lead.saleDate ? lead.saleDate.toISOString() : 'Unknown'}`
    }
  };

  try {
    const response = await fetch(hubspotApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("HubSpot API Error:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to connect to HubSpot API:", error);
    return false;
  }
}
