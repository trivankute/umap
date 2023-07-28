import { configureStore } from "@reduxjs/toolkit";
import routingReducer from "./slices/routingSlice";
import searchReducer from "./slices/searchSlice";
import popupReducer from "./slices/popupSlice"
import loadingReducer from "./slices/loadingSlice"

export const store = configureStore({
    reducer: {
        routing: routingReducer,
        loading: loadingReducer,
        search: searchReducer,
        popup: popupReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch