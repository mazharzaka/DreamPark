import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    fetchFn: (input, init) => fetch(input, { ...init, cache: 'no-store' }),
  }),
  endpoints: (builder) => ({
    getHeroByPage: builder.query<any, { lang: string; pageKey: string }>({
      query: ({ lang, pageKey }) => `/hero/${lang}/${pageKey}`,
    }),
  }),
})

export const { useGetHeroByPageQuery } = apiSlice
