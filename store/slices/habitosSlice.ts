import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchHabits, markAsDone, createHabit } from "../api/habitAPI";

export type Habit = {
    _id: string;
    title: string;
    nombre?: string; // For backward compatibility if needed
    description: string;
    createdAt: string;
    days: number;
    lastDone: Date;
    lastUpdate: Date;
}

export type HabitState = {
    habitos: Habit[], // renamed to habitos to match index.ts layout
    status: Record<string, "idle" | "loading" | "success" | "failed">,
    error: Record<string, string | null>;
    loading: boolean;
}

const initialState: HabitState = {
    habitos: [],
    status: {},
    error: {},
    loading: false,
}

type markAsDoneThunkParmas = {
    habitId: string, 
}

export const fetchHabitosThunk = createAsyncThunk("habit/fetchHabits", async () => {
    return await fetchHabits();
});

export const createHabitThunk = createAsyncThunk(
    "habit/createHabit", 
    async (habitData: { title: string, description: string }, { rejectWithValue }) => {
        try {
            const newHabit = await createHabit(habitData);
            return newHabit; // Backend should return the created habit JSON representation
        } catch (error: any) {
             return rejectWithValue(error.message);
        }
    }
);

export const markAsDoneThunk = createAsyncThunk("habit/markAsDone", async ({habitId}:markAsDoneThunkParmas, { rejectWithValue }) => {
    
    const responseJson = await markAsDone(habitId);
    console.log(responseJson);

    // If backend is bypassed, it returns { message: "Habit marked as done" }
    if (responseJson.message === "Habit marked as done") {
        return "Habito marcado como hecho";
    } else if (responseJson.message === "Habit restarted") {
        return rejectWithValue(responseJson.message);
    } else {
        return "Habit operation success"; // In case the message varies
    }
});

const habitSlice = createSlice({
    name: "habits",
    initialState,
    reducers: {
        addHabits: (state, action) => {
            state.habitos = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchHabitosThunk.pending, (state) => {
            state.loading = true;
        }).addCase(fetchHabitosThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.habitos = action.payload;
        }).addCase(fetchHabitosThunk.rejected, (state) => {
            state.loading = false;
        }).addCase(markAsDoneThunk.fulfilled, (state, action) => {
            state.status[action.meta.arg.habitId] = "success";
            state.error[action.meta.arg.habitId] = null;
            
            // Increment the days streak locally for the UI (very useful when backend bypass is active)
            const habit = state.habitos.find(h => h._id === action.meta.arg.habitId);
            if (habit) {
                 habit.days = (habit.days || 0) + 1;
            }
        }).addCase(markAsDoneThunk.rejected, (state, action) => {  
            state.status[action.meta.arg.habitId] = "failed";
            state.error[action.meta.arg.habitId] = action.payload as string;
        }).addCase(createHabitThunk.fulfilled, (state, action) => {
             // Append new habit to the end or start of state.habitos list
             state.habitos.push(action.payload);
        });
    }
});

export const { addHabits } = habitSlice.actions;
export default habitSlice.reducer;
