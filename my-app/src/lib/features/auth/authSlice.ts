import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  linkedProviders: { provider: string; providerId: string }[];
}

export interface AuthState {
  accessToken: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: UserProfile }>
    ) => {
      state.accessToken = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        document.cookie = "dream_session_active=true; path=/; max-age=31536000; SameSite=Lax";
      }
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        document.cookie = "dream_session_active=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
      }
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
