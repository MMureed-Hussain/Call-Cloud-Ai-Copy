/* eslint-disable */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";
import ErrorHandler from "../utility/ErrorHandler";
axios.defaults.withCredentials = true;

const baseURL = `${process.env.REACT_APP_API_ENDPOINT}/api/notes`;

export const notesSlice = createSlice({
  name: "notes",
  initialState: {
    errors: new ErrorHandler(),
    note: [],
  },
  reducers: {
    setErrors: (state, { payload }) => {
      state.errors.setErrors(payload);
    },
    setNotes: (state, { payload }) => {
      state.note = payload;
    },
  },
});

export const getNotes = createAsyncThunk(
  "notes/index",
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(`${baseURL}`, {
        params: params,
      });
      dispatch(setNotes(response.data.data));
      return {
        notes: response.data.data,
      };
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }
);

export const { setErrors, setNotes } = notesSlice.actions;

export default notesSlice.reducer;
