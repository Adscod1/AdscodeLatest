#!/bin/bash

# Docker Startup with Retry Script
# Handles network connectivity issues and retries Docker operations

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}[INFO]${NC} Starting Docker environment with network retry..."

# Function to retry docker operations
retry_docker_operation() {
    local max_attempts=3
    local attempt=1
    local command="$@"
    
    while [ $attempt -le $max_attempts ]; do
        echo -e "${BLUE}[INFO]${NC} Attempt $attempt of $max_attempts: $command"
        
        if eval "$command"; then
            echo -e "${GREEN}[SUCCESS]${NC} Command succeeded on attempt $attempt"
            return 0
        else
            echo -e "${YELLOW}[WARNING]${NC} Attempt $attempt failed"
            if [ $attempt -eq $max_attempts ]; then
                echo -e "${RED}[ERROR]${NC} All attempts failed for: $command"
                return 1
            fi
            echo -e "${BLUE}[INFO]${NC} Waiting 10 seconds before next attempt..."
            sleep 10
            attempt=$((attempt + 1))
        fi
    done
}

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}[ERROR]${NC} Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Stop any running containers first
echo -e "${BLUE}[INFO]${NC} Stopping any running containers..."
./docker-manage.sh dev:down || true

# Try to start with retry mechanism
echo -e "${BLUE}[INFO]${NC} Starting Docker containers with retry logic..."

if retry_docker_operation "./docker-manage.sh dev:up"; then
    echo -e "${GREEN}[SUCCESS]${NC} Docker environment started successfully!"
    echo -e "${BLUE}[INFO]${NC} Waiting for services to be ready..."
    sleep 15
    
    # Check if the application is running
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        echo -e "${GREEN}[SUCCESS]${NC} Application is running at http://localhost:3000"
        echo -e "${BLUE}[INFO]${NC} Health check endpoint: http://localhost:3000/api/health"
    else
        echo -e "${YELLOW}[WARNING]${NC} Application might still be starting up. Check logs with:"
        echo "  ./docker-manage.sh dev:logs"
    fi
else
    echo -e "${RED}[ERROR]${NC} Failed to start Docker environment after multiple attempts."
    echo -e "${BLUE}[INFO]${NC} You can try running the app locally instead:"
    echo "  1. Make sure you have a PostgreSQL database running"
    echo "  2. Update your DATABASE_URL in .env.local"
    echo "  3. Run: npm run dev"
    echo ""
    echo -e "${BLUE}[INFO]${NC} Or try Docker again later when network connectivity improves."
    exit 1
fi

echo ""
echo -e "${GREEN}[SUCCESS]${NC} Setup complete!"
echo -e "${BLUE}[INFO]${NC} Access points:"
echo "  - Application: http://localhost:3000"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo ""
echo -e "${BLUE}[INFO]${NC} Useful commands:"
echo "  - View logs: ./docker-manage.sh dev:logs"
echo "  - Stop environment: ./docker-manage.sh dev:down"
echo ""
