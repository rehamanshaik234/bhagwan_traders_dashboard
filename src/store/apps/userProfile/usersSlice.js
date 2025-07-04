import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setLoadingUsers(state, action) {
      state.loading = action.payload;
    },
    setUsers(state, action) {
      state.users = action.payload;
    },
  },
});

export const { setLoadingUsers, setUsers } = usersSlice.actions;
export default usersSlice.reducer;
