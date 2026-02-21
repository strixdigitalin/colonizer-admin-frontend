import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isLoading: false,
    status: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        add(state, action) {
            state.user = action.payload;
        },
        addOne(state, action) {
            state.user = [action.payload, ...state.user];
        },
        update(state, action) {
            state.user = state.user.map(item => item.id === action.payload.id ? action.payload : item);
        },
        remove(state, action) {
            state.user = state.user.filter(item => item.id !== action.payload);
        },
        loading(state, action) {
            state.isLoading = action.payload;
        }
    }
});

export const { add, remove, addOne, update, loading } = authSlice.actions;

export default authSlice.reducer;