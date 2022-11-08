import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import CueCard from '../types/cueCard'
import { ScrollAction } from '../types/scroll'

const APP_NAME = 'Flashcards'
const DFLT_FILENAME = 'Untitled'

// Define a type for the slice state
export interface CueCardsState {
  fileName: string
  isDirty: boolean
  displayFileName: string
  cueCards: CueCard[]
  shouldScroll?: ScrollAction
}

// Define the initial state using that type
const initialState: CueCardsState = {
  cueCards: [],
  shouldScroll: undefined,
  fileName: `${DFLT_FILENAME} - ${APP_NAME}`,
  isDirty: false,
  displayFileName: `${DFLT_FILENAME} - ${APP_NAME}`
}

const getDisplayFileName = (fileName: string, isDirty: boolean): string => {
  return `${fileName}${isDirty ? '*' : ''} - ${APP_NAME}`
}

export const cueCardsSlice = createSlice({
  name: 'cueCards',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openFile: (state, action: PayloadAction<string>) => {
      state.fileName = action.payload
      state.displayFileName = getDisplayFileName(action.payload, false)
      state.isDirty = false
    },
    setDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload
      state.displayFileName = getDisplayFileName(state.fileName, action.payload)
    },
    loadCueCards: (state, action: PayloadAction<CueCard[]>) => {
      state.cueCards = [...action.payload]
      state.isDirty = false
      state.displayFileName = getDisplayFileName(DFLT_FILENAME, false)
    },
    addCueCard: (state, action: PayloadAction<CueCard>) => {
      state.cueCards = [...state.cueCards, action.payload]
      state.shouldScroll = ScrollAction.Bottom
      state.isDirty = true
      state.displayFileName = getDisplayFileName(state.fileName, true)
    },
    deleteCueCard: (state, action: PayloadAction<string>) => {
      state.cueCards = state.cueCards.filter(
        (card) => card.id !== action.payload
      )
      state.isDirty = true
      state.displayFileName = getDisplayFileName(state.fileName, true)
    },
    clearScrollAction: (state) => {
      state.shouldScroll = undefined
    }
  }
})

export const {
  openFile,
  setDirty,
  loadCueCards,
  addCueCard,
  deleteCueCard,
  clearScrollAction
} = cueCardsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCueCards = (state: RootState) => state.cueCards.cueCards

export default cueCardsSlice.reducer
