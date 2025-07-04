import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  amountData: [],
  productData: [],
  loading: false,
  error: null,
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setAmountData: (state, action) => {
      state.amountData = action.payload;
    },
    setProductData: (state, action) => {
      state.productData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setAmountData, setProductData, setLoading, setError } = salesSlice.actions;
export default salesSlice.reducer;