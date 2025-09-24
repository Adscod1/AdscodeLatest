# Multi-stage Dockerfile for Adscod Next.js application
# Supports both development and production environments

# Base image with Node.js
FROM node:20-alpine AS base

# Install system dependencies and security updates
RUN apk update && apk upgrade && \
    apk add --no-cache \
    libc6-compat \
    curl \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Install dependencies stage
FROM base AS deps

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with proper handling
RUN \
  if [ -f package-lock.json ]; then \
    npm ci --legacy-peer-deps && \
    cp -R node_modules all_node_modules && \
    npm ci --legacy-peer-deps --omit=dev && \
    cp -R node_modules prod_node_modules && \
    cp -R all_node_modules node_modules; \
  else \
    echo "Lockfile not found." && exit 1; \
  fi

# Development stage
FROM base AS development

# Set development environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Change ownership to nextjs user
RUN chown -R nextjs:nodejs /app
RUN mkdir -p .next && chown -R nextjs:nodejs .next
USER nextjs


# Expose port
EXPOSE 3000

# Default development command (can be overridden)
CMD ["npm", "run", "dev"]

# Build stage for production
FROM base AS builder

# Set build environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM base AS production

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy production dependencies
COPY --from=deps /app/prod_node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma files
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Create directories for uploads and cache
RUN mkdir -p uploads .next/cache && \
    chown -R nextjs:nodejs uploads .next

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]
