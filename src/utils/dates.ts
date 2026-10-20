export function todayString(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function formatDueDate(date: string): string {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

export function isOverdue(
  dueDate: string | null,
  completed: boolean,
  today: string = todayString(),
): boolean {
  return dueDate !== null && !completed && dueDate < today;
}