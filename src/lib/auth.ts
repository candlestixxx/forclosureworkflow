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
        const validUser = process.env.AUTH_USER;
        const validPass = process.env.AUTH_PASS;

        if (!validUser || !validPass) {
            // MVP Fallback for seamless local development
            if (process.env.NODE_ENV !== "production") {
                if (credentials?.username === "admin" && credentials?.password === "admin") {
                    return { id: "1", name: "MVP Admin", email: "admin@crm.local" };
                }
            }
            console.error("AUTH_USER and AUTH_PASS environment variables are not strictly defined. Authentication blocked.");
            return null;
        }

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
  secret: process.env.NEXTAUTH_SECRET,
};
