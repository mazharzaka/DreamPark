# Feature Specification: Attractions Localization and Pagination

**Feature Branch**: `015-attractions-loc-page`  
**Created**: 2026-05-05  
**Status**: Draft  
**Input**: User description: "شايف ال endpoints اللي في BackEnd/src/routes/heroRoutes.js اعمل كده في BackEnd/src/routes/attractionRoutes.js يكون فيه ar ,en ,pagekey ,sorting ,pganation"

## Clarifications

### Session 2026-05-05
- Q: How should the multi-language data be structured in the database schema? -> A: Single document with embedded language fields (e.g., name_ar, name_en).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Retrieve Localized and Paginated Attractions (Priority: P1)

As a user or client application, I want to retrieve a list of attractions filtered by language (`ar` or `en`), organized by a specific `pageKey`, and with support for pagination and sorting, so that I can display the relevant localized content efficiently.

**Why this priority**: Retrieving localized and paginated data is the primary read operation required for the frontend to render the attractions page correctly.

**Independent Test**: Can be fully tested by making a GET request with language, pageKey, pagination, and sorting parameters, and verifying the returned localized payload and metadata.

**Acceptance Scenarios**:

1. **Given** there are attractions in the database associated with the "games" pageKey, **When** I request attractions with `lang=ar`, `pageKey=games`, `page=1`, `limit=10`, **Then** I receive the first 10 attractions localized in Arabic for the games page, along with pagination metadata.
2. **Given** I request attractions sorted by name in ascending order, **When** the GET request is made with sorting parameters, **Then** the returned attractions list is ordered alphabetically by name.

---

### User Story 2 - Admin Management of Localized Attractions (Priority: P2)

As an admin, I want to create, update, and delete attractions specific to a language and `pageKey`, so that I can manage the localized content displayed on different sections of the website.

**Why this priority**: Essential for managing the content lifecycle of attractions in different languages.

**Independent Test**: Can be fully tested by making authenticated POST, PATCH, and DELETE requests to the new localized admin endpoints and verifying changes in the database.

**Acceptance Scenarios**:

1. **Given** I am an authenticated admin, **When** I create a new attraction with `lang=en` and `pageKey=games`, **Then** the attraction is saved and associated with the English language and games page.
2. **Given** an existing attraction for `lang=ar`, **When** I update its details, **Then** the Arabic version of the attraction is successfully modified.

### Edge Cases

- What happens when a requested `pageKey` does not exist?
- How does the system handle a request for a language other than `ar` or `en`?
- What happens if the pagination limit exceeds the maximum allowed?
- How is sorting handled for fields that may have null values?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support retrieving attractions filtered by `lang` (`ar`, `en`) and `pageKey` parameters in the URL route or query.
- **FR-002**: System MUST support pagination for listing attractions (e.g., using `page` and `limit` query parameters).
- **FR-003**: System MUST support sorting the list of attractions based on specific fields (e.g., name, creation date) and order (ascending, descending).
- **FR-004**: System MUST allow administrators to create, update, and delete localized attraction entries associated with a specific `lang` and `pageKey`.
- **FR-005**: System MUST validate that the `lang` parameter is exactly `ar` or `en`.

### Key Entities

- **Attraction**: Represents a park attraction. Must be structured as a single document with embedded language fields (e.g., `name_ar`, `name_en`, `description_ar`, `description_en`) to support multi-language data efficiently. It is associated with a `pageKey` to group items by page section. Pagination and sorting metadata must be returned with collections of these entities.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: API responses for listing attractions return within 200ms when retrieving the first page of 10 items.
- **SC-002**: Clients can successfully retrieve content strictly localized in the requested language (`ar` or `en`) 100% of the time.
- **SC-003**: Paginated API responses include standard metadata (total items, total pages, current page) to allow the frontend to build navigation controls.
- **SC-004**: Sorting applied to the API response correctly orders the returned data according to the specified field and direction.

## Assumptions

- The `pageKey` parameter acts as an identifier to group attractions (e.g., "games", "animals", "rides"), similar to how the hero section uses it.
- Pagination parameters will default to a standard limit (e.g., 10 items per page) if not explicitly provided.
- Default sorting will be by creation date or ID descending if no sorting parameters are provided.
- The existing authentication and authorization mechanisms for admin routes will be reused.
