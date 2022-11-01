import { ToastOptions } from 'react-toastify'

/* eslint-disable import/prefer-default-export */
export const isDev = process.env.NODE_ENV !== 'production'

export const toastOptions: ToastOptions = {
  delay: 0, // Somehow this prevents a react-toastify error
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'dark',
  className: 'toast-message'
}
