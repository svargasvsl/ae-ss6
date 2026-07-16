# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-07-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-overdue-todos/spec.md`

## Summary

Add a purely presentational "overdue" indicator to each incomplete todo whose due date has
passed (per the Clarifications: overdue starting 00:00 the day after the due date). No new data
is stored — overdue status is computed at render time from the existing `dueDate` and `completed`
fields already returned by the backend API. The change is entirely frontend: a small pure utility
function computes overdue status, and `TodoCard` renders an "Overdue" label plus the existing
`--danger-color` design token when the todo qualifies. List ordering, filtering, and any aggregate
badge are explicitly out of scope per the Clarifications.

## Technical Context

**Language/Version**: JavaScript (ES2020+), Node.js v16+ (per `docs/project-overview.md`)

**Primary Dependencies**: React 18 (frontend), Express.js (backend, unchanged by this feature)

**Storage**: better-sqlite3 via `packages/backend/src/services/todoService.js` — unchanged; no
schema or migration needed since overdue is derived, not stored

**Testing**: Jest + `@testing-library/react` (frontend), Jest + Supertest (backend, not touched)

**Target Platform**: Web (React SPA served via `react-scripts`, existing dev/build setup)

**Project Type**: Web application (existing monorepo: `packages/frontend` + `packages/backend`)

**Performance Goals**: No measurable perf impact — overdue check is an O(1) date comparison per
todo, evaluated during the existing render pass; no additional network calls

**Constraints**: Must reuse existing design tokens (`--danger-color`) per `docs/ui-guidelines.md`
and existing accessibility requirements (no color-only signaling, per constitution
[[copilot-bootcamp-todo-app-constitution|principle IV]]); must not change API contracts or list
ordering (constitution principle V / functional-requirements scope)

**Scale/Scope**: Single-user todo list, typically tens of items; no scale concerns

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Checked against `.specify/memory/constitution.md`:

- **I. Clarity and Consistency in Naming** — PASS. New utility function and any new CSS class
  names will follow existing `camelCase` / kebab-case conventions used in `TodoCard.js` and
  `App.css`.
- **II. DRY, KISS, and SOLID** — PASS. Overdue calculation is extracted into a single reusable
  utility (`isOverdue`) rather than duplicated inline in `TodoCard.js`; `TodoCard` keeps its single
  responsibility (rendering a todo), with no new props beyond what it already receives.
- **III. Test-First Quality** — PASS (planned). Unit tests for the new `isOverdue` utility and an
  integration test asserting `TodoCard` renders/hides the indicator are required before/with
  implementation (see tasks.md).
- **IV. User Experience Consistency** — PASS. Indicator reuses the existing danger color token and
  8px spacing grid; adds a text label so it does not rely on color alone.
- **V. Scope Discipline** — PASS. No new functional requirements beyond `docs/functional-
  requirements.md`; list ordering and filtering remain unchanged per the Clarifications.

No violations — Complexity Tracking section is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command - not created here)
```

### Source Code (repository root)

```text
packages/frontend/src/
├── utils/
│   └── overdue.js              # NEW: isOverdue(todo, today) pure function
│   └── __tests__/
│       └── overdue.test.js     # NEW: unit tests for isOverdue
├── components/
│   ├── TodoCard.js             # MODIFIED: render overdue label using utils/overdue.js
│   ├── TodoCard.css            # N/A — styles currently live in App.css; add .todo-overdue rule there
│   └── __tests__/
│       └── TodoCard.test.js    # MODIFIED: extend with overdue-indicator test cases
├── App.css                     # MODIFIED: add `.todo-overdue` style using var(--danger-color)
└── styles/theme.css            # unchanged — reuse existing --danger-color token

packages/backend/                # UNCHANGED — dueDate/completed already returned by the API
```

**Structure Decision**: Existing monorepo web-application layout
(`packages/frontend` + `packages/backend`) is reused as-is. This feature only touches
`packages/frontend/src` (a new `utils/overdue.js` helper, a `TodoCard.js` render change, and a CSS
rule in `App.css`); the backend is unaffected since overdue status is computed client-side from
data it already returns.

## Complexity Tracking

*Not applicable — no Constitution Check violations.*
