# Tasks: Games Page API Integration

**Input**: Design documents from `/specs/016-games-api-integration/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/attractions-api.md, research.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 [P] Verify backend `http://localhost:5000/api` and frontend `http://localhost:3000` connectivity
- [X] T002 [P] Review existing `Attraction` documents in MongoDB to ensure `pageKey: "home"` and `category` fields are present

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T003 Update `BackEnd/src/controllers/attractionController.js` to support `category` query parameter in `getAttractionsByLangAndPage`
- [X] T004 Update `my-app/src/lib/features/api/apiSlice.ts` to refactor `getAttractions` query to accept `{ lang, pageKey, category }` and construct dynamic URL

**Checkpoint**: Foundation ready - backend supports filtering and frontend api slice is ready for dynamic calls.

---

## Phase 3: User Story 1 - View All Games on Page Load (Priority: P1) 🎯 MVP

**Goal**: Fetch and display all games from the backend on initial page load.

**Independent Test**: Navigate to `/ar/games`, observe loading state, and verify all games from backend are displayed.

### Implementation for User Story 1

- [X] T005 [US1] Import `useGetAttractionsQuery` and `useLocale` in `my-app/app/[locale]/games/page.tsx`
- [X] T006 [US1] Replace mock data with `useGetAttractionsQuery` for initial load in `page.tsx` (using `pageKey: "home"`)
- [X] T007 [US1] Implement full-page loading state in `page.tsx` for initial fetch
- [X] T008 [US1] Implement full-page error state for initial fetch failure in `page.tsx` (FR-003)
- [X] T009 [US1] Handle "no games available" empty state in `page.tsx` (FR-010)

**Checkpoint**: User Story 1 is functional. The page shows live data from the backend.

---

## Phase 4: User Story 2 - Filter Games by Category (Priority: P2)

**Goal**: Enable server-side filtering when a category is selected.

**Independent Test**: Select a category, verify a new backend request is sent with `?category=...`, and filtered results are shown.

### Implementation for User Story 2

- [X] T010 [US2] Dynamically extract unique category values from the initial API response in `page.tsx` (Q1)
- [X] T011 [US2] Update `CategoryFilter` component in `page.tsx` to use the dynamically extracted categories
- [X] T012 [US2] Link `activeCategory` state to the `category` parameter in `useGetAttractionsQuery`
- [X] T013 [US2] Implement "stale results preservation" during filter-induced loading in `page.tsx` (FR-007, FR-002)
- [X] T014 [US2] Implement dismissible error notification for filter request failures (preserving previous results) in `page.tsx` (Q2, FR-003)

**Checkpoint**: User Story 2 is functional. Filtering works against the live backend.

---

## Phase 5: User Story 3 - Reset to All Games (Priority: P3)

**Goal**: Reset the view to "All" games state.

**Independent Test**: Click "All" category after filtering, verify all games are re-fetched and displayed.

### Implementation for User Story 3

- [X] T015 [US3] Ensure selecting the "All" option in `CategoryFilter` clears the `activeCategory` state, triggering a re-fetch of all games without category param

**Checkpoint**: All user stories are functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and cleanup

- [ ] T016 [P] Remove/deprecate `my-app/src/features/games/data/mockGames.ts` if no longer used by any other component
- [ ] T017 Final check for responsive design and RTL layout (Arabic)
- [ ] T018 Validate all Success Criteria (SC-001 to SC-006)
- [ ] T019 Run `quickstart.md` validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 - BLOCKS all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
  - US1 (P1) is the MVP and should be completed first.
  - US2 (P2) depends on US1 (for category extraction).
  - US3 (P3) depends on US2.

### Parallel Opportunities

- T001 and T002 can run in parallel.
- T016 can run in parallel with polish tasks.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2 (Foundation).
2. Complete Phase 3 (US1).
3. **STOP and VALIDATE**: Verify live data is shown.

### Incremental Delivery

1. Add US2: Enable filtering based on the live data.
2. Add US3: Ensure reset functionality works as expected.
3. Polish and Cleanup.
