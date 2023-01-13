import { createSlice } from '@reduxjs/toolkit'

const homeFolderPathSlice = createSlice({
  name: 'homeFolderPath',
  initialState: '',
  reducers: {
    setHomeFolderPath(state, action) {
      return action.payload
    },

    resetHomeFolderPath: () => '',
  },
})

// Export actions
export const { setHomeFolderPath, resetHomeFolderPath } =
  homeFolderPathSlice.actions

// Export reducer
export default homeFolderPathSlice.reducer
