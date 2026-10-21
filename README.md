# Foreclosure Workflow — Lead Scrub + CRM

Foreclosure notice ingestion, enrichment, and CRM pipeline for distressed-property prospecting. Parses weekly legal notices (Macomb/Bay County), enriches owners with contact data, and exports to external CRMs.

## What It Does

- **Automated intake** — weekly foreclosure notice ingestion (`/api/intake`, cron-targeted) with `MacombCountyParser` / `LLMNoticeParser` (DeepSeek V4) extraction of owner, property address, sale date
- **Geocoding** — OpenStreetMap resolution of parsed addresses to map pins
- **Duplicate protection** — address/owner dedup on every intake pass
- **Contact enrichment** — CyberBackgroundChecks/Google quick-links + "Run MyPlus Leads Automation" (Playwright scrape of the data provider)
- **Lead scoring** — dynamic score bumps on phone/email discovery
- **Data export** — push to HubSpot (native API key) or generic webhook (Zapier/Make)
- **CSV import** — legacy lead upload with geocode backfill batch tooling
- **Map view** — geocoded leads with pin-to-detail navigation

## Architecture

- **Framework:** Next.js (App Router) + TypeScript + Tailwind v4
- **Database:** SQLite via Prisma (MVP phase)
- **Auth:** NextAuth (JWT sessions)
- **Parsers:** `src/lib/parsers/` — regex heuristic (`core.ts`) + LLM (`llm_parser.ts`, DeepSeek via OpenAI-compatible SDK)
- **Exports:** `src/lib/webhook.ts` — generic REST push client

## Routes

| Route | Purpose |
|---|---|
| `/leads` | CRM list view |
| `/leads/[id]` | Lead detail (enrichment, notes, relatives, tasks) |
| `/leads/new` | Manual lead creation |
| `/map` | Geospatial view |
| `/segments` | Saved lead segments |
| `/data-quality` | Completeness scoring |
| `/settings` | HubSpot key, webhook URL, import, geocode backfill, danger zone |

## Quick Start

```bash
npm install --legacy-peer-deps
npx prisma generate && npx prisma db push
npm run dev
```

Environment: `DATABASE_URL`, `NEXTAUTH_SECRET`, `DEEPSEEK_API_KEY` (LLM notice parsing).

## Documentation

| File | Purpose |
|---|---|
| `ARCHITECTURE.md` | Full technical architecture |
| `MANUAL.md` | End-user manual (intake → enrich → export) |
| `docs/macomb-*.md` | County foreclosure pipeline specs + field maps |
| `DEPLOY.md` | Deployment (Hetzner, port 3212) |
