import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type loadingState = {
    stateMenu: null|'start'|'end',
    directionState: boolean
}

const initialState : loadingState = {
    stateMenu: null,
    directionState: false
}

export const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        setStateMenu: (state, action: PayloadAction<any>) => {
            state.stateMenu = action.payload
        },
        setDirectionState: (state, action: PayloadAction<any>) => {
            state.directionState = action.payload
        }
    }
})

export const {setStateMenu, setDirectionState} = loadingSlice.actions
export default loadingSlice.reducer;