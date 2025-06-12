import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchRecentInvoices = createAsyncThunk(
  'dashboard/fetchRecentInvoices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/recent-invoices`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUpcomingPayments = createAsyncThunk(
  'dashboard/fetchUpcomingPayments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/upcoming-payments`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchRevenueStats = createAsyncThunk(
  'dashboard/fetchRevenueStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/revenue-stats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  stats: {
    totalRevenue: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    totalClients: 0,
    totalProjects: 0,
  },
  recentInvoices: [],
  upcomingPayments: [],
  revenueStats: {
    monthly: [],
    yearly: [],
  },
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch dashboard stats';
      })
      // Fetch recent invoices
      .addCase(fetchRecentInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.recentInvoices = action.payload;
      })
      .addCase(fetchRecentInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch recent invoices';
      })
      // Fetch upcoming payments
      .addCase(fetchUpcomingPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingPayments = action.payload;
      })
      .addCase(fetchUpcomingPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch upcoming payments';
      })
      // Fetch revenue stats
      .addCase(fetchRevenueStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueStats.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueStats = action.payload;
      })
      .addCase(fetchRevenueStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch revenue stats';
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer; 