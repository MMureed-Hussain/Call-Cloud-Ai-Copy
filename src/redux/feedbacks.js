// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;

// Perform add workspace API
export const createFeedback = createAsyncThunk(
  "feedbacks/createFeedback",
  async (payload) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/feedbacks/create`,
        payload,
      );

      toast.success(response.data.message);
      return {
        data: {
          feedback: null,
        },
      };
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
      return {
        data: {
          feedback: null,
        },
      };
    }
  }
);

// prettier-ignore
export const feedbacksSlice = createSlice({
  name: "feedbacks",
  initialState: {
    // Feedbacks table related attributes
    feedbacks: [],
    loading: true,
    total: 0,
    currentPage:1,
    rowsPerPage:50,
  },
  reducers: {
    storeCurrentPage: (state, action) => {
      state.currentPage = action.payload.currentPage
    },
    storeRowsPerPage: (state, action) => {
      state.rowsPerPage = action.payload.rowsPerPage
    },
    storeCurrentPageUser: (state, action) => {
      state.currentPageUser = action.payload.currentPage
    },
    storeRowsPerPageUser: (state, action) => {
      state.rowsPerPageUser = action.payload.rowsPerPage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFeedback.fulfilled, (state, action) => {
        if (action.payload.data.feedback) {
          console.log("No need to update store", state, action)
        }
      });
  },
});

export const {
  storeRowsPerPage,
  storeCurrentPage,
  storeCurrentPageUser,
  storeRowsPerPageUser,
  storeCurrentWorkspace,
} = feedbacksSlice.actions;

export default feedbacksSlice.reducer;
