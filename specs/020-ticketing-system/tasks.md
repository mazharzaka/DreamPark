# Tasks: Dynamic Ticketing, Verification & Pricing System

**Input**: Design documents from `/specs/020-ticketing-system/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Verify project structure and dependencies (Next.js, Prisma, Tailwind, Lucia Auth)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Update Prisma schema with `TicketType`, `Booking`, and `User` relations in `my-app/prisma/schema.prisma`
- [X] T003 Run Prisma DB push/migrate to apply schema changes
- [X] T004 [P] Create empty server actions file `my-app/src/actions/ticketing.ts`
- [X] T005 [P] Create empty server actions file `my-app/src/actions/verification.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Book a "Magic Pass" Ticket (Priority: P1) 🎯 MVP

**Goal**: As a park visitor, I want to browse available ticket types, select a ticket tier, pick my desired visit date, and complete a booking so that I receive a unique QR code.

**Independent Test**: A logged-in user navigates to the "Magic Pass" page, selects a ticket type, chooses a future date, confirms the booking, and receives a QR code with clear Arabic instructions.

### Implementation for User Story 1

- [X] T006 [P] [US1] Implement `getTicketTypes` action in `my-app/src/actions/ticketing.ts`
- [X] T007 [US1] Implement `createBooking` action in `my-app/src/actions/ticketing.ts` (calculate total price server-side, validate date)
- [X] T008 [US1] Create the Magic Pass booking page UI in `my-app/app/[locale]/pass/page.tsx`
- [X] T009 [US1] Implement booking form logic (date selection, quantity, type selection) in `my-app/app/[locale]/pass/page.tsx`
- [X] T010 [US1] Integrate booking form with `createBooking` server action
- [X] T011 [US1] Create QR Code generation component and display with Arabic prompt post-booking in `my-app/app/[locale]/pass/page.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Verify and Confirm Payment at the Park (Priority: P1)

**Goal**: As a marketing agent at the park's office, I want to scan a visitor's QR code using my device camera and confirm their cash payment.

**Independent Test**: A marketing agent logs in, opens the scan page, scans a valid QR code for today's date, sees the customer's booking details and total amount due, and confirms the payment.

### Implementation for User Story 2

- [X] T012 [P] [US2] Implement `verifyAndConfirmPayment` action in `my-app/src/actions/verification.ts` (validate agent role, today's date, status)
- [X] T013 [US2] Create Agent Verification Center page in `my-app/app/[locale]/marketing-dashboard/scan/page.tsx`
- [X] T014 [US2] Integrate `html5-qrcode` scanner component in the scan page
- [X] T015 [US2] Connect scanner output to `verifyAndConfirmPayment` action and handle Arabic feedback overlays (success, already paid, wrong date)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Manage Ticket Pricing (Priority: P2)

**Goal**: As a park administrator, I want to view all ticket types with their current prices and update pricing in real-time.

**Independent Test**: An admin logs in, navigates to the ticket pricing board, modifies a price inline, and the change is immediately persisted.

### Implementation for User Story 3

- [X] T016 [P] [US3] Implement `updateTicketPrice` action in `my-app/src/actions/ticketing.ts` (validate admin role, positive price)
- [X] T017 [US3] Create Admin Pricing Board page in `my-app/app/[locale]/admin/tickets/page.tsx`
- [X] T018 [US3] Integrate `getTicketTypes` and `updateTicketPrice` actions into the Pricing Board UI

**Checkpoint**: All core transaction and administration stories should now be independently functional

---

## Phase 6: User Story 4 - View My Bookings History (Priority: P3)

**Goal**: As a returning park visitor, I want to see my past and upcoming bookings.

**Independent Test**: A logged-in user navigates to their bookings page and sees a chronological list of all their bookings with status indicators and QR codes.

### Implementation for User Story 4

- [X] T019 [P] [US4] Implement `getUserBookings` action in `my-app/src/actions/ticketing.ts`
- [X] T020 [US4] Create Bookings History page in `my-app/app/[locale]/bookings/page.tsx`
- [X] T021 [US4] Display chronological list of bookings with status indicators and conditional QR codes

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T022 [P] Apply "Editorial Joy" design system strictly across all new pages (No-Line rule, tonal layering, high roundedness)
- [X] T023 [P] Ensure native RTL support and correct Arabic typography for all feedback states and prompts
- [X] T024 Add animated transitions for booking, scanning, and price updates

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately
- **Foundational (Phase 2)**: BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - P1 stories (US1, US2) should be executed first.
  - P2 and P3 stories can follow.
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- Foundational tasks T004 and T005 can run in parallel.
- Once Foundational phase completes, User Stories 1, 2, 3, and 4 can technically start in parallel if capacity allows, as their UI components and server actions are largely independent.
- Polish tasks can run in parallel with the final UI adjustments.

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Booking)
4. Complete Phase 4: User Story 2 (Verification)
5. **STOP and VALIDATE**: Test Booking -> Verification flow independently
6. Deploy/demo if ready

### Incremental Delivery

1. Foundation ready
2. Add User Story 1 -> Test independently -> Deploy/Demo
3. Add User Story 2 -> Test independently -> Deploy/Demo
4. Add User Story 3 & 4
