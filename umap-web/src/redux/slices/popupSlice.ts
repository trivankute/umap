import { SearchResult } from "@/types/Types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type Popup = {
    position: [number, number],
    content: string
} 

interface PopupState {
    popup: Popup | null
}

const initialState : PopupState = {popup : null}

export const popupSlice = createSlice({
    name: "popup",
    initialState,
    reducers: {
        popupShowed: (state, action: PayloadAction<Popup>) => {
            state.popup = {...action.payload}
        },
        routeItemBlurred: (state) => {
            // state.directionInfor = state.directionInfor.map((item : any) => ({...item, hovered: false}))
            // state.popupCoors = null
        },
        // routeClicked: (state, action: PayloadAction<{position: [number, number], content: string}>) => {

        //     state.popupCoors = {...action.payload}
        // }
    }
})

export const {
    popupShowed, 
    routeItemBlurred,
    // routeClicked
} = popupSlice.actions

export default popupSlice.reducer;