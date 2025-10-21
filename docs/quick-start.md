# LinguaLeap Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+ and npm
- MySQL 8.0+
- SMTP server for email functionality

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd LinguaLeap

# Install dependencies
npm install
cd server && npm install && cd ..
```

### 2. Database Setup

```sql
CREATE DATABASE lingua CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'lingua'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON lingua.* TO 'lingua'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Environment Configuration

Create `server/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=lingua
DB_PASSWORD=your_password
DB_NAME=lingua
JWT_SECRET=your_jwt_secret_at_least_32_characters
EMAIL_FROM=noreply@yourdomain.com
CLIENT_URL=http://localhost:9002
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Start the Application

```bash
# Terminal 1 - Start backend
cd server && npm start

# Terminal 2 - Start frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:9002
- **Backend API**: http://localhost:3001
- **Default Language**: German (redirects to `/de`)

## 🎯 First Steps

### For Teachers
1. Visit http://localhost:9002/de/signup/teacher
2. Register and verify your email
3. Create your first student class
4. Generate an AI-powered reading challenge
5. Add students to your class

### For Students
1. Visit http://localhost:9002/de/signup/student
2. Register and verify your email
3. Wait for teacher to add you to a class
4. Start completing reading challenges
5. Check your progress on the leaderboard

## 🔧 Testing

```bash
# Run automated tests
cd server
npm test
```

## 📚 Next Steps

- Read the [User Guide](user-guide.md) for detailed usage instructions
- Check the [Features Overview](features-overview.md) for complete feature list
- Review [Development Setup](development-setup.md) for development environment
- See [API Reference](api-reference.md) for technical integration

## 🆘 Need Help?

- **Setup Issues**: Check [Development Setup](development-setup.md)
- **Usage Questions**: Read [User Guide](user-guide.md)
- **Technical Problems**: See [Testing Guide](testing-guide.md)
- **Deployment**: Follow [Deployment Guide](deployment-guide.md)