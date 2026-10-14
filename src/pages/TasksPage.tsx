import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { logout } from '../services/authService';
import { TodoForm } from '../components/TodoForm';
import { TodoList } from '../components/TodoList';
import { SendSummaryButton } from '../components/SendSummaryButton';

export default function TasksPage() {
  const { user } = useAuth();
  const { tasks, loading, error, addTask, editTask, toggleTask, removeTask } =
    useTasks(user!.uid);

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

        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}

        {loading ? (
          <p>Cargando tareas…</p>
        ) : (
          <TodoList
            tasks={tasks}
            onToggle={toggleTask}
            onEdit={editTask}
            onDelete={removeTask}
          />
        )}
      </section>
    </>
  );
}