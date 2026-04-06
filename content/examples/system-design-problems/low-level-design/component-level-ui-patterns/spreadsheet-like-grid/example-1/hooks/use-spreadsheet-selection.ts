'use client';
import { useState, useCallback, useRef, type MouseEvent as ReactMouseEvent } from 'react';

interface CellCoord {
  row: number;
  col: number;
}

interface SelectionRange {
  start: CellCoord;
  end: CellCoord;
}

interface UseSpreadsheetSelectionOptions {
  rows: number;
  cols: number;
  onSelectionChange?: (selection: CellCoord[]) => void;
}

interface UseSpreadsheetSelectionReturn {
  selection: CellCoord;
  selectionRanges: SelectionRange[];
  selectedCells: Set<string>;
  isSelecting: boolean;
  setSelection: (coord: CellCoord) => void;
  handleCellClick: (e: ReactMouseEvent, row: number, col: number) => void;
  handleCellMouseEnter: (row: number, col: number) => void;
  handleCellMouseDown: (row: number, col: number) => void;
  handleCellMouseUp: () => void;
  clearSelection: () => void;
  cellId: (row: number, col: number) => string;
  parseCellId: (id: string) => CellCoord | null;
}

function coordsEqual(a: CellCoord, b: CellCoord): boolean {
  return a.row === b.row && a.col === b.col;
}

function cellKey(row: number, col: number): string {
  return `${row},${col}`;
}

export function useSpreadsheetSelection({
  rows,
  cols,
  onSelectionChange,
}: UseSpreadsheetSelectionOptions): UseSpreadsheetSelectionReturn {
  const [selection, setSelectionState] = useState<CellCoord>({ row: 0, col: 0 });
  const [selectionRanges, setSelectionRanges] = useState<SelectionRange[]>([
    { start: { row: 0, col: 0 }, end: { row: 0, col: 0 } },
  ]);
  const [isSelecting, setIsSelecting] = useState(false);
  const anchorRef = useRef<CellCoord>({ row: 0, col: 0 });
  const ctrlKeysRef = useRef<Set<string>>(new Set());

  const cellId = useCallback((r: number, c: number) => `${String.fromCharCode(65 + c)}${r + 1}`, []);

  const parseCellId = useCallback((id: string): CellCoord | null => {
    const match = id.match(/^([A-Z]+)(\d+)$/);
    if (!match) return null;
    const col = match[1].charCodeAt(0) - 65;
    const row = parseInt(match[2], 10) - 1;
    return { row, col };
  }, []);

  const computeSelectedCells = useCallback(
    (ranges: SelectionRange[]): Set<string> => {
      const cells = new Set<string>();
      for (const range of ranges) {
        const minRow = Math.min(range.start.row, range.end.row);
        const maxRow = Math.max(range.start.row, range.end.row);
        const minCol = Math.min(range.start.col, range.end.col);
        const maxCol = Math.max(range.start.col, range.end.col);
        for (let r = minRow; r <= maxRow; r++) {
          for (let c = minCol; c <= maxCol; c++) {
            cells.add(cellKey(r, c));
          }
        }
      }
      return cells;
    },
    []
  );

  const setSelection = useCallback(
    (coord: CellCoord) => {
      const clamped = {
        row: Math.max(0, Math.min(rows - 1, coord.row)),
        col: Math.max(0, Math.min(cols - 1, coord.col)),
      };
      setSelectionState(clamped);
      const newRanges = [{ start: clamped, end: clamped }];
      setSelectionRanges(newRanges);
      ctrlKeysRef.current.clear();
      onSelectionChange?.([clamped]);
    },
    [rows, cols, onSelectionChange]
  );

  const handleCellMouseDown = useCallback(
    (row: number, col: number) => {
      const coord = { row, col };
      anchorRef.current = coord;
      setIsSelecting(true);
      setSelectionRanges([{ start: coord, end: coord }]);
    },
    []
  );

  const handleCellMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!isSelecting) return;
      setSelectionRanges((prev) => {
        // If we have ctrl-multi selection, update the last range
        const ranges = [...prev];
        if (ranges.length > 0 && ctrlKeysRef.current.size > 0) {
          ranges[ranges.length - 1] = { start: anchorRef.current, end: { row, col } };
        } else {
          ranges[0] = { start: anchorRef.current, end: { row, col } };
        }
        return ranges;
      });
    },
    [isSelecting]
  );

  const handleCellMouseUp = useCallback(() => {
    setIsSelecting(false);
  }, []);

  const handleCellClick = useCallback(
    (e: ReactMouseEvent, row: number, col: number) => {
      const coord = { row, col };

      if (e.shiftKey) {
        // Range selection from anchor
        setSelectionRanges((prev) => {
          const anchor = anchorRef.current;
          const newRanges = [...prev];
          if (newRanges.length === 0) {
            newRanges.push({ start: anchor, end: coord });
          } else {
            newRanges[newRanges.length - 1] = { start: anchor, end: coord };
          }
          return newRanges;
        });
        setSelectionState(coord);
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        // Multi-selection: add new single-cell selection
        const key = cellKey(row, col);
        if (ctrlKeysRef.current.has(key)) {
          ctrlKeysRef.current.delete(key);
        } else {
          ctrlKeysRef.current.add(key);
        }
        const newRange = { start: coord, end: coord };
        setSelectionRanges((prev) => [...prev, newRange]);
        anchorRef.current = coord;
        setSelectionState(coord);
        return;
      }

      // Normal click: single cell selection
      setSelection(coord);
    },
    []
  );

  const clearSelection = useCallback(() => {
    setSelectionState({ row: 0, col: 0 });
    setSelectionRanges([{ start: { row: 0, col: 0 }, end: { row: 0, col: 0 } }]);
    ctrlKeysRef.current.clear();
    anchorRef.current = { row: 0, col: 0 };
    onSelectionChange?.([{ row: 0, col: 0 }]);
  }, [onSelectionChange]);

  // Compute selected cells set
  const selectedCells = computeSelectedCells(selectionRanges);

  return {
    selection,
    selectionRanges,
    selectedCells,
    isSelecting,
    setSelection,
    handleCellClick,
    handleCellMouseEnter,
    handleCellMouseDown,
    handleCellMouseUp,
    clearSelection,
    cellId,
    parseCellId,
  };
}
