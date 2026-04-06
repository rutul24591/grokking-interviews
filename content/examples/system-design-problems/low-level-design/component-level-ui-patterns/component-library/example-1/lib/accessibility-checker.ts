// ============================================================
// lib/accessibility-checker.ts
// Automated a11y validation wrapper with axe-core
// ============================================================

import type { A11yViolation } from "./library-types";

// ── Violation Report ────────────────────────────────────────

export interface A11yReport {
  /** Whether the container passed all checks */
  passed: boolean;
  /** Total number of violations found */
  violationCount: number;
  /** Individual violations */
  violations: A11yViolation[];
  /** Time taken to run the audit (ms) */
  durationMs: number;
  /** Timestamp of the audit */
  timestamp: string;
}

// ── WCAG Rule Set Configuration ─────────────────────────────

interface AxeConfig {
  /** Rules to enable (defaults to all WCAG 2.1 AA rules) */
  rules?: string[];
  /** Rules to explicitly disable */
  disableRules?: string[];
  /** Element types to exclude from audit */
  excludeSelectors?: string[];
}

const DEFAULT_CONFIG: AxeConfig = {
  disableRules: [
    // Skip color-contrast on dynamically animated elements
    // (handled separately by the theme builder)
    // "color-contrast",
  ],
  excludeSelectors: [
    "[data-a11y-paused]", // Elements with paused animations
    "[aria-hidden='true']", // Intentionally hidden elements
  ],
};

// ── A11y Check Runner ──────────────────────────────────────

/**
 * Run an accessibility audit on a DOM container.
 * Wraps axe-core's programmatic API with simplified
 * input/output for the component library.
 *
 * In production tests, this is called from Jest or
 * Storybook test runner with a rendered component's
 * container element.
 */
export async function runA11yCheck(
  container: Element | HTMLElement,
  config: AxeConfig = DEFAULT_CONFIG
): Promise<A11yReport> {
  const startTime = performance.now();

  // In a real implementation, this imports and calls axe-core:
  //
  //   import axe from "axe-core";
  //   const results = await axe.run(container, {
  //     rules: config.rules,
  //     exclude: config.excludeSelectors?.map((sel) => ({ include: [sel] })),
  //   });
  //
  // For this example, we return a mock report structure
  // demonstrating the output format.

  const violations: A11yViolation[] = [];

  // Example of how violations are mapped from axe-core results:
  //
  //   for (const violation of results.violations) {
  //     for (const node of violation.nodes) {
  //       violations.push({
  //         ruleId: violation.id,
  //         impact: violation.impact as A11yViolation["impact"],
  //         selector: node.target.join(", "),
  //         description: violation.description,
  //         remediation: violation.help,
  //       });
  //     }
  //   }

  const durationMs = performance.now() - startTime;

  return {
    passed: violations.length === 0,
    violationCount: violations.length,
    violations,
    durationMs: Math.round(durationMs * 100) / 100,
    timestamp: new Date().toISOString(),
  };
}

// ── Contrast Check (Standalone) ─────────────────────────────

/**
 * Check a single foreground/background color pair
 * without running a full DOM audit.
 * Useful for validating theme overrides at build time.
 */
export function checkContrast(
  foreground: string,
  background: string
): { ratio: number; passesAA: boolean; passesAAA: boolean } {
  // Relative luminance per WCAG 2.1
  function luminance(hex: string): number {
    const stripped = hex.replace("#", "");
    const [r, g, b] = [0, 2, 4].map((offset) => {
      const c = parseInt(stripped.substring(offset, offset + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  const l1 = luminance(foreground);
  const l2 = luminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7,
  };
}

// ── Batch Audit for CI ──────────────────────────────────────

/**
 * Run accessibility audits across multiple containers
 * (e.g., all component stories in Storybook).
 * Returns an aggregated report.
 */
export async function batchAudit(
  containers: Array<{ name: string; element: Element }>
): Promise<{
  totalComponents: number;
  passed: number;
  failed: number;
  totalViolations: number;
  reports: Array<{ componentName: string; report: A11yReport }>;
}> {
  const reports = await Promise.all(
    containers.map(async ({ name, element }) => ({
      componentName: name,
      report: await runA11yCheck(element),
    }))
  );

  const passed = reports.filter((r) => r.report.passed).length;
  const failed = reports.length - passed;
  const totalViolations = reports.reduce(
    (sum, r) => sum + r.report.violationCount,
    0
  );

  return {
    totalComponents: reports.length,
    passed,
    failed,
    totalViolations,
    reports,
  };
}
