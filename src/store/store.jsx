import { configureStore } from "@reduxjs/toolkit";

import authReducer from './authSlice';
import userSlice from "./userSlice";
import homeSlice from "./homeSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userSlice,
        home: homeSlice,
    }
});

export default store;