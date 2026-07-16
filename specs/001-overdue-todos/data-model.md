# Phase 1 Data Model: Support for Overdue Todo Items

No new entities, fields, or persisted state are introduced by this feature. Overdue is a derived
UI concept computed from the existing Todo Item shape already returned by the backend API
(`packages/backend/src/services/todoService.js`).

## Todo Item (existing, unchanged)

| Field       | Type              | Notes                                                        |
|-------------|-------------------|---------------------------------------------------------------|
| `id`        | integer           | Existing primary key                                          |
| `title`     | string            | Existing, unchanged                                           |
| `dueDate`   | string (ISO date) or null | Existing, unchanged — used to derive overdue status   |
| `completed` | 0 or 1            | Existing, unchanged — used to derive overdue status            |

## Derived value: `isOverdue`

Not a stored field — computed at render time in the frontend.

- **Input**: a Todo Item (`dueDate`, `completed`) and a reference date (defaults to `new Date()`).
- **Output**: boolean.
- **Rule**: `isOverdue === true` if and only if:
  1. `completed` is falsy (`0`), AND
  2. `dueDate` is set (non-null), AND
  3. The calendar day of `dueDate` is strictly before the calendar day of the reference date.
- **State transitions**: Purely a function of current inputs — there is no stored overdue state to
  transition. Toggling `completed` or editing `dueDate` changes the output of `isOverdue` on the
  next render; no separate write path is required (satisfies FR-006).
