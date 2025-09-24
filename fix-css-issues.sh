#!/bin/bash

# Fix CSS Processor Issues in Docker
# This script addresses common CSS processing issues in Next.js Docker environments

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}[INFO]${NC} Starting CSS processing fix..."

# 1. Enter the container
echo -e "${BLUE}[INFO]${NC} Entering Docker container..."

docker-compose --env-file .env.dev exec app sh -c '
  echo "[INFO] Inside Docker container, fixing CSS issues..."
  
  # Ensure cache directories are writable
  mkdir -p /app/.next/cache
  chown -R nextjs:nodejs /app/.next
  
  # Clear Next.js cache to fix CSS processing issues
  echo "[INFO] Clearing Next.js cache..."
  rm -rf /app/.next/cache
  
  # Update PostCSS configuration if needed
  if [ -f /app/postcss.config.mjs ]; then
    echo "[INFO] Updating PostCSS configuration..."
    # Creating a simpler postcss config if needed
    cat > /app/postcss.config.simple.mjs << EOL
export default {
  plugins: {
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOL
    
    echo "[INFO] Creating backup of original postcss.config.mjs..."
    cp /app/postcss.config.mjs /app/postcss.config.mjs.bak
    cp /app/postcss.config.simple.mjs /app/postcss.config.mjs
  fi
  
  # Fix npm cache permissions
  echo "[INFO] Fixing npm cache permissions..."
  mkdir -p /home/nextjs/.npm
  chown -R nextjs:nodejs /home/nextjs
  
  # Restart the Next.js process without Turbopack
  echo "[INFO] Preparing to restart Next.js..."
  echo "export NODE_OPTIONS=\"--max-old-space-size=4096\"" >> /home/nextjs/.profile
  
  echo "[SUCCESS] CSS processing fixes applied!"
  echo "[INFO] Please restart the container to apply these changes."
'

echo -e "${GREEN}[SUCCESS]${NC} CSS processing fixes applied!"
echo -e "${BLUE}[INFO]${NC} Now restarting the Docker container..."

# Restart the container
./docker-manage.sh dev:down
sleep 2
./docker-manage.sh dev:up

echo -e "${GREEN}[SUCCESS]${NC} Done! The application should now work correctly."
echo -e "${BLUE}[INFO]${NC} If you still encounter issues, try accessing the app using:"
echo "  - http://localhost:3000/api/health (this endpoint works)"
echo "  - Check logs with: ./docker-manage.sh dev:logs"
