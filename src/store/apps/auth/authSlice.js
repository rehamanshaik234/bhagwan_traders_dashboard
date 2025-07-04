import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

export const loginUser = createAsyncThunk('auth/loginUser', async ({ username, password }, thunkAPI) => {
  try {
    const response = await axios.post('/user/authenticate', {
      UserName: username,
      UserPassword: password,
    });

    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('authUser', JSON.stringify(response.data.user));
      return response.data;
    } else {
      return thunkAPI.rejectWithValue(response.data.message);
    }
  } catch (error) {
    return thunkAPI.rejectWithValue('Login failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('authUser')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('authUser');
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
