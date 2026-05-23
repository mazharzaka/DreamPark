# Research & Decisions: Global Auth State Management

## Clarified Decisions (from Specification Phase)

All major technical unknowns were resolved during the specification clarification phase.

### Decision 1: Token Storage Strategy
- **Decision**: Dual-layer storage (Redux state + `localStorage`).
- **Rationale**: Redux serves as the fast, reactive runtime source of truth. `localStorage` provides persistence across page reloads. This pattern is standard for SPAs and matches existing practices in the codebase (e.g., `bookingsApi.ts`).
- **Alternatives considered**: `localStorage` only (less reactive), `httpOnly` cookies (requires backend changes, out of scope).

### Decision 2: Post-Authentication Navigation
- **Decision**: Redirect to the home route (`/`).
- **Rationale**: Provides a seamless user experience, avoiding complex modal states or staying on a dedicated auth page after success.

### Decision 3: Token Expiry Detection
- **Decision**: Passive 401 detection.
- **Rationale**: The client attaches the token and waits for the server. If a `401 Unauthorized` is returned, the client clears state and prompts re-login. This avoids the need for JWT decoding libraries on the client and is perfectly robust.
- **Alternatives considered**: Active JWT parsing and checking the `exp` claim on startup. Rejected to keep the client simple and decoupled from token format specifics.

### Decision 4: Observability
- **Decision**: Console logging only.
- **Rationale**: No external monitoring services are mandated in the project, keeping the scope focused.
