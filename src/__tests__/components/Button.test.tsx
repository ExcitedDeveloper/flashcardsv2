import '@testing-library/jest-dom'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../../renderer/components/Button/Button'

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button onClick={() => {}}>Click me</Button>)
    expect(
      screen.getByRole('button', { name: /click me/i })
    ).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup()
    const mockClick = jest.fn()

    render(<Button onClick={mockClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)

    expect(mockClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(
      <Button onClick={() => {}} disabled>
        Disabled button
      </Button>
    )
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should not call onClick when disabled and clicked', async () => {
    const user = userEvent.setup()
    const mockClick = jest.fn()

    render(
      <Button onClick={mockClick} disabled>
        Disabled button
      </Button>
    )

    const button = screen.getByRole('button')
    await user.click(button)

    expect(mockClick).not.toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    render(
      <Button onClick={() => {}} className="custom-class">
        Button
      </Button>
    )
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('should apply custom styles', () => {
    const customStyles = { backgroundColor: 'red', width: '100px' }
    render(
      <Button onClick={() => {}} style={customStyles}>
        Styled button
      </Button>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveStyle('background-color: red')
    expect(button).toHaveStyle('width: 100px')
  })

  it('should render with type attribute', () => {
    render(
      <Button onClick={() => {}} type="submit">
        Submit
      </Button>
    )
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('should render with default button class', () => {
    render(<Button onClick={() => {}}>Default button</Button>)
    expect(screen.getByRole('button')).toHaveClass('button')
  })

  it('should combine default class with custom class', () => {
    render(
      <Button onClick={() => {}} className="custom">
        Button with classes
      </Button>
    )
    const button = screen.getByRole('button')
    expect(button).toHaveClass('button')
    expect(button).toHaveClass('custom')
  })

  it('should handle children of different types', () => {
    render(
      <Button onClick={() => {}}>
        <span>Icon</span>
        Text content
      </Button>
    )

    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Text content')).toBeInTheDocument()
  })

  it('should handle empty children', () => {
    const mockClick = jest.fn()
    render(<Button onClick={mockClick}>Empty</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should preserve other button attributes', () => {
    const mockClick = jest.fn()
    render(
      <Button
        onClick={mockClick}
        data-testid="custom-button"
        aria-label="Custom button"
      >
        Button
      </Button>
    )

    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('aria-label', 'Custom button')
  })
})
