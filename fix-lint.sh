#!/bin/bash

# ESLint Fix Script
# This script fixes common ESLint issues in the project

echo "🧹 Starting ESLint fixes..."

# Function to remove unused imports from a file
fix_unused_imports() {
    local file="$1"
    echo "Fixing unused imports in $file"
    
    # Remove common unused imports (this is a simplified approach)
    sed -i '/^import.*Button.*from.*@\/components\/ui\/button.*$/d' "$file"
    sed -i '/^import.*Tabs.*from.*@\/components\/ui\/tabs.*$/d' "$file"
    sed -i '/^import.*Badge.*from.*@\/components\/ui\/badge.*$/d' "$file"
    sed -i '/^import.*SearchBar.*from.*$/d' "$file"
}

# Function to fix React unescaped entities
fix_unescaped_entities() {
    local file="$1"
    echo "Fixing unescaped entities in $file"
    
    # Replace common unescaped entities
    sed -i "s/Can't/Can\&apos;t/g" "$file"
    sed -i "s/you're/you\&apos;re/g" "$file"
    sed -i "s/we're/we\&apos;re/g" "$file"
    sed -i "s/don't/don\&apos;t/g" "$file"
    sed -i "s/won't/won\&apos;t/g" "$file"
    sed -i "s/isn't/isn\&apos;t/g" "$file"
    sed -i "s/aren't/aren\&apos;t/g" "$file"
    sed -i "s/hasn't/hasn\&apos;t/g" "$file"
    sed -i "s/haven't/haven\&apos;t/g" "$file"
    sed -i "s/couldn't/couldn\&apos;t/g" "$file"
    sed -i "s/shouldn't/shouldn\&apos;t/g" "$file"
    sed -i "s/wouldn't/wouldn\&apos;t/g" "$file"
}

# Function to prefix unused parameters with underscore
fix_unused_params() {
    local file="$1"
    echo "Fixing unused parameters in $file"
    
    # This is more complex and would need file-specific handling
    # For now, we'll handle common cases manually
}

# Find all TypeScript and JavaScript files in app and components directories
find app components -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | while read -r file; do
    echo "Processing: $file"
    fix_unused_imports "$file"
    fix_unescaped_entities "$file"
done

echo "✅ ESLint fixes completed!"
echo "⚠️  Some issues may need manual fixing. Run 'npm run lint' to see remaining issues."
