# Implementation Plan: Global Auth State Management (RTK + RTK Query)

**Branch**: `023-rtk-auth-state` | **Date**: 2026-05-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/023-rtk-auth-state/spec.md`

## Summary

Implement a global state management architecture for authentication and user profiles in the Next.js frontend using Redux Toolkit and RTK Query. This includes handling Sign Up and Login, storing the JWT in Redux and `localStorage` (dual-layer), automatically attaching the token to protected requests via RTK Query `prepareHeaders`, and managing cache invalidation upon auth state changes.

## Technical Context

**Language/Version**: TypeScript / React 19 / Next.js 16
**Primary Dependencies**: `@reduxjs/toolkit` (^2.5.0), `react-redux` (^9.1.0)
**Storage**: Redux Store (Runtime), browser `localStorage` (Persistence)
**Testing**: N/A (No specific testing framework mandated in spec, relying on manual/scenario testing)
**Target Platform**: Web browsers (Next.js client-side components)
**Project Type**: Web application frontend
**Performance Goals**: Fast UI updates, unauthenticated profile requests blocked client-side instantly.
**Constraints**: Token storage uses Redux + `localStorage`. Passive 401 detection for expiry. Console logging only for errors.
**Scale/Scope**: Unified auth flow spanning login, registration, and profile retrieval.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The provided `constitution.md` is strictly for the Backend (`Dream Park Backend Constitution`), focusing on Controller-Route-Model architecture, Express, and Mongoose. This feature is entirely within the Frontend (`my-app`), so backend constraints do not apply directly. However, we assume the backend adheres to its API Design Standards (e.g., standard JSON response shapes).

- **Principle I-V (Backend Architecture)**: N/A (Frontend feature)
- **Tech Stack**: Frontend Consumer is Next.js (Dream Park `my-app`). (Compliant)

## Project Structure

### Documentation (this feature)

```text
specs/023-rtk-auth-state/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # To be created by /speckit-tasks
```

### Source Code (repository root)

```text
my-app/src/
├── lib/features/auth/
│   ├── authSlice.ts     # Redux slice for token & auth state
│   └── authApi.ts       # RTK Query slice for login, signup, profile endpoints
├── store.ts             # Redux store configuration (needs updating)
└── features/auth/components/
    ├── AuthForms.tsx    # Unified Login/Signup forms
    └── UserProfile.tsx  # Protected profile display component
```

**Structure Decision**: The Redux logic (`authSlice.ts`, `authApi.ts`) will reside in `src/lib/features/auth/` (following the existing `src/lib/features/api/` pattern). The UI components will reside in `src/features/auth/components/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
