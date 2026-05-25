# TODO

## Immediate Tasks (Phase 8: Post-MVP & Browser Connectors)
- [ ] Migrate SQLite database to PostgreSQL (e.g., Supabase, Neon) for scalable production deployment.
- [ ] Build robust, terms-of-service compliant Playwright browser automation connector pipelines for third-party enrichment (e.g. MyPlus Leads) following the architecture laid out in `ARCHITECTURE.md`.
- [ ] Implement robust logging/audit tracking within the database for all browser automation runs.
- [ ] Convert `localStorage` global webhook destination into a proper database-backed multi-tenant settings model.

## Completed Tasks
- [x] Phase 7: Frontend Verification (Playwright UI E2E)
- [x] Phase 6: UI/UX Refinements (CSV Import, Edit Lead, AddTagButton)
- [x] Phase 5: Auth Foundation (NextAuth, Middleware, Login UI)
- [x] Phase 4: Integrations (Webhook push, Settings UI)
- [x] Phase 3: Contact Enrichment (Relatives, Contacts, Lookup Helpers)
- [x] Phase 2: Foreclosure Intake (Text Parser, Intake API, Cron)
- [x] Phase 1: MVP CRM Foundation (SQLite, Prisma, Dashboard, Lead CRUD)
