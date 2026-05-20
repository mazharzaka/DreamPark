# Phase 0: Research

## Technology Alignment: Prisma vs. Mongoose
- **Decision**: Use Prisma for Next.js Server Actions (Frontend/Fullstack), but respect Mongoose for the Express backend if modifying the existing backend.
- **Rationale**: The user explicitly requested Prisma in Next.js Server Actions for this feature. The constitution mandates Mongoose for the Express backend. We will define the Prisma schema in the Next.js app (`my-app/prisma/schema.prisma`) for Server Actions to use, which aligns with modern Next.js practices.
- **Alternatives considered**: Rewriting the entire backend to Prisma (violates constitution) or forcing Next.js to use Mongoose for Server Actions (contradicts explicit user request for Prisma).

## Architecture: Server Actions vs. Express API
- **Decision**: Implement core booking logic via Next.js Server Actions as requested by the user, while ensuring any necessary data is synced or accessible to the existing backend if required.
- **Rationale**: The user specifically asked for "secure server actions for booking creation". This means the business logic for this feature lives in the Next.js layer.
- **Alternatives considered**: Building this exclusively in the Express backend (ignores user's explicit request for Server Actions).

## Design System: Editorial Joy
- **Decision**: Strict adherence to the provided design rules: "Plus Jakarta Sans", Crimson/Royal Blue/Gold palette, No-Line rule (tonal layering/shadows instead of borders), high roundedness, glassmorphism.
- **Rationale**: User explicitly mandated this in the prompt.
