# Feature Specification: Games Page API Integration

**Feature Branch**: `016-games-api-integration`  
**Created**: 2026-05-07  
**Status**: Draft  
**Input**: User description: "Integration لصفحة /games - اطلب البيانات من الـ Endpoint، Mapping للبيانات، Filtering بـ Query Parameter للـ Backend، Handling لحالات loading والـ error"

## Clarifications

### Session 2026-05-07

- Q: How is the filter bar's category list populated? → A: Extract unique `category` values from the games list returned by the initial API call (no separate endpoint needed).
- Q: What happens when a category filter request fails — clear content or keep previous results? → A: Keep the previously visible games on screen and overlay/append a dismissible error notification (no full-page takeover).
- Q: Should the API locale segment follow the active UI locale or be hardcoded to `ar`? → A: Dynamic — the locale segment in the API request follows the locale the visitor is currently browsing in.
- Q: Should the error state include a retry button, or is a manual browser refresh sufficient? → A: Error message only — no retry button; the user must refresh the page to recover.
- Q: On returning to the games page, should previously cached data be shown while re-fetching, or always start from a loading state? → A: Always show a fresh loading state on each page visit — no stale/cached data is displayed while a new request is in-flight.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View All Games on Page Load (Priority: P1)

When a visitor navigates to the /games page for the first time, they see all available games fetched live from the backend system, replacing any static placeholder data. The page shows a loading indicator while data is being retrieved and a clear error message if the data cannot be loaded.

**Why this priority**: This is the foundation — the page must show real data before any filtering can work. Without this, the feature has zero value.

**Independent Test**: Navigate to the /games page, observe a loading state appears briefly, and then all games from the backend are displayed with their correct names, images, descriptions, and category labels.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the /games page, **When** the page loads, **Then** a loading indicator is visible while data is being fetched from the backend.
2. **Given** the backend returns a list of games, **When** data arrives, **Then** all returned games are displayed on the page with their name, description, image, and category correctly rendered.
3. **Given** the backend is unreachable or returns an error, **When** the page loads, **Then** a user-friendly error message is shown (instead of a blank page or crash).
4. **Given** the backend returns an empty list, **When** the page loads, **Then** a clear "no games available" message is displayed to the visitor.

---

### User Story 2 - Filter Games by Category (Priority: P2)

A visitor browsing the /games page can click a category filter (e.g., "Action", "Adventure") and immediately see only the games belonging to that category. The filtering is performed by the backend system — not by hiding/showing items already on the page — ensuring accuracy and scalability.

**Why this priority**: Category filtering is the primary interaction of the games page. It directly enables visitors to discover relevant content without scrolling through everything.

**Independent Test**: Click a category filter button, observe a loading state, and verify that only games matching that category (as returned by the backend) are shown.

**Acceptance Scenarios**:

1. **Given** a visitor is on the /games page with all games visible, **When** they click a specific category filter, **Then** the page sends a filtered request to the backend and displays only games matching that category.
2. **Given** a category filter is active, **When** the visitor clicks a different category, **Then** the previously active filter is deselected, a new backend request is made for the new category, and only the new results are shown.
3. **Given** a category filter is active and returns no games, **When** results arrive, **Then** a "no games in this category" message is shown.
4. **Given** a category filter request fails, **When** the error occurs, **Then** the previously visible games remain on screen and a dismissible error notification is shown — the page does not go blank or replace content with a full-page error.

---

### User Story 3 - Reset to All Games (Priority: P3)

A visitor who has selected a category filter can return to viewing all games by deselecting the active filter (or clicking an "All" option). This resets the view to the full game listing fetched from the backend without any category parameter.

**Why this priority**: Completing the filter lifecycle — users must have a way to undo their filter selection without refreshing the entire page.

**Independent Test**: After selecting a category filter, click the "All" option and verify all games are fetched and displayed again.

**Acceptance Scenarios**:

1. **Given** a category filter is active, **When** the visitor clicks the "All" option or deselects the current filter, **Then** the filter resets and a backend request with no category parameter is made, displaying all games.
2. **Given** the page initially loaded in "All" state, **When** the visitor has never selected a filter, **Then** no category parameter is included in the initial data request.

---

### Edge Cases

