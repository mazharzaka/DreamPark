# Data Model: Hybrid Authentication & User Profile Flow

**Feature**: 024-hybrid-auth-profile
**Date**: 2026-05-23

---

## 1. User (Modified)

Represents a registered user in the system.

**New/Modified Fields**:
- `isVerified` (Boolean): Default `false`. Set to `true` upon successful OTP activation.
- `linkedProviders` (Array of Objects): E.g., `[{ provider: 'google', providerId: '12345' }]`. Used to track social sign-in linkages.
- `refreshTokenHash` (String, `select: false`): Bcrypt hash of the currently valid refresh token for the user. Used to detect reused or revoked refresh tokens.

**Existing Fields** (for context):
- `name` (String)
- `email` (String, unique)
- `password` (String, hashed, `select: false`)
- `phone` (String)
- `role` (String, enum: `USER`, `MARKETING_AGENT`, `ADMIN`)

**Behaviors/Hooks**:
- Pre-save hook: Hash `password` if modified.

---

## 2. OtpToken (New)

Tracks OTPs sent for account activation and password resets.

**Fields**:
- `userId` (ObjectId, ref: 'User', required): The user this OTP belongs to.
- `purpose` (String, enum: `account_activation`, `password_reset`, required): What this OTP authorizes.
- `codeHash` (String, required): Bcrypt hash of the 6-digit OTP code. NEVER store in plain text.
- `expiresAt` (Date, required): Expiry timestamp (e.g., 10 minutes from creation). Has a MongoDB TTL index of `0` to auto-delete expired documents.
- `resendCount` (Number, default: `0`): Number of times an OTP was requested within the current window.
- `windowStart` (Date, required): Start time of the current rate-limit window. Used to reset `resendCount` after 15 minutes.

**Validation Rules**:
- `codeHash` must be generated securely.
- Maximum `resendCount` is 3 within a 15-minute `windowStart` interval.

**State Transitions**:
- Created when a user signs up or requests a password reset.
- Updated (increment `resendCount`) when requesting a resend within the window.
- Recreated or window reset if requested after the 15-minute window expires.
- Deleted (or auto-deleted via TTL) upon successful verification or expiration.

---

## 3. Booking (Existing Context)

No schema changes required, but listed here for context regarding QR codes and filtering.

**Key Fields for this Feature**:
- `qrCodeId` (String, UUID): Unique identifier for the booking, used as the value for the rendered QR code on the profile page.
- `targetDate` (Date): The date of the visit. Used by the backend to filter upcoming vs. past bookings.
- `status` (String, enum: `PENDING_PAYMENT`, `PAID`): Displayed on the booking card.

---

## 4. Session State (Client-Side Memory Only)

Not a database model, but the in-memory representation in the Redux store (`authSlice`).

**Fields**:
- `accessToken` (String | null): The 15-minute JWT. NEVER stored in localStorage.
- `user` (Object | null): The authenticated user's profile data.
- `isAuthenticated` (Boolean): Derived from the presence of `accessToken`.
