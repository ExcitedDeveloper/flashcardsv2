import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { toast, ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import { Channels } from '../main/util'
import { toastOptions } from './util/util'
import App from './App'
import { store } from './redux/store'
import { addCueCard, loadCueCards } from './redux/cueCards'
import CueCard from './types/cueCard'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer />
    </Provider>
  </StrictMode>
)

// calling IPC exposed from preload script
window.electron.ipcRenderer.on(Channels.DisplayToast, (importFilePath) => {
  if (!importFilePath) {
    toast('The import file path is not valid.', toastOptions)
  }
})

window.electron.ipcRenderer.on(Channels.LoadCueCards, (cueCards) => {
  store.dispatch(loadCueCards(cueCards as CueCard[]))
})

window.electron.ipcRenderer.on(Channels.AddCueCard, (cueCard) => {
  store.dispatch(addCueCard(cueCard as CueCard))
})
