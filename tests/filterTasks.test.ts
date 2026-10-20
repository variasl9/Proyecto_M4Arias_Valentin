import { describe, it, expect } from 'vitest';
import { filterTasks } from '../src/utils/filterTasks';
import type { Task } from '../src/types';

const tasks: Task[] = [
  {
    id: '1',
    userId: 'u1',
    title: 'Tarea pendiente',
    description: '',
    completed: false,
    createdAt: 2,
    priority: 'medium',
    dueDate: null,
  },
  {
    id: '2',
    userId: 'u1',
    title: 'Tarea completada',
    description: '',
    completed: true,
    createdAt: 1,
    priority: 'medium',
    dueDate: null,
  },
];

describe('filterTasks', () => {
  it('con "all" devuelve todas las tareas', () => {
    expect(filterTasks(tasks, 'all')).toHaveLength(2);
  });

  it('con "pending" devuelve solo las pendientes', () => {
    const result = filterTasks(tasks, 'pending');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('con "completed" devuelve solo las completadas', () => {
    const result = filterTasks(tasks, 'completed');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('no modifica la lista original', () => {
    filterTasks(tasks, 'pending');
    expect(tasks).toHaveLength(2);
  });
});