# Tasks: Global Auth State Management (RTK + RTK Query)

**Input**: Design documents from `/specs/023-rtk-auth-state/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize the `src/lib/features/auth` and `src/features/auth/components` directories
- [x] T002 [P] Review `d:\bit68\DreamPark\my-app\src\lib\features\api\apiSlice.ts` to ensure compatibility with a new `authApi` slice.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create `authSlice.ts` in `src/lib/features/auth/authSlice.ts` defining `AuthSession` state (`token`, `isAuthenticated`).
- [x] T004 Implement `localStorage` hydration logic in `authSlice.ts` to restore token on initialization.
- [x] T005 Create `authApi.ts` in `src/lib/features/auth/authApi.ts` establishing the base RTK Query structure.
- [x] T006 Implement `prepareHeaders` in `authApi.ts` to inject the JWT Bearer token from Redux state.
- [x] T007 Configure `store.ts` (`d:\bit68\DreamPark\my-app\src\lib\store.ts`) to include `authSlice` reducer and `authApi` reducer/middleware.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - New User Registration (Priority: P1) 🎯 MVP

**Goal**: A new visitor can create an account, their token is saved, and they are redirected to home.

**Independent Test**: Can be fully tested by completing the sign-up form and verifying that the user is redirected to their profile view, delivering a fully authenticated session.

### Implementation for User Story 1

- [x] T008 [US1] Define `signUp` mutation endpoint in `authApi.ts` (`POST /auth/signup`).
- [x] T009 [US1] Create the `AuthForms` component in `src/features/auth/components/AuthForms.tsx` with a Sign Up view.
- [x] T010 [US1] Integrate `useSignUpMutation` in `AuthForms.tsx`.
- [x] T011 [US1] Implement successful signup logic: dispatch `setToken` and redirect to `/`.
- [x] T012 [US1] Implement error handling and loading indicators in `AuthForms.tsx` for the sign-up flow.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Returning User Login (Priority: P1)

**Goal**: A returning user can log in, their token is restored, and they are redirected to home.

**Independent Test**: Can be tested by logging in with a pre-existing test account and verifying that the user profile section displays accurate data fetched from the server.

### Implementation for User Story 2

- [x] T013 [US2] Define `login` mutation endpoint in `authApi.ts` (`POST /auth/login`).
- [x] T014 [US2] Expand `AuthForms.tsx` to include the Login view and a toggle between Login and Sign Up.
- [x] T015 [US2] Integrate `useLoginMutation` in `AuthForms.tsx`.
- [x] T016 [US2] Implement successful login logic: dispatch `setToken` and redirect to `/`.
- [x] T017 [US2] Implement error handling and loading indicators in `AuthForms.tsx` for the login flow.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Protected Profile Access (Priority: P2)

**Goal**: Automatically fetch and display profile data for authenticated users; skip for unauthenticated users.

**Independent Test**: Can be tested by verifying that the profile view renders user data when authenticated, and shows a fallback (e.g., login prompt) when not authenticated — without any network request being made in the unauthenticated state.

### Implementation for User Story 3

- [x] T018 [US3] Define `UserProfile` entity types in `authApi.ts`.
- [x] T019 [US3] Define `getProfile` query endpoint in `authApi.ts` (`GET /auth/profile`) with `providesTags: ['User']`.
- [x] T020 [US3] Create `UserProfile` component in `src/features/auth/components/UserProfile.tsx`.
- [x] T021 [US3] Integrate `useGetProfileQuery` in `UserProfile.tsx` with `skip: !isAuthenticated`.
- [x] T022 [US3] Implement passive 401 error handling in `UserProfile.tsx` to clear token on expiry.
- [x] T023 [US3] Render `id`, `name`, `email`, `phone`, and `avatar` in `UserProfile.tsx` with appropriate fallbacks.

**Checkpoint**: Profile viewing is now functional.

---

## Phase 6: User Story 4 - Secure Logout (Priority: P2)

**Goal**: Clear session, wipe cache, and return to unauthenticated state.

**Independent Test**: Can be tested by logging out and verifying that the profile view disappears, no further authenticated requests are made, and refreshing the page does not restore the session.

### Implementation for User Story 4

- [x] T024 [US4] Implement `logout` reducer in `authSlice.ts` to clear token from state and `localStorage`.
- [x] T025 [US4] Create a Logout button/action (can be within `UserProfile.tsx` or a separate component).
- [x] T026 [US4] Wire the Logout action to dispatch the `logout` reducer and call `authApi.util.resetApiState()`.

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T027 Code cleanup and refactoring in `src/lib/features/auth`.
- [x] T028 Ensure `console.error` is used for unhandled authentication errors per observability requirements.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed sequentially in priority order (P1 → P2).

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Can start after Foundational (Phase 2). Relies on `AuthForms` created in US1.
- **User Story 3 (P2)**: Can start after Foundational (Phase 2).
- **User Story 4 (P2)**: Depends on being able to login (US1/US2) and viewing protected state (US3) to verify cache wiping.

### Implementation Strategy

#### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently
4. Add User Story 3 → Test independently
5. Add User Story 4 → Test independently
