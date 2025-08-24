import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { ReactElement } from 'react'
import cueCardsReducer, { CueCardsState } from '../../redux/cueCards'
import CueCard from '../../renderer/types/cueCard'

// Get reference to the electron mock that was set up in setup.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockElectron = (window as any).electron

// Test data factory
export const createMockCueCard = (
  overrides: Partial<CueCard> = {}
): CueCard => ({
  id: 'test-id-1',
  question: 'Test question',
  answer: 'Test answer',
  history: '',
  ...overrides
})

export const createMockCueCards = (count: number): CueCard[] =>
  Array.from({ length: count }, (_, index) =>
    createMockCueCard({
      id: `test-id-${index + 1}`,
      question: `Test question ${index + 1}`,
      answer: `Test answer ${index + 1}`,
      history: index % 2 === 0 ? 'YYN' : 'NNY'
    })
  )

// Create mock store with initial state
export const createMockStore = (initialState?: Partial<CueCardsState>) => {
  const defaultState: CueCardsState = {
    cueCards: [],
    isDirty: false,
    filePath: undefined,
    shouldScroll: undefined,
    studyMode: undefined,
    studyCueCardIndex: undefined,
    ...initialState
  }

  return configureStore({
    reducer: {
      cueCards: cueCardsReducer
    },
    preloadedState: {
      cueCards: defaultState
    }
  })
}

// Custom render function with providers
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: Partial<CueCardsState>
  initialRoute?: string
  withRouter?: boolean
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    initialState,
    initialRoute = '/',
    withRouter = false,
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  const store = createMockStore(initialState)

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      {withRouter ? (
        <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
      ) : (
        children
      )}
    </Provider>
  )

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  }
}

// Mock implementations for common operations
export const mockElectronAPI = {
  reset: () => {
    jest.clearAllMocks()
  },
  sendMessage: mockElectron?.ipcRenderer?.sendMessage || jest.fn()
}

export default renderWithProviders
