import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { logout } from '../services/authService';
import { filterTasks } from '../utils/filterTasks';
import { sortTasks } from '../utils/sortTasks';
import type { TaskFilter, TaskSort } from '../types';
import { TodoForm } from '../components/TodoForm';
import { TodoList } from '../components/TodoList';
import { TaskFilters } from '../components/TaskFilters';
import { TaskSortSelect } from '../components/TaskSortSelect';
import { SendSummaryButton } from '../components/SendSummaryButton';

export default function TasksPage() {
  const { user } = useAuth();
  const { tasks, loading, error, addTask, editTask, toggleTask, removeTask } =
    useTasks(user!.uid);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sort, setSort] = useState<TaskSort>('recent');

  const visibleTasks = sortTasks(filterTasks(tasks, filter), sort);

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
        <TaskSortSelect value={sort} onChange={setSort} />

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