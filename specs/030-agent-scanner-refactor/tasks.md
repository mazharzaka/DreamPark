# Tasks: Agent Scanner Overlay & Shift Summary Refactoring

**Input**: Design documents from `/specs/030-agent-scanner-refactor/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Tests are manually executed and verified using browser-based camera flow. No automated unit tests requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `my-app/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Setup feature branch 030-agent-scanner-refactor and initialize specs directory

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T002 Configure scannerRef and standard layout positioning in `my-app/src/features/scanner/components/AgentScanner.tsx` to support manual pausing/resuming

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Quick QR Code Scanning & Overlay (Priority: P1) 🎯 MVP

**Goal**: Render the floating glassmorphic bottom sheet and trigger camera pause/resume correctly.

**Independent Test**: Scan a QR code, verify that the camera pauses immediately, the bottom sheet opens with correct info, and confirming resumes the camera.

### Implementation for User Story 1

- [ ] T003 [US1] Implement handleQrScan camera pausing using `scannerRef.current.pause(true)` in `my-app/src/features/scanner/components/AgentScanner.tsx`
- [ ] T004 [US1] Design and implement the floating glassmorphic bottom sheet using Framer Motion with vertical slide animation in `my-app/src/features/scanner/components/AgentScanner.tsx`
- [ ] T005 [US1] Create the Arabic Success State layout inside the bottom sheet, showing visitor name, phone number, ticket name, and the cash to collect in `my-app/src/features/scanner/components/AgentScanner.tsx`
- [ ] T006 [US1] Implement the Crimson Gradient CTA button "تأكيد استلام النقدية" with RTK confirmMutation call and optimistic shift stats updates in `my-app/src/features/scanner/components/AgentScanner.tsx`
- [ ] T007 [US1] Implement the borderless cancel scanning button "إلغاء الفحص" that closes the overlay sheet and resumes scanner in `my-app/src/features/scanner/components/AgentScanner.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (MVP ready!).

---

## Phase 4: User Story 2 - Scan Failure Resolution (Priority: P1)

**Goal**: Display soft crimson error overlay for scan failure with a retry button.

**Independent Test**: Simulate scan error and verify that the soft crimson overlay appears, showing error message, and clicking retry resumes the scanner.

### Implementation for User Story 2

- [ ] T008 [US2] Implement the soft crimson failure overlay using Framer Motion with pure string error rendering in `my-app/src/features/scanner/components/AgentScanner.tsx`
- [ ] T009 [US2] Connect the "إعادة المحاولة" button to close the error overlay and safely call `scannerRef.current.resume()` in `my-app/src/features/scanner/components/AgentScanner.tsx`

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Shift Summary Dashboard (Priority: P2)

**Goal**: Position and animate the shift report toggle button and panel in the top-corner, integrating with auth logout.

**Independent Test**: Click the toggle button to open the shift panel, view count and cash stats, confirm a scan and verify the cash increments optimistically, and click logout to trigger cleanup.

### Implementation for User Story 3

- [ ] T010 [US3] Create the Shift stats state in `my-app/src/features/scanner/components/AgentScanner.tsx` and persist to LocalStorage
- [ ] T011 [US3] Position and style the floating minimalist toggle button `bg-[#f0f1f1] text-[#005caa] rounded-full` in `my-app/src/features/scanner/components/AgentScanner.tsx`
- [ ] T012 [US3] Implement the expanding shift summary panel container styled in Editorial Joy compliance (`bg-white shadow-[0_40px_80px_rgba(45,47,47,0.06)] rounded-3xl`) in `my-app/src/features/scanner/components/AgentScanner.tsx`
- [ ] T013 [US3] Integrate the "إغلاق الوردية وتسليم العهدة" button to clear local storage shift states and trigger auth logout in `my-app/src/features/scanner/components/AgentScanner.tsx`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Style fine-tuning and safety checks

- [ ] T014 Review and align typography, padding, roundedness, and colors with Editorial Joy design guidelines in `my-app/src/features/scanner/components/AgentScanner.tsx`
- [ ] T015 Verify that the scan dashboard behaves defensively against raw object rendering in `my-app/src/features/scanner/components/AgentScanner.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Sequential execution: Phase 3 → Phase 4 → Phase 5
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2)

### Implementation Strategy

- **MVP First (User Story 1 Only)**: Complete Setup + Foundational + User Story 1, then halt and verify scan behavior before adding failure states or shift summaries.
