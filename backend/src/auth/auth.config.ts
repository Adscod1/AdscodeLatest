import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';

// Create a dedicated Prisma client for Better-Auth
// This is separate from the NestJS Prisma service to avoid circular dependencies
const prisma = new PrismaClient();

// Log the configuration for debugging
console.log('Better-Auth Configuration:', {
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:4000',
  frontendURL: process.env.FRONTEND_URL || 'http://localhost:3000',
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mysql',
  }),
  basePath: '/api/auth',
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirectURI: `${process.env.BETTER_AUTH_URL || 'http://localhost:4000'}/api/auth/callback/google`,
    },
  },
  trustedOrigins: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
  ],
  secret: process.env.BETTER_AUTH_SECRET || 'default-secret-key-for-development-only',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:4000',
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    cookie: {
      sameSite: 'lax',
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  },
  // Redirect to frontend after successful authentication
  redirects: {
    afterSignIn: process.env.FRONTEND_URL || 'http://localhost:3000',
    afterSignUp: process.env.FRONTEND_URL || 'http://localhost:3000',
    afterSignOut: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
});

export type AuthSession = typeof auth.$Infer.Session;
