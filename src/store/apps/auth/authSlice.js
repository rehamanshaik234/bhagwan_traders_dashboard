import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';
import { messaging, getToken, onMessage } from './../../../firebase';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await axios.post('/user/authenticate', {
        UserName: username,
        UserPassword: password,
      });

      if (response.data.success && response.data.token) {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('authUser', JSON.stringify(user));

        // ✅ Get FCM token after login
        const fcmToken = await getToken(messaging, {
          vapidKey: 'BDE1cpQDSHlLV4r8zNJ6dDyY_lc1f66nwsLI-bKMTV_QIOAAFzy-tj5P1o8usGkGnk-ZUpJmR4NZXjSS7DC4K60',
        });

        if (fcmToken) {
          console.log('🔑 FCM token after login:', fcmToken);

          // ✅ OPTIONAL: Send it to backend
          await axios.post('/user/save-fcm-token', {
            token: fcmToken,
            userId: user.id,
          });

          // Optional: store in redux
          thunkAPI.dispatch(setFcmToken(fcmToken));
        }

        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.data.message);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue('Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('authUser')) || null,
    token: localStorage.getItem('token') || null,
    fcm_token: "",
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
      state.fcm_token = "";
    },
  setFcmToken: (state, action) => {
    state.fcm_token = action.payload;
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

export const { logout, setFcmToken } = authSlice.actions;
export default authSlice.reducer;
