export interface BaseEntity {
  id: string
}

export interface FileOperation {
  success: boolean
  message?: string
  filePath?: string
}

export interface ComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface FormData {
  [key: string]: string | number | boolean
}

export interface UIState {
  isLoading: boolean
  error?: string
}

export enum ActionStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
