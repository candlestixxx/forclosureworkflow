# TODO

## Immediate Tasks (Phase 10: Advanced Browser Automation Connectors)
- [ ] Define `Connector` base interface (`src/lib/connectors/core.ts`) for executing Playwright workflows safely.
- [ ] Build a stubbed `MyPlusLeadsConnector` implementing the core interface.
- [ ] Create an API endpoint (`/api/enrich/connector`) to queue and execute headless connector workflows.
- [ ] Update Lead Detail UI with a button to trigger connector runs.

## Completed Tasks
- [x] Phase 9: Production DB Migration (Prisma Postgres provider).
- [x] Phase 8: Data Architecture Evolution (Database Settings, Audit Logs)
- [x] Phase 7: Frontend Verification (Playwright UI E2E)
- [x] Phase 6: UI/UX Refinements (CSV Import, Edit Lead, AddTagButton)
- [x] Phase 5: Auth Foundation (NextAuth, Middleware, Login UI)
- [x] Phase 4: Integrations (Webhook push, Settings UI)
- [x] Phase 3: Contact Enrichment (Relatives, Contacts, Lookup Helpers)
- [x] Phase 2: Foreclosure Intake (Text Parser, Intake API, Cron)
- [x] Phase 1: MVP CRM Foundation (SQLite, Prisma, Dashboard, Lead CRUD)
