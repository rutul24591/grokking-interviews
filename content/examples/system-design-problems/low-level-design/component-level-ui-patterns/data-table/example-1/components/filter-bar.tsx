import { useState, useCallback, useEffect, useRef } from 'react';
import type { RowData, Column, FilterConfig } from '../lib/table-types';
import type { UseStoreApi } from 'zustand';

interface FilterBarProps<T extends RowData> {
  columns: Column<T>[];
  store: UseStoreApi<{
    filters: Map<string, FilterConfig>;
    setFilter: (config: FilterConfig) => void;
    clearFilter: (field: string) => void;
    clearAllFilters: () => void;
    hiddenColumns: Set<string>;
  }>;
}

/**
 * Filter bar component rendered above the table.
 * Provides text inputs, range inputs, and multi-select dropdowns per filterable column.
 */
export function FilterBar<T extends RowData>({
  columns,
  store,
}: FilterBarProps<T>) {
  const filters = store((s) => s.filters);
  const setFilter = store((s) => s.setFilter);
  const clearFilter = store((s) => s.clearFilter);
  const clearAllFilters = store((s) => s.clearAllFilters);
  const hiddenColumns = store((s) => s.hiddenColumns);

  const visibleColumns = columns.filter(
    (c) => c.filterable && !hiddenColumns.has(c.field),
  );

  return (
    <div className="flex flex-wrap gap-3 px-4 py-3 border-b border-theme bg-panel-soft/50">
      {visibleColumns.map((col) => {
        const filterType = col.filterType ?? deriveFilterType(col.type);
        const currentFilter = filters.get(col.field);

        return (
          <div key={col.field} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted">{col.label}</label>

            {filterType === 'text' && (
              <TextFilter
                value={(currentFilter?.value as string) ?? ''}
                onChange={(value) =>
                  setFilter({ field: col.field, type: 'text', value })
                }
                onClear={() => clearFilter(col.field)}
                placeholder={`Filter ${col.label}...`}
              />
            )}

            {filterType === 'range' && (
              <RangeFilter
                min={currentFilter?.min as number | undefined}
                max={currentFilter?.max as number | undefined}
                onChange={(min, max) =>
                  setFilter({ field: col.field, type: 'range', min, max })
                }
                onClear={() => clearFilter(col.field)}
              />
            )}

            {filterType === 'multi-select' && col.enumValues && (
              <MultiSelectFilter
                options={col.enumValues}
                selected={currentFilter?.selectedValues ?? new Set()}
                onChange={(selectedValues) =>
                  setFilter({ field: col.field, type: 'multi-select', selectedValues })
                }
                onClear={() => clearFilter(col.field)}
              />
            )}
          </div>
        );
      })}

      {filters.size > 0 && (
        <div className="flex items-end">
          <button
            onClick={clearAllFilters}
            className="text-sm text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded px-2 py-1"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

/** Derive filter type from column data type */
function deriveFilterType(type: string): 'text' | 'range' | 'multi-select' {
  switch (type) {
    case 'number':
      return 'range';
    case 'date':
      return 'range';
    case 'enum':
      return 'multi-select';
    default:
      return 'text';
  }
}

/** Text filter with debounce */
function TextFilter({
  value,
  onChange,
  onClear,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder: string;
}) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce: apply filter after 300ms of no typing
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [localValue, onChange]);

  // Sync external value changes (e.g., clear all)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="relative">
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-48 text-sm rounded border border-theme bg-panel px-2 py-1 pr-6 focus:outline-none focus:ring-2 focus:ring-accent"
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue('');
            onClear();
          }}
          className="absolute right-1 top-1/2 -translate-y-1/2 text-muted hover:text-accent"
          aria-label="Clear filter"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </div>
  );
}

/** Range filter for numbers and dates */
function RangeFilter({
  min,
  max,
  onChange,
  onClear,
}: {
  min?: number;
  max?: number;
  onChange: (min: number | undefined, max: number | undefined) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={min ?? ''}
        placeholder="Min"
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : undefined, max)
        }
        className="w-20 text-sm rounded border border-theme bg-panel px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label="Minimum value"
      />
      <span className="text-muted text-xs">&ndash;</span>
      <input
        type="number"
        value={max ?? ''}
        placeholder="Max"
        onChange={(e) =>
          onChange(min, e.target.value ? Number(e.target.value) : undefined)
        }
        className="w-20 text-sm rounded border border-theme bg-panel px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label="Maximum value"
      />
      {(min !== undefined || max !== undefined) && (
        <button
          onClick={onClear}
          className="text-muted hover:text-accent p-1"
          aria-label="Clear range filter"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </div>
  );
}

/** Multi-select filter with checkboxes */
function MultiSelectFilter({
  options,
  selected,
  onChange,
  onClear,
}: {
  options: string[];
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
  onClear: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleValue = useCallback(
    (value: string) => {
      const next = new Set(selected);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      onChange(next.size > 0 ? next : new Set());
    },
    [selected, onChange],
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-48 text-sm text-left rounded border border-theme bg-panel px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent truncate"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {selected.size === 0
          ? 'All values'
          : `${selected.size} selected`}
      </button>

      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-56 max-h-60 overflow-y-auto rounded-lg border border-theme bg-panel shadow-lg p-2"
          role="listbox"
          aria-multiselectable="true"
        >
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-panel-hover cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={selected.has(option)}
                onChange={() => toggleValue(option)}
                className="h-4 w-4 rounded border-theme text-accent focus:ring-accent"
              />
              <span className="truncate">{option}</span>
            </label>
          ))}

          {selected.size > 0 && (
            <button
              onClick={() => {
                onChange(new Set());
                onClear();
              }}
              className="w-full text-left text-sm text-accent hover:underline px-2 py-1 mt-1 border-t border-theme"
            >
              Clear selection
            </button>
          )}
        </div>
      )}
    </div>
  );
}
