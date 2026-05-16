# Phase 0: Research & Technical Decisions

**Feature**: Game Terms and Conditions (019)
**Date**: 2026-05-16

## Technical Context Evaluation

This feature requires rendering a new section on the Game Details page (`app/[locale]/games/[id]/page.tsx`) that displays terms and conditions populated from the existing `tags` array on the `Attraction` Mongoose model.

### Decision 1: UI Component Architecture
- **Decision**: Create a new component `TermsAndConditions.tsx` in `my-app/src/features/games/components/`.
- **Rationale**: Keeps `page.tsx` clean and maintains the separation of concerns established by the previous features (`GameHero`, `BookingPanel`).

### Decision 2: Data Handling
- **Decision**: No backend changes are required. The Next.js frontend will receive the `tags` array (`{ label: string; variant: string }[]`) from the existing API and iterate through it. If `tags` is undefined or empty, the component will return `null`.
- **Rationale**: The user explicitly requested to use the existing `tags` endpoint key. This requires zero backend modifications.

### Decision 3: Localization Strategy
- **Decision**: The section title ("Terms and Conditions" / "الشروط والأحكام") will be localized based on the Next.js `locale` prop passed to the component. The actual `tags.label` content will be rendered as-is from the DB.
- **Rationale**: The `tags` schema in MongoDB is not currently structured with separate `en` and `ar` fields. We will render whatever string is stored in the database.
