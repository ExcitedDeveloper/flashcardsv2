import { toast } from 'react-toastify'
import { toastOptions } from './util'

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  FILE_OPERATION = 'FILE_OPERATION',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType
  message: string
  details?: string
}

export const createError = (
  type: ErrorType,
  message: string,
  details?: string
): AppError => ({
  type,
  message,
  details
})

export const handleError = (
  error: AppError | Error | string,
  showToast = true
): void => {
  let message: string

  if (typeof error === 'string') {
    message = error
  } else if (error instanceof Error) {
    message = error.message
    // eslint-disable-next-line no-console
    console.error('Error:', error)
  } else {
    message = error.message
    // eslint-disable-next-line no-console
    console.error(`${error.type} Error:`, error.message, error.details)
  }

  if (showToast) {
    toast.error(message, toastOptions)
  }
}

export const logError = (error: AppError | Error, context?: string): void => {
  const timestamp = new Date().toISOString()
  const contextInfo = context ? ` [${context}]` : ''

  if (error instanceof Error) {
    // eslint-disable-next-line no-console
    console.error(
      `${timestamp}${contextInfo} Error:`,
      error.message,
      error.stack
    )
  } else {
    // eslint-disable-next-line no-console
    console.error(
      `${timestamp}${contextInfo} ${error.type} Error:`,
      error.message,
      error.details
    )
  }
}
