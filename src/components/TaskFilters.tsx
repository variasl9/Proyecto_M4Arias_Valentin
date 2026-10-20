import type { TaskFilter } from '../types';

interface Props {
  value: TaskFilter;
  onChange: (filter: TaskFilter) => void;
}

const options: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'completed', label: 'Completadas' },
];

export function TaskFilters({ value, onChange }: Props) {
  return (
    <div className="actions" role="group" aria-label="Filtrar tareas">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={value === option.value ? '' : 'secondary'}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}