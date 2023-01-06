// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
//get queue data in table
export const getQueue = createAsyncThunk(
    "workspaces/getQueue",
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/api/queues/`,
          
        );
        console.log("res", response.data.data)
        return {
          data: {
            queue: response.data.data,
            total: response.data.total,
          },
        };
      } catch (e) {
        console.log(e);
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
  
      //Workspace queue table related attributes
      //Queue
      queue:[],
      queueLoading:true,
      totalQueue: 0,
      rowsPerPageQueue:50,
      currentPageQueue:1,
  
      //Workspace CSV
      csv:null,
  
      currentWorkspace: null,
      recentlyAccessedWorkspaces: false
    },
    reducers: {
      //Queue
      storeRowsPerPageQueue: (state, action) => {
        state.rowsPerPageQueue = action.payload.rowsPerPage
      },
      storeCurrentPageQueue: (state, action) => {
        state.currentPageQueue = action.payload.currentPage
      },
    },
    extraReducers: (builder) => {
      builder
        //getQueue
        .addCase(getQueue.fulfilled, (state, action) => {
          state.queue = action.payload.data.queue;
          state.totalQueue = action.payload.data.total;
          state.queueLoading = false;
        })
    },
  });
  
  export const {
    storeRowsPerPageQueue,
    storeCurrentPageQueue,
  } = workspacesSlice.actions;
  
  export default workspacesSlice.reducer;