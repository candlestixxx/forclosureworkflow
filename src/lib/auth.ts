import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        // 1. Check Database for User
        const dbUser = await prisma.user.findUnique({
          where: { email: credentials.username }
        });

        if (dbUser) {
           const isValid = await bcrypt.compare(credentials.password, dbUser.passwordHash);
           if (isValid) {
              return { id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role } as any; // Using any due to NextAuth standard type constraints
           }
           return null;
        }

        // 2. Fallback to Bootstrap / Environment Variables if no DB user matches
        const validUser = process.env.AUTH_USER;
        const validPass = process.env.AUTH_PASS;

        if (!validUser || !validPass) {
            // MVP Fallback for seamless local development
            if (process.env.NODE_ENV !== "production") {
                if (credentials.username === "admin" && credentials.password === "admin") {
                    return { id: "bootstrap-1", name: "MVP Admin", email: "admin@crm.local", role: "Admin" } as any;
                }
            }
            console.error("AUTH_USER and AUTH_PASS environment variables are not strictly defined. Authentication blocked.");
            return null;
        }

        if (credentials.username === validUser && credentials.password === validPass) {
          return { id: "env-1", name: "CRM Admin (Env)", email: validUser, role: "Admin" } as any;
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