- What happens when the backend takes longer than expected to respond? → The loading indicator remains visible; no partial or stale data is shown.
- What happens if the same category is clicked twice? → No duplicate request is sent; the current results remain unchanged.
- What happens if the category list itself fails to load? → The filter bar shows a default "All" option only; games are still fetched without a category filter.
- What happens if a game's category field is missing or null? → The game is still displayed; the category label is omitted or shown as "Unknown."
- What happens after an initial load error and the user wants to recover? → No in-page retry mechanism exists; the visitor must perform a full browser page refresh.
- What happens when the user navigates back to the games page with a previously selected category? → The page resets to the initial "All" state and always shows a fresh loading indicator — no stale cached data is displayed while the new request is in-flight.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The games page MUST fetch game data from the backend on initial load without requiring any user action.
- **FR-002**: The page MUST display a loading indicator while any backend request (initial load or filter change) is in progress.
- **FR-003**: On initial page load failure, the page MUST display a descriptive, user-friendly full-page error message (no games can be shown). On filter request failure, the page MUST preserve the previously displayed games and show a dismissible error notification without replacing page content. No retry button is provided — the visitor must refresh the browser to re-attempt a failed initial load.
- **FR-004**: The page MUST display all returned games in the initial state, with no category filter applied.
- **FR-005**: Each displayed game MUST show the `category` field value sourced from the backend data, mapped to the visible category label shown on the card.
- **FR-006**: When a visitor selects a category filter, the page MUST send a backend request that includes the selected category as a filter parameter (e.g., `?category=action`), ensuring filtering logic resides on the backend.
- **FR-007**: The page MUST NOT perform client-side filtering by hiding/showing games already fetched without a category filter — every category selection triggers a new backend request.
- **FR-008**: When no category filter is selected, the page MUST send a backend request with no category parameter, displaying all games.
- **FR-009**: The filter bar MUST visually highlight the currently active category to provide clear feedback to the visitor.
- **FR-010**: The page MUST handle the case where the backend returns zero results gracefully by displaying an appropriate empty-state message.
- **FR-011**: The backend request locale segment MUST reflect the active UI locale of the current visitor session (e.g., a visitor browsing in English sends requests to the English-locale endpoint, not a hardcoded `ar` segment).

### Key Entities

- **Game**: Represents a single attraction/game retrieved from the backend. Key attributes: unique identifier, name (localized), description (localized), image, and category label.
- **Category**: A grouping classification for games. Sourced from the `category` field of each game in the API response. The filter bar is populated by extracting the unique set of category values from the initial games list — no separate category endpoint is required.
- **Filter State**: The currently active category selection. When empty/null = "All games" state; when set = backend-filtered results state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The games page displays live backend data within 3 seconds of initial load under normal network conditions.
- **SC-002**: Applying a category filter and seeing filtered results takes no more than 2 seconds from the user's click.
- **SC-003**: 100% of game cards on the page display the correct `category` value as received from the backend — zero mismatches between backend data and displayed content.
- **SC-004**: A loading indicator is visible for every backend request (initial load, filter change, and page revisit) — visitors never see stale or cached content while a request is in-flight.
- **SC-005**: All error scenarios (network failure, server error, empty results) show an informative message — zero cases where the page is blank or crashes without feedback.
- **SC-006**: Selecting a category sends exactly one backend request per selection — no redundant calls are made.

## Assumptions

- The backend endpoint (`/api/attractions/{locale}/home`) supports a dynamic locale segment and returns localized game content for each supported locale. The active UI locale is passed as this segment on every request.
- The backend supports filtering via a `category` query parameter (e.g., `?category=action`); the exact category values/slugs match what is sent from the filter bar.
- The filter bar category list is derived client-side by extracting the unique set of `category` values from the initial "all games" API response. No separate category endpoint is called.
- Arabic locale (`ar`) is the primary data language for this integration; additional locales follow the same endpoint pattern with their respective locale segment. Localization of UI labels (filter buttons, error messages) uses the existing translation system.
- The existing /games page UI shell (layout, card components, filter bar) is already built; this feature only connects it to the live backend data source.
- Mobile responsiveness and RTL layout support are handled by the existing UI components and are not in scope for this integration.
- Authentication/authorization is not required to access the games listing endpoint (public endpoint).
- URL-based state persistence for active category filters is out of scope for v1.
