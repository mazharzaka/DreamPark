import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthSession {
  token: string | null;
  isAuthenticated: boolean;
}

// Initial state reads from localStorage if available (hydration logic)
const getInitialToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const initialToken = getInitialToken();

const initialState: AuthSession = {
  token: initialToken,
  isAuthenticated: !!initialToken,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload);
      }
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
  },
});

export const { setToken, logout } = authSlice.actions;

export default authSlice.reducer;
