import { Lead } from "@prisma/client";
import { logAudit } from "../audit";

export interface EnrichmentResult {
  resolvedAddress?: string;
  resolvedCity?: string;
  resolvedZip?: string;
  phones: Array<{ value: string, confidence: number }>;
  emails: Array<{ value: string, confidence: number }>;
  relatives: Array<{ name: string, relation?: string, phone?: string }>;
  success: boolean;
  message?: string;
}

export abstract class BaseConnector {
  public abstract connectorName: string;
  public abstract requiresLogin: boolean;

  /**
   * The primary entrypoint. Takes a lead, performs the automated scraping/API workflow,
   * and returns an EnrichmentResult payload. Logs heavily to the AuditLog table.
   */
  public async execute(lead: Lead): Promise<EnrichmentResult> {
    await logAudit("CONNECTOR_START", `Starting ${this.connectorName} for Lead ${lead.id}`, "SUCCESS");

    try {
      const result = await this.performWorkflow(lead);

      if (result.success) {
         await logAudit("CONNECTOR_END", `Successfully enriched Lead ${lead.id} via ${this.connectorName}`, "SUCCESS");
      } else {
         await logAudit("CONNECTOR_END", `Failed to enrich Lead ${lead.id} via ${this.connectorName}: ${result.message}`, "FAILURE");
      }

      return result;

    } catch (error: any) {
      console.error(`Connector Error (${this.connectorName}):`, error);
      await logAudit("CONNECTOR_CRASH", `Fatal error running ${this.connectorName} on Lead ${lead.id}: ${error.message}`, "FAILURE");
      return { success: false, phones: [], emails: [], relatives: [], message: error.message };
    }
  }

  /**
   * Must be implemented by subclasses. This is where Playwright or API logic lives.
   */
  protected abstract performWorkflow(lead: Lead): Promise<EnrichmentResult>;
}
