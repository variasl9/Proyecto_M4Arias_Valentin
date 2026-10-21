import { describe, it, expect } from 'vitest';
import { computeOrders } from '../src/utils/reorder';

describe('computeOrders', () => {
  it('asigna números que bajan de a uno a partir de la base', () => {
    expect(computeOrders(['a', 'b', 'c'], 100)).toEqual([
      { id: 'a', order: 100 },
      { id: 'b', order: 99 },
      { id: 'c', order: 98 },
    ]);
  });

  it('mantiene los id en el mismo orden en que llegaron', () => {
    const result = computeOrders(['z', 'x', 'y'], 50);
    expect(result.map((update) => update.id)).toEqual(['z', 'x', 'y']);
  });

  it('devuelve una lista vacía si no hay tareas', () => {
    expect(computeOrders([], 100)).toEqual([]);
  });
});