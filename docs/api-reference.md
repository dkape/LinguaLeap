# LinguaLeap API Reference

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://your-domain.com/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "student" | "teacher"
}
```

**Response (201):**
```json
{
  "message": "Registration successful! Please check your email to verify your account.",
  "email": "user@example.com"
}
```

**Errors:**
- `400` - Invalid input data
- `409` - User already exists

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "string",
    "uid": "string",
    "name": "string",
    "email": "string",
    "role": "student" | "teacher",
    "avatarUrl": "string",
    "points": "number",
    "isEmailVerified": "boolean",
    "preferredLanguage": "de" | "en",
    "createdAt": "timestamp"
  }
}
```

**Errors:**
- `401` - Invalid credentials
- `403` - Email not verified

#### GET /auth/verify-email
Verify user email address.

**Query Parameters:**
- `token` (required) - Email verification token

**Response (200):**
```json
{
  "message": "Email verified successfully! You can now log in."
}
```

**Errors:**
- `400` - Invalid or expired token

#### POST /auth/resend-verification
Resend email verification.

**Request Body:**
```json
{
  "email": "string"
}
```

**Response (200):**
```json
{
  "message": "Verification email sent successfully!"
}
```

**Errors:**
- `400` - Email already verified
- `404` - User not found

#### GET /auth/me
Get current user information. (Protected)

**Response (200):**
```json
{
  "user": {
    "id": "string",
    "uid": "string",
    "name": "string",
    "email": "string",
    "role": "student" | "teacher",
    "avatarUrl": "string",
    "points": "number",
    "isEmailVerified": "boolean",
    "preferredLanguage": "de" | "en",
    "createdAt": "timestamp"
  }
}
```

#### PUT /auth/language-preference
Update user's language preference. (Protected)

**Request Body:**
```json
{
  "language": "de" | "en"
}
```

**Response (200):**
```json
{
  "message": "Language preference updated successfully"
}
```

**Errors:**
- `400` - Invalid language code

## Error Responses

All error responses follow this format:
```json
{
  "message": "Error description"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended to add rate limiting for production use, especially for:
- Registration endpoints
- Login attempts
- Email verification requests

## CORS

The API accepts requests from:
- `http://localhost:3000` (development frontend)
- `http://localhost:9002` (development frontend alternative port)

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uid VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher') NOT NULL,
  avatarUrl VARCHAR(255),
  points INT DEFAULT 0,
  isEmailVerified BOOLEAN DEFAULT FALSE,
  emailVerificationToken VARCHAR(255),
  emailVerificationExpires TIMESTAMP NULL,
  preferredLanguage ENUM('de', 'en') DEFAULT 'de',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

### Required Variables
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# JWT
JWT_SECRET=your_jwt_secret

# Email (SMTP)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
EMAIL_FROM=noreply@yourdomain.com

# Frontend URL
CLIENT_URL=http://localhost:9002
```

## Security Considerations

- Passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens expire after 1 hour
- Email verification tokens expire after 24 hours
- All database queries use parameterized statements to prevent SQL injection
- Sensitive user data is excluded from API responses