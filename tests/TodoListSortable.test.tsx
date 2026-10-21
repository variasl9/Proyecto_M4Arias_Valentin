import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TodoList } from '../src/components/TodoList';
import type { Task } from '../src/types';

const tasks: Task[] = [
  {
    id: '1',
    userId: 'u1',
    title: 'Tarea uno',
    description: '',
    completed: false,
    createdAt: 2,
    priority: 'medium',
    dueDate: null,
  },
  {
    id: '2',
    userId: 'u1',
    title: 'Tarea dos',
    description: '',
    completed: false,
    createdAt: 1,
    priority: 'medium',
    dueDate: null,
  },
];

describe('TodoList con arrastre', () => {
  it('muestra un asa por tarea cuando es ordenable', () => {
    render(
      <TodoList
        tasks={tasks}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        sortable
        onReorder={vi.fn()}
      />,
    );

    expect(
      screen.getAllByRole('button', { name: /arrastrar tarea/i }),
    ).toHaveLength(2);
  });

  it('no muestra asas cuando no es ordenable', () => {
    render(
      <TodoList
        tasks={tasks}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole('button', { name: /arrastrar tarea/i }),
    ).not.toBeInTheDocument();
  });
});