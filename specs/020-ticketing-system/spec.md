# Feature Specification: Dynamic Ticketing, Verification & Pricing System

**Feature Branch**: `020-ticketing-system`  
**Created**: 2026-05-20  
**Status**: Draft  
**Input**: User description: "Build a dynamic Ticketing, Verification, and Pricing System for Dream Park including Prisma/MongoDB schema for TicketType and Booking, secure server actions for booking creation, payment verification by marketing agents, and admin price management, with premium UI components including the Signature Magic Pass card, Agent Verification Center, and Admin Price Curation Board — all following the Editorial Joy design system."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Book a "Magic Pass" Ticket (Priority: P1)

As a park visitor, I want to browse available ticket types, select a ticket tier, pick my desired visit date, and complete a booking so that I receive a unique QR code I can present at the park for payment and entry.

**Why this priority**: This is the core revenue-driving workflow. Without ticket booking, the entire system has no purpose. It must be the first complete slice delivered.

**Independent Test**: A logged-in user navigates to the "Magic Pass" page, selects a ticket type, chooses a future date, confirms the booking, and receives a QR code with clear Arabic instructions to visit the park's marketing office on the chosen date for cash payment and ticket collection.

**Acceptance Scenarios**:

1. **Given** the user is logged in and on the Magic Pass page, **When** they select a ticket type and a valid future date, **Then** the system creates a booking with status "PENDING_PAYMENT" and displays a unique QR code.
2. **Given** the user has completed a booking, **When** the QR code is rendered, **Then** the page displays the editorial prompt in Arabic: "يرجى التوجه لمكتب التسويق بالحديقة يوم [التاريخ المختار] لتأكيد الحجز والدفع نقداً واستلام التذاكر والكوبونات".
3. **Given** the user is not logged in, **When** they attempt to book, **Then** they are redirected to the login page.
4. **Given** the user selects a date in the past, **When** they submit the booking, **Then** the system rejects the booking with an appropriate error message.

---

### User Story 2 - Verify and Confirm Payment at the Park (Priority: P1)

As a marketing agent at the park's office, I want to scan a visitor's QR code using my device camera and confirm their cash payment so that their booking status is updated to "PAID" and they receive their physical tickets.

**Why this priority**: This is the second half of the core transaction loop. Revenue is only captured when the agent confirms payment. Without this, bookings remain unresolved.

**Independent Test**: A marketing agent logs in, opens the scan page, scans a valid QR code for today's date, sees the customer's booking details and total amount due, and confirms the payment — updating the booking status to "PAID".

**Acceptance Scenarios**:

1. **Given** the agent has the "MARKETING_AGENT" role and scans a valid QR code, **When** the booking's target date matches today and the status is "PENDING_PAYMENT", **Then** the system displays the customer's details, ticket quantity, and total price with the editorial statement: "المبلغ المطلوب تحصيله: X جنيه", along with a confirm button.
2. **Given** the agent scans a QR code whose booking status is already "PAID", **When** the scan completes, **Then** the system shows a rejection feedback overlay in Arabic: "تم تأكيد هذه التذكرة مسبقاً" (This ticket has already been confirmed).
3. **Given** the agent scans a QR code whose target date does not match today, **When** the scan completes, **Then** the system shows a rejection feedback overlay in Arabic: "هذه التذكرة ليست صالحة لليوم" (This ticket is not valid for today).
4. **Given** the agent confirms payment, **When** the status update succeeds, **Then** a success overlay is displayed with a soft emerald green accent confirming the transaction.
5. **Given** a user without "MARKETING_AGENT" role tries to access the scan page, **When** they navigate to it, **Then** they are denied access and redirected.

---

### User Story 3 - Manage Ticket Pricing (Priority: P2)

As a park administrator, I want to view all ticket types with their current prices and update pricing in real-time so that the park can respond to demand, seasons, and promotions without developer intervention.

**Why this priority**: Pricing flexibility is essential for business operations, but the booking and verification flow must work first. This is an administrative tool that can follow the core user-facing features.

**Independent Test**: An admin logs in, navigates to the ticket pricing board, sees all ticket tiers displayed in a clean editorial layout, modifies a price inline, and the change is immediately persisted and reflected for all future bookings.

**Acceptance Scenarios**:

1. **Given** the admin has the "ADMIN" role and is on the ticket pricing page, **When** the page loads, **Then** all ticket types are displayed with their name, description, current price, and last-updated timestamp.
2. **Given** the admin modifies a ticket price, **When** they confirm the change, **Then** the new price is persisted and any subsequent booking uses the updated price.
3. **Given** a user without the "ADMIN" role attempts to access the pricing page, **When** they navigate to it, **Then** they are denied access and redirected.
4. **Given** the admin enters an invalid price (negative, zero, or non-numeric), **When** they attempt to save, **Then** the system rejects the input with a clear validation error.

---

### User Story 4 - View My Bookings History (Priority: P3)

As a returning park visitor, I want to see my past and upcoming bookings so that I can reference my QR codes, check booking statuses, and plan future visits.

**Why this priority**: Enhances user retention and self-service capability but is not required for the core booking-and-verification transaction to function.

**Independent Test**: A logged-in user navigates to their bookings page and sees a chronological list of all their bookings with status indicators, QR codes for pending bookings, and visit dates.

**Acceptance Scenarios**:

1. **Given** the user is logged in and has previous bookings, **When** they visit their bookings page, **Then** they see all bookings sorted by date (newest first) with status, ticket type, date, and total price.
2. **Given** the user has a booking with "PENDING_PAYMENT" status, **When** they view it, **Then** the QR code is displayed and the Arabic instruction prompt is shown.
3. **Given** the user has no bookings, **When** they visit the bookings page, **Then** they see an empty state with a prompt to book their first Magic Pass.

