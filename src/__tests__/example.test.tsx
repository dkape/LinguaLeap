import { render, screen } from '@/__tests__/test-utils'

/**
 * Example component test
 * Tests basic rendering and user interactions
 */
describe('Example Component Tests', () => {
  test('renders successfully', () => {
    const { container } = render(<div>Test Content</div>)
    expect(container).toBeInTheDocument()
  })

  test('displays text content', () => {
    render(<div>Hello World</div>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  test('renders with accessibility attributes', () => {
    render(
      <button aria-label="Close">
        ×
      </button>
    )
    expect(screen.getByLabelText('Close')).toBeInTheDocument()
  })
})
