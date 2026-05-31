# Implementation Plan: Dynamic Heroes and Merch API Integration

**Branch**: `028-heroes-merch-api` | **Date**: 2026-05-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/028-heroes-merch-api/spec.md`

## Summary

This feature transitions the main portal's featured slides (`OurHeroesSlider`) and merchandise listings (`Merch`) from static mock arrays to dynamic API data fetched via Redux Toolkit's RTK Query `useGetAttractionsQuery` hook, targeting the Attractions endpoint `/api/attractions/:lang/:pageKey` (where `pageKey` represents the section/page name, e.g. `dopy` and `merch`). We will implement a clean client-side mounting guard (`mounted` state toggle) to guarantee 100% hydration safety in Next.js, and integrate the `OurHeroesSlider` on the zoo animals page using RTK Query `useGetAttractionsQuery`.

## Technical Context

**Language/Version**: Next.js 14 (TypeScript), Node.js (ES Modules)  
**Primary Dependencies**: React (useState, useEffect), Redux Toolkit + RTK Query, Swiper, Lucide React  
**Storage**: MongoDB via Mongoose  
**Testing**: Local component testing & compilation checks  
**Target Platform**: Web browsers (Arabic/English locales)  
**Project Type**: Full-stack Web Application  
**Performance Goals**: API response and render in under 1 second  
**Constraints**: Follow the "No-Line" rule, diff-shadows only, full hydration compatibility, and strict LTR/RTL support.  
**Scale/Scope**: Refactoring 2 components, adding 1 Express endpoint, and editing 2 pages.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Part 1, II (ES Modules)**: Backend files MUST use ES Modules (`import`/`export`) only. (PASSED)
- **Part 1, IV (API Response Contract)**: The new endpoint `/api/services` MUST return the strict `{ success: true, data: { ... } }` envelope. (PASSED)
- **Part 1, III (Mandatory catchAsync)**: The controller function MUST be wrapped in `catchAsync`. (PASSED)
- **Part 4, XI (No-Line Rule)**: No 1px borders. Layered background shifts and diffused shadows only. (PASSED)
- **Part 4, XIII (Hydration Safety)**: Must guard all client-side dynamic fetching and mounts with a local `mounted` toggle. (PASSED)

## Project Structure

### Documentation (this feature)

```text
specs/028-heroes-merch-api/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output: API & Hydration research
├── data-model.md        # Phase 1 output: Data contracts & Mongoose queries
├── quickstart.md        # Phase 1 output: Server endpoints quickstart
├── contracts/           # Phase 1 output: API Request/Response schemas
└── tasks.md             # Phase 2 output: Actionable tasks checklist
```

### Source Code (repository root)

```text
BackEnd/src/
└── scripts/
    └── seedHeroesAndMerch.js # [NEW] Seeding script for dopy and merch attractions

my-app/
├── app/[locale]/zoo/animals/
│   └── page.tsx              # [MODIFY] Integrate OurHeroesSlider with RTK Query
├── src/features/portal/components/
│   ├── OurHeroesSlider.tsx   # [MODIFY] Fetch from /api/services, add loading/error state
│   ├── Merch.tsx             # [MODIFY] Fetch from /api/services, add loading/error state
│   └── HeroPortal.tsx        # [MODIFY] Keep signatures matching new dynamics
```

**Structure Decision**: Fully structured multi-project system (React frontend + Express backend).
