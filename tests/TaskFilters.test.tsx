import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskFilters } from '../src/components/TaskFilters';

describe('TaskFilters', () => {
  it('marca como activo el filtro seleccionado', () => {
    render(<TaskFilters value="pending" onChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Pendientes' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Todas' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('llama a onChange con el filtro elegido', async () => {
    const onChange = vi.fn();
    render(<TaskFilters value="all" onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Completadas' }));

    expect(onChange).toHaveBeenCalledWith('completed');
  });
});