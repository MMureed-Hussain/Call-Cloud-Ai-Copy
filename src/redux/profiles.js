/* eslint-disable */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";
import ErrorHandler from "../utility/ErrorHandler"
axios.defaults.withCredentials = true;

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
            return {
                data: response.data.data
            };
        } catch (e) {
            toast.error(e.response.data.message);
            if (e.response.data?.errors) thunkAPI.dispatch(setErrors(e.response.data.errors));
            return {
                data: null
            };
        } finally {
            thunkAPI.dispatch(setLoading(false));
        }
    }
);

export const updateProfile = createAsyncThunk(
    "profiles/update",
    async ({ payload, id }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(setErrors({}));
            const response = await axios.put(
                `${process.env.REACT_APP_API_ENDPOINT}/api/profiles/${id}`,
                payload,
            );
            toast.success(response.data.message);
            return {
                data: response.data.data
            };
        } catch (e) {
            toast.error(e.response.data.message);
            if (e.response.data?.errors) dispatch(setErrors(e.response.data.errors));
            return {
                data: null
            };
        } finally {
            dispatch(setLoading(false));
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

export const getProfile = createAsyncThunk(
    "profiles/find",
    async ({ params, id }, { dispatch }) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_ENDPOINT}/api/profiles/${id}`,
                {
                    params
                }
            );
            let profile = { ...response.data.data };
            delete profile.calls;
            dispatch(setSelectedProfile(profile));
            dispatch(setSelectedProfileCalls(response.data.data.calls));
            return {
                data: profile
            }
        } catch (e) {
            toast.error(e.response.data.message);
            return {
                data: null
            }
        }
    }
);

export const createCall = createAsyncThunk(
    "profiles/createCall",
    async ({ formData, id }, { dispatch, getState }) => {
        try {
            const state = getState();
            dispatch(setErrors({}));
            const response = await axios.post(
                `${process.env.REACT_APP_API_ENDPOINT}/api/profiles/${id}/calls`,
                formData,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data'  // multipart/form-data - as we need to upload with voice recording
                    }
                }
            );
            toast.success(response.data.message);
            const calls = [response.data.data, ...state.profiles.selectedProfileCalls]
            dispatch(setSelectedProfileCalls(calls))
            return {
                data: response.data.data
            };
        } catch (e) {
            toast.error(e.response.data.message);
            if (e.response.data?.errors) dispatch(setErrors(e.response.data.errors));
            return {
                data: null
            };
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
        selectedProfileCalls: [],
        errors: new ErrorHandler(),
        loadingProfiles: true,
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
        setSelectedProfile: (state, { payload }) => {
            state.selectedProfile = payload;
        },
        setSelectedProfileCalls: (state, { payload }) => {
            state.selectedProfileCalls = payload;
        },

    }
});

export const {
    setLoading,
    setErrors,
    setProfiles,
    setLoadingProfiles,
    setSelectedProfile,
    setSelectedProfileCalls
} = callProfileSlice.actions;

export default callProfileSlice.reducer;
