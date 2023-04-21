/* eslint-disable */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";
import ErrorHandler from "../utility/ErrorHandler";

axios.defaults.withCredentials = true;
const baseURL = `${process.env.REACT_APP_API_ENDPOINT}/api/calls`;

export const callsSlice = createSlice({
  name: "calls",
  initialState: {
    errors: new ErrorHandler(),
    calls: [],
    recordings: [],
    reports: null,
  },
  reducers: {
    setErrors: (state, { payload }) =>
    {
      state.errors.setErrors(payload);
    },
    setCalls: (state, { payload }) =>
    {
      state.calls = payload;
    },
    setRecordings: (state, { payload }) =>
    {
      state.recordings = payload;
    },
    setReports: (state, { payload }) =>
    {
      state.reports = payload;
    },

  },
});


export const getCallsList = createAsyncThunk(
  "calls/index",
  async (params, { dispatch }) =>
  {
    try {
      const response = await axios.get(`${baseURL}`, { params });
      dispatch(setCalls(response.data));
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }
);


export const getCallsListWithCount = createAsyncThunk(
  "calls/getCallsListWithCount",
  async (params, { dispatch }) =>
  {
    try {
      const response = await axios.get(`${baseURL}/report`, { params });
      dispatch(setReports(response.data));
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }
);

export const getRecordingByWorkspace = createAsyncThunk(
  "calls/getRecordingByWorkspace",
  async ({ id }, { dispatch }) =>
  {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/api/workspace/${id}/recording`);
      dispatch(setRecordings(response.data));
    } catch (e) {
      toast.error(e.response.data.message);
      return null;
    }
  }
);


export const {
  setErrors,
  setCalls,
  setRecordings,
  setReports,
} = callsSlice.actions;

export default callsSlice.reducer;
