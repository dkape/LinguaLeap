# LinguaLeap Docker Setup Guide

This guide explains how to set up and run LinguaLeap using Docker for local development and testing.

## 🐳 Prerequisites

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git** for cloning the repository

## 🚀 Quick Start (Development)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd LinguaLeap
```

### 2. Start Development Environment
```bash
# Start all services in development mode
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### 3. Access the Application
- **Frontend**: http://localhost:9002
- **Backend API**: http://localhost:3001
- **MongoDB**: localhost:27017
- **MailHog (Email Testing)**: http://localhost:8025

### 4. Stop the Environment
```bash
docker-compose -f docker-compose.dev.yml down
```

## 🏗️ Production Setup

### 1. Build Production Images
```bash
# Build frontend image
docker build -f Dockerfile.frontend -t lingualeap-frontend .

# Build backend image
docker build -f Dockerfile.backend -t lingualeap-backend .
```

### 2. Start Production Environment
```bash
# Start all services in production mode
docker-compose up -d

# View logs
docker-compose logs -f
```

## 📁 Docker Configuration Files

### Development Files
- **`docker-compose.dev.yml`** - Development environment with hot reload
- **`Dockerfile.frontend`** - Frontend production image
- **`Dockerfile.backend`** - Backend production image

### Production Files
- **`docker-compose.yml`** - Production environment
- **`mongo-init.js`** - MongoDB initialization script

## 🔧 Environment Variables

### Backend Environment Variables
```bash
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://lingualeap:lingualeap123@mongodb:27017/lingualeap?authSource=lingualeap
JWT_SECRET=dev_jwt_secret_at_least_32_characters_long_for_development
EMAIL_FROM=noreply@lingualeap.local
CLIENT_URL=http://localhost:9002
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=""
SMTP_PASS=""
```

### Frontend Environment Variables
```bash
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🗄️ Database Setup

### MongoDB Configuration
- **Database**: `lingualeap`
- **Username**: `lingualeap`
- **Password**: `lingualeap123`
- **Root Username**: `admin`
- **Root Password**: `password123`

### Database Initialization
The MongoDB container automatically runs the `mongo-init.js` script which:
- Creates the application user
- Sets up the database
- Creates necessary indexes for performance

## 📧 Email Testing with MailHog

MailHog is included for email testing in development:
- **SMTP Server**: localhost:1025
- **Web Interface**: http://localhost:8025
- All emails sent by the application will be captured and displayed in MailHog

## 🔍 Monitoring and Debugging

### View Container Logs
```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f mongodb
```

### Access Container Shell
```bash
# Backend container
docker-compose -f docker-compose.dev.yml exec backend sh

# MongoDB container
docker-compose -f docker-compose.dev.yml exec mongodb mongosh
```

### Check Container Status
```bash
docker-compose -f docker-compose.dev.yml ps
```

## 🧪 Testing

### Run Backend Tests
```bash
# Start test database
docker-compose -f docker-compose.dev.yml up -d mongodb

# Run tests
docker-compose -f docker-compose.dev.yml exec backend npm test
```

### Manual Testing
1. **Register a Teacher**: Visit http://localhost:9002/de/signup/teacher
2. **Register a Student**: Visit http://localhost:9002/de/signup/student
3. **Check Emails**: Visit http://localhost:8025 to see verification emails
4. **Test API**: Visit http://localhost:3001/health for health check

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :9002  # Frontend
lsof -i :3001  # Backend
lsof -i :27017 # MongoDB

# Kill the process
kill -9 <PID>
```

#### MongoDB Connection Issues
```bash
# Check MongoDB logs
docker-compose -f docker-compose.dev.yml logs mongodb

# Connect to MongoDB directly
docker-compose -f docker-compose.dev.yml exec mongodb mongosh -u admin -p password123
```

#### Container Build Issues
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose -f docker-compose.dev.yml build --no-cache
```

#### Volume Permission Issues
```bash
# Fix volume permissions (Linux/macOS)
sudo chown -R $USER:$USER .
```

### Reset Everything
```bash
# Stop all containers
docker-compose -f docker-compose.dev.yml down

# Remove volumes (WARNING: This deletes all data)
docker-compose -f docker-compose.dev.yml down -v

# Remove images
docker rmi lingualeap-frontend lingualeap-backend

# Start fresh
docker-compose -f docker-compose.dev.yml up -d --build
```

## 📊 Performance Optimization

### Development Performance
- Frontend uses hot reload for instant updates
- Backend uses nodemon for automatic restarts
- MongoDB data persists between restarts

### Production Performance
- Multi-stage Docker builds for smaller images
- Non-root user for security
- Health checks for reliability
- Resource limits for stability

## 🔒 Security Considerations

### Development Security
- Default passwords (change for production)
- Local network access only
- MailHog for email testing (not for production)

### Production Security
- Use strong passwords
- Enable TLS/SSL
- Use secrets management
- Regular security updates

## 📝 Next Steps

After setting up the Docker environment:
1. **Development**: Start coding with hot reload enabled
2. **Testing**: Use the automated test suite
3. **Production**: Deploy using Kubernetes with Helm charts
4. **Monitoring**: Set up logging and monitoring solutions

For Kubernetes deployment, see the [Kubernetes Deployment Guide](kubernetes-deployment.md).