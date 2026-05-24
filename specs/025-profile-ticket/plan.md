# Implementation Plan: Complete Profile Page & Ticket Management

**Branch**: `025-profile-ticket` | **Date**: 2026-05-24 | **Spec**: [spec.md](file:///D:/projects/DreamPark/specs/025-profile-ticket/spec.md)
**Input**: Feature specification from `/specs/025-profile-ticket/spec.md`

## Summary

This feature implements the complete bilingual (English/Arabic) User Profile and scannable Ticket Management dashboard. The UI adheres to the "Editorial Joy" design system (specifically enforcing the "No-Line" background shift rule, Cairo/Plus Jakarta typography, ambient shadows, and dynamic RTL alignment). The technical solution involves:
1. Expanding the database `Booking` model status enum in the backend to support the full lifecycle (`PENDING_PAYMENT`, `PAID`, `USED`, `EXPIRED`, `CANCELLED`).
2. Implementing a secure date modification endpoint `PATCH /api/v1/bookings/:id/change-date` in the backend with route redirection/aliasing.
3. Adding a new `changeBookingDate` RTK Mutation in the frontend Redux bookings slice.
4. Redesigning the frontend ticket list to display 3 localized tabs (Upcoming, Past, Cancelled) and rendering a floating details modal with dynamic client-side PNG downloads from a `QRCodeCanvas` for perfect offline scanning at the gate.

## Technical Context

**Language/Version**: Node.js v18+, TypeScript v5+, ES Modules (Backend)  
**Primary Dependencies**: `next-intl`, `qrcode.react`, `@reduxjs/toolkit`, `framer-motion`, `date-fns`, `lucide-react`, `express`, `mongoose`  
**Storage**: MongoDB via Mongoose (Mongoose Booking model)  
**Testing**: Jest + Supertest (Backend router tests), React Testing Library (Frontend component verification)  
**Target Platform**: Responsive Web browsers (Mobile viewport and Desktop)  
**Project Type**: Full-stack Next.js App Router Frontend + Express.js Backend  
**Performance Goals**: API response latency < 150ms, QR modal load & download creation < 100ms  
**Constraints**: Arabic RTL text alignment, strict compliance with "No-Line" boundary layout design, scannable offline PNG fallback check  
**Scale/Scope**: Interactive user profile dashboard, handles large volumes of booking cards gracefully

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### 1. Backend Architecture Gates
* **Principle I (Modular controller-route-model)**: Checked. Date change functionality is implemented cleanly in `ticketingController.js` and registered in `ticketingRoutes.js`.
* **Principle III (Mandatory catchAsync)**: Checked. The new change-date controller function is wrapped in the backend `catchAsync` utility.
* **Principle IV (API Response Contract)**: Checked. The success responses return exactly `{ success: true, data: { ... } }`, and errors return `{ success: false, error: "message" }` through `AppError`.

### 2. Frontend Visual & i18n Gates
* **Principle VII (Feature Folder Architecture)**: Checked. Frontend UI changes reside in features `auth` and `tickets`, and shared components remain in `components/ui`.
* **Principle X (i18n Contract)**: Checked. The profile page and modal use standard `next-intl` namespaces. Hardcoded string values are eliminated. Native RTL alignment support is fully configured for the Arabic language locale.
* **Principle XI (Editorial Joy Design / The "No-Line" Rule)**: Checked. Hard boundaries and 1px borders are eliminated from card and modal designs. Card sections and detail cards distinguish themselves via shifting background colors (`surface` `#f6f6f6`, `surface-container-low` `#f0f1f1`, `surface-container-lowest` `#ffffff`). All CTA actions use `EditorialButton` with the red gradient. Floating modal elements employ `shadow-ambient` (blur $\ge$ 40px, opacity 4-6%).
* **Principle XII (Framer Motion)**: Checked. Moving between tabs is animated smoothly using `framer-motion`'s `layoutId` component transitions.

## Project Structure

### Documentation (this feature)

```text
specs/025-profile-ticket/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── booking-api.md   # Phase 1 output
└── checklists/
    └── requirements.md  # Specification Quality Checklist
```

### Source Code (repository root)

```text
BackEnd/
├── src/
│   ├── app.js                         # [MODIFY] Mount /api/v1/bookings redirect to ticketingRoutes
│   ├── controllers/
│   │   └── ticketingController.js    # [MODIFY] Implement changeBookingDate, update getUserBookings
│   ├── models/
│   │   └── Booking.js                 # [MODIFY] Expand status enum values
│   └── routes/
│       └── ticketingRoutes.js         # [MODIFY] Register PATCH /bookings/:id/change-date, JSDoc
│
my-app/
├── messages/
│   ├── en.json                        # [MODIFY] Profile tabs, change date, download modal labels
│   └── ar.json                        # [MODIFY] Matching Arabic localized messages
├── src/
│   ├── components/
│   │   └── ui/
│   │       └── BookingQrCard.tsx      # [MODIFY] Adapt info layout, make into details modal trigger
│   ├── features/
│   │   └── auth/
│   │       └── components/
│   │           └── UserProfile.tsx    # [MODIFY] Add tabs navigation, next-intl translations, datepicker integration
│   └── lib/
│       └── features/
│           └── api/
│               └── bookingsApi.ts     # [MODIFY] Add changeBookingDate RTK Query Mutation, update types
```

**Structure Decision**: Standard web-application structure separating the `BackEnd/` API and the Next.js `my-app/` App Router layout.

## Complexity Tracking

*No current violations. The implementation strictly complies with all backend, frontend, and design system principles.*

