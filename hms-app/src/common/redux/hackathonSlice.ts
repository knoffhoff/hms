import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Hackathon, HackathonSerializable } from '../types'

interface HackathonState {
  hackathons: HackathonSerializable[]
  lastHackathon: HackathonSerializable
  nextHackathon: HackathonSerializable
  lastSelectedHackathon: HackathonSerializable
  hackathonHeaderOpened: boolean
}

const initialState: HackathonState = {
  hackathons: [
    {
      id: '33a892ba-8a9e-4edf-947a-f421c86a14b5',
      title: 'title',
      slug: 'slug1',
      startDate: '2020-01-01T00:00:00.000Z',
      endDate: '2020-01-02T00:00:00.000Z',
      participants: [],
      votingOpened: false,
    },
  ],
  lastHackathon: {
    id: '33a892ba-8a9e-4edf-947a-f421c86a14b5',
    title: 'title',
    slug: 'slug1.5',
    startDate: '2020-01-01T00:00:00.000Z',
    endDate: '2020-01-02T00:00:00.000Z',
    participants: [],
    votingOpened: false,
  },
  nextHackathon: {
    id: '33a892ba-8a9e-4edf-947a-f421c86a14b5',
    title: 'title',
    slug: 'slug2',
    startDate: '2020-01-01T00:00:00.000Z',
    endDate: '2020-01-02T00:00:00.000Z',
    participants: [],
    votingOpened: false,
  },
  lastSelectedHackathon: {
    id: '33a892ba-8a9e-4edf-947a-f421c86a14b5',
    title: 'title',
    slug: 'slug3',
    startDate: '2020-01-01T00:00:00.000Z',
    endDate: '2020-01-02T00:00:00.000Z',
    participants: [],
    votingOpened: false,
  },
  hackathonHeaderOpened: true,
}

export const mapHackathonToSerializable = (
  hackathon: Hackathon
): HackathonSerializable =>
  ({
    id: hackathon.id,
    title: hackathon.title,
    description: hackathon.description,
    slug: hackathon.slug,
    startDate: hackathon.startDate.toISOString(),
    endDate: hackathon.endDate.toISOString(),
    participants: hackathon.participants,
    categories: hackathon.categories,
    ideas: hackathon.ideas,
    votingOpened: hackathon.votingOpened,
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
    setLastHackathon: (state, action: PayloadAction<HackathonSerializable>) => {
      state.lastHackathon = action.payload
    },
    setNextHackathon: (state, action: PayloadAction<HackathonSerializable>) => {
      state.nextHackathon = action.payload
    },
    setLastSelectedHackathon: (
      state,
      action: PayloadAction<HackathonSerializable>
    ) => {
      state.lastSelectedHackathon = action.payload
    },
    setHackathonHeaderOpened: (state, action: PayloadAction<boolean>) => {
      state.hackathonHeaderOpened = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  setHackathonList,
  setLastHackathon,
  setNextHackathon,
  setLastSelectedHackathon,
  setHackathonHeaderOpened,
} = hackathonSlice.actions

export default hackathonSlice.reducer
