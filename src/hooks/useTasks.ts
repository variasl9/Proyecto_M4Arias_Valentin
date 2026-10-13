import { useCallback, useEffect, useState } from 'react';
import type { Task, TaskInput } from '../types';
import * as taskService from '../services/taskService';

export function useTasks(userId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    return taskService.subscribeToTasks(
      userId,
      (data) => {
        setTasks(data);
        setError(null);
        setLoading(false);
      },
      () => {
        setError('No pudimos cargar tus tareas.');
        setLoading(false);
      },
    );
  }, [userId]);

  const safe = useCallback(
    async (action: () => Promise<unknown>, message: string) => {
      try {
        setError(null);
        await action();
      } catch {
        setError(message);
      }
    },
    [],
  );

  return {
    tasks,
    loading,
    error,
    addTask: (input: TaskInput) =>
      safe(
        () => taskService.createTask(userId, input),
        'No se pudo crear la tarea.',
      ),
    editTask: (id: string, input: TaskInput) =>
      safe(
        () => taskService.updateTask(id, input),
        'No se pudo editar la tarea.',
      ),
    toggleTask: (task: Task) =>
      safe(
        () => taskService.updateTask(task.id, { completed: !task.completed }),
        'No se pudo actualizar la tarea.',
      ),
    removeTask: (id: string) =>
      safe(
        () => taskService.deleteTask(id),
        'No se pudo eliminar la tarea.',
      ),
  };
}