# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

The Games page currently uses mock data. This feature integrates the frontend with the backend API (`/api/attractions/{locale}/home`) to fetch live localized games data. It implements server-side filtering via a `category` query parameter, ensuring the filter bar is dynamically populated from the unique categories returned by the backend. Error handling and loading states will be implemented to ensure a premium user experience.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Node.js (LTS), TypeScript, Next.js 16 (Frontend), Express.js (Backend)  
**Primary Dependencies**: `next-intl` (localization), `lucide-react` (icons), `RTK Query` (data fetching)  
**Storage**: MongoDB via Mongoose  
**Testing**: Vitest / Playwright (standard for this project)  
**Target Platform**: Modern Web Browsers  
**Project Type**: Web Application (Fullstack)  
**Performance Goals**: <3s initial load, <2s filter response (SC-001, SC-002)  
**Constraints**: No client-side filtering; every category change must hit the backend (FR-007)  
**Scale/Scope**: Single page integration with existing backend endpoint

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Modular Architecture | ✅ Pass | Integration follows existing `features/games` structure on frontend and `controllers/routes/models` on backend. |
| II. ES Modules | ✅ Pass | Both frontend and backend use ES Modules. |
| III. Consistent API Contract | ✅ Pass | Backend uses `{ success: true, data: [...] }` format. |
| IV. Error Handling | ✅ Pass | Controllers use `try-catch` and forward to `next(err)`. |
| V. Dynamic Content (pageKey) | ✅ Pass | Attractions are stored with appropriate classifiers; images are Cloudinary URLs. |

## Project Structure

### Documentation (this feature)

```text
specs/016-games-api-integration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code

```text
my-app/
├── app/[locale]/games/
│   └── page.tsx         # Main UI page
└── src/features/games/
    ├── components/      # UI components (Grid, Filter)
    ├── services/        # RTK Query api slice
    └── types.ts         # Data types

BackEnd/
└── src/
    ├── controllers/
    │   └── attractionController.js  # Backend filtering logic
    ├── routes/
    │   └── attractionRoutes.js      # Endpoint definition
    └── models/
        └── Attraction.js            # Schema definition
```

**Structure Decision**: Using the existing feature-based structure in `my-app` and the established `controller-route-model` architecture in `BackEnd`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
