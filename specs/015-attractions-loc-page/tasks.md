---
description: "Task list for feature implementation"
---

# Tasks: Attractions Localization and Pagination

**Input**: Design documents from `/specs/015-attractions-loc-page/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- No setup tasks required for this feature as the infrastructure already exists.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 Update Attraction model schema to include `name_ar`, `name_en`, `description_ar`, `description_en`, and `pageKey` in BackEnd/src/models/attractionModel.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Retrieve Localized and Paginated Attractions (Priority: P1) 🎯 MVP

**Goal**: Retrieve a list of attractions filtered by language (`ar` or `en`), organized by a specific `pageKey`, with support for pagination and sorting.

**Independent Test**: Can be fully tested by making a GET request with language, pageKey, pagination, and sorting parameters, and verifying the returned localized payload and metadata.

### Implementation for User Story 1

- [x] T002 [US1] Implement `getAttractionsByLangAndPage` controller logic (fetching, sorting, pagination) in BackEnd/src/controllers/attractionController.js
- [x] T003 [US1] Map localized fields (e.g., mapping `name_ar` to `name` based on `lang` param) in `getAttractionsByLangAndPage` inside BackEnd/src/controllers/attractionController.js
- [x] T004 [US1] Add the GET `/:lang/:pageKey` route in BackEnd/src/routes/attractionRoutes.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Admin Management of Localized Attractions (Priority: P2)

**Goal**: Admin users can create, update, and delete attractions specific to a language and `pageKey`.

**Independent Test**: Can be fully tested by making authenticated POST, PATCH, and DELETE requests to the new localized admin endpoints and verifying changes in the database.

### Implementation for User Story 2

- [x] T005 [P] [US2] Update `addAttraction` logic to handle saving localized fields (`name_ar`, `name_en`, etc.) and `pageKey` in BackEnd/src/controllers/attractionController.js
- [x] T006 [P] [US2] Update `updateAttraction` logic to support partial updates of localized fields in BackEnd/src/controllers/attractionController.js
- [x] T007 [US2] Verify POST and PATCH routes support the new data structure (including file uploads mapping) in BackEnd/src/routes/attractionRoutes.js

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T008 Update Swagger documentation for new and modified endpoints in BackEnd/src/routes/attractionRoutes.js

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable

### Parallel Opportunities

- Admin creation and update functions (`addAttraction`, `updateAttraction`) inside Phase 4 can be worked on concurrently as they affect the same file but different controller exports.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
2. Complete Phase 3: User Story 1
3. **STOP and VALIDATE**: Test User Story 1 independently via Postman or Swagger.

### Incremental Delivery

1. Complete Foundational → Foundation ready
2. Add User Story 1 → Test independently (MVP!)
3. Add User Story 2 → Test independently
4. Apply Polish phase (Swagger docs).
