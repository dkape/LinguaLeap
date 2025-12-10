# LinguaLeap Deployment Guide

## Overview

This guide covers deploying LinguaLeap to production environments, including both the Next.js frontend and Express.js backend.

## Prerequisites

- Node.js 18+ and npm
- MySQL database
- SMTP server for email functionality
- Domain name and SSL certificate
- Server or cloud hosting platform

## Environment Setup

### Production Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NODE_ENV=production
```

#### Backend (server/.env)
```env
# Database
DB_HOST=your_production_db_host
DB_PORT=3306
DB_USER=your_production_db_user
DB_PASSWORD=your_secure_db_password
DB_NAME=lingualeap_production

# JWT
JWT_SECRET=your_very_secure_jwt_secret_at_least_32_characters

# Email (SMTP)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
EMAIL_FROM=noreply@yourdomain.com

# Frontend URL
CLIENT_URL=https://yourdomain.com

# Server
PORT=3001
NODE_ENV=production
```

## Database Setup

### 1. Create Production Database
```sql
CREATE DATABASE lingualeap_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'lingualeap_user'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON lingualeap_production.* TO 'lingualeap_user'@'%';
FLUSH PRIVILEGES;
```

### 2. Run Database Migrations
The application will automatically create tables on first run, but you can also run them manually:
```bash
cd server
node -e "
const pool = require('./config/db');
const fs = require('fs');
const schema = fs.readFileSync('./config/schema.sql').toString();
const queries = schema.split(';').filter(q => q.trim() !== '');
queries.forEach(async (query) => {
  try {
    await pool.query(query);
    console.log('Query executed:', query.substring(0, 50) + '...');
  } catch (error) {
    console.error('Error:', error.message);
  }
});
"
```

## Backend Deployment

### Option 1: Traditional Server (PM2)

1. **Install PM2 globally:**
```bash
npm install -g pm2
```

2. **Create PM2 ecosystem file (ecosystem.config.js):**
```javascript
module.exports = {
  apps: [{
    name: 'lingualeap-api',
    script: './server/index.js',
    cwd: '/path/to/your/project',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

3. **Deploy with PM2:**
```bash
# Install dependencies
cd server && npm install --production

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup
```

### Option 2: Docker Deployment

1. **Create Dockerfile for backend:**
```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["node", "index.js"]
```

2. **Build and run:**
```bash
cd server
docker build -t lingualeap-api .
docker run -d -p 3001:3001 --env-file .env lingualeap-api
```

### Option 3: Cloud Platforms

#### Railway
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

#### Heroku
```bash
# Install Heroku CLI and login
heroku create lingualeap-api

# Set environment variables
heroku config:set DB_HOST=your_db_host
heroku config:set DB_USER=your_db_user
# ... set all other environment variables

# Deploy
git subtree push --prefix server heroku main
```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel --prod
```

3. **Set environment variables in Vercel dashboard:**
- `NEXT_PUBLIC_API_URL`

### Option 2: Netlify

1. **Build the application:**
```bash
npm run build
```

2. **Deploy to Netlify:**
- Connect GitHub repository
- Set build command: `npm run build`
- Set publish directory: `.next`
- Set environment variables

### Option 3: Traditional Server (Nginx)

1. **Build the application:**
```bash
npm run build
npm run start
```

2. **Nginx configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:9002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSL Certificate

### Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring and Logging

### Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs lingualeap-api

# Restart application
pm2 restart lingualeap-api
```

### Database Monitoring
- Set up database monitoring and backups
- Monitor connection pool usage
- Set up alerts for high CPU/memory usage

### Error Tracking
Consider integrating error tracking services:
- Sentry
- LogRocket
- Bugsnag

## Security Checklist

### Backend Security
- [ ] Use HTTPS in production
- [ ] Set secure JWT secret (32+ characters)
- [ ] Enable CORS only for your domain
- [ ] Use environment variables for secrets
- [ ] Set up rate limiting
- [ ] Enable SQL injection protection
- [ ] Use secure headers (helmet.js)
- [ ] Regular security updates

### Frontend Security
- [ ] Use HTTPS
- [ ] Set secure cookies
- [ ] Implement CSP headers
- [ ] Sanitize user inputs
- [ ] Regular dependency updates

## Performance Optimization

### Backend
- [ ] Enable gzip compression
- [ ] Implement caching strategies
- [ ] Optimize database queries
- [ ] Use connection pooling
- [ ] Monitor memory usage

### Frontend
- [ ] Enable Next.js optimizations
- [ ] Optimize images
- [ ] Implement lazy loading
- [ ] Use CDN for static assets
- [ ] Monitor Core Web Vitals

## Backup Strategy

### Database Backups
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > backup_$DATE.sql
# Upload to cloud storage
```

### Application Backups
- Regular code repository backups
- Environment configuration backups
- SSL certificate backups

## Rollback Plan

1. **Keep previous version available**
2. **Database migration rollback scripts**
3. **Quick deployment rollback procedure**
4. **Health check endpoints for monitoring**

## Health Checks

### Backend Health Check
```javascript
// Add to server/index.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Frontend Health Check
Monitor key pages and functionality:
- Homepage loads
- Authentication works
- Language switching works
- API connectivity

## Troubleshooting

### Common Issues
1. **Database connection errors** - Check credentials and network access
2. **CORS errors** - Verify frontend URL in backend CORS configuration
3. **Email not sending** - Check SMTP credentials and firewall settings
4. **JWT token issues** - Verify JWT secret consistency
5. **Language switching not working** - Check cookie settings and middleware

### Debug Commands
```bash
# Check application logs
pm2 logs lingualeap-api

# Check database connectivity
mysql -h $DB_HOST -u $DB_USER -p $DB_NAME

# Test API endpoints
curl -X GET https://api.yourdomain.com/health

# Check SSL certificate
openssl s_client -connect yourdomain.com:443
```

This deployment guide provides a comprehensive approach to deploying LinguaLeap in production environments with proper security, monitoring, and backup strategies.