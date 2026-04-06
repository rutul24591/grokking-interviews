'use client';
import { useState, useCallback, useRef } from 'react';
import type { Cell } from './lib/spreadsheet-types';

export function Spreadsheet({ rows = 20, cols = 10 }: { rows?: number; cols?: number }) {
  const [cells, setCells] = useState<Map<string, Cell>>(new Map());
  const [selection, setSelection] = useState({ row: 0, col: 0 });
  const [editing, setEditing] = useState<string | null>(null);

  const cellId = (r: number, c: number) => `${String.fromCharCode(65 + c)}${r + 1}`;

  const evaluateCell = useCallback((cell: Cell): string => {
    if (!cell.formula && !cell.value.startsWith('=')) return cell.value;
    const formula = cell.formula || cell.value;
    try {
      if (formula.startsWith('=SUM(')) {
        const range = formula.match(/\(([^)]+)\)/)?.[1] || '';
        const [start, end] = range.split(':');
        let sum = 0;
        // Simplified - in production parse the range properly
        return String(sum);
      }
      return formula.slice(1);
    } catch { return '#ERROR!'; }
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (editing) return;
    const { row, col } = selection;
    if (e.key === 'ArrowUp') setSelection({ row: Math.max(0, row - 1), col });
    else if (e.key === 'ArrowDown') setSelection({ row: Math.min(rows - 1, row + 1), col });
    else if (e.key === 'ArrowLeft') setSelection({ row, col: Math.max(0, col - 1) });
    else if (e.key === 'ArrowRight') setSelection({ row, col: Math.min(cols - 1, col + 1) });
    else if (e.key === 'Enter' || e.key === 'F2') { setEditing(cellId(row, col)); }
  };

  return (
    <div className="overflow-auto border border-gray-300 dark:border-gray-600 rounded" onKeyDown={onKeyDown} tabIndex={0}>
      <table className="border-collapse">
        <thead>
          <tr><th className="w-10 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600" /></tr>
          {Array.from({ length: cols }, (_, c) => <th key={c} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs font-medium">{String.fromCharCode(65 + c)}</th>)}
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, r) => (
            <tr key={r}>
              <td className="text-center text-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 font-medium">{r + 1}</td>
              {Array.from({ length: cols }, (_, c) => {
                const id = cellId(r, c);
                const cell = cells.get(id);
                const isSelected = selection.row === r && selection.col === c;
                const isEditing = editing === id;
                return (
                  <td key={c} className={`border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-sm ${isSelected ? 'ring-2 ring-blue-500' : ''}`} onClick={() => { setSelection({ row: r, col: c }); setEditing(id); }} onBlur={() => setEditing(null)}>
                    {isEditing ? (
                      <input autoFocus defaultValue={cell?.formula || cell?.value || ''} onBlur={(e) => { const val = e.target.value; setCells((prev) => new Map(prev).set(id, { id, row: r, col: c, value: val, formula: val.startsWith('=') ? val : undefined })); setEditing(null); }} className="w-full outline-none bg-yellow-50 dark:bg-yellow-900" />
                    ) : (
                      <span className="block min-h-[1.25rem]">{cell ? evaluateCell(cell) : ''}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
