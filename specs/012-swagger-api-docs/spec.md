# Feature Specification: Swagger API Documentation

**Feature Branch**: `012-swagger-api-docs`  
**Created**: 2026-04-25  
**Status**: Draft  
**Input**: User description: "أريد إضافة Swagger UI لتوثيق الـ API الخاص بمشروع دريم بارك باستخدام مكتبتي swagger-jsdoc و swagger-ui-express."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Explores API via Swagger UI (Priority: P1)

A backend developer or API consumer opens the browser, navigates to `/api-docs`, and sees an interactive Swagger UI listing all available Dream Park API endpoints organized under named groups (Hero, Attractions, Auth). They can expand any endpoint, read its description, view expected parameters and response shapes, and understand the contract without reading source code.

**Why this priority**: The core value of this feature — making the API self-documenting and explorable — is entirely delivered by this single story. Without it, nothing else has value.

**Independent Test**: Can be tested independently by starting the server and opening `/api-docs` in a browser. Delivers immediate value: a developer can understand the full API surface with no additional tooling.

**Acceptance Scenarios**:

1. **Given** the server is running, **When** a developer navigates to `http://localhost:5000/api-docs`, **Then** the Swagger UI renders and shows the API title "Dream Park API", version "1.0.0", and the server URL `http://localhost:5000`.
2. **Given** the Swagger UI is open, **When** the developer looks at the endpoint list, **Then** all endpoints are organized under three tags: **Hero**, **Attractions**, and **Auth** — each collapsed into its own group.
3. **Given** the Swagger UI is open, **When** the developer expands any documented endpoint, **Then** they see a description, parameter details, and at least a 200 success response schema and a 400 error response schema.

---

### User Story 2 - Developer Tests a Protected Endpoint via Bearer Token (Priority: P2)

A developer wants to test an admin-only endpoint (e.g., `POST /api/hero` or `POST /api/attractions`) directly from the Swagger UI. They click the "Authorize" button, paste their JWT token, and are then able to execute the request against the live server and receive a real response.

**Why this priority**: Protected endpoints make up a significant portion of the API. Without the ability to authenticate in Swagger UI, developers cannot test half the surface area. This story removes that blocker.

**Independent Test**: Can be tested by: (1) authenticating via `POST /api/auth/login` in Swagger, (2) copying the returned token, (3) clicking "Authorize" and entering `Bearer <token>`, (4) calling a protected endpoint and receiving a 200 or meaningful response rather than 401.

**Acceptance Scenarios**:

1. **Given** the Swagger UI is open, **When** the developer clicks "Authorize", **Then** a dialog appears with a "Bearer Auth" field where they can enter their JWT token.
2. **Given** the developer has entered a valid token and clicks "Authorize", **When** they execute a protected endpoint like `POST /api/attractions`, **Then** the request includes the `Authorization: Bearer <token>` header and the server responds with a valid result (not 401 Unauthorized).
3. **Given** the developer has NOT provided a token, **When** they try to execute a protected endpoint, **Then** the server returns a 401 Unauthorized response, which is shown in the Swagger UI response panel.

---

### User Story 3 - Developer Understands Hero and Attractions API Schemas (Priority: P3)

A frontend developer needs to know exactly what request body fields are required and what response payload shapes look like for the Hero and Attractions endpoints. They use the Swagger UI to inspect the schemas without needing to look at the database models.

**Why this priority**: The schema documentation is supplementary to the UI being available — it enriches the experience but the core discoverability (Story 1) works without complete schemas. This story ensures completeness.

**Independent Test**: Can be tested by expanding the Hero and Attractions endpoints in Swagger UI and verifying that both request and response schemas are shown (field names, types, and which are required).

**Acceptance Scenarios**:

1. **Given** a developer expands `GET /api/hero/:pageKey`, **When** they look at the parameters, **Then** they see `pageKey` as a required path parameter with a description.
2. **Given** a developer expands `POST /api/attractions`, **When** they look at the request body, **Then** they see fields such as `name`, `description`, `category`, `image` documented with their types and which are required.
3. **Given** a developer expands any endpoint, **When** they look at responses, **Then** they see at minimum: a 200 success response with example payload, and a 401 Unauthorized response for protected endpoints.

