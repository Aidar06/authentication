import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    items: [],
    loading: false,
    error: null,
    loadingAdd: false,
    errorAdd: null,
    selectedUser: null,
};

// API URL
const API_URL = "https://x8ki-letl-twmt.n7.xano.io/api:X8-e2j1w/users";


export const getUsers = createAsyncThunk(
    "users/getAll",
    async () => {
        const res = await axios.get(API_URL);
        return res.data;
    }
);

export const getUserById = createAsyncThunk(
    "users/getById",
    async (id) => {
        const res = await axios.get(`${API_URL}/${id}`);
        return res.data;
    }
);

export const addUser = createAsyncThunk(
    "users/add",
    async (user) => {
        const res = await axios.post(API_URL, user);
        return res.data;
    }
);

export const updateUser = createAsyncThunk(
    "users/update",
    async (user) => {
        const res = await axios.patch(`${API_URL}/${user.id}`, user);
        return res.data;
    }
);

export const deleteUser = createAsyncThunk(
    "users/delete",
    async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    }
);


const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // getUsers
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Ошибка загрузки пользователей";
            })

            // addUser
            .addCase(addUser.pending, (state) => {
                state.loadingAdd = true;
                state.errorAdd = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loadingAdd = false;
                state.items.push(action.payload);
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loadingAdd = false;
                state.errorAdd = action.error.message || "Ошибка добавления пользователя";
            })

            // getUserById
            .addCase(getUserById.fulfilled, (state, action) => {
                state.selectedUser = action.payload;
            })

            // deleteUser
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.items = state.items.filter((u) => u.id !== action.payload);
            });
    },
});

export default usersSlice.reducer;
