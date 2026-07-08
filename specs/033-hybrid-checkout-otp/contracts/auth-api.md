# Interface Contract: Authentication API

Endpoints exposed by the Express backend at `/api/auth`.

---

## 1. POST /api/auth/send-otp

Requests a 6-digit numeric OTP code sent to the user's email address.

### Request Body
```json
{
  "email": "string (required, email format)",
  "purpose": "string (required, enum: ['account_activation', 'password_reset', 'login_otp'])"
}
```

### Responses
#### Success (200 OK)
```json
{
  "success": true,
  "data": {
    "message": "If the account exists, a code was sent."
  }
}
```

#### Rate Limited (429 Too Many Requests)
```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```

#### Bad Request (400 Bad Request)
```json
{
  "success": false,
  "error": "Please provide email and purpose"
}
```

---

## 2. POST /api/auth/verify-otp

Validates the OTP token against the database and logs the user in.

### Request Body
```json
{
  "email": "string (required, email format)",
  "code": "string (required, 6-digit numeric)",
  "purpose": "string (required, enum: ['account_activation', 'password_reset', 'login_otp'])"
}
```

### Responses
#### Success (200 OK)
Returns the authentication session tokens and user profile. Sets the HTTP-only cookie `refreshToken`.
```json
{
  "success": true,
  "token": "string (JWT Access Token)",
  "data": {
    "user": {
      "_id": "string (Mongoose ObjectId)",
      "email": "string (email)",
      "name": "string",
      "role": "string",
      "isVerified": true,
      "createdAt": "string (ISO Date)",
      "updatedAt": "string (ISO Date)"
    }
  }
}
```

#### Verification Failed (400 Bad Request)
```json
{
  "success": false,
  "error": "Invalid or expired OTP"
}
```

---

## 3. POST /api/auth/login-password

Authenticates registered users via their password using bcrypt.

### Request Body
```json
{
  "email": "string (required, email format)",
  "password": "string (required, minimum 8 characters)"
}
```

### Responses
#### Success (200 OK)
```json
{
  "success": true,
  "token": "string (JWT Access Token)",
  "data": {
    "user": {
      "_id": "string (Mongoose ObjectId)",
      "email": "string (email)",
      "name": "string",
      "role": "string",
      "isVerified": true,
      "createdAt": "string (ISO Date)",
      "updatedAt": "string (ISO Date)"
    }
  }
}
```

#### Unauthorized (401 Unauthorized)
```json
{
  "success": false,
  "error": "Incorrect email or password"
}
```
