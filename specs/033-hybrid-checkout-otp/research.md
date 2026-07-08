# Research Notes: Hybrid Authentication and Ticket Booking Flow

## Tech Stack & Core Decisions

### 1. Database Schema Adjustments

#### User Model
- **Decision**: Update `User.js` model to make `password` and other user profile fields optional.
- **Rationale**: Mongoose throws validation errors if required fields are missing during document creation. In guest checkout/OTP verification, only the email (and phoneNumber during checkout) is collected. Thus, `name`, `phoneNumber`, `gender`, `dateOfBirth`, and `address` must be marked as `required: false` (or conditionally required) so that we can upsert guest users.
- **Alternatives Considered**: 
  - *Conditional validation*: Mongoose validator functions that return true/false based on whether password/guest flag exists. Rejected because it complicates simple document creations and upserts, making standard profile upgrades harder to manage.
  - *Dummy values*: Inserting hardcoded placeholders like `Guest` or `N/A`. Rejected because it creates dirty, misleading data in the database.

#### OtpToken Model
- **Decision**: Modify `OtpToken.js` to support guest users who do not have a `userId` yet.
- **Rationale**: Add `email` as a string and change `userId` from `required: true` to `required: false`. Introduce `login_otp` into the `purpose` enum.
- **Alternatives Considered**: 
  - *Create guest users before sending OTP*: Creating a User in the database with `isVerified: false` before verification. Rejected because it creates dead/spam database accounts for invalid or unverified emails.

---

### 2. Rate-Limiting Implementation

- **Decision**: Implement DB-level rate limiting inside the `/send-otp` controller.
- **Rationale**: Check if an `OtpToken` exists for the given `{ email, purpose: 'login_otp' }`.
  - If a record exists, check `windowStart` and `resendCount`.
  - Enforce a 60-second limit between consecutive OTP requests and a maximum of 3 requests within a 15-minute rolling window.
  - If rate limits are violated, return a `429 Too Many Requests` API error.
- **Alternatives Considered**:
  - *Express-rate-limit middleware*: Rejected because IP-based rate limiting is less effective for shared environments/NATs and does not protect against target email flooding. We need application-level rate limiting per target email.

---

### 3. Session & Authentication Issue

- **Decision**: Use the existing `createSendToken` logic inside `authController.js` to log users in.
- **Rationale**: The existing backend authentication leverages a secure JWT access token returned in the JSON response, combined with an HTTP-only `refreshToken` set in a secure cookie. Reusing `createSendToken` ensures complete compatibility with the rest of the application.

---

### 4. Frontend Component & Local States

- **Decision**: Implement a unified login card within `BookingFlow.tsx` using local states to switch between OTP checkout and password sign-in.
- **Rationale**:
  - Toggling between states is handled by a state variable `authMode` ('otp' or 'password').
  - The countdown timer is managed using a `useEffect` interval that decrements a `countdown` state from 60 to 0.
  - Using local React Hook Form instances ensures inputs are validated client-side without interfering with the parent booking form inputs.
- **Alternatives Considered**:
  - *Two separate pages*: Redirecting to `/login` or `/checkout-otp`. Rejected because it breaks checkout immersion and results in page-reload performance overhead.
