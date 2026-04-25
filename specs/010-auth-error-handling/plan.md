# Implementation Plan: Auth and Error Handling System

**Branch**: `010-auth-error-handling` | **Date**: 2026-04-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-auth-error-handling/spec.md`

## Summary
Implementing a Centralized Error Handling system (using `AppError`, `catchAsync`, and `errorMiddleware` to format responses and translate MongoDB errors) alongside a JWT-based Authentication/Authorization system (including `User` model, `/login` and `/signup` endpoints, and `protect`/`restrictTo` middlewares). Applying these to secure specific `heroRoutes` and `attractionRoutes`.

## Technical Context
**Language/Version**: Node.js / ES Modules
**Primary Dependencies**: Express.js, mongoose, jsonwebtoken, bcryptjs, dotenv
**Storage**: MongoDB (Mongoose)
**Testing**: Manual testing / Postman (Integration)
**Target Platform**: Node.js Backend Server
**Project Type**: REST Web Service
**Performance Goals**: Fast endpoint resolution and quick error formatting (< 100ms processing)
**Constraints**: ES Modules strictly, standard project response contract (`{success, message/data}`), must catch and translate MongoDB specific errors.
**Scale/Scope**: Centralized application-wide effect for error handling and routing.

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Modular Controller-Route-Model Architecture**: PASSED. Using `src/models/User.js`, `src/controllers/authController.js`, `src/routes/authRoutes.js`, and `src/middlewares/*`.
- **ES Modules Exclusively**: PASSED. Strict adherence to `import/export`.
- **Consistent API Response Contract**: PASSED. Error middleware ensures `{ success: false, message: ... }` response structure.
- **Mandatory Error Handling in Controllers**: PASSED. Replaced manual `try-catch` with new `catchAsync` wrapper.
- **Dynamic Content via pageKey Strategy**: N/A for User Models and Error Middlewares.

## Project Structure

### Documentation (this feature)
```text
specs/010-auth-error-handling/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── quickstart.md        # Phase 1 output
```

### Source Code (repository root)
```text
BackEnd/src/
├── app.js
├── models/
│   └── User.js
├── controllers/
│   └── authController.js
├── routes/
│   └── authRoutes.js
├── middlewares/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
└── utils/
    ├── appError.js
    └── catchAsync.js
```

**Structure Decision**: Using standard Backend structure for the REST API and adding utilities and middlewares.

## Complexity Tracking
*No significant deviations from the constitution or architecture.*
