# Feature Specification: Dynamic Heroes and Merch API Integration

**Feature Branch**: `028-heroes-merch-api`  
**Created**: 2026-05-31  
**Status**: Draft  
**Input**: User description: "Refactor this component to fetch its data from an external API endpoint instead of the static array. Replace the static source with useState and useEffect to fetch from '/api/services'. Map over the fetched state dynamically, add loading/error state placeholders, and preserve the original Tailwind classes and layout.@[my-app/src/features/portal/components/OurHeroesSlider.tsx] @[my-app/src/features/portal/components/Merch.tsx] in @[my-app/src/features/portal/components/HeroPortal.tsx] @[my-app/src/features/portal/components/OurHeroesSlider.tsx] in @[my-app/app/[locale]/zoo/animals/page.tsx] useGetAttractionsQuery this end poin in same branch"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dynamic Hero Slides in Hero Portal (Priority: P1)

As a portal user, I want the hero slides in the main portal page to load dynamically from the backend API instead of static mock arrays, so that the slides stay up-to-date.

**Why this priority**: High priority as it affects the landing portal visual presentation and guarantees real-time content display.

**Independent Test**: Remove static arrays, verify that the swiper slider shows beautiful dynamic slides fetched via HTTP requests to `/api/services`.

**Acceptance Scenarios**:
1. **Given** the backend is running and returns valid hero slides data from `/api/services`, **When** the home portal page is loaded, **Then** the hero slides are fetched, parsed, and rendered in the swiper slider.
2. **Given** the fetch is in progress, **When** the component is waiting for response, **Then** a clean loading spinner/skeleton placeholder is shown.
3. **Given** the fetch fails due to network error, **When** the response is empty or errors out, **Then** a graceful error message with a retry indicator is rendered instead of a crashed component.

---

### User Story 2 - Dynamic Merch in Hero Portal (Priority: P1)

As a shopping portal visitor, I want to see merchandise products loaded dynamically from the backend API, so that I can see the latest products.

**Why this priority**: High priority to make shop listings dynamic and accurate.

**Independent Test**: Load the home portal page, confirm that the merchandise section fetches products from `/api/services` and renders them in the modern `GamesGrid`.

**Acceptance Scenarios**:
1. **Given** the backend is running and returns merchandise items from `/api/services`, **When** the portal is rendered, **Then** the `GamesGrid` renders the dynamic merchandise products.
2. **Given** the fetch is slow, **When** the products are loading, **Then** a neat loading state placeholder is displayed.

---

### User Story 3 - Attractions Slider in Zoo Animals Page (Priority: P2)

As a zoo visitor, I want to see a beautiful slider of animal attractions on the dedicated animals listing page, so that I can browse featured animals easily.

**Why this priority**: Medium priority to enrich the zoo page experience with interactive visual sliders.

**Independent Test**: Open the zoo animals page (`/zoo/animals`), confirm that the `OurHeroesSlider` component is successfully imported and displays the animal attractions fetched from the live `useGetAttractionsQuery` RTK Query endpoint.

**Acceptance Scenarios**:
1. **Given** the `useGetAttractionsQuery` hook fetches attractions with pageKey "zoo", **When** the page loads, **Then** `OurHeroesSlider` is rendered, displaying these attractions dynamically.

---

### Edge Cases

- **Backend Offline/Network Failure**: How does the system handle fetching from `/api/services` when the server is unreachable? The component should render a user-friendly error box with a "Retry" button.
- **Empty Datasets**: What happens if the API successfully returns an empty list of heroes or merchandise? The components should display a descriptive message ("No heroes featured yet", "No merch available") instead of an empty white space.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Backend API MUST implement the `/api/services` GET endpoint in the Express server to serve hero slides and merchandise products.
- **FR-002**: `OurHeroesSlider` MUST use React `useState` and `useEffect` hooks to fetch its content from `/api/services` (via the backend URL configured in `.env`).
- **FR-003**: `Merch` MUST use React `useState` and `useEffect` hooks to fetch its merchandise products from `/api/services`.
- **FR-004**: The React data fetching MUST support localizations by passing the current locale (e.g. `ar` or `en`) as query parameters or reading it in the endpoint.
- **FR-005**: Both `OurHeroesSlider` and `Merch` components MUST preserve all original Tailwind CSS styles, transitions, aspect-ratios, layouts, and swiper options.
- **FR-006**: In `my-app/app/[locale]/zoo/animals/page.tsx`, `OurHeroesSlider` MUST be integrated and receive animal attractions fetched using the existing `useGetAttractionsQuery` hook.

### Key Entities

- **HeroSlide / Service Item**: Represents a slider image card with `id`, `title`, `description`, and `image` (URL).
- **Product / Merch Item**: Represents a merchandise card with `id`, `title`, `image`, and `price`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Page loads without compile errors or runtime React hooks warnings.
- **SC-002**: The dynamic fetch request to `/api/services` resolves and renders content within 1 second.
- **SC-003**: The Swiper slider in `OurHeroesSlider` retains 100% of its responsive touch, loop, autoplay, and navigation functionalities after the refactoring.
- **SC-004**: The zoo animals page renders `OurHeroesSlider` successfully with live animal cards.

## Assumptions

- `NEXT_PUBLIC_BACKEND_URL` is configured in `my-app/.env` pointing to the active backend instance.
- The backend has access to MongoDB database connection and can serve seeded records.
