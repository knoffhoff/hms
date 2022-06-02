import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import { Hackathon } from "../types";

interface HackathonState {
    hackathons: Hackathon[]
}

const initialState: HackathonState = {
    hackathons: [{
        id: '1234',
        title: 'Hackathon 1',
        startDate: new Date(2020, 1, 1),
        endDate: new Date(2021, 1, 1),
        participants: [],
    }]
}

export const hackathonSlice = createSlice({
    name: 'hackathon',
    initialState,
    reducers: {
        setHackathonList: (state) => {
        },
        incrementTeamByAmount: (state, action: PayloadAction<number>) => {
            console.log(action.payload)
        },
    },
})

// Action creators are generated for each case reducer function
export const { setHackathonList, incrementTeamByAmount } = hackathonSlice.actions

export default hackathonSlice.reducer