import { PrismaClient } from '@prisma/client';

/**
 * Extension type for PrismaClient to ensure TypeScript recognizes the Influencer and
 * InfluencerSocial models that were added to the schema.
 * This is a simpler approach than defining all delegate methods explicitly.
 */
export type ExtendedPrismaClient = PrismaClient;
