# Tasks: Attractions API Section

**Input**: Design documents from `/specs/009-attractions-api/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Path conventions: `BackEnd/src/...`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project readiness checks

- [x] T001 Ensure project directory layout is clean and ready for the module in `BackEnd/src/`

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared utilities or configuration

- [x] T002 Verify database connection integrity in `BackEnd/src/app.js`

## Phase 3: User Story 1 — Park Visitor Browses All Attractions (Priority: P1) 🎯 MVP

**Goal**: Visitors can fetch all attractions or filter them by category.

**Independent Test**: Send GET to `/api/attractions` and `/api/attractions?category=Kids`.

### Implementation for User Story 1

- [x] T003 [P] [US1] Create Attraction Mongoose model in `BackEnd/src/models/Attraction.js` with schema validations (enum, default, min).
- [x] T004 [US1] Implement `getAllAttractions` in `BackEnd/src/controllers/attractionController.js` with filtering and sorting by `createdAt` descending.
- [x] T005 [US1] Define the root GET route in `BackEnd/src/routes/attractionRoutes.js`.
- [x] T006 [US1] Mount the new router at `/api/attractions` in `BackEnd/src/app.js`.

---

## Phase 4: User Story 2 — Park Visitor Views a Single Attraction (Priority: P2)

**Goal**: Fetch one attraction by its unique ID.

**Independent Test**: Send GET to `/api/attractions/:id`.

### Implementation for User Story 2

- [x] T007 [US2] Implement `getAttractionById` in `BackEnd/src/controllers/attractionController.js` ensuring 404/400 handling.
- [x] T008 [US2] Add the GET `/:id` route in `BackEnd/src/routes/attractionRoutes.js`.

---

## Phase 5: User Story 3 — Park Admin Adds a New Attraction (Priority: P3)

**Goal**: Admin creates a new attraction catalog record.

**Independent Test**: Send POST to `/api/attractions`.

### Implementation for User Story 3

- [x] T009 [US3] Implement `addAttraction` in `BackEnd/src/controllers/attractionController.js` including success logging.
- [x] T010 [US3] Add the POST `/` route in `BackEnd/src/routes/attractionRoutes.js`.

---

## Phase 6: User Story 4 — Park Admin Updates an Attraction (Priority: P4)

**Goal**: Update fields partially (especially status).

**Independent Test**: Send PATCH to `/api/attractions/:id`.

### Implementation for User Story 4

- [x] T011 [US4] Implement `updateAttraction` (`PATCH`) in `BackEnd/src/controllers/attractionController.js` with success logging.
- [x] T012 [US4] Add the PATCH `/:id` route in `BackEnd/src/routes/attractionRoutes.js`.

---

## Phase 7: User Story 5 — Park Admin Deletes an Attraction (Priority: P5)

**Goal**: Remove an attraction from the catalog.

**Independent Test**: Send DELETE to `/api/attractions/:id`.

### Implementation for User Story 5

- [x] T013 [US5] Implement `deleteAttraction` in `BackEnd/src/controllers/attractionController.js` with success logging.
- [x] T014 [US5] Add the DELETE `/:id` route in `BackEnd/src/routes/attractionRoutes.js`.

---

## Phase 8: Polish & Cross-Cutting Concerns

- [x] T015 Verify quickstart endpoints coverage using manual HTTP checks.
- [x] T016 Ensure ES module syntax consistency across new files in `BackEnd/src/`.

---

## Dependencies & Execution Order

- **Phase 3 (US1)** depends on Phase 1 & 2.
- **Phases 4-7 (US2-5)** depend on Phase 3 completion (requires model and route setup).
