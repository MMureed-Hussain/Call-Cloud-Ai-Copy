/* eslint-disable */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// ** Axios Imports
import axiosPkg from "axios";
import toast from "react-hot-toast";
import ErrorHandler from "../utility/ErrorHandler";

const axios = axiosPkg.create({
  baseURL: `${process.env.REACT_APP_API_ENDPOINT}/api/pipelines`,
  withCredentials: true,
});

export const pipelinesSlice = createSlice({
  name: "pipelines",
  initialState: {
    errors: new ErrorHandler(),
    pipelines: [],
  },
  reducers: {
    setErrors: (state, { payload }) => {
      state.errors.setErrors(payload);
    },
    setPipelines: (state, { payload }) => {
      state.pipelines = payload;
    },
    setNewPipeline: (state, { payload }) => {
      const pipelines = [...state.pipelines, payload];
      state.pipelines = pipelines;
    },
    setUpdatedPipeline: (state, { payload }) => {
      let pipelines = [...state.pipelines];
      let index = pipelines.findIndex((p) => p.id == payload.id);
      pipelines[index].name = payload.name;
      state.pipelines = pipelines;
    },
    deleteResource: (state, { payload }) => {
      state.pipelines = state.pipelines.filter((p) => p.id != payload);
    },
  },
});

export const getPipelines = createAsyncThunk(
  "pipelines/index",
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(`/`, {
        params
      });
      dispatch(setPipelines(response.data.data));
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }
);

export const createPipeline = createAsyncThunk(
  "pipelines/create",
  async (payload, { dispatch }) => {
    try {
      const response = await axios.post(`/`, payload);
      toast.success(response.data.message);
      dispatch(setNewPipeline(response.data.data));
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

export const updatePipeline = createAsyncThunk(
  "pipelines/update",
  async ({ id, formData }, { dispatch }) => {
    try {
      const response = await axios.put(`/${id}`, formData);
      toast.success(response.data.message);
      dispatch(setUpdatedPipeline({ id, name: formData.name }));
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

export const deletePipeline = createAsyncThunk(
  "pipelines/delete",
  async (id, { dispatch }) => {
    try {
      const response = await axios.delete(`/${id}`);
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

export const updatePipelinesOrder = createAsyncThunk(
  "pipelines/updateOrder",
  async (payload) => {
    try {
      const response = await axios.post(`/update-order`, {
        data: payload
      });
      // toast.success(response.data.message);
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
  setPipelines,
  setNewPipeline,
  setUpdatedPipeline,
  deleteResource,
} = pipelinesSlice.actions;

export default pipelinesSlice.reducer;
