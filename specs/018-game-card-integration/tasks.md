# Tasks: Game Card Integration

**Input**: Design documents from `/specs/018-game-card-integration/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `my-app/src/`, `my-app/app/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for the refactored routing.

- [x] T001 Rename or recreate the route directory from `[slug]` to `my-app/app/[locale]/games/[id]`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data definitions and API plumbing that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Update TypeScript interfaces in `my-app/src/types/attraction.ts` (if needed) or create a unified `AttractionDetails` type based on `data-model.md`.
- [x] T003 Ensure `getAttractionById` fetching logic is available in `my-app/src/lib/features/api/apiSlice.ts` or as a standalone fetch utility.

**Checkpoint**: Foundation ready - types and fetching utilities are in place.

---

## Phase 3: User Story 1 - Navigate to Attraction Details (Priority: P1) 🎯 MVP

**Goal**: Establish the primary Game Details page shell, fetch localized data using the `_id`, and handle basic routing.

**Independent Test**: Navigate to `/[locale]/games/[id]` with a valid Mongo ID. The page loads and fetches data from the backend. Invalid IDs show a 404 state.

### Implementation for User Story 1

- [x] T004 [US1] Create server-side page component in `my-app/app/[locale]/games/[id]/page.tsx`
- [x] T005 [US1] Implement data fetching logic in `page.tsx` calling `GET /api/attractions/[id]`
- [x] T006 [P] [US1] Implement `not-found.tsx` in `my-app/app/[locale]/games/[id]/not-found.tsx`
- [x] T007 [P] [US1] Implement `error.tsx` in `my-app/app/[locale]/games/[id]/error.tsx`
- [x] T008 [P] [US1] Implement `loading.tsx` in `my-app/app/[locale]/games/[id]/loading.tsx`

**Checkpoint**: At this point, User Story 1 is fully functional. The page loads real data from the existing endpoint and handles routing edge cases.

---

## Phase 4: User Story 2 - Visually Rich Details Design (Priority: P2)

**Goal**: Refactor existing UI components to consume the flatter `Attraction` data schema and render the premium design matching the reference image.

**Independent Test**: The UI structure matches the reference image, successfully mapping fields like `waitingTime` and `isFastTrack` without crashing.

### Implementation for User Story 2

- [x] T009 [P] [US2] Refactor `GameHero.tsx` in `my-app/src/features/games/components/GameHero.tsx` to consume the `Attraction` data shape
- [x] T010 [P] [US2] Refactor `BookingPanel.tsx` in `my-app/src/features/games/components/BookingPanel.tsx` to consume the `Attraction` data shape (handling `status` and `isFastTrack`)
- [x] T011 [US2] Integrate `GameHero` and `BookingPanel` into `my-app/app/[locale]/games/[id]/page.tsx`
- [x] T012 [US2] Remove or gracefully omit unused components (`SafetyInstructions.tsx`, `EngineeringSpecs.tsx`) from the `page.tsx` layout since the data is no longer provided by the endpoint.

**Checkpoint**: User stories 1 AND 2 are complete. The page is fully integrated with the correct endpoint and displays the correct design.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect the overall feature.

- [x] T013 [P] Clean up deprecated files/directories (e.g., `my-app/app/[locale]/games/[slug]`)
- [x] T014 Verify responsive layout across all breakpoints (<768px, 768-1024px, >1024px)
- [x] T015 Verify RTL/LTR localization mapping for fields like `name_ar` / `name_en` in the page controller.
- [x] T016 Execute manual validation against `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately
- **Foundational (Phase 2)**: Depends on Setup
- **User Stories (Phase 3+)**: Depend on Foundational phase
- **Polish (Final Phase)**: Depends on all user stories

### Parallel Opportunities

- Creating error/loading states (T006, T007, T008) can happen in parallel with the main page logic.
- Component refactoring (T009, T010) can happen in parallel once the types are updated.

---

## Implementation Strategy

### Incremental Delivery

1. Complete Setup + Foundational.
2. Deliver US1: Ensure the page can be reached via `/[locale]/games/[id]` and successfully queries the backend.
3. Deliver US2: Plug in the visually rich components and ensure the data mapping correctly translates the `Attraction` fields to the UI.
4. Polish: Remove old code and verify responsive behaviors.
