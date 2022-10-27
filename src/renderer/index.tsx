import { createRoot } from 'react-dom/client'
// import fs from 'fs'
import { toast } from 'react-toastify'
import { Channels } from '../main/util'
import { toastOptions } from './util'
import App from './App'

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(<App />)

// calling IPC exposed from preload script
window.electron.ipcRenderer.once(Channels.IpcExample, (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg)
})
window.electron.ipcRenderer.sendMessage(Channels.IpcExample, ['ping'])

window.electron.ipcRenderer.on(Channels.ImportFile, (importFilePath) => {
  if (!importFilePath) {
    toast('The import file path is not valid.', toastOptions)
    return
  }

  toast(`File was successfully imported.`, toastOptions)
  // fs.readFile(importFilePath)
})
