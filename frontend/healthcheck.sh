#!/bin/bash

# Simple health check script for the Next.js application
# This script will be used by Docker to check if the app is running properly

# Try to curl the health endpoint or main page
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo "Health check passed"
    exit 0
else
    echo "Health check failed"
    exit 1
fi
