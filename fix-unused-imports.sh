#!/bin/bash

# Set up colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Checking for unused imports in the project...${NC}"

# Install eslint-plugin-unused-imports if not already installed
if ! npm list eslint-plugin-unused-imports &>/dev/null; then
  echo -e "${YELLOW}Installing eslint-plugin-unused-imports...${NC}"
  npm install --save-dev eslint-plugin-unused-imports
fi

# Create a temporary ESLint config file that focuses on unused imports
cat > eslint-unused-imports.js << EOF
module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "unused-imports"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
    ]
  },
  ignorePatterns: [
    "node_modules/**",
    ".next/**",
    "lib/generated/**",
    "**/wasm.js",
    "dist/**"
  ]
};
EOF

echo -e "${YELLOW}Running ESLint to fix unused imports...${NC}"

# First, show what would be fixed
npx eslint --config eslint-unused-imports.js --ext .ts,.tsx,.js,.jsx . --max-warnings=0 || true

# Ask user if they want to proceed with auto-fixing
read -p "$(echo -e ${YELLOW}Do you want to automatically fix unused imports? [y/N] ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Fixing unused imports...${NC}"
  npx eslint --config eslint-unused-imports.js --ext .ts,.tsx,.js,.jsx . --fix
  echo -e "${GREEN}Unused imports fixed!${NC}"
else
  echo -e "${YELLOW}Skipping auto-fix. You can run this script again later to fix imports.${NC}"
fi

# Clean up
rm eslint-unused-imports.js

echo -e "${GREEN}Done!${NC}"
