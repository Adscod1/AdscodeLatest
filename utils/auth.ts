import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins: ["http://localhost:3000"],
  secret: process.env.BETTER_AUTH_SECRET || "default-secret-key-for-development-only",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  session: {
    // Set shorter session expiry and update cookie settings
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    cookie: {
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  },
});