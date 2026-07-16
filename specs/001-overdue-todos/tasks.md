# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `specs/001-overdue-todos/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md)

**Tests**: Included — `docs/testing-guidelines.md` and the constitution's Test-First Quality
principle require unit/integration test coverage for new behavior.

**Organization**: Tasks are grouped by user story from spec.md (US1 = P1, US2 = P2) so each can be
validated independently per the plan's Constitution Check.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to

## Phase 1: Setup

**Purpose**: No new project setup is required — this feature only adds files inside the existing
`packages/frontend` package.

- [x] T001 Confirm frontend dev/test environment works: `npm run install:all` then
      `npm test --workspace=packages/frontend` (baseline, should pass before changes)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the shared `isOverdue` utility that both user stories depend on

**⚠️ CRITICAL**: Must be complete before Phase 3/4 work begins

- [x] T002 Create `packages/frontend/src/utils/overdue.js` exporting
      `isOverdue(todo, referenceDate = new Date())`, comparing calendar days per the
      Clarifications (due date must be strictly before the reference date's calendar day; returns
      `false` if `todo.completed` is truthy or `todo.dueDate` is null/undefined)
- [x] T003 [P] Create `packages/frontend/src/utils/__tests__/overdue.test.js` with cases: due
      yesterday + incomplete → true; due today + incomplete → false; due tomorrow → false; no due
      date → false; due yesterday + completed → false (write first, confirm they fail against a
      stub, per Test-First Quality)

**Checkpoint**: `isOverdue` is implemented and unit-tested in isolation before touching UI code

---

## Phase 3: User Story 1 - See which todos are overdue at a glance (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos with a past due date show a clear "Overdue" indicator; all other todos
do not.

**Independent Test**: Add a todo due yesterday and leave it incomplete; confirm it shows the
"Overdue" label while todos due today/future/none do not (quickstart.md Scenarios 1-4).

### Tests for User Story 1

- [x] T004 [P] [US1] Extend `packages/frontend/src/components/__tests__/TodoCard.test.js` with
      cases asserting the "Overdue" label renders for a past-due incomplete todo fixture and does
      NOT render for due-today, due-future, no-due-date, and completed-past-due fixtures (write
      first; confirm they fail before T005-T006)

### Implementation for User Story 1

- [x] T005 [US1] Import `isOverdue` in `packages/frontend/src/components/TodoCard.js` and
      conditionally render an `<span className="todo-overdue">Overdue</span>` label next to the
      due date when `isOverdue(todo)` is true (depends on T002)
- [x] T006 [US1] Add `.todo-overdue` styling to `packages/frontend/src/App.css` (near the existing
      `.todo-due-date` rule) using `var(--danger-color)` for text/border color, matching the
      spacing/typography scale already used for `.todo-due-date` (Caption size, per
      `docs/ui-guidelines.md`)

**Checkpoint**: User Story 1 is fully functional and independently testable — run
`npm test --workspace=packages/frontend -- TodoCard.test.js` and manually verify quickstart.md
Scenarios 1-4.

---

## Phase 4: User Story 2 - Overdue status updates automatically over time (Priority: P2)

**Goal**: A todo's overdue status is always correct for the current date, and clears immediately
when the todo is completed or its due date is edited — without any manual refresh step.

**Independent Test**: Toggle a past-due todo to complete and confirm the label disappears on the
next render; edit a future-dated todo's due date to a past date and confirm the label appears on
the next render (quickstart.md Scenario 5).

### Tests for User Story 2

- [x] T007 [P] [US2] Add a `TodoCard.test.js` case: rendering the same past-due todo fixture with
      `completed: true` shows no "Overdue" label (confirms FR-003/FR-006); add a case simulating a
      due-date edit from future to past and re-render, confirming the label now appears

### Implementation for User Story 2

- [x] T008 [US2] Verify no memoization/caching in `TodoCard.js` or `TodoList.js` prevents
      `isOverdue` from being recomputed on every render (it is a plain function call, not stored
      state, so no caching-invalidation code should be needed — this task is a verification/code
      review step, not new logic, per the plan's "no stored state" decision)

**Checkpoint**: Both user stories work independently and together — full quickstart.md scenario
set (1-6) passes.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across both stories

- [x] T009 [P] Run full frontend test suite: `npm test --workspace=packages/frontend` — confirm no
      regressions in unrelated components
- [x] T010 Manually execute all 6 scenarios in [quickstart.md](./quickstart.md) against
      `npm start`
- [x] T011 Review changed files against `docs/coding-guidelines.md` checklist (naming, DRY, no
      leftover `console.log`, single responsibility) before opening a pull request

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS both user stories (both need `isOverdue`)
- **User Story 1 (Phase 3)**: Depends on Foundational; delivers the MVP alone
- **User Story 2 (Phase 4)**: Depends on Foundational; extends US1's rendering but is a separate,
  independently verifiable behavior (re-evaluation on state change)
- **Polish (Phase 5)**: Depends on both user stories being complete

### Parallel Opportunities

- T003 (unit tests) can be written in parallel with T002 being finalized, as long as T003 is
  confirmed failing before T002 is completed (Test-First Quality)
- T004 and T007 target the same file (`TodoCard.test.js`) — not parallel with each other, but each
  is parallel with implementation tasks in the other phase until they touch the same lines
- T009 can run in parallel with T010 (automated vs. manual validation)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational: `isOverdue` + its unit tests)
2. Complete Phase 3 (User Story 1): label renders correctly for all due-date cases
3. **STOP and VALIDATE**: run quickstart.md Scenarios 1-4 and the T004 tests
4. This alone is a demoable, valuable increment

### Incremental Delivery

1. Setup + Foundational → `isOverdue` ready and unit-tested
2. Add User Story 1 → validate independently → demo-able MVP
3. Add User Story 2 → validate independently → full feature complete
4. Polish (Phase 5) → final regression pass and doc/checklist review

---

## Notes

- No backend tasks: the API already returns `dueDate` and `completed` unchanged (see plan.md /
  data-model.md) — this is a frontend-only, purely derived/presentational feature.
- No new dependencies or configuration changes are required.
- Commit after each checkpoint (Foundational, US1, US2, Polish) rather than after every single
  task, per `docs/coding-guidelines.md` atomic-commit guidance.
