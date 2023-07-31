import { configureStore } from "@reduxjs/toolkit";
import routingReducer from "./slices/routingSlice";
import searchReducer from "./slices/searchSlice";
import popupReducer from "./slices/popupSlice"
import loadingReducer from "./slices/loadingSlice"
import specialReducer from "./slices/specialSlice"

export const store = configureStore({
    reducer: {
        routing: routingReducer,
        loading: loadingReducer,
        search: searchReducer,
        popup: popupReducer,
        special: specialReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch