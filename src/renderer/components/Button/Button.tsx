import './Button.css'

export type ButtonTypes = 'button' | 'submit' | 'reset' | undefined

export interface ButtonProps {
  type?: ButtonTypes // eslint-disable-line react/require-default-props
  onClick?: () => void // eslint-disable-line react/require-default-props
  children: React.ReactNode
  className?: string // eslint-disable-line react/require-default-props
  style?: object // eslint-disable-line react/require-default-props
  disabled?: boolean // eslint-disable-line react/require-default-props
}

const Button = ({
  type = 'button',
  onClick,
  children,
  className,
  style,
  disabled = false,
  ...rest
}: ButtonProps) => {
  const combinedClassName = className ? `button ${className}` : 'button'

  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type || 'button'}
      onClick={onClick}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      className={combinedClassName}
      style={style}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
