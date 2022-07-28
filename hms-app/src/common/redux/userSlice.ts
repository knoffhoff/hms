import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SkillPreview, User } from '../types'

export interface UserSerializable {
  id: string
  lastName?: string
  firstName: string
  emailAddress: string
  roles: string[]
  skills: SkillPreview[]
  imageUrl?: string
  creationDate: string
}
interface UserState {
  user: UserSerializable
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
    creationDate: '2020-01-01T00:00:00.000Z',
  },
}

const mapUserToSerializable = ({
  id,
  firstName,
  lastName,
  emailAddress,
  roles,
  skills,
  imageUrl,
  creationDate,
}: User): UserSerializable => {
  const date = new Date(creationDate)
  return {
    id,
    lastName,
    firstName,
    emailAddress,
    roles,
    skills,
    imageUrl,
    creationDate: date.toISOString(),
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserState: (state, action: PayloadAction<User>) => {
      state.user = mapUserToSerializable(action.payload)
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUserState } = userSlice.actions

export default userSlice.reducer
