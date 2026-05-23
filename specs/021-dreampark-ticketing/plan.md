# Implementation Plan: 3-Step Ticketing, Verification, and Pricing System for Dream Park

**Branch**: `021-dreampark-ticketing` | **Date**: 2026-05-22 | **Spec**: [/specs/021-dreampark-ticketing/spec.md](file:///D:/projects/DreamPark/specs/021-dreampark-ticketing/spec.md)
**Input**: Feature specification from `/specs/021-dreampark-ticketing/spec.md`

## Summary

The primary objective is to implement a highly refined 3-Step Ticketing, Verification, and Pricing System for "Dream Park" following the strictly defined **MERN Stack** (using Node.js, Express, React, and MongoDB/Mongoose) with standard JWT-based Role-Based Access Control (`USER`, `MARKETING_AGENT`, `ADMIN`) and Next.js frontend consumer app (`my-app`). 

The UI must adhere strictly to the "Editorial Joy" design system (Plus Jakarta Sans font, high roundedness, glassmorphic floating widgets, tonal layering backgrounds, absolutely no 1px borders, and fluid layout animations using Framer Motion).

We will extend the existing Express backend and Next.js frontend to complete this system.

## Technical Context

**Language/Version**: Node.js (LTS), TypeScript (Frontend), ES Modules (Backend)  
**Primary Dependencies**: Express.js, Mongoose, React.js, Tailwind CSS, Framer Motion, JWT, `html5-qrcode`, `qrcode.react`  
**Storage**: MongoDB (Mongoose ODM)  
**Testing**: central REST API integration testing, Jest/React Testing Library  
**Target Platform**: Node.js back-end and Next.js/React front-end  
**Project Type**: Multi-tier Web Application (`BackEnd` API + `my-app` Frontend)  
**Performance Goals**: <5s QR code scanning, instant pricing updates  
**Constraints**: Zero 1px borders (strict compliance), Plus Jakarta Sans typography, HSL/harmonious colors  
**Scale/Scope**: ~4 main dashboard components, ~3 REST endpoints, ~3 Mongoose schemas  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|---|---|---|
| **I. Modular Controller-Route-Model Architecture** | DB models in `src/models/`, controllers in `src/controllers/`, routes in `src/routes/`. | **PASSED** |
| **II. ES Modules Exclusively** | Entire Express backend uses `import`/`export` exclusively. | **PASSED** |
| **III. Consistent API Response Contract** | Standard `{ success: true, data: [...] }` and `{ success: false, error: ... }` only. Centralized error middleware used. | **PASSED** |
| **IV. Mandatory Error Handling in Controllers** | Centralized `try-catch` blocks and forwarding errors to `next(err)` implemented. | **PASSED** |
| **V. Relational populate standard** | Using Mongoose `.populate()` for User ↔ TicketType relational lookups in Bookings. | **PASSED** |

## Project Structure

### Documentation (this feature)

```text
specs/021-dreampark-ticketing/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API definitions)
└── checklists/
    └── requirements.md  # Specification Quality Checklist
```

### Source Code (repository root)

```text
BackEnd/
└── src/
    ├── models/
    │   ├── User.js              # Modify roles enum
    │   ├── TicketType.js        # Modify fields (category, icon, color, description as string array)
    │   └── Booking.js           # Modify fields (add quantity, phoneNumber, align qrCodeId/qrCodeValue)
    ├── controllers/
    │   └── ticketingController.js # Add/refine controller handlers
    └── routes/
        └── ticketingRoutes.js   # Protect routes with JWT and appropriate roles

my-app/
└── src/
    └── components/              # Brand-new premium React client components
        ├── BookingFlow.jsx      # Multi-step booking widget with Framer Motion
        ├── UserDashboard.jsx    # Magic Pass active bookings display
        ├── AgentScanner.jsx     # Marketing Agent scanner dashboard with html5-qrcode
        └── AdminPricing.jsx     # Borderless inline edit board for Admin
```

**Structure Decision**: A multi-tier web application split between `BackEnd/` for the Express REST server and `my-app/` for the Next.js React frontend. All backend logic strictly modularized per constitution.

## Complexity Tracking

> *No current constitutional violations or compromises are flagged.*

| Component | Difficulty | Mitigation Strategy |
|---|---|---|
| **QR Code Verification** | Medium | Utilize standard `html5-qrcode` on the web interface with proper camera state management and clear visual success/error states. |
| **No-Line Layouts** | High | Strictly enforce tonal backgrounds (#f6f6f6, #f0f1f1, #ffffff) and deep blurred shadows (`shadow-ambient` / shadow tinted with #2d2f2f, blur 40px+) instead of standard borders. |
