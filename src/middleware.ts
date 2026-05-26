import { withAuth } from "next-auth/middleware";

// Secure all routes inside the CRM by default
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Use negative lookahead to protect ALL routes EXCEPT explicitly public ones:
  // - Next.js internals (_next)
  // - Static files (favicon.ico, public assets)
  // - Auth routes (/api/auth, /login)
  // - Automated cron routes that handle their own auth (/api/intake)
  matcher: ["/((?!api/auth|api/intake|login|_next/static|_next/image|favicon.ico).*)"],
};
