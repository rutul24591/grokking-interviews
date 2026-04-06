import { memo } from 'react';
import type { RowData, Column } from '../lib/table-types';
import { TableCell } from './table-cell';

interface TableRowProps<T extends RowData> {
  row: T;
  rowId: string;
  index: number;
  columns: Column<T>[];
  columnWidths: Record<string, number>;
  isSelected: boolean;
  onToggleSelect: (rowId: string, index: number, shiftKey: boolean) => void;
  offsetY?: number;
  rowHeight?: number;
}

function TableRowImpl<T extends RowData>({
  row,
  rowId,
  index,
  columns,
  columnWidths,
  isSelected,
  onToggleSelect,
  offsetY,
  rowHeight = 40,
}: TableRowProps<T>) {
  const visibleColumns = columns.filter((c) => c.field !== undefined);

  return (
    <tr
      className={`border-b border-theme transition-colors ${
        isSelected
          ? 'bg-accent/10 hover:bg-accent/20'
          : 'bg-panel hover:bg-panel-hover'
      }`}
      style={offsetY !== undefined ? { transform: `translateY(${offsetY}px)`, height: rowHeight } : {}}
      role="row"
      aria-selected={isSelected}
    >
      <td
        className="w-12 border-r border-theme px-3 py-2 text-center"
        style={{ height: rowHeight }}
        role="cell"
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onToggleSelect(rowId, index, e.shiftKey)}
          className="h-4 w-4 rounded border-theme bg-panel text-accent focus:ring-accent"
          aria-label={`Select row ${index + 1}`}
        />
      </td>
      {visibleColumns.map((col) => (
        <TableCell
          key={col.field}
          column={col}
          value={row[col.field]}
          row={row}
          width={columnWidths[col.field] ?? col.width ?? 150}
        />
      ))}
    </tr>
  );
}

/**
 * Memoized table row.
 * Only re-renders when row data, selection state, or visible columns change.
 */
export const TableRow = memo(TableRowImpl) as typeof TableRowImpl;
