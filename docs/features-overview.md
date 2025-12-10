# LinguaLeap Features Overview

## 🌟 Core Features

### For Teachers
- **🏫 Class Management**: Create and manage student classes with language and age-specific settings
- **🤖 AI-Powered Challenge Generation**: Generate reading challenges using content from public domain sources like Project Gutenberg
- **📚 Public Book Integration**: Challenges automatically source age-appropriate content from classic literature and educational texts
- **🎯 Customizable Difficulty**: Configure challenges based on age range (5-12 years) and reading level (beginner/intermediate/advanced)
- **📊 Progress Tracking**: Monitor student reading speed, comprehension, and completion times
- **🏆 Leaderboard Management**: View class rankings and student performance analytics
- **🌍 Multi-Language Support**: Create challenges in German or English

### For Students
- **📖 Interactive Reading Challenges**: Step-by-step reading experiences with progress tracking
- **⚡ Reading Speed Monitoring**: Track words per minute and reading progression
- **🧠 Comprehension Quizzes**: Multiple-choice questions to test understanding
- **🏆 Gamified Experience**: Earn points and compete on class leaderboards
- **📈 Progress Visualization**: See completion status and performance metrics
- **🎮 Challenge Solving**: Guided reading flow with "go ahead" buttons for pacing control

### System Features
- **🔐 Secure Authentication**: Email verification system with role-based access (teacher/student)
- **🌐 Full Internationalization**: Complete German and English language support
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ Real-time Updates**: Live progress tracking and leaderboard updates
- **🎨 Modern UI**: Beautiful interface built with Tailwind CSS and ShadCN/UI components

## 🏗️ Technical Architecture

### Frontend
- **Next.js 15**: React framework with App Router and server-side rendering
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **ShadCN/UI**: High-quality React components
- **Genkit (Google's Gemini)**: AI-powered content generation
- **Axios**: HTTP client for API communication

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MySQL**: Relational database for data persistence
- **JWT**: JSON Web Tokens for authentication
- **Nodemailer**: Email service for verification
- **bcrypt**: Password hashing and security

### AI & Content
- **Google Gemini**: Advanced AI model for content generation
- **Project Gutenberg Integration**: Public domain book content sourcing
- **Age-Appropriate Content Filtering**: Safe, educational content for children
- **Multi-language Content Generation**: German and English content creation

## 🗄️ Database Schema

The application uses a comprehensive database schema supporting:
- **User Management**: Teachers and students with role-based access
- **Class System**: Student classes with language and age configurations
- **Challenge Framework**: AI-generated reading challenges with quiz components
- **Progress Tracking**: Detailed analytics on reading speed and comprehension
- **Leaderboard System**: Performance rankings and achievements

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration with email verification
- `POST /api/auth/login` - User authentication
- `GET /api/auth/verify-email` - Email verification
- `PUT /api/auth/language-preference` - Update user language preference

### Class Management
- `POST /api/classes` - Create student class
- `GET /api/classes/teacher` - Get teacher's classes
- `POST /api/classes/:id/students` - Add student to class

### Challenge System
- `POST /api/challenges` - Create AI-generated challenge
- `GET /api/challenges/student` - Get student's assigned challenges
- `POST /api/challenges/:id/start` - Start challenge attempt
- `GET /api/challenges/class/:id/leaderboard` - Get class leaderboard

## 🌍 Internationalization

LinguaLeap supports full internationalization:
- **German (Default)**: Complete German interface and content
- **English**: Full English translation and content generation
- **Language Switching**: Seamless switching with user preference storage
- **Localized Routing**: URL-based locale handling (`/de/...`, `/en/...`)

## 🎮 Gamification System

### Point System
- **Reading Points**: Earned for completing text passages
- **Quiz Points**: Earned for correct quiz answers
- **Speed Bonuses**: Extra points for efficient completion
- **Accuracy Rewards**: Higher scores for better comprehension

### Leaderboard Features
- **Class Rankings**: Compete with classmates
- **Multiple Metrics**: Points, completion time, accuracy, reading speed
- **Real-time Updates**: Automatic ranking updates
- **Visual Indicators**: Medals and badges for top performers

## 🔒 Security Features

- **Email Verification**: Mandatory email verification before account activation
- **Password Security**: bcrypt hashing with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Separate interfaces and permissions for teachers/students
- **SQL Injection Prevention**: Parameterized queries
- **Input Validation**: Comprehensive data validation and sanitization