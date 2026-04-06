/**
 * Spreadsheet Selection — Click, Shift+Click, Ctrl+Click for cell selection.
 *
 * Interview edge case: User clicks cell A1, then Shift+clicks cell C3. All cells
 * in the rectangle from A1 to C3 should be selected. User then Ctrl+clicks E5 —
 * E5 should be added to the selection without removing A1:C3.
 */

export interface CellRef { row: number; col: number; }

export type SelectionMode = 'single' | 'range' | 'multi';

/**
 * Manages spreadsheet cell selection with range and multi-select support.
 */
export class SpreadsheetSelection {
  private selectedCells: Set<string> = new Set();
  private anchorCell: CellRef | null = null;

  /**
   * Converts a cell reference to a string key.
   */
  private cellKey(cell: CellRef): string {
    return `${cell.row},${cell.col}`;
  }

  /**
   * Handles a cell click. Supports single, range (Shift+click), and multi (Ctrl+click).
   */
  onCellClick(cell: CellRef, isShift: boolean, isCtrl: boolean): Set<string> {
    if (isShift && this.anchorCell) {
      // Range selection
      this.selectedCells = this.getRangeCells(this.anchorCell, cell);
    } else if (isCtrl) {
      // Toggle cell in multi-select
      const key = this.cellKey(cell);
      if (this.selectedCells.has(key)) {
        this.selectedCells.delete(key);
      } else {
        this.selectedCells.add(key);
      }
    } else {
      // Single selection — set anchor
      this.anchorCell = { ...cell };
      this.selectedCells = new Set([this.cellKey(cell)]);
    }

    return this.selectedCells;
  }

  /**
   * Returns all cells in the rectangle from start to end.
   */
  private getRangeCells(start: CellRef, end: CellRef): Set<string> {
    const cells = new Set<string>();
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        cells.add(this.cellKey({ row, col }));
      }
    }

    return cells;
  }

  /**
   * Returns the selected cells as an array.
   */
  getSelectedCells(): CellRef[] {
    return Array.from(this.selectedCells).map((key) => {
      const [row, col] = key.split(',').map(Number);
      return { row, col };
    });
  }

  /**
   * Clears all selection.
   */
  clearSelection(): void {
    this.selectedCells.clear();
    this.anchorCell = null;
  }

  /**
   * Returns whether a cell is selected.
   */
  isSelected(cell: CellRef): boolean {
    return this.selectedCells.has(this.cellKey(cell));
  }
}
