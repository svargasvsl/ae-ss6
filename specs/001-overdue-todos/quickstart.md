# Quickstart: Validate Overdue Todo Indicators

## Prerequisites

- Dependencies installed: `npm run install:all` (from repo root)
- App running: `npm start` (from repo root) — starts frontend (default `:3000`) and backend
  (`:3030`)

## Manual Validation Scenarios

1. **Overdue todo is indicated**
   - Add a todo with a due date of yesterday, leave it incomplete.
   - Expected: the todo card shows an "Overdue" label styled with the danger color.

2. **Due today is not overdue**
   - Add a todo with a due date of today, leave it incomplete.
   - Expected: no "Overdue" label.

3. **Future due date is not overdue**
   - Add a todo with a due date one week from today.
   - Expected: no "Overdue" label.

4. **No due date is never overdue**
   - Add a todo with no due date.
   - Expected: no "Overdue" label.

5. **Completing a todo clears the indicator**
   - Using the overdue todo from Scenario 1, check its checkbox to mark it complete.
   - Expected: "Overdue" label disappears immediately.

6. **List order is unaffected**
   - With a mix of overdue and non-overdue todos, reload the list.
   - Expected: order stays by creation date (newest first), unchanged from current behavior — the
     overdue todo does not move.

## Automated Checks

```bash
# Unit tests for the isOverdue utility
npm test --workspace=packages/frontend -- overdue.test.js

# Component tests covering the rendered indicator
npm test --workspace=packages/frontend -- TodoCard.test.js
```

Expected: all tests pass, including new cases for due-yesterday (overdue), due-today (not
overdue), due-tomorrow (not overdue), no-due-date (not overdue), and completed+past-due (not
overdue).
