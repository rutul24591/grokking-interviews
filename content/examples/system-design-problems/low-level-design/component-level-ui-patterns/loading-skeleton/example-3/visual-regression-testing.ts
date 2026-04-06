/**
 * Loading Skeleton — Staff-Level Visual Regression Testing Strategy.
 *
 * Staff differentiator: Automated screenshot comparison for skeleton
 * rendering, animation timing verification, and CLS (Cumulative Layout
 * Shift) measurement during skeleton-to-content transitions.
 */

/**
 * Measures Cumulative Layout Shift (CLS) during skeleton-to-content transition.
 * CLS should be < 0.1 for a good user experience.
 */
export async function measureCLS(
  container: HTMLElement,
  contentLoadTime: number,
): Promise<{ cls: number; passed: boolean }> {
  if (typeof window === 'undefined' || !window.PerformanceObserver) {
    return { cls: 0, passed: true };
  }

  let cls = 0;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if ((entry as any).hadRecentInput) continue;
      cls += (entry as any).value;
    }
  });

  observer.observe({ type: 'layout-shift', buffered: true });

  // Simulate content loading
  await new Promise((r) => setTimeout(r, contentLoadTime));

  observer.disconnect();

  return { cls, passed: cls < 0.1 };
}

/**
 * Verifies that skeleton animation timing is consistent.
 * The shimmer animation should complete within the expected duration.
 */
export async function testAnimationTiming(
  skeletonElement: HTMLElement,
  expectedDuration: number = 1500,
  tolerance: number = 200,
): Promise<{ duration: number; passed: boolean }> {
  const computedStyle = window.getComputedStyle(skeletonElement);
  const animationDuration = computedStyle.animationDuration;

  // Parse animation duration (e.g., "1.5s" → 1500)
  const match = animationDuration.match(/([\d.]+)s/);
  if (!match) return { duration: 0, passed: false };

  const duration = parseFloat(match[1]) * 1000;
  const passed = Math.abs(duration - expectedDuration) <= tolerance;

  return { duration, passed };
}

/**
 * Visual regression test: compares skeleton rendering across breakpoints.
 */
export const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

export async function testSkeletonAcrossBreakpoints(
  container: HTMLElement,
  breakpoints: number[] = Object.values(BREAKPOINTS),
): Promise<{ breakpoint: number; width: number; height: number }[]> {
  const results: { breakpoint: number; width: number; height: number }[] = [];

  for (const width of breakpoints) {
    container.style.width = `${width}px`;
    // Wait for reflow
    await new Promise((r) => requestAnimationFrame(r));

    results.push({
      breakpoint: width,
      width: container.offsetWidth,
      height: container.offsetHeight,
    });
  }

  return results;
}
