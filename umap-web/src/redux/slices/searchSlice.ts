import { SearchResult } from "@/types/Types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
    addressList: SearchResult[]|null,
    address: SearchResult|null,
    select: string|null
}

const initialState : InitialState = {
    addressList: null,
    address: null,
    select: null
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
        setSelect: (state, action: PayloadAction<string|null>) => {
            state.select = action.payload
        },
    }
})

export default searchSlice.reducer;
export const {setAddressList, setAddress, setSelect} = searchSlice.actions