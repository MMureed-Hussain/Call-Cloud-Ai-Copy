// ** Redux Imports
/* eslint-disable */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;

// Perform get workspaces list API and set workspaces data in store
export const getData = createAsyncThunk(
  "workspaces/getData",
  async (payload) =>
  {
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
  async (payload) =>
  {
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
  async (payload) =>
  {
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
  async () =>
  {
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
  async (payload) =>
  {
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
  async (payload) =>
  {
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
  async (payload, { getState }) =>
  {
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
  async (payload) =>
  {
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
  async (payload) =>
  {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/workspace/${payload.id}/invite`,
        {
          email: payload.email,
          nickname: payload.nickname,
          role: payload.role,

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

// Perform add Leadlist csv API
export const inviteLeadlist = createAsyncThunk(
  "workspaces/inviteLeadlist",
  async (payload) =>
  {

    try {
      console.log("inisde payload", payload)
      const _formData = new FormData();
      _formData.append('leadlist_name', payload.lead);
      _formData.append('file_name', payload.csvFile);
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/leadlists/import/${payload.id}`,
        _formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
      );
      toast.success(response.data.mesage)
      return {
        data: response.data
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

// Perform add queue API
export const saveQueue = createAsyncThunk(
  "workspaces/saveQueue",
  async (payload) =>
  {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/queues/create/${payload.id}`,
        {
          data: {
            queue_name: payload.queue_name,
            leadlist_records: payload.leadlists,
            users: payload.users,
          }

        }
      );

      toast.success(response.data.message);
      return {
        data: response.data
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

// Perform add Team API
export const saveTeam = createAsyncThunk(
  "workspaces/saveTeam",
  async (payload) =>
  {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/teams/create/${payload.id}`,
        {
          data: {
            team_name: payload.team_name,
            users: payload.users,
          }

        }
      );

      toast.success(response.data.message);
      return {
        data: response.data
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
  async (payload) =>
  {
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

      toast.success(response.data.message);
      return {
        data: {
          leadlist: true,
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
  async (payload) =>
  {
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

// Perform delete queue in action API
export const deleteQueueFromWorkspace = createAsyncThunk(
  "workspaces/deleteQueueFromWorkspace",
  async (payload) =>
  {
    console.log("payload", payload);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/queues/delete/${payload.id}`, { workspace_id: payload.workspaceId }
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

// Perform delete team in action API
export const deleteTeamFromWorkspace = createAsyncThunk(
  "workspaces/deleteTeamFromWorkspace",
  async (payload) =>
  {
    console.log("payload", payload);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/teams/delete/${payload.id}`, { workspace_id: payload.workspaceId }
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

// Perform delete leadlist from workspace API
export const deleteLeadlistWorkspace = createAsyncThunk(
  "workspaces/deleteLeadlistWorkspace",
  async (payload) =>
  {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_ENDPOINT}/api/leadlist/${payload.id}`
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
  async (payload) =>
  {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/workspace/update-member/${payload.id}`,
        {
          nickname: payload.nickname,
          role: payload.role,
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

// Perform update queue API
export const updateQueueInWorkspace = createAsyncThunk(
  "workspaces/updateQueueInWorkspace",
  async (payload) =>
  {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/queues/update/${payload.workspace_id}`,
        {
          data: {
            queue_name: payload.queue_name,
            id: payload.queue_id,
            workspace_id: payload.workspace_id,

            leadlist_records: payload.leadlist,
            users: payload.queueUser,
          }
        }
      );

      toast.success(response.data.message);
      return {
        data: {
          queue: true,
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

// Perform update team API
export const updateTeamInWorkspace = createAsyncThunk(
  "workspaces/updateTeamInWorkspace",
  async (payload) =>
  {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/teams/update/${payload.workspace_id}`,
        {
          team_name: payload.team_name,
          users: payload.teamUsers,
          id: payload.team_id,
          workspace_id: payload.workspace_id,
        }
      );

      toast.success(response.data.message);
      return {
        data: {
          team: true,
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

// Perform delete updateLeadlistInWorkspace from workspace API
export const updateLeadlistInWorkspace = createAsyncThunk(
  "workspaces/updateLeadlistInWorkspace",
  async (payload) =>
  {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/leadlist/${payload.id}`,
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

export const csvWorkspaceImport = createAsyncThunk(
  "workspaces/csvWorkspaceImport",
  async (payload) =>
  {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/leadlist/import`,
        {
          workspace_id: payload.id,
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
  async (payload) =>
  {
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
          users: [],
          total: 0,
        },
      };
    }
  }
);

// Perform get leadlist file in workspace API
export const getLeadlist = createAsyncThunk(
  "workspaces/getLeadlist",
  async (payload) =>
  {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/leadlists/${payload.id}/all`,
        payload
      );
      return {
        data: {
          leadlist: response.data.data,
          total: response.data.total,
        },
      };
    } catch (e) {
      toast.error(e.response.data.message);
      return {
        data: {
          leadlist: [],
          total: 0,
        },
      };
    }
  }
);

// Perform get Team file in workspace API
export const getTeam = createAsyncThunk(
  "workspaces/getTeam",
  async (payload) =>
  {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/teams/${payload.id}/all`,
        payload
      )
      console.log('getTeams thunks:', response.data.data);
      return {
        data: {
          team: response.data.data,
          total: response.data.total,
        },
      };
    } catch (e) {
      toast.error(e.response.data.message);
      return {
        data: {
          team: [],
          total: 0,
        },
      };
    }
  }
);

//get queue in data table
export const getQueue = createAsyncThunk(
  "workspaces/getQueue",
  async (payload) =>
  {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/queues/${payload.id}/all`,
        payload

      );
      return {
        data: {
          queue: response.data.data,
          total: response.data.total,
        },
      };
    } catch (e) {
      toast.error(e.response.data.message);
      return {
        data: {
          queue: [],
          total: 0,
        },
      };
    }
  }
);

// Perform get getRecord in workspace API
export const getRecord = createAsyncThunk(
  "workspaces/getRecord",
  async (id) =>
  {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/leadlists/record/${id}`,

      );
      return {
        data: {
          record: {
            headers: response.data.headers,
            rows: response.data.rows.map(rec => rec.rows_data)
          },
          total: response.data.total,
        },
      };
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
      return {
        data: {
          record: [],
          total: 0,
        },
      };
    }
  }
);

// Perform get getheaders in workspace API
export const postHeader = createAsyncThunk(
  "header/bulkupdate",
  async (payload) =>
  {
    console.log("post heaear educx", payload)
    try {

      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/leadlists/update/headers`,
        payload,
      );
      toast.success(response.data.message);

      return {
        data: response.data.data
      };
    } catch (e) {
      toast.error(e.response.data.message);

      return {
        data: null
      };
    } finally {

    }
  }
);

// Perform get CSV in workspace API
export const getCsv = createAsyncThunk(
  "workspaces/getCsv",
  async () =>
  {

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/leadlists/dummycsv/`
      );
      console.log("res csv", response.data)
      return {
        data: {
          csv: response.data,
        },
      };
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
      return {
        data: {
          csv: null,

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
    currentPage: 1,
    rowsPerPage: 50,

    //Workspace users table related attributes
    users: [],
    usersLoading: true,
    totalUsers: 0,
    rowsPerPageUser: 50,
    currentPageUser: 1,

    //Workspace leadlist table related attributes
    leadlist: [],
    leadlistLoading: true,
    totalLeadlist: 0,
    rowsPerPageLeadlist: 50,
    currentPageLeadlist: 1,

    //Workspace record table related attributes
    record: [],
    recordLoading: true,
    totalRecord: 0,
    rowsPerPageRecord: 50,
    currentPageRecord: 1,

    //header
    header: [],
    headerLoading: true,
    totalHeader: 0,
    rowsPerPageHeader: 50,
    currentPageHeader: 1,

    //Queue
    queue: [],
    queueLoading: true,
    totalQueue: 0,
    rowsPerPageQueue: 50,
    currentPageQueue: 1,


    //Team
    team: [],
    teamLoading: true,
    totalTeam: 0,
    rowsPerPageTeam: 50,
    currentPageTeam: 1,

    //Workspace CSV
    csv: null,

    currentWorkspace: null,
    recentlyAccessedWorkspaces: false
  },
  reducers: {
    storeCurrentPage: (state, action) =>
    {
      state.currentPage = action.payload.currentPage
    },
    storeRowsPerPage: (state, action) =>
    {
      state.rowsPerPage = action.payload.rowsPerPage
    },
    storeCurrentPageUser: (state, action) =>
    {
      state.currentPageUser = action.payload.currentPage
    },
    storeRowsPerPageUser: (state, action) =>
    {
      state.rowsPerPageUser = action.payload.rowsPerPage
    },
    storeCurrentPageLeadlist: (state, action) =>
    {
      state.currentPageLeadlist = action.payload.currentPage
    },
    //record
    storeCurrentPageRecord: (state, action) =>
    {
      state.currentPageRecord = action.payload.currentPage
    },
    storeRowsPerPageLeadlist: (state, action) =>
    {
      state.rowsPerPageLeadlist = action.payload.rowsPerPage
    },
    //record
    storeRowsPerPageRecord: (state, action) =>
    {
      state.rowsPerPageRecord = action.payload.rowsPerPage
    },
    //header
    storeRowsPerPageHeader: (state, action) =>
    {
      state.rowsPerPageRecord = action.payload.rowsPerPage
    },
    storeCurrentPageHeader: (state, action) =>
    {
      state.currentPageHeader = action.payload.currentPage
    },
    //Queue
    storeRowsPerPageQueue: (state, action) =>
    {
      state.rowsPerPageQueue = action.payload.rowsPerPage
    },
    storeCurrentPageQueue: (state, action) =>
    {
      state.currentPageQueue = action.payload.currentPage
    },
    //Team
    storeRowsPerPageTeam: (state, action) =>
    {
      state.rowsPerPageTeam = action.payload.rowsPerPage
    },
    storeCurrentPageTeam: (state, action) =>
    {
      state.currentPageTeam = action.payload.currentPage
    },
    storeCurrentWorkspace: (state, action) =>
    {
      state.currentWorkspace = action.payload.workspace
    },
    getWorkspace: (state, action) =>
    {
      state.query = action.payload
    }
  },
  extraReducers: (builder) =>
  {
    builder
      .addCase(getData.fulfilled, (state, action) =>
      {
        state.workspaces = action.payload.data.workspaces;
        state.total = action.payload.data.total;
        state.loading = false;

        // if (action.payload.data.workspaces.length && !state.currentWorkspace) {
        //   state.currentWorkspace = action.payload.data.workspaces[0]
        // }
      })
      .addCase(storeCurrentWorkspaceById.fulfilled, (state, action) =>
      {
        if (action.payload.data.workspace) {
          state.currentWorkspace = action.payload.data.workspace
        }
      })
      .addCase(markWorkspaceAsAccessedNow.fulfilled, (state, action) =>
      {
        if (action.payload.data) {
          console.log("no action required")
        }
      })
      .addCase(recentlyAccessedWorkspaces.fulfilled, (state, action) =>
      {
        if (action.payload.data) {
          state.recentlyAccessedWorkspaces = action.payload.data

          if (action.payload.data.length && !state.currentWorkspace) {
            state.currentWorkspace = action.payload.data[0]
          }
        }
      })
      .addCase(addWorkspace.fulfilled, (state, action) =>
      {
        if (action.payload.data.workspace) {
          console.log("No need to update store", state, action)
        }
      })
      .addCase(addMultipleWorkspaces.fulfilled, (state, action) =>
      {
        if (action.payload.data.workspaces) {
          console.log("No need to update store", state, action)
        }
      })
      .addCase(updateWorkspace.fulfilled, (state, action) =>
      {
        if (action.payload.data.workspace && action.payload.data.isCurrentWorkspace) {
          state.currentWorkspace = action.payload.data.workspace;
        }
      })
      .addCase(deleteWorkspace.fulfilled, (state, action) =>
      {
        console.log("No need to update store", state, action)
      })
      .addCase(inviteMember.fulfilled, (state, action) =>
      {
        console.log("No need to update store", state, action)
      })
      //new data 
      .addCase(inviteLeadlist.fulfilled, (state, action) =>
      {
        console.log("No need to update store", state, action)
      })
      //invite Queue
      .addCase(saveQueue.fulfilled, (state, action) =>
      {
        console.log("No need to update store", state, action)
      })
      .addCase(inviteMultipleMembers.fulfilled, (state, action) =>
      {
        console.log("No need to update store", state, action)
      })
      .addCase(updateMemberInWorkspace.fulfilled, (state, action) =>
      {
        console.log("No need to update store", state, action)
      })
      .addCase(deleteLeadlistWorkspace.fulfilled, (state, action) =>
      {
        console.log("No need to update store", state, action)
      })
      //new data 
      .addCase(updateLeadlistInWorkspace.fulfilled, (state, action) =>
      {
        console.log("No need to update store", state, action)
      })
      //update team 
      .addCase(updateTeamInWorkspace.fulfilled, (state, action) =>
      {
        console.log("No need to update store", state, action)
      })
      //delete team
      .addCase(deleteTeamFromWorkspace.fulfilled, (state, action) =>
      {
        console.log("No need to update store", state, action)
      })
      .addCase(deleteMemberFromWorkspace.fulfilled, (state, action) =>
      {
        console.log("No need to update store", state, action)
      })
      //delete queue
      .addCase(deleteQueueFromWorkspace.fulfilled, (state, action) =>
      {
        console.log("No need to update store", state, action)
      })
      .addCase(getUsers.fulfilled, (state, action) =>
      {
        state.users = action.payload.data.users;
        state.totalUsers = action.payload.data.total;
        state.usersLoading = false;
      })
      .addCase(getLeadlist.fulfilled, (state, action) =>
      {
        state.leadlist = action.payload.data.leadlist;
        state.totalLeadlist = action.payload.data.total;
        state.leadlistLoading = false;
      })
      .addCase(getRecord.fulfilled, (state, action) =>
      {
        state.record = action.payload.data.record;
        state.totalRecord = action.payload.data.total;
        state.recordLoading = false;
      })
      //getQueue
      .addCase(getQueue.fulfilled, (state, action) =>
      {
        state.queue = action.payload.data.queue;
        state.totalQueue = action.payload.data.total;
        state.queueLoading = false;
      })
      //getTeam
      .addCase(getTeam.fulfilled, (state, action) =>
      {
        state.team = action.payload.data.team;
        state.totalTeam = action.payload.data.total;
        state.teamLoading = false;
      })

      //headrs
      .addCase(postHeader.fulfilled, (state, action) =>
      {
        state.header = action.payload.data.header;
        state.totalHeader = action.payload.data.total;
        state.headerLoading = false;
      })
      .addCase(getCsv.fulfilled, (state, action) =>
      {
        state.csv = action.payload.data.csv;

      });
  },
});

export const {
  getWorkspace,
  storeRowsPerPage,
  storeCurrentPage,
  storeCurrentPageUser,
  storeRowsPerPageUser,
  storeCurrentPageLeadlist,
  storeRowsPerPageLeadlist,
  storeCurrentPageRecord,
  storeRowsPerPageRecord,
  storeRowsPerPageHeader,
  storeCurrentPageHeader,
  storeRowsPerPageQueue,
  storeCurrentPageQueue,
  storeRowsPerPageTeam,
  storeCurrentPageTeam,
  storeCurrentWorkspace,
} = workspacesSlice.actions;

export default workspacesSlice.reducer;
