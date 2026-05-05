# Tasks: Attractions Page

**Input**: Design documents from `/specs/014-attractions-page/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure for the attractions feature in `my-app/src/features/portal/`
- [ ] T002 Add localized strings for Attractions, Games, Animals, and conditions to `my-app/messages/[locale].json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T003 [P] Implement `Attraction` TypeScript interface in `my-app/src/features/portal/types/attraction.ts`
- [ ] T004 [P] Define `getAttractions` endpoint in `my-app/src/features/portal/api/attractionsApi.ts` (extending `apiSlice`)
- [ ] T005 Create basic stub detail page at `my-app/src/app/[locale]/attractions/[id]/page.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Browse Attractions by Category (Priority: P1) 🎯 MVP

**Goal**: Visitors can switch between "Games" and "Animals" tabs to see filtered attractions.

**Independent Test**: Navigate to `/attractions`, switch between tabs, and verify the list filters correctly.

### Implementation for User Story 1

- [ ] T006 [P] [US1] Create `CategoryTabs` component in `my-app/src/features/portal/components/CategoryTabs.tsx`
- [ ] T007 [P] [US1] Create `AttractionCard` base component in `my-app/src/features/portal/components/AttractionCard.tsx`
- [ ] T008 [US1] Implement main Attractions page shell with tab state in `my-app/src/app/[locale]/attractions/page.tsx`
- [ ] T009 [US1] Add navigation logic to `AttractionCard.tsx` to link to `/attractions/[id]`

**Checkpoint**: User Story 1 functional (basic browsing and navigation).

---

## Phase 4: User Story 2 - View Game Attraction Conditions (Priority: P1)

**Goal**: Game cards display min height, waiting time, status, and fast-track availability.

**Independent Test**: View the Games tab and confirm all condition fields are visible and status badges are colored.

### Implementation for User Story 2

- [ ] T010 [US2] Update `AttractionCard.tsx` to render `minHeight`, `waitingTime`, and `isFastTrack` for "games" category
- [ ] T011 [US2] Implement conditional status badge colors (Green/Yellow/Red) in `AttractionCard.tsx`

---

## Phase 5: User Story 3 - View Animal Details (Priority: P2)

**Goal**: Animal cards show name, description, and images without game conditions.

**Independent Test**: View the Animals tab and confirm no game-specific fields are visible.

### Implementation for User Story 3

- [ ] T012 [US3] Update `AttractionCard.tsx` to focus on description and primary image for "animals" category
- [ ] T013 [US3] Ensure `AttractionCard.tsx` omits game conditions gracefully when category is "animals"

---

## Phase 6: User Story 4 - Paginate Through Attractions (Priority: P2)

**Goal**: Support client-side pagination (8 items per page) with category-reset.

**Independent Test**: Load a category with > 8 items, navigate pages, and switch tabs to see reset to page 1.

### Implementation for User Story 4

- [ ] T014 [P] [US4] Create `Pagination` component in `my-app/src/features/portal/components/Pagination.tsx`
- [ ] T015 [US4] Implement pagination logic (slice and reset) in `my-app/src/app/[locale]/attractions/page.tsx`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Visual excellence and interaction refinements

- [ ] T016 [P] Implement rotating "Editorial Joy" color palette for card overlays in `AttractionCard.tsx`
- [ ] T017 [P] Add Framer Motion animations for tab transitions and grid entry in `AttractionCard.tsx` and `page.tsx`
- [ ] T018 [P] Implement loading skeleton for the attractions grid in `my-app/src/features/portal/components/AttractionSkeleton.tsx`
- [ ] T019 Implement empty state UI for categories with no items in `page.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all stories.
- **User Stories (Phase 3-6)**: Depend on Foundational. US1 is the highest priority (MVP).
- **Polish (Phase 7)**: Best done after core functionality is verified.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup + Foundational.
2. Complete User Story 1 (Tabs + Basic Cards).
3. **STOP and VALIDATE**: Verify navigation and filtering.

### Parallel Opportunities

- T003 and T004 (Types and API) can be done in parallel.
- Once Foundation is done, US2 and US3 implementation in `AttractionCard.tsx` can be tackled sequentially or together by differentiating by category.
- UI components like `CategoryTabs` and `Pagination` can be built in parallel.
