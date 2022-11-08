import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const APP_NAME = 'Flashcards'
const DFLT_FILENAME = 'Untitled'

// Define a type for the slice state
interface FileState {
  fileName: string
  isDirty: boolean
  displayFileName: string
}

// Define the initial state using that type
const initialState: FileState = {
  fileName: `${DFLT_FILENAME} - ${APP_NAME}`,
  isDirty: false,
  displayFileName: `${DFLT_FILENAME} - ${APP_NAME}`
}

export const fileSlice = createSlice({
  name: 'file',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openFile: (state, action: PayloadAction<string>) => {
      state.fileName = action.payload
      state.displayFileName = `${action.payload} - ${APP_NAME}`
    },
    setDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload
      state.displayFileName = `${state.fileName}${
        action.payload ? '*' : null
      } - ${APP_NAME}`
    }
  }
})

export const { openFile, setDirty } = fileSlice.actions

export default fileSlice.reducer
