# Tasks: Cloudinary Image Upload System

**Input**: Design documents from `/specs/011-cloudinary-upload/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install dependencies `cloudinary`, `multer`, and `multer-storage-cloudinary` in `BackEnd/package.json`.
- [x] T002 Configure environment variables `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` inside `BackEnd/.env`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Setup connection to Cloudinary

- [x] T003 Create configuration file `BackEnd/src/config/cloudinary.js`.
- [x] T004 Create middleware file `BackEnd/src/middlewares/uploadMiddleware.js` mapping limits.

---

## Phase 3: User Story 1 - Standalone Endpoint (Priority: P1) 🎯 MVP

**Goal**: Deliver accessible upload links

- [x] T005 [P] [US1] Build upload pipeline controller `BackEnd/src/controllers/uploadController.js`.
- [x] T006 [P] [US1] Build routing endpoint `BackEnd/src/routes/uploadRoutes.js`.
- [x] T007 [US1] Link route into application lifecycle `BackEnd/src/app.js`.

---

## Phase 4: User Story 2 - Image Optimization (Priority: P2)

**Goal**: Apply formatting controls

- [x] T008 [P] [US2] Augment `uploadMiddleware.js` to execute automatic WebP transformation routines.

---

## Phase N: Polish & Cross-Cutting Concerns

- [x] T009 Code cleanup and endpoint validation.

