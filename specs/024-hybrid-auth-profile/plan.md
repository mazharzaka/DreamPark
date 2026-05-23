# Implementation Plan: Hybrid Authentication & User Profile Flow

**Branch**: `024-hybrid-auth-profile` | **Date**: 2026-05-23 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/024-hybrid-auth-profile/spec.md`

---

## Summary

Refactor and extend the Dream Park authentication system from a single-token localStorage-based flow into a fully secure **hybrid auth architecture**: short-lived JWT access token held in Redux memory, long-lived refresh token in an `httpOnly` cookie, OTP-based account activation and password reset (3 resends / 15-min window), Google OAuth (Apple deferred), and a premium editorial User Profile page displaying per-booking QR codes scoped to upcoming visits + last 30 days.

---

## Technical Context

**Language/Version**: TypeScript 5 (frontend) / Node.js LTS + ES Modules (backend)  
**Primary Dependencies**:
- Frontend: Next.js 14, Redux Toolkit + RTK Query, `async-mutex` (new), `qrcode.react` (new), Framer Motion, Tailwind CSS, `next-intl`, `react-hook-form`
- Backend: Express.js, Mongoose, `jsonwebtoken`, `bcryptjs`, `google-auth-library` (new), `nodemailer` or email SDK (new — OTP delivery)

**Storage**: MongoDB (Mongoose) — new `OtpToken` collection added  
**Testing**: Manual E2E + RTK Query cache validation via Redux DevTools  
**Target Platform**: Browser (Next.js SSR/CSR hybrid) + Node.js server  
**Project Type**: Full-stack web application (frontend + backend monorepo)  
**Performance Goals**: Profile page loads within 3s; login round-trip < 30s; logout < 500ms  
**Constraints**: Access token NEVER in localStorage/sessionStorage; refresh token NEVER readable by JS; OTP max 3 resends / 15 min  
**Scale/Scope**: MVP — single-server, up to ~1k concurrent users

---

## Constitution Check

*GATE: Must pass before implementation. Re-checked after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Controller-Route-Model Architecture** | ✅ PASS | New OTP and auth endpoints follow the three-layer pattern. `otpController.js`, `otpRoutes.js`, `OtpToken.js` created per convention. |
| **II. ES Modules Exclusively (Backend)** | ✅ PASS | All new backend files use `import`/`export`. No `require()`. |
| **III. Mandatory try-catch in Controllers** | ✅ PASS | All controller functions wrapped with `catchAsync`. |
| **IV. Consistent API Response Contract** | ✅ PASS | All new endpoints return `{ success, data }` or `{ success, error }`. Auth endpoints add `token` alongside `success + data`. |
| **V. Dynamic Content via `pageKey`** | ✅ N/A | This feature adds no new page-specific content collection. |
| **VI. RBAC** | ✅ PASS | No new roles. `USER`, `MARKETING_AGENT`, `ADMIN` used correctly. Login endpoint does not require `protect`. Profile and bookings endpoints require `protect`. |
| **VII. Feature Folder Architecture** | ✅ PASS | Auth components remain in `src/features/auth/`. New `OtpVerification`, `ForgotPassword`, `ResetPassword`, `UserProfile` components added inside `src/features/auth/components/`. |
| **VIII. Frontend Route Map** | ✅ PASS | No new routes added. Existing `/login`, `/signup`, and a new `/[locale]/profile` route registered in the Route Map (see below). |
| **IX. State Management (RTK Query)** | ✅ PASS | All API calls through `authApi` slice. No inline `fetch`. |
| **X. i18n Contract** | ✅ PASS | All UI strings use `useTranslations('Auth')`. RTL verified for all new components. |
| **XI. Editorial Joy Design System** | ✅ PASS | No `border` dividers. `shadow-ambient` only. `rounded-xl`/`rounded-full`. `bg-primary` CTAs only. |
| **XII. Framer Motion** | ✅ PASS | OTP digit inputs, profile card reveal, booking cards use `motion.div` entrance animations. |

**New Route registered** (per Constitution Part 4, Principle VIII):

| Route | Page File | Feature Module | Notes |
|-------|-----------|----------------|-------|
| `/[locale]/profile` | `app/[locale]/profile/page.tsx` | `features/auth` | Authenticated user profile (redirects unauthenticated visitors to `/login`) |

**New Backend Endpoints registered** (per Constitution Part 2):

| Method | Path | Auth | Responsibility |
|--------|------|------|----------------|
| POST | `/api/auth/send-otp` | Public | Send/resend OTP for account activation or password reset |
| POST | `/api/auth/verify-otp` | Public | Verify OTP code — returns purpose result |
| POST | `/api/auth/reset-password` | Public | Set new password after OTP verification |
| POST | `/api/auth/refresh` | Cookie | Exchange refresh cookie for new access token |
| POST | `/api/auth/logout` | Protected | Invalidate refresh token, clear cookie |
| GET | `/api/auth/profile` | Protected | Fetch authenticated user's profile |
| GET | `/api/auth/google` | Public | Initiate Google OAuth redirect |
| GET | `/api/auth/google/callback` | Public | Google OAuth callback — issues session |

---

## Project Structure

### Documentation (this feature)

```text
specs/024-hybrid-auth-profile/
├── plan.md              ← this file
├── research.md          ← Phase 0 complete
├── data-model.md        ← Phase 1 output
├── contracts/
│   └── auth-api.md      ← Phase 1 output
└── tasks.md             ← Phase 2 output (/speckit-tasks)
```

### Source Code — Backend (`BackEnd/src/`)

```text
BackEnd/src/
├── models/
│   ├── User.js              ← MODIFY: add linkedProviders[], isVerified, refreshTokenHash
│   └── OtpToken.js          ← NEW: { userId, purpose, code(hashed), expiresAt, resendCount, windowStart }
├── controllers/
│   └── authController.js    ← MODIFY: add sendOtp, verifyOtp, resetPassword, refresh, logout, getProfile, googleCallback
├── routes/
│   └── authRoutes.js        ← MODIFY: register 8 new endpoints with @swagger blocks
├── middlewares/
│   └── authMiddleware.js    ← MODIFY: add refresh token validation helper
└── utils/
    ├── sendEmail.js          ← NEW: nodemailer OTP email sender
    └── otpUtils.js           ← NEW: generate, hash, verify OTP helpers
