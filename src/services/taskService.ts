import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Task, TaskInput } from '../types';
import type { OrderUpdate } from '../utils/reorder';

const tasksCol = collection(db, 'tasks');

export function subscribeToTasks(
  userId: string,
  onData: (tasks: Task[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const q = query(tasksCol, where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          priority: data.priority ?? 'medium',
          dueDate: data.dueDate ?? null,
        } as Task;
      });
      tasks.sort((a, b) => b.createdAt - a.createdAt);
      onData(tasks);
    },
    onError,
  );
}

export const createTask = (userId: string, input: TaskInput) => {
  const now = Date.now();
  return addDoc(tasksCol, {
    ...input,
    userId,
    completed: false,
    createdAt: now,
    order: now,
  });
};

export const updateTask = (
  id: string,
  data: Partial<TaskInput & { completed: boolean }>,
) => updateDoc(doc(db, 'tasks', id), data);

export const deleteTask = (id: string) => deleteDoc(doc(db, 'tasks', id));

export async function reorderTasks(updates: OrderUpdate[]): Promise<void> {
  const batch = writeBatch(db);
  updates.forEach(({ id, order }) => {
    batch.update(doc(db, 'tasks', id), { order });
  });
  await batch.commit();
}