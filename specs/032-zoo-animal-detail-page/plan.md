# Implementation Plan: Unified Zoo Animal Detail Page

**Branch**: `032-zoo-animal-detail-page` | **Date**: 2026-06-29 | **Spec**: [spec.md](file:///D:/bit68/DreamPark/specs/032-zoo-animal-detail-page/spec.md)  
**Input**: Feature specification from `/specs/032-zoo-animal-detail-page/spec.md`

---

## Summary

Replace the zoo animals detail page (`/[locale]/zoo/animals/[id]`) with a premium, dark-immersive design built from dedicated zoo-specific components. The games detail page is **not affected**. The new page retains the existing SSR data-fetching strategy (direct `fetch` from the backend API) and reuses the global `Header`/`Footer` from the layout. Five new React components are introduced under `src/features/zoo/`, each responsible for one visual section: a cinematic bilingual hero, a "Everyone is allowed" info box, a booking CTA banner, an interactive photo gallery, and a T&C card grid. A single `NEXT_PUBLIC_ZOO_BOOKING_URL` environment variable stores the external booking destination. New `next-intl` translation keys are added to `messages/en.json` and `messages/ar.json`. No backend changes are required.

---

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 14 (App Router)  
**Primary Dependencies**: Framer Motion, Tailwind CSS, next-intl, lucide-react, Cloudinary SDK (existing)  
**Storage**: N/A (read-only page; data fetched from existing `/api/attractions/:id` endpoint)  
**Testing**: Manual visual QA + cross-locale verification (en/ar), lighthouse audit for core web vitals  
**Target Platform**: Web (desktop + mobile), both LTR and RTL  
**Project Type**: Frontend feature module within Next.js 14 App Router  
**Performance Goals**: LCP < 2.5s on 4G; hero image served via Cloudinary 1400×800 hero preset  
**Constraints**: No new npm packages; all animations via existing Framer Motion; images via existing Cloudinary helpers  
**Scale/Scope**: One page route, 5 new components, 2 updated message files, 1 env variable

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **VII. Feature Folder Architecture** | ✅ PASS | New `src/features/zoo/` directory follows the prescribed structure: `components/`, `lib/`, `types/`, `index.ts` |
| **VIII. Frontend Route Map** | ✅ PASS | `/[locale]/zoo/animals/[id]` already registered in Route Map. `page.tsx` modified in place — no new routes. |
| **IX. State Management (RTK Query)** | ✅ PASS | Page is SSR using direct `fetch` in `page.tsx` (same pattern as `games/[id]/page.tsx`). No RTK Query violations — no client-side API calls. |
| **X. i18n Contract** | ✅ PASS | All strings externalised to `messages/en.json` + `messages/ar.json` under a new `ZooAnimal` namespace. No hardcoded English strings in JSX. |
| **XI. Editorial Joy Design System** | ✅ PASS | Dark zinc background used (`bg-zinc-950`); `shadow-ambient` only; `rounded-xl`/`rounded-full` for all cards; no 1px borders; CTA uses orange gradient (`phoenix` theme). |
| **XII. Framer Motion** | ✅ PASS | `motion.div` with `whileInView` for scroll transitions; `AnimatePresence` for lightbox. |
| **XIII. Hydration Safety** | ✅ PASS | `page.tsx` is a Server Component; all interactive sub-components (gallery, lightbox) are `"use client"`. No `Math.random()` or `Date.now()` in render paths. |
| **Naming & File Conventions (Part 5)** | ✅ PASS | PascalCase `.tsx` components; camelCase lib files; barrel `index.ts` at feature root. |
| **No new dependencies** | ✅ PASS | Zero new npm packages. All dependencies (Framer Motion, lucide-react, Cloudinary helpers) already installed. |
| **Hardcoded strings prohibition** | ✅ PASS | `useTranslations('ZooAnimal')` used throughout; Arabic proper nouns are sourced from API (`name_ar`). |

**Constitution Check Result: ALL GATES PASS — Implementation may proceed.**

---

## Project Structure

### Documentation (this feature)

```text
specs/032-zoo-animal-detail-page/
├── plan.md              ← This file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── contracts/           ← Phase 1 output
└── tasks.md             ← Phase 2 output (/speckit-tasks)
```

### Source Code Changes

```text
my-app/
├── .env                                          ← ADD: NEXT_PUBLIC_ZOO_BOOKING_URL
├── messages/
│   ├── en.json                                   ← ADD: ZooAnimal namespace keys
│   └── ar.json                                   ← ADD: ZooAnimal namespace keys (Arabic)
├── app/[locale]/zoo/animals/[id]/
│   └── page.tsx                                  ← REPLACE: rewire to ZooAnimalHero + zoo components
└── src/
    └── features/
        └── zoo/                                  ← NEW feature module
            ├── index.ts                          ← NEW: barrel export
            ├── lib/
            │   └── constants.ts                  ← NEW: BOOKING_URL + static info-box data
            ├── types/
            │   └── zoo.ts                        ← NEW: ZooAnimal page-level type aliases
            └── components/
                ├── ZooAnimalHero.tsx             ← NEW: full-screen cinematic hero
                ├── ZooInfoBox.tsx                ← NEW: "Everyone is allowed" static badge
                ├── ZooBookingBanner.tsx          ← NEW: horizontal booking CTA banner
                ├── ZooGallery.tsx                ← NEW: asymmetric grid + lightbox
                └── ZooTermsGrid.tsx              ← NEW: T&C 2-col card grid
```

**Structure Decision**: Option 2 (Web application) with a single new `src/features/zoo/` feature module. The route file at `app/[locale]/zoo/animals/[id]/page.tsx` is modified to import zoo components instead of games components. No backend changes are required.

---

## Phase 0: Research

### Resolved Decisions

| Decision | Choice | Rationale | Alternatives Rejected |
|---|---|---|---|
| Dark background token | `bg-zinc-950` (existing Tailwind dark token) | Already used in games dark-mode variant; consistent with `dark:bg-zinc-950` pattern in `GamePage` | Custom hex `#0d0d0d` rejected — not in design system |
| Booking URL storage | `NEXT_PUBLIC_ZOO_BOOKING_URL` env variable; fallback constant in `constants.ts` | Fulfils FR-016 (configurable, no code change to update); accessible to client components via `NEXT_PUBLIC_` prefix | Per-component hardcode rejected (maintenance burden); server-only env var rejected (CTA button is a client component) |
| Info box position in hero | Bottom-left corner of the hero, above the animal name, `absolute` positioned over the hero image | Matches user's "image_0.png" description of an anchored badge within the hero | Right-side float rejected — conflicts with animal name text block |
| Hero bilingual title order | Arabic locale → Arabic name large, English subtitle below; English locale → English name large, Arabic subtitle below | Matches FR-001 and user's design reference for "Simba" hero | Separate hero variants per locale rejected (code duplication) |
| CTA button colour | `phoenix` theme palette (`from-[#ea580c] to-amber-500`) for orange gradient | Matches the "orange CTA button" from the design reference; `phoenix` is an existing theme palette entry | New custom colour rejected — no new dependencies/tokens needed |
| Gallery lightbox | Reuse `AnimatePresence` + `motion.div` pattern from existing `GameGallery.tsx` | Pattern already proven; avoids new dependencies | React Portal lightbox library rejected — unnecessary new package |
| i18n namespace | `ZooAnimal` (new namespace) in `messages/en.json` + `messages/ar.json` | Isolated from existing `DreamZoo` namespace (which is for the listing page); clear ownership | Extending `DreamZoo` namespace rejected — would mix listing-page and detail-page concerns |
| T&C text readability improvement | `text-sm md:text-base` for card text; `text-2xl md:text-3xl` for section title | Directly addresses FR-008's "minimum 14px mobile / 16px desktop" with Tailwind defaults | Custom `px`-based font sizes rejected — design system uses Tailwind scale |

---

## Phase 1: Design & Contracts

### Data Model

The zoo animal detail page consumes a single `Attraction` document. No new backend fields are required. The existing `Attraction` type in `src/types/attraction.ts` already covers all needed fields:

| Field | Source | Used By |
|---|---|---|
| `name_ar` / `name_en` | API `GET /attractions/:id` | `ZooAnimalHero` — primary/secondary bilingual title |
| `description_ar` / `description_en` | API | `ZooAnimalHero` — subtitle description |
| `image` | API (Cloudinary URL) | `ZooAnimalHero` — full-screen background |
| `images[]` | API (Cloudinary URLs) | `ZooGallery` — editorial grid + lightbox |
| `status` | API (`Operating`\|`Maintenance`\|`Closed`) | `ZooBookingBanner` — CTA enabled/disabled state |
| `tags.rules[]` | API | `ZooTermsGrid` — safety rule cards |
| `layout.customStyle` | API | `ZooAnimalHero`, `ZooBookingBanner`, `ZooTermsGrid` — theme palette |
| `category` | API | `ZooAnimalHero` — category badge |
| `waitingTime` | API | `ZooAnimalHero` — wait time stat |

**Static data** (not from API):
- Info box: `"مسموح للجميع"` / `"Everyone is allowed"`, clock icon, `"5 دقائق"` / `"5 min"` — hardcoded in `ZooInfoBox.tsx` but externalised via `ZooAnimal` i18n keys.
- Booking URL: `process.env.NEXT_PUBLIC_ZOO_BOOKING_URL` (with fallback constant).

### Component Contracts

#### `ZooAnimalHero` (Server-compatible, no `"use client"`)
```typescript
interface ZooAnimalHeroProps {
  attraction: Attraction;
  locale: string;        // "ar" | "en"
}
```
Renders: full-screen `<section>` (min-h-[85vh]), background `<Image>` with Cloudinary hero preset, dark gradient overlay, bilingual title block (`name_ar` / `name_en`), `<ZooInfoBox />` anchored bottom-left, wait time stat card.

#### `ZooInfoBox` (no props — purely static)
Renders: glassmorphic card with subtle texture overlay (repeating SVG dot pattern via `bg-[radial-gradient]`), clock icon (lucide), "مسموح للجميع" / "Everyone is allowed" label, "5 min" badge.

#### `ZooBookingBanner` (Client: `"use client"`)
```typescript
interface ZooBookingBannerProps {
  attraction: Attraction;
  locale: string;
}
```
Renders: horizontal banner; heading + subtext (LTR/RTL aware); availability status dot + label; orange CTA `<a>` tag with `href={BOOKING_URL}`, `target="_blank"`, `rel="noopener noreferrer"`. Disabled state renders `<button disabled>` when `status !== "Operating"`.

#### `ZooGallery` (Client: `"use client"`)
```typescript
interface ZooGalleryProps {
  attraction: Attraction;
  locale: string;
}
```
Renders: section title "معرض الصور"; asymmetric 3-col grid (first image `md:col-span-2 md:row-span-2`); thumbnail row for images 4+; `AnimatePresence` lightbox with prev/next and position counter. Returns `null` if no images.

#### `ZooTermsGrid` (Server-compatible)
```typescript
interface ZooTermsGridProps {
  attraction: Attraction;
  locale: string;
}
```
Renders: section header with alert icon + title + subtitle; 2-col (`md:grid-cols-2`) card grid; each card: icon (from `iconMap`), text (`text-sm md:text-base`). Returns `null` if `tags.rules` is empty.

### i18n Keys — `ZooAnimal` Namespace

**`messages/en.json`** additions:
```json
"ZooAnimal": {
  "infoBox": {
    "label": "Everyone is allowed",
    "duration": "5 min"
  },
  "booking": {
    "heading": "Ready for the Adventure?",
    "subtext": "Secure your spot and experience the wonders of Dream Zoo.",
    "cta": "Reserve Your Magic Pass Now",
    "unavailable": "UNAVAILABLE",
    "statusAvailable": "Available Today",
    "statusMaintenance": "Under Maintenance",
    "statusClosed": "Closed Temporarily"
  },
  "gallery": {
    "title": "Media Gallery",
    "subtitle": "Live glimpses from the heart of the wild"
  },
  "terms": {
    "title": "Terms & Safety Rules",
    "subtitle": "Please read the safety guidelines carefully to ensure a safe and enjoyable experience."
  },
  "hero": {
    "waitTime": "Wait Time",
    "min": "MIN"
  }
}
```

**`messages/ar.json`** additions:
```json
"ZooAnimal": {
  "infoBox": {
    "label": "مسموح للجميع",
    "duration": "٥ دقائق"
  },
  "booking": {
    "heading": "هل أنت مستعد للمغامرة؟",
    "subtext": "احجز مكانك واستمتع بعجائب دريم زو.",
    "cta": "احجز بطاقتك السحرية الآن",
    "unavailable": "غير متاح حالياً",
    "statusAvailable": "متاح اليوم",
    "statusMaintenance": "تحت الصيانة",
    "statusClosed": "مغلق مؤقتاً"
  },
  "gallery": {
    "title": "معرض الصور",
    "subtitle": "لقطات حية من قلب البرية"
  },
  "terms": {
    "title": "الشروط والأحكام والسلامة",
    "subtitle": "يرجى قراءة إرشادات السلامة بعناية لضمان تجربة ممتعة وآمنة للجميع."
  },
  "hero": {
    "waitTime": "وقت الانتظار",
    "min": "دقيقة"
  }
}
```

### Environment Variable

**`my-app/.env`** — add:
```
NEXT_PUBLIC_ZOO_BOOKING_URL=https://dreampark.sa/booking
```
Also to be documented in `my-app/.env.example` if it exists.

---

## Implementation Phases

### Phase A — Foundation (no visual changes)
1. Create `src/features/zoo/` directory structure (`lib/`, `types/`, `components/`, `index.ts`)
2. Create `src/features/zoo/lib/constants.ts` with `ZOO_BOOKING_URL` and `iconMap`
3. Create `src/features/zoo/types/zoo.ts` with page-level type aliases
4. Add `NEXT_PUBLIC_ZOO_BOOKING_URL` to `.env`
5. Add `ZooAnimal` keys to `messages/en.json` and `messages/ar.json`

### Phase B — Hero Section
6. Create `ZooInfoBox.tsx` — static info badge with texture
7. Create `ZooAnimalHero.tsx` — full-screen hero with bilingual title + info box + wait time stat

### Phase C — Booking Banner
8. Create `ZooBookingBanner.tsx` — horizontal CTA banner, external URL, disabled state

### Phase D — Gallery
9. Create `ZooGallery.tsx` — editorial grid + lightbox (adapted from `GameGallery.tsx` pattern)

### Phase E — Terms Grid
10. Create `ZooTermsGrid.tsx` — 2-col card grid with improved readability

### Phase F — Page Integration
11. Rewrite `app/[locale]/zoo/animals/[id]/page.tsx` — import zoo components, dark background, `generateMetadata` title fix ("Animal" not "Game")
12. Create `src/features/zoo/index.ts` barrel export

### Phase G — QA
13. Visual review in `ar` and `en` locale
14. Verify lightbox prev/next direction (RTL)
15. Verify CTA opens external URL in new tab
16. Verify T&C section hidden when no rules; gallery hidden when no images
17. Lighthouse audit — LCP target < 2.5s

---

## Complexity Tracking

> No constitution violations requiring justification. All gates passed.

---

## Verification Plan

### Manual Verification
- Navigate to `/ar/zoo/animals/{valid-id}` — verify all 5 sections render correctly in RTL
- Navigate to `/en/zoo/animals/{valid-id}` — verify all 5 sections render correctly in LTR
- Click the CTA button — verify it opens `NEXT_PUBLIC_ZOO_BOOKING_URL` in a new tab
- Set attraction `status` to `Closed` — verify CTA button is disabled with "غير متاح حالياً" / "UNAVAILABLE"
- Navigate to an attraction with no `images[]` — verify gallery section is hidden
- Navigate to an attraction with no `tags.rules` — verify T&C section is hidden
- Test lightbox: open, navigate prev/next, close via X and backdrop click
- Verify "مسموح للجميع" info box is always visible regardless of rules data
- Resize to 375px mobile — verify single-column stacking, 44px+ touch targets
- Navigate to `/ar/games/{id}` — verify games page is **unchanged**

### Automated Checks
- `npx next build` — zero TypeScript errors, zero build warnings
- Verify `ZooAnimal` i18n keys exist in both `en.json` and `ar.json` with matching key structure
