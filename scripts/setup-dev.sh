#!/bin/bash

# LinguaLeap Development Setup Script
set -e

echo "🚀 Setting up LinguaLeap Development Environment"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p data/mongodb

# Set permissions for MongoDB data directory
chmod 755 data/mongodb

echo "🐳 Starting Docker containers..."

# Stop any existing containers
docker-compose -f docker-compose.dev.yml down

# Build and start containers
docker-compose -f docker-compose.dev.yml up -d --build

echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service health..."

# Check MongoDB
if docker-compose -f docker-compose.dev.yml exec -T mongodb mongosh --eval "db.runCommand({ping: 1})" > /dev/null 2>&1; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not responding"
fi

# Check Backend
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not responding"
fi

# Check Frontend
if curl -f http://localhost:9002 > /dev/null 2>&1; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is not responding"
fi

echo ""
echo "🎉 LinguaLeap Development Environment is ready!"
echo ""
echo "📋 Access URLs:"
echo "   Frontend:  http://localhost:9002"
echo "   Backend:   http://localhost:3001"
echo "   MailHog:   http://localhost:8025"
echo "   MongoDB:   mongodb://localhost:27017"
echo ""
echo "🔧 Useful Commands:"
echo "   View logs:     docker-compose -f docker-compose.dev.yml logs -f"
echo "   Stop services: docker-compose -f docker-compose.dev.yml down"
echo "   Restart:       docker-compose -f docker-compose.dev.yml restart"
echo ""
echo "📚 Next Steps:"
echo "   1. Visit http://localhost:9002 to access the application"
echo "   2. Register as a teacher or student"
echo "   3. Check http://localhost:8025 for verification emails"
echo ""