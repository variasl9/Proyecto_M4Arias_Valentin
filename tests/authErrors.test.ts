import { describe, it, expect } from 'vitest';
import { getAuthErrorMessage } from '../src/utils/authErrors';

describe('getAuthErrorMessage', () => {
  it('traduce códigos conocidos', () => {
    expect(getAuthErrorMessage('auth/email-already-in-use')).toBe(
      'Ya existe una cuenta con ese email.',
    );
  });

  it('devuelve un mensaje genérico para códigos desconocidos', () => {
    expect(getAuthErrorMessage('auth/algo-raro')).toContain('error inesperado');
  });
});