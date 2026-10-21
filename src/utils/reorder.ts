export interface OrderUpdate {
  id: string;
  order: number;
}

export function computeOrders(
  ids: string[],
  base: number = Date.now(),
): OrderUpdate[] {
  return ids.map((id, index) => ({ id, order: base - index }));
}