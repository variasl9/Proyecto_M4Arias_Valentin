import { useState } from 'react';
import type { Task, TaskInput } from '../types';
import { TodoForm } from './TodoForm';

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (id: string, input: TaskInput) => Promise<void> | void;
  onDelete: (id: string) => void;
}

export function TodoItem({ task, onToggle, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li>
        <TodoForm
          initialValues={{ title: task.title, description: task.description }}
          submitLabel="Guardar"
          onCancel={() => setEditing(false)}
          onSubmit={async (input) => {
            await onEdit(task.id, input);
            setEditing(false);
          }}
        />
      </li>
    );
  }

  return (
    <li className={`task ${task.completed ? 'done' : ''}`}>
      <h3>{task.title}</h3>
      {task.description && <p>{task.description}</p>}

      <div className="actions">
        <button className="secondary" onClick={() => onToggle(task)}>
          {task.completed ? 'Marcar pendiente' : 'Marcar completada'}
        </button>
        <button className="secondary" onClick={() => setEditing(true)}>
          Editar
        </button>
        <button className="danger" onClick={() => onDelete(task.id)}>
          Eliminar
        </button>
      </div>
    </li>
  );
}