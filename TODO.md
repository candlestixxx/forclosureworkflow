# TODO

## Immediate Tasks (Post-MVP Maintenance)
- [ ] Monitor Vercel and Supabase production environments for any Prisma connection pool limits or latency spikes.
- [ ] If additional data sources are needed (e.g., probate leads, tax liens), clone the `src/lib/parser.ts` logic to accommodate specific new county legal formats.

## Completed Tasks
- [x] Phase 17: Stability & Handover (System audit, final version bump)
- [x] Phase 16: Search Implementation (Client-side debounced search, Prisma filtering)
- [x] Phase 15: Pagination & Optimization (Prisma offset pagination, UI controls)
- [x] Phase 14: Data Integrity (Zod, PapaParse)
- [x] Phase 13: Final Polish (Database Reset, Zod markers, Security patches)
- [x] Phase 12: Advanced Connectors & Native Integrations (HubSpot, Browserless.io logic)
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
