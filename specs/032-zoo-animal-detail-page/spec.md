# Feature Specification: Unified Zoo Animal Detail Page

**Feature Branch**: `032-zoo-animal-detail-page`  
**Created**: 2026-06-29  
**Status**: Draft  
**Input**: User description: "Design a unified, user-friendly webpage for Dream Park, consolidating the elements from images image_0.png, image_1.png, and image_2.png into a seamless scrollable interface. The page will start with the updated, transparent navigation bar (with English/Arabic toggle and 'Book Now' CTA) and the full-screen 'Simba' hero section from image_0.png, where all-caps English subtitles are added below the Arabic title 'Simba' for bilingual accessibility. Retain the stylized 'Everyone is allowed' 5-min info box with a subtle texture. As the user scrolls, they transition smoothly to a 'Ready for Adventure?' booking call-to-action section inspired by image_1.png, featuring the specific text but re-styled as a refined horizontal banner with the same orange CTA button 'احجز بطاقتك السحرية الآن' and its icon, but integrated with more negative space and sophisticated typography. The subsequent section is a beautiful, interactive image gallery for 'معرض الصور', showcasing high-quality photos of zoo animals (including the lions), similar to the concept in image_1.png. At the bottom of the page, the T&C cards from image_2.png are presented in a clean, grid-based footer section, with more readable text on both cards and the main title, ensuring better clarity. The overall aesthetic is clean, modern, and immersive, with a darker background tone and rich natural imagery to highlight animals. All Arabic text must be grammatically correct and correctly rendered, matching the original. The UI elements should feel tactile, with soft shadows and refined icon treatments."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Bilingual Animal Hero Viewing (Priority: P1)

A visitor navigates to a specific zoo animal's detail page (e.g., Simba the lion) and immediately sees a full-screen, cinematic hero section. The hero image fills the viewport with a dramatic gradient overlay. The animal's Arabic name (e.g., "سمبا") is displayed prominently, with an all-caps English subtitle rendered directly below it (e.g., "SIMBA") for bilingual accessibility. A stylized "Everyone is allowed" info box with a subtle texture overlay and a 5-minute timer icon is anchored within the hero, conveying that the exhibit has no restrictions. The transparent navigation bar at the top shows the Dream Park logo, an English/Arabic language toggle, and a "Book Now" CTA button, all overlaid on the hero imagery.

**Why this priority**: The hero section is the first thing a visitor sees; it sets the visual tone and communicates the brand experience immediately. Without this, the page has no anchor.

**Independent Test**: Can be fully tested by navigating to `/ar/zoo/animals/{id}` or `/en/zoo/animals/{id}` and verifying the hero renders the correct animal image, both Arabic and English names display, the info box appears with the correct content, and the navigation bar is transparent with working language toggle and "Book Now" button.

**Acceptance Scenarios**:

1. **Given** a visitor is on the zoo animal detail page in Arabic locale, **When** the page loads, **Then** a full-screen hero image of the animal is displayed with the Arabic name in large stylized typography and an all-caps English subtitle directly below it.
2. **Given** the hero section is visible, **When** the visitor looks at the navigation bar, **Then** the nav bar is transparent (overlaid on the hero image), shows the Dream Park logo, an EN/AR language toggle, and a "Book Now" (or "احجز الآن") CTA button.
3. **Given** the hero section is visible, **When** the visitor looks at the info box, **Then** a stylized card reading "Everyone is allowed" (or the Arabic equivalent "مسموح للجميع") is displayed with a clock icon showing "5 min" and has a subtle texture or pattern background.
4. **Given** a visitor is on the English locale, **When** the page loads, **Then** the English name appears as the primary title and the Arabic name appears as the subtitle, reversing the order.

---

### User Story 2 - Booking Call-to-Action Banner (Priority: P1)

As the visitor scrolls past the hero, they encounter a "Ready for Adventure?" (or "هل أنت مستعد للمغامرة؟") booking call-to-action section. This section is styled as a refined, horizontal banner with generous negative space and sophisticated typography. The orange CTA button reads "احجز بطاقتك السحرية الآن" (Reserve Your Magic Pass Now) with a ticket icon, matching the existing booking system's design language but elevated with more spacing and visual refinement.

