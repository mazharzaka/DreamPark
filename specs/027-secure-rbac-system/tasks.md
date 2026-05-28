# Tasks: Secure Role-Based Access Control & Ticketing System

**Input**: Design documents from `/specs/027-secure-rbac-system/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/endpoints.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project seeding, DB helper preparation, and structure validation.

- [ ] T001 Create Mongoose schema file for ScanAuditLog in `BackEnd/src/models/ScanAuditLog.js`
- [ ] T002 Create the database seeding script in `BackEnd/src/utils/seedRbacData.js`
- [ ] T003 Configure the run command for the seeder in `BackEnd/package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core auth infrastructure (JWT token setup, secure HttpOnly cookie delivery, normalisation) that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 Implement `authMiddleware.js` normalisation and JWT authentication in `BackEnd/src/middlewares/authMiddleware.js`
- [ ] T005 [P] Implement `authController.js` logic for refresh token generation and secure cookie mounting in `BackEnd/src/controllers/authController.js`
- [ ] T006 Mount the dynamic login and silent refresh routing endpoints in `BackEnd/src/routes/authRoutes.js`
- [ ] T007 [P] Create the global context provider `AuthContext.tsx` with in-memory access token storage and silent refresh interval in `my-app/src/lib/features/auth/AuthContext.tsx`
- [ ] T008 [P] Integrate the `AuthContext` provider into the main Next.js layout in `my-app/app/[locale]/layout.tsx`

**Checkpoint**: Foundation ready - user sessions and RBAC middleware are robust. User story implementation can now begin.

---

## Phase 3: User Story 1 - Atomic Ticket Verification at the Gate (Priority: P1) 🎯 MVP

**Goal**: Implement concurrency-safe, server-validated QR code scans at the park entrance with device disconnect locks and append-only auditing.

**Independent Test**: Seed a test booking, run concurrent verification API calls using different agent accounts, verify only one succeeds with 200 and the other fails with 409, and ensure a `ScanAuditLog` is created.

### Implementation for User Story 1

- [ ] T009 [US1] Add atomic status transitions (`SCANNING`, lock fields) to Mongoose model in `BackEnd/src/models/Booking.js`
- [ ] T010 [US1] Implement atomic single-operation `/verify/scan` controller logic in `BackEnd/src/controllers/bookingController.js`
- [ ] T011 [P] [US1] Implement scan confirm `/verify/confirm` (transitioning `SCANNING` to `PAID` + audit log entry) in `BackEnd/src/controllers/bookingController.js`
- [ ] T012 [P] [US1] Implement scan release `/verify/cancel` (reverting `SCANNING` back to `PENDING_PAYMENT` + audit log entry) in `BackEnd/src/controllers/bookingController.js`
- [ ] T013 [US1] Mount the scan verification routes inline with restricts and swagger blocks in `BackEnd/src/routes/ticketingRoutes.js`
- [ ] T014 [P] [US1] Extend the ticketing RTK Query API slice with verify, confirm, and cancel mutations in `my-app/src/lib/features/api/bookingsApi.ts`
- [ ] T015 [US1] Build the premium, bilingual offline-resilient camera scanner dashboard in `my-app/src/features/scanner/components/AgentScanner.tsx`
- [ ] T016 [US1] Mount the agent scanner component into the Next.js routing tree at `my-app/app/[locale]/marketing-dashboard/scan/page.tsx`

**Checkpoint**: At this point, User Story 1 (Atomic scanner MVP) is fully functional and testable independently.

---

## Phase 4: User Story 2 - Role-Enforced Route Protection & State Persistence (Priority: P2)

**Goal**: Restrict pages to authorized roles using premium animated on-brand 403 pages, omit links from navigation menus dynamically, and maintain robust auth state persistence.

**Independent Test**: Log in as `USER`, try to access `/marketing-dashboard/scan`, verify redirect to premium 403 page. Confirm navigation links to dashboard are not rendered in header.

### Implementation for User Story 2

- [ ] T017 [US2] Implement the `ForbiddenScreen.tsx` using Framer Motion animations in `my-app/src/components/ui/ForbiddenScreen.tsx`
- [ ] T018 [US2] Implement the `ProtectedRoute.tsx` wrapper incorporating the 4 role routes guard in `my-app/src/lib/features/auth/ProtectedRoute.tsx`
- [ ] T019 [US2] Dynamic filtering of role-based navigation links in the portal layout in `my-app/src/features/portal/components/Navigation.tsx`
- [ ] T020 [US2] Wrap Next.js pages with the newly created `ProtectedRoute` wrapper in `my-app/app/[locale]/`
- [ ] T021 [US2] Setup local storage auth synchronization and stale token purging on application load in `my-app/src/lib/features/auth/AuthContext.tsx`

**Checkpoint**: At this point, authentication state and route protection are fully secured.

---

## Phase 5: User Story 3 - Admin Ticket Price Management & Immutability (Priority: P3)

**Goal**: Implement price management dashboard enforcing Editorial Joy visual styles while keeping historical booking prices untouched.

**Independent Test**: Modify a ticket type's price via the dashboard, verify new bookings reflect the updated price, and ensure previous bookings in the DB maintain their original `totalPrice`.

### Implementation for User Story 5

- [ ] T022 [US3] Ensure ticket type update controllers do not modify the `totalPrice` in existing historical bookings in `BackEnd/src/controllers/bookingController.js`
- [ ] T023 [US3] Create the admin pricing control panel component with high-rounded inputs and tonal layering in `my-app/src/features/admin/components/AdminPricing.tsx`
- [ ] T024 [US3] Mount the admin pricing panel route in Next.js at `my-app/app/[locale]/admin/pricing/page.tsx`

**Checkpoint**: All user stories are functional and integrated.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: final review, cleanup, and verification of quickstart workflows.

- [ ] T025 Run quickstart.md validation checklist and execute the full suite of interactive manual tests
- [ ] T026 Perform a comprehensive codebase audit to ensure zero 1px borders exist in any modified/added CSS/Tailwind classes
- [ ] T027 Run build and lint checks across backend and frontend to ensure no build warnings exist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can then proceed in parallel or sequentially in priority order (P1 ➔ P2 ➔ P3).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T001, T002, T003).
- Foundational tasks marked [P] can run in parallel (T005, T007, T008) after T004.
- Once Foundation is complete, Phase 3 (US1), Phase 4 (US2), and Phase 5 (US3) can proceed in parallel as they touch independent backend controller endpoints and frontend files.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently using quickstart instructions.
5. Proceed to subsequent phases once validated.
