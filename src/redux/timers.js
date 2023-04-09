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
    timer: null,
    reload: false,
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

    setTimer: (state, { payload }) =>
    {
      state.timer = payload;
    },

    setReload: (state, { payload }) =>
    {
      state.reload = payload;
    }
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

export const storeOrUpdate = createAsyncThunk(
  "timers/storeOrUpdate",
  async (params, { dispatch }) =>
  {
    try {
      const response = await axios.post(`${baseURL}`, params);
      dispatch(setTimer(response.data.timer));
      dispatch(setReload(true));
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }
);

export const getCrrentTimer = createAsyncThunk(
  "timers/current",
  async (params, { dispatch }) =>
  {
    try {
      const response = await axios.get(`${baseURL}/current`);
      dispatch(setTimer(response.data.timer));
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
  setTimer,
  setReload,
} = timerSlice.actions;

export default timerSlice.reducer;
