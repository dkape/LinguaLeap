# Comprehensive Frontend Testing Guide

This document provides a complete guide to testing the LinguaLeap frontend application using modern, open-source testing tools.

## Overview

The LinguaLeap frontend uses a comprehensive multi-layered testing approach:

1. **Unit Tests** - Test individual components in isolation using Jest and React Testing Library
2. **Integration Tests** - Test component interactions using React Testing Library
3. **E2E Tests** - Test complete user workflows using Playwright
4. **Performance Tests** - Monitor and test page load times and responsiveness
5. **Accessibility Tests** - Ensure WCAG compliance and keyboard navigation

## Testing Stack

| Tool | Purpose | Open Source |
|------|---------|-------------|
| **Jest** | Unit testing framework | ✅ Yes |
| **React Testing Library** | Component testing | ✅ Yes |
| **Playwright** | E2E testing | ✅ Yes |
| **Codecov** | Coverage reporting | ✅ Yes (free tier) |

All tools are free and open-source!

## Prerequisites

1. Node.js 18+ installed
2. npm installed
3. MongoDB running (for backend tests)
4. `.env.local` file with necessary environment variables

## Installation

### Dependencies

All testing dependencies are already configured in `package.json`. Install them:

```bash
npm install
```

### Playwright Browsers

To use Playwright for E2E testing locally, install the browsers:

```bash
npx playwright install
```

This installs Chromium, Firefox, and WebKit for cross-browser testing.

## Running Tests

### Frontend Unit Tests

Run all unit tests once:

```bash
npm test
```

Run tests in watch mode (re-run on file changes):

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

Run specific test file:

```bash
npm test -- src/components/Button/Button.test.tsx
```

Run tests matching a pattern:

```bash
npm test -- --testNamePattern="login"
```

### Frontend E2E Tests

Run all E2E tests (headless mode, suitable for CI/CD):

```bash
npm run test:e2e
```

Run tests in headed mode (see browser window):

```bash
npm run test:e2e:headed
```

Run tests in UI mode (interactive with controls):

```bash
npm run test:e2e:ui
```

Debug tests step-by-step with Inspector:

```bash
npm run test:e2e:debug
```

Run specific test file:

```bash
npm run test:e2e -- tests/e2e/auth.spec.ts
```

### Combined Local Testing

Run all tests before committing:

```bash
npm run lint && npm run typecheck && npm run test:coverage && npm run test:e2e
```

## Test Structure

### Directory Layout

```
src/
├── __tests__/
│   ├── setup.ts                  # Test utilities and helpers
│   ├── test-utils.tsx            # Custom render function with providers
│   └── example.test.tsx           # Example unit tests
│
└── components/
    ├── Button/
    │   ├── Button.tsx
    │   ├── Button.test.tsx         # ← Tests collocated with source
    │   └── Button.module.css
    │
    ├── Form/
    │   ├── Form.tsx
    │   └── Form.test.tsx

tests/
├── e2e/
│   ├── auth.spec.ts              # Authentication flows
│   ├── dashboard.spec.ts          # Dashboard functionality
│   ├── navigation.spec.ts         # Navigation and routing
│   └── accessibility.spec.ts      # Accessibility checks
│
└── fixtures/
    ├── auth.fixtures.ts          # Mock data for auth
    └── users.fixtures.ts         # Mock user data

playwright.config.ts              # Playwright configuration
jest.config.js                    # Jest configuration
jest.setup.js                     # Jest setup file
```

### Test File Naming

- **Unit tests**: `*.test.ts` or `*.test.tsx`
  - Collocated in same directory as source file
  - Example: `Button.tsx` → `Button.test.tsx`

- **E2E tests**: `*.spec.ts`
  - Located in `tests/e2e/` directory
  - Example: `tests/e2e/auth.spec.ts`

- **Test utilities**: `*.fixtures.ts` or `test-*.ts`
  - Helper functions and mock data

## Writing Tests

### Unit Test Example

Test file: `src/components/Button/Button.test.tsx`

```typescript
import { render, screen } from '@/__tests__/test-utils'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  test('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    const button = screen.getByRole('button')
    await userEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  test('applies custom className', () => {
    const { container } = render(<Button className="custom-class">Button</Button>)
    expect(container.querySelector('button')).toHaveClass('custom-class')
  })
})
```

### E2E Test Example

