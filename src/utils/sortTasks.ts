import type { Task, TaskPriority, TaskSort } from '../types';

const priorityWeight: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const orderOf = (task: Task) => task.order ?? task.createdAt;

export function sortTasks(tasks: Task[], sort: TaskSort): Task[] {
  const copy = [...tasks];

  if (sort === 'priority') {
    return copy.sort(
      (a, b) =>
        priorityWeight[a.priority] - priorityWeight[b.priority] ||
        b.createdAt - a.createdAt,
    );
  }

  if (sort === 'dueDate') {
    return copy.sort((a, b) => {
      if (a.dueDate === b.dueDate) return b.createdAt - a.createdAt;
      if (a.dueDate === null) return 1;
      if (b.dueDate === null) return -1;
      return a.dueDate < b.dueDate ? -1 : 1;
    });
  }

  if (sort === 'manual') {
    return copy.sort((a, b) => orderOf(b) - orderOf(a));
  }

  return copy.sort((a, b) => b.createdAt - a.createdAt);
}