import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Task, TaskInput } from '../types';

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
      const tasks = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Task,
      );
      tasks.sort((a, b) => b.createdAt - a.createdAt);
      onData(tasks);
    },
    onError,
  );
}

export const createTask = (userId: string, input: TaskInput) =>
  addDoc(tasksCol, {
    ...input,
    userId,
    completed: false,
    createdAt: Date.now(),
  });

export const updateTask = (
  id: string,
  data: Partial<TaskInput & { completed: boolean }>,
) => updateDoc(doc(db, 'tasks', id), data);

export const deleteTask = (id: string) => deleteDoc(doc(db, 'tasks', id));