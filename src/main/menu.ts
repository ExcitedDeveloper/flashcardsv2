import {
  app,
  Menu,
  BrowserWindow,
  MenuItemConstructorOptions,
  dialog,
  ipcMain
} from 'electron'
import fs from 'fs'
import { OpenFileInfo } from 'renderer/types/cueCard'
import Store from 'electron-store'
import { XMLParser } from 'fast-xml-parser'
import { v4 as uuidv4 } from 'uuid'
import { CueCardsState } from '../redux/cueCards'
import { Channels, displayToast, SaveFileChoice } from './util'
import { getFileName } from '../renderer/util/util'

const MAX_RECENTS = 5

interface RecentFile {
  label: string
  filePath: string
}

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string
  submenu?: DarwinMenuItemConstructorOptions[] | Menu
}

interface ImportCueCard {
  '@_Question': string
  '@_Answer': string
  '@_History': string
}

let filePath: string

ipcMain.on(Channels.SetFilePath, async (_event, arg) => {
  filePath = arg && arg.length > 0 ? arg[0] : ''
})

let state: CueCardsState

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.on(Channels.UpdateState, (_event, args) => {
  state = args && args.length > 0 ? args[0] : {}
})

enum SaveType {
  Save,
  SaveAs
}

export default class MenuBuilder {
  mainWindow: BrowserWindow

