# Phase 0: Research

## Decision: Next.js App Router Store Setup
**Rationale**: In Next.js App Router, the store should not be defined as a global variable. A `makeStore` function is required to ensure a new store instance is created for each incoming server request to prevent state leakage between users.
**Alternatives considered**: A global `store.ts` exported directly (rejected due to SSR leakage risk).

## Decision: SSR Prefetching Pattern
**Rationale**: Prefetching data on the server requires dispatching endpoints in a Server Component using `store.dispatch(endpoints.someQuery.initiate())` and awaiting `Promise.all(store.dispatch(apiSlice.util.getRunningQueries()))`. If this fails, the error will be caught, returning empty data so the client can retry.
**Alternatives considered**: Using `React Server Components` native fetch directly without Redux (rejected because the spec mandates RTK Query integration).

## Decision: Caching Strategy
**Rationale**: Native Next.js `fetch` caching is disabled via `cache: 'no-store'` in the `fetchBaseQuery`. RTK Query handles all caching using its internal mechanisms to avoid stale data conflicts.
**Alternatives considered**: Relying on Next.js fetch cache (rejected in Clarification stage to ensure RTK Query is the single source of truth).
