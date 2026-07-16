# Phase 0 Research: Support for Overdue Todo Items

All Technical Context items were resolvable directly from the existing codebase and docs; no
open NEEDS CLARIFICATION items remained after `/speckit.clarify`.

## Decision: Compute overdue status client-side, on-demand

- **Decision**: Add a pure `isOverdue(todo, today = new Date())` utility in
  `packages/frontend/src/utils/overdue.js` that returns `true` only when
  `todo.completed` is falsy, `todo.dueDate` is set, and the due date's calendar day is strictly
  before today's calendar day.
- **Rationale**: The spec's Clarifications rule out storing new fields or changing the API
  contract (`FR-001`–`FR-006`, Assumptions). The existing backend
  (`packages/backend/src/services/todoService.js`) already returns `dueDate` and `completed` per
  todo, so no backend change or migration is needed. Computing it at render time also satisfies
  FR-005 (status re-evaluated whenever the list is displayed) for free — every render calls
  `isOverdue` fresh.
- **Alternatives considered**:
  - *Store a computed `overdue` boolean in the database*: rejected — requires a write on every
    read/tick to stay accurate, adds a migration, and violates the constitution's KISS/Scope
    Discipline principles for a purely presentational feature.
  - *Compute in the backend and add it to the API response*: rejected — unnecessary network/API
    contract change for a value derivable entirely from data the client already has.

## Decision: Day-boundary comparison, not full timestamp comparison

- **Decision**: Compare calendar dates (year/month/day), not full `Date` timestamps, matching the
  Clarifications decision that a todo due on day D becomes overdue at the start of day D+1, using
  the same local-date basis the app already uses for due dates (see `formatDate` in
  `TodoCard.js`, which parses `dueDate` and formats via `toLocaleDateString`).
- **Rationale**: Prevents the common bug where a todo due "today" at midnight appears overdue for
  users in different time-of-day states. This directly encodes FR-002 and FR-009 and the Session
  2026-07-16 clarification.
- **Alternatives considered**: Raw millisecond timestamp comparison (`dueDate < Date.now()`) —
  rejected because it would mark todos due "today" as overdue as soon as any time has passed
  today, contradicting the clarified behavior.

## Decision: Reuse `--danger-color` design token; label + color, not color alone

- **Decision**: Style the overdue indicator with the existing `--danger-color` CSS variable
  (`packages/frontend/src/styles/theme.css`) and an explicit "Overdue" text label, added as a new
  `.todo-overdue` rule in `App.css` alongside the existing `.todo-card`, `.todo-title`, and
  `.todo-due-date` rules.
- **Rationale**: `docs/ui-guidelines.md` designates the danger color for delete/destructive
  emphasis, which is a reasonable, already-approved semantic fit for "needs attention." The
  constitution (Principle IV) and spec FR-007/FR-008 require the signal not rely on color alone,
  hence the accompanying text label.
- **Alternatives considered**: A new dedicated "overdue orange/red" token — rejected per
  Clarifications ("no new color tokens are introduced").

## Decision: Testing approach

- **Decision**: Add Jest unit tests for `isOverdue` covering the boundary cases from the spec's
  Edge Cases (due today, due yesterday, due tomorrow, no due date, completed + past due), and
  extend `packages/frontend/src/components/__tests__/TodoCard.test.js` with integration-style
  tests asserting the "Overdue" label appears/doesn't appear for the relevant todo fixtures.
- **Rationale**: Matches `docs/testing-guidelines.md` (unit tests for utilities, integration tests
  for component rendering) and the constitution's Test-First Quality principle.
- **Alternatives considered**: Testing only at the component level — rejected because the date
  boundary logic is easier to test exhaustively as an isolated pure function.
