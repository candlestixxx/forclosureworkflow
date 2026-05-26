# TODO

## Immediate Tasks (Phase 12: Advanced Connectors & Native Integrations)
- [ ] Upgrade `src/lib/connectors/myplus.ts` from a stub into a functional `playwright-core` script targeting a remote Browserless.io websocket.
- [ ] Add `hubspotApiKey` to the `Setting` Prisma model.
- [ ] Build a native HubSpot API integration (`src/lib/integrations/hubspot.ts`) as a robust alternative to generic Webhooks.
- [ ] Refactor Settings UI to allow configuring native integrations alongside webhooks.

## Completed Tasks
- [x] Phase 11: Deployment Polish (Error Boundaries, Skeleton Loaders, Github CI)
- [x] Phase 10: Advanced Browser Automation Connectors
- [x] Phase 9: Production DB Migration (Prisma Postgres provider)
- [x] Phase 8: Data Architecture Evolution (Database Settings, Audit Logs)
- [x] Phase 7: Frontend Verification (Playwright UI E2E)
- [x] Phase 6: UI/UX Refinements (CSV Import, Edit Lead, AddTagButton)
- [x] Phase 5: Auth Foundation (NextAuth, Middleware, Login UI)
- [x] Phase 4: Integrations (Webhook push, Settings UI)
- [x] Phase 3: Contact Enrichment (Relatives, Contacts, Lookup Helpers)
- [x] Phase 2: Foreclosure Intake (Text Parser, Intake API, Cron)
- [x] Phase 1: MVP CRM Foundation (SQLite, Prisma, Dashboard, Lead CRUD)
