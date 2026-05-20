# Implementation Plan: Dynamic Ticketing, Verification & Pricing System

**Branch**: `020-ticketing-system` | **Date**: 2026-05-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/020-ticketing-system/spec.md`

## Summary

Implement a full-stack ticketing, verification, and pricing system for Dream Park using Next.js 14/15 App Router, Prisma, MongoDB, and Tailwind CSS. The system will feature secure Next.js Server Actions for booking, QR code generation/scanning (for marketing agents), and admin pricing controls, all styled with the premium "Editorial Joy" design system.

## Technical Context

**Language/Version**: TypeScript / Node.js
**Primary Dependencies**: Next.js App Router, Prisma, Tailwind CSS, html5-qrcode, Lucia Auth
**Storage**: MongoDB (via Prisma)
**Testing**: Jest / Playwright (if applicable)
**Target Platform**: Web (Mobile-first, RTL layout)
**Project Type**: Full-stack Next.js Web Application
**Performance Goals**: Bookings < 60s, Scanning < 15s, Price updates < 5s
**Constraints**: Cash-only payments, in-person verification
**Scale/Scope**: 3 core user flows (Visitor, Agent, Admin)

## Constitution Check

*GATE: Passed. (Note: The backend constitution mandates Mongoose for the Express API, but the user explicitly requested Prisma for Next.js Server Actions. This plan respects both by implementing the new ticketing logic entirely within the Next.js App Router context using Prisma, without modifying the legacy Express backend).*

## Project Structure

### Documentation (this feature)

```text
specs/020-ticketing-system/
├── plan.md              # This file
├── research.md          # Architecture & tech alignment
├── data-model.md        # Prisma schema definitions
├── quickstart.md        # Dev onboarding
├── contracts/
│   └── server-actions.md # Action signatures and validation rules
└── tasks.md             # (To be generated)
```

### Source Code (repository root)

```text
my-app/
├── prisma/
│   └── schema.prisma                # Update with TicketType, Booking models
├── src/
│   ├── actions/
│   │   ├── ticketing.ts             # Server actions for booking/pricing
│   │   └── verification.ts          # Server actions for QR scanning
│   ├── components/
│   │   ├── ticketing/               # Magic Pass, QR Code, Pricing Board
│   │   └── verification/            # QR Scanner component
├── app/
│   └── [locale]/
│       ├── pass/                    # Visitor booking flow
│       ├── marketing-dashboard/
│       │   └── scan/                # Agent verification center
│       └── admin/
│           └── tickets/             # Admin pricing board
```

**Structure Decision**: A Next.js App Router monolith approach is selected for this feature, leveraging Server Actions for seamless client-server communication and Prisma for MongoDB interaction, as requested in the feature specification.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Prisma instead of Mongoose (Next.js) | User explicit requirement for Server Actions | Reverting to Express/Mongoose ignores the user's architectural directive for this specific feature build. |
