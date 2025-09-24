#!/bin/bash

# Fix Docker Development Environment Script
# This script helps resolve common Docker development issues

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}[INFO]${NC} Starting Docker development environment fix..."

# 1. Shut down the current containers
echo -e "${BLUE}[INFO]${NC} Stopping any running containers..."
./docker-manage.sh dev:down

# 2. Clean up Docker resources
echo -e "${BLUE}[INFO]${NC} Cleaning up Docker resources..."
./docker-manage.sh cleanup

# 3. Manually prepare the .env.dev file if it doesn't exist
if [ ! -f .env.dev ]; then
  if [ -f .env.dev.example ]; then
    echo -e "${BLUE}[INFO]${NC} Creating .env.dev from example..."
    cp .env.dev.example .env.dev
    echo -e "${YELLOW}[WARNING]${NC} Please review .env.dev and update values if needed"
  else
    echo -e "${BLUE}[INFO]${NC} Creating basic .env.dev file..."
    cat > .env.dev << EOL
# Development environment configuration
ENVIRONMENT=dev
NODE_ENV=development
BUILD_TARGET=development

# Application settings
APP_PORT=3000

# Database settings
POSTGRES_DB=adscod_dev
POSTGRES_USER=adscod_user
POSTGRES_PASSWORD=adscod_dev_password
POSTGRES_PORT=5432

# Redis settings
REDIS_PORT=6379

# Auth settings
BETTER_AUTH_SECRET=dev-secret-key-change-in-production
BETTER_AUTH_URL=http://localhost:3000

# Volume mounting mode (rw for development)
VOLUME_MODE=rw
EOL
    echo -e "${YELLOW}[WARNING]${NC} Created basic .env.dev file. Please review and update values if needed."
  fi
fi

# 4. Fix the npm dev script in package.json to not use Turbopack
echo -e "${BLUE}[INFO]${NC} Updating package.json to use standard Next.js development mode..."
if grep -q "\"dev\": \"next dev --turbopack\"" package.json; then
  sed -i '' 's/"dev": "next dev --turbopack"/"dev": "next dev"/g' package.json
  echo -e "${GREEN}[SUCCESS]${NC} Updated package.json to use standard Next.js development mode."
fi

# 5. Start the development environment with improved error handling
echo -e "${BLUE}[INFO]${NC} Starting development environment..."
if ! ./docker-manage.sh dev:up; then
  echo -e "${RED}[ERROR]${NC} Failed to start development environment."
  echo -e "${YELLOW}[WARNING]${NC} Running npm install locally to ensure package-lock.json is updated..."
  npm install
  echo -e "${BLUE}[INFO]${NC} Trying to start development environment again..."
  ./docker-manage.sh dev:up
fi

# 6. Display helpful information
echo ""
echo -e "${GREEN}[SUCCESS]${NC} Development environment setup complete!"
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
echo -e "${YELLOW}[NOTE]${NC} If you're still experiencing issues, try running:"
echo "  npm install --legacy-peer-deps"
echo "  ./docker-manage.sh cleanup"
echo "  ./docker-manage.sh dev:up"
echo ""
