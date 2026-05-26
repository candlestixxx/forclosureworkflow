# CHANGELOG

## [1.1.0-rc.1] - Analytics # CHANGELOG Preparation Release
- Integrated `@vercel/analytics` into the root application layout.
- Finalized stability, caching, and server-side components for production delivery.


## [1.1.0] - Search & Scaling Release
- **COMPLETED**: The final refinements for the Foreclosure CRM.
- All 17 Phases have been successfully implemented.
- Implemented robust, dynamic Client-side URL searching mapped directly to Prisma ORM filtering logic.
- Hardened data ingestion pipelines with Zod schema validation and PapaParse CSV ingestion.
- Added server-side cursor pagination to the Leads list to ensure database stability at scale.

## [1.0.0] - Production Ready Release
- **COMPLETED**: The Foreclosure Lead Scrub + CRM Workflow Tool MVP.
- All 13 original Phases specified in the primary vision documents have been successfully implemented.
- The platform operates as a secure, authenticated CRM with automated webhook parsing, integrated HubSpot connectivity, and Playwright-orchestrated headless scraping capabilities.
- Finalized Zod schema placeholders, database reset hooks, and negative-lookahead security middleware boundaries.

## [1.0.0-rc.1] - MVP Release Candidate
- Finalized Next.js App Router boundaries (`loading.tsx`, `error.tsx`).
- Finalized GitHub Actions deployment pipelines for CI verification.

## [0.2.0-beta] - Complete MVP Implementation
- Completed Phase 1: Standalone CRM Foundation (DB schema, basic UI, API CRUD).
- Completed Phase 2: Weekly Foreclosure Intake (Text parser, cron jobs, intake API).
- Completed Phase 3: Contact Enrichment (LeadRelatives, Lookup Helpers, UI Actions).
- Completed Phase 4: Integrations (Webhook exporter, Push to CRM UI).
- Completed Phase 5: Security Boundary (NextAuth Credentials Provider, Next.js Middleware).
- Completed Phase 6: UI Refinements (CSV imports, tag buttons, edit forms).
- Completed Phase 7: UI Test Verification (Playwright E2E visual pass).
- Completed Phase 8: Audit Logging & Config DB schemas.
- Completed Phase 9: PostgreSQL Provider transition.
- Completed Phase 10: Playwright Connector core architecture framework.
- Completed Phase 11: Deployment CI flows.
- Completed Phase 12: HubSpot / Browserless integrations.
- Completed Phase 13: Factory DB resets & Validation stubs.

## [0.1.0-alpha] - Initial Setup
- Initialized documentation files.
