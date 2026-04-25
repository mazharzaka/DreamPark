# Quickstart Guide: Auth and Error Handling System

## Auth Endpoints

### 1. Signup a New User
- **Method**: `POST`
- **Path**: `/api/auth/signup`
- **Payload**:
```json
{
  "name": "Admin User",
  "email": "admin@dreampark.com",
  "password": "securepassword",
  "role": "admin"
}
```

### 2. Login
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Payload**:
```json
{
  "email": "admin@dreampark.com",
  "password": "securepassword"
}
```

## Protected Resource Endpoints
*Requires `Authorization: Bearer <token>` in headers.*

### 3. Create Attraction (Admin Only)
- **Method**: `POST`
- **Path**: `/api/attractions`

### 4. Delete Hero (Admin Only)
- **Method**: `DELETE`
- **Path**: `/api/hero/:pageKey`
