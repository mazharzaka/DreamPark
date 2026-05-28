# Implementation Plan: Fix React Hydration Errors

**Branch**: `026-fix-hydration-errors` | **Date**: 2026-05-28 | **Spec**: [spec.md](file:///D:/projects/DreamPark/specs/026-fix-hydration-errors/spec.md)
**Input**: Feature specification from `/specs/026-fix-hydration-errors/spec.md`

## Summary

Eliminate React hydration mismatch warnings across the application. The primary technical approach involves:
1. **SplashScreen Particle Field**: Deferring the generation and rendering of random particle fields (which use `Math.random()`) to client-side mount, so the server-rendered HTML tree contains zero particle nodes and is perfectly consistent with the initial client tree.
2. **Bookings Date Formatting**: Implementing a client-side mounting toggle in the bookings history page, rendering an elegant, "Editorial Joy"-compliant loading skeleton during server-side pre-rendering and swapping it with the localized date string formatted using browser locales immediately upon client mount.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.4, Node.js LTS  
**Primary Dependencies**: Next.js 16.2.3 (App Router), Framer Motion 12.38.0, next-intl 4.9.1, Redux Toolkit 2.5.0  
**Storage**: N/A (Consumes existing backend API data via RTK Query)  
**Testing**: Manual browser DevTools console verification, Next.js build compilation (`npm run build`), ESLint verification (`npm run lint`)  
**Target Platform**: Web browsers, Node.js runtime  
**Project Type**: Web application  
**Performance Goals**: 0 console hydration warnings, dynamic client mount completed under 50ms, 60fps animations  
**Constraints**: strictly obey "Editorial Joy" design system, the "No-Line" rule, and use Plus Jakarta Sans and Cairo fonts  
**Scale/Scope**: Affects the initial landing portal loading experience and the user's booking history page

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle VII (Feature Folder Architecture)**: Compliance checked. The files affected are `my-app/app/[locale]/bookings/page.tsx` and `my-app/src/components/ui/SplashScreen.tsx` which are standard components and routing files already placed.
- **Principle X (Internationalisation Contract)**: Compliance checked. The bookings date will format using the correct active locale (`ar-EG` or `en-US`) retrieved via the translation/locale system post-mount.
- **Principle XI (Editorial Joy Design System / "No-Line" Rule)**: Compliance checked. No borders or divider lines are introduced. The bookings page date loader uses a highly rounded, elegant skeleton container with background color `#f0f1f1` (Tonal Layering: `surface-container-low`) and a smooth pulse animation.
- **Principle XII (Framer Motion)**: Compliance checked. The existing Framer Motion scroll and layout animations inside the splash screen and bookings page are fully preserved and initiate smoothly upon mount.

## Project Structure

### Documentation (this feature)

```text
specs/026-fix-hydration-errors/
├── spec.md              # Feature specification
├── plan.md              # This implementation plan
├── research.md          # Phase 0: Research findings on hydration fixes
├── data-model.md        # Phase 1: Minimal data contract documentation
├── quickstart.md        # Phase 1: Developer verification guide
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
my-app/
├── app/
│   └── [locale]/
│       └── bookings/
│           └── page.tsx        # Modifying date formatting with mounting check & skeleton
└── src/
    └── components/
        └── ui/
            └── SplashScreen.tsx # Deferring ParticleField generation to client mount
```

**Structure Decision**: Option 2 (Web application). All source changes are local to the frontend application `my-app/` using the specified paths above.

## Complexity Tracking

*No constitution violations or complex architectural workarounds are introduced.*
