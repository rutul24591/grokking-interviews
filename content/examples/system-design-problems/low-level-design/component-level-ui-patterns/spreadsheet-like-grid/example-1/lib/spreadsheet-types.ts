export interface Cell { id: string; row: number; col: number; value: string; formula?: string; }
export interface SpreadsheetState { cells: Map<string, Cell>; selection: { row: number; col: number } | null; }
