// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;

// Perform Login API and set user data in store
export const getData = createAsyncThunk(
  "workspaces/getData",
  async (payload) => {
    console.log("payload getData", payload);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/workspaces`,
        payload
      );
      return {
        data: {
          workspaces: response.data.workspaces,
          total: response.data.total,
        },
      };
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
      return {
        data: {
          workspaces: [],
        },
      };
    }
  }
);

// Perform Login API and set user data in store
export const addWorkspace = createAsyncThunk(
  "workspaces/addWorkspace",
  async (payload) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/workspace`,
        payload
      );

      toast.success(response.data.message);
      return {
        data: {
          workspace: response.data,
        },
      };
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
      return {
        data: {
          workspace: null,
        },
      };
    }
  }
);

// prettier-ignore
//const user = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null;
export const workspacesSlice = createSlice({
  name: "workspaces",
  initialState: {
    workspaces: [],
    loading: true,
    total: 0
  },
  reducers: {
    deleteWorkspace: (state, action) => {
      state.query = action.payload
    },
    getWorkspace: (state, action) => {
        state.query = action.payload
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getData.fulfilled, (state, action) => {
        state.workspaces = action.payload.data.workspaces;
        state.total = action.payload.data.total;
        state.loading = false;
      })
      .addCase(addWorkspace.fulfilled, (state, action) => {
        if (action.payload.data.workspace) {
            //state.workspaces = [...state.workspaces, action.payload.data.workspace];
        }
      });
  },
});

export const { deleteWorkspace, getWorkspace } = workspacesSlice.actions;

export default workspacesSlice.reducer;
