import type { TaskPriority } from '../types';

export const priorityLabels: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

export const priorityOptions: TaskPriority[] = ['low', 'medium', 'high'];