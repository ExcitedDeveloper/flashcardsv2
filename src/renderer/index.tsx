import { createRoot } from 'react-dom/client'
import { Channels } from '../main/util'
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

window.electron.ipcRenderer.on(Channels.ImportFile, (message) => {
  console.log(`********** import-file message`, message)
})
