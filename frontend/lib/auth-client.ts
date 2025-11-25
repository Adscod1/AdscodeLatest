import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  /** The base URL of the server - points to NestJS backend */
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000",
});
