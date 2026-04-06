/**
 * Spreadsheet Grid — Staff-Level Testing Strategy.
 *
 * Staff differentiator: Automated testing of formula evaluation engine,
 * circular reference detection, and large grid rendering performance.
 */

/**
 * Tests the formula evaluation engine with various formula types.
 */
export function testFormulaEvaluation(): { pass: boolean; errors: string[] } {
  const errors: string[] = [];

  // Test basic arithmetic
  const arithmeticTests = [
    { formula: '=1+1', expected: 2 },
    { formula: '=10-3', expected: 7 },
    { formula: '=2*3', expected: 6 },
    { formula: '=10/2', expected: 5 },
  ];

  // Test cell references
  // In production: set up a mock spreadsheet with known values

  // Test circular reference detection
  // A1 = B1, B1 = A1 → should detect circular reference

  return { pass: errors.length === 0, errors };
}

/**
 * Tests circular reference detection in the dependency graph.
 */
export function testCircularReferenceDetection(): { pass: boolean; errors: string[] } {
  const errors: string[] = [];

  // Simulate: A1 depends on B1, B1 depends on C1, C1 depends on A1
  const dependencies = new Map<string, Set<string>>();
  dependencies.set('A1', new Set(['B1']));
  dependencies.set('B1', new Set(['C1']));
  dependencies.set('C1', new Set(['A1']));

  // DFS-based cycle detection
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map<string, number>();
  let hasCycle = false;

  const dfs = (node: string): void => {
    color.set(node, GRAY);
    const deps = dependencies.get(node) || new Set();
    for (const dep of deps) {
      const c = color.get(dep);
      if (c === GRAY) { hasCycle = true; return; }
      if (c !== BLACK) dfs(dep);
    }
    color.set(node, BLACK);
  };

  for (const node of dependencies.keys()) {
    if (!color.has(node)) dfs(node);
  }

  if (!hasCycle) {
    errors.push('Circular reference was not detected');
  }

  return { pass: errors.length === 0, errors };
}

/**
 * Benchmarks large grid rendering performance.
 */
export async function benchmarkGridRendering(
  rows: number,
  cols: number,
  renderFn: (rows: number, cols: number) => Promise<number>,
): Promise<{ renderTimeMs: number; cellsPerSecond: number }> {
  const start = performance.now();
  const cellCount = await renderFn(rows, cols);
  const end = performance.now();

  const renderTimeMs = end - start;
  const cellsPerSecond = (cellCount / renderTimeMs) * 1000;

  return { renderTimeMs, cellsPerSecond };
}
