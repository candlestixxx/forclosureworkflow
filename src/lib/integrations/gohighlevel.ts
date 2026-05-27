import { Lead, LeadContact } from "@prisma/client";

export async function pushToGoHighLevel(apiKey: string, lead: Lead & { contacts: LeadContact[] }): Promise<boolean> {
  const ghlApiUrl = 'https://rest.gohighlevel.com/v1/contacts/';

  // Extract names
  const nameParts = lead.ownerName.split(" ");
  const firstName = nameParts[0] || "Unknown";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Owner";

  // Map to GHL standard Contact schema
  const payload = {
    firstName: firstName,
    lastName: lastName,
    email: lead.email || "",
    phone: lead.bestPhone || "",
    address1: lead.propertyAddress || "",
    city: lead.city || "",
    postalCode: lead.zip || "",
    tags: ["foreclosure-lead", "automated-import"],
    source: "Foreclosure CRM",
    customField: {
      "sale_date": lead.saleDate ? lead.saleDate.toISOString() : ""
    }
  };

  try {
    const response = await fetch(ghlApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("GoHighLevel API Error:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to connect to GoHighLevel API:", error);
    return false;
  }
}
