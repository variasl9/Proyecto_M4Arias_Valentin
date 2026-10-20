import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { logout } from '../services/authService';
import { filterTasks } from '../utils/filterTasks';
import type { TaskFilter } from '../types';
import { TodoForm } from '../components/TodoForm';
import { TodoList } from '../components/TodoList';
import { TaskFilters } from '../components/TaskFilters';
import { SendSummaryButton } from '../components/SendSummaryButton';

export default function TasksPage() {
  const { user } = useAuth();
  const { tasks, loading, error, addTask, editTask, toggleTask, removeTask } =
    useTasks(user!.uid);
  const [filter, setFilter] = useState<TaskFilter>('all');

  const visibleTasks = filterTasks(tasks, filter);

  return (
    <>
      <header className="card topbar">
        <strong>{user?.email}</strong>
        <button className="secondary" onClick={logout}>
          Cerrar sesión
        </button>
      </header>

      <section className="card">
        <h2>Nueva tarea</h2>
        <TodoForm onSubmit={addTask} />
      </section>

      <section className="card">
        <div className="topbar">
          <h2>Mis tareas</h2>
          <SendSummaryButton />
        </div>

        <TaskFilters value={filter} onChange={setFilter} />

        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}

        {loading ? (
          <p>Cargando tareas…</p>
        ) : tasks.length > 0 && visibleTasks.length === 0 ? (
          <p>No hay tareas con este filtro.</p>
        ) : (
          <TodoList
            tasks={visibleTasks}
            onToggle={toggleTask}
            onEdit={editTask}
            onDelete={removeTask}
          />
        )}
      </section>
    </>
  );
}