#!/bin/bash

# Exit on error
set -e

echo "🔍 Checking environment..."
if [ ! -f ".env" ]; then
    echo "❌ .env file missing!"
    exit 1
fi

echo "🧹 Cleaning up previous installation..."
rm -rf node_modules package-lock.json dist

echo "🗑️ Clearing npm cache..."
npm cache clean --force

echo "📦 Installing dependencies..."
# Use --no-audit to avoid unnecessary checks
npm install --no-audit

# Verify installation
if [ $? -eq 0 ]; then
    echo "✅ Setup complete! Run 'npm run dev' to start the application."
else
    echo "❌ Setup failed! Please check the errors above."
    exit 1
fi 