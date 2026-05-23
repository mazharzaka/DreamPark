# Feature Specification: Hybrid Authentication & User Profile Flow

**Feature Branch**: `024-hybrid-auth-profile`  
**Created**: 2026-05-23  
**Status**: Draft  
**Input**: User description: "Hybrid Authentication & Profile Flow for Dream Park — Traditional password auth, OTP verification, Social sign-in placeholders, secure token architecture (Access Token in Redux memory / Refresh Token in httpOnly cookie), RTK Query API slice refactor, and a premium editorial User Profile page with QR code and active bookings."

---

## Clarifications

### Session 2026-05-23

- Q: Should the system enforce a maximum number of OTP resend attempts to prevent abuse? → A: Max 3 resend requests per 15-minute window; 4th attempt shows a "Please wait" message with a countdown timer.
- Q: Which bookings should appear in the Active Bookings section on the profile page? → A: Upcoming visits (targetDate ≥ today) plus bookings from the last 30 days, sorted future-first.
- Q: How should silent session renewal be initiated? → A: Reactive — when any authenticated request returns a 401, the system transparently calls the refresh endpoint once, retries the original request, and only redirects to login if the refresh also fails.
- Q: Which social providers must be fully wired vs. placeholder in the MVP? → A: Google OAuth fully implemented; Apple button renders but is disabled with a "Coming Soon" indicator in the MVP.
- Q: What does the profile QR code encode — user identity or booking UUID? → A: No single profile QR; each booking row in Active Bookings shows its own QR encoding the booking's qrCodeId UUID, matching the existing /api/tickets/verify contract.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Register with Email & Password + OTP Activation (Priority: P1)

A new visitor wants to create a Dream Park account so they can purchase tickets and
manage their bookings. They fill in their name, email/phone, and password. After
submitting, the system immediately sends a one-time passcode (OTP) to their email
address. The user enters the OTP to activate their account. Only after successful
activation is the account usable for login.

**Why this priority**: Registration and activation are the gateway to every other
authenticated feature. Without a working sign-up flow, no other user story can
be exercised.

**Independent Test**: A tester can open the app as an anonymous visitor, complete
the sign-up form, receive a real OTP, enter it, and land on the home page as a
verified user — without needing any other feature to be live.

**Acceptance Scenarios**:

1. **Given** an anonymous visitor on the Sign-Up page, **When** they submit valid name, email, and password (≥ 8 chars), **Then** the system creates a pending account, dispatches an OTP to their email, and redirects them to the OTP verification screen.
2. **Given** a user on the OTP verification screen, **When** they enter the correct 6-digit code within 10 minutes, **Then** their account is activated, an access session is started, and they are redirected to the home page.
3. **Given** a user on the OTP verification screen, **When** they enter an incorrect or expired code, **Then** an inline error is displayed and they can request a new OTP.
4. **Given** a visitor who tries to register with an email that already exists, **When** they submit the form, **Then** the system returns a clear error message without creating a duplicate account.

---

### User Story 2 — Login with Email & Password (Priority: P1)

An existing, verified Dream Park member wants to sign in quickly using their email
and password. After successful credential verification, they receive a short-lived
access session and the application keeps them logged in seamlessly across page
refreshes without exposing their credentials in browser storage.

**Why this priority**: Login is required for any personalized experience (booking,
profile, QR code). It is the most-used authentication path.

