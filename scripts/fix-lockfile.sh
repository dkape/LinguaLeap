#!/bin/bash

# Fix package-lock.json sync issues
echo "🔧 Fixing package-lock.json sync issues..."

# Frontend
echo "📦 Fixing frontend dependencies..."
if [ -f package-lock.json ]; then
    rm package-lock.json
    echo "   Removed old package-lock.json"
fi

npm install --package-lock-only
echo "   Generated new package-lock.json"

# Backend
echo "📦 Fixing backend dependencies..."
cd server
if [ -f package-lock.json ]; then
    rm package-lock.json
    echo "   Removed old server package-lock.json"
fi

npm install --package-lock-only
echo "   Generated new server package-lock.json"

cd ..

echo "✅ Package lock files fixed!"
echo ""
echo "🚀 You can now run:"
echo "   npm ci                    # Install frontend dependencies"
echo "   cd server && npm ci       # Install backend dependencies"
echo "   git add package-lock.json server/package-lock.json"
echo "   git commit -m 'fix: update package-lock.json files'"