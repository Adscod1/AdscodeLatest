#!/bin/bash

# Local Development Script
# Run the application locally without Docker

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}[INFO]${NC} Setting up local development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | sed 's/v//')
NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d. -f1)

if [ $NODE_MAJOR_VERSION -lt 18 ]; then
    echo -e "${YELLOW}[WARNING]${NC} Node.js version $NODE_VERSION detected. This app requires Node.js 18+."
    echo "Please upgrade your Node.js version."
fi

# Install dependencies
echo -e "${BLUE}[INFO]${NC} Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${BLUE}[INFO]${NC} Creating .env.local file..."
    cat > .env.local << 'EOL'
# Local development environment
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Database Configuration (adjust as needed)
# You'll need to set up a local PostgreSQL database or use a hosted service
DATABASE_URL="postgresql://username:password@localhost:5432/adscod_local"
DIRECT_URL="postgresql://username:password@localhost:5432/adscod_local"

# Auth Configuration
BETTER_AUTH_SECRET="local-dev-secret-key-change-this"
BETTER_AUTH_URL="http://localhost:3000"

# Redis (optional - comment out if not using Redis locally)
# REDIS_URL="redis://localhost:6379"

# File Upload Configuration
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES="image/jpeg,image/png,image/webp,video/mp4"
EOL
    echo -e "${YELLOW}[WARNING]${NC} Created .env.local file. Please update the DATABASE_URL and other values as needed."
fi

# Generate Prisma client
echo -e "${BLUE}[INFO]${NC} Generating Prisma client..."
npx prisma generate

echo -e "${YELLOW}[WARNING]${NC} Database setup required:"
echo "1. Make sure you have PostgreSQL running locally or use a hosted service"
echo "2. Update the DATABASE_URL in .env.local"
echo "3. Run: npx prisma db push (to create the database schema)"
echo "   OR: npx prisma migrate dev (if you want to use migrations)"

echo ""
echo -e "${BLUE}[INFO]${NC} Starting the development server..."
echo -e "${YELLOW}[NOTE]${NC} The app will start even without a database, but some features won't work."

# Start the development server
npm run dev
