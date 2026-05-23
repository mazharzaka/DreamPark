# Research: Hybrid Authentication & User Profile Flow

**Feature**: 024-hybrid-auth-profile  
**Date**: 2026-05-23  
**Status**: Complete — all unknowns resolved

---

## 1. Custom RTK Query `baseQuery` with Reactive 401 Refresh

**Decision**: Implement a `baseQueryWithReauth` wrapper around `fetchBaseQuery` using RTK Query's `re-dispatch` mutex pattern.

**Rationale**: The clarified approach (Q3: reactive 401) maps directly to RTK Query's documented `customBaseQuery` pattern. A `Mutex` from the `async-mutex` package prevents race conditions when multiple in-flight requests simultaneously receive a 401 and all try to refresh at once — without it, the app would fire N refresh requests instead of 1.

**Implementation pattern**:
```typescript
// Pseudocode — not final
const mutex = new Mutex();

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        // Call /auth/refresh — cookie is sent automatically
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
        if (refreshResult.data) {
          // Store new access token in authSlice (memory only)
          api.dispatch(setCredentials(refreshResult.data));
          // Retry the original request
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh failed — full logout
          api.dispatch(clearCredentials());
          api.dispatch(authApi.util.resetApiState());
        }
      } finally {
        release();
      }
    } else {
      // Another request is already refreshing — wait and retry
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};
```

**New dependency**: `async-mutex` (lightweight, 0 transitive deps) — justified by race-condition prevention requirement.

**Alternatives considered**:
- `p-limit`: Too coarse, doesn't handle the "wait and retry" pattern cleanly.
- Proactive timer: Rejected (Q3 decision) — off-by-one timing, multi-tab issues.

---

## 2. OTP Storage Strategy (Backend)

**Decision**: Store OTP in a separate `OtpToken` Mongoose collection (not embedded in `User`), with a TTL index of 600 seconds (10 min) for automatic expiry.

**Rationale**: 
- Embedding OTP in `User` requires writing to the user doc on every OTP request, causing write conflicts and making it hard to enforce the 3-resend/15-min rate limit cleanly.
- A separate `OtpToken` collection with `{ userId, purpose, code, expiresAt, attempts }` fields supports both OTP purposes (`account_activation`, `password_reset`) and the rate-limit counter atomically.
- MongoDB TTL index on `expiresAt` auto-deletes expired tokens — no cron job needed.

**Schema**:
```javascript
{ userId, purpose: enum['account_activation','password_reset'],
  code: String (hashed), expiresAt: Date, resendCount: Number,
  windowStart: Date }
```

**Rate limit enforcement**: On each resend request, check `resendCount >= 3 && Date.now() < windowStart + 15min` → return 429.

**Alternatives considered**:
- Redis with TTL: Overkill for this scale; adds an infrastructure dependency not currently in the stack.
- Embedded in User doc: Rejected — write conflicts, harder rate limiting.

---

## 3. Refresh Token Storage & Rotation

**Decision**: Backend issues a `refreshToken` as an `httpOnly, Secure, SameSite=Strict` cookie. Access token returned in the JSON response body only (stored in Redux `authSlice`, never in `localStorage`).

**Rationale**: Aligns with FR-009 (clarified). The frontend never reads the cookie — the browser sends it automatically on requests to the same origin. On every successful refresh, the backend issues a new refresh token (rotation) and invalidates the old one to prevent replay attacks.

**Backend additions to `authController.js`**:
- `login`: set `refreshToken` cookie + return `{ success: true, data: { user }, token: <accessToken> }`.
- `POST /auth/refresh`: read cookie → validate → issue new access token + rotate cookie.
- `POST /auth/logout`: clear the cookie + blacklist the refresh token.

**Token lifetimes**:
- Access token: 15 minutes (`JWT_ACCESS_EXPIRES=15m`).
- Refresh token: 7 days (`JWT_REFRESH_EXPIRES=7d`).

**Alternatives considered**:
- Access token in `localStorage`: Rejected (XSS risk, FR-009 explicitly prohibits persistent browser storage).
- Refresh token in `localStorage`: Rejected (same reason).

---

## 4. Google OAuth Integration Pattern

**Decision**: Backend-driven OAuth code exchange (Authorization Code Flow), not implicit/token flow.

**Rationale**: The Next.js frontend redirects the user to Google's OAuth endpoint. Google returns an `?code=` to a backend callback route (`/api/auth/google/callback`). The backend exchanges the code for user info using `googleapis` or `google-auth-library`, finds/creates the user, and redirects to the frontend with an access token in a query param (short-lived, single-use) that the frontend reads once and stores in Redux.

**New backend dependency**: `google-auth-library` — justified for Google ID token verification.

**Frontend flow**:
1. `SocialLogin` component → `window.location.href = /api/auth/google` (backend initiates OAuth).
2. Backend callback sets cookie + redirects to `/auth/callback?token=<shortLivedToken>`.
3. Frontend `OAuthCallbackPage` reads token from URL, dispatches `setCredentials`, replaces URL state.

**Apple Sign-In**: Disabled UI button with "Coming Soon" tooltip (Q4 decision). No backend code added in MVP.

---

## 5. QR Code Rendering Library

**Decision**: Use `qrcode.react` (v3+) — already the most common React QR package, zero configuration, works with Next.js App Router.

**Rationale**: Each booking row renders `<QRCodeSVG value={booking.qrCodeId} />`. The `qrCodeId` UUID is already stored in the `Booking` model and accepted by `/api/tickets/verify`. No backend changes needed.

**Fallback**: If the component throws, a React `ErrorBoundary` wrapping the QR section renders the shortened `qrCodeId` as monospace text.

**New frontend dependency**: `qrcode.react` — justified by per-booking QR requirement (FR-015).

---

## 6. `getUserBookings` Query Filter

**Decision**: Filter is applied on the **backend** (not frontend) for security and performance. The `GET /api/tickets/bookings/user` endpoint accepts query params `?from=<ISO date>&sort=targetDate&order=asc`.

**Rationale**: Client-side filtering of all historical bookings wastes bandwidth. The backend computes `from = today - 30 days` and returns only scoped results. Frontend passes the computed `from` date as a query param via the RTK Query endpoint definition.

**Sort**: upcoming bookings (`targetDate >= today`) first (ascending), then recent past in descending order. This requires two sorted result sets merged, or a computed field. Simplest approach: backend returns `targetDate >= (today - 30 days)` sorted ascending; frontend splits at `today` to render the two groups visually.

---

## 7. `authSlice` Refactor — Memory-Only Access Token

**Decision**: Remove all `localStorage` read/write from `authSlice`. The initial state is always `{ accessToken: null, user: null, isAuthenticated: false }` on page load. Session is restored via the refresh endpoint called once on app mount (handled by a `useEffect` in `StoreProvider` or a root layout component).

**Rationale**: FR-009 explicitly prohibits storing the access token in persistent browser storage. The current `authSlice.ts` reads from `localStorage` on init — this must be removed.

**Session restoration on refresh**: On mount, the app calls `POST /auth/refresh` (cookie is sent automatically). If successful → `setCredentials`. If 401 → stay unauthenticated. This happens once, silently, before the UI renders authenticated content.
