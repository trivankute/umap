import { createSlice, PayloadAction } from "@reduxjs/toolkit"


export const specialSlice = createSlice({
    name: "popup",
    initialState: {
        special: false,
        eventBeginning: false,
        teller: false,
        paragraph: []
    },
    reducers: {
        turnOnSpecial: (state) => {
            state.special = true
        },
        turnOnTeller: (state, action: PayloadAction<string>) => {
            // @ts-ignore
            state.teller = action.payload
        },
        turnOnEventBeginning: (state) => {
            state.eventBeginning = true
        },
        turnOffEventBeginning: (state) => {
            state.eventBeginning = false
        },
        turnOffTeller: (state) => {
            state.teller = false
        },
        setParagraph: (state, action: PayloadAction<string[]>) => {
            // @ts-ignore
            state.paragraph = action.payload
        },

    }
})

export const {
    turnOnSpecial,
    turnOnEventBeginning,
    turnOffEventBeginning,
    turnOnTeller,
    turnOffTeller,
    setParagraph
} = specialSlice.actions

export default specialSlice.reducer;