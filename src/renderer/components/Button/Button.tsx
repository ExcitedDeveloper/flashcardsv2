import './Button.css'

export type ButtonTypes = 'button' | 'submit' | 'reset' | undefined

export interface ButtonProps {
  type?: ButtonTypes
  onClick: () => void
  children: React.ReactNode
  className?: string
  style?: object
  disabled?: boolean
}

const Button = ({
  type = 'button',
  onClick,
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) => {
  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type || 'button'}
      onClick={onClick}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

Button.defaultProps = {
  type: 'button',
  className: '',
  style: {},
  disabled: false
}

export default Button
