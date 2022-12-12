/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path'
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import fs from 'fs'
import MenuBuilder from './menu'
import {
  resolveHtmlPath,
  Channels,
  SaveFileChoice,
  SaveType,
  displayToast
} from './util'
import { CueCardsState } from '../redux/cueCards'

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info'
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
  }
}

let mainWindow: BrowserWindow | null = null

let state: CueCardsState

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.on(Channels.UpdateState, (_event, args) => {
  state = args && args.length > 0 ? args[0] : {}
})

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

if (isDebug) {
  require('electron-debug')()
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS']

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log)
}

const handleImport = async (): Promise<string | null> => {
  if (!mainWindow) {
    console.warn('handleImport: mainWindow is null')
    return null
  }

  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Import File',
    properties: ['openFile'],
    filters: [
      {
        name: 'CueCard',
        extensions: ['wcu']
      }
    ]
  })

  return canceled ? null : filePaths[0]
}

const createWindow = async () => {
  if (isDebug) {
    await installExtensions()
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets')

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths)
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    frame: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      devTools: true
    }
  })

  mainWindow.loadURL(resolveHtmlPath('index.html'))

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize()
    } else {
      mainWindow.show()
    }
  })

  const saveFile = (saveType: SaveType) => {
    if (mainWindow === null) return

    try {
      let currFilePath: string | undefined = state.filePath

      if (!state.filePath || saveType === SaveType.SaveAs) {
        currFilePath = dialog.showSaveDialogSync(mainWindow, {
          title: 'Select the file path to save',
          buttonLabel: 'Save',
          filters: [
            {
              name: 'Flashcard Files',
              extensions: ['json']
            }
          ]
        })
      }

      if (currFilePath) {
        if (!state.cueCards || state.cueCards.length <= 0 || !currFilePath) {
          return
        }

        try {
          fs.writeFile(
            currFilePath as string,
            JSON.stringify(state.cueCards),
            (err) => {
              if (err) {
                // eslint-disable-next-line no-console
                console.error(err)
                displayToast(mainWindow!, 'Error trying to save file.')
                return
              }

              if (state.filePath !== currFilePath) {
                // The file being saved is either a new file or
                // a SaveAs
                mainWindow!.webContents.send(Channels.SaveFile, currFilePath)
              } else {
                mainWindow!.webContents.send(Channels.SetDirty, false)
              }

              displayToast(mainWindow!, 'Successfully saved file.')
            }
          )
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
          displayToast(mainWindow, 'Unknown error trying to save file.')
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      dialog.showMessageBox(mainWindow, {
        message: 'Unknown error in menu.ts::handleSave'
      })
    }
  }

  mainWindow.on('close', (e) => {
    e.preventDefault()

    let buttonIndex

    if (mainWindow && state?.filePath && state?.isDirty) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      buttonIndex = dialog.showMessageBoxSync({
        type: 'question',
        title: 'Confirmation',
        message:
          'The current file has unsaved changes.  Do you want to save them?',
        buttons: ['Yes', 'No', 'Cancel']
      })

      if (buttonIndex === SaveFileChoice.Cancel) {
        return
      }

      if (buttonIndex === SaveFileChoice.Yes) {
        saveFile(SaveType.Save)
      }
    }

    mainWindow?.destroy()
    app.quit()
  })

  mainWindow.on('closed', async () => {
    mainWindow = null
  })

  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url)
    return { action: 'deny' }
  })

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater()
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app
  .whenReady()
  .then(() => {
    ipcMain.handle('dialog:import', handleImport)
    createWindow()
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow()
    })
  })
  .catch(console.log)
