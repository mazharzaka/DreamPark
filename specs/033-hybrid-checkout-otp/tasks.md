# Tasks: Hybrid Authentication and Ticket Booking Flow

**Input**: Design documents from `/specs/033-hybrid-checkout-otp/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize branch environment check `powershell -ExecutionPolicy Bypass -File .specify/scripts/powershell/check-prerequisites.ps1`
- [x] T002 [P] Create/verify directory layout for feature files in `specs/033-hybrid-checkout-otp/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Update Mongoose User schema in `BackEnd/src/models/User.js` to make password, name, phoneNumber, gender, dateOfBirth, and address fields optional (`required: false`).
- [x] T004 Update Mongoose OtpToken schema in `BackEnd/src/models/OtpToken.js` to make `userId` optional, add `email` field, and append `login_otp` to `purpose` enum.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Guest/Fast Checkout via OTP (Priority: P1) 🎯 MVP

**Goal**: Allow visitors to check out using their email and a 6-digit OTP verification code.

**Independent Test**: Trigger checkout, select Fast Checkout, send code, extract code from console, verify code, and successfully complete booking.

### Implementation for User Story 1

- [x] T005 [P] [US1] Implement rate-limiting and code generation in `/api/auth/send-otp` inside `BackEnd/src/controllers/authController.js`.
- [x] T006 [US1] Implement guest verification and user upsert in `/api/auth/verify-otp` inside `BackEnd/src/controllers/authController.js`.
- [x] T007 [P] [US1] Define `sendOtp` and `verifyOtp` queries in RTK service `my-app/src/lib/features/auth/authApi.ts`.
- [x] T008 [P] [US1] Add English translations for OTP labels and timer under booking namespace in `my-app/messages/en.json`.
- [x] T009 [P] [US1] Add Arabic translations for OTP labels and timer under booking namespace in `my-app/messages/ar.json`.
- [x] T010 [US1] Implement countdown timer, code input layout, and OTP mutations in the booking flow login modal inside `my-app/src/components/BookingFlow.tsx`.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Traditional Email & Password Login (Priority: P2)

**Goal**: Allow visitors to toggle and log in using email and password on the same booking modal.

**Independent Test**: Click toggle in modal, see password form, enter password, submit, and confirm login.

### Implementation for User Story 2

- [x] T011 [P] [US2] Expose traditional email & password route `/api/auth/login-password` in Express router `BackEnd/src/routes/authRoutes.js`.
- [x] T012 [P] [US2] Add password login mutation mapping to `/auth/login-password` in RTK service `my-app/src/lib/features/auth/authApi.ts`.
- [x] T013 [US2] Implement dynamic UI toggle, email/password input elements, and submission logic in booking flow login modal inside `my-app/src/components/BookingFlow.tsx`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Smart Account Upsert & Session Linking (Priority: P3)

**Goal**: Handle OTP login gracefully when email exists with/without password and link booking session.

**Independent Test**: Log in using OTP with existing user email, verify that login succeeds, and booking links properly.

### Implementation for User Story 3

- [x] T014 [US3] Implement upsert lookup check to verify and merge guest profiles or allow password users via OTP in `/api/auth/verify-otp` inside `BackEnd/src/controllers/authController.js`.
- [x] T015 [US3] Test session persistence with HTTP-only cookies and React state sync on frontend modal close inside `my-app/src/components/BookingFlow.tsx`.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T016 Verify Arabic RTL layout and translation alignments on dark-themed modal in `my-app/src/components/BookingFlow.tsx`.
- [x] T017 Validate final end-to-end integration by running verification checklist in `specs/033-hybrid-checkout-otp/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- Setup tasks marked [P] can run in parallel.
- User Story 1 tasks: T005, T007, T008, T009 can run in parallel once Foundation (Phase 2) is complete.
- User Story 2 tasks: T011 and T012 can run in parallel.
