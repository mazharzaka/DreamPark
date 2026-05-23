import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './features/api/apiSlice'
import { bookingsApi } from './features/api/bookingsApi'
import authReducer from './features/auth/authSlice'
import { authApi } from './features/auth/authApi'
import bookingReducer from './features/booking/bookingSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      [bookingsApi.reducerPath]: bookingsApi.reducer,
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      booking: bookingReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(apiSlice.middleware)
        .concat(bookingsApi.middleware)
        .concat(authApi.middleware),
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