  store: Store<Record<string, unknown>>

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
    this.store = new Store()
  }

  saveFile(saveType: SaveType) {
    try {
      let currFilePath: string | undefined = filePath

      if (!filePath || saveType === SaveType.SaveAs) {
        currFilePath = dialog.showSaveDialogSync(this.mainWindow, {
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
                displayToast(this.mainWindow, 'Error trying to save file.')
                return
              }

              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              this.addFileToRecents(currFilePath!)

              if (state.filePath !== currFilePath) {
                // The file being saved is either a new file or
                // a SaveAs
                this.mainWindow.webContents.send(
                  Channels.SaveFile,
                  currFilePath
                )
              } else {
                this.mainWindow.webContents.send(Channels.SetDirty, false)
              }

              displayToast(this.mainWindow, 'Successfully saved file.')
            }
          )
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
          displayToast(this.mainWindow, 'Unknown error trying to save file.')
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      dialog.showMessageBox(this.mainWindow, {
        message: 'Unknown error in menu.ts::handleSave'
      })
    }
  }

  async handleSave(): Promise<void> {
    this.saveFile(SaveType.Save)
  }

  async handleSaveAs(): Promise<void> {
    this.saveFile(SaveType.SaveAs)
  }

  checkForDirtyFile(): SaveFileChoice {
    if (state.isDirty) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const buttonIndex = dialog.showMessageBoxSync({
        type: 'question',
        title: 'Confirmation',
        message:
          'The current file has unsaved changes.  Do you want to save them?',
        buttons: ['Yes', 'No', 'Cancel']
      })

      if (buttonIndex === SaveFileChoice.Yes) {
        this.handleSave()
      }

      return buttonIndex
    }

    return SaveFileChoice.NotDirty
  }

  openFile(newFilePath: string) {
    try {
      const dirtyCheck = this.checkForDirtyFile()

      if (dirtyCheck === SaveFileChoice.Cancel) {
        // There is a dirty file, but the user decided
        // to cancel
        return
      }

      fs.readFile(newFilePath, (err, data) => {
        if (err) {
          displayToast(this.mainWindow, `An error occurred while opening file.`)
          return
        }

        const json = JSON.parse(data.toString())

        displayToast(this.mainWindow, `File was successfully opened.`)

        const fileInfo: OpenFileInfo = {
          cueCards: json,
          filePath: newFilePath
        }

        // Add the file just opened to recents in localStorage
        this.addFileToRecents(fileInfo.filePath)

        this.mainWindow.webContents.send(Channels.OpenFile, fileInfo)
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`menu.ts::fileOpen`, error)
    }
  }

  async handleImport(): Promise<void> {
    try {
      const dirtyCheck = this.checkForDirtyFile()

      if (dirtyCheck === SaveFileChoice.Cancel) {
        // There is a dirty file, but the user decided
        // to cancel
        return
      }

      const { canceled, filePaths } = await dialog.showOpenDialog(
        this.mainWindow,
        {
          title: 'Import File',
          properties: ['openFile'],
          filters: [
            {
              name: 'CueCard',
              extensions: ['wcu']
            }
          ]
        }
      )

      if (canceled) {
        return
      }

      fs.readFile(filePaths[0], (err, data) => {
        if (err) {
          displayToast(
            this.mainWindow,
            `An error occurred while importing file.`
          )
          return
        }

        const parser = new XMLParser({
          ignoreAttributes: false
        })

        const json = parser.parse(data)

        const cueCards =
          json.CueCards?.Card?.map((card: ImportCueCard) => ({
            id: uuidv4(),
            question: card['@_Question'],
            answer: card['@_Answer'],
            history: card['@_History']
          })) || []

        if (!cueCards) {
          displayToast(
            this.mainWindow,
            `An error occurred while parsing import file.`
          )
          return
        }

        displayToast(this.mainWindow, `File was successfully imported.`)

        this.mainWindow.webContents.send(Channels.LoadCueCards, cueCards)
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      dialog.showMessageBox(this.mainWindow, {
        message: 'Unknown error in menu.ts::handleImport'
      })
    }
  }

  handleNewFile() {
    try {
      const dirtyCheck = this.checkForDirtyFile()

      if (dirtyCheck === SaveFileChoice.Cancel) {
        // There is a dirty file, but the user decided
        // to cancel
        return
      }

      this.mainWindow.webContents.send(Channels.NewFile)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`menu.ts::fileOpen`, error)
    }
  }

  async handleOpen(): Promise<void> {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog(
        this.mainWindow,
        {
          title: 'Open File',
          properties: ['openFile'],
          filters: [
            {
              name: 'Flashcard',
              extensions: ['json']
            }
          ]
        }
      )

      if (canceled) {
        return
      }

      fs.readFile(filePaths[0], (err, data) => {
        if (err) {
          displayToast(this.mainWindow, `An error occurred while opening file.`)
          return
        }

        const json = JSON.parse(data.toString())

        displayToast(this.mainWindow, `File was successfully opened.`)

        const fileInfo: OpenFileInfo = {
          cueCards: json,
          filePath: filePaths[0]
        }

        // Add the file just opened to recents in localStorage
        this.addFileToRecents(fileInfo.filePath)

        this.mainWindow.webContents.send(Channels.OpenFile, fileInfo)
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      dialog.showMessageBox(this.mainWindow, {
        message: 'Unknown error in menu.ts::handleOpen'
      })
    }
  }

  handleResetScores() {
    this.mainWindow.webContents.send(Channels.ResetScores)
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment()
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate()

    const menu = Menu.buildFromTemplate(
      template as MenuItemConstructorOptions[]
    )
    Menu.setApplicationMenu(menu)

    return menu
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y)
          }
        }
      ]).popup({ window: this.mainWindow })
    })
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Electron',
      submenu: [
        {
          label: 'About ElectronReact',
          selector: 'orderFrontStandardAboutPanel:'
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide ElectronReact',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    }
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        }
      ]
    }
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload()
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools()
          }
        }
      ]
    }
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
          }
        }
      ]
    }
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' }
      ]
    }

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow]
  }

  getRecents(): RecentFile[] {
    const result: RecentFile[] = this.store.get(
      'cuecards-recents'
    ) as RecentFile[]

    return result || []
  }

  addFileToRecents(newFilePath: string): RecentFile[] {
    // If filePath has back slashes, replace with
    // forward slashes.
    const fwdFilePath = newFilePath.replaceAll(/\\/g, '/')

    // Get the current array of recent files
    let recents = this.getRecents()

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

    this.store.set('cuecards-recents', recents)

    this.buildMenu()

    return recents
  }

  buildDefaultTemplate() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateDefault: any[] = [
      {
        label: '&File',
        submenu: [
          {
            label: '&New',
            accelerator: 'Ctrl+N',
            click: () => {
              this.handleNewFile()
            }
          },
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
            click: () => {
              this.handleOpen()
            }
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close()
            }
          },
          { type: 'separator' },
          {
            label: '&Save',
            accelerator: 'Ctrl+S',
            click: () => {
              this.handleSave()
            }
          },
          {
            label: '&Save As',
            accelerator: 'Ctrl+A',
            click: () => {
              this.handleSaveAs()
            }
          },
          { type: 'separator' },
          {
            label: '&Import',
            accelerator: 'Ctrl+I',
            click: async () => {
              this.handleImport()
            }
          }
        ]
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload()
                  }
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    )
                  }
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools()
                  }
                }
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    )
                  }
                }
              ]
      },
      {
        label: '&Options',
        submenu: [
          {
            label: '&Reset Scores',
            click: () => {
              this.handleResetScores()
            }
          }
        ]
      }
    ]

    const recents = this.getRecents()

    if (recents.length > 0) {
      templateDefault[0].submenu.push({ type: 'separator' })
    }

    recents.forEach((recent) => {
      templateDefault[0].submenu.push({
        label: recent.label,
        click: async () => {
          this.openFile(recent.filePath)
        }
      })
    })

    return templateDefault
  }
}
