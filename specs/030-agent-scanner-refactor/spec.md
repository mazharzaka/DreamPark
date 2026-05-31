# Feature Specification: Agent Scanner Overlay & Shift Summary Refactoring

**Feature Branch**: `030-agent-scanner-refactor`  
**Created**: 2026-05-31  
**Status**: Draft  
**Input**: User description: "Refactor existing Agent Scanner component to incorporate ONLY the RESULT SHEET OVERLAY and the SHIFT REPORT SUMMARY (Top-Corner Panel) with maximum production safety, strictly adhering to the Editorial Joy Design System."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Quick QR Code Scanning & Overlay (Priority: P1)

As a Gate Agent, I want to scan a visitor's QR code and see a beautiful, responsive result overlay displaying the payment details and ticket name so that I can quickly verify the visitor and collect the required cash.

**Why this priority**: It is the core interaction of the scanner and must be extremely fast, clear, and bulletproof to prevent delay at the park entrance.

**Independent Test**: Can be tested by rendering the scanner, mocking a successful scan API response, and verifying that the camera pauses and a floating bottom sheet rises displaying the visitor info and cash amount.

**Acceptance Scenarios**:

1. **Given** the Gate Agent is on the scan page and the camera is active, **When** a valid QR code is scanned, **Then** the camera immediately pauses reading frames to prevent duplicate scans, and a floating glassmorphic bottom sheet rises from the bottom of the screen.
2. **Given** the bottom sheet is open, **When** the success state is shown, **Then** the visitor's name, phone number, ticket name, and the cash amount to collect are displayed in clear Arabic text with the cash amount in extra-large bold font: "المبلغ المطلوب تحصيله: X جنيه مصري".
3. **Given** the bottom sheet is showing the success state, **When** the Crimson Gradient CTA button "تأكيد استلام النقدية" is clicked, **Then** the payment is confirmed on the backend, the Shift Report cash state is incremented optimistically, the bottom sheet closes, and the camera resumes scan reading safely.
4. **Given** the bottom sheet is showing the success state, **When** the borderless "إلغاء الفحص" button is clicked, **Then** the scanner releases the ticket lock without updating any state, the bottom sheet closes, and the camera resumes scan reading safely.

---

### User Story 2 - Scan Failure Resolution (Priority: P1)

As a Gate Agent, I want a clear visual indication when a QR scan fails (e.g. already used, expired, or invalid) with a simple action to retry so that I can resolve the issue with the visitor.

**Why this priority**: Crucial for dealing with invalid tickets or network issues at the gates.

**Independent Test**: Can be tested by simulating an error response on QR scanning and verifying that a soft crimson error overlay appears with a retry button.

**Acceptance Scenarios**:

1. **Given** the camera scans a ticket, **When** the API returns a validation error or network failure, **Then** the camera pauses and a soft crimson overlay is displayed showing the exact string error message.
2. **Given** the error overlay is visible, **When** the "إعادة المحاولة" button is clicked, **Then** the overlay closes and the camera resumes scanning safely.

---

### User Story 3 - Shift Summary Dashboard (Priority: P2)

As a Gate Agent, I want to view my shift performance summary (active bookings count and total cash expected) from a quick top-corner panel, and be able to close my shift and hand over custody.

**Why this priority**: Allows agents to keep track of their cash ledger optimistically without navigating away, ensuring financial accountability.

**Independent Test**: Can be tested by toggling the top-corner panel, verifying the count and cash values, confirming a ticket, and verifying that the values update optimistically.

**Acceptance Scenarios**:

1. **Given** the scan dashboard is open, **When** the Gate Agent looks at the top corner, **Then** they see a floating minimalist toggle button styled as `bg-[#f0f1f1] text-[#005caa] rounded-full px-4 py-2 font-bold`.
2. **Given** the agent clicks the toggle button, **When** the shift summary panel expands, **Then** it presents a borderless layout container (`bg-white shadow-[0_40px_80px_rgba(2d,2f,2f,0.06)] rounded-3xl p-6`) containing two lines with extensive vertical padding:
   - "إجمالي الحجوزات المفعلة اليوم: [count]"
   - "إجمالي الكاش المتوقع بالخزينة: [totalCash] جنيه"
