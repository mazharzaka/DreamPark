# Data Model: Global Auth State Management

## Entities

### `UserProfile`
The authenticated user's personal information stored on the server and retrieved via the `/auth/profile` endpoint.

- **Attributes**:
  - `id` (string): Unique identifier.
  - `name` (string): Display name.
  - `email` (string): Contact address.
  - `phone` (string | undefined): Optional contact number.
  - `avatar` (string | undefined): Optional profile image URL.
- **Relationships**:
  - Requires a valid `AuthToken` to be retrieved.

### `AuthSession`
The client-side representation of the user's authentication state, managed by Redux (`authSlice`).

- **Attributes**:
  - `token` (string | null): The current JWT, or null if unauthenticated.
  - `isAuthenticated` (boolean): Derived state indicating if a token exists.
- **State Transitions**:
  - `Unauthenticated` -> `Authenticated`: Triggered by successful `login` or `signUp` mutation, or reading token from `localStorage` on init.
  - `Authenticated` -> `Unauthenticated`: Triggered by explicit `logout` action, or a `401 Unauthorized` response from the API.

### `AuthToken`
A short-lived credential issued by the server.

- **Attributes**:
  - `token` (string): The JWT string.
- **Validation**:
  - Handled passively by the server. If expired, server returns 401.
