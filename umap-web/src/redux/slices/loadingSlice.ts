import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type loadingState = {
    stateMenu: null|'start'|'end',
    directionState: boolean,
    startPointState: boolean,
    endPointState: boolean,
}

const initialState : loadingState = {
    stateMenu: null,
    directionState: false,
    startPointState: false,
    endPointState: false
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
        },
        setStartPointState: (state, action: PayloadAction<boolean>) => {
            state.startPointState = action.payload
        },
        setEndPointState: (state, action: PayloadAction<boolean>) => {
            state.endPointState = action.payload
        }
    }
})

export const {
    setStateMenu, 
    setDirectionState, 
    setStartPointState, 
    setEndPointState
} = loadingSlice.actions
export default loadingSlice.reducer;