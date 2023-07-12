import { configureStore } from "@reduxjs/toolkit";
import  routingReducer from "./slices/routingSlice";

export const store = configureStore({
    reducer: {
        routing: routingReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch