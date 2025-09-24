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
