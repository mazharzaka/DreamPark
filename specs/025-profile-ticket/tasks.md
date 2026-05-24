# Tasks: Complete Profile Page & Ticket Management

**Input**: Design documents from `/specs/025-profile-ticket/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Simple unit/integration and API router tests are included as planned.
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `my-app/src/`, `my-app/messages/`
- **Backend**: `BackEnd/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Verify backend and frontend projects compile and development servers start successfully
- [ ] T002 Configure local MongoDB and verify test connection in `BackEnd/src/app.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and database schema updates that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Modify database model status enum to support `'PENDING_PAYMENT'`, `'PAID'`, `'USED'`, `'EXPIRED'`, and `'CANCELLED'` in `BackEnd/src/models/Booking.js`
- [ ] T004 [P] Mount Express router group in `BackEnd/src/app.js` for `/api/v1/bookings` delegating to `ticketingRoutes.js`
- [ ] T005 Setup localized translation structure namespaces for profile tabs and details modals in `my-app/messages/en.json` and `my-app/messages/ar.json`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Multi-Language Profile & Ticket Categories Tab (Priority: P1) 🎯 MVP

**Goal**: Implement dynamic LTR/RTL bilingual profile layout showing User Bookings categorized into Upcoming, Past, and Cancelled.

**Independent Test**: Log in and load profile page in LTR (English) and RTL (Arabic) modes. Verify that the cards are correctly filtered into their respective status tabs and all headers, tags, and navigation elements are fully translated.

### Tests for User Story 1

- [ ] T006 [P] [US1] Create frontend unit tests verifying correct client-side categorization of bookings in `my-app/src/features/auth/__tests__/UserProfile.test.tsx`

### Implementation for User Story 1

- [ ] T007 [P] [US1] Add translations for the profile sections, user summary, empty states, and ticket categorization tabs in `my-app/messages/en.json` and `my-app/messages/ar.json`
- [ ] T008 [US1] Update `getUserBookings` query handler in `BackEnd/src/controllers/ticketingController.js` to populate `ticketTypeId` (mapped to `ticketType`) and fetch historical records within the appropriate date limit
- [ ] T009 [US1] Refactor profile screen to wrap layout in localization contexts, fetch user profile and bookings, filter them client-side, and apply dynamic RTL direction support in `my-app/src/features/auth/components/UserProfile.tsx`

**Checkpoint**: User Story 1 is fully functional and testable as an MVP increment.

---

## Phase 4: User Story 2 - Ticket Validity Extension / Date Change (Priority: P2)

**Goal**: Allow users to extend or change the scheduled date of an upcoming ticket to a future date.

**Independent Test**: Select an active ticket under the Upcoming tab, click "Change Date", choose a future date in the calendar, submit, and confirm that the UI and database successfully register the new date.

### Tests for User Story 2

- [ ] T010 [P] [US2] Write backend router API tests for booking date updates in `BackEnd/src/controllers/__tests__/ticketingController.test.js`

### Implementation for User Story 2

- [ ] T011 [US2] Implement `changeBookingDate` controller action in `BackEnd/src/controllers/ticketingController.js` to validate owner ownership, target date bounds, and write new date
- [ ] T012 [US2] Register `PATCH /bookings/:id/change-date` in `BackEnd/src/routes/ticketingRoutes.js` including JSDoc Swagger specifications
- [ ] T013 [P] [US2] Add the `changeBookingDate` mutation endpoint and type parameters to bookings slice in `my-app/src/lib/features/api/bookingsApi.ts`
- [ ] T014 [US2] Integrate the calendar datepicker dialog, trigger buttons, and Redux mutation calls in the upcoming ticket lists of `my-app/src/features/auth/components/UserProfile.tsx`

**Checkpoint**: User Story 2 is fully integrated; upcoming bookings dates can now be modified securely.

---

## Phase 5: User Story 3 - Secure QR Details & Offline Download Modal (Priority: P3)

**Goal**: Render a detailed floating modal with a scannable QR code and a button to save the QR code as a PNG file offline.

**Independent Test**: Click "Download/View QR Code" on any card, verify a floating overlay modal displays the scannable code and detailed order breakdown, click "Save to Device", and verify that a 100% scannable PNG is successfully saved.

### Implementation for User Story 3

- [ ] T015 [P] [US3] Add translations for the floating modal, including ticket breakdown labels, billing items, payment status definitions, and download CTA actions in `my-app/messages/en.json` and `my-app/messages/ar.json`
- [ ] T016 [US3] Implement overlay details dialog modal displaying populated ticket breakdowns, quantities, visit dates, and pricing in `my-app/components/ui/BookingQrCard.tsx`
- [ ] T017 [US3] Render the dynamic `QRCodeCanvas` and build the client-side canvas-to-PNG save trigger function inside `my-app/components/ui/BookingQrCard.tsx`

**Checkpoint**: User Story 3 is complete, enabling high-contrast QR display and offline scannable image downloads at the park gates.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Design improvements and overall visual polish

- [ ] T018 [P] Integrate Framer Motion tab transitions using `layoutId` indicators in `my-app/src/features/auth/components/UserProfile.tsx`
- [ ] T019 Conduct visual review ensuring zero hard 1px borders and full compliance with the "No-Line" background shift system across all screens and modals
- [ ] T020 Run the comprehensive quickstart verification flow and confirm 100% compliance with all specification success criteria

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion. Blocks all user stories.
- **User Stories (Phases 3-5)**:
  * Depend on Foundational (Phase 2) completion.
  * Can be developed sequentially in priority order (US1 $\rightarrow$ US2 $\rightarrow$ US3) or concurrently.
- **Polish (Phase 6)**: Depends on all user stories being complete.

---

## Parallel Opportunities

* Setup tasks `T001` and `T002` can run in parallel.
* Foundational database task `T003` and route task `T004` can run in parallel.
* Once Foundational phase is complete, developers can split work:
  * Developer A implements User Story 1 (`T006` to `T009`).
  * Developer B works on User Story 2 (`T010` to `T014`).
  * Developer C implements User Story 3 (`T015` to `T017`).

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup (Phase 1).
2. Complete Foundational (Phase 2) to establish the model and route foundation.
3. Implement User Story 1 (Phase 3) completely.
4. **STOP and VALIDATE**: Verify that the bilingual profile dashboard categorizes bookings accurately under LTR and RTL directions.

### Incremental Delivery

1. Setup + Foundation $\rightarrow$ System ready for integration.
2. User Story 1 $\rightarrow$ Multi-language profile showing bookings (MVP release!).
3. User Story 2 $\rightarrow$ Active users can now modify visit schedules.
4. User Story 3 $\rightarrow$ Gate visitors can download QR codes to avoid network issues.
5. Polish phase $\rightarrow$ Integrate spring transitions, review layout rules, and sign off.
