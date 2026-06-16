# ARCHITECTURE

## Foreclosure Lead Scrub + CRM

### Technology Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database ORM**: Prisma v5 (selected for stable SQLite local development)
- **Database**: SQLite (MVP phase)
- **Authentication**: NextAuth.js (Auth.js) v4 with standard JWT session middleware
- **Icons**: Lucide React

### Directory Structure & Routing
```text
/src
  /app
    /api
      /auth/[...nextauth]    # NextAuth dynamic handler
      /contacts              # Enrichment API
      /export                # CSV and Webhook push APIs
      /intake                # Weekly foreclosure parser API (Cron target)
      /leads                 # Core CRUD API
      /notes                 # Lead Notes API
      /relatives             # Enrichment API
      /tasks                 # Lead Tasks API
    /leads                   # CRM List View UI
      /[id]                  # Lead Detail View UI
      /new                   # Manual Lead Creation Form
    /login                   # Authentication UI
    /settings                # Configuration UI
    layout.tsx               # Root layout (Sidebar + SessionProvider)
    page.tsx                 # Dashboard metrics view
  /lib
    auth.ts                  # NextAuth Configuration
    parser.ts                # Regex Heuristic Text Parser
    prisma.ts                # Global Prisma client singleton
    webhook.ts               # Generic Zapier/Make REST client
```

### Prisma Data Model
- **Lead**: The core entity. Contains property details, sale dates, status, and raw notice text.
- **LeadContact**: 1-to-many relationship with Lead. Stores phone/emails and confidence scores.
- **LeadRelative**: 1-to-many relationship with Lead. Tracks spouses, roommates, co-owners.
- **LeadNote**: 1-to-many. Chronological internal audit trail and user notes.
- **LeadTask**: 1-to-many. Actionable follow-ups with due dates.
- **LeadTag**: 1-to-many. Custom categorization (e.g., `#needsaddressmatch`).

### Core Workflows
1. **Intake Flow**: Vercel cron hits `/api/intake` on Fridays at 12 PM. The route reads raw text, parses it via `src/lib/parser.ts`, handles duplicates, and generates `Lead` objects.
2. **Enrichment Flow**: User views a lead, uses `LookupHelper` to search CyberBackgroundChecks, then inputs discovered data via `EnrichmentActions.tsx` forms.
3. **Export Flow**: User clicks "Push to CRM". The lead is serialized and POSTed to a destination webhook configured in `localStorage`.

### Verification & Testing
- **E2E UI Testing**: Playwright is utilized to verify complete user journeys and authentication boundaries (e.g., logging in, navigating secure lists, mutating data).

### Browser Automation Constraints
For future implementation of the MyPlus Leads or CyberBackgroundChecks automation integration:
1.  **Connector Framework**: Automation must be built as a modular "Connector" (e.g., `src/lib/connectors/myplus.ts`) rather than a hardcoded scraper.
2.  **Compliance**: Connectors must execute only user-approved, terms-of-service-compliant actions. Do not bypass CAPTCHAs or bot protections. Prefer API integration where possible.
3.  **Audit Logs**: All connector runs must be logged to a database table to maintain an audit trail of data enrichment sources.
