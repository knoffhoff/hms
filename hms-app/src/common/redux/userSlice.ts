import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../types'

interface UserState {
  user: User
}

const initialState: UserState = {
  user: {
    id: '',
    lastName: '',
    firstName: '',
    emailAddress: '',
    roles: [],
    skills: [],
    imageUrl: '',
    creationDate: new Date(),
  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserState: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUserState } = userSlice.actions

export default userSlice.reducer
