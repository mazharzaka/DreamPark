# Technical Research: Auth and Error Handling System

**Feature**: Auth and Error Handling System

## Technology Choices

### Decision: JSON Web Tokens (JWT) for Authentication
- **Rationale**: Stateless, scales well across microservices if needed, and natively supported in Node.js via `jsonwebtoken` library.
- **Alternatives Considered**: Session-based auth (rejected due to requirement of state management).

### Decision: bcryptjs for Password Hashing
- **Rationale**: Standard library in Node.js for secure password hashing with salts. `bcryptjs` is pure JS and easier to install without node-gyp dependencies.

### Decision: Custom AppError Class
- **Rationale**: Extends standard Node `Error` to enforce setting `statusCode` and `status` strings, making the centralized error middleware extremely simple to write.

---
*No outstanding unknowns remain.*
