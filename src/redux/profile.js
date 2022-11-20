/* eslint-disable */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";
import ErrorHandler from "../utility/ErrorHandler"
axios.defaults.withCredentials = true;

// Perform add workspace API
export const createProfile = createAsyncThunk(
    "profiles/create",
    async (payload, thunkAPI) => {
        try {
            thunkAPI.dispatch(setLoading(true));
            thunkAPI.dispatch(setErrors({}));
            const response = await axios.post(
                `${process.env.REACT_APP_API_ENDPOINT}/api/profiles`,
                payload,
            );
            toast.success(response.data.message);
        } catch (e) {
            toast.error(e.response.data.message);
            if (e.response.data?.errors) thunkAPI.dispatch(setErrors(e.response.data.errors));
        }finally{
            thunkAPI.dispatch(setLoading(false));
        }
    }
);

// prettier-ignore
export const callProfileSlice = createSlice({
    name: "profiles",
    initialState: {
        profiles: [],
        loading: false,
        total: 0,
        currentPage: 1,
        rowsPerPage: 50,
        selectedProfile: null,
        errors: new ErrorHandler()
    },
    reducers: {
        storeCurrentPage: (state, action) => {
            state.currentPage = action.payload.currentPage
        },
        storeRowsPerPage: (state, action) => {
            state.rowsPerPage = action.payload.rowsPerPage
        },
        setLoading: (state, { payload }) => {
            state.loading = payload
        },
        setErrors: (state, {payload}) => {
            state.errors.setErrors(payload);
        }
    }
});

export const {
    storeCurrentPage,
    storeRowsPerPage,
    setLoading,
    setErrors
} = callProfileSlice.actions;

export default callProfileSlice.reducer;
