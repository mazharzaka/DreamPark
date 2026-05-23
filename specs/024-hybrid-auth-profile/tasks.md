---
description: "Task list for Hybrid Authentication & User Profile Flow"
---

# Tasks: Hybrid Authentication & User Profile Flow

**Input**: Design documents from `/specs/024-hybrid-auth-profile/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic dependencies

- [x] T001 [P] Install Backend dependencies (google-auth-library, nodemailer) in `BackEnd/package.json`
- [x] T002 [P] Install Frontend dependencies (async-mutex, qrcode.react) in `my-app/package.json`
- [x] T003 Update environment configuration for JWT and SMTP in `BackEnd/.env`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create `OtpToken` model in `BackEnd/src/models/OtpToken.js`
- [x] T005 Update `User` model to include `isVerified`, `linkedProviders`, and `refreshTokenHash` in `BackEnd/src/models/User.js`
- [x] T006 [P] Create `otpUtils.js` for generate, hash, and verify helpers in `BackEnd/src/utils/otpUtils.js`
- [x] T007 [P] Create `sendEmail.js` for nodemailer integration in `BackEnd/src/utils/sendEmail.js`
- [x] T008 Update `authSlice.ts` to remove localStorage reads and update types in `my-app/src/lib/features/auth/authSlice.ts`
- [x] T009 Refactor `authApi.ts` to use `baseQueryWithReauth` with `async-mutex` in `my-app/src/lib/features/auth/authApi.ts`
- [x] T010 Create `useSessionRestore.ts` hook in `my-app/src/features/auth/hooks/useSessionRestore.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Register with Email & Password + OTP Activation (Priority: P1) 🎯 MVP

**Goal**: Complete sign-up flow and account activation.

**Independent Test**: An anonymous visitor can submit the sign-up form, receive a real OTP, enter it, and activate the account.

### Implementation for User Story 1

- [x] T011 [US1] Implement `/send-otp` and `/verify-otp` endpoints (controllers and routes) in `BackEnd/src/controllers/authController.js` and `BackEnd/src/routes/authRoutes.js`
- [x] T012 [US1] Implement `/signup` endpoint in `BackEnd/src/controllers/authController.js` and `BackEnd/src/routes/authRoutes.js`
- [x] T013 [P] [US1] Add `signUpWithPassword`, `sendOtp`, `verifyAccountOTP` to `my-app/src/lib/features/auth/authApi.ts`
- [x] T014 [US1] Create `OtpVerification.tsx` component with 6-digit input and countdown resend in `my-app/src/features/auth/components/OtpVerification.tsx`
- [x] T015 [US1] Update `SignupForm.tsx` to handle post-signup OTP redirect in `my-app/src/features/auth/components/SignupForm.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Login with Email & Password (Priority: P1)

**Goal**: Login with email and password, establishing hybrid token session.

**Independent Test**: A verified user can log in, receive an access token and httpOnly refresh cookie, and their session survives page reloads.

### Implementation for User Story 2

- [x] T016 [US2] Implement `/login`, `/refresh`, `/logout` endpoints in `BackEnd/src/controllers/authController.js` and `BackEnd/src/routes/authRoutes.js`
- [x] T017 [US2] Update `authMiddleware.js` for refresh validation helper in `BackEnd/src/middlewares/authMiddleware.js`
- [x] T018 [P] [US2] Add `loginWithPassword`, `logoutServer` endpoints to `my-app/src/lib/features/auth/authApi.ts`
- [x] T019 [US2] Update `LoginForm.tsx` to use new mutation and handle unverified account state in `my-app/src/features/auth/components/LoginForm.tsx`
- [x] T020 [US2] Update `StoreProvider.tsx` to mount and call `useSessionRestore` in `my-app/src/app/StoreProvider.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Forgot Password → Reset via OTP (Priority: P2)

**Goal**: Full password recovery flow using OTP.

**Independent Test**: User can request a reset, input the OTP, and set a new password.

### Implementation for User Story 3

