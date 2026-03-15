import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../api/authAPI";

export type AuthState = {
    user: any | null;
    token: string | null;
    status: "idle" | "loading" | "success" | "failed";
    error: string | null;
};

// Check localStorage for initial state if running on client
const isBrowser = typeof window !== "undefined";
const initialToken = isBrowser ? localStorage.getItem("token") : null;
const initialUser = isBrowser ? JSON.parse(localStorage.getItem("user") || "null") : null;

const initialState: AuthState = {
    user: initialUser,
    token: initialToken,
    status: "idle",
    error: null,
};

export const loginThunk = createAsyncThunk("auth/login", async (credentials: any, { rejectWithValue }) => {
    try {
        const data = await loginUser(credentials);
        return data;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const registerThunk = createAsyncThunk("auth/register", async (userData: any, { rejectWithValue }) => {
    try {
        const data = await registerUser(userData);
        return data; // Assuming backend returns user and token on register too, or we can just return success msg.
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.status = "idle";
            if (isBrowser) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "success";
                state.user = action.payload.user || action.payload; // Fallback depending on specific backend response schema
                state.token = action.payload.token;
                if (isBrowser && action.payload.token) {
                    localStorage.setItem("token", action.payload.token);
                    localStorage.setItem("user", JSON.stringify(state.user));
                }
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(registerThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(registerThunk.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "success";
                // If register auto logs in:
                if (action.payload.token) {
                    state.user = action.payload.user || action.payload;
                    state.token = action.payload.token;
                    if (isBrowser) {
                        localStorage.setItem("token", action.payload.token);
                        localStorage.setItem("user", JSON.stringify(state.user));
                    }
                }
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
