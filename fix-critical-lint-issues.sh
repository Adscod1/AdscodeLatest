#!/bin/bash

# Set up colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Fixing critical unused variables in generated files...${NC}"

# Fix the specific issue in wasm.js
if [ -f "./lib/generated/prisma/wasm.js" ]; then
  echo -e "${YELLOW}Fixing ./lib/generated/prisma/wasm.js...${NC}"
  # Create a temporary file with fixes
  sed -E 's/const skip = require.*$/\/\/ Commented out problematic require: const skip = require.../g' ./lib/generated/prisma/wasm.js > ./lib/generated/prisma/wasm.js.temp
  # Replace the original file with the fixed version
  mv ./lib/generated/prisma/wasm.js.temp ./lib/generated/prisma/wasm.js
  echo -e "${GREEN}Fixed wasm.js${NC}"
fi

echo -e "${GREEN}Critical fixes applied!${NC}"
echo -e "${YELLOW}You can now rebuild the Docker container with:${NC}"
echo "docker build -t adscod-app ."
