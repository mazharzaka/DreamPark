# Tasks: Swagger API Documentation

**Input**: Design documents from `/specs/012-swagger-api-docs/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Manual verification via browser test execution.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base dependencies

- [x] T001 Install swagger-jsdoc and swagger-ui-express in BackEnd/package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that must be complete before any user story can be implemented

- [x] T002 Create the initial Swagger configuration in BackEnd/src/config/swagger.js
- [x] T003 Mount the Swagger UI endpoint at `/api-docs` in BackEnd/src/app.js

**Checkpoint**: Foundation ready - documentation route will serve the basic metadata.

---

## Phase 3: User Story 1 - Developer Explores API via Swagger UI (Priority: P1) 🎯 MVP

**Goal**: A developer accesses interactive grouped docs at `/api-docs`

**Independent Test**: Navigate to `http://localhost:5000/api-docs` and verify the layout, tags, and titles.

### Implementation for User Story 1

- [x] T004 [US1] Define Hero, Attractions, and Auth tag metadata in BackEnd/src/config/swagger.js

**Checkpoint**: User Story 1 MVP fully accessible.

---

## Phase 4: User Story 2 - Developer Tests a Protected Endpoint via Bearer Token (Priority: P2)

**Goal**: Support testing JWT protected endpoints from the Swagger UI

**Independent Test**: Authorize with a JWT token inside the Swagger UI, then perform a protected request.

### Implementation for User Story 2

- [x] T005 [US2] Add the Bearer Authentication security scheme in BackEnd/src/config/swagger.js

**Checkpoint**: Authorization dialog functional.

---

## Phase 5: User Story 3 - Developer Understands Hero and Attractions API Schemas (Priority: P3)

**Goal**: Comprehensive schema guidelines for data payloads

**Independent Test**: Read the models and expected data structures for Hero and Attraction creation in the UI.

### Implementation for User Story 3

- [x] T006 [P] [US3] Document Hero route parameter shapes and data payloads in BackEnd/src/routes/heroRoutes.js
- [x] T007 [P] [US3] Document Attraction route shapes and file upload boundaries in BackEnd/src/routes/attractionRoutes.js
- [x] T008 [P] [US3] Document Authentication inputs and response shapes in BackEnd/src/routes/authRoutes.js

**Checkpoint**: Full API documentation mapping complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T009 Review route alignment and ensure all paths map accurately.
- [x] T010 Complete manual walk-through testing per quickstart instructions.

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Runs immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Stories (Phases 3+)**: Depend on Foundational completion. Can progress sequentially (P1 -> P2 -> P3) or concurrently.

### Parallel Opportunities
- T006, T007, and T008 (User Story 3) manipulate distinct files and can proceed in parallel.
