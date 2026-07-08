# Feature Specification: Hybrid Authentication and Ticket Booking Flow

**Feature Branch**: `033-hybrid-checkout-otp`  
**Created**: 2026-07-08  
**Status**: Draft  
**Input**: User description: "Implement a robust, flexible authentication and ticket booking flow for a theme park MVP using Next.js (App Router), Node.js, and MongoDB (Mongoose)."

## Clarifications

### Session 2026-07-08
- Q: How should we handle the other required fields in the User model (`name`, `gender`, `dateOfBirth`, `address`) during guest/OTP account creation? → A: Make the fields optional (`required: false`) in the schema globally.
- Q: When an existing user with a password verifies via OTP, should they be logged in with a full JWT session? → A: Log them in fully with a standard JWT session (matching standard login).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guest/Fast Checkout via OTP (Priority: P1)

As a theme park visitor who wants to book tickets quickly, I want to check out by simply entering my email and verifying it via a 6-digit OTP sent to my inbox, so that I don't have to create a password or remember login details.

**Why this priority**: Crucial for converting impulse buyers who would abandon checkout if forced to undergo a full registration process.

**Independent Test**: Can be tested by filling out the ticket booking details, entering an email in the "Fast Checkout" field, receiving the OTP, entering the valid 6-digit code, and successfully completing the booking.

**Acceptance Scenarios**:

1. **Given** a user is on the booking page at step 2 (Customize), **When** they click "Book Now" without being logged in, **Then** they see the unified login/checkout card showing the "Fast Checkout" input by default.
2. **Given** the user enters a valid email address and clicks "Send Code", **When** the API successfully sends the code, **Then** the input field is replaced by a 6-digit OTP verification field with a 60-second resend countdown timer.
3. **Given** the user enters the correct 6-digit code, **When** they click verify, **Then** they are logged in automatically, the modal closes, and their booking is completed successfully.

---

### User Story 2 - Traditional Email & Password Login (Priority: P2)

As a returning user with a registered account, I want to switch from Fast Checkout to password-based login on the same page, so that I can log in using my pre-configured password and view my booking history under my account.

**Why this priority**: Important for retaining existing members and allowing them to associate bookings with their permanent profiles.

**Independent Test**: Can be tested by clicking the "Sign in with password" link on the booking modal, filling in the email and password fields, and submitting to log in.

**Acceptance Scenarios**:

1. **Given** the login modal is open, **When** the user clicks "Or, sign in with your password", **Then** the form fields dynamically change to Email and Password fields, with a password login button, without reloading the page.
2. **Given** the user enters correct credentials, **When** they submit the form, **Then** they are logged in, the modal closes, and their booking is completed.
3. **Given** the user is in password mode, **When** they click "Back to fast checkout", **Then** the form reverts to the OTP/email input field.

---

### User Story 3 - Smart Account Upsert & Session Linking (Priority: P3)

As the system, I want to handle OTP verifications intelligently depending on whether the email exists or has an existing password, so that the checkout flow is seamless and does not block users who own the email.

**Why this priority**: Prevents user friction when an existing user inputs their email in the guest checkout flow.

**Independent Test**: Verify DB user records after OTP verification for new emails, guest emails, and password-configured emails.

**Acceptance Scenarios**:

1. **Given** a new email is verified via OTP, **When** the system processes the verification, **Then** it creates a User record with that email and `password: null`, and logs them in.
2. **Given** an email with an existing password is verified via OTP, **When** the system processes verification, **Then** it logs the user in directly without prompting for their password.
3. **Given** an email belonging to an existing guest account (password is null) is verified via OTP, **When** the system processes verification, **Then** it logs them in and links the booking to their existing record.

---

### Edge Cases

- **OTP Code Expiry**: If a user submits an OTP code after 5 minutes, the system MUST return a clear error stating the code has expired.
- **Rate-Limiting Protection**: If a user clicks "Resend Code" repeatedly, the system MUST rate-limit requests to 1 request per 60 seconds, and block OTP generation after 3 attempts within 15 minutes to prevent spam.
- **Mismatched OTP**: If a user enters an incorrect 6-digit code, the system shows an error message and keeps the OTP input active.
- **Arabic UI Display**: If the page locale is Arabic (`ar`), the modal text, field labels, success messages, error messages, and buttons MUST display properly formatted Arabic text.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: User schema password field, as well as `name`, `phoneNumber`, `gender`, `dateOfBirth`, and `address` fields, must be optional (`required: false`) in Mongoose to accommodate guest users.
- **FR-002**: `/api/auth/send-otp` MUST generate a secure 6-digit code, hash it, and store it in an `OTPTokens` collection with an expiration TTL of 5 minutes.
- **FR-003**: `/api/auth/send-otp` MUST support rate-limiting to restrict OTP requests per email to a maximum of 3 requests per 15 minutes.
- **FR-004**: `/api/auth/verify-otp` MUST validate the OTP code. Upon successful verification, perform upsert logic:
  - Email not found: Create a User record with email, default name ("Guest"), password: null.
  - Email found with password: Login successfully (do not require password prompt) with a full, standard JWT session.
  - Email found without password: Login successfully (re-use existing guest account) with a full, standard JWT session.
- **FR-005**: `/api/auth/login-password` MUST authenticate users using traditional email/password verification via bcrypt.
- **FR-006**: Frontend booking login modal MUST show "Fast Checkout" input by default, with a toggle to switch to "Password Sign-in" and back without reloading the page.
- **FR-007**: When OTP is requested, the email input MUST be replaced/overlayed with a 6-digit code input field and a 60-second resend countdown timer.
- **FR-008**: The unified modal and inputs MUST support both English (`en`) and Arabic (`ar`) locales, aligning text and layout direction accordingly.

### Key Entities *(include if feature involves data)*

- **User**: Represents a visitor or member. Attributes: `email` (unique), `password` (optional hash), `name` (optional/default), `phoneNumber` (optional), `isVerified` (boolean), `role` (enum).
- **OTPTokens**: Represents a temporary verification token. Attributes: `email` (or reference), `purpose` (string/enum), `codeHash` (hashed OTP), `expiresAt` (Date with TTL), `resendCount` (number), `windowStart` (Date).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete verification and booking checkout in under 2 minutes.
- **SC-002**: Switching between Fast Checkout (OTP) and Password login is instantaneous (less than 100ms) with no page reloads.
- **SC-003**: 100% of OTP tokens automatically expire and are deleted from the database exactly 5 minutes after creation.
- **SC-004**: The system handles 1000 concurrent OTP request-verification cycles without database lockups or degradation.

## Assumptions

- We will utilize Nodemailer or Resend for simulating/sending emails. In local/development environments, if email server details are missing, the system will log the generated OTP code directly to the server console to allow debugging and testing.
- The password confirmation check (`passwordConfirm`) is only required when a user is registering with a password, not during guest/OTP login.
- Existing bookings API uses standard Bearer JWT authentication, which will be returned in the success response from `/api/auth/verify-otp` and `/api/auth/login-password`.
