<!--
SYNC IMPACT REPORT
==================
Version Change: 1.1.0 → 2.0.0
Bump Rationale: MAJOR — Complete rewrite expanding all sections to reflect the actual
  codebase (pages, routes, state, i18n, roles, models, components). The previous v1.1.0
  described intent; v2.0.0 codifies the as-built reality and extends governance to every
  layer of the stack. Backward incompatible with v1.x because principles were renumbered
  and scopes were materially changed.
Added Sections:
  - Frontend Route Map (all [locale] routes documented with their feature modules)
  - Backend API Route Registry (all 5 route files, all methods/paths)
  - Data Model Contracts (all 5 Mongoose models fully documented)
  - State Management Architecture (Redux Toolkit, RTK Query slices)
  - Internationalisation (i18n) Contract
  - Authentication & Roles Contract
  - Feature Folder Architecture
  - Naming & File Conventions
Modified Principles:
  - "Modular Controller-Route-Model" → expanded with upload middleware constraints
  - "Editorial Joy Design System" → expanded with Tailwind token names, RTL rules
  - "Framer Motion for Interaction" → added layoutId / spring defaults
Removed Sections: None
Templates Requiring Updates:
  - .specify/templates/plan-template.md   ✅ aligned (Constitution Check references remain generic)
  - .specify/templates/spec-template.md   ✅ aligned
  - .specify/templates/tasks-template.md  ✅ aligned
Deferred TODOs: None — all placeholders resolved.
-->

# Dream Park Constitution

**Version**: 2.0.0 | **Ratified**: 2026-04-24 | **Last Amended**: 2026-05-23

---

## Overview

Dream Park is a bilingual (Arabic / English), full-stack amusement park web platform
consisting of:

- **Frontend** — Next.js 14 (App Router) in `my-app/`, TypeScript, Tailwind CSS,
  Framer Motion, Redux Toolkit + RTK Query.
- **Backend** — Node.js / Express.js in `BackEnd/src/`, ES Modules, MongoDB +
  Mongoose, JWT authentication, Cloudinary, Swagger (OpenAPI).

All principles below are NON-NEGOTIABLE unless an amendment is ratified following
the Governance section.

---

## Part 1 — Backend Principles

### I. Modular Controller-Route-Model Architecture

Every backend feature MUST follow the three-layer separation:

- **`src/models/`** — Mongoose schemas only. No business logic.
- **`src/controllers/`** — All business logic and DB queries. `try-catch` wrapping
  is mandatory in every function (see Principle III).
- **`src/routes/`** — Express Router files only. Route files MUST:
  - Import the controller function and call it immediately.
  - Apply middleware chains (`protect`, `restrictTo`, `upload.single(...)`) inline
    before the controller reference — never inside the controller.
  - Include a JSDoc `@swagger` block for every endpoint.
- **`src/middlewares/`** — Cross-cutting concerns only:
  - `authMiddleware.js`: `protect` (JWT decode) + `restrictTo(...roles)` (RBAC).
  - `errorMiddleware.js`: Centralised Express error handler — MUST be registered
    last in `app.js` after all route mounts.
  - `uploadMiddleware.js`: Multer/Cloudinary upload — MUST NOT contain business
    logic.

No DB query or business logic may appear in a route file.
Violations MUST be refactored before the PR is merged.

### II. ES Modules Exclusively (Backend)

The backend MUST use ES Module syntax (`import`/`export`) throughout.
`require` / `module.exports` is PROHIBITED in any new or modified backend file.

### III. Mandatory try-catch in Every Controller

Every exported controller function MUST be wrapped using the `catchAsync` utility
(`src/utils/catchAsync.js`). Direct `try-catch` blocks inside controllers are
acceptable only for inner logic; the outer async boundary MUST use `catchAsync`.
Silent swallowed errors (no `next(err)` call) are PROHIBITED.

### IV. Consistent API Response Contract

