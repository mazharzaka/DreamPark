# Feature Specification: Complete Profile Page & Ticket Management

**Feature Branch**: `025-profile-ticket`  
**Created**: 2026-05-24  
**Status**: Draft  
**Input**: User description: "Implementing Complete Profile Page & Ticket Management with QR Modal (Front-End & Back-End Requirements)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Multi-Language Profile & Ticket Categories Tab (Priority: P1)

As an authenticated visitor, I want to access a beautifully organized, localized profile page where I can view my profile details and easily see my tickets categorized by status, so that I can quickly manage my park visits in my preferred language (English or Arabic).

**Why this priority**: High priority because showing correct personal info and dividing bookings by category is the foundation of the user profile. This is essential for the basic user experience.

**Independent Test**: Log in to the application and navigate to the Profile page. Toggle language switcher between English and Arabic, and verify that the layout switches dynamically (LTR for English, RTL for Arabic) and all text elements are correctly translated. Verify that three tabs (Upcoming, Past, Cancelled) are displayed with correct ticket counts and appropriate listings.

**Acceptance Scenarios**:

1. **Given** an authenticated user who speaks Arabic, **When** they visit the profile page and select Arabic, **Then** all navigation labels, user profile summary cards, booking status tags, tab names, and messages transition into Arabic, with the layout rendering in native Right-to-Left (RTL) alignment.
2. **Given** an authenticated user, **When** they view the tickets tabs, **Then** they see three sections:
   - **Upcoming**: Bookings with visitDate (targetDate) >= today AND status is PENDING_PAYMENT or PAID.
   - **Past**: Bookings with visitDate (targetDate) < today OR status is USED or EXPIRED.
   - **Cancelled**: Bookings with status explicitly 'CANCELLED'.

---

### User Story 2 - Ticket Validity Extension / Date Change (Priority: P2)

As a ticket holder with an upcoming visit, I want to change the scheduled date of my ticket if my plans change, so that my ticket remains valid and active for a future day.

**Why this priority**: Medium priority as it provides important operational flexibility to the user, preventing lost ticket bookings due to schedule changes and reducing guest support overhead.

**Independent Test**: Select an active ticket under the "Upcoming" tab, click the "Change Date" button, choose a future date from the calendar picker, and confirm. Verify that the date updates on the ticket card and is saved to the back-end.

**Acceptance Scenarios**:

1. **Given** a ticket listed under the "Upcoming" section, **When** the user clicks "Change Date" next to the ticket, **Then** a localized calendar picker opens, restricting all past dates and allowing selection of future dates only.
2. **Given** a user selects a valid future date and submits, **When** the back-end receives the patch request `PATCH /api/v1/bookings/:id/change-date`, **Then** the visit date is successfully updated, the ticket remains in the "Upcoming" section, and a success confirmation notification is shown to the user.

---

### User Story 3 - Secure QR Details & Offline Download Modal (Priority: P3)

As a ticket holder arriving at the park gate, I want to open a modal showing my ticket's QR code and detailed breakdown, and save the QR code to my local device, so that I can easily scan and pay or enter even if my phone loses internet connectivity.

**Why this priority**: Essential for a smooth offline fallback experience at the gate, ensuring that poor network coverage does not block entry.

**Independent Test**: Click "Download/View QR Code" on a ticket card, verify that a beautiful, floating modal opens displaying a high-contrast QR code and booking breakdown. Click "Save to Device", and verify that a high-quality `.png` file containing only the QR code is downloaded to the local device.

**Acceptance Scenarios**:

1. **Given** an active booking card, **When** the user clicks "Download/View QR Code", **Then** a floating React modal opens containing:
   - A dynamically rendered high-contrast QR code generated from `bookingQrCode` (or `qrCodeId`).
   - Detailed product breakdown: Booking ID, breakdown of ticket types (e.g. "2x General Admission"), target date, payment status (e.g. "Pending Cash at Gate"), and total price.
