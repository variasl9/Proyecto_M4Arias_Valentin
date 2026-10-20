import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from '../src/components/TodoForm';

describe('TodoForm', () => {
  it('muestra error y no envía si el título está vacío', async () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    await userEvent.click(
      screen.getByRole('button', { name: /agregar tarea/i }),
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'El título es obligatorio.',
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('envía los datos y limpia el formulario', async () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Título'), 'Estudiar React');
    await userEvent.type(screen.getByLabelText('Descripción'), 'Hooks');
    await userEvent.click(
      screen.getByRole('button', { name: /agregar tarea/i }),
    );

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Estudiar React',
      description: 'Hooks',
    });
    expect(screen.getByLabelText('Título')).toHaveValue('');
  });
});