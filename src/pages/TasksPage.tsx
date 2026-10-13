import { useAuth } from '../hooks/useAuth';
import { logout } from '../services/authService';

export default function TasksPage() {
  const { user } = useAuth();

  return (
    <header className="card topbar">
      <strong>{user?.email}</strong>
      <button className="secondary" onClick={logout}>
        Cerrar sesión
      </button>
    </header>
  );
}