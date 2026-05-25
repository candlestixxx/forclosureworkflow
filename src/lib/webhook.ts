/**
 * Generic Webhook Exporter
 *
 * Takes a full Lead payload and POSTs it as JSON to a configured target URL.
 * Designed to interface with Zapier, Make.com, or custom CRM catch-hooks.
 */

export async function pushToWebhook(webhookUrl: string, payload: any): Promise<boolean> {
  if (!webhookUrl) {
    throw new Error("Webhook URL is not configured.");
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Foreclosure-CRM-MVP/1.0'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error(`Webhook returned non-200 status: ${response.status} ${response.statusText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to execute webhook push:", error);
    return false;
  }
}
