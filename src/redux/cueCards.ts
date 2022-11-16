import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import CueCard from '../renderer/types/cueCard'
import { ScrollAction } from '../renderer/types/scroll'

// Define a type for the slice state
export interface CueCardsState {
  filePath?: string
  isDirty: boolean
  cueCards: CueCard[]
  shouldScroll?: ScrollAction
}

// Define the initial state using that type
const initialState: CueCardsState = {
  cueCards: [],
  shouldScroll: undefined,
  filePath: undefined,
  isDirty: false
}

export const cueCardsSlice = createSlice({
  name: 'cueCards',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openFile: (state, action: PayloadAction<string>) => {
      state.filePath = action.payload
      state.isDirty = false
    },
    setDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload
    },
    loadCueCards: (state, action: PayloadAction<CueCard[]>) => {
      state.cueCards = [...action.payload]
      state.isDirty = false
    },
    addCueCard: (state, action: PayloadAction<CueCard>) => {
      state.cueCards = [...state.cueCards, action.payload]
      state.shouldScroll = ScrollAction.Bottom
      state.isDirty = true
    },
    deleteCueCard: (state, action: PayloadAction<string>) => {
      state.cueCards = state.cueCards.filter(
        (card) => card.id !== action.payload
      )
      state.isDirty = true
    },
    clearScrollAction: (state) => {
      state.shouldScroll = undefined
    },
    saveFile: (state, action: PayloadAction<string>) => {
      state.filePath = action.payload
      state.isDirty = false
    }
  }
})

export const {
  openFile,
  setDirty,
  loadCueCards,
  addCueCard,
  deleteCueCard,
  clearScrollAction,
  saveFile
} = cueCardsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCueCards = (state: RootState) => state.cueCards.cueCards

export default cueCardsSlice.reducer
