import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface FileState {
  fileName?: string
  isDirty: boolean
}

// Define the initial state using that type
const initialState: FileState = {
  fileName: undefined,
  isDirty: false
}

export const fileSlice = createSlice({
  name: 'file',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openFile: (state, action: PayloadAction<string>) => {
      state.fileName = action.payload
    },
    setDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload
    }
  }
})

export const { openFile, setDirty } = fileSlice.actions

export default fileSlice.reducer
