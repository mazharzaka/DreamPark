# Quickstart Guide: Hybrid Authentication & Guest Checkout

This guide details how to run, test, and verify the hybrid authentication and ticket booking flow locally.

## Prerequisite Checks

Make sure both the Next.js frontend and Express backend are running:
- **Backend (Express)**: `npm run dev` (should be active on `http://localhost:5000`)
- **Frontend (Next.js)**: `npm run dev` (should be active on `http://localhost:3000`)

---

## 1. Local Testing via API Endpoints

Since email delivery falls back to logging to the terminal console during development, we can test the entire OTP flow directly using standard API calls:

### A. Request OTP (Fast Checkout / OTP Sign-in)
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/send-otp`
- **Body**:
  ```json
  {
    "email": "visitor@example.com",
    "purpose": "login_otp"
  }
  ```
- **Action**: Check the Backend console/terminal. Look for `ℹ️ [DREAM PARK DEV] Email Content` output which contains the generated 6-digit OTP code (e.g., `123456`).

### B. Verify OTP (Handles Upsert & JWT Generation)
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/verify-otp`
- **Body**:
  ```json
  {
    "email": "visitor@example.com",
    "code": "123456",
    "purpose": "login_otp"
  }
  ```
- **Response**: Returns the standard JWT access token along with the user profile (`password` is excluded, name defaulted to `Guest`). A secure httpOnly `refreshToken` cookie is set.

### C. Traditional Password Sign-In
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/login-password`
- **Body**:
  ```json
  {
    "email": "existinguser@example.com",
    "password": "password123"
  }
  ```

---

## 2. Testing the UI

1. Open the browser and visit `http://localhost:3000/en/pass/rides_standard` (or any ticket URL).
2. Complete Step 2 details (date, quantity, mobile number) and click **Confirm & Book Your Magical Ticket**.
3. Since you are not logged in, the Unified Authentication Modal will open.
4. **Test Fast Checkout (OTP)**:
   - Enter your email and click **Send Verification Code**.
   - Note the 60-second countdown timer.
   - Look at the backend terminal to copy the 6-digit code.
   - Enter the code in the OTP boxes and click **Verify & Continue**.
   - Verification succeeds: the modal closes and the booking completes, issuing your Magic Pass!
5. **Test Password Sign-in Toggle**:
   - Re-open booking or log out.
   - Click the **Or, sign in with your password** toggle link.
   - The form fields instantly switch to Email + Password fields without reloading the page.
   - Enter credentials and submit.
