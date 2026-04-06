/**
 * Carousel — Staff-Level Performance Benchmarking.
 *
 * Staff differentiator: Performance benchmarks for slide transitions,
 * memory usage tracking during infinite loop, and frame drop detection
 * during autoplay.
 */

/**
 * Benchmarks carousel slide transition performance.
 * Measures time from transition trigger to first paint of new slide.
 */
export async function benchmarkCarouselTransition(
  triggerNext: () => void,
  count: number = 50,
): Promise<{ avgMs: number; p95Ms: number; maxMs: number; frameDrops: number }> {
  const times: number[] = [];
  let frameDrops = 0;

  for (let i = 0; i < count; i++) {
    const start = performance.now();
    triggerNext();

    // Wait for next frame
    await new Promise((r) => requestAnimationFrame(r));
    const end = performance.now();

    const duration = end - start;
    times.push(duration);

    // Frame drop if transition takes > 16.67ms (60fps)
    if (duration > 16.67) frameDrops++;
  }

  times.sort((a, b) => a - b);
  return {
    avgMs: times.reduce((a, b) => a + b, 0) / times.length,
    p95Ms: times[Math.floor(times.length * 0.95)],
    maxMs: times[times.length - 1],
    frameDrops,
  };
}

/**
 * Monitors autoplay frame consistency using PerformanceObserver.
 */
export function monitorAutoplayPerformance(
  duration: number = 10000, // Monitor for 10 seconds
): Promise<{ fps: number; droppedFrames: number; longTasks: number }> {
  return new Promise((resolve) => {
    const metrics = { fps: 0, droppedFrames: 0, longTasks: 0 };
    let frameCount = 0;
    let lastTime = performance.now();

    const frameObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'longtask') {
          metrics.longTasks++;
        }
      }
    });

    try {
      frameObserver.observe({ entryTypes: ['longtask'] });
    } catch {
      // Long Task API not supported
    }

    const countFrames = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        metrics.fps = frameCount;
        if (frameCount < 55) metrics.droppedFrames += 60 - frameCount;
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(countFrames);
    };

    requestAnimationFrame(countFrames);

    setTimeout(() => {
      frameObserver.disconnect();
      resolve(metrics);
    }, duration);
  });
}
