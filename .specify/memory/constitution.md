# Copilot Bootcamp Todo App Constitution

## Core Principles

### I. Clarity and Consistency in Naming
All code MUST follow the naming conventions defined in `docs/coding-guidelines.md`: `camelCase` for
variables and functions, `UPPER_SNAKE_CASE` for constants, and `PascalCase` for React components and
classes (with matching file names, e.g. `TodoCard.js`). Names MUST clearly indicate purpose;
single-letter or ambiguous names (`u`, `calc`, `tmp`) are not allowed outside of loop counters or
destructuring. Imports MUST be grouped and ordered as external libraries, then internal modules, then
styles, separated by blank lines.

### II. DRY, KISS, and SOLID
Code MUST avoid duplication: repeated logic is extracted into shared utilities or reusable components
(DRY). Prefer the simplest solution that solves the problem; avoid premature optimization and
over-engineering (KISS). Components and modules MUST follow SOLID: a single, well-defined
responsibility per module/function (SRP); extend behavior via props/composition rather than modifying
existing components (Open/Closed); consistent, non-breaking prop/interface contracts (Liskov/Interface
Segregation); and dependency injection over hardcoded dependencies (Dependency Inversion), per
`docs/coding-guidelines.md`.

### III. Test-First Quality (NON-NEGOTIABLE)
Tests are written alongside or before implementation and MUST describe expected behavior, not
implementation details, per `docs/testing-guidelines.md`. Every package targets 80%+ code coverage,
with unit tests for components/functions/route handlers and integration tests for
component-interaction and frontend-to-backend API communication. Tests MUST be independent,
self-contained (own setup/teardown), and use descriptive names following the Arrange-Act-Assert
pattern. All tests MUST pass before a pull request is opened.

### IV. User Experience Consistency
All UI work MUST conform to `docs/ui-guidelines.md`: the defined color palette and typography for
light/dark mode, the 8px spacing grid, and existing component patterns (todo card, buttons, input
fields, confirmation dialog). The interface stays a single-column, Material Design-inspired, Halloween
themed layout. Interactive elements MUST be keyboard accessible, meet WCAG AA color contrast, and
include proper labels/aria-attributes. New UI elements must reuse existing design tokens rather than
introducing ad hoc colors, spacing, or typography.

### V. Scope Discipline
Features MUST match `docs/functional-requirements.md`. This is a single-user todo application:
create, view, update (status and details), and delete todos with title and optional due date, with
immediate backend persistence and a confirmation step before delete. Explicitly out of scope unless a
future requirements update says otherwise: authentication, multi-user support, priority/categories,
recurring todos, reminders/notifications, undo/redo, bulk operations, advanced search/filtering, and
mobile-specific optimization. Do not add speculative functionality beyond the current requirements.

## Technology & Architecture Constraints

The project is a monorepo (`packages/frontend`, `packages/backend`) managed with npm workspaces, per
`docs/project-overview.md`. Frontend: React with Jest for testing. Backend: Express.js REST API with
Jest for testing. Backend is the sole persistence layer; no client-side data storage is introduced for
core todo data beyond UI preferences (e.g. dark/light mode in localStorage, per
`docs/ui-guidelines.md`). New dependencies must fit this stack — no framework swaps without an
explicit decision recorded via an amendment to this constitution.

## Development Workflow

Work happens on feature branches (e.g. `feature/todo-editing`) with atomic commits and descriptive
messages explaining the "why," per `docs/coding-guidelines.md`. Before opening a pull request:
linting errors/warnings are resolved, all tests pass locally, and the code-review checklist in
`docs/coding-guidelines.md` is satisfied (naming, import order, DRY, single responsibility, error
handling, test coverage, no leftover `console.log`). Pull requests are used for review before merging.

## Governance

This constitution supersedes ad hoc practices for this project. Amendments require updating this file
along with a rationale and, if principles materially change, a note in the affected `docs/*.md` file.
All specs, plans, and implementations produced via SpecKit workflows MUST be checked against these
principles before implementation begins; any deviation must be justified in the corresponding plan's
Complexity Tracking section. Use `docs/coding-guidelines.md`, `docs/testing-guidelines.md`,
`docs/ui-guidelines.md`, and `docs/functional-requirements.md` as the authoritative source for
day-to-day development guidance referenced by these principles.

**Version**: 1.0.0 | **Ratified**: 2026-07-16 | **Last Amended**: 2026-07-16
