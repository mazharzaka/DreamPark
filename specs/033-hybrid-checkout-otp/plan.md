# Implementation Plan: Hybrid Authentication and Ticket Booking Flow

**Branch**: `033-hybrid-checkout-otp` | **Date**: 2026-07-08 | **Spec**: [spec.md](file:///D:/bit68/DreamPark/specs/033-hybrid-checkout-otp/spec.md)
**Input**: Feature specification from `/specs/033-hybrid-checkout-otp/spec.md`

## Summary

Implement a unified checkout authentication modal inside the ticket booking flow. Visitors can check out using either a passwordless 6-digit OTP (creating a guest user profile on demand and logging in seamlessly) or traditional password credentials. Both paths return a standard authenticated JWT session.

---

## Technical Context

**Language/Version**: Next.js 14 (App Router), TypeScript 5, Node.js 20, ES Modules  
**Primary Dependencies**: React 18, React Hook Form, Mongoose, Express, jsonwebtoken, bcryptjs, Redux Toolkit, RTK Query, lucide-react, Cairo (Cairo / Plus Jakarta Sans fonts)  
**Storage**: MongoDB (via Mongoose ODM)  
**Testing**: Manual route validation + console OTP debugging  
**Target Platform**: Browser (Chrome/Firefox/Safari/Edge) & Node.js Server  
**Project Type**: Full-Stack Web Application (Next.js frontend + Express backend)  
**Performance Goals**: Instant client-side authentication mode toggling (<100ms), OTP validation returning session under 200ms  
**Constraints**: 5-minute OTP code expiration TTL, rate-limiting block (3 requests per 15 minutes, 1 minute cool-down)  
**Scale/Scope**: Theme Park MVP ticket booking interface  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Modular Architecture)**: Backend changes are strictly separated: Mongoose models under `models/`, Express controller functions under `controllers/`, and Express route registry under `routes/authRoutes.js`.
- **Principle II (ES Modules)**: All new and updated code in `BackEnd/` will strictly use ES Module import/export syntax.
- **Principle III (catchAsync)**: All new controller methods will be wrapped in `catchAsync.js` to ensure uniform error handling.
- **Principle IV (API response shape)**: All endpoints will output `{ success: true, token, data: { user } }` or throw `AppError` caught by centralized middleware.
- **Principle XI (No-line rule)**: The frontend modal design uses background layer shading (`bg-surface-container-low` and `bg-surface-container-lowest`) with ambient shadow layers instead of 1px solid borders.
- **Principle XIII (Hydration safety)**: Dynamic localized countdown timers and mount stages are wrapped in standard client-side mounted guards.

---

## Project Structure

### Documentation (this feature)

```text
specs/033-hybrid-checkout-otp/
├── spec.md              # Feature requirements and user stories
├── plan.md              # Technical design and constitution checklist
├── research.md          # Technical analysis on schemas and rate-limiting
├── data-model.md        # DB model change specifications
├── quickstart.md        # Local execution and testing instructions
├── contracts/
│   └── auth-api.md      # API request/response format contracts
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
BackEnd/
├── src/
│   ├── controllers/
│   │   └── authController.js       # OTP and password verification logic
│   ├── models/
│   │   ├── User.js                 # User schema (optional fields)
│   │   └── OtpToken.js             # OtpToken schema (email + guest support)
│   └── routes/
│       └── authRoutes.js           # Endpoint definitions (/send-otp, /verify-otp, /login-password)

my-app/
├── app/[locale]/
│   └── login/
│       └── page.tsx                # Client authentication page shell
├── src/
│   ├── components/
│   │   └── BookingFlow.tsx         # Unified booking and login/checkout UI modal
│   └── lib/
│       └── features/
│           └── auth/
│               └── authApi.ts      # RTK Query auth endpoints
└── messages/
    ├── en.json                     # English localization strings
    └── ar.json                     # Arabic localization strings
```

**Structure Decision**: Option 2: Web application (decoupled frontend Next.js App and backend Express server). Code edits are partitioned between `my-app` (frontend UI) and `BackEnd` (backend REST services).

---

## Complexity Tracking

> *No deviations from the Dream Park Constitution are introduced.*
