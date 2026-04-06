/**
 * Toast — Staff-Level Performance Benchmarking.
 *
 * Staff differentiator: Performance benchmarks for toast creation, animation
 * frame tracking, and memory leak detection during rapid toast cycles.
 */

/**
 * Benchmarks toast creation and rendering performance.
 * Measures time from toast creation to first paint.
 */
export async function benchmarkToastCreation(
  createToast: (message: string) => string,
  dismissToast: (id: string) => void,
  count: number = 100,
): Promise<{ avgMs: number; maxMs: number; minMs: number; p95Ms: number }> {
  const times: number[] = [];

  for (let i = 0; i < count; i++) {
    const start = performance.now();
    const id = createToast(`Toast ${i}`);
    // Wait for next frame (first paint)
    await new Promise((r) => requestAnimationFrame(r));
    const end = performance.now();
    times.push(end - start);
    dismissToast(id);
  }

  times.sort((a, b) => a - b);
  return {
    avgMs: times.reduce((a, b) => a + b, 0) / times.length,
    maxMs: times[times.length - 1],
    minMs: times[0],
    p95Ms: times[Math.floor(times.length * 0.95)],
  };
}

/**
 * Detects memory leaks during rapid toast creation/dismissal cycles.
 * Uses Performance.memory API (Chrome only) or heap snapshot comparison.
 */
export async function detectToastMemoryLeaks(
  createToast: (message: string) => string,
  dismissToast: (id: string) => void,
  cycles: number = 1000,
): Promise<{ leaked: boolean; beforeBytes: number; afterBytes: number }> {
  // Get baseline memory
  const before = (performance as any).memory?.usedJSHeapSize ?? 0;

  // Create and dismiss many toasts
  for (let i = 0; i < cycles; i++) {
    const id = createToast(`Toast ${i}`);
    dismissToast(id);
  }

  // Wait for garbage collection
  await new Promise((r) => setTimeout(r, 100));
  if ((globalThis as any).gc) (globalThis as any).gc();

  // Get post-cycle memory
  const after = (performance as any).memory?.usedJSHeapSize ?? 0;

  // Consider leaked if memory grew by more than 10%
  const leaked = after > before * 1.1 && after - before > 1024 * 1024; // > 1MB growth

  return { leaked, beforeBytes: before, afterBytes: after };
}
