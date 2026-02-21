import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    members: [],
    isLoading: true,
    status: 'idle',
    error: null,
};

const memberSlice = createSlice({
    name: 'member',
    initialState,
    reducers: {
        loading(state, action){
            state.isLoading=action.payload;
        },
        add(state, action) {
            state.members = action.payload;
        },
        addOne(state, action) {
            state.members = [action.payload, ...state.members];
        },
        update(state, action) {
            state.members = state.members.map(item => item._id === action.payload._id ? action.payload : item);
        },
        remove(state, action) {
            state.members = state.members.filter(item => item.id !== action.payload);
        }
    }
});

export const { add, remove, addOne, update, loading } = memberSlice.actions;

export default memberSlice.reducer;