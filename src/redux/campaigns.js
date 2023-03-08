/* eslint-disable */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";
import ErrorHandler from "../utility/ErrorHandler";

axios.defaults.withCredentials = true;
const baseURL = `${process.env.REACT_APP_API_ENDPOINT}/api/campaigns`;

export const campaignsSlice = createSlice({
  name: "campaigns",
  initialState: {
    errors: new ErrorHandler(),
    campaigns: [],
    teams: [],
    reload: false,
  },
  reducers: {
    setErrors: (state, { payload }) =>
    {
      state.errors.setErrors(payload);
    },
    setCampaigns: (state, { payload }) =>
    {
      state.campaigns = payload;
    },
    setTeams: (state, { payload }) =>
    {
      state.teams = payload;
    },
    setReload: (state, { payload }) =>
    {
      state.reload = payload;
    }

  },
});


export const getCampaignsList = createAsyncThunk(
  "campaigns/index",
  async (params, { dispatch }) =>
  {
    try {
      const response = await axios.get(`${baseURL}`, { params });
      dispatch(setCampaigns(response.data));
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }
);


export const getTeamsByWorkspace = createAsyncThunk(
  "campaigns/teams",
  async ({ id }, { dispatch }) =>
  {
    try {
      const response = await axios.get(`${baseURL}/teams/${id}`);
      dispatch(setTeams(response.data));
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }
);

export const storeOrUpdate = createAsyncThunk(
  "campaigns/storeOrUpdate",
  async (params, { dispatch }) =>
  {
    try {
      const response = await axios.post(`${baseURL}`, params);
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


export const deleteCampaign = createAsyncThunk(
  "campaigns/deleteCampaign",
  async (id, { dispatch }) =>
  {
    try {
      const response = await axios.delete(`${baseURL}/delete/${id}`);
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

export const {
  setErrors,
  setCampaigns,
  setTeams,
  setReload,
} = campaignsSlice.actions;

export default campaignsSlice.reducer;
