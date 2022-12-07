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
    reloadTable: false
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
    setReloadTable: (state, { payload }) => {
        state.reloadTable = payload;
    }
  },
});

export const getPipelines = createAsyncThunk(
  "pipelines/index",
  async (workspaceId, { dispatch }) => {
    try {
      const response = await axios.get(`/`, {
        params: { workspace_id: workspaceId },
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

// Delete
export const deletePipeline = createAsyncThunk(
  "pipelines/delete",
  async (url, { dispatch }) => {
    try {
      const response = await axios.delete(url);
      toast.success(response.data.message);
      dispatch(setReloadTable(true));
    //   window.location.reload(false);
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

export const { setErrors, setPipelines, setNewPipeline, setUpdatedPipeline, setReloadTable } =
  pipelinesSlice.actions;

export default pipelinesSlice.reducer;

