/* eslint import/prefer-default-export: off */
import { BrowserWindow } from 'electron'
import path from 'path'

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212
    const url = new URL(`http://localhost:${port}`)
    url.pathname = htmlFileName
    return url.href
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`
}

export enum Channels {
  ImportFile = 'import-file',
  DisplayToast = 'display-toast',
  LoadCueCards = 'load-cuecards',
  AddCueCard = 'add-cuecard',
  SetDirty = 'set-dirty',
  SetFilePath = 'set-filepath',
  UpdateState = 'update-state',
  SaveFile = 'save-file',
  OpenFile = 'open-file',
  ResetScores = 'reset-scores'
}

export const displayToast = (mainWindow: BrowserWindow, message: string) => {
  mainWindow.webContents.send(Channels.DisplayToast, message)
}
