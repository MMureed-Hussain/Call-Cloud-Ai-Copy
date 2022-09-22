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

// Perform get workspace API and set workspace data in store
export const storeCurrentWorkspaceById = createAsyncThunk(
  "workspaces/storeCurrentWorkspaceById",
  async (payload) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/workspace/${payload.id}`
      );
      return {
        data: {
          workspace: response.data.workspace,
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

// Perform mark workspace as accessed now API
export const markWorkspaceAsAccessedNow = createAsyncThunk(
  "workspaces/markWorkspaceAsAccessedNow",
  async (payload) => {
    try {
      await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/mark-workspace-as-accessed-now/${payload.id}`
      );
      return {
        data: true,
      };
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
      return {
        data: false,
      };
    }
  }
);

// Perform get recently accessed workspaces
export const recentlyAccessedWorkspaces = createAsyncThunk(
  "workspaces/recentlyAccessedWorkspaces",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/recently-accessed-workspaces`
      );
      return {
        data: response.data.recentWorkspaces,
      };
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
      return {
        data: false,
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
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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

// Perform add multiple workspace API
export const addMultipleWorkspaces = createAsyncThunk(
  "workspaces/addMultipleWorkspaces",
  async (payload) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/bulk-workspaces`,
        payload
      );

      toast.success(response.data.message);
      return {
        data: {
          workspaces: response.data.workspaces,
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

// Perform update workspace API
export const updateWorkspace = createAsyncThunk(
  "workspaces/updateWorkspace",
  async (payload, { getState }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/workspace/${payload.id}`,
        { name: payload.name, logo: payload.logo },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const isCurrentWorkspace =
        getState().workspaces.currentWorkspace.id === payload.id;
      toast.success(response.data.message);
      return {
        data: {
          workspace: response.data.workspace,
          isCurrentWorkspace,
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
          nickname: payload.nickname,
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

// Perform inviteMultipleMembers API
export const inviteMultipleMembers = createAsyncThunk(
  "workspaces/inviteMultipleMembers",
  async (payload) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/workspace-bulk-invite`,
        payload
      );

      toast.success(response.data.message);
      return {
        data: {
          users: true,
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

// Perform delete user from workspace API
export const deleteMemberFromWorkspace = createAsyncThunk(
  "workspaces/deleteMemberFromWorkspace",
  async (payload) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_ENDPOINT}/api/workspace/delete-member/${payload.id}`
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

// Perform delete user from workspace API
export const updateMemberInWorkspace = createAsyncThunk(
  "workspaces/updateMemberInWorkspace",
  async (payload) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/workspace/update-member/${payload.id}`,
        {
          nickname: payload.nickname,
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
    rowsPerPage:50,

    //Workspace users table related attributes
    users:[],
    usersLoading:true,
    totalUsers: 0,
    rowsPerPageUser:50,
    currentPageUser:1,


    currentWorkspace: null,
    recentlyAccessedWorkspaces: false
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
    storeCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload.workspace
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

        // if (action.payload.data.workspaces.length && !state.currentWorkspace) {
        //   state.currentWorkspace = action.payload.data.workspaces[0]
        // }
      })
      .addCase(storeCurrentWorkspaceById.fulfilled, (state, action) => {
        if (action.payload.data.workspace) {
          state.currentWorkspace = action.payload.data.workspace
        }
      })
      .addCase(markWorkspaceAsAccessedNow.fulfilled, (state, action) => {
        if (action.payload.data) {
          console.log("no action required")
        }
      })
      .addCase(recentlyAccessedWorkspaces.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.recentlyAccessedWorkspaces = action.payload.data

          if (action.payload.data.length && !state.currentWorkspace) {
            state.currentWorkspace = action.payload.data[0]
          }
        }
      })
      .addCase(addWorkspace.fulfilled, (state, action) => {
        if (action.payload.data.workspace) {
          console.log("No need to update store", state, action)
        }
      })
      .addCase(addMultipleWorkspaces.fulfilled, (state, action) => {
        if (action.payload.data.workspaces) {
          console.log("No need to update store", state, action)
        }
      })
      .addCase(updateWorkspace.fulfilled, (state, action) => {
        if (action.payload.data.workspace && action.payload.data.isCurrentWorkspace) {
          state.currentWorkspace = action.payload.data.workspace;
        }
      })
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        console.log("No need to update store", state, action)
      })
      .addCase(inviteMember.fulfilled, (state, action) => {
        console.log("No need to update store", state, action)
      })
      .addCase(inviteMultipleMembers.fulfilled, (state, action) => {
        console.log("No need to update store", state, action)
      })
      .addCase(updateMemberInWorkspace.fulfilled, (state, action) => {
        console.log("No need to update store", state, action)
      })
      .addCase(deleteMemberFromWorkspace.fulfilled, (state, action) => {
        console.log("No need to update store", state, action)
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload.data.users;
        state.totalUsers = action.payload.data.total;
        state.usersLoading = false;
      });
  },
});

export const {
  getWorkspace,
  storeRowsPerPage,
  storeCurrentPage,
  storeCurrentPageUser,
  storeRowsPerPageUser,
  storeCurrentWorkspace,
} = workspacesSlice.actions;

export default workspacesSlice.reducer;
