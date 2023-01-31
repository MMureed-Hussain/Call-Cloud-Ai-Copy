/* eslint-disable */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";
import ErrorHandler from "../utility/ErrorHandler";
axios.defaults.withCredentials = true;

const baseURL = `${process.env.REACT_APP_API_ENDPOINT}/api/activity-log`;

export const activityLogSlice = createSlice({
  name: "activityLogs",
  initialState: {
    errors: new ErrorHandler(),
    logs: [],
    isLoading: false,
    currentPage: 1,
    rowsPerPage: 10,
    totalCount: 0
  },
  reducers: {
    setErrors: (state, { payload }) => {
      state.errors.setErrors(payload);
    },
    setLogs: (state, { payload }) => {
      state.logs = payload;
    },
    setCurrentPage: (state, { payload }) => {
      state.currentPage = payload;
    },
    setRowsPerPage: (state, { payload }) => {
      state.rowsPerPage = payload;
    },
    setTotalCount: (state, { payload }) => {
      state.totalCount = payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getActivityLogs.pending, (state) => {
      state.isLoading = true;
    }).addCase(getActivityLogs.fulfilled, (state) => {
      state.isLoading = false;
    }).addCase(getActivityLogs.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const getActivityLogs = createAsyncThunk(
  "activityLogs/index",
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(`${baseURL}/`, {
        params
      });
      dispatch(setLogs(response.data.data));
      dispatch(setCurrentPage(response.data.current_page));
      dispatch(setTotalCount(response.data.total));
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }
);

export const {
  setErrors,
  setLogs,
  setCurrentPage,
  setRowsPerPage,
  setTotalCount
} = activityLogSlice.actions;

export default activityLogSlice.reducer;
