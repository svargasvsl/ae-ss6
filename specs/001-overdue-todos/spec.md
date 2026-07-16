# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todos`

**Created**: 2026-07-16

**Status**: Draft

**Input**: User description: "As a todo application user I want to easily identify and distinguish overdue tasks in my todo list so that I can prioritize my work and quickly see which tasks are past their due date."

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
  as overdue until the day has fully passed.
- What happens when a completed todo has a due date in the past? It MUST NOT be shown as overdue,
  since overdue status only applies to incomplete work.
- What happens when a todo has no due date? It MUST never be marked overdue.
- How does the system handle a due date that is edited to a past date on an incomplete todo? The
  todo MUST immediately be reflected as overdue the next time the list is displayed.
- How does the system handle todos across time zones? Use the same date/time basis the
  application already uses elsewhere (e.g., server or browser local date) for consistency; this is
  not expected to change existing due-date handling.

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
- No new due-date reminder, notification, or sorting/filtering behavior is required — this feature
  is limited to a visual indicator, consistent with the todo app's existing scope
  (`docs/functional-requirements.md`), which excludes advanced filtering and notifications.
- Visual treatment should reuse the existing UI guidelines (`docs/ui-guidelines.md`) color palette
  (e.g., the existing danger/accent colors) rather than introducing new design tokens.
