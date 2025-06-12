import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/invoices`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchClientInvoices = createAsyncThunk(
  'invoices/fetchClientInvoices',
  async (clientId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/invoices/client/${clientId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProjectInvoices = createAsyncThunk(
  'invoices/fetchProjectInvoices',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/invoices/project/${projectId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchInvoiceById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/invoices/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/invoices`, invoiceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/updateInvoice',
  async ({ id, invoiceData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/invoices/${id}`, invoiceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/invoices/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendInvoiceEmail = createAsyncThunk(
  'invoices/sendInvoiceEmail',
  async ({ id, emailData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/invoices/${id}/send-email`,
        emailData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const downloadInvoicePDF = createAsyncThunk(
  'invoices/downloadInvoicePDF',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/invoices/${id}/pdf`, {
        responseType: 'blob',
      });
      return { id, blob: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  invoices: [],
  selectedInvoice: null,
  loading: false,
  error: null,
};

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch invoices';
      })
      // Fetch invoice by ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch invoice';
      })
      // Create invoice
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.push(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create invoice';
      })
      // Update invoice
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.invoices.findIndex(
          (invoice) => invoice._id === action.payload._id
        );
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.selectedInvoice?._id === action.payload._id) {
          state.selectedInvoice = action.payload;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update invoice';
      })
      // Delete invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.filter(
          (invoice) => invoice._id !== action.payload
        );
        if (state.selectedInvoice?._id === action.payload) {
          state.selectedInvoice = null;
        }
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete invoice';
      })
      // Send invoice email
      .addCase(sendInvoiceEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendInvoiceEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendInvoiceEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to send invoice email';
      })
      // Download invoice PDF
      .addCase(downloadInvoicePDF.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadInvoicePDF.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadInvoicePDF.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to download invoice PDF';
      })
      // Fetch client invoices
      .addCase(fetchClientInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchClientInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch client invoices';
      })
      // Fetch project invoices
      .addCase(fetchProjectInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchProjectInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch project invoices';
      });
  },
});

export const { clearError, clearSelectedInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer; 