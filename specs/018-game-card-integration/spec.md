# Feature Specification: Game Card Details Integration

**Feature Branch**: `018-game-card-integration`  
**Created**: 2026-05-16  
**Status**: Draft  
**Input**: User description: "عندي ال endpoint ديه استخدمها لو تدوس علي card في صفحهgames ركز انك تعمل تصميم شبه اللي بعته" (I have this endpoint `http://localhost:5000/api/attractions/[id]`, use it if you click on a card in the games page. Focus on making a design similar to the one I sent.)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate to Attraction Details (Priority: P1)

As a park visitor exploring the games page, I want to click on a game card and see its full details using the existing attraction data structure so I can decide if I want to ride it.

**Why this priority**: Core functionality linking the list view to the detail view using the correct API endpoint.

**Independent Test**: Can be fully tested by clicking a card on the Games page and verifying that the resulting page loads data from `/api/attractions/[id]`.

**Acceptance Scenarios**:

1. **Given** the user is on the Games listing page, **When** they click on a specific game card, **Then** they are navigated to the details route (e.g., `/[locale]/attractions/[id]`).
2. **Given** the user navigates to the details route, **When** the page loads, **Then** it fetches data using the `GET /api/attractions/[id]` endpoint.

---

### User Story 2 - Visually Rich Details Design (Priority: P2)

As a park visitor, I want the details page to match the premium, visually rich design provided in the reference image.

**Why this priority**: Aesthetics are critical to the Dream Park brand experience.

**Independent Test**: The UI structure matches the reference image (hero image, overlaid stats, typography).

**Acceptance Scenarios**:

1. **Given** the details page has loaded, **When** the user views the page, **Then** the hero section displays the attraction image with a dark gradient overlay, the title, and related dynamic data matching the provided design.
2. **Given** the Attraction model only has certain fields (e.g., `minHeight`, `waitingTime`, `isFastTrack`), **When** rendering the stats, **Then** it maps these existing fields gracefully to the UI without requiring missing complex schema properties.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST fetch attraction details using the existing `http://localhost:5000/api/attractions/[id]` endpoint.
- **FR-002**: The system MUST navigate users to this details page when an attraction card is clicked.
- **FR-003**: The UI MUST closely replicate the provided reference design (premium, dark theme, dynamic stats overlay).
- **FR-004**: The system MUST map existing `Attraction` Mongoose model fields (e.g., `name_en`/`name_ar`, `image`, `waitingTime`, `minHeight`, `isFastTrack`) to the UI elements shown in the design.
- **FR-005**: The system MUST handle loading and error states gracefully.

### Key Entities

- **Attraction**: The core entity representing the game, fetched by `_id`. Key existing attributes include localized names, description, image, minHeight, waitingTime, and status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Clicking a card navigates to the details page with 100% success rate for valid IDs.
- **SC-002**: The details page successfully loads data from the `/api/attractions/[id]` endpoint.
- **SC-003**: The UI passes a visual QA check against the provided reference design.

## Assumptions

- The `id` used in the endpoint is the MongoDB `_id` of the Attraction document.
- The reference image design can be achieved using Tailwind CSS and Framer Motion.
- Complex nested fields from the previous Game schema are dropped; the UI will gracefully map and adapt the existing simpler `Attraction` fields (e.g., `waitingTime`, `minHeight`) to the stats design.
- The previous implementation using `/api/games/:locale/:slug` will be superseded or removed in favor of this ID-based routing for games.
