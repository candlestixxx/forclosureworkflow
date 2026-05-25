# TODO

## Completed Tasks (Phase 5: Auth Foundation & Browser Workflows)
- [x] Install NextAuth (`next-auth`) to establish basic application security boundaries.
- [x] Implement Next.js `middleware.ts` to protect `/leads` and `/settings` routes.
- [x] Build a generic `/login` page UI.
- [x] (Future) Add Playwright connectors to the settings UI for advanced browser automation tasks (pending strict compliance rules).

## Completed Tasks (Phase 4: CRM + Automation Integrations)
- [x] Implement generic webhook push utility (`src/lib/webhook.ts`) for Zapier/Make integrations.
- [x] Build an API endpoint (`/api/export/webhook`) to handle the server-side lead export.
- [x] Add a Webhook URL configuration form to the Settings UI.
- [x] Add a "Push to CRM" action button to the Lead Detail view.

## Completed Tasks (Phase 3: Contact Enrichment)
- [x] Add `LeadRelative` model to Prisma schema for tracking roommates/relatives.
- [x] Create API routes for adding contacts (`/api/contacts`) and relatives (`/api/relatives`).
- [x] Build a "Lookup Helper" in the Lead Detail page with quick links to public search tools.
- [x] Implement manual enrichment UI components (forms to add phones, emails, and relatives with confidence scores).

## Completed Tasks (Phase 2: Weekly Foreclosure Intake)
- [x] Implement robust text parser (`src/lib/parser.ts`) to extract lead details from raw public notice text.
- [x] Create Intake API endpoint (`src/app/api/intake/route.ts`) to process batch notices or single text inputs.
- [x] Build a test UI in Settings to manually input raw text and trigger the intake workflow.
- [x] Set up Vercel Cron configuration (`vercel.json`) to run the automated intake every Friday at 12:00 PM.

## Completed Tasks (Phase 1: MVP Foundation)
- [x] Initialize Next.js project with Tailwind, ESLint, TypeScript.
- [x] Set up Prisma with SQLite.
- [x] Define initial Prisma schema for leads, notes, tasks, and tags.
- [x] Build basic UI layout (Dashboard, Lead List, Lead Detail).
- [x] Implement CRUD API routes for leads.
- [x] Add CSV import/export functionality.
- [x] Implement manual lead creation UI.
- [x] Implement basic duplicate detection logic on lead creation.
- [x] Wire up adding notes, tasks, and tags from the Lead Detail UI.

---
**STATUS: INITIAL MVP BUILD COMPLETE.**

## Nitpicks for Successor Model (Phase 6 / Refinements)
- [ ] Implement backend logic for CSV Import (currently just a UI button).
- [ ] Build out the `Edit Lead` modal/page to allow users to modify core Lead fields post-creation.
- [ ] Add an interactive UI component (`AddTagButton`) to allow users to dynamically add Tags to a lead on the details page.