All API responses MUST conform to exactly one of these two shapes:

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "human-readable message" }
```

Additional envelope fields (e.g. `token` on auth responses, `pagination` on list
responses) are allowed alongside `success` + `data`, but the `success` boolean MUST
always be present.
Controllers MUST NOT leak raw Mongoose errors, stack traces, or internal IDs to the
client. Use `AppError` (`src/utils/appError.js`) for all thrown domain errors.

### V. Dynamic Content via `pageKey` Strategy

Every content collection that is page-specific (Hero, Attraction) MUST carry a
`pageKey` field to distinguish instances rather than using separate collections.
- Valid `pageKey` values for Hero: `home`, `zoo`, `games`, `tickets`, `pass`.
- Valid `pageKey` values for Attraction: `home`, `games`, `zoo`.
Image assets MUST be stored as Cloudinary URLs — no binary blobs in MongoDB, no
local asset serving.
Relational data (e.g. `Booking.ticketTypeId → TicketType`) MUST use Mongoose
`.populate()` wherever the consumer needs the related document fields.

### VI. Role-Based Access Control (RBAC)

User roles are stored in the `User` model and normalised inside `authMiddleware.js`.
The canonical role set (as used in `restrictTo(...)` calls) is:

| Stored value | Normalised to | Access level |
|---|---|---|
| `customer` / `USER` | `USER` | Authenticated public user |
| `staff` / `MARKETING_AGENT` | `MARKETING_AGENT` | Park staff (payment verify, scan) |
| `admin` / `ADMIN` | `ADMIN` | Full admin (CRUD on all resources) |

When calling `restrictTo()`, use the canonical uppercase names (`USER`,
`MARKETING_AGENT`, `ADMIN`). The middleware normalises both old and new values.
New roles MUST be added to this table, to the `User` schema enum, and to
`authMiddleware.js` normalisation map before being used in any route.

---

## Part 2 — Backend API Route Registry

All registered API endpoints. New endpoints MUST be added here before implementation.
Breaking changes require a `/v2/` prefix and a migration plan.

### `/api/hero` (`heroRoutes.js`)

| Method | Path | Auth | Responsibility |
|--------|------|------|----------------|
| GET | `/:lang/:pageKey` | Public | Fetch localised hero section (title, subtitle, slides[], videoUrl) |
| POST | `/:lang/:pageKey` | ADMIN | Create or update (upsert) hero section content |
| POST | `/:lang/:pageKey/slides` | ADMIN | Append a slide to the hero slides array |
| PATCH | `/:lang/:pageKey/slides/:slideId` | ADMIN | Edit an existing slide by its `_id` |
| DELETE | `/:lang/:pageKey/slides/:slideId` | ADMIN | Remove a slide from the slides array |

Hero upload uses `upload.single('image')` for the slide image field.

### `/api/attractions` (`attractionRoutes.js`)

| Method | Path | Auth | Responsibility |
|--------|------|------|----------------|
| GET | `/` | Public | Fetch all attractions (unfiltered) |
| GET | `/:lang/:pageKey` | Public | Fetch paginated, sorted, localised attractions by page. Supports `?page`, `?limit`, `?sort`, `?order` query params |
| GET | `/:id` | Public | Fetch single attraction by MongoDB `_id` |
| POST | `/` | ADMIN | Add a new attraction (with `upload.single('image')`) |
| PATCH | `/:id` | ADMIN | Update an attraction (with `upload.single('image')`) |
| DELETE | `/:id` | ADMIN | Delete an attraction |

### `/api/auth` (`authRoutes.js`)

| Method | Path | Auth | Responsibility |
|--------|------|------|----------------|
| POST | `/signup` | Public | Register a new user, returns JWT token |
| POST | `/login` | Public | Authenticate credentials, returns JWT token |

### `/api/tickets` (`ticketingRoutes.js`)

| Method | Path | Auth | Responsibility |
|--------|------|------|----------------|
| GET | `/types` | Public | Browse available ticket types (name, price, discount, descriptions) |
| POST | `/types` | ADMIN | Add a new ticket type |
| PATCH | `/types/price` | ADMIN | Update price / name / description / discount of a ticket type |
| POST | `/bookings` | USER+ | Create a booking (ticketTypeId, targetDate, quantity) |
| GET | `/bookings/user` | USER+ | Retrieve the current user's booking history |
| POST | `/verify` | MARKETING_AGENT / ADMIN | Verify a QR code UUID and confirm payment for a booking |

### `/api-docs` (Swagger UI)
Served at `/api-docs` via `swagger-ui-express`. Every route file MUST maintain its
JSDoc `@swagger` annotations in sync with any route changes.

---

## Part 3 — Data Model Contracts

### Hero Model (`src/models/Hero.js`)

Fields: `pageKey` (required), `lang` (`ar`|`en`, required), `title`, `subtitle`,
`videoUrl`, `slides[]` (`title`, `subtitle`, `description`, `ctaText`, `ctaLink`,
`image` Cloudinary URL).
One Hero document per `{ lang, pageKey }` combination — upsert semantics enforced
in `heroController.js`.

### Attraction Model (`src/models/Attraction.js`)

Fields: `pageKey` (required), `name_en` (required), `name_ar` (required),
`title`, `subtitle`, `category`, `description_en`, `description_ar`, `image`
(Cloudinary URL), `images[]`, `minHeight`, `status` (`Operating`|`Maintenance`|`Closed`),
`waitingTime`, `isFastTrack`, `bookPass`, `icon`, `tags` (`rules[]`, `badges[]`),
`layout` (`colSpan`, `rowSpan`, `customStyle`).

`layout.customStyle` MUST be one of: `crimson`, `sky`, `nebula`, `amazon`, `phoenix`, `midas`.
`name` and `description` (singular, non-localised) are DEPRECATED — use `name_en`/
`name_ar` and `description_en`/`description_ar` for all new code.

### TicketType Model (`src/models/TicketType.js`)

Fields: `name` (required), `nameAr`, `price` (required, positive number),
`description`, `descriptionAr`, `discount` (0–100), `isActive` (bool).

### Booking Model (`src/models/Booking.js`)

Fields: `userId` (ref `User`, required), `ticketTypeId` (ref `TicketType`, required),
`targetDate` (Date, required, MUST be today or future), `totalPrice` (required, ≥ 0),
`qrCodeId` (unique UUID, auto-generated), `status` (`PENDING_PAYMENT`|`PAID`),
`quantity` (int ≥ 1), `phoneNumber` (required).

`qrCodeId` is the ticket identifier used by the marketing-agent scan flow. It MUST
remain immutable after creation.

### User Model (`src/models/User.js`)

Fields: `name`, `email` (unique, lowercase), `password` (hashed, minLength 8, select: false),
`passwordConfirm` (validation only, select: false), `phoneNumber`, `profilePicture`,
`gender` (`male`|`female`), `dateOfBirth`, `address`, `role` (see RBAC table above).

Password hashing MUST happen only in the `pre('save')` hook on the model, not in
the controller.

---

## Part 4 — Frontend Principles

### VII. Feature Folder Architecture

All frontend code MUST follow this structure:

```
src/
  features/
    <featureName>/          # Encapsulates one page's logic
      components/           # React components for this feature only
      data/                 # Static mock or seed data
      hooks/                # Feature-specific hooks
      lib/                  # Helper functions, API calls, utils
      styles/               # Feature-specific CSS modules (if any)
      types/                # TypeScript types/interfaces for this feature
      index.ts              # Public barrel export
  components/
    layout/                 # App-wide layout components (Header, Footer)
    ui/                     # Shared primitive UI components (EditorialButton, etc.)
  lib/
    features/
      api/                  # RTK Query API slices (apiSlice, bookingsApi)
      auth/                 # Auth slice + authApi
      booking/              # Booking slice
    store.ts                # Redux store factory (makeStore)
    hooks.ts                # Typed useAppSelector / useAppDispatch
