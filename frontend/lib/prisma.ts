// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { ExtendedPrismaClient } from "@/types/prisma";

// Use a global variable to prevent multiple instances in development
declare global {
  var prisma: ExtendedPrismaClient | undefined;
}

// Create a singleton instance of the Prisma Client
export const prisma: ExtendedPrismaClient = 
  globalThis.prisma || new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// In development, attach the client to the global object to prevent multiple instances
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
