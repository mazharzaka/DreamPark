# API Contracts: Hybrid Authentication

**Feature**: 024-hybrid-auth-profile
**Date**: 2026-05-23

---

## 1. POST `/api/auth/signup`
Creates a pending user account and sends an activation OTP.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "SecurePassword123",
  "passwordConfirm": "SecurePassword123"
}
```

**Response (Success - 201)**:
```json
{
  "success": true,
  "data": {
    "message": "Account created. Please verify your email with the OTP sent.",
    "userId": "60d5ecb8b392cb234c8f0000"
  }
}
```

---

## 2. POST `/api/auth/send-otp`
Requests a new OTP for account activation or password reset. Rate-limited (3 per 15 min).

**Request Body**:
```json
{
  "email": "john@example.com",
  "purpose": "account_activation" // or "password_reset"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "data": {
    "message": "If the account exists, a code was sent."
  }
}
```
*Note: Returns the same message even if the email doesn't exist, to prevent enumeration.*

**Response (Rate Limited - 429)**:
```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```

---

## 3. POST `/api/auth/verify-otp`
Verifies the 6-digit OTP code.

**Request Body**:
```json
{
  "email": "john@example.com",
  "code": "123456",
  "purpose": "account_activation" // or "password_reset"
}
```

**Response (Success - 200)**:
If `account_activation`, the account becomes `isVerified: true` and the user can now log in.
```json
{
  "success": true,
  "data": {
    "message": "Account activated successfully."
  }
}
```

If `password_reset`, a short-lived reset token is returned.
```json
{
  "success": true,
  "data": {
    "resetToken": "temp_token_abc123"
  }
}
```

---

## 4. POST `/api/auth/login`
Authenticates a user and returns an access token, setting an `httpOnly` refresh token cookie.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (Success - 200)**:
*Headers*: `Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict; Path=/api/auth`
```json
{
  "success": true,
  "token": "eyJhbGci...", // 15-min JWT
  "data": {
    "user": {
      "id": "60d5ecb8b392cb234c8f0000",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "isVerified": true,
      "linkedProviders": []
    }
  }
}
```

---

## 5. POST `/api/auth/refresh`
Exchanges a valid refresh token cookie for a new access token and rotates the refresh token.

**Request Headers**:
Must include the `refreshToken` cookie.

**Response (Success - 200)**:
*Headers*: `Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict; Path=/api/auth`
```json
{
  "success": true,
  "token": "eyJhbGci...", // New 15-min JWT
  "data": {
    "user": { ... }
  }
}
```

**Response (Unauthorized - 401)**:
```json
{
  "success": false,
  "error": "Session expired or invalid. Please log in again."
}
```

---

## 6. POST `/api/auth/logout`
Logs out the user by clearing the refresh token cookie and invalidating it on the server.

**Request Headers**:
Authorization: Bearer `<access_token>`

**Response (Success - 200)**:
*Headers*: `Set-Cookie: refreshToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/api/auth`
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## 7. GET `/api/tickets/bookings/user`
Gets the authenticated user's bookings.

**Query Parameters**:
- `from`: ISO Date string (e.g., `2026-04-23T00:00:00Z`). Used to filter bookings `targetDate >= from`.
- `sort`: `targetDate`
- `order`: `asc`

**Response (Success - 200)**:
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "booking123",
        "ticketType": {
          "name": "General Admission",
          "nameAr": "دخول عام"
        },
        "targetDate": "2026-06-01T00:00:00.000Z",
        "quantity": 2,
        "totalPrice": 150,
        "status": "PENDING_PAYMENT",
        "qrCodeId": "uuid-1234-5678-9012"
      }
    ]
  }
}
```
