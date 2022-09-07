// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;

// Perform get workspaces list API and set workspaces data in store
export const getData = createAsyncThunk(
  "workspaces/getData",
  async (payload) => {
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

// Perform add workspace API
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

// Perform update workspace API
export const updateWorkspace = createAsyncThunk(
  "workspaces/updateWorkspace",
  async (payload) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/workspace/${payload.id}`,
        { name: payload.name }
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

// Perform delete workspace API
export const deleteWorkspace = createAsyncThunk(
  "workspaces/deleteWorkspace",
  async (payload) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_ENDPOINT}/api/workspace/${payload.id}`
      );

      toast.success(response.data.message);
      return {
        data: null,
      };
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
      return {
        data: null,
      };
    }
  }
);

// Perform inviteMember API
export const inviteMember = createAsyncThunk(
  "workspaces/inviteMember",
  async (payload) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/workspace/${payload.id}/invite`,
        {
          email: payload.email,
        }
      );

      toast.success(response.data.message);
      return {
        data: {
          user: true,
        },
      };
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
      return {
        data: null,
      };
    }
  }
);

// Perform get users in workspace API
export const getUsers = createAsyncThunk(
  "workspaces/getUsers",
  async (payload) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/workspace/${payload.id}/users`,
        payload
      );
      return {
        data: {
          users: response.data.users,
          total: response.data.total,
          workspaceName: response.data.workspaceName,
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

// prettier-ignore
//const user = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null;
export const workspacesSlice = createSlice({
  name: "workspaces",
  initialState: {
    //Workspace table related attributes
    workspaces: [],
    loading: true,
    total: 0,
    currentPage:1,
    rowsPerPage:10,

    //Workspace users table related attributes
    users:[],
    usersLoading:true,
    totalUsers: 0,
    rowsPerPageUser:2,
    currentPageUser:1,
    workspaceName:""
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
          console.log("No need to update store", state, action)
        }
      })
      .addCase(updateWorkspace.fulfilled, (state, action) => {
        if (action.payload.data.workspace) {
          console.log("No need to update store", state, action)
        }
      })
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        console.log("No need to update store", state, action)
      })
      .addCase(inviteMember.fulfilled, (state, action) => {
        console.log("No need to update store", state, action)
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload.data.users;
        state.totalUsers = action.payload.data.total;
        state.usersLoading = false;
        state.workspaceName = action.payload.data.workspaceName;
      });
  },
});

export const {
  getWorkspace,
  storeRowsPerPage,
  storeCurrentPage,
  storeCurrentPageUser,
  storeRowsPerPageUser,
} = workspacesSlice.actions;

export default workspacesSlice.reducer;