```

### Source Code — Frontend (`my-app/src/`)

```text
my-app/src/
├── lib/
│   └── features/
│       └── auth/
│           ├── authSlice.ts          ← MODIFY: remove localStorage; add accessToken, user fields; add setCredentials/clearCredentials actions
│           └── authApi.ts            ← MODIFY: replace baseQuery with baseQueryWithReauth; add 9 new endpoints
├── features/
│   └── auth/
│       ├── components/
│       │   ├── LoginForm.tsx          ← MODIFY: use new loginWithPassword mutation + error states
│       │   ├── SignupForm.tsx         ← MODIFY: on success → redirect to OTP screen
│       │   ├── OtpVerification.tsx    ← NEW: 6-digit OTP input, resend with countdown timer
│       │   ├── ForgotPassword.tsx     ← NEW: email entry form
│       │   ├── ResetPassword.tsx      ← NEW: new password + confirmation form
│       │   ├── SocialLogin.tsx        ← MODIFY: Google active, Apple disabled w/ "Coming Soon"
│       │   └── UserProfile.tsx        ← MODIFY: full editorial redesign with booking QR cards
│       ├── hooks/
│       │   └── useSessionRestore.ts   ← NEW: calls /auth/refresh on app mount
│       └── types/
│           └── auth.types.ts          ← NEW: TypeScript interfaces for all auth entities
├── components/
│   └── ui/
│       └── BookingQrCard.tsx          ← NEW: booking row with QRCodeSVG + fallback ErrorBoundary
└── app/
    └── [locale]/
        ├── profile/
        │   └── page.tsx               ← NEW: profile page (server component wrapper, auth guard)
        ├── login/
        │   └── page.tsx               ← MODIFY: pass through OTP redirect state
        └── signup/
            └── page.tsx               ← MODIFY: handle post-signup OTP redirect
