import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../utils/api';
import type { LoginPayload, RegisterPayload, User } from '../types/forum';

type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type AuthState = {
  user: User | null;
  initialized: boolean;
  status: AsyncStatus;
  registerStatus: AsyncStatus;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  initialized: false,
  status: 'idle',
  registerStatus: 'idle',
  error: null,
};

export const preloadAuth = createAsyncThunk('auth/preload', async () => {
  if (!api.getAccessToken()) {
    return null;
  }

  try {
    return await api.getOwnProfile();
  } catch {
    api.removeAccessToken();
    return null;
  }
});

export const loginUser = createAsyncThunk('auth/login', async (payload: LoginPayload) => {
  // const token = await api.login(payload);
  // api.putAccessToken(token);
  // return api.getOwnProfile();
});

export const registerUser = createAsyncThunk('auth/register', async (payload: RegisterPayload) => {
  return api.register(payload);
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  api.removeAccessToken();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(preloadAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(preloadAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initialized = true;
        state.status = 'idle';
      })
      .addCase(preloadAuth.rejected, (state) => {
        state.user = null;
        state.initialized = true;
        state.status = 'idle';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initialized = true;
        state.status = 'succeeded';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.status = 'failed';
        state.error = action.error.message ?? 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerStatus = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = 'failed';
        state.error = action.error.message ?? 'Registration failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export type { AuthState };
export default authSlice.reducer;
