import { BaseConnector, EnrichmentResult } from "./core";
import { Lead } from "@prisma/client";
import { chromium } from "playwright-core";
import { prisma } from "@/lib/prisma";

export class TaxAssessorConnector extends BaseConnector {
  public connectorName = "County Tax Assessor";
  public requiresLogin = false;

  protected async performWorkflow(lead: Lead): Promise<EnrichmentResult> {
    const settings = await prisma.setting.findUnique({ where: { id: "global" } });
    const wsEndpoint = settings?.browserlessEndpoint || process.env.BROWSERLESS_WS_ENDPOINT;

    // Without a Browserless endpoint the headless scrape cannot run — report
    // failure instead of simulating a resolved address.
    if (!wsEndpoint) {
      console.error('BROWSERLESS_WS_ENDPOINT not configured — Tax Assessor lookup NOT performed.');
      return {
        success: false,
        phones: [],
        emails: [],
        relatives: [],
        resolvedAddress: '',
        resolvedCity: '',
        resolvedZip: '',
        message: 'Tax Assessor lookup unavailable: BROWSERLESS_WS_ENDPOINT is not configured.'
      };
    }

    let browser;
    try {
      // Connect to remote Browserless.io instance with retry
      let lastError: any;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          browser = await chromium.connectOverCDP(wsEndpoint);
          break;
        } catch (err: any) {
          lastError = err;
          if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt));
        }
      }
      if (!browser) throw lastError || new Error('Failed to connect to browser');

      const context = await browser.newContext();
      const page = await context.newPage();
      page.setDefaultTimeout(15000);

      // In a real scenario, this would navigate to a specific county GIS or Tax portal.
      // e.g., Macomb County BSA or BS&A Online.
      // We will perform a generic scaffold here.

      await page.goto('https://bsaonline.com/MunicipalDirectory');

      // Real BS&A navigation/search: locate the municipality directory entry,
      // search the property address, and extract the resolved record fields.
      // BS&A requires municipality routing, so we search within the lead's
      // city when available.
      const searchInput = page.locator('input[name="search"], input[type="search"], input[placeholder*="Search"]').first();
      await searchInput.fill(lead.propertyAddress + (lead.city ? `, ${lead.city}` : ''));
      await page.keyboard.press('Enter');
      await page.waitForSelector('.property-details, .search-result, table', { timeout: 15000 });

      // Open the first result's detail view if results are listed.
      const firstResult = page.locator('.search-result a, table tbody tr a').first();
      if (await firstResult.count()) {
        await firstResult.click();
        await page.waitForSelector('.property-details, .property-info', { timeout: 15000 }).catch(() => {});
      }

      // Extract fields from the detail view. Selectors are best-effort against
      // BS&A's public markup; missing fields stay empty rather than invented.
      const extract = async (selectors: string[]): Promise<string> => {
        for (const sel of selectors) {
          const el = page.locator(sel).first();
          if (await el.count()) {
            const text = (await el.textContent())?.trim();
            if (text) return text;
          }
        }
        return '';
      };

      const resolvedAddress = await extract(['.street-address', '.property-address', '[data-field="address"]']);
      const resolvedCity = await extract(['.property-city', '[data-field="city"]']);
      const resolvedZip = await extract(['.property-zip', '[data-field="zip"]']);

      if (!resolvedAddress) {
        return {
          success: false,
          phones: [],
          emails: [],
          relatives: [],
          resolvedAddress: '',
          resolvedCity: '',
          resolvedZip: '',
          message: 'BS&A record not found for this address (or page layout changed).'
        };
      }

      return {
        success: true,
        phones: [],
        emails: [],
        relatives: [],
        resolvedAddress,
        resolvedCity,
        resolvedZip,
        message: 'Successfully extracted address data via Headless Tax Assessor lookup.'
      };

    } catch (error: any) {
      console.error("TaxAssessorConnector Execution Error:", error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