Test file: `tests/e2e/auth.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app before each test
    await page.goto('/en/signup/student')
  })

  test('should register a new student', async ({ page }) => {
    // Fill registration form
    await page.fill('input[name="email"]', 'student@example.com')
    await page.fill('input[name="password"]', 'SecurePass123!')
    await page.fill('input[name="confirmPassword"]', 'SecurePass123!')
    
    // Accept terms
    await page.check('input[type="checkbox"]')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Verify success message
    await expect(page.locator('text=Registration successful')).toBeVisible()
  })

  test('should show validation errors for invalid input', async ({ page }) => {
    // Submit empty form
    await page.click('button[type="submit"]')
    
    // Check for error messages
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  test('should login with valid credentials', async ({ page }) => {
    // Navigate to login
    await page.goto('/en/login/student')
    
    // Fill login form
    await page.fill('input[name="email"]', 'student@example.com')
    await page.fill('input[name="password"]', 'SecurePass123!')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL(/\/en\/(student|teacher)\/dashboard/)
    await expect(page.locator('text=Welcome')).toBeVisible()
  })

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network offline
    await page.context().setOffline(true)
    
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password')
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('text=Network error')).toBeVisible()
    
    // Go back online
    await page.context().setOffline(false)
  })
})
```

### Testing Best Practices

#### 1. Query by Accessibility Attributes

✅ **DO**: Query like a user would interact

```typescript
// By role (most preferred)
screen.getByRole('button', { name: /submit/i })
screen.getByRole('textbox', { name: /email/i })
screen.getByRole('combobox')

// By label text
screen.getByLabelText('Email address')

// By placeholder
screen.getByPlaceholderText('Enter email')

// By text content
screen.getByText('Submit')
```

❌ **DON'T**: Query by implementation details

```typescript
// Avoid these
screen.getByTestId('submit-btn')  // Only when necessary
container.querySelector('.submit-button')
wrapper.find('[data-cy="email"]')
```

#### 2. Test User Behavior, Not Implementation

✅ **DO**: Test what users see and do

```typescript
test('users can submit a form', async () => {
  render(<LoginForm />)
  
  await userEvent.type(screen.getByLabelText('Email'), 'user@test.com')
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))
  
  expect(screen.getByText(/successfully logged in/i)).toBeInTheDocument()
})
```

❌ **DON'T**: Test internal state or implementation

```typescript
test('form component state updates', () => {
  const { result } = renderHook(() => useFormState())
  expect(result.current.email).toBe('')  // ← Too specific to implementation
})
```

#### 3. Async Tests with userEvent

```typescript
import userEvent from '@testing-library/user-event'

test('handles async operations', async () => {
  const user = userEvent.setup()
  render(<AsyncComponent />)
  
  // userEvent.setup() returns a user object with better async handling
  await user.click(screen.getByRole('button'))
  await user.type(screen.getByRole('textbox'), 'text')
  
  // Wait for async operations
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
  })
})
```

#### 4. Mocking External Calls

```typescript
// Mock API calls
jest.mock('@/lib/api', () => ({
  fetchUser: jest.fn(() => Promise.resolve({ id: '1', name: 'John' }))
}))

// Mock modules
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/dashboard'
  })
}))

// Mock window methods
global.fetch = jest.fn(() => 
  Promise.resolve({
    json: async () => ({ data: 'value' })
  })
)
```

#### 5. Cleanup and Isolation

```typescript
describe('MyComponent', () => {
  afterEach(() => {
    jest.clearAllMocks()  // Clear mocks between tests
  })

  test('first test', () => {
    // ...
  })

  test('second test', () => {
    // Each test starts fresh
  })
})
```

## CI/CD Integration

### Automatic Testing Pipeline

Tests run automatically:

1. **On Pull Requests**
   - All unit tests with coverage
   - All E2E tests
   - Linting and type checking
   - Security scanning

2. **On Dependency Updates**
   - Dependabot creates PRs when dependencies update
   - All tests run automatically
   - Must pass before merge

3. **On Every Commit**
   - To main branch: Full test suite
   - To feature branches: Full test suite

### Test Jobs in CI/CD

#### Frontend Tests (`frontend-test` job)

```
Setup Node.js
    ↓
Install Dependencies
    ↓
Run Linting
    ↓
Run Type Checking
    ↓
Run Unit Tests + Coverage
    ↓
Upload Coverage to Codecov
    ↓
Install Playwright Browsers
    ↓
Run E2E Tests
    ↓
Upload Test Reports
```

#### Parallel Execution

- Frontend and backend tests run in parallel
- Tests must pass before deployment

#### Coverage Reports

Coverage reports are automatically uploaded to Codecov. View them:

