#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🐳 Building Adscod Docker Image${NC}"
echo "=================================="

# Check if we need sudo for Docker
DOCKER_CMD="docker"
if ! docker info > /dev/null 2>&1; then
    if sudo docker info > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Docker requires sudo privileges${NC}"
        DOCKER_CMD="sudo docker"
    else
        echo -e "${RED}❌ Docker is not running or not accessible. Please start Docker and try again.${NC}"
        exit 1
    fi
fi

# Function to build with retries
build_with_retries() {
    local max_attempts=3
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo -e "${YELLOW}📦 Build attempt $attempt of $max_attempts${NC}"
        
        if $DOCKER_CMD build -t adscod-app .; then
            echo -e "${GREEN}✅ Docker image built successfully!${NC}"
            return 0
        else
            echo -e "${RED}❌ Build attempt $attempt failed${NC}"
            if [ $attempt -lt $max_attempts ]; then
                echo -e "${YELLOW}⏳ Retrying in 10 seconds...${NC}"
                sleep 10
            fi
            attempt=$((attempt + 1))
        fi
    done
    
    return 1
}

# Try to build the Docker image
if build_with_retries; then
    echo ""
    echo -e "${GREEN}🎉 Success! Your Docker image is ready.${NC}"
    echo ""
    echo "To run the container:"
    echo -e "${YELLOW}$DOCKER_CMD run -p 3000:3000 adscod-app${NC}"
    echo ""
    echo "Or use Docker Compose:"
    if [[ "$DOCKER_CMD" == "sudo docker" ]]; then
        echo -e "${YELLOW}sudo docker-compose up${NC}"
    else
        echo -e "${YELLOW}docker-compose up${NC}"
    fi
else
    echo ""
    echo -e "${RED}❌ Failed to build Docker image after multiple attempts.${NC}"
    echo ""
    echo "Troubleshooting suggestions:"
    echo "1. Check your internet connection"
    echo "2. Try: npm install --legacy-peer-deps (locally first)"
    echo "3. Clear Docker cache: $DOCKER_CMD builder prune"
    echo "4. Check Docker daemon logs: $DOCKER_CMD system events"
    exit 1
fi
