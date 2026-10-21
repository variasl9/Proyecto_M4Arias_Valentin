import type { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TodoItem, type TodoItemProps } from './TodoItem';

type Props = Omit<TodoItemProps, 'dragHandle' | 'liRef' | 'liStyle'>;

export function SortableTodoItem(props: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.task.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    position: 'relative',
    zIndex: isDragging ? 1 : undefined,
  };

  return (
    <TodoItem
      {...props}
      liRef={setNodeRef}
      liStyle={style}
      dragHandle={
        <button
          type="button"
          className="secondary handle"
          aria-label="Arrastrar tarea"
          {...attributes}
          {...listeners}
        >
          ⠿
        </button>
      }
    />
  );
}