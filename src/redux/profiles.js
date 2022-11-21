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
        } finally {
            thunkAPI.dispatch(setLoading(false));
        }
    }
);

export const getProfiles = createAsyncThunk(
    "profiles/index",
    async (payload, { dispatch }) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_ENDPOINT}/api/profiles`,
                {
                    params: payload
                }
            );
            dispatch(setProfiles(response.data.data));
            dispatch(setTotalRecords(response.data.total));
            dispatch(setPageCount(response.data.last_page));
        } catch (e) {
            toast.error(e.response.data.message);
        } finally {
            dispatch(setLoadingProfiles(false));
        }
    }
);

// prettier-ignore
export const callProfileSlice = createSlice({
    name: "profiles",
    initialState: {
        profiles: [],
        loading: false,
        totalRecords: 0,
        pageCount: 0,
        selectedProfile: null,
        errors: new ErrorHandler(),
        loadingProfiles: true
    },
    reducers: {
        setLoading: (state, { payload }) => {
            state.loading = payload
        },
        setErrors: (state, { payload }) => {
            state.errors.setErrors(payload);
        },
        setProfiles: (state, { payload }) => {
            state.profiles = payload;
        },
        setTotalRecords: (state, { payload }) => {
            state.totalRecords = payload;
        },
        setPageCount: (state, { payload }) => {
            state.pageCount = payload;
        },
        setLoadingProfiles: (state, { payload }) => {
            state.loadingProfiles = payload;
        },
        
    }
});

export const {
    setLoading,
    setErrors,
    setProfiles,
    setLoadingProfiles
} = callProfileSlice.actions;

export default callProfileSlice.reducer;
