import type { Task, TaskInput } from '../types';
import { TodoItem } from './TodoItem';

interface Props {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onEdit: (id: string, input: TaskInput) => Promise<void> | void;
  onDelete: (id: string) => void;
}

export function TodoList({ tasks, onToggle, onEdit, onDelete }: Props) {
  if (tasks.length === 0) {
    return <p>No tenés tareas todavía. ¡Creá la primera!</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}