**Why this priority**: The booking CTA is the primary revenue conversion point on the page. It must be immediately visible and visually compelling after the hero, so visitors are enticed to book.

**Independent Test**: Can be tested by scrolling past the hero and verifying the booking banner appears with the correct heading text, subtext, status indicator, and CTA button that links to the booking flow.

**Acceptance Scenarios**:

1. **Given** the visitor scrolls past the hero section, **When** the booking banner becomes visible, **Then** a horizontal banner displays with the heading "هل أنت مستعد للمغامرة؟" / "Ready for the adventure?", descriptive subtext, and the orange CTA button "احجز بطاقتك السحرية الآن" with a ticket icon.
2. **Given** the booking banner is visible, **When** the visitor views the banner, **Then** it uses the attraction's theme color for the orange CTA gradient, shows the availability status (e.g., "Available Today" / "متاح اليوم"), and has generous negative space around all elements with sophisticated typography.
3. **Given** the animal attraction is closed or under maintenance, **When** the booking banner renders, **Then** the CTA button is disabled, shows "غير متاح حالياً" / "UNAVAILABLE", and the status indicator reflects the correct closed/maintenance state.

---

### User Story 3 - Interactive Photo Gallery (Priority: P2)

Below the booking banner, the visitor encounters the "معرض الصور" (Photo Gallery) section. This gallery showcases high-quality photos of the zoo animal (including specific photos like lions in their habitat). The gallery uses an asymmetric editorial grid layout for the first three images and a smaller thumbnail grid for remaining images. Clicking any image opens a fullscreen lightbox with navigation controls (previous/next) and a counter indicator.

**Why this priority**: The gallery enriches the visitor's engagement and provides social proof of the animal experience, increasing booking conversion. It is secondary to the hero and CTA but essential for a complete experience.

**Independent Test**: Can be tested by scrolling to the gallery section, verifying images load, clicking an image to open the lightbox, and navigating through images using the lightbox controls.

**Acceptance Scenarios**:

1. **Given** the visitor scrolls to the photo gallery section, **When** the section loads, **Then** a section titled "معرض الصور" / "Media Gallery" is displayed with a descriptive subtitle, and the first 3 images appear in an asymmetric editorial grid (first image larger, spanning 2 columns and 2 rows).
2. **Given** the gallery has more than 3 images, **When** the section loads, **Then** additional images appear in a smaller thumbnail grid below the main editorial grid.
3. **Given** the gallery is visible, **When** the visitor clicks on any image, **Then** a fullscreen lightbox opens with the selected image, navigation arrows (left/right, respecting RTL direction), a close button, and a counter showing the current position (e.g., "2 / 5").
4. **Given** the lightbox is open, **When** the visitor clicks the background or the close button, **Then** the lightbox closes smoothly with an exit animation.

---

### User Story 4 - Terms & Conditions Grid (Priority: P2)

At the bottom of the page, the visitor sees the "الشروط والأحكام والسلامة" (Terms & Safety Rules) section. This section presents safety rules and conditions in a clean, grid-based card layout. Each rule card has an icon, descriptive text, and a hover effect. The text on each card and the main title must be highly readable, with improved font sizes and spacing compared to the original design references.

**Why this priority**: Safety information is legally and ethically important but visitors reach it last. It must be clear and readable but does not drive initial engagement.

**Independent Test**: Can be tested by scrolling to the bottom of the page and verifying the T&C section appears with the correct title, subtitle, and rule cards rendered in a 2-column grid with icons and readable text.

**Acceptance Scenarios**:

1. **Given** the visitor scrolls to the bottom of the page, **When** the T&C section loads, **Then** a section titled "الشروط والأحكام والسلامة" / "Terms & Safety Rules" is displayed with a descriptive subtitle and an alert icon.
2. **Given** the T&C section is visible, **When** the visitor views the rule cards, **Then** each card shows an appropriate icon (height, health, items, behavior), the rule text with readable font size (minimum 14px on mobile, 16px on desktop), and the cards are arranged in a 2-column grid on desktop and single-column on mobile.
3. **Given** the visitor hovers over a rule card, **When** the hover interaction occurs, **Then** the card shows a subtle background color change and a border accent matching the attraction's theme color, and the icon scales up slightly.

