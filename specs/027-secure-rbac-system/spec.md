# Feature Specification: Secure Role-Based Access Control System

**Feature Branch**: `027-secure-rbac-system`  
**Created**: 2026-05-28  
**Status**: Draft  
**Input**: User description: "Production-grade, highly secure Role-Based Access Control (RBAC) system for both backend and frontend for Dream Park, focusing heavily on preventing Box-Office vulnerabilities like Concurrency attacks, Client-side time spoofing, and Offline blindspots."

## Clarifications

### Session 2026-05-28

- Q: What is the complete, ordered set of payment status values a booking passes through, from creation to confirmed gate entry? → A: 3-state lifecycle — `PENDING_PAYMENT` → `SCANNING` (atomic lock acquired by agent) → `PAID` (agent confirms cash received).
- Q: After the agent confirms cash payment and the booking transitions to `PAID`, what does the scanner UI do next? → A: Brief inline success flash (≤2 seconds) on the same screen, then automatically reset camera to ready state for the next scan.
- Q: In this feature, what routes does the `FINANCIAL_MANAGER` role have access to? → A: Same access as `USER` (public pages + own bookings) plus a dedicated `/financial` dashboard route (placeholder screen for now), but explicitly blocked from the agent scanner and admin pricing routes.
- Q: Should scan events be recorded with agent identity and timestamp for audit purposes? → A: Yes — server-side audit log on every scan event capturing agent ID, booking ID, action type, server timestamp, and outcome. No audit UI required for this feature.
- Q: How should the session token be stored on the client and what is the expected session lifetime before automatic expiry? → A: Short-lived access token (15 min) held in memory only + silent refresh via a secure `httpOnly` cookie. Access token is never written to `localStorage` or `sessionStorage`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Atomic Ticket Verification at the Gate (Priority: P1)

A marketing agent standing at the park gate scans a visitor's QR code to verify their ticket and collect cash payment. The system must guarantee that the same ticket cannot be scanned and confirmed by two agents simultaneously (concurrency/replay attack), that a visitor cannot use a ticket purchased for a different date (time spoofing), and that the agent is warned if their device loses connectivity before processing (offline blindspot).

**Why this priority**: This is the core revenue-critical flow. A single concurrency exploit at the box-office could allow free entry, duplicate cash collection, or treasury mismatches. Preventing financial loss and operational fraud is the highest-priority business need.

**Independent Test**: Can be fully tested by having two agents attempt to scan the same QR code simultaneously, by presenting a ticket with a mismatched date, and by toggling the device's airplane mode mid-scan. Each scenario must produce the correct rejection or warning behavior.

**Acceptance Scenarios**:

