# Phase 0: Research & Technical Decisions

**Feature**: Game Card Integration (018)
**Date**: 2026-05-16

## Technical Context Evaluation

This feature acts as a refactor/pivot from the previous Game Details Page feature (`017`), specifically changing the data sourcing strategy to use the pre-existing `Attraction` model and endpoints.

### Decision 1: API Endpoint and Routing Strategy
- **Decision**: Frontend will use `GET /api/attractions/[id]` to fetch details when navigating to `/[locale]/games/[id]`. 
- **Rationale**: The user explicitly requested using `http://localhost:5000/api/attractions/[id]`. This endpoint already exists and serves the `Attraction` model, meaning we do not need a separate `Game` model or controller on the backend, ensuring closer adherence to the Constitution's `pageKey` and unified attraction structures.
- **Alternatives considered**: Keeping the dedicated `/api/games/` endpoint. Rejected because the user specifically provided the existing `attractions` endpoint.

### Decision 2: UI Data Mapping
- **Decision**: The rich UI components (`GameHero`, `BookingPanel`, etc.) will be adapted to consume the flatter `Attraction` data shape. Missing fields (like complex engineering specs) will be omitted or mapped from existing fields (e.g., `waitingTime`, `minHeight`, `isFastTrack`).
- **Rationale**: Matches the user's requirement to use existing data while maintaining the premium design.

### Decision 3: Frontend Refactoring
- **Decision**: We will repurpose the existing `my-app/app/[locale]/games/[slug]` route by renaming the parameter to `[id]` and updating the API call. The components in `src/features/games/components/` will be updated to accept `Attraction` types instead of the custom `Game` type.
- **Rationale**: Reuses the work done in the previous step but aligns it with the new requirements.
