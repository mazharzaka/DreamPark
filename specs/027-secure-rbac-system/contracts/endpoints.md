# API Endpoint Contracts: RBAC & Verification

This document specifies the exact JSON request and response payloads, route mappings, and error formats for the security-enhanced endpoints.

---

## 1. Authentication Endpoints (`/api/auth`)

### POST `/api/auth/login`
Authenticates credentials, returns in-memory access token, and sets the secure `httpOnly` refresh cookie.

**Request Body**:
```json
{
  "email": "agent@dreampark.com",
  "password": "SuperSecretPassword123"
}
```

**Response (Success - 200 OK)**:
*Headers*: `Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...",
    "user": {
      "id": "65123456789abcdef0123456",
      "name": "Ahmad Al-Agent",
      "email": "agent@dreampark.com",
      "role": "MARKETING_AGENT"
    }
  }
}
```

---

### POST `/api/auth/refresh`
Silent refresh endpoint reading cookie automatically.

**Request Body**: *None* (Cookie read by server)

**Response (Success - 200 OK)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi..."
  }
}
```

---

## 2. Gate Verification Endpoints (`/api/tickets`)

### POST `/api/tickets/verify/scan`
Atomically scans a ticket and locks it in `SCANNING` state.

**Required Headers**: `Authorization: Bearer <accessToken>`  
**Role Scope**: `MARKETING_AGENT`, `ADMIN`

**Request Body**:
```json
{
  "qrCodeId": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
}
```

**Response (Success - 200 OK)**:
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "65aef1234567890abcdef123",
      "visitorName": "Fatima Mansoor",
      "phoneNumber": "+9647701234567",
      "ticketTypeName": "VIP Magic Pass",
      "quantity": 2,
      "totalPrice": 150000,
      "status": "SCANNING"
    }
  }
}
```

**Response (Conflict - 409 Conflict)**:
*Returned if the ticket is already in `SCANNING` or `PAID` state.*
```json
{
  "success": false,
  "error": "تم مسح هذه التذكرة بالفعل من جهاز آخر"
}
```

---

### POST `/api/tickets/verify/confirm`
Confirms payment received, transitioning status to `PAID` and writing the success audit log.

**Required Headers**: `Authorization: Bearer <accessToken>`  
**Role Scope**: `MARKETING_AGENT`, `ADMIN`

**Request Body**:
```json
{
  "bookingId": "65aef1234567890abcdef123"
}
```

**Response (Success - 200 OK)**:
```json
{
  "success": true,
  "data": {
    "bookingId": "65aef1234567890abcdef123",
    "status": "PAID"
  }
}
```

---

### POST `/api/tickets/verify/cancel`
Releases a locked ticket back to `PENDING_PAYMENT` state.

**Required Headers**: `Authorization: Bearer <accessToken>`  
**Role Scope**: `MARKETING_AGENT`, `ADMIN`

**Request Body**:
```json
{
  "bookingId": "65aef1234567890abcdef123"
}
```

**Response (Success - 200 OK)**:
```json
{
  "success": true,
  "data": {
    "bookingId": "65aef1234567890abcdef123",
    "status": "PENDING_PAYMENT"
  }
}
```
