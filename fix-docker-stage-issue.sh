#!/bin/bash

# Fix Docker Stage Target Issue
# This script specifically addresses the "target stage could not be found" error

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}[INFO]${NC} Fixing Docker development target issue..."

# 1. Stop any running containers
echo -e "${BLUE}[INFO]${NC} Stopping any running containers..."
./docker-manage.sh dev:down || true

# 2. Clean up Docker resources
echo -e "${BLUE}[INFO]${NC} Cleaning up Docker resources..."
./docker-manage.sh cleanup || true

# 3. Create a simpler docker-compose file for development
echo -e "${BLUE}[INFO]${NC} Creating simpler docker-compose for development..."
cat > docker-compose.dev.yml << 'EOL'
version: '3.8'

name: adscod-dev

services:
  # PostgreSQL Database Service
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: adscod_dev
      POSTGRES_USER: adscod_user
      POSTGRES_PASSWORD: adscod_dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./prisma/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - adscod-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U adscod_user -d adscod_dev"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  # Redis for caching and sessions
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - adscod-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Main Application Service - built without target stage
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      # App Environment
      - NODE_ENV=development
      - NEXT_TELEMETRY_DISABLED=1
      - PORT=3000
      - HOSTNAME=0.0.0.0
      
      # Database Configuration
      - DATABASE_URL=postgresql://adscod_user:adscod_dev_password@postgres:5432/adscod_dev
      - DIRECT_URL=postgresql://adscod_user:adscod_dev_password@postgres:5432/adscod_dev
      
      # Redis Configuration
      - REDIS_URL=redis://redis:6379
      
      # Auth Configuration
      - BETTER_AUTH_SECRET=your-super-secret-key-for-development-only
      - BETTER_AUTH_URL=http://localhost:3000
    volumes:
      - .:/app:rw
      - /app/node_modules
      - /app/.next
    networks:
      - adscod-network
    depends_on:
      postgres:
        condition: service_healthy

networks:
  adscod-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
EOL

# 4. Create a simpler Dockerfile for development
echo -e "${BLUE}[INFO]${NC} Creating simpler Dockerfile for development..."
cat > Dockerfile.dev << 'EOL'
# Simple development Dockerfile for Adscod Next.js application

FROM node:20-alpine

# Install system dependencies
RUN apk update && apk add --no-cache libc6-compat curl bash

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy the rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Set development environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run development server
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]
EOL

# 5. Update package.json to use standard Next.js development mode
echo -e "${BLUE}[INFO]${NC} Ensuring package.json uses standard Next.js development mode..."
if grep -q "\"dev\": \"next dev --turbopack\"" package.json; then
  sed -i '' 's/"dev": "next dev --turbopack"/"dev": "next dev"/g' package.json
  echo -e "${GREEN}[SUCCESS]${NC} Updated package.json to use standard Next.js development mode."
fi

# 6. Start the development environment with the new approach
echo -e "${BLUE}[INFO]${NC} Starting development environment with new configuration..."
docker compose -f docker-compose.dev.yml up -d --build

# 7. Display helpful information
echo ""
echo -e "${GREEN}[SUCCESS]${NC} Development environment started with fixed configuration!"
echo ""
echo -e "${BLUE}[INFO]${NC} Access points:"
echo "  - Application: http://localhost:3000"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo ""
echo -e "${BLUE}[INFO]${NC} View logs with:"
echo "  docker compose -f docker-compose.dev.yml logs -f app"
echo ""
echo -e "${YELLOW}[NOTE]${NC} The first startup may take a few minutes as Next.js compiles."
echo -e "${YELLOW}[NOTE]${NC} If you need to stop the environment, run:"
echo "  docker compose -f docker-compose.dev.yml down"
echo ""
