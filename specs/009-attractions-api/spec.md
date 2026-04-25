# Feature Specification: Attractions Section — Full CRUD API

**Feature Branch**: `009-attractions-api`  
**Created**: 2026-04-25  
**Status**: Draft  
**Input**: User description: "Attractions Section (الألعاب) — Model, Controller, Routes, App Registration using Node/Express/MongoDB"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Park Visitor Browses All Attractions (Priority: P1)

A park visitor (or a frontend consumer) needs to retrieve a complete list of all available rides and attractions, optionally narrowed down by category (Kids, Family, Thrill), so they can plan their day accordingly.

**Why this priority**: This is the primary read operation and the most frequently called endpoint. Without it, no other feature (filtering, detail view) can be demonstrated.

**Independent Test**: Can be tested by sending a GET request to the attractions list endpoint and verifying a structured list of attractions is returned, even with an empty database.

**Acceptance Scenarios**:

1. **Given** the attractions collection has records, **When** a visitor requests all attractions without any filter, **Then** the system returns a success response with a list of all attractions and their details.
2. **Given** the attractions collection has records of mixed categories, **When** a visitor requests attractions filtered by category "Kids", **Then** the system returns only the attractions belonging to that category.
3. **Given** an invalid category value is provided, **When** the request is made, **Then** the system returns an empty list (graceful degradation, not an error).

---

### User Story 2 — Park Visitor Views a Single Attraction Detail (Priority: P2)

A visitor selects a specific ride from the list to view its full details — including images, waiting time, height requirement, and whether fast-track is supported — so they can decide whether to visit it.

**Why this priority**: Detail view enables informed decision-making and is a prerequisite for integration with the booking flow.

**Independent Test**: Can be tested by requesting a known attraction ID and verifying the response contains all defined fields.

**Acceptance Scenarios**:

1. **Given** a valid attraction ID exists, **When** a visitor requests that attraction, **Then** the system returns a success response with all attraction fields populated.
2. **Given** an ID that does not exist in the database, **When** a visitor requests it, **Then** the system returns a 404 response with a clear, user-friendly error message.
3. **Given** an invalid (non-ObjectId) ID format, **When** the request is made, **Then** the system returns a 400 error with an appropriate message.

---

### User Story 3 — Park Admin Adds a New Attraction (Priority: P3)

A park administrator registers a new ride or attraction in the system, providing all required information (name, category, status, images, etc.), so it becomes visible to park visitors.

**Why this priority**: Data creation is needed to populate the park's attraction catalog; without it the read endpoints have nothing to return.

**Independent Test**: Can be tested by submitting a valid attraction payload and then retrieving it by ID to confirm persistence.

**Acceptance Scenarios**:

1. **Given** an admin provides all required fields (name, status), **When** the create request is submitted, **Then** the system saves the attraction and returns the newly created record with a 201 status.
2. **Given** the `name` field is missing, **When** the create request is submitted, **Then** the system returns a 400 validation error and does not create a record.
3. **Given** an invalid enum value is provided for `status` (e.g., "Unknown"), **When** the create request is submitted, **Then** the system returns a 400 validation error.

---

### User Story 4 — Park Admin Updates an Attraction (Priority: P4)

A park administrator updates an attraction's information — most commonly toggling its operational status (e.g., setting it to "Maintenance") — so that visitors see accurate, real-time information.

**Why this priority**: Status updates are the highest-frequency write operation after creation (rides go in and out of maintenance daily).

**Independent Test**: Can be tested by updating a known attraction's status and then re-fetching it to verify the change persisted.

**Acceptance Scenarios**:

1. **Given** a valid attraction ID and a valid partial payload (e.g., only `status`), **When** a `PATCH` request is submitted, **Then** the system returns the updated record with only the specified fields changed — all other fields remain intact.
2. **Given** an invalid enum value is provided for `status`, **When** the update request is submitted, **Then** the system returns a 400 validation error and leaves the record unchanged.
3. **Given** an ID that does not exist, **When** the update request is submitted, **Then** the system returns a 404 error.

---

### User Story 5 — Park Admin Deletes an Attraction (Priority: P5)

A park administrator permanently removes an attraction record that is no longer relevant (e.g., a retired ride), so the catalog stays accurate.

**Why this priority**: Deletion is the least frequent operation and carries no dependencies on other user stories.

**Independent Test**: Can be tested by deleting a known attraction and then attempting to fetch it by ID; the second request should return a 404.

**Acceptance Scenarios**:

1. **Given** a valid attraction ID exists, **When** the delete request is submitted, **Then** the system removes the record and returns a success message.
2. **Given** an ID that does not exist, **When** the delete request is submitted, **Then** the system returns a 404 error.

---

### Edge Cases