---

### User Story 5 - Dark Immersive Theme & Scroll Transitions (Priority: P3)

The entire page uses a dark, immersive background tone to highlight the natural animal imagery. As the visitor scrolls through sections, each section animates into view with smooth scroll-triggered transitions (fade-in, slide-up). Background glow effects matching the attraction's theme color subtly illuminate sections, creating depth and atmosphere.

**Why this priority**: Visual polish and animations enhance the premium feel but are not critical for functional completeness. They can be incrementally improved.

**Independent Test**: Can be tested by scrolling through the page and verifying that each section animates into view, the dark background is consistent, and glow effects appear in the expected positions.

**Acceptance Scenarios**:

1. **Given** the page loads, **When** the visitor views the background, **Then** a dark background tone is used throughout the page (dark zinc/charcoal tones) to make animal imagery and white text stand out.
2. **Given** the visitor scrolls down, **When** each section enters the viewport, **Then** the section animates with a fade-in and slide-up motion over approximately 0.5-0.8 seconds.
3. **Given** the page renders, **When** the visitor views different sections, **Then** ambient glow effects matching the attraction's theme color are visible at strategic positions, creating depth without distracting from content.

---

### Edge Cases

- What happens when the attraction has no gallery images? → The gallery section is hidden entirely.
- What happens when the attraction has no safety rules? → The T&C section is hidden entirely.
- What happens when the attraction status is "Closed" or "Maintenance"? → The booking CTA button is disabled with appropriate status text.
- What happens on very narrow screens (< 320px)? → All sections stack vertically, typography scales down proportionally, and touch targets remain at least 44px.
- What happens when the hero image fails to load? → A placeholder background gradient fills the hero area while maintaining all text overlays.
- What happens when the locale is switched while on the page? → All text, layout direction (LTR/RTL), and button labels update to the new locale.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST display a full-screen hero section occupying at least 85% of the viewport height, with the animal's background image, a gradient overlay, the animal's Arabic name as the primary title, and an all-caps English subtitle below it (reversed when locale is English).
- **FR-002**: The navigation bar MUST be transparent and overlaid on the hero image, containing the Dream Park logo, an EN/AR language toggle, and a "Book Now" CTA button.
- **FR-003**: The hero section MUST always include a stylized info box displaying "مسموح للجميع" / "Everyone is allowed" with a clock icon and "5 min" duration, rendered with a subtle texture background. This info box is a permanent static design element shown on every zoo animal page, regardless of the attraction's rules data.
- **FR-004**: The booking call-to-action section MUST render as a horizontal banner with the heading "هل أنت مستعد للمغامرة؟" / "Ready for the adventure?", descriptive subtext, an availability status indicator, and an orange gradient CTA button labeled "احجز بطاقتك السحرية الآن" with a ticket icon. When clicked, the button MUST open a single fixed park-wide external booking URL in a new browser tab. The URL is the same for all zoo animal pages and is not derived from individual attraction data.
- **FR-016**: The park-wide booking URL MUST be stored in a single configurable location (e.g., an environment variable or a shared constants file) so it can be updated without changing component code.
- **FR-005**: The CTA button MUST be disabled and display "غير متاح حالياً" / "UNAVAILABLE" when the attraction status is not "Operating".
- **FR-006**: The photo gallery section MUST display under the title "معرض الصور" / "Media Gallery" with an asymmetric editorial grid for the first 3 images and a thumbnail grid for subsequent images.
- **FR-007**: The gallery MUST support a fullscreen lightbox with image navigation (previous/next), a close button, and a position counter.
- **FR-008**: The T&C section MUST present safety rules in a 2-column grid (single-column on mobile) with icon-labeled cards, a section title, and subtitle.
- **FR-009**: All Arabic text MUST be grammatically correct and correctly rendered with proper RTL direction.
- **FR-010**: The page MUST support both English (`en`) and Arabic (`ar`) locales, switching text content, layout direction, and button labels accordingly.
- **FR-011**: The page MUST use a dark, immersive background tone (dark zinc/charcoal) to highlight natural animal imagery.
- **FR-017**: The zoo animal detail page MUST be fully publicly accessible with no authentication required. Unauthenticated visitors can view all sections (hero, booking banner, gallery, T&C) without being prompted to log in. Authentication, if required, is handled entirely by the external booking system after the visitor clicks the CTA.
- **FR-012**: The page MUST fetch attraction data from the existing backend API endpoint (`/api/attractions/{id}`) and handle loading, error, and not-found states gracefully.
- **FR-013**: Each section MUST animate into view with scroll-triggered transitions (fade-in, slide-up).
- **FR-014**: The gallery section MUST be hidden entirely when no images are available.
- **FR-015**: The T&C section MUST be hidden entirely when no rules are available.

