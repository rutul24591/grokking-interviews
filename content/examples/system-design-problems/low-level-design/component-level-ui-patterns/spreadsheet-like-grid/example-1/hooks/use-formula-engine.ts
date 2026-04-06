'use client';
import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import type { Cell } from '../lib/spreadsheet-types';

interface UseFormulaEngineOptions {
  cells: Map<string, Cell>;
  onCellsChange?: (cells: Map<string, Cell>) => void;
}

interface EvaluationResult {
  value: string;
  error: string | null;
}

interface UseFormulaEngineReturn {
  evaluateCell: (cellId: string) => EvaluationResult;
  setCellValue: (cellId: string, value: string) => void;
  getDependencies: (cellId: string) => Set<string>;
  detectCircular: (cellId: string, value: string) => string[] | null;
  recalculateAll: () => void;
  evaluationCache: Map<string, EvaluationResult>;
}

/**
 * Parse a cell range string (e.g., "A1:C3") into individual cell IDs.
 */
function parseRange(rangeStr: string): string[] {
  const match = rangeStr.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/i);
  if (!match) return [rangeStr.toUpperCase()];

  const startCol = match[1].toUpperCase();
  const startRow = parseInt(match[2], 10);
  const endCol = match[3].toUpperCase();
  const endRow = parseInt(match[4], 10);

  const cells: string[] = [];
  for (let c = startCol.charCodeAt(0); c <= endCol.charCodeAt(0); c++) {
    for (let r = startRow; r <= endRow; r++) {
      cells.push(`${String.fromCharCode(c)}${r}`);
    }
  }
  return cells;
}

/**
 * Extract cell references from a formula string.
 * Handles references like A1, $B$2, C1:D3 ranges.
 */
function extractReferences(formula: string): string[] {
  const refs: string[] = [];
  // Match cell references (with optional $ for absolute)
  const cellRegex = /\$?([A-Z]+)\$?(\d+)/gi;
  let m: RegExpExecArray | null;
  while ((m = cellRegex.exec(formula)) !== null) {
    refs.push(`${m[1].toUpperCase()}${m[2]}`);
  }
  // Match range references
  const rangeRegex = /\$?([A-Z]+)\$?(\d+):\s*\$?([A-Z]+)\$?(\d+)/gi;
  while ((m = rangeRegex.exec(formula)) !== null) {
    const rangeStr = `${m[1]}${m[2]}:${m[3]}${m[4]}`;
    refs.push(...parseRange(rangeStr.toUpperCase()));
  }
  return [...new Set(refs)];
}

/**
 * Topological sort for formula dependency resolution.
 * Returns sorted order or null if circular dependency detected.
 */
function topologicalSort(
  startId: string,
  getDeps: (id: string) => string[]
): string[] | null {
  const visited = new Set<string>();
  const inStack = new Set<string>();
  const result: string[] = [];

  function visit(id: string): boolean {
    if (inStack.has(id)) return false; // Circular dependency
    if (visited.has(id)) return true;

    inStack.add(id);
    visited.add(id);

    for (const dep of getDeps(id)) {
      if (!visit(dep)) return false;
    }

    inStack.delete(id);
    result.push(id);
    return true;
  }

  if (!visit(startId)) return null;
  return result;
}

/**
 * Formula engine with dependency graph tracking, topological sort for
 * recalculation order, and circular reference detection.
 */
