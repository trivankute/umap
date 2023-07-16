import { SearchResult } from "@/types/Types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type RoutingState = {
    state: string,
    source: "readyToSet"|SearchResult | null,
    destination: "readyToSet"|SearchResult | null,
    direction: number[][]|null
}

const initialState : RoutingState = {
    state: '',
    source: null,
    destination: null,
    direction: null
}

export const routingSlice = createSlice({
    name: "routing",
    initialState,
    reducers: {
        setState: (state, action: PayloadAction<string>) => {
            state.state = action.payload
        },
        setSource: (state, action: PayloadAction<SearchResult|null|"readyToSet">) => {
            state.source = action.payload
        },
        setDestination: (state, action: PayloadAction<SearchResult|null|"readyToSet">) => {
            state.destination = action.payload
        },
        setDirection: (state, action: PayloadAction<number[][]|null>) => {
            state.direction = action.payload
        }
    }
})

export const {setState, setSource, setDestination, setDirection} = routingSlice.actions
export default routingSlice.reducer;