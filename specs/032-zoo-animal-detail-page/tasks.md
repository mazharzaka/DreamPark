# Tasks: Unified Zoo Animal Detail Page

**Input**: Design documents from `/specs/032-zoo-animal-detail-page/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Setup `NEXT_PUBLIC_ZOO_BOOKING_URL` env variable in `my-app/.env`
- [x] T002 [P] Add English translation keys in `my-app/messages/en.json`
- [x] T003 [P] Add Arabic translation keys in `my-app/messages/ar.json`
- [x] T004 [P] Initialize feature directory structure under `my-app/src/features/zoo/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create constants file `my-app/src/features/zoo/lib/constants.ts` with `BOOKING_URL` and `iconMap`
- [x] T006 [P] Create TypeScript types in `my-app/src/features/zoo/types/zoo.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Bilingual Animal Hero Viewing (Priority: P1) 🎯 MVP

**Goal**: Renders full-screen cinematic hero with bilingual titles, static info box, and wait-time stats.

**Independent Test**: Navigate to `/ar/zoo/animals/{id}` or `/en/zoo/animals/{id}` and check hero renders, title stacks properly in both locales, info box shows with texture, and navigation is transparent.

### Implementation for User Story 1

- [x] T007 [P] [US1] Create the static `ZooInfoBox` component in `my-app/src/features/zoo/components/ZooInfoBox.tsx`
- [x] T008 [US1] Create the `ZooAnimalHero` component in `my-app/src/features/zoo/components/ZooAnimalHero.tsx` using `ZooInfoBox` and Cloudinary hero helper

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Booking Call-to-Action Banner (Priority: P1)

**Goal**: Display a horizontal banner with status and CTA button to the external booking URL.

**Independent Test**: Scroll past hero, verify the banner displays correctly, and clicking the button opens the booking page in a new tab. Verify it is disabled when status is closed.

### Implementation for User Story 2

- [x] T009 [US2] Create the `ZooBookingBanner` component in `my-app/src/features/zoo/components/ZooBookingBanner.tsx` supporting operating/closed status states and the external URL from constants

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Interactive Photo Gallery (Priority: P2)

**Goal**: Asymmetric editorial gallery grid for animal pictures with lightbox navigation.

**Independent Test**: Click gallery image, verify lightbox opens, check left/right navigation, and ensure it closes.

### Implementation for User Story 3

- [x] T010 [US3] Create the `ZooGallery` component in `my-app/src/features/zoo/components/ZooGallery.tsx` with lightbox controls and RTL support

**Checkpoint**: At this point, User Stories 1, 2, and 3 should all work independently

---

## Phase 6: User Story 4 - Terms & Conditions Grid (Priority: P2)

**Goal**: Clean grid-based safety rules card grid with custom icons and readable fonts.

**Independent Test**: Verify terms section renders cards in 2-columns (1 on mobile), text uses readable sizes, and correct icons match rule types.

### Implementation for User Story 4

- [x] T011 [US4] Create the `ZooTermsGrid` component in `my-app/src/features/zoo/components/ZooTermsGrid.tsx` using mapped icons and hover animations

**Checkpoint**: At this point, User Stories 1 through 4 should all work independently

---

## Phase 7: User Story 5 - Dark Immersive Theme & Scroll Transitions (Priority: P3)

**Goal**: Apply dark background, scroll-driven visual transitions, and color glow effects matching customStyle.

**Independent Test**: Scroll the page, verify sections fade/slide into view, check dark background, and observe color theme glows.

### Implementation for User Story 5

- [x] T012 [US5] Implement scroll transitions and layout container with dynamic glow styling in `my-app/app/[locale]/zoo/animals/[id]/page.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T013 Create barrel exports file `my-app/src/features/zoo/index.ts`
- [x] T014 Update page entry point `my-app/app/[locale]/zoo/animals/[id]/page.tsx` to render all new zoo components
- [x] T015 [P] Update metadata generator in `my-app/app/[locale]/zoo/animals/[id]/page.tsx` to correct localized title and descriptions
- [x] T016 Verify design across locales and screen sizes, ensuring no line rules are broken and only `shadow-ambient` is used

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - May integrate with previous stories but should be independently testable
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Integrates overall transitions and glows across all components

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Implement static sub-components
Task: "Create the static ZooInfoBox component in my-app/src/features/zoo/components/ZooInfoBox.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test transitions and layout integration → Deploy/Demo
7. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
