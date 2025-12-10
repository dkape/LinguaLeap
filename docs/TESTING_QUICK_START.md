# Frontend Testing Quick Start

Get started with testing LinguaLeap frontend in 5 minutes!

## 1. Install Dependencies (First Time Only)

```bash
cd /home/suadmin/workspaces/LinguaLeap

# Install npm packages
npm install

# Install Playwright browsers for E2E testing
npx playwright install
```

**Time**: ~2-3 minutes depending on internet

## 2. Run Unit Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

View coverage: `open coverage/lcov-report/index.html`

## 3. Run E2E Tests

```bash
# Run all E2E tests (headless - suitable for CI)
npm run test:e2e

# Run with visible browser (helpful for debugging)
npm run test:e2e:headed

# Interactive UI mode (best for debugging)
npm run test:e2e:ui

# Step-by-step debugging with inspector
npm run test:e2e:debug
```

## 4. Write Your First Test

### Unit Test Example

Create `src/components/Button/Button.test.tsx`:

```typescript
import { render, screen } from '@/__tests__/test-utils'
import { Button } from './Button'

describe('Button', () => {
  test('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })
})
```

### E2E Test Example

Create `tests/e2e/home.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/LinguaLeap/)
})
```

## 5. Before Committing

```bash
# Run everything
npm run lint && \
npm run typecheck && \
npm run test:coverage && \
npm run test:e2e
```

All must pass before pushing!

## Test Scripts Summary

| Command | Purpose | When to Use |
|---------|---------|------------|
| `npm test` | Run unit tests once | Quick validation |
| `npm run test:watch` | Auto-run tests on file change | During development |
| `npm run test:coverage` | Generate coverage report | Before committing |
| `npm run test:e2e` | Run E2E tests headless | CI/CD and pre-commit |
| `npm run test:e2e:headed` | E2E tests with visible browser | Debugging |
| `npm run test:e2e:ui` | Interactive E2E testing | Best debugging experience |
| `npm run test:e2e:debug` | Step-by-step debugging | Debugging complex flows |

## Project Structure

```
src/
├── __tests__/
│   ├── example.test.tsx      ← Copy this for unit tests
│   ├── test-utils.tsx        ← Use this to render components
│   └── setup.ts              ← Test helper utilities
│
└── components/
    └── YourComponent/
        └── YourComponent.test.tsx ← Tests go here

tests/
└── e2e/
    └── example.spec.ts  ← Copy this for E2E tests
```

## File Locations

| File | Purpose |
|------|---------|
| `jest.config.js` | Jest configuration |
| `jest.setup.js` | Jest setup (env vars, mocks) |
| `playwright.config.ts` | Playwright configuration |
| `src/__tests__/` | Test utilities & examples |
| `tests/e2e/` | E2E tests |
| `docs/testing-guide.md` | Full testing guide |

## Troubleshooting

### E2E tests timeout?
```bash
# Make sure dev server is running
npm run dev

# In another terminal
npm run test:e2e:headed
```

### Port 3000 already in use?
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Try again
npm run dev
```

### Module not found errors?
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npx playwright install
```

### Tests pass locally but fail in CI?
```bash
# Use exact same flags as CI
npm run test:coverage && npm run test:e2e
```

## Example Commands

```bash
# Run a specific test file
npm test -- src/components/Button/Button.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="login"

# Run specific E2E test
npm run test:e2e -- tests/e2e/auth.spec.ts

# View Playwright report
npx playwright show-report

# View coverage report
open coverage/lcov-report/index.html
```

## Best Practices

1. **Run `npm run test:watch` during development**
   - Get instant feedback
   - Keep tests passing as you code

2. **Use example tests as templates**
   - `src/__tests__/example.test.tsx` for unit tests
   - `tests/e2e/example.spec.ts` for E2E tests

3. **Query by user interactions**
   ```typescript
   // ✅ Good
   screen.getByRole('button', { name: /submit/i })
   screen.getByLabelText('Email')
   
   // ❌ Avoid
   screen.getByTestId('btn-123')
   container.querySelector('.btn')
   ```

4. **Test user behavior, not implementation**
   - What does the user see?
   - What can the user do?
   - What happens after?

5. **Keep tests isolated**
   - Clear mocks between tests
   - No shared state
   - Each test independent

## Next Steps

1. **Review example tests**: `src/__tests__/example.test.tsx`
2. **Read full guide**: `docs/testing-guide.md`
3. **Write your first test** for a component
4. **Run tests continuously** with `npm run test:watch`
5. **Check coverage** with `npm run test:coverage`

## CI/CD Integration

Tests run automatically:

- ✅ On every PR
- ✅ On Dependabot updates
- ✅ On commits to main
- ✅ Results show in GitHub PR checks
- ✅ Coverage tracked in Codecov

**No manual action needed** - just commit and push!

## Resources

- **Jest**: https://jestjs.io
- **React Testing Library**: https://testing-library.com
- **Playwright**: https://playwright.dev
- **Full Guide**: `docs/testing-guide.md`

## Quick Reference

```bash
# Install (first time)
npm install && npx playwright install

# Development
npm run test:watch

# Before commit
npm run test:coverage && npm run test:e2e

# Debug E2E
npm run test:e2e:ui

# View results
open coverage/lcov-report/index.html
npx playwright show-report
```

Happy testing! 🚀