```

---

## Phase 0: Research — Complete ✅

See [research.md](./research.md) for full decision log.

**Key decisions**:

| Topic | Decision |
|-------|----------|
| Silent refresh | Reactive 401-catch with `async-mutex` to prevent concurrent refresh storms |
| OTP storage | Separate `OtpToken` collection with TTL index + `resendCount`/`windowStart` fields |
| Refresh token | `httpOnly, Secure, SameSite=Strict` cookie; rotated on every use; 7-day lifetime |
| Access token | 15-min JWT; in Redux memory only; restored on mount via `/auth/refresh` |
| Google OAuth | Authorization Code Flow via backend callback; `google-auth-library` |
| Apple Sign-In | UI placeholder only (disabled button); deferred post-MVP |
| QR rendering | `qrcode.react` (`<QRCodeSVG value={booking.qrCodeId} />`); ErrorBoundary fallback |
| Booking filter | Backend-filtered: `targetDate >= today - 30 days`, sorted ascending |
| Session restore | `useSessionRestore` hook called in `StoreProvider`; calls `/auth/refresh` once on mount |

---

## Phase 1: Design & Contracts

### Data Model

See [data-model.md](./data-model.md) for full schema details.

**Changes summary**:

#### `User` model — additions

| Field | Type | Notes |
|-------|------|-------|
| `isVerified` | Boolean, default false | Set to `true` after OTP activation |
| `linkedProviders` | `[{ provider: String, providerId: String }]` | e.g. `[{ provider: 'google', providerId: '...' }]` |
| `refreshTokenHash` | String, select: false | Bcrypt hash of current refresh token (for rotation validation) |

#### `OtpToken` model — new

| Field | Type | Constraints |
|-------|------|-------------|
| `userId` | ObjectId ref User | required |
| `purpose` | String enum | `account_activation` \| `password_reset` |
| `codeHash` | String | bcrypt hash of 6-digit code |
| `expiresAt` | Date | TTL index (600s); auto-deleted |
| `resendCount` | Number | default 0; max 3 per window |
| `windowStart` | Date | Start of 15-min rate-limit window |

### API Contracts

See [contracts/auth-api.md](./contracts/auth-api.md) for full OpenAPI-style request/response shapes.

**Key response shapes**:

```jsonc
// POST /api/auth/login → success
{ "success": true, "token": "<access-jwt-15min>", "data": { "user": { "id", "name", "email", "phone", "role", "isVerified", "linkedProviders" } } }
// Cookie set: refreshToken=<7d-jwt>; HttpOnly; Secure; SameSite=Strict; Path=/api/auth

// POST /api/auth/refresh → success
{ "success": true, "token": "<new-access-jwt>" }
// Cookie rotated: new refreshToken cookie set

// POST /api/auth/send-otp → always same response (anti-enumeration)
{ "success": true, "data": { "message": "If the account exists, a code was sent." } }

// POST /api/auth/verify-otp → success
{ "success": true, "data": { "purpose": "account_activation" | "password_reset", "resetToken": "<short-lived>" } }

// GET /api/auth/profile → success
{ "success": true, "data": { "user": { "id", "name", "email", "phone", "role", "linkedProviders" } } }

