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
        setPopUp: (state, action: PayloadAction<any>) => {
            state.popup = action.payload
        }
    }
})

export const {
    popupShowed,
    setPopUp
} = popupSlice.actions

export default popupSlice.reducer;