import { useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import type { Task, TaskInput } from '../types';
import { TodoForm } from './TodoForm';
import { priorityLabels } from '../utils/priority';
import { formatDueDate, isOverdue } from '../utils/dates';

export interface TodoItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (id: string, input: TaskInput) => Promise<void> | void;
  onDelete: (id: string) => void;
  dragHandle?: ReactNode;
  liRef?: Ref<HTMLLIElement>;
  liStyle?: CSSProperties;
}

export function TodoItem({
  task,
  onToggle,
  onEdit,
  onDelete,
  dragHandle,
  liRef,
  liStyle,
}: TodoItemProps) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li ref={liRef} style={liStyle}>
        <TodoForm
          initialValues={{
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate,
          }}
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

  const overdue = isOverdue(task.dueDate, task.completed);

  return (
    <li
      ref={liRef}
      style={liStyle}
      className={`task ${task.completed ? 'done' : ''}`}
    >
      <div className="task-head">
        {dragHandle}
        <h3>{task.title}</h3>
      </div>
      {task.description && <p>{task.description}</p>}

      <p className="meta">
        <span className={`badge ${task.priority}`}>
          Prioridad {priorityLabels[task.priority]}
        </span>
        {task.dueDate && (
          <span className={overdue ? 'due overdue' : 'due'}>
            Vence: {formatDueDate(task.dueDate)}
            {overdue && ' (vencida)'}
          </span>
        )}
      </p>

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