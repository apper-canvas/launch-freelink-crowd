import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import * as invoiceService from '../../services/invoiceService';

// Async thunks
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await invoiceService.getInvoices();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchInvoiceById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoiceService.getInvoiceById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await invoiceService.createInvoice(invoiceData);
      toast.success('Invoice created successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to create invoice');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/updateInvoice',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await invoiceService.updateInvoice(id, data);
      toast.success('Invoice updated successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to update invoice');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      await invoiceService.deleteInvoice(id);
      toast.success('Invoice deleted successfully!');
      return id;
    } catch (error) {
      toast.error('Failed to delete invoice');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: {
    invoices: [],
    currentInvoice: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.invoices = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.currentInvoice = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoices.push(action.payload);
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        state.currentInvoice = action.payload;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter(inv => inv.id !== action.payload);
        if (state.currentInvoice?.id === action.payload) {
          state.currentInvoice = null;
        }
      });
  }
});

export default invoiceSlice.reducer;