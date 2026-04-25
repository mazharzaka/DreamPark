# Feature Specification: Auth and Error Handling System

**Feature Branch**: `010-auth-error-handling`  
**Created**: 2026-04-25  
**Status**: Draft  
**Input**: User description: "Auth and Error Handling System with User Roles"

## Clarifications

### Session 2026-04-25
- Q: Do we need to implement the actual /login and /signup endpoints to issue the JWTs? → A: Implement auth infrastructure AND endpoints (`/login`, `/signup`) to issue JWT tokens.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Uses Centralized Error Handling (Priority: P1)

As a developer, I want all exceptions to be caught and formatted consistently by a centralized error middleware, so that clients always receive predictable JSON responses and I don't have to repeat try-catch blocks.

**Why this priority**: It is the foundation for a stable backend and prevents server crashes due to unhandled promise rejections.

**Independent Test**: Can be fully tested by throwing a new `AppError` inside a test route and verifying the JSON response format matches `{ success: false, message: ... }`.

**Acceptance Scenarios**:

1. **Given** an operational error occurs, **When** it is passed to `next()`, **Then** the error middleware returns a standardized JSON response with the appropriate status code.
2. **Given** the environment is Development, **When** an error is returned, **Then** the response includes the error stack trace.
3. **Given** an unhandled MongoDB error (ValidationError, CastError, DuplicateKey), **When** caught by the middleware, **Then** it is translated into a human-readable message.

---

### User Story 2 - User Registers and Logs In (Priority: P2)

As a system administrator or customer, I want to have an identity within the system with a specific role, so that I can access restricted resources.

**Why this priority**: Roles and identity are required before we can implement authorization (protect and restrictTo).

**Independent Test**: Can be tested by verifying the `User` model schema validation (especially the enum for roles) and defaults.

**Acceptance Scenarios**:

1. **Given** a new user is created without specifying a role, **When** it is saved to the database, **Then** the role defaults to `customer`.
2. **Given** an invalid role is provided during user creation, **When** saving, **Then** a MongoDB ValidationError is triggered.

---

### User Story 3 - Admin Modifies Restricted Resources (Priority: P3)

As an admin, I want to create, update, or delete attractions and hero sections, so that I can manage the park's content.

**Why this priority**: Securing the endpoints is the main business goal of the auth system.

**Independent Test**: Can be tested by sending requests to protected routes with different roles and observing the authorization outcome.

**Acceptance Scenarios**:

1. **Given** a valid JWT token for an `admin` user, **When** a POST/PATCH/DELETE request is sent to an attractions or hero route, **Then** the action is allowed.
2. **Given** a valid JWT token for a `customer` user, **When** a restricted request is sent, **Then** a 403 Forbidden error is returned.
3. **Given** no token or an invalid token, **When** a restricted request is sent, **Then** a 401 Unauthorized error is returned.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST implement an `AppError` utility class extending `Error` that accepts `message` and `statusCode`.
- **FR-002**: The system MUST provide a `catchAsync` wrapper function to catch unhandled promise rejections in controllers and pass them to the error middleware.
- **FR-003**: The system MUST include a centralized `errorMiddleware` that formats all errors into `{ success: false, message }` JSON responses.
- **FR-004**: The `errorMiddleware` MUST translate common MongoDB errors (CastError, ValidationError, Duplicate Key 11000) into user-friendly messages.
- **FR-005**: The system MUST implement a `User` Mongoose schema containing `name`, `email`, `password`, and `role`.
- **FR-006**: The `role` field MUST be restricted to `['customer', 'admin', 'staff']` and default to `customer`.
- **FR-007**: The system MUST provide a `protect` middleware to verify JWT tokens and attach the user to the request.
- **FR-008**: The system MUST provide a `restrictTo(...roles)` middleware to authorize specific user roles.
- **FR-009**: POST, PATCH, and DELETE operations on `heroRoutes` and `attractionRoutes` MUST be secured and restricted to the `admin` role.
- **FR-010**: The system MUST implement `/api/auth/signup` and `/api/auth/login` endpoints to create users and issue JWT tokens for authentication.

### Key Entities

- **User**: Represents a system user. Key attributes:
  - `name` (String, required)
  - `email` (String, required, unique)
  - `password` (String, required, hashed)
  - `role` (Enum: customer, admin, staff; default: customer)

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of tested unhandled errors trigger a JSON response rather than dropping the connection or returning an HTML error page.
- **SC-002**: 100% of restricted endpoints (POST/PATCH/DELETE on hero and attractions) return 401 or 403 when accessed by unauthorized roles.

---

## Assumptions

- **JWT Secret**: It is assumed that `process.env.JWT_SECRET` will be used for token verification.
- **Password Hashing**: It is assumed that passwords will be hashed (e.g., using bcrypt) before being saved to the database.
- **ES Modules**: The codebase uses ES Module syntax exclusively, consistent with the project constitution.
