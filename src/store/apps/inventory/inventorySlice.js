import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  categories: [],
  loading: false,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setProducts, setCategories, setLoading } = inventorySlice.actions;
export default inventorySlice.reducer;