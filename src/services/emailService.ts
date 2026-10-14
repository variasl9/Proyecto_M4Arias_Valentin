import { auth } from './firebase';

export async function sendTasksSummary(): Promise<void> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('No autenticado');

  const response = await fetch('/api/send-summary', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? 'Error al enviar el email.');
  }
}