```

Components MUST NOT reach across feature boundaries directly. Cross-feature data
MUST flow through the Redux store or be lifted to a page-level component.

### VIII. Frontend Route Map

All pages live under `app/[locale]/`. The `[locale]` segment is resolved by
`next-intl` middleware and is either `en` or `ar`.

| Route | Page File | Feature Module | Notes |
|-------|-----------|----------------|-------|
| `/` (root) | `app/page.tsx` | — | Redirects to `[locale]` |
| `/[locale]` | `app/[locale]/page.tsx` | `features/portal` | SSR-prefetches hero `pageKey=home` via RTK Query |
| `/[locale]/games` | `app/[locale]/games/page.tsx` | `features/games` | Client component; fetches `GET /api/attractions/:lang/home` |
| `/[locale]/games/[id]` | `app/[locale]/games/[id]/` | `features/games` | Attraction detail page |
| `/[locale]/games/[slug]` | `app/[locale]/games/[slug]/` | `features/games` | Attraction slug page |
| `/[locale]/zoo` | `app/[locale]/zoo/page.tsx` | `features/explore` | Zoo listing page |
| `/[locale]/zoo/animals` | `app/[locale]/zoo/animals/` | `features/explore` | Animal detail pages |
| `/[locale]/tickets` | `app/[locale]/tickets/page.tsx` | `features/tickets` | Ticket type browser |
| `/[locale]/pass/[[...id]]` | `app/[locale]/pass/[[...id]]/` | `features/tickets` + `BookingFlow` | Magic Pass & multi-step booking |
| `/[locale]/bookings` | `app/[locale]/bookings/page.tsx` | `features/tickets` | User booking history |
| `/[locale]/login` | `app/[locale]/login/` | `features/auth` | Login form |
| `/[locale]/signup` | `app/[locale]/signup/` | `features/auth` | Registration form |
| `/[locale]/marketing-dashboard/scan` | `app/[locale]/marketing-dashboard/scan/` | `AgentScanner` | QR code payment verification (MARKETING_AGENT role) |

New pages MUST be added to this table before implementation begins.

### IX. State Management with Redux Toolkit

The app uses a single Redux store created by `makeStore()` (`src/lib/store.ts`).
All API communication MUST go through RTK Query slices — direct `fetch`/`axios`
calls in components are PROHIBITED.

Active slices:

| Slice | File | Purpose |
|-------|------|---------|
| `apiSlice` | `src/lib/features/api/apiSlice.ts` | Base RTK Query API (hero, attractions) |
| `bookingsApi` | `src/lib/features/api/bookingsApi.ts` | Ticket types, booking create, user bookings, verify |
| `authApi` | `src/lib/features/auth/authApi.ts` | Login, signup endpoints |
| `authSlice` | `src/lib/features/auth/authSlice.ts` | JWT token state + user info |
| `bookingSlice` | `src/lib/features/booking/bookingSlice.ts` | Multi-step booking flow state |

New API endpoints MUST be added to an existing slice or a new purpose-specific
slice file — NEVER inline in a component.

### X. Internationalisation (i18n) Contract

The app is bilingual: `en` (LTR) and `ar` (RTL).

- `next-intl` is used for all translations. The `routing` config (`src/i18n/routing`)
  defines supported locales and default locale.
- Translation files live in `messages/` at the root of `my-app/`.
- The root layout (`app/[locale]/layout.tsx`) sets `lang` and `dir` on `<html>`
  based on locale: `dir="rtl"` for `ar`, `dir="ltr"` for `en`.
- Arabic font: **Cairo** (weights 400–900) or **IBM Plex Sans Arabic** (weights 300–700),
  loaded via `Next/Font`. English font: **Plus Jakarta Sans**.
- Components MUST use `useTranslations('Namespace')` — hardcoded English strings in
  JSX are PROHIBITED unless they are proper nouns or brand names.
- RTL layout MUST be verified for every new component. Use `dir` prop or conditional
  Tailwind `rtl:` variants where needed.

### XI. Editorial Joy Design System (The "No-Line" Rule)

All UI MUST conform to the "Editorial Joy" aesthetic. Violations block PR merge.

#### Typography
- Primary font: **Plus Jakarta Sans** (English), **Cairo** (Arabic).
- Display heading: `text-4xl` – `text-6xl`, `font-bold` or `font-black`.
- Asymmetric layout energy: images and elements placed slightly off-center or
  overlapping container edges are encouraged.

#### Colour Tokens (Tailwind class → hex)

| Token | Tailwind Class | Hex | Usage |
|-------|---------------|-----|-------|
| Primary | `text-primary` / `bg-primary` | `#b5161e` | HIGH-PRIORITY CTAs ONLY |
| Secondary | `text-secondary` / `bg-secondary` | `#005caa` | Navigation, structural elements |
| Tertiary | `text-tertiary` | `#755700` | Ratings, "Learn More" links, magic moments |
| Surface | `bg-surface` | `#f6f6f6` | Page background |
| Surface Low | `bg-surface-container-low` | `#f0f1f1` | Card backgrounds |
| Surface Lowest | `bg-surface-container-lowest` | `#ffffff` | Floating elements |
| On-Surface | `text-on-surface` | `#2d2f2f` | Body text |
| Outline Variant | `border-outline-variant` | `#acadad` | Ghost borders only |
| Emerald | `text-emerald` / `bg-emerald` | `#10b981` | Zoo section ONLY, success states ONLY |

