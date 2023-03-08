/* eslint-disable */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";
import ErrorHandler from "../utility/ErrorHandler";

axios.defaults.withCredentials = true;
const baseURL = `${process.env.REACT_APP_API_ENDPOINT}/api/timers`;

export const timerSlice = createSlice({
  name: "timers",
  initialState: {
    errors: new ErrorHandler(),
    timers: [],
    total_time: '',
    total_call: 0,
    calls: [],
  },
  reducers: {
    setErrors: (state, { payload }) =>
    {
      state.errors.setErrors(payload);
    },
    setTimers: (state, { payload }) =>
    {
      state.timers = payload;
    },
    setTotalTime: (state, { payload }) =>
    {
      state.total_time = payload;
    },
    setTotalCall: (state, { payload }) =>
    {
      state.total_call = payload;
    },

    setCalls: (state, { payload }) =>
    {
      state.calls = payload;
    },
  },
});


export const getSessionList = createAsyncThunk(
  "timers/index",
  async (params, { dispatch }) =>
  {
    try {
      const response = await axios.get(`${baseURL}`, { params });
      dispatch(setTimers(response.data.list));
      dispatch(setTotalTime(response.data.total_time));
      dispatch(setTotalCall(response.data.total_call));
      dispatch(setCalls(response.data.calls));
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }
);

export const {
  setErrors,
  setTimers,
  setTotalTime,
  setTotalCall,
  setCalls,
} = timerSlice.actions;

export default timerSlice.reducer;
