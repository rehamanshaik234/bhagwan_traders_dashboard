import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newCustomers: [],
  loadingNew: false,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  dailyStats: [],
  monthlyStats: [],
  loadingStats: false,
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setLoadingNew(state, action) {
      state.loadingNew = action.payload;
    },
    setNewCustomers(state, action) {
      state.newCustomers = action.payload.data;
      state.pagination = action.payload.pagination;
    },
        setLoadingStats(state, action) {
      state.loadingStats = action.payload;
    },
    setDailyStats(state, action) {
      state.dailyStats = action.payload;
    },
    setMonthlyStats(state, action) {
      state.monthlyStats = action.payload;
    },
  },
});

export const { 
  setLoadingNew, 
  setNewCustomers, 
  setLoadingStats,
  setDailyStats,
  setMonthlyStats, 
} = customersSlice.actions;
export default customersSlice.reducer;
