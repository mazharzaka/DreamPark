# Feature Specification: Global Auth State Management (RTK + RTK Query)

**Feature Branch**: `023-rtk-auth-state`
**Created**: 2026-05-22
**Status**: Draft
**Input**: User description: "Implement a complete global state management architecture for an authentication and user profile flow using Redux Toolkit (RTK) and RTK Query. Includes Sign Up and Login mutations, a protected User Profile query, JWT token injection via prepareHeaders, tag-based cache invalidation, authSlice with localStorage token persistence and logout, combined store configuration, and AuthForms and UserProfile React components."

---

## Clarifications

### Session 2026-05-22

- Q: How should the authentication token be stored on the client? → A: Dual-layer — Redux state as the runtime source of truth (lost on page close) combined with `localStorage` as the persistence layer (restored on app startup). This matches the existing codebase pattern.
- Q: Where does the user land after a successful login or sign up? → A: Redirected to the home route (`/`) immediately after authentication succeeds.
- Q: What fields does the User Profile entity expose? → A: `id`, `name`, `email`, `phone`, `avatar` — a rich but scope-bounded profile set.
- Q: Should authentication errors be reported to an external observability service? → A: No — console logging only; external error tracking is out of scope for this feature.
- Q: How should the client detect an expired token? → A: Passively — the request is sent with the stored token; if the server returns a 401 Unauthorised response, the client clears the token from storage and state, then presents a re-login prompt.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - New User Registration (Priority: P1)

A new visitor to the Dream Park web application wants to create an account. They navigate to the registration form, fill in their details (name, email, password), and submit. Upon successful registration, the system stores their authentication token, marks them as logged in, and automatically loads their profile without requiring them to log in separately.

**Why this priority**: Registration is the entry point for new users. Without it, no authenticated features are accessible. It also validates that the full authentication pipeline (form → API → token storage → profile fetch) works end-to-end.

**Independent Test**: Can be fully tested by completing the sign-up form and verifying that the user is redirected to their profile view, delivering a fully authenticated session.

**Acceptance Scenarios**:

1. **Given** a visitor is on the Sign Up form, **When** they submit valid name, email, and password, **Then** their session token is saved and they are immediately redirected to the home page (`/`).
2. **Given** a visitor submits a registration form, **When** the server rejects the request (e.g., email already taken), **Then** a clear, human-readable error message is shown inline without losing their form input.
3. **Given** a visitor submits an incomplete form, **When** required fields are missing, **Then** validation feedback is shown before the request is even sent.

---

### User Story 2 - Returning User Login (Priority: P1)

A returning user wants to log in to access their booking history and profile. They switch to the Login view on the authentication form, enter their email and password, and upon success are immediately shown their profile.

**Why this priority**: Login is the primary re-entry mechanism for existing users. Without a functioning login flow, returning users cannot access protected areas of the application.

**Independent Test**: Can be tested by logging in with a pre-existing test account and verifying that the user profile section displays accurate data fetched from the server.

**Acceptance Scenarios**:

1. **Given** a registered user is on the Login form, **When** they enter correct credentials and submit, **Then** they are authenticated, their token is persisted, and they are redirected to the home page (`/`).
2. **Given** a user enters incorrect credentials, **When** they submit the login form, **Then** an error message is shown and the form remains accessible for re-entry.
3. **Given** a returning user refreshes the application page, **When** a valid token exists from a previous session, **Then** the user is automatically considered authenticated and their profile is loaded without re-login.

---

### User Story 3 - Protected Profile Access (Priority: P2)

An authenticated user wants to view their personal profile information. The system automatically fetches profile data from the server using the user's stored token, and displays it in a dedicated profile view. Unauthenticated visitors cannot trigger this request.

**Why this priority**: Profile access is the primary protected feature demonstrating that the authentication architecture correctly gates server-side resources.

**Independent Test**: Can be tested by verifying that the profile view renders user data when authenticated, and shows a fallback (e.g., login prompt) when not authenticated — without any network request being made in the unauthenticated state.

**Acceptance Scenarios**:

1. **Given** an authenticated user navigates to the profile view, **When** their token is valid, **Then** their profile information (name, email, etc.) is displayed without requiring another login.
2. **Given** an unauthenticated visitor accesses the profile view, **When** no token exists, **Then** no profile request is made and a prompt to log in is shown instead.
3. **Given** an authenticated user's profile is loading, **When** the data has not yet arrived, **Then** a loading indicator is shown so the user knows the system is working.
4. **Given** a profile request fails (e.g., expired token), **When** the server returns an error, **Then** a graceful error message is shown with an option to log in again.

---

### User Story 4 - Secure Logout (Priority: P2)

An authenticated user wants to log out of the application. They trigger the logout action, and the system immediately clears their session, removes all cached data, and returns them to an unauthenticated state.

**Why this priority**: Secure logout is essential for user privacy and security, especially on shared devices.

**Independent Test**: Can be tested by logging out and verifying that the profile view disappears, no further authenticated requests are made, and refreshing the page does not restore the session.

**Acceptance Scenarios**:

