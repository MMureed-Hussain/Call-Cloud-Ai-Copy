// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
// import toast from "react-hot-toast";

axios.defaults.withCredentials = true;

// Perform get active plans with feature of plan and prices
export const getActivePlans = createAsyncThunk(
  "plans/getActivePlans",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/get-active-plans`
      );
      // toast.success(response.data.message);
      return {
        data: response.data.plans,
      };
    } catch (e) {
      return {
        data: [],
      };
    }
  }
);

export const plansSlice = createSlice({
  name: "plans",
  initialState: {
    //Plans table related attributes
    activePlans: [],
  },
  reducers: {
    // storeCurrentPage: (state, action) => {
    //   state.currentPage = action.payload.currentPage;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(getActivePlans.fulfilled, (state, action) => {
      state.activePlans = action.payload.data;
    });
  },
});

// export const {
//   storeCurrentPage
// } = plansSlice.actions;

export default plansSlice.reducer;
