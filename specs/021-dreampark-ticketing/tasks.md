# Tasks: Dream Park Ticketing System

**Input**: Design documents from `/specs/021-dreampark-ticketing/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/  

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base configurations

- [ ] T001 Verify backend (`BackEnd/src`) and frontend (`my-app/src`) local project environments are fully loaded and operational
- [ ] T002 [P] Configure environment CORS and API endpoint parameters in `BackEnd/.env` and `my-app/.env`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Configure standard role-based access tokens support (`USER`, `MARKETING_AGENT`, `ADMIN`) in backend auth middleware at `BackEnd/src/middlewares/authMiddleware.js`
- [ ] T004 Create database ticket seeding script supporting category, icons, color hex, and bullet description arrays at `BackEnd/src/scripts/seedTickets.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel or sequentially.

---

## Phase 3: User Story 1 - Visitor Booking Flow (Priority: P1) 🎯 MVP

**Goal**: Enable visitors to select ticket types, quantities, select tomorrow/today's date, input phone number, and generate a pending payment booking.

**Independent Test**: Send `POST /api/tickets/bookings` with tomorrow's date, quantity 2, valid phone, and verify booking is stored in the database with status `PENDING_PAYMENT` and a unique UUID.

### Implementation for User Story 1

- [ ] T005 [P] [US1] Update `TicketType.js` Mongoose model to support `category` ("INDIVIDUAL"/"GROUP"), `description` (array of strings), `icon` (string), and `color` (string) fields in `BackEnd/src/models/TicketType.js`
- [ ] T006 [P] [US1] Update `Booking.js` Mongoose model to support `quantity` (default 1), `phoneNumber` (string), and align `status` to `['PENDING_PAYMENT', 'PAID']` in `BackEnd/src/models/Booking.js`
- [ ] T007 [US1] Refine `createBooking` handler in `BackEnd/src/controllers/ticketingController.js` to securely fetch ticket price, calculate total amount, generate UUID, and validate target dates
- [ ] T008 [US1] Mount and register create booking routes in `BackEnd/src/routes/ticketingRoutes.js` protecting with JWT authentication
- [ ] T009 [US1] Create the modern React frontend component `BookingFlow.jsx` at `my-app/src/components/BookingFlow.jsx` with a 3-step dynamic flow (Category Filter tonal tabs, asymmetric date picker, login popup fallback, phone number input, glassmorphic summary, and crimson CTA)
- [ ] T010 [US1] Mount the booking flow widget component at the ticket bookings page at `my-app/app/[locale]/tickets/page.tsx` (or `pass/page.tsx`)

**Checkpoint**: At this point, User Story 1 is fully functional. Visitors can book tickets and generate passes.

---

## Phase 4: User Story 2 - Agent Ticket Verification (Priority: P1)

**Goal**: Allow marketing agents at the park entrance to scan visitor QR codes, view price details, and confirm cash payment in-person.

**Independent Test**: Hit `POST /api/tickets/verify` with a valid QR code for today's date and check if status transitions to `PAID` in the DB.

### Implementation for User Story 2

- [ ] T011 [US2] Update `verifyAndConfirmPayment` handler in `BackEnd/src/controllers/ticketingController.js` to validate agent roles, today's date, current status, and output error responses in localized Arabic
- [ ] T012 [US2] Protect and register payment verification routes in `BackEnd/src/routes/ticketingRoutes.js` restricting endpoints access to role === `MARKETING_AGENT`
- [ ] T013 [US2] Implement the `AgentScanner.jsx` component at `my-app/src/components/AgentScanner.jsx` utilizing `html5-qrcode` camera scanner, manual type backup form (phoneNumber/UUID), and a cash payment confirmation modal
- [ ] T014 [US2] Mount the agent scanner board component at `my-app/app/[locale]/marketing-dashboard/scan/page.tsx`

**Checkpoint**: Agents can scan/confirm booking payments today.

---

## Phase 5: User Story 3 - Admin Pricing Management (Priority: P2)

**Goal**: Allow park administrators to view all tickets in a borderless tabular format and instantly update ticket prices inline.

**Independent Test**: Hit `PUT /api/tickets/:id` as an administrator, update a price, and verify that all subsequent bookings reflect the new price.

### Implementation for User Story 3

- [ ] T015 [US3] Implement `updateTicketPrice` handler in `BackEnd/src/controllers/ticketingController.js` supporting dynamic price updates on Mongoose DB
- [ ] T016 [US3] Register `PUT /api/tickets/:id` in `BackEnd/src/routes/ticketingRoutes.js` restricting access to role === `ADMIN`
- [ ] T017 [US3] Create `AdminPricing.jsx` component at `my-app/src/components/AdminPricing.jsx` featuring a borderless inline-editable pricing table with tonal layered backgrounds and massive padding
- [ ] T018 [US3] Add the admin pricing board component to the admin route view at `my-app/app/[locale]/admin/pricing/page.tsx`

**Checkpoint**: Admins can instantly alter pricing.

---

## Phase 6: User Story 4 - Visitor Dashboard (Priority: P2)

**Goal**: Allow visitors to retrieve active bookings and show beautiful scannable "Magic Pass" cards with QR codes and Arabic instruction guides.

**Independent Test**: Fetch bookings history for an authenticated visitor and check that active bookings display appropriate scannable codes.

### Implementation for User Story 4

- [ ] T019 [US4] Refine `getUserBookings` handler in `BackEnd/src/controllers/ticketingController.js` to return populated ticket details sorted by targetDate
- [ ] T020 [US4] Create `UserDashboard.jsx` component at `my-app/src/components/UserDashboard.jsx` mapping active bookings as borderless cards embedding `qrcode.react` SVGs
- [ ] T021 [US4] Mount the user dashboard component at `my-app/app/[locale]/bookings/page.tsx`

**Checkpoint**: Visitors can view their tickets dashboard.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification and seeder integrations

- [ ] T022 Run the mock seeder script and confirm mock tickets load with proper categories, icons, description arrays, and colors
- [ ] T023 Run quickstart.md end-to-end validation test scenarios on a local server instance and verify correct system operation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion. Blocks all subsequent user stories.
- **User Stories (Phases 3 to 6)**: Depends on Foundational phase completion. Can run in parallel.
- **Polish (Phase 7)**: Depends on all user stories being fully implemented.

### Parallel Opportunities

- Setup tasks T001-T002 can run in parallel.
- Schema modifications T005-T006 can run in parallel.
- Once Phase 2 completes, US1, US2, US3, and US4 frontend components can be worked on concurrently by different team members!

---

## Parallel Example: User Story 1

```bash
# Launch model tasks in parallel:
Task: "Update TicketType.js Mongoose model to support category, description, icon, and color fields in BackEnd/src/models/TicketType.js"
Task: "Update Booking.js Mongoose model to support quantity, phoneNumber, and align status to ['PENDING_PAYMENT', 'PAID'] in BackEnd/src/models/Booking.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1 (Visitor Booking)
4. Complete Phase 4: User Story 2 (Agent Scanner)
5. **STOP and VALIDATE**: Confirm booking and verification flows work perfectly together before expanding to Admin panels.
