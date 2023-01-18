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

export const leadProfileStatusList = createAsyncThunk(
  "calls/leadProfileStatusList",
  async ({ id }) =>
  {
    try {
      const response = await axios.get(`${baseURL}/profile/status/list/${id}`);
      return response.data.data;
    } catch (e) {
      toast.error(e.response.data.message);
      return null;
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
} = callsSlice.actions;

export default callsSlice.reducer;