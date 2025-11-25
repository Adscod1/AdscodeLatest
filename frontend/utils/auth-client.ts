import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  /** Points to NestJS backend for authentication */
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000",
});
