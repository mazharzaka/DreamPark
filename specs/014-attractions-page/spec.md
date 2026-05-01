# Feature Specification: Attractions Page

**Feature Branch**: `014-attractions-page`  
**Created**: 2026-05-01  
**Status**: Draft  
**Input**: User description: "Attractions page with 2 categories [games, animals]. Games have conditions (e.g. min height), Animals have details. Items displayed as colored overlay cards with pagination. Existing API endpoints are available."

---

## Clarifications

### Session 2026-05-01

- Q: What happens when a user clicks on an attraction card? → A: Clicking navigates to a separate detail page for that attraction.
- Q: How many cards per row should the grid display on large screens? → A: 3 cards per row (3-column grid) on desktop, adapting to fewer columns on smaller screens.
- Q: Is the detail page in scope for this feature? → A: A basic stub page now (shows name, images, description), to be expanded in a future feature.
- Q: How is the overlay color determined per card? → A: Colors rotate through a defined palette from the Editorial Joy design system — each card gets the next color in the sequence.
- Q: Should the user be able to sort the attractions list? → A: No — fixed order from the API (newest first). No sort controls in this version.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Attractions by Category (Priority: P1)

A visitor to the DreamPark portal opens the Attractions page. They see two distinct category tabs — **Games** and **Animals**. They can switch between tabs to view items that belong to each category. Each item is displayed as a visually rich card with a colored overlay.

**Why this priority**: The category browsing experience is the core interaction of the page. Everything else depends on this working correctly.

**Independent Test**: Navigate to the Attractions page → two category tabs are visible → clicking "Games" shows only game attractions → clicking "Animals" shows only animal attractions.

**Acceptance Scenarios**:

1. **Given** a visitor opens the Attractions page, **When** the page loads, **Then** they see two tabs labeled "Games" and "Animals" with the first tab active by default.
2. **Given** the "Animals" tab is clicked, **When** the tab switches, **Then** only animal-category items are displayed and the "Games" items are hidden.
3. **Given** the "Games" tab is clicked, **When** the tab switches, **Then** only games-category items are displayed.
4. **Given** a visitor clicks on any attraction card, **When** the click is registered, **Then** they are navigated to a dedicated detail page for that specific attraction.

---

### User Story 2 - View Game Attraction Conditions (Priority: P1)

When a visitor is browsing the **Games** category, each card displays the game's conditions prominently — specifically the minimum height requirement, waiting time, operational status, and whether fast-track is available.

**Why this priority**: Conditions are essential safety and planning information for visitors with children. Missing this information can cause frustration at the ride queue.

**Independent Test**: Load the Games tab → each card shows minHeight, waitingTime, status, and isFastTrack fields.

**Acceptance Scenarios**:

1. **Given** a user views a game card, **When** the card is displayed, **Then** they can see: minimum height (if applicable), current waiting time, operational status (Operating / Maintenance / Closed), and a Fast Track indicator.
2. **Given** an attraction has `status: "Maintenance"` or `"Closed"`, **When** the card is rendered, **Then** a visual badge clearly indicates the non-operating status with a distinct color.
3. **Given** an attraction has no `minHeight` set, **When** the card is displayed, **Then** no height restriction is shown (field is omitted gracefully).

---

### User Story 3 - View Animal Details (Priority: P2)

When a visitor is on the **Animals** tab, each card shows the animal's name, description, and images in a visually appealing overlay card. There are no "conditions" like height restrictions — instead the focus is on descriptive content.

**Why this priority**: Animals present a different type of content (educational/informative) vs. rides (conditional). Distinguishing this experience is key to a clear UI.

**Independent Test**: Load the Animals tab → each card shows name, description, and an image. No height/waiting-time fields are visible.

**Acceptance Scenarios**:

1. **Given** a user views an animal card, **When** the card is rendered, **Then** they see the animal's name, description, and at least one image.
2. **Given** an animal has multiple images, **When** the card is displayed, **Then** the first image is shown as the card background or primary visual.
3. **Given** an animal has no description, **When** the card is displayed, **Then** the card still renders correctly without a broken layout.

---

### User Story 4 - Paginate Through Attractions (Priority: P2)

Each category tab supports pagination. A visitor can navigate between pages of results without leaving the Attractions page or losing their selected category.

**Why this priority**: The park may have many attractions. Showing all at once creates a poor experience; pagination keeps the page fast and scannable.

**Independent Test**: Load a category with more items than the page limit → pagination controls are visible → clicking next page loads the next set of items.

**Acceptance Scenarios**:

