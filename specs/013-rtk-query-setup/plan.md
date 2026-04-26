# Implementation Plan: RTK Query Setup

**Branch**: `013-rtk-query-setup` | **Date**: 2026-04-26 | **Spec**: [spec.md](./spec.md)

## Summary

Integrate Redux Toolkit Query with Next.js 16 (App Router) to manage server-side prefetching and client-side hydration for the DreamPark application. This includes creating a centralized API slice pointing to the backend, configuring an SSR-safe `makeStore` pattern, and using `StoreProvider`. Caching will be managed strictly by RTK Query by bypassing Next.js's native fetch caching.

## Technical Context

**Language/Version**: TypeScript / React 18 / Next.js 16
**Primary Dependencies**: `@reduxjs/toolkit`, `react-redux`, `framer-motion`
**Storage**: Redux In-Memory State
**Testing**: N/A
**Target Platform**: Web (Next.js App Router)
**Project Type**: Web Application Frontend (`my-app` directory)
**Performance Goals**: Avoid duplicate client-side network requests after SSR hydration.
**Constraints**: SSR safety (prevent state leakage across requests).

## Constitution Check

*GATE: Passed*
- **Modular Architecture**: N/A (Frontend only).
- **ES Modules**: Followed standard Next.js TS imports.
- **Consistent API Response Contract**: RTK Query will be designed to handle the `{ success, data }` and `{ success, error }` shapes defined in the constitution.
- **Mandatory Error Handling**: Handled via `try/catch` on SSR prefetching as per clarifications.

## Project Structure

### Documentation (this feature)

```text
specs/013-rtk-query-setup/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── quickstart.md        # Phase 1 output
```

### Source Code (repository root)

```text
my-app/
├── src/
│   ├── app/
│   │   ├── StoreProvider.tsx
│   │   └── page.tsx (integration example)
│   └── lib/
│       ├── store.ts
│       └── features/
│           └── api/
│               └── apiSlice.ts
```

**Structure Decision**: The frontend store will reside in `my-app/src/lib/`, separating the Redux logic from React components. The `StoreProvider` sits at the top level to wrap the app safely.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
