import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: { user: {} },
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    resetUser: () => ({ user: {} }),
  },
})

// Export actions
export const { setUser, resetUser } = userSlice.actions

// Export reducer
export default userSlice.reducer
