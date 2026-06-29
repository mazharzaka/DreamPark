# Research: Unified Zoo Animal Detail Page

**Feature**: 032-zoo-animal-detail-page  
**Date**: 2026-06-29

---

## Decision Log

### 1. Dark Background Strategy

- **Decision**: Use `bg-zinc-950` (existing Tailwind token) as the page background
- **Rationale**: Already used in the games page dark mode variant (`dark:bg-zinc-950`); no new tokens needed; consistent with Editorial Joy design system; rich enough contrast for white text overlays
- **Alternatives considered**: `bg-black` (too harsh, loses depth), custom `#0d0d0d` hex (not in design system, would require Tailwind config change)

### 2. "Everyone is Allowed" Info Box Texture

- **Decision**: CSS `background-image: radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)` dot pattern via Tailwind arbitrary value, paired with `backdrop-blur-sm` glassmorphic surface
- **Rationale**: Achieves the "subtle texture" described in the spec without any image assets or new dependencies; renders correctly at all screen sizes; performant (CSS-only, no JS)
- **Alternatives considered**: SVG pattern file (extra asset to manage), `bg-noise` utility (not in existing Tailwind config)

### 3. Booking CTA — External URL Pattern

- **Decision**: `<a href={bookingUrl} target="_blank" rel="noopener noreferrer">` as a styled anchor when Operating; `<button disabled>` when Closed/Maintenance
- **Rationale**: Simple anchor semantics are correct for external navigation; `rel="noopener"` is required security hygiene for `target="_blank"`; disabled button prevents interaction without hiding the CTA
- **Alternatives considered**: `window.open()` in onClick (worse accessibility, blocked by pop-up blockers); Next.js `<Link>` (wrong — external URL, not internal route)

### 4. Hero Bilingual Title Layout

- **Decision**: Stack Arabic + English names vertically; Arabic locale → Arabic `text-7xl font-black` primary, English `text-2xl text-white/60` subtitle; English locale → reversed
- **Rationale**: Directly matches the "Simba" hero design from image_0.png where Arabic "سمبا" is the large title and "SIMBA" appears below in all-caps; bilingual stacking is readable and unambiguous
- **Alternatives considered**: Side-by-side layout (breaks on mobile), single language (violates FR-001)

### 5. CTA Orange Theme

- **Decision**: Reuse `phoenix` theme palette (`from-[#ea580c] to-amber-500`) from existing `THEME_PALETTES` in `src/features/games/lib/theme.ts`
- **Rationale**: The `phoenix` palette is exactly the orange gradient described in the spec; reusing `getTheme` function avoids duplication; `attraction.layout.customStyle` may or may not be `phoenix` for a given animal, but the booking banner always uses orange as per the design spec
- **Alternatives considered**: Hardcode `#f97316` (Tailwind orange-500) — rejected, would bypass the theme system

### 6. Gallery Adaptation from GameGallery

- **Decision**: Adapt the existing `GameGallery.tsx` pattern (asymmetric 3-col grid + `AnimatePresence` lightbox) but with dark card backgrounds (`bg-zinc-900`) instead of light (`bg-neutral-100`)
- **Rationale**: The pattern is already proven, accessible, and constitution-compliant; only aesthetic differences (dark surfaces) need to change; avoids reimplementing complex lightbox keyboard handling
- **Alternatives considered**: Third-party lightbox library (violates no-new-deps constraint), completely new from-scratch implementation (unnecessary effort)

### 7. No Backend Changes Required

- **Decision**: No new API endpoints, no model changes
- **Rationale**: The `GET /api/attractions/:id` endpoint already returns all required fields (`name_ar`, `name_en`, `description_ar`, `description_en`, `image`, `images[]`, `status`, `tags.rules`, `layout.customStyle`, `waitingTime`, `category`)
- **Alternatives considered**: New zoo-specific endpoint — rejected, unnecessary given current API response coverage

### 8. Server vs. Client Component Split

- **Decision**: `page.tsx` → Server Component (SSR, `async`); `ZooAnimalHero.tsx` → Server-compatible (no hooks/events); `ZooInfoBox.tsx` → Server-compatible; `ZooBookingBanner.tsx` → `"use client"` (reads env var for URL, has disabled state); `ZooGallery.tsx` → `"use client"` (lightbox state); `ZooTermsGrid.tsx` → Server-compatible (pure render)
- **Rationale**: Maximize RSC usage for better LCP; only components with interactivity are client-side; consistent with the existing `GameHero.tsx` ("use client" for Framer Motion) vs. `page.tsx` (server) split
- **Note**: `ZooAnimalHero.tsx` needs `"use client"` because it uses Framer Motion `motion.div`. Same applies to any component using Framer Motion animations.
