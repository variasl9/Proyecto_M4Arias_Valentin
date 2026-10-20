export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
  priority: TaskPriority;
  dueDate: string | null;
}

export type TaskInput = Pick<
  Task,
  'title' | 'description' | 'priority' | 'dueDate'
>;

export type TaskFilter = 'all' | 'pending' | 'completed';
export type TaskSort = 'recent' | 'priority' | 'dueDate';