2. **Given** the QR modal is open, **When** the user clicks "Save to Device" (حفظ على الجهاز), **Then** the system captures the QR code canvas element and cleanly downloads it as a `.png` file to local storage named with the booking code.

---

### Edge Cases

- **Offline Gate Entry / Network Loss**: If a user loses internet connectivity at the gate, they can retrieve their pre-downloaded QR code PNG from their device photo library/downloads to complete entry.
- **Date Change in Past or Cancelled Tickets**: The "Change Date" button is strictly hidden for tickets in the Past or Cancelled tabs, preventing unauthorized modifications of expired, used, or cancelled bookings.
- **API Network Failure During Date Change**: If the server fails to update the date, the calendar modal remains open, displays a friendly translated error message, and retains the user's input so they can retry.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST wrap the profile layout in the project's localization context (supporting Arabic and English).
- **FR-002**: The layout MUST support native RTL rendering and alignment when the Arabic locale is active.
- **FR-003**: The system MUST fetch all bookings for the authenticated user and display them.
- **FR-004**: The system MUST filter bookings client-side (or via API query params) into three categories:
  - **Upcoming**: `visitDate` (targetDate) >= today AND status is `PENDING_PAYMENT` or `PAID`.
  - **Past**: `visitDate` (targetDate) < today OR status is `USED` or `EXPIRED`.
  - **Cancelled**: status is explicitly `CANCELLED`.
- **FR-005**: The system MUST render a "Change Date" button ONLY on Upcoming ticket cards.
- **FR-006**: The system MUST present a date picker modal when the "Change Date" button is clicked, restricting selection to future dates.
- **FR-007**: The system MUST expose a secure endpoint `PATCH /api/v1/bookings/:id/change-date` that accepts a new `visitDate` and updates the target booking in the database.
- **FR-008**: The system MUST render a "Download/View QR Code" button on all ticket cards.
- **FR-009**: The system MUST show a floating, accessible React Modal when the QR button is clicked.
- **FR-010**: Inside the modal, the system MUST dynamically generate a scannable QR code matching the booking's `qrCodeId`.
- **FR-011**: Inside the modal, the system MUST display the Booking ID, ticket tier & quantity, target date, payment status, and total amount.
- **FR-012**: Inside the modal, the system MUST provide a "Save to Device" button that downloads the QR code as a `.png` file.

### Key Entities *(include if feature involves data)*

- **User**: The registered user profile containing `id`, `name`, `email`, `phoneNumber`, and other profile fields.
- **Booking**:
  - `id` (String, Unique identifier)
  - `userId` (Reference to User)
  - `ticketTypeId` (Reference to TicketType)
  - `targetDate` (Date, scheduled date of visit)
  - `totalPrice` (Number, total booking amount)
  - `quantity` (Number, number of tickets in the booking)
  - `qrCodeId` (String, unique code for QR generation)
  - `status` (String Enum: `PENDING_PAYMENT`, `PAID`, `USED`, `EXPIRED`, `CANCELLED`)
- **TicketType**: The tier details including `name`, `nameAr`, `price`, and `description`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Toggling the language switcher results in an immediate transition (under 200ms) of the profile layout and all text elements.
- **SC-002**: The bookings are accurately categorized into Upcoming, Past, and Cancelled with zero leakage or duplication across tabs.
- **SC-003**: The "Save to Device" feature exports a 256x256 pixel high-contrast PNG file within 1 second of clicking, which is 100% scannable by industry-standard QR scanners.
- **SC-004**: Extending a ticket's validity updates the date in the database and reflects in the UI instantly upon server confirmation.

## Assumptions

- Users have a modern web browser that supports HTML5 `<canvas>` rendering (necessary for qrcode.react and downloading as PNG).
- The Next.js Front-End uses the existing RTK Query setup for API operations.
- The `status` field of the back-end Booking schema will be enhanced to support the full lifecycle: `PENDING_PAYMENT`, `PAID`, `USED`, `EXPIRED`, `CANCELLED`.
- Standard localization keys in `next-intl` (`en.json` and `ar.json`) will be extended to cover the new profile and ticket-related labels.
