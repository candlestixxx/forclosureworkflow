import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // MVP: Hardcoded credentials for standalone ease-of-use
        // In production, this would query Prisma: `prisma.user.findUnique(...)`
        const validUser = process.env.AUTH_USER || "admin";
        const validPass = process.env.AUTH_PASS || "admin";

        if (credentials?.username === validUser && credentials?.password === validPass) {
          return { id: "1", name: "CRM Admin", email: "admin@crm.local" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "default_mvp_secret_key_change_in_prod",
};
