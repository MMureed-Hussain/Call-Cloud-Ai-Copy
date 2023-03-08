// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
// import toast from "react-hot-toast";

axios.defaults.withCredentials = true;

// Perform get active plans with feature of plan and prices
export const getBookingPages = createAsyncThunk(
  "bookingPages/getBookingPages",
  async (payload) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/get-booking-pages`,
        payload
      );
      // toast.success(response.data.message);
      return {
        data: {
          bookingPages: response.data.bookingPages,
          total: response.data.total,
        },
      };
    } catch (e) {
      return {
        data: {
          bookingPages: [],
          total: 0,
        },
      };
    }
  }
);

export const bookingPagesSlice = createSlice({
  name: "bookingPages",
  initialState: {
    //Plans table related attributes
    bookingPages: [],
    loading: true,
    total: 0,
    currentPage: 1,
    rowsPerPage: 50,
  },
  reducers: {
    storeCurrentPage: (state, action) => {
      state.currentPage = action.payload.currentPage;
    },
    storeRowsPerPage: (state, action) => {
      state.rowsPerPage = action.payload.rowsPerPage;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getBookingPages.fulfilled, (state, action) => {
      state.bookingPages = action.payload.data.bookingPages;
      state.total = action.payload.data.total;
      state.loading = false;
    });
  },
});

export const { storeCurrentPage, storeRowsPerPage } = bookingPagesSlice.actions;

export default bookingPagesSlice.reducer;
