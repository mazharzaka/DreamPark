# Quickstart

## Adding a New RTK Query Endpoint
1. Open `my-app/src/lib/features/api/apiSlice.ts`.
2. Add a new builder under `endpoints`:
```ts
getAttractions: builder.query<Attraction[], void>({
  query: () => '/attractions',
})
```
3. Export the auto-generated hook: 
```ts
export const { useGetHeroByPageQuery, useGetAttractionsQuery } = apiSlice;
```

## Server-Side Prefetching
In a Server Component (`page.tsx`):
```tsx
import { makeStore } from '@/lib/store';
import { apiSlice } from '@/lib/features/api/apiSlice';

export default async function Page() {
  const store = makeStore();
  
  try {
    store.dispatch(apiSlice.endpoints.getHeroByPage.initiate('home'));
    await Promise.all(store.dispatch(apiSlice.util.getRunningQueries()));
  } catch (err) {
    // Gracefully handle SSR fetch failure; client will retry
  }

  // Pass preloaded state or just render Client Components 
  // that use the useGetHeroByPageQuery hook.
}
```

## Using in a Client Component
```tsx
'use client';
import { useGetHeroByPageQuery } from '@/lib/features/api/apiSlice';
import { motion } from 'framer-motion';

export default function HeroSlider() {
  const { data, isLoading, isError } = useGetHeroByPageQuery('home');
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data (Retried on client)</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Render hero content */}
    </motion.div>
  );
}
```
