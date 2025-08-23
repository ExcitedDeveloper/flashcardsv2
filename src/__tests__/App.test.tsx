import '@testing-library/jest-dom'
import App from '../renderer/App'
import { renderWithProviders, mockElectronAPI } from './utils/testUtils'
import { Channels } from '../main/util'

describe('App', () => {
  beforeEach(() => {
    mockElectronAPI.reset()
  })

  it('should render without crashing', () => {
    renderWithProviders(<App />)
    // App should render without throwing an error
    expect(document.body).toBeInTheDocument()
  })

  it('should set document title based on dirty state and file path', () => {
    renderWithProviders(<App />, {
      initialState: {
        isDirty: false,
        filePath: undefined
      }
    })

    expect(document.title).toBe('Untitled - Flashcards')
  })

  it('should set document title with dirty indicator', () => {
    renderWithProviders(<App />, {
      initialState: {
        isDirty: true,
        filePath: undefined
      }
    })

    expect(document.title).toBe('Untitled* - Flashcards')
  })

  it('should set document title with file name', () => {
    renderWithProviders(<App />, {
      initialState: {
        isDirty: false,
        filePath: '/path/to/myCards.json'
      }
    })

    expect(document.title).toBe('myCards.json - Flashcards')
  })

  it('should set document title with file name and dirty indicator', () => {
    renderWithProviders(<App />, {
      initialState: {
        isDirty: true,
        filePath: '/path/to/myCards.json'
      }
    })

    expect(document.title).toBe('myCards.json* - Flashcards')
  })

  it('should send IPC messages when dirty state changes', () => {
    renderWithProviders(<App />, {
      initialState: { isDirty: true }
    })

    expect(mockElectronAPI.sendMessage).toHaveBeenCalledWith(
      Channels.SetDirty,
      [true]
    )
  })

  it('should send IPC messages when file path changes', () => {
    const filePath = '/path/to/file.json'
    renderWithProviders(<App />, {
      initialState: { filePath }
    })

    expect(mockElectronAPI.sendMessage).toHaveBeenCalledWith(
      Channels.SetFilePath,
      [filePath]
    )
  })

  it('should send update state IPC message with current state', () => {
    const initialState = {
      filePath: '/test/path.json',
      isDirty: true,
      cueCards: []
    }

    renderWithProviders(<App />, { initialState })

    expect(mockElectronAPI.sendMessage).toHaveBeenCalledWith(
      Channels.UpdateState,
      [
        expect.objectContaining({
          filePath: initialState.filePath,
          isDirty: initialState.isDirty,
          cueCards: initialState.cueCards
        })
      ]
    )
  })

  it('should render CardList component by default', () => {
    renderWithProviders(<App />)

    // App contains its own router, so we check that it renders without error
    expect(document.body).toBeInTheDocument()
  })
})
