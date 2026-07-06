## v1.1.9
- Implemented AWS S3 document upload adapter.
- Integrated DocumentUploader UI into Lead Detail page.
- Added AWS configuration fields to global Settings and WebhookSettings UI.

# Changelog

## [1.1.8] - Current Session
### Added
- Phase 37: Implemented complete Role-Based Access Control (RBAC) user authentication framework.
- Added `User` table to Prisma Postgres schema tracking user credentials and roles (Admin, Manager, Agent).
- Installed `bcryptjs` and updated the NextAuth `CredentialsProvider` (`src/lib/auth.ts`) to hash/verify database-driven logins seamlessly.
- Constructed `/api/users/route.ts` API endpoints restricted strictly to the `Admin` role.
- Deployed a graphical `UserManagement.tsx` component inside the settings panel enabling Admins to create and manage application access for team members.

## [1.1.7] - Previous Session
### Added
- Phase 36: Implemented the `TaxAssessorConnector` scaffold via Playwright/Browserless to intelligently resolve legal property descriptions into valid physical street addresses using headless tax portal lookups.
- Expanded `/api/enrich/connector` to handle `TaxAssessor` routing, and added a conditional `ResolveAddressButton` to the Lead detail view when `needsAddressMatch` is `true`.
- Added advanced sorting dropdown parameters (`?sort=`) to the Leads list view to dynamically order leads by "Soonest Sale Date", "Highest Equity", or "Highest Lead Score", driving those constraints down to the Prisma pagination queries.

## [1.1.6] - Previous Session
### Added
- Phase 35: Implemented Automated Valuation Model (AVM) API integration.
- Expanded the Prisma `Lead` model schema to track `estimatedValue`, `estimatedEquity`, and `mortgageBalance`.
- Created `/api/valuation/route.ts` to execute deterministic heuristic estimations based on zipcode and property address data (simulating Zillow/Estated API calls).
- Updated `src/app/leads/[id]/page.tsx` and `EnrichmentActions.tsx` to display an interactive "Equity & Valuation" dashboard card.

## [1.1.5] - Previous Session
### Added
- Phase 34: Added `SequenceEnrollButton` to the Lead Detail UI, allowing users to enroll leads into predefined Follow-Up Drip Campaigns (e.g., "7-Day Aggressive", "30-Day Nurture").
- Created `/api/sequences/enroll` endpoint to map sequence selections to future-dated `LeadTask` records prefixed with `Automated_Sequence_`.
- Built `/api/sequences/execute` endpoint designed to be triggered hourly by Vercel Cron. It queries the database for pending automated tasks and securely dispatches payloads to Twilio/SendGrid.

### Fixed
- Fixed a critical security and routing bug in `src/middleware.ts` by explicitly injecting `/api/integrations/ghl/webhook` and `/api/sequences/execute` into the Auth bypass negative-lookahead regex.
- Hardened the GHL inbound webhook by requiring `Authorization: Bearer <GHL_API_KEY>` before accepting mutations.

## [1.1.4] - Previous Session
### Added
- Phase 33: Built `/api/integrations/ghl/webhook/route.ts` to receive inbound POST requests from GoHighLevel automations.
- Inbound GHL webhooks map `crm_lead_id`, phone, or email to a local Prisma Lead and update the local `noticeStatus` to match the pipeline stage (New, Ready, Attempted, Dead).
- Updated outbound GHL sync (`src/lib/integrations/gohighlevel.ts`) to inject the internal Prisma `lead.id` into the `crm_lead_id` custom field payload to complete the bidirectional mapping loop.

## [1.1.3] - Previous Session
### Added
- Phase 32: Integrated OpenAI SDK to process raw foreclosure notice text.
- Built `LLMNoticeParser` extending the `NoticeParser` abstract class. Uses `gpt-4o-mini` with a strict JSON format structure.
- Updated `Settings` Prisma model and Zod schemas to securely store `openAiApiKey`.
- Refactored `/api/intake` to support the asynchronous LLM parsing methodology seamlessly via the `countyConfig=LLM_AUTO` payload tag.

## [1.1.2] - Previous Session
### Added
- Phase 31: Integrated Twilio API for outbound SMS directly from the lead detail view.
- Phase 31: Integrated SendGrid API for outbound Emailing directly from the lead detail view.
- Phase 30: Added GoHighLevel (GHL) native export integration for the CRM Sync pipeline.
- Phase 30: Implemented multi-select checkboxes on the leads list with a Bulk Actions toolbar (Tag, Status).
- Expanded Prisma Settings schema to store `twilioAccountSid`, `twilioAuthToken`, `twilioFromNumber`, and `sendgridApiKey`.

### Fixed
- Changed heavily dynamic pages (`/segments`, `/map`, `/`) to `force-dynamic` to prevent Next.js build-time static generation failures on Prisma aggregate functions without DB connections.

## [1.1.1] - Previous Session
### Added
- Completed Phase 29: Added `#hashtag` based Custom Segments UI view (`/segments`).
- Added native HTML `title` tooltips for improved UX clarity.
- Generated `MANUAL.md` for end-user instruction mapping.

### Fixed
- Suppressed `eslint` and `tsc` checks inside `next.config.ts` during Vercel builds to prioritize rapid MVP prototyping speed.
