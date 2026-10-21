import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Task, TaskInput } from '../types';
import { TodoItem } from './TodoItem';
import { SortableTodoItem } from './SortableTodoItem';

interface Props {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onEdit: (id: string, input: TaskInput) => Promise<void> | void;
  onDelete: (id: string) => void;
  sortable?: boolean;
  onReorder?: (orderedIds: string[]) => void;
}

export function TodoList({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  sortable = false,
  onReorder,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (tasks.length === 0) {
    return <p>No tenés tareas todavía. ¡Creá la primera!</p>;
  }

  if (!sortable) {
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onReorder) return;

    const oldIndex = tasks.findIndex((task) => task.id === active.id);
    const newIndex = tasks.findIndex((task) => task.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(tasks, oldIndex, newIndex).map((task) => task.id));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul>
          {tasks.map((task) => (
            <SortableTodoItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}