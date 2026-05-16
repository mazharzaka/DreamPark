# Implementation Plan: Game Card Integration

**Branch**: `018-game-card-integration` | **Date**: 2026-05-16 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/018-game-card-integration/spec.md`

## Summary

Refactor the Game Details Page to source data from the existing `GET /api/attractions/[id]` endpoint rather than the previously planned `/api/games/:locale/:slug` endpoint. This simplifies the backend architecture by reusing the `Attraction` Mongoose model. The frontend UI will be updated to map this existing flat data structure to the premium design components (Hero, Booking Panel), omitting complex nested fields that are no longer supported by the schema.

## Technical Context

**Language/Version**: TypeScript, Node.js LTS  
**Primary Dependencies**: Next.js App Router, Tailwind CSS, Framer Motion, next-intl  
**Storage**: MongoDB via Mongoose (Existing `Attraction` collection)  
**Testing**: Jest / Playwright (standard)  
**Target Platform**: Web Browser (Mobile, Tablet, Desktop)
**Project Type**: Web application (Frontend + Backend API)  
**Performance Goals**: Fast SSR loading, smooth animations  
**Constraints**: UI must match the provided reference design while adapting to the limited data schema.  
**Scale/Scope**: Impacts the dynamic routing structure (`/[locale]/games/[id]`) and data fetching logic.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Modular Controller-Route-Model Architecture**: Yes, reusing existing `attractionController.js` and `Attraction.js`.
- [x] **II. ES Modules Exclusively**: Yes.
- [x] **III. Consistent API Response Contract**: Yes, `getAttractionById` already adheres to `{ success: true, data: ... }`.
- [x] **IV. Mandatory Error Handling in Controllers**: Yes.
- [x] **V. Dynamic Content via `pageKey` Strategy**: Yes, this better aligns with the Constitution by treating games as attractions within the unified collection, rather than creating a fragmented `Game` collection.

## Project Structure

### Documentation (this feature)

```text
specs/018-game-card-integration/
├── plan.md              
├── research.md          
├── data-model.md        
├── quickstart.md        
├── contracts/           
└── tasks.md             
```

### Source Code (repository root)

```text
my-app/
├── app/
│   └── [locale]/
│       └── games/
│           └── [id]/
│               └── page.tsx
└── src/
    ├── features/
    │   └── games/
    │       └── components/
    │           ├── GameHero.tsx (Updated)
    │           ├── BookingPanel.tsx (Updated)
    │           └── ...
    └── types/
        └── attraction.ts (Updated mapping)
```

**Structure Decision**: Web application (Option 2). The backend requires zero or minimal changes. The work is entirely focused on the frontend `my-app` directory.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None      | N/A        | N/A                                 |
