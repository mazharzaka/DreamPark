# Implementation Plan: Agent Scanner Overlay & Shift Summary Refactoring

**Branch**: `030-agent-scanner-refactor` | **Date**: 2026-05-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/030-agent-scanner-refactor/spec.md`

## Summary

This feature involves a complete refactoring of the Gate Agent Scanner component (`AgentScanner.tsx`) to integrate:
1. **Camera Pause Logic** to prevent duplicate scans via a ref check.
2. **A floating glassmorphic bottom sheet** showing scan success details in Arabic.
3. **A soft crimson error overlay** for scan failure display.
4. **A floating Shift Report Summary panel** in the top-corner with real-time optimistic cash tracking and shift closing capability.
5. **Strict Editorial Joy styling alignment** (no 1px borders, high roundedness, tonal layering of `#f6f6f6` to `#ffffff`, and massive padding).

## Technical Context

- **Language/Version**: React 18 / Next.js 14 App Router, TypeScript
- **Primary Dependencies**: `framer-motion`, `@yudiel/react-qr-scanner`, `lucide-react`, Redux Toolkit (RTK Query)
- **Storage**: Browser LocalStorage (for shift stats persistence across scans and refreshes)
- **Testing**: Manual verification, camera scan testing
- **Target Platform**: Modern mobile/tablet/desktop browsers with camera permission
- **Project Type**: Web application frontend component
- **Performance Goals**: Instant bottom sheet animations (60 fps), 0ms optimistic shift updates
- **Constraints**: No 1px solid borders, only ambient tinted shadows, Arabic RTL support
- **Scale/Scope**: Refactoring a single core component: `AgentScanner.tsx`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Principle VII: Feature Folder Architecture** — The component lives in `src/features/scanner/components/AgentScanner.tsx`, which aligns perfectly with feature folders.
2. **Principle X: Internationalisation Contract** — The copy is strictly Arabic (RTL) for local gate agents, keeping standard styling.
3. **Principle XI: Editorial Joy Design System** — Enforce NO 1px borders. Use tonal transitions `#f6f6f6` (baseline surface) to `#ffffff` (components). Apply high roundedness (`rounded-3xl`, `rounded-full`). Use custom ambient shadow `shadow-[0_40px_80px_rgba(45,47,47,0.06)]`.
4. **Principle XII: Framer Motion for Interaction** — The bottom sheet and toggles use `framer-motion` spring transitions for fluid UX.

## Project Structure

### Documentation (this feature)

```text
specs/030-agent-scanner-refactor/
├── spec.md              # Feature specification
├── plan.md              # This file (implementation plan)
├── checklists/
│   └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

The target component to modify:
- [AgentScanner.tsx](file:///d:/bit68/DreamPark/my-app/src/features/scanner/components/AgentScanner.tsx)

## Complexity Tracking

*No constitution violations are introduced; layout strictly implements the required clean Tonal Layering.*
