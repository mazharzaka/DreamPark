# Feature Specification: Refine Booking Flow Page

**Feature Branch**: `022-refine-booking-flow`  
**Created**: 2026-05-22  
**Status**: Draft  
**Input**: User description: "Refine booking flow page with optional params and internalization"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dynamic Ticket Pre-activation via Parameter (Priority: P1)

As a visitor accessing the Dream Park website via a direct link (e.g. from marketing campaigns or social media), I want the booking page to automatically select and configure the correct ticket, category tab, and details for me so that I do not have to search for them manually and can check out instantly.

**Why this priority**: Highly critical for digital marketing conversions. It allows seamless, friction-free booking flows from external campaigns directly into the checkout step.

**Independent Test**:
1. Open the booking page with a valid ticket ID parameter (e.g. `/pass/vortex-adrenaline-pass`).
2. Verify that the "Individual" category tab and the "Vortex Adrenaline Pass" are pre-selected.
3. Verify that the correct pricing and description are immediately rendered without manual user clicks.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to `/pass/64cde3f901ab23cd45ef6789`, **When** the page loads, **Then** the ticket matching ID `64cde3f901ab23cd45ef6789` is set as the active ticket, its category is identified as "INDIVIDUAL", the "Individual Tickets" tab is activated, and the details are fully populated.
2. **Given** a visitor navigates to `/pass/group-unlimited-pass`, **When** the page loads, **Then** the ticket matching key `group-unlimited-pass` is set as the active ticket, its category is identified as "GROUP", the "Group Tickets" tab is activated, and the details are fully populated.
3. **Given** a visitor navigates to `/pass` without any parameter, **When** the page loads, **Then** the system defaults to selecting the first available category tab and the first ticket type within it.
4. **Given** a visitor navigates to `/pass/invalid-id-123` with an invalid/non-existent ID, **When** the page loads, **Then** the system gracefully falls back to the default state (first available category and first ticket) without breaking or showing empty screens.

---

### User Story 2 - Anti-Confusion explicit multi-step labeling (Priority: P1)

As a visitor booking a premium ticket, I want the system to explicitly display the specific ticket name and details I have selected at every stage of the booking flow (Ticket Selection ➡️ Date Selection ➡️ Personal Info) so that I never get confused or double-booked.

**Why this priority**: Prevents cart abandonment and errors. Users must have total clarity on what they are buying at every stage of a multi-step checkout.

**Independent Test**:
1. Select a ticket (e.g., "Vortex Adrenaline Pass") and proceed to Step 2 (Date Selection).
2. Verify that the ticket name "Vortex Adrenaline Pass" is visibly and clearly highlighted as the ticket currently being configured.
3. Proceed to Step 3 (Personal Info & Checkout) and verify the ticket name is still prominently shown on the summary card.

**Acceptance Scenarios**:

1. **Given** the user is on Step 1 (Ticket Selection), **When** they view the ticket details, **Then** the active ticket's name is displayed using bold, oversized editorial typography.
2. **Given** the user proceeds to Step 2 (Date Selection) after selecting "Vortex Adrenaline Pass", **When** they view the calendar, **Then** the header explicitly states that they are selecting a date for the "Vortex Adrenaline Pass" instead of showing generic "Select Date" labels.
3. **Given** the user is on Step 3 (Personal Info), **When** they fill out their details, **Then** the checkout summary card clearly displays:
   - Specific ticket name ("Vortex Adrenaline Pass")
   - Ticket category ("Individual")
   - Quantity of tickets selected
   - Selected target date

---

### User Story 3 - Full Dual-Language Internationalization (ar/en) (Priority: P2)

As a visitor of Dream Park (which caters to both local Arab speakers and international guests), I want to be able to toggle the language of the entire booking page between Arabic and English, and see all static text, validation errors, and dynamic ticket descriptions translated perfectly.

**Why this priority**: Essential for localized accessibility and guest satisfaction in a multicultural region.

**Independent Test**:
1. Open the booking flow page in English (`/en/pass`).
2. Switch the locale to Arabic (`/ar/pass`).
3. Verify that the entire UI layout flips to RTL and all text blocks match the Arabic locale dictionaries.

**Acceptance Scenarios**:

1. **Given** the active locale is Arabic (`ar`), **When** the booking page is loaded, **Then**:
   - The document layout direction is set to RTL.
   - The booking title displays "حجز التذاكر المنسقة".
   - The category tabs show "التذاكر الفردية" and "تذاكر المجموعات".
   - All calendar names and inputs are translated to Arabic.
2. **Given** the active locale is English (`en`), **When** the booking page is loaded, **Then**:
   - The document layout direction is set to LTR.
   - The booking title displays "Curated Ticket Booking".
   - The category tabs show "Individual Tickets" and "Group Tickets".

---

### Edge Cases

- **Unavailable Camera/Scanner during agent verification fallback**: The booking flow checkout is visitor-facing, but if the visitor needs to show their confirmation QR code, it must be highly scannable on mobile screens with high contrast.
- **Date selection boundary condition**: Prevent booking for past dates. Only allow today, tomorrow, and future dates up to 30 days in advance.
- **Language switching mid-flow**: If a user switches language in Step 2, the selected ticket, quantity, and date MUST be preserved without resetting the booking wizard.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST extract the optional `id` parameter from the URL path (`/pass/:id?`) or query parameters.
- **FR-002**: The system MUST match the `id` against the list of available ticket types fetched from the API.
- **FR-003**: The system MUST automatically update the state's active category tab and selected ticket to match the `id` target when loaded.
- **FR-004**: In Step 1, the ticket name MUST be rendered using oversized, editorial-style typography adhering to "Plus Jakarta Sans" for English and "Cairo" for Arabic.
- **FR-005**: In Step 2 (Date Selection), the UI MUST explicitly display the localized ticket name inside the date prompt (e.g., "Choose your magical day for Vortex Adrenaline Pass").
- **FR-006**: In Step 3 (Personal Info), the checkout card MUST detail the ticket name, quantity, category, and target date, and require a valid phone number.
- **FR-007**: The interface MUST adapt dynamically to `ar` (RTL) and `en` (LTR) layouts based on the locale parameter.
- **FR-008**: Switching languages MUST NOT clear or reset the current state of the wizard (selected ticket, quantity, date, or user info).
- **FR-009**: The layout MUST strictly avoid using 1px border lines or dividing lines, separating elements instead with HSL background shading (`bg-[#f6f6f6]`/`bg-[#f0f1f1]`), drop shadows, and oversized card spacing.

### Key Entities *(include if feature involves data)*

- **TicketType**:
  - Represents a ticket option (e.g., Individual or Group).
  - Attributes: `id`, `name` (en/ar), `category` ("INDIVIDUAL" / "GROUP"), `price`, `description` (array of perks in ar/en), `color` (hex), `icon` (string).
- **Booking**:
  - Represents a user's pending reservation.
  - Attributes: `ticketTypeId`, `quantity`, `targetDate`, `phoneNumber`, `status` ("PENDING_PAYMENT" / "PAID").

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Direct URL bookings load the correct ticket and category instantly in under 1 second.
- **SC-002**: 100% of visitors can switch between Arabic and English at any step of the booking flow without losing their selections.
- **SC-003**: 0% usage of border lines or dividers in the booking layout (fully verified against the "STRICT NO-LINE RULE").

## Assumptions

- Locale codes are restricted to `ar` and `en` values.
- Next.js internationalized routing path routing is active (`/[locale]/pass`).
- All ticketing models and backend APIs are fully compatible with JWT authorizations and role-based permissions.
