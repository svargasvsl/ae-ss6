# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todos`

**Created**: 2026-07-16

**Status**: Draft

**Input**: User description: "As a todo application user I want to easily identify and distinguish overdue tasks in my todo list so that I can prioritize my work and quickly see which tasks are past their due date."

## Clarifications

### Session 2026-07-16

- Q: What visual treatment should the overdue indicator use? → A: A "Overdue" text label plus a danger-colored (red) accent on the todo card, reusing the existing danger color token from the UI guidelines — not color alone, satisfying accessibility requirements.
- Q: Should overdue todos be reordered to the top of the list? → A: No. List ordering stays as-is (creation date, newest first); only the visual indicator changes, consistent with the app's existing no-sorting/no-filtering scope.
- Q: At what exact moment does a todo become overdue relative to its due date? → A: At the start of the calendar day after the due date (i.e., a todo due on day D becomes overdue at 00:00 on day D+1), using the same local date basis the app already uses for due dates.
- Q: Should an aggregate overdue count/badge be shown elsewhere (e.g., page header)? → A: No. Only the per-item indicator on each todo card is in scope; no summary badge or count is added.
- Q: If a todo was completed after its due date had already passed, should it show any "completed late" indicator? → A: No. Once a todo is completed, no overdue-related indicator is shown, regardless of when it was completed, consistent with FR-003.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See which todos are overdue at a glance (Priority: P1)

As a user viewing my todo list, I want incomplete todos whose due date has passed to be
visually distinguished from other todos, so that I can immediately tell which tasks need my
attention without comparing every due date to today's date myself.

**Why this priority**: This is the core of the feature. Without a visual indicator, the rest of
the feature (prioritizing overdue work) has no value. This alone delivers the requested outcome.

**Independent Test**: Create a todo with a due date in the past and leave it incomplete; view the
todo list and confirm the overdue todo is visually distinguished from todos that are not overdue.

**Acceptance Scenarios**:

1. **Given** a todo with a due date before today and status incomplete, **When** the user views
   the todo list, **Then** the todo is displayed with a clear overdue indicator (e.g., distinct
   styling and/or label).
2. **Given** a todo with a due date before today and status incomplete, **When** the user marks it
   complete, **Then** the overdue indicator no longer appears for that todo.
3. **Given** a todo with a due date of today, **When** the user views the todo list, **Then** the
   todo is NOT marked as overdue (it becomes overdue only after the due date has fully passed).
4. **Given** a todo with a due date in the future, **When** the user views the todo list, **Then**
   the todo is displayed with no overdue indicator.
5. **Given** a todo with no due date set, **When** the user views the todo list, **Then** the todo
   is displayed with no overdue indicator.

---

### User Story 2 - Overdue status updates automatically over time (Priority: P2)

As a user, I want a todo to automatically become "overdue" the moment its due date passes,
without me having to refresh any settings or manually flag it, so the list always reflects
reality when I open the app.

**Why this priority**: Builds directly on User Story 1. Without automatic recalculation, the
indicator would only be correct at the moment it was set, quickly becoming misleading.

**Independent Test**: Create a todo due "today," then simulate the passage of a day (or view the
list again after the due date has passed) and confirm the todo now shows as overdue without any
manual action.

**Acceptance Scenarios**:

1. **Given** a todo due today that was not overdue, **When** the current date advances past the
   due date and the user reloads/reopens the todo list, **Then** the todo is now shown as overdue.
2. **Given** the todo list is open, **When** the due date for a displayed todo passes while the
   user is viewing the list, **Then** the todo reflects overdue status the next time the list is
   loaded (real-time, in-page updates are not required).

---

### Edge Cases

- What happens when a todo's due date is exactly today (system boundary)? It MUST NOT be treated
  as overdue; it becomes overdue at the start of the following calendar day (see Clarifications).
- What happens when a completed todo has a due date in the past? It MUST NOT be shown as overdue,
  since overdue status only applies to incomplete work, even if it was completed after its due
  date had already passed (see Clarifications).
- What happens when a todo has no due date? It MUST never be marked overdue.
- How does the system handle a due date that is edited to a past date on an incomplete todo? The
  todo MUST immediately be reflected as overdue the next time the list is displayed.
- How does the system handle todos across time zones? Use the same date/time basis the
  application already uses elsewhere (e.g., server or browser local date) for consistency; this is
  not expected to change existing due-date handling.
- Does becoming overdue change a todo's position in the list? No — list ordering is unaffected;
  only the visual indicator is added (see Clarifications).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST visually distinguish incomplete todos whose due date is before the
  current date ("overdue") from all other todos in the list.
- **FR-002**: System MUST NOT mark a todo as overdue if its due date is today or in the future.
- **FR-003**: System MUST NOT mark a completed todo as overdue, regardless of its due date.
- **FR-004**: System MUST NOT mark a todo with no due date as overdue.
- **FR-005**: System MUST re-evaluate overdue status whenever the todo list is displayed, so status
  reflects the current date without requiring a manual user action.
- **FR-006**: System MUST update a todo's overdue status immediately when its completion state or
  due date changes (e.g., marking complete removes the overdue indicator on next display).
- **FR-007**: The overdue indicator MUST be distinguishable without relying on color alone, so it
  remains clear for users with color vision deficiencies (e.g., icon, text label, or pattern in
  addition to color).
- **FR-008**: The overdue indicator MUST be an "Overdue" text label combined with the existing
  danger color accent from the UI guidelines; no new color tokens are introduced.
- **FR-009**: A todo becomes overdue at the start of the calendar day following its due date (a
  todo due on day D is overdue starting 00:00 on day D+1); it MUST NOT be overdue on day D itself.
- **FR-010**: System MUST NOT reorder, sort, or filter the todo list based on overdue status; list
  ordering remains unchanged from existing behavior.
- **FR-011**: System MUST NOT display any aggregate overdue count or summary badge; the indicator
  is scoped to individual todo items only.

### Key Entities

- **Todo Item**: Existing entity; no new fields are required. Overdue is a derived/computed state
  based on the existing `due date` and `completed` attributes, not stored data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify all overdue todos in their list within 3 seconds of opening the
  app, without inspecting individual due dates.
- **SC-002**: 100% of incomplete todos with a past due date show the overdue indicator; 0% of
  completed todos or todos with a future/no due date show it.
- **SC-003**: Overdue status is accurate as of the current date every time the todo list is
  loaded, with no manual refresh action required by the user.

## Assumptions

- The application already tracks a due date and a completed/incomplete status per todo (per
  existing functional requirements); this feature adds a derived overdue indicator only.
- "Overdue" is defined relative to the current date on the device/server the application already
  uses for date handling; no new time-zone handling is introduced.
- No new due-date reminder, notification, sorting, or filtering behavior is required — this feature
  is limited to a per-item visual indicator, consistent with the todo app's existing scope
  (`docs/functional-requirements.md`), which excludes advanced filtering and notifications (see
  Clarifications for the confirmed decisions on ordering and aggregate badges).
- Visual treatment reuses the existing UI guidelines (`docs/ui-guidelines.md`) danger color token
  rather than introducing new design tokens (see Clarifications).
