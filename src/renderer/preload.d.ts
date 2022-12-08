import { Channels } from '../main/util'

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void
        on(
          channel: Channels,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined
        once(channel: Channels, func: (...args: unknown[]) => void): void
      }
      store: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        get: (key: string) => any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        set: (key: string, val: any) => void
      }
    }
  }
}

export {}
