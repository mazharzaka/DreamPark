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
    getAttractions: builder.query<any, { lang: string, category?: string }>({
      query: () => `/attractions/en/home?page=1&limit=10&sort=createdAt&order=asc`,
    })
  })
})

export const { useGetHeroByPageQuery, useGetAttractionsQuery } = apiSlice
