import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

// Fetch pending orders
export const fetchPendingOrders = createAsyncThunk(
  'orders/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/orders/pendingOrder');
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, newStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.patch('/orders/updateOrderStatus', {
        orderId,
        newStatus,
      });
      return { orderId, newStatus };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchDispatchedOrders = createAsyncThunk(
  'orders/fetchDispatched',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/orders/dispatchedOrder');
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchDeliveredOrders = createAsyncThunk(
  'orders/fetchDelivered',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/orders/deliveredOrder'); // Adjust if needed
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    pendingOrders: [],
    dispatchedOrders: [],
    deliveredOrders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingOrders = action.payload;
      })
      .addCase(fetchPendingOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchDispatchedOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDispatchedOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.dispatchedOrders = action.payload;
      })
      .addCase(fetchDispatchedOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId } = action.payload;
        state.pendingOrders = state.pendingOrders.filter((o) => o.id !== orderId);
      })
      .addCase(fetchDeliveredOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeliveredOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveredOrders = action.payload;
      })
      .addCase(fetchDeliveredOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
