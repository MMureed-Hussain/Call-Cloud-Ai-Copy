// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;

// Perform Login API and set user data in store
export const login = createAsyncThunk("auth/login", async (payload) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}/login`,
      payload
    );
    window.location.href = "/";
    return {
      data: {
        user: response.data,
      },
    };
  } catch (e) {
    console.log(e);
    toast.error(e.response.data.message);
    return {
      data: {
        user: false,
      },
    };
  }
});

export const googlelogin = createAsyncThunk("auth/googlelogin", async (payload) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/auth/google/callback?${payload.params}`
    );
    if (response.data.message === 'Please verify your email first') {        
      alert(response.data.message);
      window.location.href = "/login";
    } else {
      window.location.href = "/";
    }
    return {
      data: {
        user: response.data,
      },
    };
  } catch (e) {
    console.log(e);
    toast.error(e.response.data.message);
    return {
      data: {
        user: false,
      },
    };
  }
});

export const emailverification = createAsyncThunk("auth/emailverification", async (payload) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}/api/verify-email?token=${payload.params.slice(0, -1)}`);
    window.location.href = "/";
    return {
      data: {
        user: response.data,
      },
    };
  } catch (e) {
    console.log(e);
    toast.error(e.response.data.message);
    return {
      data: {
        user: false,
      },
    };
  }
});

// Perform Register API and set user data in store
export const register = createAsyncThunk("auth/register", async (payload) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}/register`,
      payload
    );
    return {
      data: {
        user: response.data,
      },
    };
  } catch (e) {
    console.log(e);
    toast.error(e.response.data.message);
    return {
      data: {
        user: false,
      },
    };
  }
});

// Perform forgot password API to trigger password reset mail
export const forgotPasswordRequest = createAsyncThunk(
  "auth/forgotPasswordRequest",
  async (payload) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/forgot-password`,
        payload
      );
      toast.success(response.data.message);
      return {
        data: true,
      };
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
      return {
        data: false,
      };
    }
  }
);

// Perform reset password API to update password
export const resetPasswordRequest = createAsyncThunk(
  "auth/resetPasswordRequest",
  async (payload) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/reset-password`,
        payload
      );
      toast.success(response.data.message, { duration: 6000 });
      return {
        data: true,
      };
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
      return {
        data: false,
      };
    }
  }
);

// Perform update profile API to update profile data
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (payload) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/profile`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message, { duration: 6000 });
      return {
        data: {
          user: response.data.user,
        },
      };
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
      return {
        data: false,
      };
    }
  }
);

// Perform update password API to update/change password
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (payload) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/update-password`,
        payload
      );
      toast.success(response.data.message, { duration: 6000 });
      return {
        data: true,
      };
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message, { duration: 6000 });
      return {
        data: false,
      };
    }
  }
);

// Perform CSRF API to set cookie for future API calls
export const csrf = createAsyncThunk("auth/csrf", async () => {
  try {
    await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/sanctum/csrf-cookie`
    );
  } catch (e) {
    console.log(e);
  }
});

// Peform get user profile API and add user data in store
export const getUser = createAsyncThunk("auth/getUser", async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/profile`
    );
    return {
      data: {
        user: response.data,
      },
    };
  } catch {
    return {
      data: {
        user: null,
      },
    };
  }
});

// Peform get user profile API and add user data in store
export const sendMailVerificationLink = createAsyncThunk(
  "auth/sendMailVerificationLink",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/email/verification-notification`
      );
      toast.success(response.data.message, { duration: 6000 });
      return {
        data: true,
      };
    } catch (e) {
      toast.error(e.response.data.message, { duration: 6000 });
      return {
        data: false,
      };
    }
  }
);

// Perform logout action and remove user from store
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/logout`);
    window.location.href = "/login";
    return {
      user: null,
    };
  } catch (e) {
    console.log(e);
  }
});

// Perform delete account api and redirect user to /login page
export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async () => {
    try {
      await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/delete-account`
      );
      window.location.href = "/login";
      return {
        user: null,
      };
    } catch (e) {
      console.log(e);
    }
  }
);

// prettier-ignore
//const user = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null;
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: true
  },
  reducers: {
    // handleSearchQuery: (state, action) => {
    //   state.query = action.payload
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
        state.loading = false;
      })
      .addCase(emailverification.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
        state.loading = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
        state.loading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
        state.loading = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.user = action.payload.data.user;
        }
      });
  },
});

export default authSlice.reducer;
