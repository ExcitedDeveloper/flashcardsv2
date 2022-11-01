import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import CueCard from '../types/cueCard'

// Define a type for the slice state
interface CueCardsState {
  cueCards: CueCard[]
}

// Define the initial state using that type
const initialState: CueCardsState = {
  cueCards: []
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
    },
    deleteCueCard: (state, action: PayloadAction<string>) => {
      state.cueCards = state.cueCards.filter(
        (card) => card.id !== action.payload
      )
    }
  }
})

export const { loadCueCards, addCueCard, deleteCueCard } = cueCardsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCueCards = (state: RootState) => state.cueCards.cueCards

export default cueCardsSlice.reducer
