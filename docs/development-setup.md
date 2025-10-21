# LinguaLeap Development Setup

## Prerequisites

Before setting up the development environment, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **MySQL** (version 8.0 or higher)
- **Git**
- A code editor (VS Code recommended)

## Project Structure

```
LinguaLeap/
├── docs/                          # Documentation
├── server/                        # Backend (Express.js)
│   ├── config/                    # Database and configuration
│   ├── controllers/               # Route controllers
│   ├── middleware/                # Custom middleware
│   ├── routes/                    # API routes
│   ├── .env                       # Environment variables
│   ├── index.js                   # Server entry point
│   └── package.json               # Backend dependencies
├── src/                           # Frontend (Next.js)
│   ├── app/                       # Next.js app directory
│   ├── components/                # React components
│   ├── contexts/                  # React contexts
│   ├── hooks/                     # Custom hooks
│   ├── lib/                       # Utilities and types
│   └── middleware.ts              # Next.js middleware
├── .env.local                     # Frontend environment variables
├── package.json                   # Frontend dependencies
└── README.md                      # Project overview
```

## Initial Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd LinguaLeap
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 3. Database Setup

#### Create MySQL Database
```sql
CREATE DATABASE lingua CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'lingua'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON lingua.* TO 'lingua'@'localhost';
FLUSH PRIVILEGES;
```

#### Configure Database Connection
Create `server/.env` file:
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

### 4. Frontend Configuration

Create `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 5. Initialize Database Tables

The application will automatically create the necessary tables when you first start the server. The schema is defined in `server/config/schema.sql`.

## Development Workflow

### Starting the Development Environment

#### Option 1: Start Both Services Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### Option 2: Use Workspace Commands

**Start Backend:**
```bash
npm run server:dev
```

**Start Frontend:**
```bash
npm run dev
```

### Accessing the Application

- **Frontend:** http://localhost:9002
- **Backend API:** http://localhost:3001
- **API Health Check:** http://localhost:3001/

### Default Language Behavior

- The application defaults to German (`/de`)
- Visiting the root URL will redirect to `/de`
- Language can be switched using the language switcher in the top-right corner

## Development Tools

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### Code Formatting

The project uses Prettier for code formatting. Configuration is in the root directory.

**Format code:**
```bash
npm run lint
```

### Type Checking

**Check TypeScript types:**
```bash
npm run typecheck
```

## Database Management

### Viewing Database Schema
```bash
mysql -u lingua -p lingua
DESCRIBE users;
DESCRIBE learning_paths;
DESCRIBE learning_path_items;
```

### Resetting Database
```sql
DROP DATABASE lingua;
CREATE DATABASE lingua CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Then restart the server to recreate tables.

## Email Testing

For development, you can use:

### Option 1: Mailtrap (Recommended)
1. Sign up at https://mailtrap.io
2. Get SMTP credentials from your inbox
3. Update `server/.env` with Mailtrap credentials

### Option 2: Gmail SMTP
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password
```

### Option 3: Local SMTP Server
```bash
# Install and run MailHog
go install github.com/mailhog/MailHog@latest
MailHog
```

Then use:
```env
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
```

## Testing

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests (when available)
npm test
```

### Manual Testing Checklist

#### Authentication Flow
- [ ] Register as teacher
- [ ] Register as student
- [ ] Receive verification email
- [ ] Verify email address
- [ ] Login with verified account
- [ ] Login blocked for unverified account

#### Language Switching
- [ ] Default language is German
- [ ] Language switcher works
- [ ] URL changes with language
- [ ] Language persists after refresh
- [ ] User language preference saved

#### Navigation
- [ ] Home page loads
- [ ] Auth pages accessible
- [ ] Dashboard loads after login
- [ ] Logout works

## Common Development Issues

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 9002
lsof -ti:9002 | xargs kill -9
```

### Database Connection Issues
1. Check MySQL is running: `brew services start mysql` (macOS) or `sudo service mysql start` (Linux)
2. Verify credentials in `server/.env`
3. Check database exists: `mysql -u lingua -p -e "SHOW DATABASES;"`

### CORS Issues
- Ensure `CLIENT_URL` in `server/.env` matches your frontend URL
- Check CORS configuration in `server/index.js`

### Email Not Sending
1. Verify SMTP credentials
2. Check firewall settings
3. Test with a different SMTP provider
4. Check server logs for detailed error messages

## Environment Variables Reference

### Frontend (.env.local)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001/api` |

### Backend (server/.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `3306` |
| `DB_USER` | Database username | `lingua` |
| `DB_PASSWORD` | Database password | `secure_password` |
| `DB_NAME` | Database name | `lingua` |
| `JWT_SECRET` | JWT signing secret | `your_32_char_secret` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_SECURE` | Use TLS | `true` |
| `SMTP_USER` | SMTP username | `user@gmail.com` |
| `SMTP_PASS` | SMTP password | `app_password` |
| `EMAIL_FROM` | Sender email | `noreply@domain.com` |
| `CLIENT_URL` | Frontend URL | `http://localhost:9002` |

## Git Workflow

### Branch Naming Convention
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical fixes
- `docs/documentation-update` - Documentation updates

### Commit Message Format
```
type(scope): description

Examples:
feat(auth): add email verification
fix(i18n): resolve language switching bug
docs(api): update endpoint documentation
```

## Debugging

### Backend Debugging
```bash
# Enable debug logs
DEBUG=* npm run dev

# Check database queries
# Add console.log in controllers
```

### Frontend Debugging
- Use React Developer Tools
- Check browser console for errors
- Use Next.js built-in debugging

### Network Debugging
- Use browser Network tab
- Check API responses
- Verify CORS headers

This development setup guide should get you up and running with LinguaLeap development quickly and efficiently.