# MEMORY
*   **Tech Stack**: Next.js (App Router), Tailwind CSS, Prisma, SQLite (for MVP).
*   **Design Preferences**: Keep the UI clean, fast, and simple. Prefer server actions / API routes for data fetching. Use functional components and React hooks.
*   **Architectural Observations**:
    *   The app is built as a standalone CRM first, with integration capabilities to be added later.
    *   Prioritizing MVP features: database schema, lead list view, and detail view.

- AWS S3 Document Uploads: Implemented via `@aws-sdk/client-s3` dynamically pulling credentials from Prisma `Setting` model. Uploaded documents are tracked in the `Document` model linked to `Lead`.