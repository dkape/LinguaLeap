# LinguaLeap Documentation

Welcome to the LinguaLeap documentation! This directory contains comprehensive documentation for the LinguaLeap AI-powered language learning application.

## 📚 Documentation Index

### Getting Started
- **[Development Setup](development-setup.md)** - Complete guide to setting up your development environment
- **[Architecture Overview](architecture-overview.md)** - High-level system architecture and technology stack

### Implementation Guides
- **[Registration Implementation](registration-implementation.md)** - User registration system with email verification
- **[Internationalization (i18n) Implementation](i18n-implementation.md)** - Multi-language support system

### API & Development
- **[API Reference](api-reference.md)** - Complete API documentation with endpoints and examples
- **[Testing Guide](testing-guide.md)** - Testing procedures and automated test suites

### Deployment & Operations
- **[Deployment Guide](deployment-guide.md)** - Production deployment instructions and best practices
- **[Blueprint](blueprint.md)** - Project blueprint and planning document

## 🚀 Quick Start

1. **New Developer?** Start with [Development Setup](development-setup.md)
2. **Understanding the System?** Read [Architecture Overview](architecture-overview.md)
3. **Working with APIs?** Check [API Reference](api-reference.md)
4. **Deploying to Production?** Follow [Deployment Guide](deployment-guide.md)

## 🏗️ Project Overview

LinguaLeap is an AI-powered reading application designed to help children learn to read in both English and German. The platform offers:

- **Gamified Learning Experience** - Interactive lessons and personalized learning paths
- **Multi-language Support** - German (default) and English with seamless switching
- **Role-based Access** - Separate interfaces for students and teachers
- **Email Verification System** - Secure user registration and authentication
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** with TypeScript
- **Tailwind CSS** for styling
- **ShadCN/UI** components
- **Custom i18n system** for multi-language support

### Backend
- **Express.js** with Node.js
- **MySQL** database
- **JWT authentication**
- **Nodemailer** for email services

### Key Features
- ✅ User registration with email verification
- ✅ Multi-language support (German/English)
- ✅ Role-based authentication (Student/Teacher)
- ✅ Responsive design
- ✅ Secure password handling
- ✅ Language preference storage

## 📖 Documentation Structure

```
docs/
├── README.md                      # This file - documentation index
├── blueprint.md                   # Project blueprint and planning
├── development-setup.md           # Development environment setup
├── architecture-overview.md       # System architecture documentation
├── registration-implementation.md # User registration system details
├── i18n-implementation.md        # Internationalization system details
├── api-reference.md              # Complete API documentation
├── testing-guide.md              # Testing procedures and guidelines
└── deployment-guide.md           # Production deployment guide
```

## 🔧 Development Workflow

### 1. Environment Setup
```bash
# Clone repository
git clone <repository-url>
cd LinguaLeap

# Install dependencies
npm install
cd server && npm install && cd ..

# Configure environment variables
cp .env.example .env.local
cp server/.env.example server/.env
```

### 2. Start Development Servers
```bash
# Terminal 1 - Backend
npm run server:dev

# Terminal 2 - Frontend  
npm run dev
```

### 3. Access Application
- **Frontend:** http://localhost:9002
- **Backend API:** http://localhost:3001
- **Default Language:** German (`/de`)

## 🌍 Language Support

The application supports:
- **German (de)** - Default language
- **English (en)** - Alternative language

Language switching is available via the language switcher in the top-right corner of every page.

## 🔐 Authentication Flow

1. **Registration** - User creates account with email verification
2. **Email Verification** - User clicks verification link in email
3. **Login** - User can log in after email verification
4. **Dashboard Access** - Role-based dashboard (Student/Teacher)

## 🧪 Testing

### Automated Tests
```bash
cd server
npm test
```

### Manual Testing
- Registration flow for both roles
- Email verification process
- Language switching functionality
- Authentication and authorization

## 📝 Contributing

When contributing to the project:

1. **Read the relevant documentation** for the area you're working on
2. **Follow the development setup** guide for environment configuration
3. **Run tests** before submitting changes
4. **Update documentation** if you add new features or change existing ones

## 🆘 Getting Help

If you need help:

1. **Check the documentation** - Most common questions are answered here
2. **Review the API reference** - For API-related questions
3. **Check the testing guide** - For testing-related issues
4. **Look at the troubleshooting sections** - In relevant documentation files

## 📋 Documentation Maintenance

This documentation is maintained alongside the codebase. When making changes:

- Update relevant documentation files
- Keep examples current with the actual implementation
- Add new documentation for new features
- Review and update existing documentation for accuracy

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Maintainers:** LinguaLeap Development Team