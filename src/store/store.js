import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice.js";
import isAuth from "./isAuth.js";

export const store = configureStore({
    reducer: {
        users: usersReducer,
        isAuth: isAuth,
    },
});


