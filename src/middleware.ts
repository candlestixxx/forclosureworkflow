import { withAuth } from "next-auth/middleware";

// Secure all routes inside the CRM by default
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Protect root (Dashboard), /leads, /settings, and API routes except Auth/Intake
  matcher: [
    "/",
    "/leads/:path*",
    "/settings/:path*",
    "/api/leads/:path*",
    "/api/notes/:path*",
    "/api/tasks/:path*",
    "/api/contacts/:path*",
    "/api/relatives/:path*",
    "/api/export/:path*"
  ],
};