1. In GitHub: Check PR checks
2. On Codecov: https://codecov.io
3. Locally: `npm run test:coverage` then open `coverage/lcov-report/index.html`

## Debugging Tests

### Debug Unit Tests in Node

```bash
# Start debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Then open chrome://inspect in Chrome browser
```

### Debug Unit Tests in IDE

Most IDEs support Jest debugging:

**VS Code**: Install "Jest Runner" extension, then right-click test and select "Debug"

### Debug E2E Tests

#### Method 1: UI Mode (Recommended)

```bash
npm run test:e2e:ui
```

Opens an interactive test explorer where you can:
- Step through tests
- Inspect elements
- View test timeline
- Replay failed tests

#### Method 2: Headed Mode

```bash
npm run test:e2e:headed
```

Runs tests with visible browser window so you can see what's happening.

#### Method 3: Inspector

```bash
npm run test:e2e:debug
```

Opens Playwright Inspector with step-by-step debugging.

#### Method 4: Screenshots and Videos

By default, failed tests capture:
- Screenshots: `test-results/screenshots/`
- Videos: `test-results/videos/`

View them locally after test runs.

### View Test Reports

```bash
# Jest coverage (interactive HTML)
open coverage/lcov-report/index.html

# Playwright report (detailed test report)
npx playwright show-report

# E2E JSON results
cat test-results/results.json | jq
```

## Coverage Tracking

### Current Coverage Goals

We use a progressive coverage approach:

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 0,
    functions: 0,
    lines: 0,
    statements: 0,
  },
}
```

### Viewing Coverage

After running `npm run test:coverage`:

```bash
open coverage/lcov-report/index.html
```

This shows:
- File-by-file coverage
- Line coverage
- Branch coverage
- Uncovered lines highlighted

### Coverage Badges

Add to README for visibility:

```markdown
[![codecov](https://codecov.io/gh/dkape/LinguaLeap/branch/main/graph/badge.svg)](https://codecov.io/gh/dkape/LinguaLeap)
```

## Troubleshooting

### Tests Failing Locally But Passing in CI

**Solution**:
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm install

# Make sure Node version matches (18)
node --version

# Check environment variables
cat .env.local

# Run exact same test as CI
npm run lint && npm run typecheck && npm run test:coverage && npm run test:e2e
```

### E2E Tests Timing Out

**Solution**:
```bash
# 1. Make sure app is running
npm run dev  # In another terminal

# 2. Check it's accessible
curl http://localhost:3000

# 3. Increase timeout in playwright.config.ts if needed
timeout: 30000  // milliseconds

# 4. Run with more verbose output
npm run test:e2e -- --debug
```

### "Cannot find module" Errors

**Solution**:
```bash
# Update jsconfig or tsconfig path mapping if needed
# In jest.config.js, moduleNameMapper should match:
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### Flaky Tests

**Prevention**:
- Use `waitFor()` instead of arbitrary timeouts
- Don't test implementation details
- Isolate external dependencies
- Use proper async/await patterns

```typescript
// ✅ Good
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// ❌ Avoid
await new Promise(r => setTimeout(r, 1000))
expect(screen.getByText('Loaded')).toBeInTheDocument()
```

### Port 3000 Already in Use

For E2E tests:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or specify different port
PORT=3001 npm run test:e2e
```

## Backend Testing

### Run Backend Tests

```bash
npm run test --workspace=server
```

Requires MongoDB running with proper authentication.

### Backend Test Setup

See: `server/test/setup/` for test database initialization.

## Contributing Tests

When submitting PRs:

✅ **Checklist**:
- [ ] All new features have tests
- [ ] All tests pass locally: `npm test && npm run test:e2e`
- [ ] Coverage didn't decrease
- [ ] E2E tests cover happy path
- [ ] Tests are descriptive and maintainable
- [ ] No hardcoded timeouts (use waitFor instead)
- [ ] Mocks are cleaned up properly

### PR Test Requirements

For PRs to be merged:
1. All unit tests must pass
2. E2E tests must pass
3. Type checking must pass
4. Linting must pass
5. Code coverage should not decrease

## Additional Resources

- [Jest Official Docs](https://jestjs.io)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Official Docs](https://playwright.dev)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)

## Example Tests Reference

See working examples in:

- **Unit Tests**: `src/__tests__/example.test.tsx`
- **E2E Tests**: `tests/e2e/example.spec.ts`

Copy these as templates for your own tests!

## Questions?

1. Check the troubleshooting section above
2. Review example test files
3. Consult the documentation links
4. Open an issue on GitHub