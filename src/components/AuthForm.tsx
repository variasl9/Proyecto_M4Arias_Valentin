import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, register, loginWithGoogle } from '../services/authService';
import { getAuthErrorMessage } from '../utils/authErrors';

interface Props {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: Props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isLogin = mode === 'login';

  const run = async (action: () => Promise<unknown>) => {
    setError(null);
    setLoading(true);
    try {
      await action();
      navigate('/tasks');
    } catch (e) {
      setError(getAuthErrorMessage((e as { code?: string }).code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(() => (isLogin ? login(email, password) : register(email, password)));
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h1>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</h1>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Procesando…' : isLogin ? 'Entrar' : 'Registrarme'}
      </button>
      <button
        type="button"
        className="secondary"
        disabled={loading}
        onClick={() => run(loginWithGoogle)}
      >
        Continuar con Google
      </button>

      <p>
        {isLogin ? (
          <>
            ¿No tenés cuenta? <Link to="/register">Registrate</Link>
          </>
        ) : (
          <>
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
          </>
        )}
      </p>
    </form>
  );
}