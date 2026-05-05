# Implementation Plan: Attractions Localization and Pagination

**Branch**: `015-attractions-loc-page` | **Date**: 2026-05-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/015-attractions-loc-page/spec.md`

## Summary

The goal is to update the existing Attractions API to support localization (Arabic and English) and categorization via `pageKey`, while also introducing pagination and sorting capabilities. This will mimic the structural approach used in the Hero section endpoints, allowing the frontend to easily fetch, sort, and paginate localized content. The data model will be updated to a single document with embedded language fields for efficient queries.

## Technical Context

**Language/Version**: Node.js (ES Modules)
**Primary Dependencies**: Express.js, Mongoose
**Storage**: MongoDB
**Testing**: N/A (Standard manual API verification)
**Target Platform**: Node.js Backend API
**Project Type**: Web Service / API Endpoint
**Performance Goals**: API response time < 200ms for paginated requests
**Constraints**: Must strictly follow the `{ "success": true/false }` API response contract
**Scale/Scope**: Adding localization, pagination, and sorting to existing Attraction collection

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Modular Controller-Route-Model Architecture**: Yes. All logic will reside in `attractionController.js`, routing in `attractionRoutes.js`, and schema definitions in `Attraction` model.
- **II. ES Modules Exclusively**: Yes. We will use `import`/`export`.
- **III. Consistent API Response Contract**: Yes. Paginated responses will follow `{ "success": true, "data": [...], "pagination": {...} }`.
- **IV. Mandatory Error Handling in Controllers**: Yes. All controller functions will use `try-catch` blocks passing errors to `next(err)`.
- **V. Dynamic Content via `pageKey` Strategy**: Yes. Attractions will utilize the `pageKey` field for categorization.

## Project Structure

### Documentation (this feature)

```text
specs/015-attractions-loc-page/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md (To be generated later)
```

### Source Code (repository root)

```text
BackEnd/
├── src/
│   ├── models/
│   │   └── attractionModel.js
│   ├── controllers/
│   │   └── attractionController.js
│   └── routes/
│       └── attractionRoutes.js
```

**Structure Decision**: We will modify the existing `attractionModel.js`, `attractionController.js`, and `attractionRoutes.js` within the backend service to implement the requested features.