export function useFormulaEngine({
  cells,
  onCellsChange,
}: UseFormulaEngineOptions): UseFormulaEngineReturn {
  const cellsRef = useRef(cells);
  const evalCacheRef = useRef<Map<string, EvaluationResult>>(new Map());
  const [evalCount, setEvalCount] = useState(0);

  useEffect(() => {
    cellsRef.current = cells;
  }, [cells]);

  /**
   * Evaluate a single cell's value.
   * If the cell contains a formula (=SUM, =AVERAGE, =A1+B2, etc.),
   * resolve dependencies and compute the result.
   */
  const evaluateCell = useCallback(
    (cellId: string): EvaluationResult => {
      const currentCells = cellsRef.current;
      const cell = currentCells.get(cellId.toUpperCase());
      if (!cell) return { value: '', error: null };

      // Check cache first
      const cached = evalCacheRef.current.get(cellId);
      if (cached) return cached;

      const formula = cell.formula ?? cell.value;
      if (!formula || !formula.startsWith('=')) {
        const result: EvaluationResult = { value: cell.value, error: null };
        evalCacheRef.current.set(cellId, result);
        return result;
      }

      const expr = formula.slice(1).trim();

      try {
        // Build evaluation context
        const context: Record<string, number | string> = {};
        const refs = extractReferences(expr);

        for (const ref of refs) {
          const refCell = currentCells.get(ref.toUpperCase());
          if (refCell) {
            const refResult = evaluateCell(ref);
            if (refResult.error) {
              const errResult: EvaluationResult = { value: '#REF!', error: refResult.error };
              evalCacheRef.current.set(cellId, errResult);
              return errResult;
            }
            const numVal = Number(refResult.value);
            context[ref.toUpperCase()] = isNaN(numVal) ? refResult.value : numVal;
          } else {
            context[ref.toUpperCase()] = 0;
          }
        }

        // Handle built-in functions
        let evalExpr = expr;

        // =SUM(A1:C3)
        const sumMatch = evalExpr.match(/^SUM\(([^)]+)\)/i);
        if (sumMatch) {
          const rangeCells = parseRange(sumMatch[1]);
          let sum = 0;
          for (const cid of rangeCells) {
            const c = currentCells.get(cid);
            if (c) {
              const val = Number(evaluateCell(cid).value);
              if (!isNaN(val)) sum += val;
            }
          }
          const result: EvaluationResult = { value: String(sum), error: null };
          evalCacheRef.current.set(cellId, result);
          return result;
        }

        // =AVERAGE(A1:C3)
        const avgMatch = evalExpr.match(/^AVERAGE\(([^)]+)\)/i);
        if (avgMatch) {
          const rangeCells = parseRange(avgMatch[1]);
          let sum = 0;
          let count = 0;
          for (const cid of rangeCells) {
            const c = currentCells.get(cid);
            if (c) {
              const val = Number(evaluateCell(cid).value);
              if (!isNaN(val)) {
                sum += val;
                count++;
              }
            }
          }
          const result: EvaluationResult = {
            value: count > 0 ? String(sum / count) : '#DIV/0!',
            error: count === 0 ? 'No numeric values in range' : null,
          };
          evalCacheRef.current.set(cellId, result);
          return result;
        }

        // =COUNT(A1:C3)
        const countMatch = evalExpr.match(/^COUNT\(([^)]+)\)/i);
        if (countMatch) {
          const rangeCells = parseRange(countMatch[1]);
          let count = 0;
          for (const cid of rangeCells) {
            const c = currentCells.get(cid);
            if (c && !isNaN(Number(evaluateCell(cid).value))) count++;
          }
          const result: EvaluationResult = { value: String(count), error: null };
          evalCacheRef.current.set(cellId, result);
          return result;
        }

        // =MAX(A1:C3) / =MIN(A1:C3)
        const maxMatch = evalExpr.match(/^MAX\(([^)]+)\)/i);
        const minMatch = evalExpr.match(/^MIN\(([^)]+)\)/i);
        if (maxMatch || minMatch) {
          const rangeCells = parseRange((maxMatch || minMatch)![1]);
          let vals: number[] = [];
          for (const cid of rangeCells) {
            const c = currentCells.get(cid);
            if (c) {
              const val = Number(evaluateCell(cid).value);
              if (!isNaN(val)) vals.push(val);
            }
          }
          const resultVal = vals.length > 0
            ? (maxMatch ? Math.max(...vals) : Math.min(...vals))
            : 0;
          const result: EvaluationResult = { value: String(resultVal), error: null };
          evalCacheRef.current.set(cellId, result);
          return result;
        }

        // Replace cell references with their numeric values for arithmetic evaluation
        for (const [ref, val] of Object.entries(context)) {
          const numVal = typeof val === 'number' ? val : Number(val);
          evalExpr = evalExpr.replace(
            new RegExp(`\\b${ref}\\b`, 'gi'),
            isNaN(numVal) ? `"${val}"` : String(numVal)
          );
        }

        // Safe evaluation: only allow basic arithmetic
        if (/^[\d\s+\-*/().%]+$/.test(evalExpr)) {
          // eslint-disable-next-line no-eval
          const result = Function(`"use strict"; return (${evalExpr})`)();
          const resultVal = typeof result === 'number' && isFinite(result) ? String(result) : '#ERROR!';
          const resultObj: EvaluationResult = {
            value: resultVal,
            error: resultVal === '#ERROR!' ? 'Invalid expression' : null,
          };
          evalCacheRef.current.set(cellId, resultObj);
          return resultObj;
        }

        // String expression or fallback
        const result: EvaluationResult = { value: evalExpr, error: null };
        evalCacheRef.current.set(cellId, result);
        return result;
      } catch {
        const errResult: EvaluationResult = { value: '#ERROR!', error: 'Evaluation failed' };
        evalCacheRef.current.set(cellId, errResult);
        return errResult;
      }
    },
    [evalCount]
  );

  /**
   * Get direct dependencies (cell references) for a given cell.
   */
  const getDependencies = useCallback(
    (cellId: string): Set<string> => {
      const currentCells = cellsRef.current;
      const cell = currentCells.get(cellId.toUpperCase());
      if (!cell) return new Set();

      const formula = cell.formula ?? cell.value;
      if (!formula || !formula.startsWith('=')) return new Set();

      return new Set(extractReferences(formula.slice(1)));
    },
    []
  );

  /**
   * Detect circular dependencies by attempting a topological sort.
   * Returns the circular path if detected, null otherwise.
   */
  const detectCircular = useCallback(
    (cellId: string, value: string): string[] | null => {
      if (!value.startsWith('=')) return null;

      const tempDeps = extractReferences(value.slice(1));
      const tempCells = new Map(cellsRef.current);
      tempCells.set(cellId.toUpperCase(), {
        id: cellId,
        row: 0,
        col: 0,
        value,
        formula: value,
      });

      const getDeps = (id: string): string[] => {
        const c = tempCells.get(id.toUpperCase());
        if (!c) return [];
        const f = c.formula ?? c.value;
        if (!f.startsWith('=')) return [];
        return extractReferences(f.slice(1));
      };

      const sorted = topologicalSort(cellId.toUpperCase(), getDeps);
      if (sorted === null) {
        // Reconstruct the circular path
        return [cellId, ...tempDeps, cellId];
      }
      return null;
    },
    []
  );

  const setCellValue = useCallback(
    (cellId: string, value: string) => {
      const upperId = cellId.toUpperCase();
      const circular = detectCircular(upperId, value);
      if (circular) {
        // Set error value instead of creating circular reference
        const newCells = new Map(cellsRef.current);
        newCells.set(upperId, {
          ...newCells.get(upperId)!,
          value: '#CIRCULAR!',
          formula: undefined,
        });
        onCellsChange?.(newCells);
        return;
      }

      const newCells = new Map(cellsRef.current);
      newCells.set(upperId, {
        ...newCells.get(upperId) ?? { id: upperId, row: 0, col: 0, value: '' },
        value,
        formula: value.startsWith('=') ? value : undefined,
      });

      // Invalidate cache for this cell and all dependents
      evalCacheRef.current.clear();
      onCellsChange?.(newCells);
      setEvalCount((c) => c + 1);
    },
    [detectCircular, onCellsChange]
  );

  const recalculateAll = useCallback(() => {
    evalCacheRef.current.clear();
    setEvalCount((c) => c + 1);
  }, []);

  const evaluationCache = useMemo(() => evalCacheRef.current, [evalCount]);

  return {
    evaluateCell,
    setCellValue,
    getDependencies,
    detectCircular,
    recalculateAll,
    evaluationCache,
  };
}
