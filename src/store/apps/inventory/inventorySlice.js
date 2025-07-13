import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  categories: [],
  meta: { total: 0, page: 1, limit: 10 },
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
    setMeta: (state, action) => {
    state.meta = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setProducts, setCategories, setMeta, setLoading } = inventorySlice.actions;
export default inventorySlice.reducer;