**Independent Test**: A tester with a pre-existing verified account can log in, be
redirected to the home page with a visible authenticated state (nav updates, "My
Profile" link appears), and after a hard page refresh, still be recognized as logged in.

**Acceptance Scenarios**:

1. **Given** a verified user on the Login page, **When** they submit correct email and password, **Then** they are authenticated, their profile data is available in the app, and the browser session persists across refreshes.
2. **Given** a user on the Login page, **When** they submit an incorrect password, **Then** a descriptive error is shown and no session is created.
3. **Given** an unverified user (OTP not yet confirmed), **When** they attempt to log in, **Then** the system informs them their account is not yet activated and provides the option to resend the OTP.
4. **Given** an authenticated user who idles past the session timeout, **When** they perform an action requiring authentication, **Then** the system silently obtains a new access session using the stored refresh credential, without interrupting the user.

---

### User Story 3 — Forgot Password → Reset via OTP (Priority: P2)

A returning visitor has forgotten their password. They request a reset from the
login page, receive an OTP to their registered email, enter the OTP to prove identity,
and set a new password — all without contacting support.

**Why this priority**: Password recovery is essential for retention. Without it, locked-out
users abandon the platform.

**Independent Test**: A tester who "forgets" their password can complete the full
reset flow (request → OTP entry → new password) and immediately log in with the
new credentials.

**Acceptance Scenarios**:

1. **Given** a user on the Forgot Password page, **When** they enter a registered email, **Then** the system sends a reset OTP and shows a confirmation message without revealing whether the email exists (anti-enumeration).
2. **Given** a user on the OTP entry step, **When** they enter the valid OTP, **Then** they are taken to the new-password form.
3. **Given** a user on the new-password form, **When** they submit a valid new password (≥ 8 chars, confirmed), **Then** their password is updated and they are redirected to login with a success message.
4. **Given** a user on the OTP entry step, **When** the OTP has expired (> 10 minutes), **Then** they see an expiry error and can request a fresh OTP.

---

### User Story 4 — Social Sign-In (Google / Apple) (Priority: P3)

A visitor does not want to create a password-based account. They click "Continue
with Google" or "Continue with Apple" and are taken through the provider's standard
OAuth flow. On successful return, they are signed in and their profile is populated
with data from the provider.

**Why this priority**: Social login reduces sign-up friction, which increases conversion.
It is lower priority than password auth because it requires third-party setup and
is delivered as integration placeholders in the MVP.

**Independent Test**: A tester can click the Google/Apple sign-in button, be
redirected to a mock/real provider, return to the app, and find themselves authenticated
with a populated profile — without going through the email/password flow.

**Acceptance Scenarios**:

1. **Given** an anonymous visitor on the Login or Sign-Up page, **When** they click "Continue with Google", **Then** they are redirected to the Google OAuth consent screen.
2. **Given** a user returning from Google OAuth with a valid code, **When** the backend exchanges the code for user info, **Then** an account is created or matched by email, a session is started, and the user lands on the home page.
3. **Given** a user who previously signed in via Google, **When** they click "Continue with Apple", **Then** a tooltip or badge reading "Coming Soon" is displayed and no redirect occurs (Apple Sign-In is a post-MVP feature).
4. **Given** a user who previously signed in via Google, **When** they attempt password-based login with the same email, **Then** the system matches the account by email and adds the password credential as a linked provider rather than creating a duplicate.

---

### User Story 5 — View & Manage Personal Profile (Priority: P2)

An authenticated Dream Park member visits their profile page to review their personal
information, see a unique QR code representing their identity, and check their active
bookings and passes.

**Why this priority**: The profile page is the authenticated user's home base. It
displays the QR code used at park gates and the booking history, making it
operationally critical for in-park experience.

**Independent Test**: An authenticated tester navigates to `/profile`, sees their
name, email, phone, a scannable QR code encoding their user ID, and a list of
their active ticket bookings — all updating live when the underlying data changes.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the Profile page, **When** the page loads, **Then** their name, email, phone number, and linked provider badges are displayed without a manual refresh.
2. **Given** an authenticated user with upcoming or recent bookings, **When** they view the Active Bookings section, **Then** each booking row displays a unique scannable QR code encoding that booking's identifier, which a marketing agent can scan to confirm payment at park gates.
3. **Given** an authenticated user with active bookings, **When** they view the Active Bookings section, **Then** each booking shows: ticket type, visit date, quantity, total price, payment status (`PENDING_PAYMENT` or `PAID`), and its individual scannable QR code.
4. **Given** an unauthenticated visitor navigating to the Profile page, **When** the page loads, **Then** they are redirected to the Login page.
5. **Given** an authenticated user who clicks Logout, **When** the action completes, **Then** their session is fully cleared (in-memory state, cached API responses, any browser-stored tokens) and they are redirected to the home page.

---

### User Story 6 — Marketing Agent QR Scan & Payment Confirm (Priority: P2)

A Dream Park marketing agent opens the scan tool, points their device at a visitor's
profile QR code, and confirms that the visitor's booking is paid — all in real time
without paper tickets.

**Why this priority**: This closes the loop between online booking and physical gate
experience, which is a core operational requirement for the MVP.

**Independent Test**: A tester with a `MARKETING_AGENT` role opens the scan page,
scans a QR code UUID, and receives a success confirmation that the booking is
marked as `PAID`.

**Acceptance Scenarios**:

1. **Given** a MARKETING_AGENT on the scan page, **When** they scan a valid QR code for a `PENDING_PAYMENT` booking on the correct visit date, **Then** the booking status is changed to `PAID` and a success message is shown.
2. **Given** a MARKETING_AGENT scanning a QR code, **When** the booking is already `PAID`, **Then** the agent sees an "Already paid" message.
3. **Given** a regular user (non-agent) attempting to access the scan endpoint or page, **When** the request is made, **Then** they receive a permission-denied error.

---

### Edge Cases

- What happens when the OTP verification screen is refreshed mid-flow? The user must be able to return to OTP entry without restarting sign-up.
- What if a user exhausts their 3 OTP resend attempts? The system must show a "Please wait" message with a countdown timer until the 15-minute window resets; no further resend requests are accepted until then.
- What if a social provider returns an email that is already registered via password? The system must link accounts (not create duplicates) or inform the user.
- What if the access session expires while the user is actively filling the Booking form? The system must transparently renew the session and resubmit the request — form data must not be lost.
- What if the silent renewal request itself returns an error (e.g., refresh credential revoked)? All session state must be cleared immediately and the user redirected to the login page with a "Your session has ended" message.
- What if the backend is unreachable during login? A user-friendly offline/retry message must be displayed without crashing the UI.
- What if the user has zero bookings (no upcoming and no bookings in the past 30 days)? The Active Bookings section must show a graceful empty state with a prompt to book tickets.
- What if a booking's visit date falls exactly on the 30-day boundary? The system must include it (boundary is inclusive: today − 30 days ≤ targetDate).
- What if the QR library fails to render a booking QR code? A fallback plain-text display of the booking's reference number (shortened `qrCodeId`) must be shown in its place.

---

## Requirements *(mandatory)*

### Functional Requirements

**Authentication**

- **FR-001**: The system MUST allow users to register with a full name, email address, phone number, password, and password confirmation.
- **FR-002**: Passwords MUST be at minimum 8 characters and MUST never be stored or transmitted in plain text.
- **FR-003**: Upon successful registration, the system MUST send a 6-digit OTP to the user's email and transition them to an OTP verification screen.
- **FR-004**: OTP codes MUST expire after 10 minutes. Users MUST be able to request a fresh OTP from the verification screen. The system MUST enforce a maximum of 3 resend requests per 15-minute window. On the 4th attempt within that window, the system MUST display a "Please wait" message with a visible countdown timer indicating when the next resend is available.
- **FR-005**: Account login MUST be blocked until OTP verification is complete.
- **FR-006**: The system MUST support login via email + password for verified accounts.
- **FR-007**: The system MUST support a "Forgot Password" flow: user requests reset via email → OTP sent → OTP verified → new password set.
- **FR-008a**: The system MUST provide a fully functional "Continue with Google" OAuth flow. Google Sign-In MUST create or match accounts by email without creating duplicate accounts. The Google sign-in button MUST be active and redirect users to the Google OAuth consent screen.
- **FR-008b**: The system MUST display a "Continue with Apple" button in the MVP. This button MUST be visually disabled and display a "Coming Soon" indicator when interacted with. Apple Sign-In backend integration is deferred to a post-MVP release.
- **FR-009**: Authenticated sessions MUST use a short-lived access credential held only in application memory (never in persistent browser storage) and a long-lived refresh credential held in a secure, non-script-accessible browser cookie.
- **FR-010**: When any authenticated request receives a session-expired error response, the system MUST transparently call the session renewal endpoint exactly once, then retry the original failed request with the new credential. If the renewal request itself fails (expired or revoked refresh credential), the system MUST clear all session state and redirect the user to the login page. The user MUST NOT be shown a login prompt mid-session unless the renewal fails.
- **FR-011**: All authenticated API requests MUST automatically attach the current access credential in the request authorization header without requiring manual intervention in each call.
- **FR-012**: The logout action MUST clear all in-memory session state, all cached profile and booking data, and any browser storage tokens, then redirect the user to the home page.

**User Profile**

- **FR-013**: The system MUST provide a profile page accessible only to authenticated users, redirecting unauthenticated visitors to the login page.
- **FR-014**: The profile page MUST display: full name, email, phone number, and a list of linked sign-in providers (e.g., "Email/Password", "Google").
- **FR-015**: The profile page MUST NOT display a single permanent identity QR code. Instead, each booking row in the Active Bookings section MUST display its own unique, scannable QR code encoding that booking's `qrCodeId` UUID — the same identifier accepted by the `/api/tickets/verify` endpoint. This eliminates the need for a new backend lookup path.
- **FR-016**: The profile page MUST display an "Active Bookings" section listing the authenticated user's bookings scoped to: (a) all bookings whose visit date is today or in the future, and (b) bookings from the past 30 days. Results MUST be displayed sorted with the earliest upcoming visit first, followed by recent past bookings in reverse chronological order. Each booking row MUST show: ticket type name, visit date, quantity, total price, payment status (`PENDING_PAYMENT` or `PAID`), and a scannable QR code encoding the booking's `qrCodeId` UUID.
- **FR-017**: The "Active Bookings" section MUST show a graceful empty state when the user has no bookings.

**API & State**

- **FR-018**: All authentication API calls MUST go through a dedicated RTK Query API slice (`authApi`) using the project's standard base URL and authorization header injection.
- **FR-019**: The `authApi` slice MUST expose the following operations:
  - `signUpWithPassword` — creates a pending account
  - `verifyAccountOTP` — activates account after OTP confirmation
  - `loginWithPassword` — authenticates and returns access credential
  - `forgotPasswordRequest` — triggers OTP dispatch for password reset
  - `resetPasswordWithOTP` — validates OTP and sets new password
  - `socialLogin` — handles OAuth provider callback
  - `logoutServer` — invalidates the refresh credential on the server
  - `getProfile` — fetches authenticated user profile (cached with `'UserProfile'` tag)
  - `getUserBookings` — fetches the user's booking list (cached with `'UserBookings'` tag)
- **FR-020**: Cache invalidation MUST be triggered correctly: login/signup must invalidate `'UserProfile'`; logout must invalidate both `'UserProfile'` and `'UserBookings'` and reset the entire RTK Query cache.

### Key Entities

- **User**: A registered individual with name, email, phone, hashed password, role, linked social providers, and verification status.
- **OTP**: A 6-digit time-limited code associated with a user and a purpose (account activation or password reset).
- **Session**: Composed of an in-memory access credential (short-lived) and a server-stored refresh credential (long-lived, transmitted via secure cookie).
- **Booking**: A park entry or ride reservation linked to a user, containing ticket type, visit date, quantity, total price, payment status, and a unique QR identifier.
- **TicketType**: A category of park pass (e.g., General Admission, Fast Track) with price and description.
- **LinkedProvider**: A record of a social sign-in provider (Google, Apple) linked to a user account.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can complete the full sign-up + OTP verification flow in under 2 minutes under normal conditions.
- **SC-002**: A returning user can log in and reach an authenticated page in under 30 seconds.
- **SC-003**: Session continuity is maintained across page refreshes without requiring the user to log in again, as long as the long-lived refresh credential is valid.
- **SC-004**: Silent session renewal happens invisibly — users never see a forced logout mid-session unless the refresh credential has genuinely expired.
- **SC-005**: The profile page loads with all user data, QR code, and bookings visible within 3 seconds on a standard connection.
- **SC-006**: Logout completes (state clear + redirect) in under 500 ms of the user clicking the button.
- **SC-007**: A marketing agent can verify a booking QR code and receive a confirmation in under 5 seconds.
- **SC-008**: 100% of credential data is cleared from browser storage on logout — no tokens, no cached user data remain accessible via browser developer tools.
- **SC-009**: Social sign-in entry points are present and functional as OAuth redirects for the MVP, even if the backend OAuth exchange is in a stub/placeholder state.
- **SC-010**: All profile and booking data displayed on the profile page is reactive — updating automatically if the underlying data changes without requiring a page reload.

---

## Assumptions

- The backend already has working `/auth/signup` and `/auth/login` endpoints returning `{ success, token, data }`. This spec extends them with OTP, refresh-token, and social login endpoints.
- OTP delivery is via email only in the MVP; SMS delivery is deferred.
- Social sign-in (Google/Apple) backend handlers may be stubs in the MVP; the frontend will implement the redirect and callback UI structure so the backend can be wired later.
- The `httpOnly` refresh token cookie is set and cleared by the backend — the frontend never reads or writes it directly.
- The `UserProfile` data model on the backend already exposes `id`, `name`, `email`, `phone`, `role`, and will be extended to include `linkedProviders`.
- QR code rendering is handled by a frontend library (e.g., `qrcode.react`) using the user's `id` as the encoded value.
- The existing `authSlice.ts`, `authApi.ts`, `LoginForm.tsx`, `SignupForm.tsx`, and `UserProfile.tsx` are the primary files to be refactored — no new routing is required beyond what is already in place.
- RTL (Arabic) layout support is required for all new UI components, consistent with the existing internationalisation setup.
- The "Editorial Joy" design system (no border lines, ambient shadows, glassmorphism, primary/secondary colour tokens) applies to all new UI elements.
