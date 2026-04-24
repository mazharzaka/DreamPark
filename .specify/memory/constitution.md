<!--
SYNC IMPACT REPORT
==================
Version Change: (template) → 1.0.0
Added Sections:
  - Core Principles (5 principles fully defined)
  - Tech Stack & Architecture Constraints
  - API Design Standards
  - Governance
Modified Principles: N/A (first ratification from blank template)
Templates Requiring Updates:
  - .specify/templates/plan-template.md  ✅ aligned (Constitution Check references backend principles)
  - .specify/templates/spec-template.md  ✅ aligned (no breaking changes required)
  - .specify/templates/tasks-template.md ✅ aligned (foundational phase covers model/controller/route structure)
Deferred TODOs:
  - None — all placeholders resolved.
-->

# Dream Park Backend Constitution

## Core Principles

### I. Modular Controller-Route-Model Architecture (NON-NEGOTIABLE)

Every new feature MUST follow the three-layer separation:

- **Models** (`src/models/`): Mongoose schemas only — no business logic.
- **Controllers** (`src/controllers/`): All business logic and DB queries live here.
- **Routes** (`src/routes/`): Endpoint definitions only; they MUST delegate to controllers immediately.
- **Middlewares** (`src/middlewares/`): Cross-cutting concerns (auth, error handling) only.

No controller logic may appear in a route file. No DB query may appear in a route file.
Violations MUST be refactored before the PR is merged.

### II. ES Modules Exclusively

The codebase MUST use ES Module syntax (`import`/`export`) throughout.
CommonJS (`require`/`module.exports`) is PROHIBITED in any new or modified file.
Rationale: consistency with the Next.js frontend and modern Node.js best practices.

### III. Consistent API Response Contract

All API responses MUST conform to one of exactly two shapes:

```json
{ "success": true,  "data": [ ... ] }
{ "success": false, "error": "human-readable message" }
```

No other top-level response shape is permitted. Controllers MUST NOT leak raw Mongoose
errors or stack traces to the client. Use the centralized error-handling middleware
(`src/middlewares/errorHandler.js`) to normalize all unexpected errors.

### IV. Mandatory Error Handling in Controllers

Every controller function MUST wrap its logic in a `try-catch` block and forward
caught errors to Express's `next(err)` for centralized handling.
Silent failures (swallowed errors with no logging) are PROHIBITED.

### V. Dynamic Content via `pageKey` Strategy

Page-specific content (Hero sections, Zoo, Attractions, etc.) MUST be distinguished
using a `pageKey` field on the Mongoose document rather than separate collections.
Image assets MUST be stored as Cloudinary URLs — no binary blobs in MongoDB.
Relational data (e.g., Tickets ↔ Bookings) MUST use Mongoose `.populate()`.

## Tech Stack & Architecture Constraints

- **Runtime**: Node.js (LTS)
- **Framework**: Express.js
- **Database**: MongoDB via Mongoose
- **Image CDN**: Cloudinary (URLs stored in DB; no local asset serving)
- **Frontend Consumer**: Next.js (Dream Park `my-app`); CORS MUST be configured to
  allow requests from the frontend origin in all environments.
- **Module System**: ES Modules only (see Principle II)

New dependencies MUST be justified by a documented need. Prefer the standard library
and existing dependencies over adding new ones.

## API Design Standards

All endpoints MUST follow RESTful conventions. The active roadmap endpoints are:

| Method | Path | Responsibility |
|--------|------|----------------|
| GET | `/api/hero/:pageKey` | Fetch hero content for a specific page |
| GET | `/api/attractions` | Fetch all rides/attractions |
| POST | `/api/bookings` | Handle ticket purchasing logic |

New endpoints MUST be registered in `src/routes/` and documented in the feature spec
before implementation begins. Breaking changes to existing endpoints require a version
prefix (e.g., `/api/v2/...`) and a migration plan.

## Governance

- This constitution supersedes all other informal practices and prior verbal agreements.
- Amendments require: (a) a documented rationale, (b) a version bump per semantic
  versioning rules (MAJOR/MINOR/PATCH), and (c) a propagation check across all
  `.specify/templates/` files.
- All feature plans MUST include a **Constitution Check** section confirming compliance
  with all five principles before implementation begins.
- Any intentional deviation from a principle MUST be recorded in the plan's
  **Complexity Tracking** table with a justification.
- Compliance is reviewed at PR merge time; non-compliant PRs MUST NOT be merged.

**Version**: 1.0.0 | **Ratified**: 2026-04-24 | **Last Amended**: 2026-04-24
