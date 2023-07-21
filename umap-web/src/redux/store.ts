import { configureStore } from "@reduxjs/toolkit";
import  routingReducer from "./slices/routingSlice";
import  searchReducer from "./slices/searchSlice";
import loadingReducer from "./slices/loadingSlice";

export const store = configureStore({
    reducer: {
        routing: routingReducer,
        search: searchReducer,
        loading: loadingReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch