/* eslint-disable */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// ** Axios Imports
import axiosPkg from "axios";
import toast from "react-hot-toast";
import ErrorHandler from "../utility/ErrorHandler"

const axios = axiosPkg.create({
    baseURL: `${process.env.REACT_APP_API_ENDPOINT}/api/pipelines`,
    withCredentials: true
})

export const pipelinesSlice = createSlice({
    name: "pipelines",
    initialState: {
        errors: new ErrorHandler(),
    },
    reducers: {
        setErrors: (state, { payload }) => {
            state.errors.setErrors(payload);
        }
    }
});

export const createPipeline = createAsyncThunk(
    "pipelines/create",
    async (payload, { dispatch }) => {
        try {
            const response = await axios.post(
                `/`,
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
        }
    }
);

export const updatePipeline = createAsyncThunk(
    "pipelines/update",
    async (payload, { dispatch }) => {
        try {
            const response = await axios.post(
                `/`,
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
        }
    }
);

export const {
    setErrors
} = pipelinesSlice.actions;

export default pipelinesSlice.reducer;