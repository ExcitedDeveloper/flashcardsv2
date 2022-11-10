import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { toast, ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import fs from 'fs'
import { Channels } from '../main/util'
import { toastOptions } from './util/util'
import App from './App'
import { store } from './redux/store'
import { addCueCard, loadCueCards, saveFile } from './redux/cueCards'
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

window.electron.ipcRenderer.on(Channels.SaveFile, (currFilePath: string) => {
  const { cueCards, filePath } = store.getState().cueCards

  if (!cueCards || cueCards.length <= 0) {
    return
  }

  try {
    fs.writeFile(currFilePath, JSON.stringify(cueCards), (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        toast('Error trying to save file.', toastOptions)
        return
      }

      if (currFilePath !== filePath) {
        store.dispatch(saveFile(currFilePath))
      }

      toast('Successfully saved file.', toastOptions)
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    toast('Unknown error trying to save file.', toastOptions)
  }
})
