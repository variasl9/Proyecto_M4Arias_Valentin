import { useState } from 'react';
import { sendTasksSummary } from '../services/emailService';

type Status = 'idle' | 'sending' | 'ok' | 'error';

export function SendSummaryButton() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const handleClick = async () => {
    setStatus('sending');
    try {
      await sendTasksSummary();
      setStatus('ok');
      setMessage('¡Resumen enviado a tu email!');
    } catch (e) {
      setStatus('error');
      setMessage((e as Error).message);
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando…' : 'Enviar resumen por email'}
      </button>

      {status === 'ok' && <p className="success">{message}</p>}
      {status === 'error' && (
        <p role="alert" className="error">
          {message}
        </p>
      )}
    </div>
  );
}