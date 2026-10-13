export function validateTitle(title: string): string | null {
  const trimmed = title.trim();
  if (!trimmed) return 'El título es obligatorio.';
  if (trimmed.length > 100) return 'El título no puede superar los 100 caracteres.';
  return null;
}