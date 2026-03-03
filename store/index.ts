import { configureStore } from "@reduxjs/toolkit";
import habitosReducer from "./slices/habitosSlice";

export const store = configureStore({
  reducer: {
    habitos: habitosReducer,
  },
});

// Tipos para TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;