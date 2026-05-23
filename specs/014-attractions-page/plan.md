# Implementation Plan: Attractions Page

**Branch**: `014-attractions-page` | **Date**: 2026-05-02 | **Spec**: [spec.md](./spec.md)

## Summary

Implement a categorized Attractions page (Games/Animals) for the DreamPark portal. The page will feature interactive cards with colored overlays, smooth animations, and client-side pagination. It will consume existing API endpoints via RTK Query and provide a stub detail page for each attraction.

## Technical Context

**Language/Version**: TypeScript / Next.js 16 (App Router) / React 18  
**Primary Dependencies**: `@reduxjs/toolkit` (RTK Query), `framer-motion`, `lucide-react`, `next-intl`  
**Storage**: Redux State / Backend API  
**Testing**: Browser-based verification  
**Target Platform**: Web (Responsive: Desktop 3 columns, Tablet 2, Mobile 1)
**Project Type**: Web Application Frontend (`my-app` directory)  
**Performance Goals**: < 1s tab switching, smooth grid animations  
**Constraints**: RTL/LTR support via next-intl, client-side pagination for 8 items/page  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Modular Architecture**: Frontend components will follow the feature-based structure (`src/features/portal/components`).
- **ES Modules**: Mandatory throughout.
- **Consistent API Response Contract**: Handled by RTK Query hooks mapping to `{ success, data }`.
- **Mandatory Error Handling**: Centralized handling in RTK Query and local error states in components.
- **Dynamic Content via pageKey**: The attractions page will fetch all items and filter them client-side by category.

## Project Structure

### Documentation (this feature)

```text
specs/014-attractions-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── quickstart.md        # Phase 1 output
```

### Source Code (repository root)

```text
my-app/
├── src/
│   ├── app/
│   │   └── [locale]/
│   │       └── attractions/
│   │           ├── page.tsx
│   │           └── [id]/
│   │               └── page.tsx (stub)
│   └── features/
│       └── portal/
│           ├── components/
│           │   ├── AttractionGrid.tsx
│           │   ├── AttractionCard.tsx
│           │   ├── CategoryTabs.tsx
│           │   └── Pagination.tsx
│           └── api/
│               └── attractionsApi.ts (extension of base apiSlice)
```

**Structure Decision**: Using a feature-based structure for portal components to ensure reusability and isolation. RTK Query endpoints will be added to a dedicated `attractionsApi` file to maintain clean code.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Client-side Pagination | API currently doesn't support pagination | Server-side pagination would require backend changes out of scope |
