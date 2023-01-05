/* eslint-disable */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";
import ErrorHandler from "../utility/ErrorHandler"
axios.defaults.withCredentials = true;

export const createProfile = createAsyncThunk(
    "profiles/create",
    async (payload, { dispatch }) =>
    {
        try {
            dispatch(setLoading(true));
            dispatch(setErrors({}));
            const response = await axios.post(
                `${process.env.REACT_APP_API_ENDPOINT}/api/profiles`,
                payload,
            );
            toast.success(response.data.message);
            dispatch(setReloadTable(true));
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

export const updateProfile = createAsyncThunk(
    "profiles/update",
    async ({ payload, id }, { dispatch }) =>
    {
        try {
            dispatch(setLoading(true));
            dispatch(setErrors({}));
            const response = await axios.put(
                `${process.env.REACT_APP_API_ENDPOINT}/api/profiles/${id}`,
                payload,
            );
            toast.success(response.data.message);
            dispatch(setReloadTable(true));
            dispatch(setSelectedProfile(response.data.data))
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
    async (payload, { dispatch }) =>
    {
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
    async ({ params, id }, { dispatch }) =>
    {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_ENDPOINT}/api/profiles/${id}`,
                {
                    params
                }
            );
            dispatch(setSelectedProfile(response.data.data));
            return {
                data: response.data.data
            }
        } catch (e) {
            toast.error(e.response.data.message);
            return {
                data: null
            }
        }
    }
);

export const getCallsByProfileId = createAsyncThunk(
    "profiles/calls",
    async ({ params, id }, { dispatch }) =>
    {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_ENDPOINT}/api/profiles/${id}/calls`,
                {
                    params
                }
            );
            return {
                data: response.data
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
    async ({ formData, id }, { dispatch }) =>
    {
        try {
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
            dispatch(setReloadCallTable(true));
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
// delete 
export const deleteResource = createAsyncThunk(
    "profiles/delete",
    async (url, { dispatch }) =>
    {
        try {
            const response = await axios.delete(url);
            toast.success(response.data.message);
            dispatch(setReloadTable(true));
            return {
                data: true
            };
        } catch (e) {
            toast.error(e.response.data.message);
            return {
                data: false
            };
        }
    }
);

export const updateCall = createAsyncThunk(
    "profiles/updateCall",
    async ({ formData, id }, { dispatch }) =>
    {
        try {
            dispatch(setErrors({}));
            const response = await axios.put(
                `${process.env.REACT_APP_API_ENDPOINT}/api/profiles/update-call/${id}`,
                formData
            );
            toast.success(response.data.message);
            dispatch(setReloadCallTable(true));
            return {
                data: true
            };
        } catch (e) {
            toast.error(e.response.data.message);
            if (e.response.data?.errors) dispatch(setErrors(e.response.data.errors));
            return {
                data: false
            }
        }
    }
);


// Call Follow up section

export const getCallFollowUpsByProfileId = createAsyncThunk(
    "profiles/followups",
    async ({ params, id }, { dispatch }) =>
    {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_ENDPOINT}/api/profiles/${id}/followups`,
                {
                    params
                }
            );
            return {
                data: response.data
            }
        } catch (e) {
            toast.error(e.response.data.message);
            return {
                data: null
            }
        }
    }
);

export const storeOrUpdateCallFollowUp = createAsyncThunk(
    "profiles/storeOrUpdateCallFollowUp",
    async ({ data, id }, { dispatch }) =>
    {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/api/profiles/${id}/followups`, data);
            console.log((response.data))
            toast.success(response.data.message);
            dispatch(setReloadTable(true));
            return { data: true };
        } catch (e) {
            toast.error(e.response.data.message);
            if (e.response.data?.errors) dispatch(setErrors(e.response.data.errors));
            return { data: false };
        }
    }
);

// delete 
export const deleteCallFollowUp = createAsyncThunk(
    "profiles/deleteCallFollowUp",
    async (id, { dispatch }) =>
    {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/api/profiles/delete-followup/${id}`);
            toast.success(response.data.message);
            dispatch(setReloadTable(true));
            return {
                data: true
            };
        } catch (e) {
            toast.error(e.response.data.message);
            return {
                data: false
            };
        }
    }
);


// Call Follow-up section END Here 
// Profile Contact section
export const profileContactList = createAsyncThunk(
    "profiles/contacts",
    async ({ params, id }, { dispatch }) =>
    {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/api/profiles/${id}/contacts`, { params });
            return { data: response.data }
        } catch (e) {
            toast.error(e.response.data.message);
            return { data: null }
        }
    }
);

export const storeOrUpdateProfileContact = createAsyncThunk(
    "profiles/storeOrUpdateProfileContact",
    async ({ data, id }, { dispatch }) =>
    {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/api/profiles/${parseInt(id)}/contacts`, data);
            toast.success(response.data.message);
            dispatch(setReloadTable(true));
            return { data: true };
        } catch (e) {
            toast.error(e.response.data.message);
            if (e.response.data?.errors) dispatch(setErrors(e.response.data.errors));
            return { data: false };
        }
    }
);

// delete 
export const deleteProfileContact = createAsyncThunk(
    "profiles/deleteProfileContact",
    async (id, { dispatch }) =>
    {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/api/profiles/delete-contact/${id}`);
            toast.success(response.data.message);
            dispatch(setReloadTable(true));
            return {
                data: true
            };
        } catch (e) {
            toast.error(e.response.data.message);
            return {
                data: false
            };
        }
    }
);

// Profile Contact section END Here 


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
        loadingProfiles: true,
        nowPlaying: null,
        reloadTable: false,
        reloadCallTable: false,
        pipelineFilterValue: { label: "None", value: null },
        statusFilterValue: { label: "None", value: null },
    },
    reducers: {
        setLoading: (state, { payload }) =>
        {
            state.loading = payload
        },
        setErrors: (state, { payload }) =>
        {
            state.errors.setErrors(payload);
        },
        setProfiles: (state, { payload }) =>
        {
            state.profiles = payload;
        },
        setTotalRecords: (state, { payload }) =>
        {
            state.totalRecords = payload;
        },
        setPageCount: (state, { payload }) =>
        {
            state.pageCount = payload;
        },
        setLoadingProfiles: (state, { payload }) =>
        {
            state.loadingProfiles = payload;
        },
        setSelectedProfile: (state, { payload }) =>
        {
            state.selectedProfile = payload;
        },
        setNowPlaying: (state, { payload }) =>
        {
            state.nowPlaying = payload;
        },
        setReloadTable: (state, { payload }) =>
        {
            state.reloadTable = payload;
        },
        setReloadCallTable: (state, { payload }) =>
        {
            state.reloadCallTable = payload;
        },
        setPipelineFilterValue: (state, { payload }) =>
        {
            state.pipelineFilterValue = payload
        },
        setStatusFilterValue: (state, { payload }) =>
        {
            state.statusFilterValue = payload
        },
        resetFilters: (state, { payload }) =>
        {
            state.statusFilterValue = { label: "None", value: null };
            state.pipelineFilterValue = { label: "None", value: null };
        }
    }
});

export const {
    setLoading,
    setErrors,
    setProfiles,
    setLoadingProfiles,
    setSelectedProfile,
    setSelectedProfileCalls,
    setNowPlaying,
    setReloadTable,
    setReloadCallTable,
    setPipelineFilterValue,
    setStatusFilterValue,
    resetFilters
} = callProfileSlice.actions;

export default callProfileSlice.reducer;