### Key Entities

- **Attraction (Zoo Animal)**: Represents a zoo animal exhibit with properties including Arabic/English names, description, hero image, gallery images, category, status (Operating/Maintenance/Closed), safety rules, and layout/theme configuration.
- **Safety Rule**: A rule associated with an attraction, containing a type (height, health, items, behavior), text content, and a unique identifier.
- **Theme Palette**: A color configuration (gradients, accents, glows) derived from the attraction's `customStyle` field, used to dynamically style the page.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can view the complete animal detail page (hero → booking CTA → gallery → T&C) in a single, seamless scroll within 5 seconds of initial page load on a standard connection.
- **SC-002**: The bilingual hero section correctly displays both Arabic and English animal names on 100% of animal detail pages, regardless of locale setting.
- **SC-003**: The booking CTA button is visible without additional scrolling within 1.5 viewport heights from the top of the page.
- **SC-004**: Gallery lightbox opens within 300ms of clicking an image and supports navigation between all available images.
- **SC-005**: The page renders correctly in both LTR (English) and RTL (Arabic) layouts with no text overflow, misalignment, or clipping issues.
- **SC-006**: All T&C rule card text is legible at standard reading distance on both mobile (minimum 14px) and desktop (minimum 16px) devices.
- **SC-007**: The dark immersive theme provides a consistent visual experience across all sections, with no jarring background color transitions.
- **SC-008**: The page gracefully handles missing data (no images, no rules, closed status) by hiding irrelevant sections and showing appropriate disabled states.

## Assumptions

- The existing backend API (`/api/attractions/{id}`) provides all necessary data fields including `name_ar`, `name_en`, `description_ar`, `description_en`, `image`, `images`, `status`, `tags.rules`, and `layout.customStyle`.
- The existing navigation bar component (with language toggle and "Book Now" CTA) is already implemented elsewhere in the application and will be inherited from the layout, not built anew within this page.
- The redesign is scoped exclusively to the zoo animals detail page (`/[locale]/zoo/animals/[id]`). The games detail page (`/[locale]/games/[id]`) retains its current design and components unchanged. New dedicated zoo-specific components will be created under a `zoo` feature directory rather than modifying existing game components.
- Image optimization is handled by the existing Cloudinary integration (`getOptimizedCloudinaryUrl`, `getOptimizedCloudinaryHeroUrl`, etc.).
- The theme palette system (`getTheme`) is already in place and will be reused for dynamic color theming.
- Framer Motion is the animation library already in use across the project.
- The "مسموح للجميع" / "Everyone is allowed" info box is a permanent static design element displayed on every zoo animal page. It is not conditional on rules data and does not change based on the attraction's properties.
- Mobile-first responsive design is expected, with breakpoints consistent with the existing Tailwind CSS configuration.

## Clarifications

### Session 2026-06-29

- Q: Where should the CTA button navigate the visitor when clicked? → A: Open an external booking system URL in a new tab.
- Q: Should the redesign apply to both the games detail page and the zoo animals detail page, or only to zoo? → A: Zoo animals page gets its own dedicated components with the new design; games page keeps the current design.
- Q: Should the "مسموح للجميع" info box appear on all zoo animal pages or only conditionally? → A: Always shown on every zoo animal page as a permanent static design element.
- Q: Is the booking URL a single fixed park-wide URL or per-animal? → A: A single fixed park-wide URL, the same for all zoo animal pages, stored in a configurable location.
- Q: Is the page accessible to unauthenticated visitors? → A: Fully public — no authentication required. Auth is handled by the external booking system.
