# Quickstart: Hybrid Authentication

**Feature**: 024-hybrid-auth-profile

## Running Locally

1. **Environment Variables**:
   In `BackEnd/.env`, ensure the following are set:
   ```env
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_SECRET=your_refresh_secret
   JWT_REFRESH_EXPIRES_IN=7d
   EMAIL_USER=your_smtp_email
   EMAIL_PASS=your_smtp_password
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

2. **Install Dependencies**:
   ```bash
   cd BackEnd && npm install google-auth-library nodemailer
   cd ../my-app && npm install async-mutex qrcode.react
   ```

3. **Start the Apps**:
   ```bash
   # In terminal 1 (Backend)
   cd BackEnd
   npm run dev

   # In terminal 2 (Frontend)
   cd my-app
   npm run dev
   ```

## Testing Flow

1. Navigate to `http://localhost:3000/en/signup`
2. Create a new account.
3. Check terminal logs (or email if configured) for the 6-digit OTP.
4. Enter the OTP to activate the account.
5. Log in with the newly created credentials.
6. Verify the `/profile` page loads and displays your details.
7. To test refresh token: delete the `accessToken` from Redux (or wait 15 min), perform an action, and observe the network tab for a successful silent `/auth/refresh` request followed by a retry of the original request.
