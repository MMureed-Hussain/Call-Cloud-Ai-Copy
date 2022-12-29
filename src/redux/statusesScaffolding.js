/* eslint-disable */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";
import ErrorHandler from "../utility/ErrorHandler";
axios.defaults.withCredentials = true;

export default function (moduleName, pathName) {
  const baseURL = `${process.env.REACT_APP_API_ENDPOINT}/api/${pathName}`;

  const statusesSlice = createSlice({
    name: moduleName,
    initialState: {
      errors: new ErrorHandler(),
      statuses: [],
    },
    reducers: {
      setErrors: (state, { payload }) => {
        state.errors.setErrors(payload);
      },
      setStatuses: (state, { payload }) => {
        state.statuses = payload;
      },
      setNewStatuses: (state, { payload }) => {
        const statuses = [...state.statuses, payload];
        state.statuses = statuses;
      },
      setUpdatedStatus: (state, { payload }) => {
        let statuses = [...state.statuses];
        let index = statuses.findIndex((p) => p.id == payload.id);
        statuses[index].name = payload.name;
        state.statuses = statuses;
      },
      deleteResource: (state, { payload }) => {
        state.statuses = state.statuses.filter((p) => p.id != payload);
      },
    },
  });

  const {
    setErrors,
    setStatuses,
    setNewStatuses,
    setUpdatedStatus,
    deleteResource,
  } = statusesSlice.actions;

  const getStatuses = createAsyncThunk(
    `${moduleName}/index`,
    async (params, { dispatch }) => {
      try {
        const response = await axios.get(`${baseURL}`, {
          params: params,
        });
        dispatch(setStatuses(response.data.data));
      } catch (e) {
        toast.error(e.response.data.message);
      }
    }
  );

  const createStatus = createAsyncThunk(
    `${moduleName}/create`,
    async (payload, { dispatch }) => {
      try {
        const response = await axios.post(`${baseURL}`, payload);
        toast.success(response.data.message);
        dispatch(setNewStatuses(response.data.data));
        return {
          data: true,
        };
      } catch (e) {
        toast.error(e.response.data.message);
        if (e.response.data?.errors)
          dispatch(setErrors(e.response.data.errors));
        return {
          data: false,
        };
      }
    }
  );

  const updateStatus = createAsyncThunk(
    `${moduleName}/update`,
    async ({ id, formData }, { dispatch }) => {
      try {
        const response = await axios.put(`${baseURL}/${id}`, formData);
        toast.success(response.data.message);
        dispatch(setUpdatedStatus({ id, name: formData.name }));
        return {
          data: true,
        };
      } catch (e) {
        toast.error(e.response.data.message);
        if (e.response.data?.errors)
          dispatch(setErrors(e.response.data.errors));
        return {
          data: false,
        };
      }
    }
  );

  const deleteStatus = createAsyncThunk(
    `${moduleName}/delete`,
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

  const updateStatusesOrder = createAsyncThunk(
    `${moduleName}/updateOrder`,
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

  const cloneStatuses = createAsyncThunk(
    `${moduleName}/clone`,
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

  return {
    getStatuses,
    createStatus,
    updateStatus,
    deleteStatus,
    cloneStatuses,
    updateStatusesOrder,
    setErrors,
    setStatuses,
    setNewStatuses,
    setUpdatedStatus,
    deleteResource,
    reducer: statusesSlice.reducer,
  };
}