1. **Given** a category has more items than fit on one page, **When** the page loads, **Then** pagination controls appear at the bottom.
2. **Given** the user is on page 1, **When** they click "Next", **Then** the next set of items is displayed and the page indicator updates.
3. **Given** the user is on the last page, **When** the page loads, **Then** the "Next" button is disabled or hidden.
4. **Given** the user switches categories, **When** the tab changes, **Then** pagination resets to page 1.

---

### Edge Cases

- What happens when the API returns an empty list for a category? → Show a friendly "No attractions available" empty state message.
- What happens when the API call fails? → Show an error state with a retry option.
- What if an attraction card has no images? → Show a placeholder image or branded color background.
- What if minHeight is 0 or not set for a game? → Treat as "No height restriction" and display accordingly.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST display two category tabs: "Games" (العاب) and "Animals" (حيوانات).
- **FR-002**: The page MUST fetch attraction data from the existing API, filtered by category (`?category=games` / `?category=animals`).
- **FR-003**: Each attraction MUST be displayed as a clickable card with a colored overlay and the attraction's image as the background. Clicking a card MUST navigate to a dedicated detail page for that attraction.
- **FR-013**: A stub detail page MUST exist for each attraction, accessible via a unique URL (e.g., `/attractions/[id]`). For this version, it MUST display the attraction's name, primary image, and description. Full condition details and advanced content are deferred to a future feature.
- **FR-004**: Game cards MUST display: name, description, minHeight (if present), waitingTime (if present), status badge, and isFastTrack indicator.
- **FR-005**: Animal cards MUST display: name, description, and primary image. No conditions (height, waiting time) should appear.
- **FR-006**: The page MUST support client-side pagination with a configurable page size (default: 8 items per page). Cards MUST be displayed in a 3-column grid on desktop screens, 2 columns on tablets, and 1 column on mobile devices.
- **FR-007**: Switching between category tabs MUST reset pagination to page 1.
- **FR-008**: Attraction status ("Operating", "Maintenance", "Closed") MUST be visually differentiated using distinct colors (e.g., green, yellow, red).
- **FR-009**: The page MUST display a loading skeleton while data is being fetched from the API.
- **FR-010**: The page MUST display an empty state when no attractions exist for a category.
- **FR-011**: The page MUST be fully localized for Arabic (RTL layout) and English (LTR layout).
- **FR-012**: Each card MUST apply a colored overlay chosen by rotating through a defined set of colors from the "Editorial Joy" palette (e.g., 4–6 curated accent colors). Cards are assigned colors sequentially by their position in the list, cycling back to the first color after the last.
- **FR-014**: Attractions MUST be displayed in the order returned by the API (newest first). No user-facing sort controls are provided in this version.

### Key Entities

- **Attraction**: Represents a single park attraction with fields: `_id`, `name`, `category`, `description`, `images[]`, `minHeight`, `status`, `waitingTime`, `isFastTrack`, `createdAt`.
- **Category Tab**: A UI grouping that filters attractions by the `category` field value (`"games"` or `"animals"`).
- **Pagination State**: Tracks current page number and total pages for a given category's results.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can switch between Games and Animals tabs and see filtered results within 1 second.
- **SC-002**: All game attraction cards display conditions (height, wait time, status) — 100% of games with conditions show them correctly.
- **SC-003**: All animal cards show name, description, and image — 0 broken/empty card states for valid data.
- **SC-004**: Pagination controls appear whenever a category has more than 8 items and allow navigation across all pages.
- **SC-005**: The page is fully readable and correctly laid out in both Arabic (RTL) and English (LTR) without any visual overlap or broken alignment.
- **SC-006**: An empty state or error state is displayed within 2 seconds whenever data is unavailable.
- **SC-007**: Attraction cards render in a 3-column grid on screens wider than 1024px, 2-column on tablet (768–1023px), and single column on mobile (below 768px).

---

## Assumptions

- The existing API endpoint `GET /api/attractions?category=games` and `GET /api/attractions?category=animals` return correctly filtered data — no backend changes are required.
- The `category` field values in the database are lowercase strings: `"games"` and `"animals"`.
- Pagination is implemented on the frontend (client-side slicing) since the current API does not support server-side pagination.
- The "Editorial Joy" design system tokens (colors, fonts, spacing) are already defined in the project and will be reused.
- The page will be integrated into the existing portal layout alongside other sections.
- Mobile responsiveness is required — cards should stack to a 1-2 column grid on small screens.
- RTL/LTR localization uses the existing `next-intl` setup already in the project.
- The detail page delivered in this feature is a stub only (name, image, description). A dedicated future feature will build the full detail experience including all conditions, gallery, and booking integration.
- Attractions are displayed in the API's default sort order (newest first). Sorting controls are out of scope for this version.
