# DEPLOYMENT

## Local Development Setup
1. Ensure Node.js is installed.
2. Clone the repository.
3. Run `npm install` to install dependencies.
4. Run `npx prisma generate` and `npx prisma db push` to initialize the SQLite database.
5. Run `npm run dev` to start the development server.

## Production Deployment (Planned)
*   **Hosting**: Vercel or similar Node.js hosting.
*   **Database**: PostgreSQL or Supabase (migrate from SQLite).
*   **Environment Variables**: `DATABASE_URL`, `NEXT_PUBLIC_API_URL`, etc.
