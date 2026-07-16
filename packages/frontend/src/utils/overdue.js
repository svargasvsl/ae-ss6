/**
 * Determines whether a todo is overdue: incomplete, has a due date, and that
 * due date's calendar day is strictly before the reference date's calendar day.
 * @param {{ dueDate: string|null, completed: number|boolean }} todo
 * @param {Date} [referenceDate] - defaults to now; injectable for testing
 * @returns {boolean}
 */
export function isOverdue(todo, referenceDate = new Date()) {
  if (!todo || todo.completed || !todo.dueDate) {
    return false;
  }

  // Parse as calendar-date components (not via `new Date(string)`, which treats
  // "YYYY-MM-DD" as UTC midnight and can shift a day in negative-offset time zones).
  const [year, month, day] = todo.dueDate.split('-').map(Number);
  if (!year || !month || !day) {
    return false;
  }
  const dueDay = new Date(year, month - 1, day);
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  return dueDay < today;
}
