# Tasks: Auth and Error Handling Section

**Input**: Design documents from `/specs/010-auth-error-handling/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, quickstart.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Path conventions: `BackEnd/src/...`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project readiness checks

- [x] T001 Ensure project dependencies `jsonwebtoken` and `bcryptjs` are installed via npm in `BackEnd/`

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Centralized Error Handling architecture

- [x] T002 Create custom application error utility in `BackEnd/src/utils/appError.js`
- [x] T003 Create async function wrapper in `BackEnd/src/utils/catchAsync.js`
- [x] T004 Create centralized error middleware in `BackEnd/src/middlewares/errorMiddleware.js` mapping MongoDB CastError, ValidationError, Duplicate Key errors.
- [x] T005 Wire global error handler middleware into `BackEnd/src/app.js`

## Phase 3: User Story 1 — Identity Infrastructure (Priority: P1)

**Goal**: Model authentication constraints on user entity and middleware tokens.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create the User schema in `BackEnd/src/models/User.js` containing phone, address, DOB, gender, profilePicture.
- [x] T007 [US1] Configure password hooks (presave hashing with bcryptjs) in `BackEnd/src/models/User.js`.
- [x] T008 [US1] Build token verification mechanisms (`protect`, `restrictTo`) in `BackEnd/src/middlewares/authMiddleware.js`.

---

## Phase 4: User Story 2 — User Gateway Registration & Access (Priority: P2)

**Goal**: Connect login/signup capabilities.

### Implementation for User Story 2

- [x] T009 [US2] Implement user allocation methods (`signup`, `login`) in `BackEnd/src/controllers/authController.js`.
- [x] T010 [US2] Expose auth logic pathways in `BackEnd/src/routes/authRoutes.js`.

---

## Phase 5: User Story 3 — Protect Core Routes (Priority: P3)

**Goal**: Secure mutating pathways.

### Implementation for User Story 3

- [x] T011 [US3] Refactor routes in `BackEnd/src/routes/attractionRoutes.js` attaching restrictive rules.
- [x] T012 [US3] Secure path executions in `BackEnd/src/routes/heroRoutes.js`.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T013 Verify authorization restrictions dynamically using mock payloads.
