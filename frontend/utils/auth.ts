import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
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

// Helper to get session from the backend API
export async function getBackendSession() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/auth/get-session`,
      {
        headers: {
          Cookie: cookieHeader,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to get session from backend:", error);
    return null;
  }
}