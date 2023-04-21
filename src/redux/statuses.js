/* eslint-disable */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";
import ErrorHandler from "../utility/ErrorHandler";
import { filterStatus } from "../utility/Utils";
axios.defaults.withCredentials = true;

const baseURL = `${process.env.REACT_APP_API_ENDPOINT}/api/statuses`;

export const StatusesSlice = createSlice({
  name: "statuses",
  initialState: {
    errors: new ErrorHandler(),
    reload: false,
    statuses: [],
    call_options: [],
    pipeline_options: [],
    lead_options: [],
    client_options: [],
  },
  reducers: {
    setErrors: (state, { payload }) =>
    {
      state.errors.setErrors(payload);
    },
    setReload: (state, { payload }) =>
    {
      state.reload = payload;
    },
    setStatuses: (state, { payload }) =>
    {
      state.statuses = payload;
    },
    setCallOptions: (state, { payload }) =>
    {
      state.call_options = payload;
    },
    setPipelineOptions: (state, { payload }) =>
    {
      state.pipeline_options = payload;
    },
    setLeadOptions: (state, { payload }) =>
    {
      state.lead_options = payload;
    },
    setClientOptions: (state, { payload }) =>
    {
      state.client_options = payload;
    },
    deleteResource: (state, { payload }) =>
    {
      state.statuses = state.statuses.filter((p) => p.id != payload);
    },

  },
});

export const getStatuses = createAsyncThunk(
  "statuses/index",
  async (params, { dispatch }) =>
  {
    try {
      const response = await axios.get(`${baseURL}`, { params });
      dispatch(setStatuses(response.data));
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }
);

export const getStatusesOptions = createAsyncThunk(
  "statuses/getStatusesOptions",
  async (params, { dispatch }) =>
  {
    try {
      const response = await axios.post(`${baseURL}/options`, params);
      dispatch(setCallOptions(filterStatus(response.data, 'CALL')));
      dispatch(setLeadOptions(filterStatus(response.data, 'LEAD_PROFILE')));
      dispatch(setClientOptions(filterStatus(response.data, 'CLIENT')));
      dispatch(setPipelineOptions(filterStatus(response.data, 'PIPELINE')));
    } catch (e) {
      toast.error(e.response.data.message);
      return [];
    }
  }
);



export const deleteStatus = createAsyncThunk(
  "campaigns/deleteStatus",
  async (id, { dispatch }) =>
  {
    try {
      const response = await axios.delete(`${baseURL}/${id}`);
      toast.success(response.data.message);
      dispatch(setReload(true));
      return { data: true };
    } catch (e) {
      toast.error(e.response.data.message);
      if (e.response.data?.errors) dispatch(setErrors(e.response.data.errors));
      return { data: false };
    }
  }
);

export const storeOrUpdateStatus = createAsyncThunk(
  "statuses/storeOrUpdateStatus",
  async (payload, { dispatch }) =>
  {
    try {
      const response = await axios.post(`${baseURL}`, payload);
      toast.success(response.data.message);
      dispatch(setReload(true));
    } catch (e) {
      toast.error(e.response.data.message);
      if (e.response.data?.errors) dispatch(setErrors(e.response.data.errors));
      return { data: false };
    }
  }
);

export const updateStatus = createAsyncThunk(
  "statuses/update",
  async ({ id, formData }, { dispatch }) =>
  {
    try {
      const response = await axios.put(`${baseURL}/${id}`, formData);
      dispatch(setReload(true));
      toast.success(response.data.message);
      return { data: true };
    } catch (e) {
      toast.error(e.response.data.message);
      if (e.response.data?.errors) dispatch(setErrors(e.response.data.errors));
      return { data: false };
    }
  }
);


export const deletePipeline = createAsyncThunk(
  "statuses/delete",
  async (id, { dispatch }) =>
  {
    try {
      const response = await axios.delete(`${baseURL}/${id}`);
      toast.success(response.data.message);
      dispatch(deleteResource(id));
      return { data: true };
    } catch (e) {
      toast.error(e.response.data.message);
      return { data: false };
    }
  }
);

export const updatePipelinesOrder = createAsyncThunk(
  "statuses/updateOrder",
  async (payload) =>
  {
    try {
      const response = await axios.post(`${baseURL}/update-order`, {
        data: payload,
      });
      toast.success(response.data.message);
      return {
        data: true,
      };
    } catch (e) {
      toast.error(e.response.data.message);
      return {
        data: false,
      };
    }
  }
);

export const clonePipelines = createAsyncThunk(
  "statuses/clone",
  async (payload) =>
  {
    try {
      const response = await axios.post(`${baseURL}/clone`, payload);
      toast.success(response.data.message);
      return {
        data: true,
      };
    } catch (e) {
      toast.error(e.response.data.message);
      return {
        data: false,
      };
    }
  }
);

export const {
  setErrors,
  setReload,
  setCallOptions,
  setPipelineOptions,
  setLeadOptions,
  setClientOptions,
  setStatuses,
  deleteResource,
} = StatusesSlice.actions;

export default StatusesSlice.reducer;