---

### Edge Cases

- What happens when the same QR code is scanned twice in quick succession? The system must prevent double-confirmation via a unique constraint and status check.
- What happens if the server is unreachable during QR scan? The agent receives a clear network error message and can retry.
- What if an admin changes a price while a user is mid-booking? The booking uses the price fetched at submission time from the database (server-side truth), not any client-cached value.
- What if a booking's target date has passed and it was never confirmed? The booking remains in "PENDING_PAYMENT" status — future cleanup or expiration logic is out of scope for v1.
- What happens when a user books multiple tickets for the same date? Each booking is independent with its own QR code and total price.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow authenticated users to create bookings by selecting a ticket type, quantity, and target visit date.
- **FR-002**: The system MUST calculate the total booking price server-side using the trusted database price of the selected ticket type (not client-submitted values).
- **FR-003**: The system MUST generate a unique, secure, non-guessable identifier (UUID) for each booking's QR code value.
- **FR-004**: The system MUST render a scannable QR code on the booking confirmation screen, embedded within the premium Magic Pass card design.
- **FR-005**: The system MUST display the Arabic instruction prompt after booking: "يرجى التوجه لمكتب التسويق بالحديقة يوم [التاريخ المختار] لتأكيد الحجز والدفع نقداً واستلام التذاكر والكوبونات".
- **FR-006**: The system MUST restrict the QR scan and payment verification page exclusively to users with the "MARKETING_AGENT" role.
- **FR-007**: The system MUST reject payment verification attempts with Arabic feedback if the booking's status is already "PAID".
- **FR-008**: The system MUST reject payment verification attempts with Arabic feedback if the booking's target date does not match today's date.
- **FR-009**: The system MUST update a booking's status from "PENDING_PAYMENT" to "PAID" upon successful agent confirmation.
- **FR-010**: The system MUST display the total amount due prominently during verification: "المبلغ المطلوب تحصيله: X جنيه".
- **FR-011**: The system MUST restrict ticket price management exclusively to users with the "ADMIN" role.
- **FR-012**: The system MUST persist ticket price changes immediately and apply them to all subsequent bookings.
- **FR-013**: The system MUST validate that prices are positive numbers before saving.
- **FR-014**: The system MUST support RTL (Right-to-Left) layout natively since primary content is in Arabic.
- **FR-015**: The system MUST provide animated feedback states (success, error, loading) on all critical user actions (booking, scanning, price updates).
- **FR-016**: The system MUST reject booking attempts for past dates.
- **FR-017**: The system MUST support a "quantity" field during booking, multiplying the unit price by quantity for the total price calculation.

### Key Entities

- **TicketType**: Represents a purchasable ticket tier (e.g., "Standard Entry", "VIP Pass", "Family Bundle"). Key attributes: name, price, optional description, last update timestamp.
- **Booking**: Represents a single reservation created by a user. Key attributes: associated user, selected ticket type, target visit date, total price, unique QR code identifier, status (PENDING_PAYMENT → PAID), quantity, and timestamps.
- **User**: The person interacting with the system. Key attributes: authentication credentials, role (USER, MARKETING_AGENT, ADMIN), and profile information.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete a ticket booking (select type, choose date, receive QR code) in under 60 seconds from page load.
- **SC-002**: Marketing agents can scan a QR code and confirm payment in under 15 seconds per transaction.
- **SC-003**: Admin price changes are reflected in new bookings within 5 seconds of saving.
- **SC-004**: 100% of bookings use server-calculated pricing — no client-side price manipulation is possible.
- **SC-005**: All feedback messages during verification (success, already paid, wrong date) are displayed in Arabic.
- **SC-006**: The Magic Pass card, verification center, and pricing board all adhere to the Editorial Joy design system (no 1px borders, tonal layering for separation, glassmorphic overlays, high roundedness, animated transitions).
- **SC-007**: The system prevents double-confirmation of the same booking with a 100% success rate.

## Assumptions

- Users must already have an account and be logged in to create bookings. Registration/authentication flow is handled by an existing auth system and is out of scope for this feature.
- Payment is handled in-person at the park's marketing office (cash-only). No online payment gateway integration is needed.
- The primary user interface language is Arabic with RTL layout. English is not required for v1 but the system should not break if locale switches.
- The "MARKETING_AGENT" and "ADMIN" roles are assigned manually by a super-admin or seeded — role management UI is out of scope for this feature.
- QR code scanning uses the device's built-in camera via the browser — no native app is required.
- Ticket quantity per booking is a simple integer multiplier; seat selection or time-slot reservation is not in scope.
- Expired bookings (target date passed, never paid) remain in the system with "PENDING_PAYMENT" status. Automatic cleanup or expiration is deferred to a future feature.

## Clarifications

### Session 2026-05-20

No critical ambiguities detected. Full coverage scan completed across all taxonomy categories — all areas resolved or explicitly deferred:

- **Functional Scope**: Clear — 17 requirements, 3 roles, explicit out-of-scope declarations.
- **Data Model**: Clear — Booking entity includes quantity, lifecycle covers PENDING_PAYMENT → PAID, expiration deferred.
- **Interaction & UX**: Clear — 4 user stories with Given/When/Then, error/empty states addressed in FR-015.
- **Non-Functional**: Deferred to planning — concurrent capacity targets and observability requirements are planning-phase concerns.
- **Integration**: Clear — camera-based QR scanning, auth assumed external, no email/SMS notifications in v1 scope.
- **Edge Cases**: Clear — 5 cases covering concurrency, network, pricing race, expiration, multi-booking.
- **Terminology**: Clear — "Magic Pass", "Marketing Agent", "TicketType" used consistently throughout.

