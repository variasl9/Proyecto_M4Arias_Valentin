import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from '../src/components/TodoList';
import type { Task } from '../src/types';

const tasks: Task[] = [
  {
    id: '1',
    userId: 'u1',
    title: 'Tarea uno',
    description: 'desc',
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
    completed: true,
    createdAt: 1,
    priority: 'medium',
    dueDate: null,
  },
];

describe('TodoList', () => {
  it('muestra un mensaje cuando no hay tareas', () => {
    render(
      <TodoList
        tasks={[]}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText(/no tenés tareas/i)).toBeInTheDocument();
  });

  it('renderiza las tareas y dispara onDelete y onToggle', async () => {
    const onDelete = vi.fn();
    const onToggle = vi.fn();

    render(
      <TodoList
        tasks={tasks}
        onToggle={onToggle}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText('Tarea uno')).toBeInTheDocument();
    expect(screen.getByText('Tarea dos')).toBeInTheDocument();

    await userEvent.click(
      screen.getAllByRole('button', { name: /eliminar/i })[0],
    );
    expect(onDelete).toHaveBeenCalledWith('1');

    await userEvent.click(
      screen.getByRole('button', { name: /marcar completada/i }),
    );
    expect(onToggle).toHaveBeenCalledWith(tasks[0]);
  });
});