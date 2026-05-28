# Feature Specification: Fix React Hydration Errors

**Feature Branch**: `026-fix-hydration-errors`  
**Created**: 2026-05-28  
**Status**: Draft  
**Input**: User description: "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:
- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

See more info here: https://nextjs.org/docs/messages/react-hydration-error"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Zero Hydration Warnings (Priority: P1)

As a site visitor and developer, I want the web application to load cleanly without any React hydration warnings in the browser console, so that page rendering is predictable, stable, and performant.

**Why this priority**: Console warnings degrade trust, impair active debugging, and signal structural mismatches that can lead to visible layout shifts or broken component behavior. Ensuring error-free hydration is the foundation for premium frontend execution.

**Independent Test**: Can be fully tested by opening the browser DevTools Console on landing and on the bookings history page, confirming that zero React hydration mismatches (specifically React error #418 or #423) are logged.

**Acceptance Scenarios**:

1. **Given** a guest opens the website, **When** the page pre-renders on the server and is sent to the client, **Then** client-side hydration completes with zero warning messages in the developer tools console.

---

### User Story 2 - Localized Bookings Date Display (Priority: P2)

As a booking holder, I want to see my ticket reservation dates formatted beautifully in my chosen language (Arabic/English) without causing any rendering mismatches between the server pre-rendered output and the client-hydrated screen.

**Why this priority**: Users must be able to view their booking dates in their locale format. However, date formatting methods rely heavily on the local runtime environment (timezone/locale database), which often differs between the Node.js server and the user's browser, triggering a hydration error.

**Independent Test**: Can be tested by navigating to the `/bookings` history page in both English and Arabic locales. The page must display the correct localized date formats and avoid hydration logs.

**Acceptance Scenarios**:

1. **Given** an Arabic-speaking guest visits `/ar/bookings`, **When** the bookings list is loaded, **Then** the ticket date displays in full Arabic date string format, and the client HTML aligns perfectly with the server-rendered HTML.
2. **Given** an English-speaking guest visits `/en/bookings`, **When** the bookings list is loaded, **Then** the ticket date displays in full English date string format, and the client HTML aligns perfectly with the server-rendered HTML.

---

### User Story 3 - Hydration-Safe Splash Screen Particles (Priority: P3)

As a visitor entering the Dream Park site, I want to experience a high-fidelity loading splash screen with beautiful, smooth floating particles that render immediately and seamlessly without triggering internal hydration errors due to random generation values.

**Why this priority**: Floating particles add immersive editorial visual quality (Awwwards-level design) to the brand portal. However, generating random coordinate and styling offsets using `Math.random()` during initial render causes HTML property mismatch warnings because the server and client generate distinct random numbers.

**Independent Test**: Can be tested by loading the portal homepage and checking the initial render and fade-out of the SplashScreen, confirming that the splash screen loads, shows particles, and has no console warnings.

**Acceptance Scenarios**:

1. **Given** a user loads the website homepage, **When** the splash screen displays particle fields, **Then** all particle elements are rendered correctly on screen and animate smoothly, with zero console warnings about mismatched style attributes (e.g., top, left, width, height).

---

### Edge Cases

- **Timezone mismatch**: When the booking dates are formatted in a specific timezone on the server (e.g., UTC) but formatted in the user's local browser timezone on the client, resulting in different date values. The system must format dates consistently.
- **Client-only browser extensions**: When browser extensions (like password managers, translators, or dark-mode overlays) inject attributes or scripts into the DOM before React is hydrated. While we cannot control extensions, our code must be written robustly to prevent internal attribute mismatches on application components.
- **First Contentful Paint latency**: If dynamic client-only content (like particles or localized dates) is deferred to client-side mount, it must mount quickly (within 100ms) to prevent noticeable visual flickering or layout shifts.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST prevent any mismatch between the server-rendered HTML attributes and the client-rendered properties for all components.
- **FR-002**: The system MUST defer the generation and rendering of non-deterministic client-side elements (such as splash screen dynamic coordinates, random sizes, and animation delay offsets using `Math.random()`) until after the client component has successfully mounted.
- **FR-003**: The system MUST ensure date formatting (specifically `toLocaleDateString` for Arabic locale) is performed in a hydration-safe manner, such as using a client-side mounting toggle, standardized timezone formatting, or server-provided string snapshots.
- **FR-004**: The system MUST enforce strict semantic HTML nesting conventions (e.g., ensuring block-level elements like `div` are not nested inside paragraphs or invalid wrappers) to prevent browser-native HTML tree corrections from causing React hydration mismatches.
- **FR-005**: The system MUST preserve all editorial-grade transitions, Framer Motion animations, and visual styling guidelines (Plus Jakarta Sans font, Crimson/Royal/Gold color palettes) when refactoring components for hydration safety.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Exactly 0 React hydration mismatch errors or warnings are logged in the browser console when navigating across all pages (Home/Portal, Zones, Zoo, Bookings, Pass, Login/Signup).
- **SC-002**: The loading splash screen displays the active particle field within 50ms of client-side mount, maintaining a smooth 60fps animation.
- **SC-003**: The booking date display renders exactly in the user's active locale format (`ar-EG` or `en-US`) consistently without layout shift or styling differences.
- **SC-004**: 100% of user flows complete successfully without component crashes or layout breaks resulting from hydration mismatches.

## Assumptions

- Dynamic client-only rendering (e.g., deferred particles or deferred locale date strings) does not negatively impact search engine optimization (SEO) since these are either purely cosmetic or user-account specific (bookings history).
- The target browsers support ES6 features and standard Intl API locale capabilities.
- The standard user has a modern web browser capable of running lightweight Javascript animations (Framer Motion).
