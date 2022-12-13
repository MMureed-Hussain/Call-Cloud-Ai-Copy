/* eslint-disable */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";
import ErrorHandler from "../utility/ErrorHandler";
axios.defaults.withCredentials = true;

axios.defaults.baseURL = `${process.env.REACT_APP_API_ENDPOINT}/api/statuses`;

export const statusesSlice = createSlice({
  name: "statuses",
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
    setNewStatus: (state, { payload }) => {
      const statuses = [...state.statuses, payload];
      state.statuses = statuses;
    },
    setUpdatedStatus: (state, { payload }) => {
      let statuses = [...state.statuses];
      let index = statuses.findIndex((p) => p.id == payload.id);
      statuses[index].name = payload.name;
      state.statuses = statuses;
    },
    deleteCallStatus: (state, { payload }) => {
      state.statuses = state.statuses.filter((p) => p.id != payload);
    },
  },
});

export const createStatus = createAsyncThunk(
  "statuses/create",
  async (payload, { dispatch }) => {
    try {
      const response = await axios.post(``, payload);
      toast.success(response.data.message);
      dispatch(setNewStatus(response.data.data));
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

export const getStatuses = createAsyncThunk(
  "statuses/index",
  async (params, { dispatch }) => {
    try {
<<<<<<< HEAD
      const response = await axios.get(``, {
        params: { workspace_id: workspaceId },
      });
=======
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/statuses`,
        {
          params,
        }
      );
>>>>>>> 525d0e432e7082224b1ca23b075509c4eedbbefa
      dispatch(setStatuses(response.data.data));
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }
);

export const deleteStatus = createAsyncThunk(
  "statuses/delete",
  async (id, { dispatch }) => {
    try {
      const response = await axios.delete(`/${id}`);
      toast.success(response.data.message);
      dispatch(deleteCallStatus(id));
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

export const updateStatus = createAsyncThunk(
  "statuses/update",
  async ({ id, formData }, { dispatch }) => {
    try {
      const response = await axios.put(`/${id}`, formData);
      toast.success(response.data.message);
      dispatch(setUpdatedStatus({ id, name: formData.name }));
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

export const updateStatusOrder = createAsyncThunk(
  "statuses/updateOrder",
  async (payload) => {
    try {
      const response = await axios.post(`/update-order`, {
        data: payload,
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
  setStatuses,
  setNewStatus,
  setUpdatedStatus,
  deleteCallStatus,
} = statusesSlice.actions;

export default statusesSlice.reducer;
