# Foreclosure CRM User Manual

Welcome to the Foreclosure Lead Scrub and CRM Workflow tool. This manual outlines how to effectively utilize the platform to ingest, enrich, and export real estate leads.

## 1. Automated Intake (Friday Foreclosures)
The CRM is designed to automatically ingest weekly foreclosure notices.
*   **How it works**: Every Friday at 12:00 PM, a background Vercel Cron job executes the `/api/intake` route.
*   **What it does**: The system pulls raw legal notice text, passes it through the `MacombCountyParser`, and extracts the Owner Name, Property Address, and Sale Date.
*   **Geocoding**: After parsing, the system securely queries OpenStreetMap to resolve the property address into Map coordinates.
*   **Duplicate Protection**: If an address or owner already exists in the database, the intake loop safely ignores it to prevent duplicates.

## 2. Contact Enrichment
Once a lead is ingested, it usually lacks phone numbers and emails.
*   **Manual Enrichment**: Navigate to a Lead's details page. Click the **CyberBackgroundChecks** or **Google** quick-link buttons to immediately search public records for that specific owner/address.
*   **Automated Enrichment**: Click the "Run MyPlus Leads Automation" button. The CRM will trigger a remote Playwright browser instance to securely log into your data provider, scrape the phone numbers matching the address, and push them into the database automatically.
*   **Scoring**: Adding phone numbers or emails will dynamically increase the Lead's "Score", which helps your team prioritize follow-ups.

## 3. Data Export & Integrations
You can sync your enriched leads to external CRMs like HubSpot or GoHighLevel.
*   **Configuration**: Visit the **Settings** page. You can input a native HubSpot API key, or a generic Webhook Catch URL (from Zapier or Make.com).
*   **Execution**: On any Lead's details page, click the **Push to CRM** button in the top right. The system will bundle all notes, contacts, tags, and relative data into a JSON payload and push it to your configured destinations.

## 4. Geospatial Mapping
*   **Map View**: Click the **Map View** tab on the sidebar.
*   All leads with valid `latitude` and `longitude` coordinates will appear here. Clicking a pin allows you to jump straight into the Lead's detail page.
*   **Geocode Backfill**: If you manually imported a CSV of legacy leads, they won't have map pins yet. Go to **Settings** -> **Danger Zone** and click "Run Geocode Batch" to automatically map 10 legacy leads at a time.

## 5. CSV Imports
*   In the **Settings** menu, use the Upload button to ingest legacy data. Ensure your CSV has headers and maps Owner Name to Column 2 and Property Address to Column 3.