1. **Given** an authenticated user triggers logout, **When** the action is confirmed, **Then** their token is removed from persistent storage and all previously cached server data is cleared.
2. **Given** a user logs out, **When** they refresh the page, **Then** they are not automatically re-authenticated and no profile data is shown.
3. **Given** multiple tabs are open, **When** the user logs out in one tab, **Then** the application state reflects the logged-out status consistently.

---

### Edge Cases

- What happens when the stored token has expired by the time the app reloads? The system does not pre-validate the token client-side. It fires the profile request as normal; if the server returns a 401 Unauthorised response, the client clears the token from both Redux state and `localStorage`, then presents a re-login prompt rather than a blank or broken screen.
- How does the system handle a network failure during login or registration? The error state from the API call must be surfaced clearly to the user.
- What if the user's local storage is unavailable (e.g., private browsing in some browsers)? The system must degrade gracefully and not crash — treating the user as unauthenticated.
- What happens if a user quickly toggles between Login and Sign Up forms? The forms should reset their states independently without carrying over previous error messages.
- What if a profile query returns partial or malformed data? The UI should not crash; it must show a fallback error state.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow new users to register with a name, email address, and password through a dedicated Sign Up form.
- **FR-002**: The system MUST allow existing users to authenticate using their email address and password through a Login form.
- **FR-003**: A single unified view MUST host both the Login and Sign Up forms, with a clear mechanism to toggle between them.
- **FR-004**: Upon successful registration or login, the system MUST store the received authentication token in a way that persists across page refreshes.
- **FR-005**: Upon successful login or registration, the system MUST redirect the user to the home page (`/`) and automatically retrieve the authenticated user's profile data without requiring additional user action.
- **FR-006**: The profile retrieval request MUST automatically include the stored authentication token so the server can authorize the request.
- **FR-007**: The profile retrieval MUST NOT be triggered when no authentication token exists, preventing unnecessary or unauthorized requests.
- **FR-008**: The system MUST display a loading indicator while any authentication or profile request is in progress.
- **FR-009**: The system MUST display a clear, specific error message when registration fails, login fails, or profile retrieval fails.
- **FR-010**: The system MUST provide a logout mechanism that immediately removes the stored token, clears all cached profile and user data, and returns the user to an unauthenticated state.
- **FR-011**: On application startup, the system MUST check for an existing stored token and, if found, rehydrate the authenticated session from storage without pre-validating token expiry. If the token is expired, the subsequent profile request will receive a 401 response, at which point the system MUST clear the token and prompt the user to log in again.
- **FR-012**: After a successful login or registration, the cache for user-related data MUST be invalidated or refreshed to ensure stale data from a previous session is not displayed.
- **FR-013**: The User Profile view MUST display the user's name, email, phone number (if available), and avatar image (if available). Absent optional fields MUST be replaced with a clearly labelled placeholder rather than a blank space or crash.

### Key Entities

- **AuthToken**: A short-lived credential issued by the server upon successful authentication. Represents proof of identity for all subsequent protected requests. Key attributes: token string, associated user identity.
- **UserProfile**: The authenticated user's personal information stored on the server. Key attributes: `id` (unique identifier), `name` (display name), `email` (contact address), `phone` (optional contact number), `avatar` (optional profile image URL). Linked to the AuthToken — only retrievable with a valid token. Fields `phone` and `avatar` may be absent if not yet set by the user; the UI must render gracefully in their absence.
- **AuthSession**: The client-side representation of the user's authentication state. Attributes: whether the user is authenticated (boolean), and the current token. Persisted across page loads via browser storage.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can complete the full journey from Sign Up form submission to viewing their profile in under 30 seconds under normal network conditions.
- **SC-002**: A returning user can log in and view their profile in under 15 seconds under normal network conditions.
- **SC-003**: 100% of profile requests made while unauthenticated are blocked at the client side before reaching the server.
- **SC-004**: After logout, 0 pieces of user-specific data remain accessible in the application state or UI.
- **SC-005**: On page refresh with an existing valid session, the user's authenticated state is restored in under 1 second without user intervention.
- **SC-006**: All error conditions (registration failure, login failure, profile load failure) surface a human-readable message within 2 seconds of the failure occurring.
- **SC-007**: 90% of users can successfully complete registration or login on their first attempt without external assistance.

---

## Assumptions

- Users are assumed to have a stable internet connection; offline usage or queued requests are out of scope for this feature.
- A backend authentication API already exists and exposes the required endpoints for registration, login, and profile retrieval.
- Token storage uses a **dual-layer strategy**: the token lives in Redux state as the runtime source of truth, and is mirrored to `localStorage` for persistence across page refreshes. On app startup the system reads `localStorage` to rehydrate Redux state. Encrypted or keychain-based storage is out of scope.
- Session expiry and token refresh (e.g., refresh tokens) are out of scope for this initial implementation; users with expired tokens must log in again.
- The same authentication flow applies to all user types; role-based access control is not part of this feature.
- Multi-factor authentication is out of scope.
- The application already has a Redux-compatible global state management foundation in place.
- Mobile native app considerations are out of scope; this targets web browsers only.
- Error observability is limited to browser console logging; integration with external error tracking services (e.g., Sentry, Datadog) is out of scope for this feature.
