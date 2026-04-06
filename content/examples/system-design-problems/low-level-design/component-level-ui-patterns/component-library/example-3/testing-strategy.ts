/**
 * Component Library — Staff-Level Visual Regression Testing Pipeline.
 *
 * Staff differentiator: Automated screenshot testing with Chromatic/Percy,
 * component-level accessibility auditing with axe-core, and bundle size
 * regression detection in CI.
 */

/**
 * Test configuration for visual regression testing.
 * Captures screenshots at multiple viewports and themes.
 */
export const visualRegressionConfig = {
  viewports: [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'wide', width: 1920, height: 1080 },
  ],
  themes: ['light', 'dark'],
  // Components to test
  components: [
    'Button', 'Input', 'Select', 'Modal', 'Tooltip', 'Accordion',
    'Table', 'Pagination', 'Avatar', 'Badge', 'Card',
  ],
};

/**
 * Automated accessibility audit for all components.
 * Runs axe-core against each component variant.
 */
export async function runAccessibilityAudit(
  container: HTMLElement,
): Promise<{ violations: any[]; passes: any[]; incomplete: any[] }> {
  if (typeof window === 'undefined' || !(window as any).axe) {
    return { violations: [], passes: [], incomplete: [] };
  }

  const results = await (window as any).axe.run(container, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
    },
  });

  return {
    violations: results.violations,
    passes: results.passes,
    incomplete: results.incomplete,
  };
}

/**
 * Bundle size regression detection.
 * Compares current bundle size against baseline and fails CI if it exceeds threshold.
 */
export function checkBundleSize(
  currentSize: number,
  baselineSize: number,
  maxIncreasePercent: number = 5,
): { passed: boolean; currentKB: number; baselineKB: number; increasePercent: number } {
  const currentKB = currentSize / 1024;
  const baselineKB = baselineSize / 1024;
  const increasePercent = ((currentSize - baselineSize) / baselineSize) * 100;

  return {
    passed: increasePercent <= maxIncreasePercent,
    currentKB,
    baselineKB,
    increasePercent,
  };
}
