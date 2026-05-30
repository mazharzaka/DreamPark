import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { RootState } from "../../store";
import { setCredentials, clearCredentials, UserProfile } from "./authSlice";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, "")}/api`
    : "https://ms5k0c9j-5000.uks1.devtunnels.ms/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          { url: "/auth/refresh", method: "POST" },
          api,
          extraOptions,
        );
        if (refreshResult.data) {
          const data = refreshResult.data as {
            token: string;
            data: { user: UserProfile };
          };
          api.dispatch(
            setCredentials({ token: data.token, user: data.data.user }),
          );
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(clearCredentials());
          // api.dispatch(authApi.util.resetApiState()); // Cannot dispatch directly here if cyclical dependency, but we can clear credentials.
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["UserProfile", "UserBookings"],
  endpoints: (builder) => ({
    signUpWithPassword: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "/auth/signup",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["UserProfile"],
    }),
    verifyAccountOTP: builder.mutation<any, any>({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserProfile"],
    }),
    loginWithPassword: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["UserProfile"],
    }),
    sendOtp: builder.mutation<any, any>({
      query: (data) => ({
        url: "/auth/send-otp",
        method: "POST",
        body: data,
      }),
    }),
    resetPasswordWithOTP: builder.mutation<any, any>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    logoutServer: builder.mutation<any, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["UserProfile", "UserBookings"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearCredentials());
        } catch (error) {
          // even if network fails, clear local
          dispatch(clearCredentials());
        }
      },
    }),
    getProfile: builder.query<any, void>({
      query: () => "/auth/profile",
      providesTags: ["UserProfile"],
    }),
    getUserBookings: builder.query<
      any,
      { from: string; sort: string; order: string }
    >({
      query: (params) => ({
        url: `/tickets/bookings/user`,
        params,
      }),
      providesTags: ["UserBookings"],
    }),
    changeBookingDate: builder.mutation<
      any,
      { bookingId: string; visitDate: string }
    >({
      query: ({ bookingId, visitDate }) => ({
        url: `/v1/bookings/${bookingId}/change-date`,
        method: "PATCH",
        body: { visitDate },
      }),
      invalidatesTags: ["UserBookings"],
    }),
  }),
});

export const {
  useSignUpWithPasswordMutation,
  useVerifyAccountOTPMutation,
  useLoginWithPasswordMutation,
  useSendOtpMutation,
  useResetPasswordWithOTPMutation,
  useLogoutServerMutation,
  useGetProfileQuery,
  useGetUserBookingsQuery,
  useChangeBookingDateMutation,
} = authApi;
