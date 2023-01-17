import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";
axios.defaults.withCredentials = true;

export const getCallFlowData = createAsyncThunk(
    "workspaces/getCallFlowData",
    async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_ENDPOINT}/api/callflow/index`
            );
            return {
                data: {
                    callflow: response.data.data,
                },
            };
        } catch (e) {
            toast.error(e.response.data.message);
            return {
                data: {
                    callflow: [],
                    total: 0,
                },
            };
        }
    }
);
export const postCallFlowRecord = createAsyncThunk(
    "workspaces/postCallFlowRecord",
    async (payload) => {
        console.log("redux", payload)
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_ENDPOINT}/api/callflow/store/recording`,
                payload
            );
            toast.success("New Call Created");
            return {
                data: {
                    callFlowRecord: response.data.data,
                    total: response.data.total,
                },
            };
        } catch (e) {
            toast.error(e.response.data.message);
            return {
                data: {
                    callFlowRecord: [],
                    total: 0,
                },
            };
        }
    }
);
export const getCallFlowRecord = createAsyncThunk(
    "workspaces/getCallFlowRecord",
    async (payload) => {
      console.log("redux",payload)
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/api/leadlists/lead/record/${payload.rowId}`
        );
        console.log("getRecord",response)
       // console.log("getRecord",response.data.data[0])
       
        return {
          data: {
            callFlowRecord: response.data.data[0],
            total: response.data.total,
          },
        };
      } catch (e) {
        toast.error(e.response.data.message);
        return {
          data: {
            callFlowRecord: [],
            total: 0,
          },
        };
      }
    }
  );
  export const workspacesSlice = createSlice({
    name: "workspaces",
    initialState: {
      
      //Workspace CallFLow table related attributes
      callflow:[],
      callflowLoading:true,
      totalCallflow: 0,
      rowsPerPageCallflow:50,
      currentPageCallflow:1,
      
      //Workspace CallFLow Recorded table related attributes
      callFlowRecord:[],
      callFlowRecordLoading:true,
      totalCallFlowRecord: 0,
      rowsPerPageCallFlowRecord:50,
      currentPageCallFlowRecord:1, 
  
        },
    reducers: {
     
      //callflow
      storeRowsPerPageCallflow: (state, action) => {
        state.rowsPerPageCallflow = action.payload.rowsPerPage
      },    
      storeCurrentPageCallflow: (state, action) => {
        state.currentPageCallflow = action.payload.currentPage
      },
      //callflow Record in table
      storeRowsPerPageCallFlowRecord: (state, action) => {
        state.rowsPerPageCallFlowRecord = action.payload.rowsPerPage
      },    
      storeCurrentPageCallFlowRecord: (state, action) => {
        state.currentPageCallFlowRecord = action.payload.currentPage
      },     
      
    },
    extraReducers: (builder) => {
      builder
        
        //callflow
        .addCase(getCallFlowData.fulfilled, (state, action) => {
          state.callflow = action.payload.data.callflow;
          state.totalCallflow = action.payload.data.total;
          state.callflowLoading = false;
        })
        //callflow
        .addCase(postCallFlowRecord.fulfilled, (state, action) => {
          state.callFlowRecord = action.payload.data.callFlowRecord;
          state.totalCallFlowRecord = action.payload.data.total;
          state.callFlowRecordLoading = false;
        })    
         //callflow table
         .addCase(getCallFlowRecord.fulfilled, (state, action) => {
          state.callFlowRecord = action.payload.data.callFlowRecord;
          state.totalCallFlowRecord = action.payload.data.total;
          state.callFlowRecordLoading = false;
        })        
       
    },
  });
  export const {
    storeCurrentPageCallflow,
    storeRowsPerPageCallflow,
    storeCurrentPageCallFlowRecord,
    storeRowsPerPageCallFlowRecord,
  } = workspacesSlice.actions;
  export default workspacesSlice.reducer;