# Tasks: Fix React Hydration Errors

**Input**: Design documents from `/specs/026-fix-hydration-errors/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and environment sanity alignment

- [x] T001 Run environment alignment checks inside frontend `my-app/` directory

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core validation of the current workspace state to establish a clean test baseline
**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Verify current compilation status by running standard Next.js build compilation (`npm run build`) in `my-app/` to establish baseline
- [x] T003 [P] Verify current code formatting and style guidelines by running ESLint checks (`npm run lint`) in `my-app/` to establish baseline

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Zero Hydration Warnings (Priority: P1) 🎯 MVP

**Goal**: Eliminate all React hydration mismatch warnings across the application on initial page loads and transitions.

**Independent Test**: Load the portal homepage and bookings page, verifying that the browser Developer Tools console outputs exactly 0 React hydration mismatch errors.

### Implementation for User Story 1

- [x] T004 [US1] Add a client-side mounting toggle (`mounted` state) in `my-app/src/components/ui/SplashScreen.tsx`
- [x] T005 [US1] Defer rendering of the particle field inside `my-app/src/components/ui/SplashScreen.tsx` until client-side mount completes

**Checkpoint**: At this point, the initial portal landing completes hydration with zero Console errors.

---

## Phase 4: User Story 2 - Localized Bookings Date Display (Priority: P2)

**Goal**: Display ticket booking dates localized beautifully in Arabic (`ar-EG`) and English (`en-US`) locales without triggering hydration mismatches.

**Independent Test**: Navigate to the bookings history page (`/bookings`) in both locales and check that dates format correctly with zero hydration logs in console.

### Implementation for User Story 2

- [x] T006 [US2] Implement a client-side mounting toggle (`mounted` state) inside `my-app/app/[locale]/bookings/page.tsx`
- [x] T007 [US2] Create an elegant, Editorial-Joy-compliant loading skeleton inside `my-app/app/[locale]/bookings/page.tsx` that replaces the date text until client mount completes
- [x] T008 [US2] Update localized date string formatting in `my-app/app/[locale]/bookings/page.tsx` to safely trigger `toLocaleDateString` post-mount, replacing the skeleton seamlessly

**Checkpoint**: User bookings render dates correctly on mount in both languages with no hydration mismatch warnings.

---

## Phase 5: User Story 3 - Hydration-Safe Splash Screen Particles (Priority: P3)

**Goal**: Ensure all particle coordinates, sizes, colors, and delay offsets render smoothly and cleanly on the client without console warnings.

**Independent Test**: Verify that the splash screen shows floating particles animating seamlessly and check console logs.

### Implementation for User Story 3

- [x] T009 [US3] Verify particle field animation and scroll transitions inside `my-app/src/components/ui/SplashScreen.tsx`

**Checkpoint**: All user stories are independently functional and fully validated.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification of static analysis, production bundle compilation, and manual developer walkthroughs

- [x] T010 [P] Verify frontend static checks by executing ESLint (`npm run lint`) inside `my-app/`
- [x] T011 [P] Verify production bundle compilation by executing Next.js build compilation (`npm run build`) inside `my-app/`
- [x] T012 [P] Execute the manual developer verification steps in `specs/026-fix-hydration-errors/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion. User Story 1 (P1) is the MVP and should be completed first.
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### Parallel Opportunities

- Foundational tasks `T002` and `T003` can run in parallel.
- Once Foundation completes, the implementation of User Story 1 and User Story 2 can proceed in parallel (if staffed) since they touch different files (`SplashScreen.tsx` vs `/bookings/page.tsx`).
- Polish tasks `T010`, `T011`, and `T012` can run in parallel.
