import { memo } from 'react';
import type { RowData, Column } from '../lib/table-types';

interface TableCellProps<T extends RowData> {
  column: Column<T>;
  value: T[keyof T];
  row: T;
  width: number;
}

function TableCellImpl<T extends RowData>({
  column,
  value,
  row,
  width,
}: TableCellProps<T>) {
  const content = column.render ? column.render(value, row) : String(value ?? '');

  return (
    <td
      className="truncate whitespace-nowrap border-r border-theme px-3 py-2 text-sm"
      style={{ width, maxWidth: width }}
      title={typeof content === 'string' ? content : undefined}
      role="cell"
    >
      {content}
    </td>
  );
}

/**
 * Memoized table cell.
 * Only re-renders when the cell value or column render function changes.
 */
export const TableCell = memo(TableCellImpl) as typeof TableCellImpl;
