# Feature Specification: RTK Query Setup

**Feature Branch**: `013-rtk-query-setup`  
**Created**: 2026-04-26  
**Status**: Draft  
**Input**: User description: "أريد ربط مشروع Next.js 16 (App Router) بـ Backend المشروع باستخدام Redux Toolkit Query مع دعم كامل للـ Server-side Prefetching. المطلوب تنفيذه: Base API Setup... Next.js 16 Compatibility... Store Provider... Server-side Prefetching Logic... Client-side Hydration... Framer Motion Integration..."

## Clarifications

### Session 2026-04-26
- Q: What is the preferred fallback behavior if SSR prefetching fails? → A: Catch the error on the server and allow the client component to attempt to retry the fetch.
- Q: How should caching be configured between Next.js and RTK Query? → A: Disable Next.js fetch caching (`cache: 'no-store'`) and let RTK Query manage all caching.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - App Router & RTK Query Integration (Priority: P1)

As a developer, I want to set up Redux Toolkit Query in our Next.js 16 (App Router) application to fetch data from the backend efficiently, avoiding state leakage between users on the server.

**Why this priority**: Essential for integrating the frontend and backend securely and performantly using modern SSR patterns.

**Independent Test**: Can be fully tested by creating the store infrastructure and verifying that server-side fetched data populates the initial HTML without triggering duplicate client-side network requests.

**Acceptance Scenarios**:

1. **Given** the application initializes on the server, **When** a user requests a page, **Then** a unique Redux store is created per request via `makeStore`.
2. **Given** a Server Component (e.g., `page.tsx`), **When** fetching data, **Then** it successfully dispatches `apiSlice.endpoints.getHeroByPage.initiate('home')` and awaits completion via `Promise.all(apiSlice.util.getRunningQueries())`.

---

### User Story 2 - Client-Side Hydration and Animation (Priority: P2)

As a user, I want the components to render smoothly with fetched data without seeing loading flashes or redundant network requests on the client.

**Why this priority**: Crucial for a smooth user experience and optimal performance.

**Independent Test**: Verify that the Hero slider (Client Component) uses `useGetHeroByPageQuery` and reuses the server-fetched data seamlessly, accompanied by Framer Motion animations upon hydration.

**Acceptance Scenarios**:

1. **Given** a page with pre-fetched data, **When** the client hydrates, **Then** no additional API fetch is made for that data.
2. **Given** the initial render of the Hero slider, **When** the component mounts, **Then** the content appears with a smooth Framer Motion animation.

### Edge Cases

- **SSR Prefetch Failure**: If the backend API fails during server-side prefetching, the server will catch the error and avoid crashing the page. The Client Component will then attempt to fetch the data (retry) upon hydration.
- How does the system handle hydration if the pre-fetched data gets invalidated?
- What happens if Framer Motion animations cause layout shifts during SSR hydration?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST configure a central API slice (`src/lib/features/api/apiSlice.ts`) using `createApi` and a `baseQuery` pointing to the DreamPark Backend.
- **FR-002**: System MUST implement a `makeStore` pattern to instantiate a unique Redux Store per server request (SSR Safe).
- **FR-003**: System MUST provide a `StoreProvider.tsx` Client Component that initializes the store exactly once using `useRef`.
- **FR-004**: System MUST support Server-side prefetching using `store.dispatch(initiate())` and awaiting `Promise.all(apiSlice.util.getRunningQueries())` before rendering the Server Component.
- **FR-005**: System MUST allow Client Components to use RTK hooks (e.g., `useGetHeroByPageQuery`) and utilize the hydrated store state without duplicate requests.
- **FR-006**: System MUST integrate `framer-motion` to reveal fetched data seamlessly upon client-side hydration.
- **FR-007**: System MUST configure RTK Query's `baseQuery` fetch function to bypass Next.js caching (`cache: 'no-store'`), making RTK Query the single source of truth for caching logic.

### Key Entities

- **Store/State**: The Next.js 16 Redux Store context (SSR-isolated).
- **API Slice**: The centralized RTK Query configuration connected to the backend.
- **Hero Data**: Data model describing hero sections, fetched by page ID.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Page loads from the server include fully rendered HTML with the required RTK Query data (zero layout shift from missing data).
- **SC-002**: The network tab shows ZERO duplicate API calls from the client for data that was already prefetched by the server.
- **SC-003**: `StoreProvider` correctly initializes the store only once per client session without state leakage across users.

## Assumptions

- DreamPark Backend API is accessible and returns expected data formats.
- Framer Motion is either already installed or approved to be added as a dependency.
- Next.js is configured to use the App Router (`app/` directory).
