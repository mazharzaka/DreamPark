# Feature Specification: Park Info & History Page

**Feature Branch**: `029-park-info-history`  
**Created**: 2026-05-31  
**Status**: Draft  
**Input**: User description: "Act as an expert Frontend Developer specialized in React, Next.js (App Router), and Tailwind CSS. I want you to build a purely FRONTEND, static, and highly interactive 'Park Info & History Page' for 'Dream Park' amusement park. This page will not connect to any database or backend APIs; all data should be hardcoded directly into the component for maximum performance."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explore Hero & Quick Facts (Priority: P1)

As a site visitor landing on the page, I want to see a premium, highly engaging hero section with an asymmetric visual layout and beautiful typography, and be able to click a CTA button that smoothly scrolls me to a Quick Facts grid, so that I can immediately get an overview of Dream Park's scale and identity.

**Why this priority**: High-impact first impressions are essential to keep users on the site. Key stats provide immediate context about the park.

**Independent Test**: Landing on the route shows the high-impact Hero without errors, and clicking the CTA smoothly scrolls down to display the 4-column Quick Facts grid.

**Acceptance Scenarios**:

1. **Given** the user is on the `/[locale]/info` page, **When** the page renders, **Then** a stunning visual hero section displays with a bold, asymmetric display title, a floating card animation, and a prominent CTA button.
2. **Given** the user is at the Hero section, **When** they click the CTA button, **Then** the viewport smoothly scrolls to the Quick Facts grid section.
3. **Given** the user is at the Quick Facts section, **When** they view the grid, **Then** they see a 4-column layout (collapsing to a responsive vertical stack on mobile) representing key park stats using Lucide icons.

---

### User Story 2 - Interact with Park History Timeline (Priority: P2)

As a history enthusiast, I want to scroll through an interactive vertical timeline showing Dream Park's milestones from its 1999 Grand Opening through its Golden Era and into its modern Digital Transformation, with milestones animating gracefully into view, so that I can feel connected to the park's history.

**Why this priority**: Core storytelling element. Creates a feeling of luxury and depth.

**Independent Test**: Scrolling down the page triggers elegant Framer Motion fade-and-slide transitions that reveal each historical milestone chronologically.

**Acceptance Scenarios**:

1. **Given** the user has scrolled to the History section, **When** a milestone card enters the viewport, **Then** a Framer Motion `whileInView` animation smoothly fades and slides the milestone card into position.
2. **Given** the timeline milestones, **When** rendered, **Then** they show chronological events (1999: Grand Opening, 2000-2010: Golden Era, Present Day: Digital transformation) with high-contrast text and visual alignment.

---

### User Story 3 - Discover Park Zones (Priority: P2)

As a future visitor planning my trip, I want to browse a highly stylized grid representing the 5 key zones of the park (Main Gate, Kids Area, Adventure Area, Fantasy Land, Thrill Rides) with interactive hover scaling, overlays, and ambient shadows, so that I can visualize the park's layout and different atmospheres.

**Why this priority**: High visual value, shows the diversity of attractions in the park, and reinforces the interactive nature of the page.

**Independent Test**: Hovering over any zone card triggers scale-ups, subtle overlay reveals, and smooth ambient shadow depth modifications.

**Acceptance Scenarios**:

1. **Given** the Park Zones grid, **When** the user hovers over a zone card, **Then** the card scales up slightly, transitions its overlay opacity to highlight the zone name, and deepens its diffused ambient shadow.
2. **Given** a mobile viewport, **When** a user views the Park Zones grid, **Then** the cards stack responsively (single column or clean grid depending on screen size) with touch-state fallbacks for hover animations.

---

### User Story 4 - Access Visitor FAQ & Ticket Accordion (Priority: P3)

As a parent organizing a family visit, I want to toggle between practical visitor questions (Ticket tiers, Opening Hours, Location, Policies) instantly on the client side, so that I can quickly resolve my operational questions without waiting for page loads or backend database fetches.

**Why this priority**: Crucial utility section for functional trip planning. Client-side state guarantees instant feedback.

**Independent Test**: Clicking FAQ/Accordion categories instantly toggles the item open/closed with smooth motion.

**Acceptance Scenarios**:

