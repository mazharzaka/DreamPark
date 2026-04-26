# Tasks: RTK Query Setup

**Input**: Design documents from `/specs/013-rtk-query-setup/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify and install necessary dependencies (`@reduxjs/toolkit`, `react-redux`, `framer-motion`) in `my-app/package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Create `my-app/src/lib/store.ts` implementing `makeStore`, `RootState`, and `AppDispatch` types.
- [x] T003 [P] Create `my-app/src/lib/hooks.ts` with typed Redux hooks (`useAppDispatch`, `useAppSelector`, `useAppStore`).
- [x] T004 Create `my-app/src/app/StoreProvider.tsx` using `useRef` for SSR-safe store initialization.
- [x] T005 Create `my-app/src/lib/features/api/apiSlice.ts` using `fetchBaseQuery` (with `cache: 'no-store'`) and define `getHeroByPage` endpoint.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - App Router & RTK Query Integration (Priority: P1) 🎯 MVP

**Goal**: Setup Store, `makeStore`, API Slice, and SSR Prefetching securely inside Next.js layout and pages.

**Independent Test**: Load the root page and verify the Next.js Store Provider renders correctly and the prefetch initiates without crashing.

### Implementation for User Story 1

- [x] T006 [US1] Wrap the Next.js application in `my-app/src/app/layout.tsx` (or top-level layout) with `<StoreProvider>`.
- [x] T007 [US1] Implement server-side prefetching logic in `my-app/src/app/page.tsx` (`initiate` endpoint and await `Promise.all` via `getRunningQueries` wrapped in `try/catch`).

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently on the server.

---

## Phase 4: User Story 2 - Client-Side Hydration and Animation (Priority: P2)

**Goal**: Setup the Hero slider client component to hydrate smoothly using Framer motion without redundant network requests.

**Independent Test**: Mount the `HeroSlider` component, verify it receives hydrated data from Redux without executing a new fetch request in the Network tab, and animates correctly.

### Implementation for User Story 2

- [x] T008 [P] [US2] Update or create `my-app/src/components/HeroSlider.tsx` to use the `useGetHeroByPageQuery` hook.
- [x] T009 [US2] Add `framer-motion` initial/animate props to `my-app/src/components/HeroSlider.tsx` for smooth entry animations upon hydration.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T010 Test the page in development mode and verify the Network tab for ZERO duplicate client requests.
- [x] T011 Verify error handling by temporarily failing the backend endpoint and ensuring Next.js doesn't crash on SSR.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Can start after User Story 1 (relies on SSR prefetching to be setup in the page)

### Parallel Opportunities

- Store creation (T002) and Hooks creation (T003) can be done in parallel.
- Component creation (T008) can start partially in parallel if stubbed.

---

## Implementation Strategy

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test SSR Prefetching → Deploy/Demo (MVP!)
3. Add User Story 2 → Test Client Hydration → Deploy/Demo
4. Each story adds value without breaking previous stories