1. **Given** a valid QR code for today's date with status "pending payment", **When** a marketing agent scans it, **Then** the system atomically locks the ticket, displays the visitor's name, phone number, ticket type, and the exact cash amount to collect, and presents a confirmation action.
2. **Given** the same QR code is scanned by two agents at the exact same moment, **When** both requests reach the server, **Then** exactly one succeeds and the other receives an immediate Arabic error: "تم مسح هذه التذكرة بالفعل من جهاز آخر" (This ticket has already been scanned from another device).
3. **Given** a valid QR code for a ticket dated for tomorrow or yesterday, **When** a marketing agent scans it, **Then** the system rejects it with an Arabic error: "هذه التذكرة ليست لتاريخ اليوم" (This ticket is not for today's date), comparing exclusively against the server's current date.
4. **Given** a marketing agent is scanning tickets, **When** the device loses internet connectivity, **Then** the camera stream is immediately frozen and a full-screen warning appears in Arabic instructing the agent not to process any cash manually.
5. **Given** a scanned ticket is pending confirmation but the visitor does not have cash, **When** the agent chooses to release/cancel the scan, **Then** the ticket reverts safely to its previous state without corrupting any data, and is available for re-scanning.
6. **Given** the agent has confirmed cash payment received, **When** the booking transitions to `PAID`, **Then** a brief inline success indicator (green checkmark + visitor name) is displayed for no more than 2 seconds, after which the screen automatically resets to the idle camera-ready scanning state without any agent interaction required.

---

### User Story 2 - Role-Enforced Route Protection (Priority: P2)

Any user navigating the application sees only the screens and navigation links appropriate to their authenticated role. Unauthenticated users and users with insufficient privileges are gracefully blocked from accessing restricted areas with a visually premium, on-brand forbidden screen.

**Why this priority**: Without route-level enforcement, unauthorized users could access administrative panels, agent scanners, or financial dashboards by simply typing a URL. This is a fundamental security control that must exist before any protected feature is usable.

**Independent Test**: Can be tested by logging in as each of the 4 roles (USER, MARKETING_AGENT, FINANCIAL_MANAGER, ADMIN) and attempting to navigate to every protected route. Each role must see only their authorized pages, and forbidden routes must display a branded 403 screen with smooth entrance animations.

**Acceptance Scenarios**:

1. **Given** a user with role "USER", **When** they attempt to navigate to the agent scanner page, **Then** they are shown a premium animated 403 forbidden screen and the scanner route is completely absent from their navigation.
2. **Given** a user with role "MARKETING_AGENT", **When** they navigate to the scanner page, **Then** they can access it. When they try to access the admin pricing page, **Then** they are shown the 403 forbidden screen.
3. **Given** an unauthenticated visitor, **When** they attempt to access any protected route, **Then** they are redirected to the login page.
4. **Given** any authenticated user, **When** they inspect the rendered navigation, **Then** links to routes outside their role permissions are completely omitted from the navigation element.
5. **Given** a user with role "FINANCIAL_MANAGER", **When** they navigate to the `/financial` dashboard route, **Then** they can access it. When they try to access the agent scanner or admin pricing routes, **Then** they are shown the 403 forbidden screen.

---

### User Story 3 - Admin Ticket Price Management (Priority: P3)

An administrator updates ticket pricing through a dedicated management board. Price changes must apply only to future transactions while preserving the exact price recorded in all existing historical bookings, ensuring financial audit integrity.

**Why this priority**: Price management is an essential business operation, but it is lower priority than the gate verification security (P1) and route protection (P2) because it is a less frequent operation performed by fewer users. Financial integrity of historical records is critical.

**Independent Test**: Can be tested by recording a booking at the old price, updating the ticket price, then verifying the historical booking still shows the original price while new bookings reflect the updated price.

**Acceptance Scenarios**:

1. **Given** an admin user on the pricing management board, **When** they update a ticket type's price, **Then** the change is saved and all future bookings for that ticket type use the new price.
2. **Given** existing bookings were made at a previous price, **When** an admin updates the ticket price, **Then** all historical booking records retain their original total price values unchanged.
3. **Given** the pricing management board, **When** an admin views it, **Then** inputs follow the editorial design system: borderless rounded fields with tonal background layering, no visible line borders, and the park's brand typography.

---

### User Story 4 - Secure Authentication State Management (Priority: P2)

The application maintains a secure global authentication state that persists across page refreshes, synchronizes with local storage on component mount, and provides reliable role information for all downstream components and route guards.

**Why this priority**: This is a shared prerequisite for both route protection (US2) and role-specific features. Without a reliable auth context, no role-based feature can function correctly.

**Independent Test**: Can be tested by logging in, refreshing the page, and verifying the user remains authenticated with the correct role. Logging out must clear all stored credentials and redirect to the login screen.

**Acceptance Scenarios**:

1. **Given** a user logs in successfully, **When** they refresh the browser, **Then** they remain authenticated with the same role and user data.
2. **Given** a user is authenticated, **When** they log out, **Then** all stored session data is cleared and they are redirected to the login screen.
3. **Given** a stored session token has expired or been tampered with, **When** the application loads, **Then** the user is treated as unauthenticated and stale credentials are purged.

---

### Edge Cases

- **Rapid consecutive scans**: What happens when an agent scans the same QR code multiple times in rapid succession (within milliseconds)? The system must handle this gracefully, allowing only the first scan to succeed.
- **Network reconnection after offline warning**: When connectivity is restored after the offline warning appears, the scanner should automatically resume and the warning should dismiss.
- **Concurrent price updates**: If two administrators update the same ticket price simultaneously, the system must handle the conflict gracefully (last-write-wins is acceptable with audit trail).
- **Token expiration mid-session**: If a user's session token expires while they are actively using a protected page, the next server request should fail gracefully and redirect to login rather than showing raw errors.
- **Invalid or malformed QR codes**: Scanning a non-ticket QR code (e.g., a URL, random text) must display a user-friendly Arabic error rather than crashing the scanner.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST enforce exactly 4 roles with the following route-permission boundaries:
  - `USER`: public pages and own booking management only.
  - `MARKETING_AGENT`: USER access + agent QR scanner (`/scanner`).
  - `FINANCIAL_MANAGER`: USER access + financial dashboard (`/financial`). Blocked from `/scanner` and `/admin/pricing`.
  - `ADMIN`: full access to all routes including `/admin/pricing` and `/scanner`.
- **FR-002**: The system MUST authenticate users via secure token-based sessions, returning localized (Arabic) error messages for invalid sessions (401) and forbidden actions (403).
- **FR-003**: The system MUST prevent concurrent verification of the same ticket by atomically transitioning a booking from `PENDING_PAYMENT` to `SCANNING` in a single conditional operation; any attempt to scan a ticket already in `SCANNING` or `PAID` state MUST fail immediately with the Arabic rejection message.
- **FR-004**: The system MUST validate ticket dates exclusively against the server's own clock, never trusting client-provided date values, and reject tickets that do not match today's date.
- **FR-005**: The system MUST detect client device connectivity loss in real-time and immediately display a full-screen Arabic warning that prevents manual cash processing while offline.
- **FR-006**: The system MUST support releasing/cancelling a scanned ticket back to its previous state if a visitor cannot pay, without data corruption.
- **FR-007**: The system MUST hide navigation links for unauthorized routes from the rendered interface entirely, not merely disable them.
- **FR-008**: The system MUST display a premium, animated 403 forbidden screen when a user attempts to access a route outside their role permissions.
- **FR-009**: The system MUST allow administrators to update ticket prices, applying changes only to future transactions while preserving historical booking prices as immutable snapshots.
- **FR-010**: The system MUST manage authentication state as follows: access tokens expire after 15 minutes and are held in application memory only (never written to `localStorage` or `sessionStorage`); a secure `httpOnly` cookie carries the refresh token and is used to silently obtain a new access token before expiry; on application load, any stale or tampered state is purged and the user is treated as unauthenticated if silent refresh fails.
- **FR-011**: All user-facing interfaces MUST conform to the "Editorial Joy" design system: Plus Jakarta Sans typography, high-roundedness on all interactive elements, and the strict "No-Line" rule prohibiting 1px borders/dividers in favor of tonal layering.
- **FR-012**: After a booking is confirmed as `PAID`, the agent scanner MUST display an inline success indicator (green checkmark + visitor name) for no more than 2 seconds and then automatically reset to the idle camera-ready scanning state, requiring zero manual interaction from the agent.
- **FR-013**: The system MUST record a server-side audit log entry for every scan event, capturing: the authenticated agent's user ID, the booking ID, the action type (SCAN_SUCCESS, SCAN_REJECTED_DUPLICATE, SCAN_REJECTED_DATE, SCAN_CANCELLED), the server-generated UTC timestamp, and the outcome. No audit UI is required for this feature; the log must be queryable by future tooling.

### Key Entities

- **User**: Represents an authenticated individual with a name, contact information, credentials, and exactly one of the 4 defined roles determining their system permissions.
- **Booking**: Represents a ticket reservation tied to a user, ticket type, target date, quantity, total price (immutable snapshot at time of purchase), a unique scannable identifier, and a payment status that transitions atomically through exactly 3 states:
  - `PENDING_PAYMENT` — Initial state after booking creation; ticket is valid for scanning.
  - `SCANNING` — Atomic intermediate lock state; acquired by the first agent to scan the QR code, preventing any concurrent second scan from succeeding.
  - `PAID` — Terminal state; agent has confirmed cash payment received. Booking is closed.
  - A cancelled scan (visitor cannot pay) reverts from `SCANNING` back to `PENDING_PAYMENT`.
- **TicketType**: Represents a category of park entry pass with a name, current price, and optional discount. Price changes affect only new bookings.
- **ScanAuditLog**: An append-only record of every gate scan event, containing: agent user ID, booking ID, action type (one of: SCAN_SUCCESS, SCAN_REJECTED_DUPLICATE, SCAN_REJECTED_DATE, SCAN_CANCELLED), server UTC timestamp, and outcome detail. Records are never deleted or modified.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of concurrent duplicate scan attempts (same ticket, multiple devices) result in exactly one success and all others receiving an immediate rejection within 1 second.
- **SC-002**: 100% of tickets presented with a date mismatch are rejected, with zero false acceptances regardless of the client device's local clock settings.
- **SC-003**: The offline connectivity warning appears within 2 seconds of network loss, and 100% of agents see the warning before any manual processing can occur.
- **SC-004**: 100% of unauthorized route access attempts display the branded 403 screen with no raw error messages, broken layouts, or unprotected content flashes.
- **SC-005**: Historical booking price values remain unchanged after 100% of ticket price updates, verified across all existing records.
- **SC-006**: User sessions persist correctly across page refreshes 100% of the time for valid tokens, and stale sessions are cleared within 1 second of detection.
- **SC-007**: Silent token refresh completes before access token expiry in 100% of cases during an active session, with zero visible interruption to the agent or user; failed refresh attempts redirect to the login page within 2 seconds.

## Assumptions

- The existing JWT-based authentication system will be extended rather than replaced.
- The existing Booking and TicketType data models in the database will be augmented with any necessary fields rather than restructured.
- The FINANCIAL_MANAGER role's full permission set beyond the `/financial` dashboard will be defined in future feature specifications; the `/financial` route implemented here may be a placeholder screen.
- Arabic is the primary language for all user-facing error messages and warnings in the agent scanner and verification flows; English fallbacks are provided for non-Arabic locale users.
- The QR code scanner library is already integrated into the project.
- Network connectivity detection relies on browser-native APIs and is best-effort; brief micro-disconnections (under 1 second) may not trigger the warning.