1. **Given** the Visitor Info accordion list, **When** the user clicks an info header, **Then** the accordion expands smoothly to reveal detailed static text (such as Diamond, Gold, or Silver ticket specifications) using a localized state toggle.
2. **Given** an expanded accordion panel, **When** the user clicks it again or clicks another panel, **Then** it collapses smoothly, keeping the layout clean and readable.

### Edge Cases

- **Locale Switching & RTL Alignment**: When the user switches language from English (`en`, LTR) to Arabic (`ar`, RTL), the page layouts, text alignments, timeline axes, grids, and icon positions MUST invert perfectly to support RTL. Fonts must seamlessly transition from **Plus Jakarta Sans** to **Cairo**.
- **Reduced Motion Support**: If the user has system settings set to `prefers-reduced-motion: reduce`, all heavy animations (Hero float, scroll-linked timeline cards, hover scales) MUST degrade gracefully to static opacity changes or disable animation entirely, preserving readability.
- **Dynamic Hydration Mismatch**: As the page contains dynamic features and client-only states, no dynamic values (like random client-side layout shifts or server-client time calculations) should run on initial SSR, avoiding hydration mismatches.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The feature MUST be implemented as a client-side layout within the bilingual router path `app/[locale]/info/page.tsx` (using Next.js 14 App Router).
- **FR-002**: The Hero section MUST use an asymmetric layout with a display headline, a floating interactive graphic/image, and an Editorial CTA button.
- **FR-003**: The Hero CTA MUST perform a smooth scroll animation targeting the main information container when clicked.
- **FR-004**: The Quick Facts grid MUST render 4 stats (Founded, Size, Capacity, Attractions) with matching Lucide icons, using Tailwind responsive classes (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
- **FR-005**: The History Timeline MUST arrange milestones vertically, utilizing Framer Motion's `whileInView` with a threshold of 0.2 to trigger entry transitions.
- **FR-006**: The Park Zones Grid MUST show 5 zones (Main Gate, Kids Area, Adventure Area, Fantasy Land, Thrill Rides) with scaling (`hover:scale-105`), subtle dark overlays, and ambient shadow shifts.
- **FR-007**: The FAQ & Tickets section MUST implement an accordion structure utilizing standard React hooks (`useState`) to toggle dynamic active states.
- **FR-008**: The entire UI MUST conform to the "Editorial Joy" design system: no 1px solid borders, using background tone shifts for division (`bg-surface` -> `bg-surface-container-low` -> `bg-surface-container-lowest`), diffused ambient shadows (`shadow-ambient`), and high-end typography.
- **FR-009**: The component MUST utilize static localized dictionaries or structured arrays within the file mapping `en` and `ar` languages to eliminate backend dependencies while enabling full bilingual support.

### Key Entities *(include if feature involves data)*

- **FactCard**: Client-side static structure representing key statistics. Attributes: `icon`, `value_en`, `value_ar`, `label_en`, `label_ar`.
- **MilestoneItem**: Client-side static structure representing a historical milestone. Attributes: `year`, `title_en`, `title_ar`, `desc_en`, `desc_ar`, `image`.
- **ZoneCard**: Client-side static structure representing a park zone. Attributes: `name_en`, `name_ar`, `desc_en`, `desc_ar`, `image`, `colorTheme`.
- **FAQAccordionItem**: Client-side static structure representing practical visitor info. Attributes: `id`, `question_en`, `question_ar`, `answer_en`, `answer_ar`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The page achieves a 100% Lighthouse/Core Web Vitals performance score by relying entirely on hardcoded static data and zero API fetches.
- **SC-002**: First Input Delay (FID) or Interaction to Next Paint (INP) for interactive controls (accordions, CTA, hover states) is under 50ms, showing instant responsiveness.
- **SC-003**: 100% responsive design adapting flawlessly to viewports from 320px (mobile) to 1920px (ultra-wide desktop) without text clipping or layout overflow.
- **SC-004**: Language translation switching updates the entire page instantly with zero hydration errors or raw string leaks.

## Assumptions

- **A-001**: Framer Motion, Tailwind CSS, Lucide React, and Next-Intl are correctly installed and configured in the primary Next.js application workspace.
- **A-002**: The page path `app/[locale]/info/page.tsx` is suitable for the portal layout, and a routing directory is available for it.
- **A-003**: No backend database CRUD operations are expected; the page is static and informational.
- **A-004**: Cloudinary or standard high-resolution mock asset URLs will be used for zone and milestone backgrounds.
