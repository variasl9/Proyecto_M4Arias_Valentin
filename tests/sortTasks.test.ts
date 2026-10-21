import { describe, it, expect } from 'vitest';
import { sortTasks } from '../src/utils/sortTasks';
import type { Task } from '../src/types';

const makeTask = (overrides: Partial<Task>): Task => ({
  id: 'x',
  userId: 'u1',
  title: 'Tarea',
  description: '',
  completed: false,
  createdAt: 1,
  priority: 'medium',
  dueDate: null,
  ...overrides,
});

const ids = (tasks: Task[]) => tasks.map((task) => task.id);

describe('sortTasks', () => {
  it('con "recent" ordena de la más nueva a la más vieja', () => {
    const tasks = [
      makeTask({ id: 'a', createdAt: 1 }),
      makeTask({ id: 'b', createdAt: 3 }),
      makeTask({ id: 'c', createdAt: 2 }),
    ];

    expect(ids(sortTasks(tasks, 'recent'))).toEqual(['b', 'c', 'a']);
  });

  it('con "priority" pone primero las altas y desempata por más nueva', () => {
    const tasks = [
      makeTask({ id: 'a', priority: 'low', createdAt: 3 }),
      makeTask({ id: 'b', priority: 'high', createdAt: 1 }),
      makeTask({ id: 'c', priority: 'high', createdAt: 2 }),
      makeTask({ id: 'd', priority: 'medium', createdAt: 4 }),
    ];

    expect(ids(sortTasks(tasks, 'priority'))).toEqual(['c', 'b', 'd', 'a']);
  });

  it('con "dueDate" ordena por la fecha más cercana y deja las sin fecha al final', () => {
    const tasks = [
      makeTask({ id: 'a', dueDate: '2026-12-01', createdAt: 1 }),
      makeTask({ id: 'b', dueDate: null, createdAt: 5 }),
      makeTask({ id: 'c', dueDate: '2026-11-01', createdAt: 2 }),
    ];

    expect(ids(sortTasks(tasks, 'dueDate'))).toEqual(['c', 'a', 'b']);
  });

  it('no modifica la lista original', () => {
    const tasks = [
      makeTask({ id: 'a', priority: 'low' }),
      makeTask({ id: 'b', priority: 'high' }),
    ];

    sortTasks(tasks, 'priority');

    expect(ids(tasks)).toEqual(['a', 'b']);
  });
    it('con "manual" ordena por order de mayor a menor', () => {
    const tasks = [
      makeTask({ id: 'a', order: 1 }),
      makeTask({ id: 'b', order: 3 }),
      makeTask({ id: 'c', order: 2 }),
    ];

    expect(ids(sortTasks(tasks, 'manual'))).toEqual(['b', 'c', 'a']);
  });

  it('con "manual" usa createdAt si la tarea no tiene order', () => {
    const tasks = [
      makeTask({ id: 'a', order: 10, createdAt: 1 }),
      makeTask({ id: 'b', createdAt: 20 }),
      makeTask({ id: 'c', createdAt: 5 }),
    ];

    expect(ids(sortTasks(tasks, 'manual'))).toEqual(['b', 'a', 'c']);
  });
});