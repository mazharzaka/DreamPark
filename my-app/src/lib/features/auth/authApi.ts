import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';
import { logout } from './authSlice';

// Entity Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: UserProfile;
}

export interface AuthError {
  success: boolean;
  error: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    signUp: builder.mutation<AuthResponse, any>({
      query: (credentials) => ({
        url: '/auth/signup',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation<AuthResponse, any>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getProfile: builder.query<UserProfile, void>({
      query: () => '/auth/profile',
      providesTags: ['User'],
      // Passive 401 detection is generally handled at the component level or by a custom baseQuery
      // Alternatively we can use an onQueryStarted to listen to the query and dispatch logout
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          if (error.error?.status === 401) {
            dispatch(logout());
            dispatch(authApi.util.resetApiState());
          }
        }
      },
    }),
  }),
});

export const { useSignUpMutation, useLoginMutation, useGetProfileQuery } = authApi;
