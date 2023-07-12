import { createSlice } from "@reduxjs/toolkit"
import { LatLngExpression } from "leaflet"

type Position = {
    address: string | null,
    latlng: LatLngExpression
}

type RoutingState = {
    source: Position | null,
    destination: Position | null
}

const initialState : RoutingState = {
    source: null,
    destination: null
}

export const routingSlice = createSlice({
    name: "routing",
    initialState,
    reducers: {

    }
})

export default routingSlice.reducer;