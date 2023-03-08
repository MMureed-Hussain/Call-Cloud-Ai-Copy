/* eslint-disable */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";
import ErrorHandler from "../utility/ErrorHandler";

axios.defaults.withCredentials = true;
const baseURL = `${process.env.REACT_APP_API_ENDPOINT}/api/followups`;

export const followupsSlice = createSlice({
  name: "followups",
  initialState: {
    errors: new ErrorHandler(),
    followups: [],
  },
  reducers: {
    setErrors: (state, { payload }) =>
    {
      state.errors.setErrors(payload);
    },
    setFollowups: (state, { payload }) =>
    {
      state.followups = payload;
    },


  },
});



export const getFollowups = createAsyncThunk(
  "followups/index",
  async (params, { dispatch }) =>
  {
    try {
      const response = await axios.get(`${baseURL}`, {
        params,
      });
      dispatch(setFollowups(response.data));
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }
);


export const {
  setErrors,
  setFollowups,
} = followupsSlice.actions;

export default followupsSlice.reducer;
