import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: (process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, "")}/api` : "https://smfxhlj1-5000.euw.devtunnels.ms/api"),
    fetchFn: (input, init) => fetch(input, { ...init, cache: 'no-store' }),
  }),
  endpoints: (builder) => ({
    getHeroByPage: builder.query<any, { lang: string; pageKey: string }>({
      query: ({ lang, pageKey }) => `/hero/${lang}/${pageKey}`,
    }),
    getAttractions: builder.query<any, { lang: string; pageKey: string; category?: string }>({
      query: ({ lang, pageKey, category }) =>
        `/attractions/${lang}/${pageKey}?sort=createdAt&order=asc${category ? `&category=${category}` : ''}`,
    }),
    getAttractionById: builder.query<any, { lang: string; id: string }>({
      query: ({ lang, id }) => `/attractions/${id}?lang=${lang}`, // The backend attractionController uses req.query.lang or just returns it? 
      // Actually wait, let me check backend route for attraction by id.
    })
  })
})

export const { useGetHeroByPageQuery, useGetAttractionsQuery } = apiSlice
