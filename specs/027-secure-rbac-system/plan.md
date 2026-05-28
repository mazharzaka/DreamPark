# Implementation Plan: Secure RBAC & Box-Office System

**Branch**: `027-secure-rbac-system` | **Date**: 2026-05-28 | **Spec**: [spec.md](file:///D:/projects/DreamPark/specs/027-secure-rbac-system/spec.md)
**Input**: Feature specification from `/specs/027-secure-rbac-system/spec.md`

## Summary
Implement a production-grade, highly secure Role-Based Access Control (RBAC) system for Dream Park. The backend (Node.js/Express) protects core gate operations via atomic status locking (`PENDING_PAYMENT` -> `SCANNING` -> `PAID`), server-side clock comparisons to prevent ticket date-spoofing, and automatic append-only audit logging of all scan attempts. Client sessions are secured via short-lived in-memory access tokens with a silent HTTP-only refresh cookie flow. The frontend (Next.js 14) implements route protection guards, navigational menu dynamic filtering, a robust offline-capable scanner interface with instant video stream freeze, and an Editorial Joy-compliant ticket pricing dashboard.

## Technical Context

**Language/Version**: Node.js v20 (Backend: Plain JavaScript with ES Modules), TypeScript 5 (Frontend)  
**Primary Dependencies**: Next.js 14 (App Router), `jsonwebtoken`, `bcryptjs`, Mongoose, `lucide-react`, `framer-motion`  
**Storage**: MongoDB (Mongoose schemas)  
**Testing**: Jest + Supertest (Backend), React Testing Library (Frontend)  
**Target Platform**: Node.js LTS, Modern Web Browsers (Chrome, Safari, Firefox)  
**Project Type**: Full-Stack Web Application (Express API + Next.js SPA)  
**Performance Goals**: Concurrent scan resolution < 100ms, JWT validation overhead < 5ms  
**Constraints**: Zero 1px borders (strict "No-Line" rule), HSL/Tonal UI layering, Arabic-first localization for scanner  
**Scale/Scope**: 4 Roles (`USER`, `MARKETING_AGENT`, `FINANCIAL_MANAGER`, `ADMIN`), 1 Gate Audit Log entity  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Modular Architecture)**: ✅ Enforced. We follow Route -> Middleware (`authMiddleware.js`) -> Controller -> Model design exactly.
- **Principle II (ES Modules Backend)**: ✅ Enforced. All new files utilize ES `import`/`export`.
- **Principle III (catchAsync)**: ✅ Enforced. All controllers use the central async error wrapper.
- **Principle IV (API Response Contract)**: ✅ Enforced. All endpoints return the standardized `{ success, data }` or `{ success, error }` envelopes.
- **Principle VI (RBAC)**: ✅ Enforced. We support the canonical uppercase role names (`USER`, `MARKETING_AGENT`, `FINANCIAL_MANAGER`, `ADMIN`) and enforce normalisation inside `authMiddleware.js`.
- **Principle XI (Editorial Joy Design System)**: ✅ Enforced. Inputs utilize rounded-xl, background tonal shifts (`surface` -> `surface-low` -> `surface-lowest`), and zero 1px borders.
- **Principle XIII (Hydration Safety)**: ✅ Enforced. Scanner uses client-side mounting checks to prevent server/client rendering mismatches on device network indicators and camera stream initialization.

---

## Project Structure

### Documentation (this feature)

```text
specs/027-secure-rbac-system/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           
│   └── endpoints.md     # Phase 1 contract definition
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code

```text
BackEnd/
├── src/
│   ├── models/
│   │   ├── Booking.js          # (Status & lock field additions)
│   │   └── ScanAuditLog.js     # (New append-only collection)
│   ├── controllers/
│   │   ├── authController.js   # (Login payload & secure cookie logic)
│   │   └── bookingController.js# (Atomic lock, cancel, confirm scan endpoints)
│   ├── middlewares/
│   │   └── authMiddleware.js   # (JWT extract & restrictTo RBAC middleware)
│   └── routes/
│       ├── authRoutes.js       # (Refresh & login mount)
│       └── ticketingRoutes.js  # (Verify scan, confirm, and cancel routes)
│
my-app/
├── src/
│   ├── lib/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── AuthContext.tsx  # (In-memory access token & silent refresh)
│   │   │   │   └── ProtectedRoute.tsx# (Role-enforcing guard component)
│   │   │   └── api/
│   │   │       └── bookingsApi.ts   # (RTK Query endpoint additions)
│   ├── features/
│   │   ├── portal/
│   │   │   └── components/
│   │   │       └── Navigation.tsx   # (Role-filtered visual link omission)
│   │   └── scanner/
│   │       └── components/
│   │           └── AgentScanner.tsx  # (Offline warning, checkmark reset, camera freeze)
│   └── components/
│       └── ui/
│           └── ForbiddenScreen.tsx  # (Animated Joyful 403 Page)
```

**Structure Decision**: Web application option followed. Changes map seamlessly to the established Next.js frontend (`my-app/`) and Node.js backend (`BackEnd/`).

---

## Complexity Tracking

> **No violations of the project constitution are introduced. Simplicity and strict compliance are maintained.**
