// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;

// Perform get companies list API and set companies data in store
export const getData = createAsyncThunk(
    "companies/getData",
    async (payload) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/api/companies`,
          { params: { ...payload } },
        );
        return {
          data: {
            companies: response.data.companies,
            total: response.data.total,
          },
        };
      } catch (e) {
        console.log(e);
        toast.error(e.response.data.message);
        return {
          data: {
            companies: [],
          },
        };
      }
    }
);

// Perform add company API
export const addCompany = createAsyncThunk(
    "companies/addCompany",
    async (payload) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_ENDPOINT}/api/company`,
          payload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        toast.success(response.data.message);
        return {
          data: {
            company: response.data,
          },
        };
      } catch (e) {
        console.log(e);
        toast.error(e.response.data.message);
        return {
          data: {
            company: null,
          },
        };
      }
    }
);

export const updateCompany = createAsyncThunk(
    "companies/updateCompany",
    async (payload, { getState }) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_ENDPOINT}/api/company/${payload.id}`,
          { name: payload.name, logo: payload.logo },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const isCurrentCompany =
          getState().companies.currentCompany.id === payload.id;
        toast.success(response.data.message);
        return {
          data: {
            company: response.data.company,
            isCurrentCompany,
          },
        };
      } catch (e) {
        console.log(e);
        toast.error(e.response.data.message);
        return {
          data: {
            company: null,
          },
        };
      }
    }
);

// Perform delete company API
export const deleteCompany = createAsyncThunk(
    "companies/deleteCompany",
    async (payload) => {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_ENDPOINT}/api/company/${payload.id}`
        );
  
        toast.success(response.data.message);
        return {
          data: null,
        };
      } catch (e) {
        console.log(e);
        toast.error(e.response.data.message);
        return {
          data: null,
        };
      }
    }
);

export const companiesSlice = createSlice({
    name: "companies",
    initialState: {
      //Company table related attributes
      companies: [],
      loading: true,
      total: 0,
      currentPage:1,
      rowsPerPage:50,
  
      //Company users table related attributes
      users:[],
      usersLoading:true,
      totalUsers: 0,
      rowsPerPageUser:50,
      currentPageUser:1,
  
  
      currentCompany: null,
      recentlyAccessedCompanies: false
    },
    reducers: {
      storeCurrentPage: (state, action) => {
        state.currentPage = action.payload.currentPage
      },
      storeRowsPerPage: (state, action) => {
        state.rowsPerPage = action.payload.rowsPerPage
      },
      storeCurrentPageUser: (state, action) => {
        state.currentPageUser = action.payload.currentPage
      },
      storeRowsPerPageUser: (state, action) => {
        state.rowsPerPageUser = action.payload.rowsPerPage
      },
      storeCurrentCompany: (state, action) => {
        state.currentCompany = action.payload.company
      },
      getCompany: (state, action) => {
        state.query = action.payload
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(getData.fulfilled, (state, action) => {
          state.companies = action.payload.data.companies;
          state.total = action.payload.data.total;
          state.loading = false;
        })
        .addCase(addCompany.fulfilled, (state, action) => {
          if (action.payload.data.company) {
            console.log("No need to update store", state, action)
          }
        })
        .addCase(updateCompany.fulfilled, (state, action) => {
          if (action.payload.data.company && action.payload.data.isCurrentCompany) {
            state.currentCompany = action.payload.data.company;
          }
        })
        .addCase(deleteCompany.fulfilled, (state, action) => {
          console.log("No need to update store", state, action)
        })
    },
});
  
export const {
    getCompany,
    storeRowsPerPage,
    storeCurrentPage,
    storeCurrentCompany,
} = companiesSlice.actions;
  
export default companiesSlice.reducer;
  