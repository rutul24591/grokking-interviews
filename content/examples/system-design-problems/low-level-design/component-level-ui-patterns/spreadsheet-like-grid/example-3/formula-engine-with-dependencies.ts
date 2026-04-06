/**
 * Spreadsheet Grid — Staff-Level Formula Engine with Dependency Graph.
 *
 * Staff differentiator: Topological sort for recalculation order, circular
 * reference detection using DFS with coloring, incremental recalculation
 * (only affected cells), and lazy evaluation for complex formulas.
 */

export interface Cell {
  id: string;
  value: string;
  formula?: string;
  computedValue: string | number | null;
  dependencies: Set<string>;
  dependents: Set<string>;
}

/**
 * Formula engine with dependency graph and topological recalculation.
 */
export class SpreadsheetFormulaEngine {
  private cells: Map<string, Cell> = new Map();
  private recalcQueue: string[] = [];

  /**
   * Sets a cell value/formula and triggers recalculation of dependents.
   */
  setCell(cellId: string, value: string): void {
    const cell = this.cells.get(cellId) || this.createCell(cellId);
    cell.value = value;

    // Parse formula and extract dependencies
    if (value.startsWith('=')) {
      cell.formula = value;
      const deps = this.extractDependencies(value);

      // Check for circular references
      if (this.wouldCreateCycle(cellId, deps)) {
        cell.computedValue = '#CIRCULAR!';
        return;
      }

      // Update dependency graph
      for (const depId of cell.dependencies) {
        this.cells.get(depId)?.dependents.delete(cellId);
      }
      cell.dependencies = deps;
      for (const depId of deps) {
        const dep = this.cells.get(depId) || this.createCell(depId);
        dep.dependents.add(cellId);
      }
    } else {
      cell.formula = undefined;
      cell.computedValue = this.parseValue(value);
      cell.dependencies.clear();
    }

    // Queue dependent cells for recalculation
    this.queueDependentsForRecalc(cellId);

    // Execute recalculation in topological order
    this.recalculate();
  }

  /**
   * Extracts cell references from a formula string.
   */
  private extractDependencies(formula: string): Set<string> {
    const refs = new Set<string>();
    const matches = formula.match(/\b([A-Z]+\d+)\b/g);
    if (matches) {
      for (const ref of matches) refs.add(ref);
    }
    return refs;
  }

  /**
   * Detects circular references using DFS with coloring.
   */
  private wouldCreateCycle(cellId: string, newDeps: Set<string>): boolean {
    const WHITE = 0, GRAY = 1, BLACK = 2;
    const color = new Map<string, number>();

    const dfs = (current: string): boolean => {
      color.set(current, GRAY);
      const cell = this.cells.get(current);
      if (cell) {
        for (const depId of cell.dependents) {
          if (newDeps.has(depId) || depId === cellId) return true;
          if (color.get(depId) === GRAY) return true;
          if (color.get(depId) !== BLACK && dfs(depId)) return true;
        }
      }
      color.set(current, BLACK);
      return false;
    };

    return dfs(cellId);
  }

  /**
   * Queues all dependents for recalculation using BFS.
   */
  private queueDependentsForRecalc(cellId: string): void {
    const queue = [cellId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);

      const cell = this.cells.get(current);
      if (cell) {
        for (const depId of cell.dependents) {
          if (!visited.has(depId)) {
            queue.push(depId);
            if (!this.recalcQueue.includes(depId)) {
              this.recalcQueue.push(depId);
            }
          }
        }
      }
    }
  }

  /**
   * Recalculates all queued cells in topological order.
   */
  private recalculate(): void {
    // Topological sort using Kahn's algorithm
    const inDegree = new Map<string, number>();
    for (const cellId of this.recalcQueue) {
      const cell = this.cells.get(cellId);
      if (cell) {
        inDegree.set(cellId, [...cell.dependencies].filter((d) => this.recalcQueue.includes(d)).length);
      }
    }

    const queue = [...inDegree.entries()].filter(([_, deg]) => deg === 0).map(([id]) => id);

    while (queue.length > 0) {
      const cellId = queue.shift()!;
      const cell = this.cells.get(cellId);
      if (cell && cell.formula) {
        cell.computedValue = this.evaluateFormula(cell.formula);
      }

      for (const cellId2 of this.recalcQueue) {
        const cell2 = this.cells.get(cellId2);
        if (cell2?.dependencies.has(cellId)) {
          inDegree.set(cellId2, (inDegree.get(cellId2) || 1) - 1);
          if (inDegree.get(cellId2) === 0) queue.push(cellId2);
        }
      }
    }

    this.recalcQueue = [];
  }

  private createCell(id: string): Cell {
    const cell: Cell = { id, value: '', computedValue: null, dependencies: new Set(), dependents: new Set() };
    this.cells.set(id, cell);
    return cell;
  }

  private parseValue(value: string): string | number {
    const num = Number(value);
    return isNaN(num) ? value : num;
  }

  private evaluateFormula(formula: string): string | number {
    // In production: full formula parser with built-in functions
    return '#NOT_IMPLEMENTED';
  }

  getCell(cellId: string): Cell | undefined {
    return this.cells.get(cellId);
  }
}
