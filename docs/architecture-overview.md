# LinguaLeap Architecture Overview

## System Architecture

LinguaLeap is built as a modern full-stack web application with a clear separation between frontend and backend services.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│    (MySQL)      │
│   Port: 9002    │    │   Port: 3001    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Files  │    │   Email Service │    │   File Storage  │
│   (Images, CSS) │    │    (SMTP)       │    │   (Future)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend
- **Framework:** Next.js 15 (React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN/UI (Radix UI)
- **State Management:** React Context + Custom Hooks
- **Form Handling:** React Hook Form + Zod validation
- **HTTP Client:** Axios
- **Internationalization:** Custom i18n system

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** JavaScript
- **Database ORM:** Raw MySQL queries with mysql2
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Email Service:** Nodemailer
- **Validation:** Manual validation with error handling

### Database
- **Database:** MySQL 8.0+
- **Character Set:** utf8mb4 (full Unicode support)
- **Connection Pooling:** mysql2 connection pool

### Development Tools
- **Package Manager:** npm
- **Code Quality:** ESLint + Prettier
- **Type Checking:** TypeScript
- **Testing:** Custom test suite (Node.js)

## Application Layers

### 1. Presentation Layer (Frontend)

#### Components Structure
```
src/components/
├── auth/                 # Authentication components
│   └── auth-form.tsx    # Login/signup form
├── shared/              # Shared components
│   ├── language-switcher.tsx
│   └── user-nav.tsx
├── teacher/             # Teacher-specific components
├── student/             # Student-specific components
└── ui/                  # Base UI components (ShadCN)
```

#### Routing Structure
```
src/app/
├── [locale]/            # Internationalized routes
│   ├── (auth)/         # Authentication pages
│   │   ├── login/[role]/
│   │   ├── signup/[role]/
│   │   └── verify-email/
│   ├── student/        # Student dashboard
│   └── teacher/        # Teacher dashboard
└── page.tsx            # Root redirect
```

### 2. API Layer (Backend)

#### Route Structure
```
server/routes/
├── auth.js             # Authentication routes
├── user.js             # User management routes
└── learning-paths.js   # Learning path routes
```

#### Controller Structure
```
server/controllers/
├── auth.js             # Authentication logic
├── user.js             # User management logic
└── learning-paths.js   # Learning path logic
```

### 3. Data Layer

#### Database Schema
```sql
users
├── id (Primary Key)
├── uid (Unique identifier)
├── name
├── email (Unique)
├── password (Hashed)
├── role (student/teacher)
├── avatarUrl
├── points
├── isEmailVerified
├── emailVerificationToken
├── emailVerificationExpires
├── preferredLanguage
└── createdAt

learning_paths
├── id (Primary Key)
├── title
├── description
├── teacher_id (Foreign Key)
└── createdAt

learning_path_items
├── id (Primary Key)
├── learning_path_id (Foreign Key)
├── type
├── content
├── order_index
└── createdAt
```

## Key Features Architecture

### 1. Authentication System

```
Registration Flow:
User Input → Validation → Password Hashing → Database Storage → Email Verification → Account Activation

Login Flow:
Credentials → Validation → Password Verification → Email Verification Check → JWT Generation → Session Creation
```

#### Security Measures
- Password hashing with bcrypt (10 salt rounds)
- JWT tokens with expiration (1 hour)
- Email verification required before login
- Secure token generation for email verification
- SQL injection prevention with parameterized queries

### 2. Internationalization (i18n) System

```
Language Detection:
URL Locale → Cookie Preference → Browser Language → Default (German)

Translation Flow:
Component → useTranslation Hook → Dictionary Lookup → Rendered Text
```

#### i18n Architecture
- URL-based locale routing (`/de/...`, `/en/...`)
- Middleware for automatic locale detection and redirection
- React Context for locale and dictionary management
- JSON-based translation dictionaries
- User preference storage in database and cookies

### 3. Email System

```
Email Flow:
Trigger Event → Template Selection → Content Generation → SMTP Delivery → Status Tracking
```

#### Email Types
- **Registration Verification:** Welcome email with verification link
- **Resend Verification:** Duplicate verification email
- **Future:** Password reset, notifications, etc.

## Data Flow

### 1. User Registration
```
Frontend Form → Validation → API Request → Backend Validation → 
Password Hashing → Database Insert → Email Generation → 
SMTP Delivery → Success Response → Frontend Feedback
```

### 2. Language Switching
```
User Selection → Cookie Update → Database Update (if logged in) → 
URL Change → Page Reload → New Language Display
```

### 3. Authentication
```
Login Form → Credentials Validation → Database Query → 
Password Verification → Email Verification Check → 
JWT Generation → Cookie Setting → Dashboard Redirect
```

## Security Architecture

### Frontend Security
- **Input Validation:** Zod schemas for form validation
- **XSS Prevention:** React's built-in XSS protection
- **CSRF Protection:** SameSite cookie settings
- **Secure Communication:** HTTPS in production

### Backend Security
- **Authentication:** JWT-based stateless authentication
- **Authorization:** Role-based access control
- **Input Sanitization:** Manual validation and sanitization
- **SQL Injection Prevention:** Parameterized queries
- **Password Security:** bcrypt hashing with salt

### Database Security
- **Connection Security:** SSL connections in production
- **Access Control:** Dedicated database user with limited privileges
- **Data Encryption:** Sensitive data hashing
- **Backup Security:** Encrypted backups

## Performance Considerations

### Frontend Performance
- **Code Splitting:** Next.js automatic code splitting
- **Image Optimization:** Next.js Image component
- **Caching:** Browser caching for static assets
- **Bundle Optimization:** Tree shaking and minification

### Backend Performance
- **Connection Pooling:** MySQL connection pool
- **Query Optimization:** Indexed database queries
- **Caching Strategy:** Future implementation of Redis
- **Compression:** Gzip compression for responses

### Database Performance
- **Indexing:** Primary keys and unique constraints
- **Query Optimization:** Efficient query patterns
- **Connection Management:** Pool-based connections
- **Monitoring:** Query performance tracking

## Scalability Architecture

### Horizontal Scaling
- **Frontend:** CDN distribution, multiple server instances
- **Backend:** Load balancer with multiple API instances
- **Database:** Read replicas, connection pooling

### Vertical Scaling
- **Server Resources:** CPU, memory, and storage scaling
- **Database Optimization:** Query optimization, indexing
- **Caching Layers:** Redis for session and data caching

## Monitoring and Logging

### Application Monitoring
- **Error Tracking:** Console logging (production: external service)
- **Performance Monitoring:** Response time tracking
- **Health Checks:** API health endpoints
- **Uptime Monitoring:** External monitoring services

### Security Monitoring
- **Authentication Logs:** Login attempts and failures
- **Access Logs:** API endpoint access patterns
- **Error Logs:** Security-related errors and attempts

## Future Architecture Enhancements

### Planned Improvements
1. **Microservices:** Split into smaller, focused services
2. **Caching Layer:** Redis for session and data caching
3. **File Storage:** Cloud storage for user-generated content
4. **Real-time Features:** WebSocket support for live features
5. **API Gateway:** Centralized API management and routing
6. **Container Orchestration:** Docker and Kubernetes deployment

### Technology Upgrades
1. **Database:** Consider PostgreSQL for advanced features
2. **ORM:** Implement Prisma or TypeORM for better type safety
3. **Testing:** Comprehensive test suite with Jest and Cypress
4. **CI/CD:** Automated testing and deployment pipelines
5. **Monitoring:** Advanced monitoring with Prometheus and Grafana

This architecture provides a solid foundation for LinguaLeap's current needs while allowing for future growth and enhancements.