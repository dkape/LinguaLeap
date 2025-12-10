/**
 * Test utilities and setup helpers
 */

export const mockEnvironment = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}

/**
 * Create a mock fetch response
 */
export function createMockResponse<T>(
  data: T,
  options: ResponseInit = {}
): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
}

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  condition: () => boolean,
  timeout = 1000
): Promise<void> {
  const start = Date.now()
  while (!condition()) {
    if (Date.now() - start > timeout) {
      throw new Error('Timeout waiting for condition')
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
}

test('placeholder test', () => {
  expect(true).toBe(true);
});
