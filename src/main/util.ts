/* eslint import/prefer-default-export: off */
import { BrowserWindow } from 'electron'
import path from 'path'
import { getFileName } from '../renderer/util/util'

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

export const MAX_RECENTS = 5

export interface RecentFile {
  label: string
  filePath: string
}

export const getRecents = (): RecentFile[] => {
  // const result: string = await mainWindow.webContents.executeJavaScript(
  //   'localStorage.getItem("cuecards-recents");',
  //   true
  // )
  const result: string = window.electron.store.get('cuecards-recents') as string

  return result ? JSON.parse(result) : []
}

export const addFileToRecents = (filePath: string): RecentFile[] => {
  // If filePath has back slashes, replace with
  // forward slashes.
  const fwdFilePath = filePath.replaceAll(/\\/g, '/')

  // Get the current array of recent files
  let recents = getRecents()

  // Check if fwdFilePath is already in the
  // recent files.  If it is remove it.
  recents = recents.filter((file) => file.filePath !== fwdFilePath)

  // If recents is too big, take the first
  // MAX_RECENTS minus one to leave room
  // for the new recent
  if (recents.length >= MAX_RECENTS) {
    recents = recents.slice(0, MAX_RECENTS - 1)
  }

  const fileName = getFileName(fwdFilePath)

  if (!fileName) {
    // eslint-disable-next-line no-console
    console.error('getFileName returned an invalid string.')
    return []
  }

  // Create the new recent
  const newRecent: RecentFile = {
    label: fileName,
    filePath: fwdFilePath
  }

  // Add the new recent to the front of
  // the recents array
  recents = [newRecent, ...recents]

  // Update localStorage with the updated
  // recents array
  // mainWindow.webContents.executeJavaScript(
  //   `localStorage.setItem("cuecards-recents", '${JSON.stringify(recents)}');`,
  //   true
  // )
  window.electron.store.set('cuecards-recents', recents)

  return recents
}
