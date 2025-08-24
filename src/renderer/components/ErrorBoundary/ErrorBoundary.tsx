import React, { Component, ErrorInfo, ReactNode } from 'react'
import { logError, createError, ErrorType } from '../../util/errorHandling'
import Button from '../Button/Button'
import './ErrorBoundary.css'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false
    }
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    logError(
      createError(ErrorType.UNKNOWN, error.message, error.stack),
      'ErrorBoundary'
    )
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    window.location.reload()
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  public render() {
    const { hasError, error, errorInfo } = this.state
    const { fallback, children } = this.props

    if (hasError) {
      if (fallback) {
        return fallback
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h1>Something went wrong</h1>
            <p>
              We&apos;re sorry, but something unexpected happened. Please try
              one of the following:
            </p>

            <div className="error-boundary-actions">
              <Button
                onClick={this.handleReset}
                className="error-boundary-button"
              >
                Try Again
              </Button>
              <Button
                onClick={this.handleReload}
                className="error-boundary-button"
              >
                Reload Application
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && error && (
              <details className="error-boundary-details">
                <summary>Error Details (Development Mode)</summary>
                <div className="error-boundary-error">
                  <strong>Error:</strong> {error.toString()}
                </div>
                {errorInfo?.componentStack && (
                  <div className="error-boundary-stack">
                    <strong>Component Stack:</strong>
                    <pre>{errorInfo.componentStack}</pre>
                  </div>
                )}
                {error.stack && (
                  <div className="error-boundary-stack">
                    <strong>Error Stack:</strong>
                    <pre>{error.stack}</pre>
                  </div>
                )}
              </details>
            )}
          </div>
        </div>
      )
    }

    return children
  }
}

export default ErrorBoundary
