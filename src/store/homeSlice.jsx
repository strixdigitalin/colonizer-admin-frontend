import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dayBoard: [],
    halfMonthBoard: [],
    fullMonthBoard: [],
    pieChartData: null,
    lineChartData: [],
    isLoading: true,
    status: 'idle',
    error: null,
};

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        addDayBoard(state, action) {
            state.dayBoard = action.payload;
        },
        addHalfMonthBoard(state, action) {
            state.halfMonthBoard = action.payload;
        },
        addFullMonthBoard(state, action) {
            state.fullMonthBoard = action.payload;
        },
        addPieChartData(state, action) {
            state.pieChartData = action.payload;
        },
        addLineChartData(state, action) {
            state.lineChartData = action.payload;
        },
        loading(state, action) {
            state.isLoading = action.payload;
        }
    }
});

export const { addDayBoard, addHalfMonthBoard, addFullMonthBoard, addLineChartData, addPieChartData, loading } = homeSlice.actions;

export default homeSlice.reducer;