#### The "No-Line" Rule
1px solid borders and divider lines are **FORBIDDEN**. Define boundaries through
background color shifts (Tonal Layering: `surface` → `surface-container-low` →
`surface-container-lowest`).

#### Shadows
ONLY use highly diffused ambient shadows:
- Tailwind: `shadow-ambient` (custom token: `0 20px 40px 0 rgba(45,47,47,0.05)`)
- Hard shadows (`shadow-sm`, `shadow`, etc.) are PROHIBITED.
- If an element must float: blur ≥ 40px, opacity 4–6%, tinted `#2d2f2f`.

#### Ghost Borders (accessibility fallback only)
`border border-outline-variant/10` — used only when a border is required for
accessibility contrast. Never decorative.

#### Glassmorphism
`className="glassmorphism"` (Tailwind plugin: `backdrop-blur-[20px]`,
`bg-white/80`) — used for the Header nav and floating overlays (ticket summaries,
weather widgets). Do not apply to cards.

#### CTA Button Gradient
Primary buttons MUST use the `EditorialButton` component with `variant="primary"`,
which applies a `#b5161e` → `#ff766d` linear gradient.

#### Roundedness
All cards, buttons, chips, and inputs MUST use `rounded-xl` or `rounded-full`.
Angular corners (`rounded-none`, `rounded-sm`) are PROHIBITED.

