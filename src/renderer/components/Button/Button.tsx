import './Button.css'

export type ButtonTypes = 'button' | 'submit' | 'reset' | undefined

export interface ButtonProps {
  type?: ButtonTypes
  onClick: () => void
  children: React.ReactNode
  className?: string
  style?: object
}

const Button = ({
  type = 'button',
  onClick,
  children,
  className,
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
    >
      {children}
    </button>
  )
}

Button.defaultProps = {
  type: 'button',
  className: '',
  style: {}
}

export default Button