- [x] T021 [US3] Implement `/reset-password` endpoint in `BackEnd/src/controllers/authController.js` and `BackEnd/src/routes/authRoutes.js`
- [x] T022 [P] [US3] Add `forgotPasswordRequest`, `resetPasswordWithOTP` endpoints to `my-app/src/lib/features/auth/authApi.ts`
- [x] T023 [US3] Create `ForgotPassword.tsx` component in `my-app/src/features/auth/components/ForgotPassword.tsx`
- [x] T024 [US3] Create `ResetPassword.tsx` component in `my-app/src/features/auth/components/ResetPassword.tsx`

**Checkpoint**: Password recovery flow is functional.

---

## Phase 6: User Story 5 - View & Manage Personal Profile (Priority: P2)

**Goal**: Profile page showing user details, active bookings with QR codes.

**Independent Test**: Authenticated user sees profile data and properly filtered future/recent bookings with `qrcode.react` rendered QR codes.

### Implementation for User Story 5

- [x] T025 [US5] Implement `/profile` endpoint in `BackEnd/src/controllers/authController.js` and `BackEnd/src/routes/authRoutes.js`
- [x] T026 [US5] Implement `/bookings/user` filtering (upcoming + last 30 days) in `BackEnd/src/controllers/ticketingController.js` (and routes)
- [x] T027 [P] [US5] Add `getProfile`, `getUserBookings` endpoints to `my-app/src/lib/features/auth/authApi.ts`
- [x] T028 [US5] Create `BookingQrCard.tsx` component in `my-app/src/components/ui/BookingQrCard.tsx`
- [x] T029 [US5] Redesign `UserProfile.tsx` with three editorial zones in `my-app/src/features/auth/components/UserProfile.tsx`
- [x] T030 [US5] Create `app/[locale]/profile/page.tsx` server component auth guard

**Checkpoint**: Profile page displays booking QR codes.

---

## Phase 7: User Story 6 - Marketing Agent QR Scan & Payment Confirm (Priority: P2)

**Goal**: Agent can scan booking QR codes and verify payment.

**Independent Test**: Marketing agent scans the QR code generated from US5 and receives confirmation.

### Implementation for User Story 6

- [x] T031 [US6] Verify `/api/tickets/verify` logic and agent permissions in `BackEnd/src/controllers/ticketingController.js` (no new files, just verify existing implementation maps to `qrCodeId` from US5).

---

## Phase 8: User Story 4 - Social Sign-In (Google / Apple) (Priority: P3)

**Goal**: Provide OAuth placeholder for Apple and functional OAuth flow for Google.

**Independent Test**: Google login redirects, exchanges code, and creates session. Apple button is disabled and displays "Coming Soon".

### Implementation for User Story 4

- [x] T032 [US4] Implement `/google` and `/google/callback` endpoints in `BackEnd/src/controllers/authController.js` and `BackEnd/src/routes/authRoutes.js`
- [x] T033 [P] [US4] Add `socialLogin` endpoint/trigger to `my-app/src/lib/features/auth/authApi.ts`
- [x] T034 [US4] Update `SocialLogin.tsx` component (Google active, Apple placeholder) in `my-app/src/features/auth/components/SocialLogin.tsx`

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T035 [P] Add new translation keys to `my-app/messages/en.json` and `my-app/messages/ar.json`
- [ ] T036 [P] Update `my-app/src/features/auth/index.ts` barrel export
- [ ] T037 Run quickstart.md validation locally

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Can start after Foundational (Phase 2), independent of US1 but relies on user existing.
- **User Story 3 (P2)**: Can start after Foundational (Phase 2), independent of US1/US2.
- **User Story 5 (P2)**: Depends on Login (US2) to obtain session, but backend can be implemented in parallel.
- **User Story 6 (P2)**: Depends on US5 rendering the QR code to be scanned.
- **User Story 4 (P3)**: Can start after Foundational (Phase 2).

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- Backend and Frontend for a specific story can often be worked on in parallel by defining contracts first.
- Different user stories (US1, US2, US3, US4) can be picked up independently by different developers after the foundation is laid.