#### Magic Pass Signature
The Ticket / Pass card MUST use a vertical gradient from `secondary` to
`secondary_dim` with a `glassmorphism` overlay. See `src/features/tickets/components/PassCard.tsx`
as the reference implementation.

### XII. Framer Motion for Interaction

Interactive elements and scrollytelling animations MUST use `framer-motion`.

- Use `motion.div` (or any `motion.*` element) for animated containers.
- Scroll-driven animations MUST use `useScroll` + `useTransform`.
- Active nav link indicator MUST use `layoutId="header-active-link"` with spring
  transition: `{ type: "spring", stiffness: 380, damping: 30 }`.
- Static elements that will never animate do NOT need `motion.*`.
- `animate-spin` (Tailwind) is permitted for loading spinners only.
- Heavy 3D scenes MUST use React Three Fiber (`@react-three/fiber`,
  `@react-three/drei`) — not Canvas directly.

---

## Part 5 — Naming & File Conventions

- **Page files**: `page.tsx` (Next.js App Router convention).
- **Component files**: PascalCase `.tsx` (e.g. `HeroPortal.tsx`, `PassCard.tsx`).
- **Utility / helper files**: camelCase `.ts` (e.g. `catchAsync.js`, `appError.js`).
- **Backend route files**: camelCase suffixed with `Routes.js` (e.g. `heroRoutes.js`).
- **Backend controller files**: camelCase suffixed with `Controller.js`.
- **Backend model files**: PascalCase (e.g. `Attraction.js`, `User.js`).
- **Redux slice files**: camelCase suffixed with `Slice.ts` or `Api.ts`.
- **Barrel exports**: Every feature folder MUST expose a root `index.ts`.
- **TypeScript**: Frontend MUST use TypeScript (`.ts` / `.tsx`). Backend uses
  plain JS (`.js`) with ES Modules. Do NOT mix `.mjs`/`.cjs` extensions.

---

## Part 6 — Tech Stack & Dependency Policy

### Backend
- **Runtime**: Node.js LTS
- **Framework**: Express.js
- **Database**: MongoDB via Mongoose (ODM)
- **Auth**: `jsonwebtoken` (JWT), `bcryptjs` (password hashing)
- **Upload**: Multer + Cloudinary SDK (via `uploadMiddleware.js`)
- **Docs**: Swagger UI Express (`/api-docs`)
- **Error utils**: `AppError` class + `catchAsync` wrapper

### Frontend
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS (configured in `tailwind.config.ts` — extend tokens only)
- **Animations**: Framer Motion (motion primitives, scroll hooks)
- **3D**: React Three Fiber + `@react-three/drei`
- **State**: Redux Toolkit + RTK Query
- **i18n**: `next-intl`
- **Font**: `next/font/google` (Plus Jakarta Sans, Cairo, IBM Plex Sans Arabic)
- **Icons**: `lucide-react`
- **Utilities**: `tailwind-merge`, `clsx`

### Shared Constraint
- **Image CDN**: Cloudinary — all uploaded images stored as URLs in MongoDB.
- **CORS**: Backend MUST configure `cors({ origin: process.env.CLIENT_ORIGIN })`.
  Frontend origin `http://localhost:3000` is the development default.
- **New dependencies**: MUST be justified by a documented need and reviewed in the
  spec/plan before installation. Prefer existing packages over new ones.

---

## Part 7 — Governance

- This constitution supersedes `rules.md`, `backend-instructions.md`, and all
  informal verbal practices.
- **Amendments** require:
  1. A documented rationale describing the problem being solved.
  2. A version bump following semantic versioning (MAJOR / MINOR / PATCH).
  3. A propagation check across all `.specify/templates/` files.
  4. An update to the Route Registry table (Part 2) or Route Map table (Part 4,
     Principle VIII) if the amendment affects routing.
- All feature **plans** MUST include a **Constitution Check** section confirming
  compliance with all applicable principles before implementation begins.
- Any intentional deviation from a principle MUST be recorded in the plan's
  **Complexity Tracking** table with a justification.
- **Compliance** is reviewed at PR merge time; non-compliant PRs MUST NOT be merged.
- **Ratification Date**: 2026-04-24 (original) | **Last Amended**: 2026-05-23
