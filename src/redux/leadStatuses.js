/* eslint-disable */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";
import ErrorHandler from "../utility/ErrorHandler";
axios.defaults.withCredentials = true;

const baseURL = `${process.env.REACT_APP_API_ENDPOINT}/api/lead-statuses`;

export const leadStatusesSlice = createSlice({
  name: "leadStatuses",
  initialState: {
    errors: new ErrorHandler(),
    leadStatuses: [],
  },
  reducers: {
    setErrors: (state, { payload }) => {
      state.errors.setErrors(payload);
    },
    setLeadStatuses: (state, { payload }) => {
      state.leadStatuses = payload;
    },
    setNewLeadStatuses: (state, { payload }) => {
      const leadStatuses = [...state.leadStatuses, payload];
      state.leadStatuses = leadStatuses;
    },
    setUpdatedLeadStatus: (state, { payload }) => {
      let leadStatuses = [...state.leadStatuses];
      let index = leadStatuses.findIndex((p) => p.id == payload.id);
      leadStatuses[index].name = payload.name;
      state.leadStatuses = leadStatuses;
    },
    deleteResource: (state, { payload }) => {
      state.leadStatuses = state.leadStatuses.filter((p) => p.id != payload);
    },
  },
});

export const getLeadStatuses = createAsyncThunk(
  "leadStatuses/index",
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(`${baseURL}`, {
        params: params,
      });
      dispatch(setLeadStatuses(response.data.data));
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }
);

export const createLeadStatus = createAsyncThunk(
  "leadStatuses/create",
  async (payload, { dispatch }) => {
    try {
      const response = await axios.post(`${baseURL}`, payload);
      toast.success(response.data.message);
      dispatch(setNewLeadStatuses(response.data.data));
      return {
        data: true,
      };
    } catch (e) {
      toast.error(e.response.data.message);
      if (e.response.data?.errors) dispatch(setErrors(e.response.data.errors));
      return {
        data: false,
      };
    }
  }
);

export const updateLeadStatus = createAsyncThunk(
  "leadStatuses/update",
  async ({ id, formData }, { dispatch }) => {
    try {
      const response = await axios.put(`${baseURL}/${id}`, formData);
      toast.success(response.data.message);
      dispatch(setUpdatedLeadStatus({ id, name: formData.name }));
      return {
        data: true,
      };
    } catch (e) {
      toast.error(e.response.data.message);
      if (e.response.data?.errors) dispatch(setErrors(e.response.data.errors));
      return {
        data: false,
      };
    }
  }
);

export const deleteLeadStatus = createAsyncThunk(
  "leadStatuses/delete",
  async (id, { dispatch }) => {
    try {
      const response = await axios.delete(`${baseURL}/${id}`);
      toast.success(response.data.message);
      dispatch(deleteResource(id));
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

export const updateLeadStatusesOrder = createAsyncThunk(
  "leadStatuses/updateOrder",
  async (payload) => {
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

export const cloneLeadStatuses = createAsyncThunk(
  "leadStatuses/clone",
  async (payload) => {
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
  setLeadStatuses,
  setNewLeadStatuses,
  setUpdatedLeadStatus,
  deleteResource,
} = leadStatusesSlice.actions;

export default leadStatusesSlice.reducer;