// GET /api/tickets/bookings/user?from=<ISO>&sort=targetDate&order=asc → success
{ "success": true, "data": { "bookings": [ { "id", "ticketType": { "name", "nameAr" }, "targetDate", "quantity", "totalPrice", "status", "qrCodeId" } ] } }
```

### Frontend Architecture Decisions

#### `authSlice.ts` — Refactored state shape

```typescript
interface AuthState {
  accessToken: string | null;   // memory only — NEVER persisted
  user: UserProfile | null;     // cached profile fields
  isAuthenticated: boolean;
}
// Actions: setCredentials({ token, user }), clearCredentials()
// Removed: setToken, getInitialToken (localStorage reads)
```

#### `authApi.ts` — New endpoints

```typescript
// 9 endpoints:
signUpWithPassword     → POST /auth/signup       → invalidates: ['UserProfile']
verifyAccountOTP       → POST /auth/verify-otp   → invalidates: ['UserProfile']
loginWithPassword      → POST /auth/login        → invalidates: ['UserProfile']
sendOtp                → POST /auth/send-otp     → no cache effect
resetPasswordWithOTP   → POST /auth/reset-password → no cache effect
socialLogin (Google)   → GET  /auth/google        → redirect
logoutServer           → POST /auth/logout        → invalidates: ['UserProfile', 'UserBookings'] + resetApiState()
getProfile             → GET  /auth/profile       → providesTags: ['UserProfile']
getUserBookings        → GET  /tickets/bookings/user?from=...&sort=targetDate&order=asc → providesTags: ['UserBookings']
```

#### `baseQueryWithReauth` — Mutex refresh pattern

The custom `baseQuery` wraps `fetchBaseQuery` with:
1. Forward request normally.
2. On 401: acquire mutex → call `POST /auth/refresh` → if success → `setCredentials` → retry original → release.
3. If refresh 401: `clearCredentials` + `resetApiState` + redirect to `/login`.
4. If mutex already locked: wait → retry (the concurrent refresh will have set new credentials).

#### `useSessionRestore` hook

Called once in `StoreProvider` via `useEffect([], [])`:
```typescript
// Calls POST /auth/refresh (cookie sent automatically)
// On success → dispatch(setCredentials({ token, user }))
// On failure → remain unauthenticated (no redirect on mount)
```

#### `OtpVerification.tsx` — UX spec

- 6 individual single-digit inputs; auto-advance on digit entry; backspace moves back.
- Resend button: disabled with countdown timer (MM:SS) when `resendCount >= 3` or within cooldown.
- After 3 failed verify attempts on the same OTP, the form resets and prompts resend.
- Framer Motion: staggered digit-input reveal on mount.

#### `UserProfile.tsx` — Editorial redesign zones

```
┌─────────────────────────────────────────┐
│  [Avatar initials]  Name                │  ← bg-surface, shadow-ambient
│  email · phone                          │
│  [Google badge] [Email/Password badge]  │
├─────────────────────────────────────────┤
│  ACTIVE BOOKINGS          (2 upcoming)  │  ← bg-surface-container-low
│  ┌────────────────────────────────────┐ │
│  │ Magic Pass · 2026-06-01 · ×2      │ │  ← booking card
│  │ PENDING_PAYMENT  [QR CODE]         │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │ General Admission · 2026-05-15 ✓  │ │
│  │ PAID              [QR CODE]        │ │
│  └────────────────────────────────────┘ │
│  [Empty state if no bookings]           │
├─────────────────────────────────────────┤
│  [Logout — primary danger CTA]          │
└─────────────────────────────────────────┘
```

---

## Complexity Tracking

> No constitution violations. No deviations require justification.

---

## Implementation Sequence

Ordered to respect backend → frontend dependency chain and constitution gate requirements.

### Step 1 — Backend: Models & Utils
1. Create `OtpToken.js` model with TTL index.
2. Modify `User.js`: add `isVerified`, `linkedProviders[]`, `refreshTokenHash`.
3. Create `utils/otpUtils.js`: `generateOtp()`, `hashOtp()`, `verifyOtp()`.
4. Create `utils/sendEmail.js`: nodemailer OTP email sender.

### Step 2 — Backend: Controller & Routes
5. Extend `authController.js` with 8 new functions.
6. Extend `authRoutes.js` with 8 new endpoints + `@swagger` blocks.
7. Register new routes in `app.js`.

### Step 3 — Frontend: State Layer
8. Refactor `authSlice.ts`: remove localStorage; add `setCredentials`/`clearCredentials`.
9. Refactor `authApi.ts`: replace `baseQuery` with `baseQueryWithReauth`; add 9 endpoints.
10. Create `useSessionRestore.ts` hook.
11. Update `StoreProvider.tsx` to call `useSessionRestore` on mount.
12. Update `store.ts` with new slice shapes.

### Step 4 — Frontend: Auth Components
13. Modify `LoginForm.tsx`: use `loginWithPassword`, handle unverified account state.
14. Modify `SignupForm.tsx`: on success → push to OTP verification screen.
15. Create `OtpVerification.tsx`: 6-digit input, countdown resend, Framer Motion.
16. Create `ForgotPassword.tsx`: email form, anti-enumeration messaging.
17. Create `ResetPassword.tsx`: new password form, redirect to login.
18. Modify `SocialLogin.tsx`: Google button active; Apple button disabled + tooltip.

### Step 5 — Frontend: Profile Page
19. Create `app/[locale]/profile/page.tsx` (server component auth guard).
20. Create `BookingQrCard.tsx` shared UI component (QRCodeSVG + ErrorBoundary fallback).
21. Redesign `UserProfile.tsx` with three editorial zones + booking list.

### Step 6 — i18n & Barrel Exports
22. Add all new translation keys to `messages/en.json` and `messages/ar.json`.
23. Update `src/features/auth/index.ts` barrel export.

### Step 7 — Dependency Installation
24. Backend: `npm install google-auth-library nodemailer` (in `BackEnd/`).
25. Frontend: `npm install async-mutex qrcode.react` (in `my-app/`).
