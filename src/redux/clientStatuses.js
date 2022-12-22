/* eslint-disable */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";
import ErrorHandler from "../utility/ErrorHandler";
axios.defaults.withCredentials = true;

const baseURL = `${process.env.REACT_APP_API_ENDPOINT}/api/client-statuses`;

export const clientStatusesSlice = createSlice({
  name: "clientStatuses",
  initialState: {
    errors: new ErrorHandler(),
    clientStatuses: [],
  },
  reducers: {
    setErrors: (state, { payload }) => {
      state.errors.setErrors(payload);
    },
    setClientStatuses: (state, { payload }) => {
      state.clientStatuses = payload;
    },
    setNewClientStatuses: (state, { payload }) => {
      const clientStatuses = [...state.clientStatuses, payload];
      state.clientStatuses = clientStatuses;
    },
    setUpdatedClientStatus: (state, { payload }) => {
      let clientStatuses = [...state.clientStatuses];
      let index = clientStatuses.findIndex((p) => p.id == payload.id);
      clientStatuses[index].name = payload.name;
      state.clientStatuses = clientStatuses;
    },
    deleteResource: (state, { payload }) => {
      state.clientStatuses = state.clientStatuses.filter(
        (p) => p.id != payload
      );
    },
  },
});

export const getClientStatuses = createAsyncThunk(
  "clientStatuses/index",
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(`${baseURL}`, {
        params: params,
      });
      dispatch(setClientStatuses(response.data.data));
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }
);

export const createClientStatus = createAsyncThunk(
  "clientStatuses/create",
  async (payload, { dispatch }) => {
    try {
      const response = await axios.post(`${baseURL}`, payload);
      toast.success(response.data.message);
      dispatch(setNewClientStatuses(response.data.data));
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

export const updateClientStatus = createAsyncThunk(
  "clientStatuses/update",
  async ({ id, formData }, { dispatch }) => {
    try {
      const response = await axios.put(`${baseURL}/${id}`, formData);
      toast.success(response.data.message);
      dispatch(setUpdatedClientStatus({ id, name: formData.name }));
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

export const deleteClientStatus = createAsyncThunk(
  "clientStatuses/delete",
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

export const updateClientStatusesOrder = createAsyncThunk(
  "clientStatuses/updateOrder",
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

export const cloneClientStatuses = createAsyncThunk(
  "clientStatuses/clone",
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
  setClientStatuses,
  setNewClientStatuses,
  setUpdatedClientStatus,
  deleteResource,
} = clientStatusesSlice.actions;

export default clientStatusesSlice.reducer;