3. **Given** a ticket is successfully confirmed in the bottom sheet overlay, **When** the shift report cash state is updated, **Then** the "إجمالي الكاش المتوقع بالخزينة" increments optimistically in real-time.
4. **Given** the shift summary panel is open, **When** the agent clicks "إغلاق الوردية وتسليم العهدة", **Then** the system triggers a logout cleanup and safely redirects the user.

---

### Edge Cases

- **Double Scanning**: The user could hold a QR code in front of the camera and trigger two rapid scans. Handled by immediately invoking `scannerRef.current.pause(true)` upon successful QR detection, and maintaining the synchronous `isScanningRef` gatekeeper.
- **Offline / Disconnect during scan**: If connection drops mid-operation, the UI must alert the user and block manual collections if necessary.
- **Raw Object Crash**: Any API errors or raw JSON responses returned from the server must be formatted defensively as strings rather than direct object rendering to prevent React runtime exceptions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST pause camera frame evaluation immediately when `handleQrScan` is invoked by calling `scannerRef.current.pause(true)`.
- **FR-002**: The system MUST show the scan results in a Framer Motion bottom sheet using `initial={{ y: "100%" }}` and animating to `y: 0` on mount, and exiting to `y: "100%"` on close.
- **FR-003**: The success state inside the bottom sheet MUST display the Visitor Name, phone number, ticket type name, and the cash to collect using the Arabic label "المبلغ المطلوب تحصيله: X جنيه مصري".
- **FR-004**: The CTA button for confirming cash MUST be styled with a crimson gradient `bg-gradient-to-r from-[#b5161e] to-[#ff766d] rounded-full`.
- **FR-005**: Confirming cash MUST update the backend and optimistically increment the local shift report total cash state before resuming the camera with `scannerRef.current.resume()`.
- **FR-006**: The cancel scanning button "إلغاء الفحص" MUST be borderless, close the sheet, and call `scannerRef.current.resume()` safely without any backend mutations.
- **FR-007**: Scan errors MUST be displayed as pure string error messages in a soft crimson background overlay with a prominent "إعادة المحاولة" button.
- **FR-008**: The Shift Report toggle button MUST be positioned in the top-corner and styled as `bg-[#f0f1f1] text-[#005caa] rounded-full px-4 py-2 font-bold`.
- **FR-009**: The Shift Report panel MUST be a Framer Motion layout container (`bg-white shadow-[0_40px_80px_rgba(2d,2f,2f,0.06)] rounded-3xl p-6`) containing lines with extensive vertical padding showing the active bookings count and expected cash.
- **FR-010**: The "إغلاق الوردية وتسليم العهدة" button inside the Shift Report MUST trigger auth logout cleanup safely.
- **FR-011**: All components MUST comply with the "Editorial Joy" design system, avoiding standard 1px borders, using high roundedness (e.g. `rounded-3xl`, `rounded-full`), using Plus Jakarta Sans (or Outfit/Cairo styled appropriately), and utilizing Tonal Layering (background switching from `#f6f6f6` baseline to `#ffffff` cards).

### Key Entities

- **ShiftReportState**: Local state containing `activeBookingsCount` (number of bookings confirmed during this shift) and `totalCashExpected` (accumulated cash in EGP).
- **ScannedBooking**: The ticket payload containing `id`, `visitorName`, `phoneNumber`, `totalPrice`, `ticketTypeName`, `quantity`, and `status`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of successful QR scans freeze the camera immediately, entirely eliminating "ghost scans" or duplicate API calls.
- **SC-002**: The bottom sheet overlay rises smoothly from the bottom with 0ms visual delay after API response.
- **SC-003**: The shift summary cash amount updates instantly (0ms lag) in the top-corner panel upon confirming a cash payment.
- **SC-004**: 0 visual borders (1px) are present in the refactored layout, strictly complying with the "Editorial Joy" Design System.

## Assumptions

- The camera scanner component `@yudiel/react-qr-scanner` provides or can be adapted to support ref pausing/resuming, or the state of mounting can be controlled to freeze frame processing.
- The shift count and cash can be tracked in component state or local storage for persistence across the user's browser session.
- Plus Jakarta Sans is imported or available in the global styling index.
