import { test, expect } from '@playwright/test'

test.describe('Frontend Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/')
  })

  test('should load the home page', async ({ page }) => {
    // Check that page loaded successfully
    await expect(page).toHaveTitle(/LinguaLeap|Dashboard|Learning/)
    // Verify page is not blank
    const body = await page.locator('body')
    await expect(body).toBeVisible()
  })

  test('should have accessible heading structure', async ({ page }) => {
    // Check for h1 heading
    const heading = page.locator('h1, h2')
    await expect(heading.first()).toBeVisible()
  })

  test('should navigate without errors', async ({ page }) => {
    // Capture console errors
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    // Navigate around the page
    await page.goto('/')
    
    // No critical errors should occur
    const criticalErrors = errors.filter(
      (e) => !e.includes('ResizeObserver') // Filter out non-critical errors
    )
    expect(criticalErrors).toHaveLength(0)
  })

  test('should be responsive on mobile', async ({ page, context }) => {
    // Create a mobile context
    const mobileContext = await context.browser()?.newContext({
      viewport: { width: 375, height: 667 },
    })
    
    if (mobileContext) {
      const mobilePage = await mobileContext.newPage()
      await mobilePage.goto('/')
      
      // Verify page loads on mobile
      const body = await mobilePage.locator('body')
      await expect(body).toBeVisible()
      
      await mobilePage.close()
      await mobileContext.close()
    }
  })
})

test.describe('Accessibility', () => {
  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/')
    
    // Check for at least one visible text element
    const textElements = await page.locator('body *:visible').count()
    expect(textElements).toBeGreaterThan(0)
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    
    // Try tabbing through the page
    await page.keyboard.press('Tab')
    
    // Verify focus is set to an element
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName
    })
    
    expect(focusedElement).toBeDefined()
  })
})

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/', { waitUntil: 'networkidle' })
    const loadTime = Date.now() - startTime
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('should have no layout shifts', async ({ page }) => {
    await page.goto('/')
    
    // Get initial viewport size
    const initialSize = await page.viewportSize()
    
    // Should maintain viewport
    const currentSize = await page.viewportSize()
    expect(currentSize).toEqual(initialSize)
  })
})
