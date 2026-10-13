import { useState, type FormEvent } from 'react';
import type { TaskInput } from '../types';
import { validateTitle } from '../utils/validators';

interface Props {
  onSubmit: (input: TaskInput) => Promise<void> | void;
  initialValues?: TaskInput;
  submitLabel?: string;
  onCancel?: () => void;
}

export function TodoForm({
  onSubmit,
  initialValues,
  submitLabel = 'Agregar tarea',
  onCancel,
}: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(
    initialValues?.description ?? '',
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validation = validateTitle(title);
    if (validation) {
      setError(validation);
      return;
    }

    setError(null);
    await onSubmit({ title: title.trim(), description: description.trim() });

    if (!initialValues) {
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task">
      <label htmlFor="title">Título</label>
      <input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="description">Descripción</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}

      <div className="actions">
        <button type="submit">{submitLabel}</button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}