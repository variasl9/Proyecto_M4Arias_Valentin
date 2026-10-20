import { describe, it, expect } from 'vitest';
import { formatDueDate, isOverdue, todayString } from '../src/utils/dates';

describe('todayString', () => {
  it('devuelve la fecha de hoy con formato AAAA-MM-DD', () => {
    expect(todayString()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('formatDueDate', () => {
  it('convierte AAAA-MM-DD a DD/MM/AAAA', () => {
    expect(formatDueDate('2026-10-20')).toBe('20/10/2026');
  });
});

describe('isOverdue', () => {
  const today = '2026-10-20';

  it('es true si la fecha pasó y la tarea no está completada', () => {
    expect(isOverdue('2026-10-19', false, today)).toBe(true);
  });

  it('es false si la tarea ya está completada', () => {
    expect(isOverdue('2026-10-19', true, today)).toBe(false);
  });

  it('es false si no tiene fecha', () => {
    expect(isOverdue(null, false, today)).toBe(false);
  });

  it('es false si vence hoy', () => {
    expect(isOverdue('2026-10-20', false, today)).toBe(false);
  });

  it('es false si vence en el futuro', () => {
    expect(isOverdue('2026-10-21', false, today)).toBe(false);
  });
});