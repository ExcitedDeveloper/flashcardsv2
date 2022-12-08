import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { Channels } from './util'

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args)
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args)
      ipcRenderer.on(channel.toString(), subscription)

      return () => {
        ipcRenderer.removeListener(channel.toString(), subscription)
      }
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args))
    }
  },
  store: {
    get(key: string) {
      return ipcRenderer.sendSync('electron-store-get', key)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(property: any, val: any) {
      ipcRenderer.send('electron-store-set', property, val)
    }
  }
})

contextBridge.exposeInMainWorld('fileApi', {
  importFile: () => ipcRenderer.invoke('dialog:import')
})
