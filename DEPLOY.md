# DEPLOYMENT

## Production Database Configuration (PostgreSQL)
The application has been upgraded from the MVP SQLite database to require a production-ready PostgreSQL database.

### 1. Provision a Database
We strongly recommend using a serverless Postgres provider for seamless Next.js Vercel deployments:
- **Supabase**: https://supabase.com
- **Neon**: https://neon.tech

### 2. Configure Environment Variables
Copy the connection string provided by your database host and update your `.env` file. You must use the connection pooler URL if deploying to serverless functions.

```env
# Example Supabase Connection String (Transaction Pooler)
DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Required Auth Secrets
NEXTAUTH_SECRET="your_highly_secure_random_string_here"
NEXTAUTH_URL="http://localhost:3000" # Change to production domain on Vercel
AUTH_USER="admin"
AUTH_PASS="admin123!Secure"
```

### 3. Initialize the Database Schema
Once your `.env` is configured, run the following commands locally to push the schema to your Postgres server and generate the Prisma client:

```bash
npx prisma generate
npx prisma db push
```
*Note: If you wish to use standard migration tracking, you can instead run `npx prisma migrate dev --name init`.*

### 4. Deploying to Vercel
1. Push your repository to GitHub.
2. Import the project in the Vercel Dashboard.
3. Add all the environment variables from Step 2 into the Vercel project settings.
4. Vercel will automatically run `npm run build`. The build command executes Prisma client generation under the hood.

## Local Development Setup
1. Ensure Node.js is installed.
2. Clone the repository and run `npm install`.
3. Configure the `.env` file as shown above (you must have a remote Postgres DB or run one locally via Docker).
4. Run `npx prisma db push`.
5. Run `npm run dev` to start the development server.
