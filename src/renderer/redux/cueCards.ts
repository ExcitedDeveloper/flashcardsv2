import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import CueCard from '../types/cueCard'
import { ScrollAction } from '../types/scroll'

// Define a type for the slice state
export interface CueCardsState {
  cueCards: CueCard[]
  shouldScroll?: ScrollAction
}

// Define the initial state using that type
const initialState: CueCardsState = {
  cueCards: [],
  shouldScroll: undefined
}

export const cueCardsSlice = createSlice({
  name: 'cueCards',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    loadCueCards: (state, action: PayloadAction<CueCard[]>) => {
      state.cueCards = [...action.payload]
    },
    addCueCard: (state, action: PayloadAction<CueCard>) => {
      state.cueCards = [...state.cueCards, action.payload]
      state.shouldScroll = ScrollAction.Bottom
    },
    deleteCueCard: (state, action: PayloadAction<string>) => {
      state.cueCards = state.cueCards.filter(
        (card) => card.id !== action.payload
      )
    },
    clearScrollAction: (state) => {
      state.shouldScroll = undefined
    }
  }
})

export const { loadCueCards, addCueCard, deleteCueCard, clearScrollAction } =
  cueCardsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCueCards = (state: RootState) => state.cueCards.cueCards

export default cueCardsSlice.reducer
