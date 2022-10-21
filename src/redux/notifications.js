// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";

axios.defaults.withCredentials = true;

// Perform get single notification for user
export const getSingleNotification = createAsyncThunk(
  "notifications/getSingleNotification",
  async (payload) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/user_notification/${payload.id}`
      );
      // toast.success(response.data.message);
      return {
        data: response.data,
      };
    } catch (e) {
      return {
        data: [],
      };
    }
  }
);

// Perform add workspace API
export const readNotification = createAsyncThunk(
  "notifications/readNotification",
  async (payload) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/notification/${payload.id}`,
        payload,
      );

      // toast.success(response.data.message);
      return {
        data: {
          notification: null,
        },
      };
    } catch (e) {
      console.log(e);
      // toast.error(e.response.data.message);
      return {
        data: {
          notification: null,
        },
      };
    }
  }
);

// prettier-ignore
export const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    // Notifications table related attributes
    notification: [],
    loading: true,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSingleNotification.fulfilled, (state, action) => {
        state.notification = action.payload.data;
        state.loading = false;
      })
      // .addCase(markReadNotification.fulfilled, (state) => {
      //   state.notification = [];
      // });
  },
});

export default notificationsSlice.reducer;
