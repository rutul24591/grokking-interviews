/**
 * Component Library — Staff-Level Tree-Shaking Optimization.
 *
 * Staff differentiator: ES module exports with sideEffects: false,
 * barrel export elimination for optimal tree-shaking, and automated
 * bundle size analysis per component.
 */

/**
 * Individual component exports — each component is exported separately
 * to enable tree-shaking. Avoid barrel exports (export * from './')
 * as they prevent tree-shaking optimization.
 */

// DO NOT do this (prevents tree-shaking):
// export * from './Button';
// export * from './Modal';
// export * from './Input';

// DO this instead (named exports):
export { Button } from './Button';
export { Modal } from './Modal';
export { Input } from './Input';

/**
 * Package.json configuration for optimal tree-shaking:
 *
 * {
 *   "sideEffects": false,
 *   "module": "dist/esm/index.js",
 *   "main": "dist/cjs/index.js",
 *   "types": "dist/types/index.d.ts",
 *   "exports": {
 *     ".": {
 *       "import": "./dist/esm/index.js",
 *       "require": "./dist/cjs/index.js",
 *       "types": "./dist/types/index.d.ts"
 *     },
 *     "./Button": {
 *       "import": "./dist/esm/Button.js",
 *       "require": "./dist/cjs/Button.js",
 *       "types": "./dist/types/Button.d.ts"
 *     }
 *   }
 * }
 */

/**
 * Bundle size analyzer — checks each component's contribution to the bundle.
 */
export interface ComponentBundleSize {
  componentName: string;
  rawBytes: number;
  gzipBytes: number;
  brotliBytes: number;
  dependencies: string[];
}

/**
 * Calculates the bundle size contribution of each component.
 * Used in CI to detect bundle size regressions.
 */
export function analyzeComponentSizes(components: Record<string, string>): ComponentBundleSize[] {
  return Object.entries(components).map(([name, code]) => {
    const rawBytes = new Blob([code]).size;
    // In production: use actual gzip/brotli compression
    const gzipBytes = Math.round(rawBytes * 0.35); // ~65% compression estimate
    const brotliBytes = Math.round(rawBytes * 0.30); // ~70% compression estimate

    return {
      componentName: name,
      rawBytes,
      gzipBytes,
      brotliBytes,
      dependencies: [], // Analyze imports
    };
  });
}