- What happens when the database is unavailable? → The system must return a 500 error through the centralized error handler; it must never crash or return raw stack traces.
- What if the `images` array contains invalid URL strings? → The system stores them as-is (URL format validation is deferred to the frontend upload step); schema does not validate URL format.
- What if `waitingTime` or `minHeight` are sent as negative numbers? → The system rejects them with a 400 validation error; both fields enforce a minimum value of 0.
- What if a PATCH request body is empty? → The system should return the existing record unchanged with a 200 success response.
- What if two attractions share the same name? → Names are not unique by default; duplicate names are allowed.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide an endpoint to retrieve all attractions, returning a structured list with all fields, sorted by creation date descending (newest first) by default.
- **FR-002**: The system MUST support filtering the attractions list by `category` via a query parameter.
- **FR-003**: The system MUST provide an endpoint to retrieve a single attraction by its unique identifier.
- **FR-004**: The system MUST return a 404 response when a requested attraction ID does not exist.
- **FR-005**: The system MUST provide an endpoint to create a new attraction; `name` is required. `status` is optional on creation and defaults to `"Operating"` when not provided.
- **FR-006**: The system MUST validate that `status` is one of the allowed values: "Operating", "Maintenance", or "Closed".
- **FR-007**: The system MUST provide a `PATCH` endpoint to partially update an existing attraction; only the fields included in the request body are modified — omitted fields retain their current values.
- **FR-008**: The system MUST provide an endpoint to permanently delete an attraction by ID.
- **FR-009**: All endpoints MUST return responses following the project's standard contract: `{ success, message?, data? }` on success and `{ success: false, error }` on failure.
- **FR-010**: The system MUST handle unexpected errors gracefully by forwarding them to the centralized error handler, never exposing raw stack traces.
- **FR-011**: The attraction record MUST store image references as an array of external URL strings (no binary data).
- **FR-012**: The system MUST record the creation and last-modification timestamps for every attraction record automatically.
- **FR-013**: The system MUST reject any `minHeight` or `waitingTime` value below 0 with a 400 validation error.
- **FR-014**: The system MUST emit a server-side console log entry for every successful write operation (create, update, delete), including the affected attraction ID.

### Key Entities

- **Attraction**: Represents a single ride, game, or activity in the theme park. Key attributes:
  - `name` (required text identifier)
  - `category` (classification: Kids / Family / Thrill)
  - `description` (free-text description)
  - `images` (ordered list of image URLs sourced from the park's CDN)
  - `minHeight` (minimum visitor height in centimeters; null if no restriction; **must be ≥ 0** if provided)
  - `status` (current operational state: Operating / Maintenance / Closed; **defaults to `"Operating"`** when not specified on creation)
  - `waitingTime` (estimated wait in minutes; operational data updated by staff; **must be ≥ 0** if provided)
  - `isFastTrack` (boolean flag indicating fast-track lane availability)
  - `createdAt` / `updatedAt` (auto-managed timestamps)

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All five CRUD operations complete successfully within 500 milliseconds under normal load (single server, development environment).
- **SC-002**: Category-based filtering returns only matching records — 100% accuracy, no cross-category leakage.
- **SC-003**: Invalid or missing required fields are rejected 100% of the time with a clear, user-readable error message; no invalid record reaches the database.
- **SC-004**: All five operations return responses in the documented contract shape — no deviations observed across all tested scenarios.
- **SC-005**: The attraction list endpoint returns an empty array (not an error) when no attractions exist, allowing the frontend to render a graceful empty state.
- **SC-006**: A newly created attraction is immediately retrievable via the single-attraction endpoint within the same session.

---

## Assumptions

- **Auth is out of scope for v1**: All five endpoints are public (no authentication or authorization middleware). A separate auth feature will gate admin operations in a future iteration.
- **Image upload is out of scope**: The API accepts pre-generated Cloudinary URLs. The upload-to-Cloudinary flow is handled by a dedicated future feature (or directly by the admin UI).
- **Pagination is out of scope for v1**: The `getAllAttractions` endpoint returns all records without pagination. This is acceptable for an initial park catalog (expected < 200 attractions).
- **`waitingTime` updates are manual**: Real-time wait-time integration (e.g., sensor feeds) is out of scope; park staff update this field via the standard update endpoint.
- **`minHeight` unit is centimeters**: The value is stored as a raw number; the unit convention (cm) is agreed upon by the team and communicated to the frontend via API documentation.
- **Single MongoDB collection**: All attraction types (rides, shows, restaurants) share one collection, distinguished by `category`. Sub-collections per type are not needed at this scale.
- **ES Modules**: The codebase uses ES Module syntax exclusively, consistent with the project constitution.

---

## Clarifications

### Session 2026-04-25

- Q: Should the update endpoint use `PATCH` (partial) or `PUT` (full replacement)? → A: `PATCH` — only provided fields are modified; omitted fields retain their current values.
- Q: What is the default value of `status` when not provided on attraction creation? → A: Defaults to `"Operating"` — the field is optional on creation.
- Q: Should `minHeight` and `waitingTime` enforce a minimum value of 0? → A: Yes — both fields enforce `min: 0`; negative values are rejected with a 400 error.
- Q: What is the default sort order for the attractions list endpoint? → A: Sort by `createdAt` descending — newest attraction appears first.
- Q: Should write operations (add/update/delete) emit server-side console logs? → A: Yes — log each successful write with the affected attraction ID; reads remain silent.
