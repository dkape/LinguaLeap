# LinguaLeap Testing Guide

## Prerequisites

1. Make sure Node.js and npm are installed
2. Install server dependencies: `npm install` (in the server directory)
3. Make sure your MySQL database is running and accessible
4. Update the `.env` file with correct database and SMTP settings

## Running the Tests

1. Start the server:
   ```bash
   cd server
   npm start
   ```

2. In another terminal, run the registration tests:
   ```bash
   cd server
   node test-registration.js
   ```

## What the Tests Cover

The test suite will verify:

✅ **User Registration**
- Teacher registration with email verification
- Student registration with email verification
- Proper database record creation
- Email verification token generation

✅ **Email Verification**
- Token-based email verification
- Database status updates after verification
- Expired token handling

✅ **Login Flow**
- Blocking login for unverified emails
- Successful login after email verification
- Proper error messages

✅ **Email Functionality**
- Verification email sending
- Resend verification email
- Email template rendering

✅ **Data Validation**
- Required field validation
- Email format validation
- Role validation
- Duplicate email prevention

## Manual Testing

You can also test manually:

1. **Register a new user:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Teacher",
       "email": "test@example.com",
       "password": "password123",
       "role": "teacher"
     }'
   ```

2. **Check your email** for the verification link

3. **Verify email** by visiting the link or calling:
   ```bash
   curl "http://localhost:3001/api/auth/verify-email?token=YOUR_TOKEN"
   ```

4. **Login after verification:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

## Frontend Testing

1. Start the Next.js development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:9002/de/signup/teacher` or `http://localhost:9002/de/signup/student`

3. Register a new account and check your email for verification

4. Click the verification link to verify your account

5. Try logging in at `http://localhost:9002/de/login/teacher` or `http://localhost:9002/de/login/student`

## Language Testing

### German (Default Language)
1. Visit `http://localhost:9002` → Should redirect to `/de`
2. All text should be in German
3. Registration and login forms should be in German

### English Testing
1. Use language switcher to change to English
2. URL should change to `/en/...`
3. All text should be in English
4. Language preference should persist after refresh

### Language Preference Testing
1. Register/login as a user
2. Change language using the switcher
3. Logout and login again
4. Should remember the language preference

## Expected Behavior

- **Registration**: User receives success message and verification email
- **Email Verification**: Clicking link shows success page and enables login
- **Login Before Verification**: Shows error message about email verification
- **Login After Verification**: Successfully logs in and redirects to dashboard
- **Duplicate Registration**: Shows appropriate error message
- **Invalid Data**: Shows validation errors
- **Language Switching**: Seamless switching between German and English
- **Language Persistence**: Language choice remembered across sessions