import { SearchResult } from "@/types/Types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type RoutingState = {
    state: string,
    source: "readyToSet"|SearchResult | null,
    destination: "readyToSet"|SearchResult | null,
    directionInfor: any,
}

const initialState : RoutingState = {
    state: '',
    source: null,
    destination: null,
    directionInfor: null,
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
        setDirectionInfor: (state, action: PayloadAction<any>) => {
            state.directionInfor = action.payload
        },
        routeItemHovered: (state, action: PayloadAction<any>) => {
            const itemId = action.payload
            state.directionInfor = state.directionInfor.map((item : any, index : number) => {
                return (
                    index === itemId ? 
                    {...item, hovered: true} :
                    {...item, hovered: false}
                )
            })
            
        },
        routeItemBlurred: (state) => {
            state.directionInfor = state.directionInfor.map((item : any) => ({...item, hovered: false}))
        },
    }
})

export const {
    setState, 
    setSource, 
    setDestination, 
    setDirectionInfor, 
    routeItemHovered, 
    routeItemBlurred,
} = routingSlice.actions

export default routingSlice.reducer;