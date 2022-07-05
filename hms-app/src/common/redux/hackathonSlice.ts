import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Hackathon, HackathonSerializable } from '../types'

interface HackathonState {
  hackathons: HackathonSerializable[]
  nextHackathon: HackathonSerializable
  lastSelectedHackathon: HackathonSerializable
}

const initialState: HackathonState = {
  hackathons: [
    {
      id: '33a892ba-8a9e-4edf-947a-f421c86a14b5',
      title: '',
      startDate: '2020-01-01T00:00:00.000Z',
      endDate: '2020-01-02T00:00:00.000Z',
      participants: [],
    },
  ],
  nextHackathon: {
    id: '33a892ba-8a9e-4edf-947a-f421c86a14b5',
    title: '',
    startDate: '2020-01-01T00:00:00.000Z',
    endDate: '2020-01-02T00:00:00.000Z',
    participants: [],
  },
  lastSelectedHackathon: {
    id: '33a892ba-8a9e-4edf-947a-f421c86a14b5',
    title: '',
    startDate: '2020-01-01T00:00:00.000Z',
    endDate: '2020-01-02T00:00:00.000Z',
    participants: [],
  },
}

export const mapHackathonToSerializable = (
  hackathon: Hackathon
): HackathonSerializable =>
  ({
    id: hackathon.id,
    title: hackathon.title,
    startDate: hackathon.startDate.toISOString(),
    endDate: hackathon.endDate.toISOString(),
    participants: hackathon.participants,
    categories: hackathon.categories,
    ideas: hackathon.ideas,
  } as HackathonSerializable)

export const hackathonSlice = createSlice({
  name: 'hackathon',
  initialState,
  reducers: {
    setHackathonList: (
      state,
      action: PayloadAction<HackathonSerializable[]>
    ) => {
      state.hackathons = action.payload
    },
    setNextHackathon: (state, action: PayloadAction<HackathonSerializable>) => {
      state.nextHackathon = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setHackathonList, setNextHackathon } = hackathonSlice.actions

export default hackathonSlice.reducer
