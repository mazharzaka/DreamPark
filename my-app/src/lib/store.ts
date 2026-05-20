import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './features/api/apiSlice'
import { bookingsApi } from './features/api/bookingsApi'

export const makeStore = () => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      [bookingsApi.reducerPath]: bookingsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(apiSlice.middleware)
        .concat(bookingsApi.middleware),
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
