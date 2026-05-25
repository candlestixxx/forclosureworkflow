# TODO

## Immediate Tasks (Phase 2: Weekly Foreclosure Intake)
- [ ] Implement robust text parser (`src/lib/parser.ts`) to extract lead details from raw public notice text.
- [ ] Create Intake API endpoint (`src/app/api/intake/route.ts`) to process batch notices or single text inputs.
- [ ] Build a test UI in Settings to manually input raw text and trigger the intake workflow.
- [ ] Set up Vercel Cron configuration (`vercel.json`) to run the automated intake every Friday at 12:00 PM.

## Completed Tasks (Phase 1)
- [x] Initialize Next.js project with Tailwind, ESLint, TypeScript.
- [x] Set up Prisma with SQLite.
- [x] Define initial Prisma schema for leads, notes, tasks, and tags.
- [x] Build basic UI layout (Dashboard, Lead List, Lead Detail).
- [x] Implement CRUD API routes for leads.
- [x] Add CSV import/export functionality.
- [x] Implement manual lead creation UI.
- [x] Implement basic duplicate detection logic on lead creation.
- [x] Wire up adding notes, tasks, and tags from the Lead Detail UI.
