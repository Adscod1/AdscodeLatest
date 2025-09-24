#!/bin/bash

# Docker Dev Reset Script
# This script performs a complete reset and repair of the Docker development environment

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}[INFO]${NC} Starting complete Docker development environment reset..."

# 1. Stop any running containers
echo -e "${BLUE}[INFO]${NC} Stopping any running containers..."
./docker-manage.sh dev:down || true

# 2. Clean up Docker resources
echo -e "${BLUE}[INFO]${NC} Cleaning up Docker resources..."
./docker-manage.sh cleanup || true

# 3. Fix package.json to use standard Next.js (not Turbopack)
echo -e "${BLUE}[INFO]${NC} Updating package.json to use standard Next.js..."
if grep -q "\"dev\": \"next dev --turbopack\"" package.json; then
  sed -i '' 's/"dev": "next dev --turbopack"/"dev": "next dev"/g' package.json
  echo -e "${GREEN}[SUCCESS]${NC} Updated package.json to use standard Next.js."
fi

# 4. Update dependencies locally to fix package-lock.json
echo -e "${BLUE}[INFO]${NC} Updating dependencies to fix package-lock.json..."
npm install --legacy-peer-deps

# 5. Create a Dockerfile.dev with custom configurations for development
echo -e "${BLUE}[INFO]${NC} Creating optimized development Dockerfile..."
cat > Dockerfile.dev << 'EOL'
# Development-optimized Dockerfile for Adscod Next.js application

FROM node:20-alpine

# Install system dependencies and security updates
RUN apk update && apk upgrade && \
    apk add --no-cache \
    libc6-compat \
    curl \
    bash \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Create non-root user for security but with sufficient permissions
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /app/.next && \
    chown -R nextjs:nodejs /app

# Copy package files first for better caching
COPY --chown=nextjs:nodejs package.json package-lock.json* ./

# Install dependencies with legacy peer deps to fix conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY --chown=nextjs:nodejs . .

# Generate Prisma client
RUN npx prisma generate

# Increase Node memory limit to prevent OOM issues
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Set development environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Set permissions for nextjs user
RUN mkdir -p /app/.next/cache && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Use a simple script to handle migrations and start the dev server
COPY --chown=nextjs:nodejs ./docker-entrypoint-dev.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Start development server
CMD ["/docker-entrypoint.sh"]
EOL

# 6. Create a docker-entrypoint-dev.sh script
echo -e "${BLUE}[INFO]${NC} Creating Docker entrypoint script for development..."
cat > docker-entrypoint-dev.sh << 'EOL'
#!/bin/sh
set -e

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Start Next.js in development mode
echo "Starting Next.js development server..."
exec npm run dev
EOL

# Make the entrypoint script executable
chmod +x docker-entrypoint-dev.sh

# 7. Create a docker-compose.override.yml for development
echo -e "${BLUE}[INFO]${NC} Creating docker-compose override for development..."
cat > docker-compose.override.yml << 'EOL'
# Development overrides for docker-compose.yml
version: '3.8'

services:
  # Override app service for development
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app:rw
      - /app/node_modules
      - app_next_cache:/app/.next
    environment:
      - NODE_ENV=development
      - NEXT_TELEMETRY_DISABLED=1
      - CHOKIDAR_USEPOLLING=true
      - DATABASE_URL=postgresql://${POSTGRES_USER:-adscod_user}:${POSTGRES_PASSWORD:-adscod_password}@postgres:5432/${POSTGRES_DB:-adscod_dev}
      - DIRECT_URL=postgresql://${POSTGRES_USER:-adscod_user}:${POSTGRES_PASSWORD:-adscod_password}@postgres:5432/${POSTGRES_DB:-adscod_dev}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

volumes:
  app_next_cache:
EOL

# 8. Start the development environment with custom configs
echo -e "${BLUE}[INFO]${NC} Starting development environment with fixed configuration..."
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose --env-file .env.dev up -d --build app

# 9. Display helpful information
echo ""
echo -e "${GREEN}[SUCCESS]${NC} Development environment reset complete!"
echo ""
echo -e "${BLUE}[INFO]${NC} Access points:"
echo "  - Application: http://localhost:3000"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo ""
echo -e "${BLUE}[INFO]${NC} Useful commands:"
echo "  - View logs: ./docker-manage.sh dev:logs"
echo "  - Access container shell: ./docker-manage.sh dev:shell"
echo "  - Access database: ./docker-manage.sh dev:db"
echo "  - Stop environment: ./docker-manage.sh dev:down"
echo ""
echo -e "${YELLOW}[NOTE]${NC} The first startup may take a few minutes as Next.js compiles."
echo -e "${YELLOW}[NOTE]${NC} If the app doesn't work immediately, check logs with: ./docker-manage.sh dev:logs"
echo ""