---

### Edge Cases

- What happens when the server is running in production mode — should `/api-docs` still be accessible, or should it be disabled?
- What happens if a developer submits a request from Swagger UI with a malformed JWT token?
- What happens if the server is down when a developer tries to test from Swagger UI — how does the UI communicate the failure?
- What happens when new routes are added but JSDoc comments are missing — will Swagger gracefully show only documented endpoints?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST serve an interactive API documentation interface at the path `/api-docs` when the server is running.
- **FR-002**: The documentation interface MUST display the API title as "Dream Park API" and version "1.0.0".
- **FR-003**: The documentation interface MUST show the server base URL (`http://localhost:5000`) so developers know where requests are sent.
- **FR-004**: The documentation interface MUST group all endpoints under named tags: **Hero**, **Attractions**, and **Auth**.
- **FR-005**: The documentation MUST include JSDoc-style comments for all Hero Section endpoints (`GET /api/hero/:pageKey` and `POST /api/hero`), documenting description, parameters, request body (where applicable), and responses (200, 400, 401).
- **FR-006**: The documentation MUST include JSDoc-style comments for all Attractions endpoints (`GET /api/attractions`, `GET /api/attractions/:id`, `POST /api/attractions`, `PATCH /api/attractions/:id`, `DELETE /api/attractions/:id`), documenting description, parameters, request body (where applicable), and responses (200, 400, 401).
- **FR-007**: The documentation MUST include JSDoc-style comments for all Auth endpoints (`POST /api/auth/signup`, `POST /api/auth/login`), documenting description, request body, and responses (200, 400).
- **FR-008**: The documentation interface MUST provide a Bearer token authentication mechanism so developers can authorize themselves and test protected endpoints within the UI.
- **FR-009**: The Swagger configuration MUST be maintained in a dedicated configuration file separate from the application bootstrap file.
- **FR-010**: Protected endpoints MUST display a lock icon or visual indicator in the documentation UI to signal that authentication is required.

### Key Entities

- **Swagger Definition**: Metadata object describing the API — title, version, server URL, and security scheme configuration.
- **JSDoc Comment Block**: Annotated comment above a route handler or route file that declares endpoint metadata (tags, summary, parameters, request body, responses).
- **Security Scheme (Bearer Auth)**: A declared authentication method using JWT Bearer tokens, referenced by protected endpoints in their documentation.
- **Tag**: A named group label applied to endpoints to organize them visually in the Swagger UI (e.g., Hero, Attractions, Auth).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can open `/api-docs` in a browser and see a fully rendered, interactive API documentation page within 2 seconds of the server being ready.
- **SC-002**: 100% of existing API endpoints (Hero, Attractions, Auth) appear listed and grouped in the documentation — no endpoint is missing from the UI.
- **SC-003**: A developer can complete the full cycle of: viewing an endpoint → entering a Bearer token → executing a live request → reading the response — without leaving the documentation UI.
- **SC-004**: All protected endpoints are visually distinguishable from public endpoints in the documentation UI.
- **SC-005**: A developer who has never seen the codebase can understand the expected request shape and response shape of any documented endpoint within 1 minute of opening the docs.

## Assumptions

- The server runs locally on `http://localhost:5000` during development; the Swagger definition will initially only declare this server.
- The existing route files (heroRoutes.js, attractionRoutes.js, authRoutes.js) will be the target files for JSDoc annotation; no new route files are created in this feature.
- The `swagger-jsdoc` library will scan route files to collect JSDoc comments; the configuration will point to the `src/routes/**/*.js` glob pattern.
- The documentation at `/api-docs` will be accessible in all environments (development included); restricting it to non-production environments is out of scope for this feature but can be added later.
- The Auth endpoints (`/signup`, `/login`) do not require Bearer authentication themselves, so they will not have a lock icon.
- Multipart form uploads (e.g., image fields on Hero and Attractions POST/PATCH) will be documented as `multipart/form-data` content type in the request body schema.
