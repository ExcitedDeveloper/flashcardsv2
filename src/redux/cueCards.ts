import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import CueCard, { OpenFileInfo } from '../renderer/types/cueCard'
import { ScrollAction } from '../renderer/types/scroll'
import { updateHistory } from '../renderer/util/scoring'

export enum StudyStatus {
  Question,
  Answer
}

// Define a type for the slice state
export interface CueCardsState {
  filePath?: string
  isDirty: boolean
  cueCards: CueCard[]
  shouldScroll?: ScrollAction
  studyMode?: StudyStatus
  studyCueCardIndex?: number
}

// Define the initial state using that type
const initialState: CueCardsState = {
  cueCards: [],
  shouldScroll: undefined,
  filePath: undefined,
  isDirty: false,
  studyMode: undefined,
  studyCueCardIndex: undefined
}

export const cueCardsSlice = createSlice({
  name: 'cueCards',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload
    },
    loadCueCards: (state, action: PayloadAction<CueCard[]>) => {
      state.cueCards = [...action.payload]
      state.isDirty = true
      state.studyMode = undefined
      state.filePath = undefined
    },
    newFile: (state) => {
      state.cueCards = []
      state.filePath = undefined
      state.isDirty = false
      state.studyMode = undefined
    },
    openFile: (state, action: PayloadAction<OpenFileInfo>) => {
      state.cueCards = [...action.payload.cueCards]
      state.filePath = action.payload.filePath
      state.isDirty = false
      state.studyMode = undefined
    },
    addCueCard: (state, action: PayloadAction<CueCard>) => {
      state.cueCards = [...state.cueCards, action.payload]
      state.shouldScroll = ScrollAction.Bottom
      state.isDirty = true
    },
    editCueCard: (state, action: PayloadAction<CueCard>) => {
      state.cueCards = state.cueCards.map((card) =>
        card.id === action.payload.id ? action.payload : card
      )
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
    },
    resetScores: (state) => {
      state.cueCards = state.cueCards.map((card) => ({
        ...card,
        history: '',
        score: ''
      }))
      state.isDirty = true
    },
    setStudyMode: (state, action: PayloadAction<StudyStatus | undefined>) => {
      state.studyMode = action.payload
    },
    startStudying: (state) => {
      state.studyMode = StudyStatus.Question
      state.studyCueCardIndex = 0
    },
    answerQuestion: (state, action: PayloadAction<boolean>) => {
      state.studyMode = StudyStatus.Question
      state.cueCards = state.cueCards.map((card, index) => {
        if (index === state.studyCueCardIndex) {
          return {
            ...card,
            history: updateHistory(card.history, action.payload)
          }
        }
        return card
      })
      state.studyCueCardIndex =
        state.studyCueCardIndex === undefined ||
        state.studyCueCardIndex + 1 >= state.cueCards.length
          ? undefined
          : state.studyCueCardIndex + 1
      state.isDirty = true
    }
  }
})

export const {
  newFile,
  openFile,
  setDirty,
  loadCueCards,
  addCueCard,
  editCueCard,
  deleteCueCard,
  clearScrollAction,
  saveFile,
  resetScores,
  setStudyMode,
  startStudying,
  answerQuestion
} = cueCardsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCueCards = (state: RootState) => state.cueCards.cueCards

export default cueCardsSlice.reducer
