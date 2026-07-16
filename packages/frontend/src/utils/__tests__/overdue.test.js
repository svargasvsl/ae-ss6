import { isOverdue } from '../overdue';

describe('isOverdue', () => {
  const today = new Date(2026, 6, 16); // 2026-07-16, matches Date constructor (month is 0-indexed)

  it('returns true for an incomplete todo due yesterday', () => {
    const todo = { dueDate: '2026-07-15', completed: 0 };
    expect(isOverdue(todo, today)).toBe(true);
  });

  it('returns false for an incomplete todo due today', () => {
    const todo = { dueDate: '2026-07-16', completed: 0 };
    expect(isOverdue(todo, today)).toBe(false);
  });

  it('returns false for an incomplete todo due tomorrow', () => {
    const todo = { dueDate: '2026-07-17', completed: 0 };
    expect(isOverdue(todo, today)).toBe(false);
  });

  it('returns false for a todo with no due date', () => {
    const todo = { dueDate: null, completed: 0 };
    expect(isOverdue(todo, today)).toBe(false);
  });

  it('returns false for a completed todo due in the past', () => {
    const todo = { dueDate: '2026-07-15', completed: 1 };
    expect(isOverdue(todo, today)).toBe(false);
  });
});
