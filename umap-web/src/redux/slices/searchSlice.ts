import { SearchResult } from "@/types/Types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
    addressList: SearchResult[]|null,
    address: SearchResult|null,
    select: boolean
}

const initialState : InitialState = {
    addressList: null,
    address: null,
    select: false
}

export const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setAddressList: (state, action: PayloadAction<SearchResult[]|null>) => {
            state.addressList = action.payload
        },
        setAddress: (state, action: PayloadAction<SearchResult|null>) => {
            state.address = action.payload
        },
        setSelect: (state, action: PayloadAction<boolean>) => {
            state.select = action.payload
        },
    }
})

export default searchSlice.reducer;
export const {setAddressList, setAddress, setSelect} = searchSlice.actions