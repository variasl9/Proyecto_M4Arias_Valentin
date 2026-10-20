import type { TaskSort } from '../types';

interface Props {
  value: TaskSort;
  onChange: (sort: TaskSort) => void;
}

const options: { value: TaskSort; label: string }[] = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'priority', label: 'Prioridad (alta primero)' },
  { value: 'dueDate', label: 'Fecha de vencimiento' },
];

export function TaskSortSelect({ value, onChange }: Props) {
  return (
    <div>
      <label htmlFor="sort">Ordenar por</label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value as TaskSort)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}