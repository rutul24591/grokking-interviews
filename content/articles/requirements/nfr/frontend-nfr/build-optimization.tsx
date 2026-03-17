"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-build-optimization",
  title: "Build Optimization",
  description: "Comprehensive guide to frontend build optimization: bundlers, tree-shaking, code splitting, minification, and build performance for production deployments.",
  category: "frontend",
  subcategory: "nfr",
  slug: "build-optimization",
  version: "extensive",
  wordCount: 9000,
  readingTime: 36,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "build", "optimization", "bundling", "tree-shaking", "performance"],
  relatedTopics: ["performance-optimization", "developer-experience", "deployment"],
};

export default function BuildOptimizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Build Optimization</strong> encompasses techniques to reduce bundle size, improve
          load performance, and accelerate build times. This includes bundling, tree-shaking,
          code splitting, minification, compression, and caching strategies. For staff engineers,
          build optimization balances output quality (small bundles) with build performance (fast
          builds) and developer experience (fast HMR).
        </p>
        <p>
          Build decisions have long-term impact on application performance and team productivity.
          The right bundler configuration can reduce bundle size by 50%+, improve load times by
          seconds, and accelerate CI/CD pipelines. Poor build configuration leads to bloated
          bundles, slow deployments, and frustrated developers.
        </p>
        <p>
          <strong>Build optimization goals:</strong>
        </p>
        <ul>
          <li><strong>Small bundles:</strong> Less JavaScript to download and parse</li>
          <li><strong>Fast builds:</strong> Quick feedback for developers, faster CI/CD</li>
          <li><strong>Efficient caching:</strong> Leverage browser and CDN caching</li>
          <li><strong>Modern output:</strong> Ship modern JavaScript to modern browsers</li>
          <li><strong>Source maps:</strong> Debug production issues effectively</li>
        </ul>
      </section>

      <section>
        <h2>Bundlers Comparison</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Webpack</h3>
        <ul className="space-y-2">
          <li><strong>Maturity:</strong> Most mature, largest ecosystem</li>
          <li><strong>Features:</strong> Code splitting, tree-shaking, HMR, extensive loader ecosystem</li>
          <li><strong>Performance:</strong> Slower than newer tools, but optimized over time</li>
          <li><strong>Configuration:</strong> Complex, flexible</li>
          <li><strong>Best for:</strong> Large projects, complex requirements, legacy support</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Vite</h3>
        <ul className="space-y-2">
          <li><strong>Architecture:</strong> ESM-based dev server, Rollup for production</li>
          <li><strong>Performance:</strong> Instant HMR, fast cold start</li>
          <li><strong>Configuration:</strong> Simple, convention over configuration</li>
          <li><strong>Features:</strong> Built-in CSS, JSON, asset handling</li>
          <li><strong>Best for:</strong> Modern projects, React/Vue/Svelte, fast DX</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">esbuild</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> 10-100x faster than webpack (Go-based)</li>
          <li><strong>Features:</strong> Bundling, minification, transpilation</li>
          <li><strong>Limitations:</strong> Less mature ecosystem, fewer plugins</li>
          <li><strong>Use cases:</strong> Fast builds, simple projects, as webpack loader</li>
          <li><strong>Best for:</strong> Performance-critical builds, prototyping</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rollup</h3>
        <ul className="space-y-2">
          <li><strong>Focus:</strong> Library bundling, tree-shaking</li>
          <li><strong>Output:</strong> Clean, efficient bundles</li>
          <li><strong>Features:</strong> Excellent tree-shaking, multiple output formats</li>
          <li><strong>Best for:</strong> Libraries, packages, simple applications</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/bundlers-comparison.svg"
          alt="Bundlers Comparison"
          caption="Frontend bundler comparison — webpack, Vite, esbuild, and Rollup with performance and feature trade-offs"
        />
      </section>

      <section>
        <h2>Tree-Shaking</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">How Tree-Shaking Works</h3>
        <ul className="space-y-2">
          <li>Static analysis of ES6 imports/exports</li>
          <li>Identify unused exports</li>
          <li>Remove dead code from bundle</li>
          <li>Requires ES6 module syntax (import/export)</li>
          <li>Side-effect-free modules shake better</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Optimizing for Tree-Shaking</h3>
        <ul className="space-y-2">
          <li>Use ES6 modules in dependencies</li>
          <li>Mark packages as side-effect-free (<code>"sideEffects": false</code>)</li>
          <li>Avoid importing entire libraries (import specific functions)</li>
          <li>Use barrel exports carefully (can prevent tree-shaking)</li>
          <li>Check bundle analysis for unused code</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Common Tree-Shaking Issues</h3>
        <ul className="space-y-2">
          <li>CommonJS modules don&apos;t tree-shake well</li>
          <li>Dynamic imports can&apos;t be statically analyzed</li>
          <li>Side effects in modules prevent removal</li>
          <li>Barrel exports (index.js re-exports) can include everything</li>
          <li>Polyfills often can&apos;t be tree-shaken</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Verifying Tree-Shaking</h3>
        <ul className="space-y-2">
          <li>Use bundle analyzer (webpack-bundle-analyzer, rollup-plugin-visualizer)</li>
          <li>Check for unexpected large bundles</li>
          <li>Compare development vs production bundle sizes</li>
          <li>Verify unused dependencies are removed</li>
          <li>Test with production build (dev builds may not tree-shake)</li>
        </ul>
      </section>

      <section>
        <h2>Code Splitting</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Route-Based Splitting</h3>
        <ul className="space-y-2">
          <li>Split by route/page</li>
          <li>Load route code on navigation</li>
          <li>React.lazy() for component-level splitting</li>
          <li>Next.js, Nuxt do this automatically</li>
          <li>Target: &lt;200KB initial bundle</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Component-Based Splitting</h3>
        <ul className="space-y-2">
          <li>Lazy load heavy components (charts, editors)</li>
          <li>Load on interaction (modal, dropdown)</li>
          <li>Use React.lazy + Suspense</li>
          <li>Balance splitting overhead vs bundle size</li>
          <li>Don&apos;t over-split (too many small chunks)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Library Splitting</h3>
        <ul className="space-y-2">
          <li>Split vendor code into separate chunk</li>
          <li>Cache vendor chunk long-term (rarely changes)</li>
          <li>Split large libraries (moment → dayjs)</li>
          <li>Use dynamic imports for heavy dependencies</li>
          <li>Consider module federation for micro-frontends</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Splitting Strategies</h3>
        <ul className="space-y-2">
          <li>Initial chunk: Critical code for first paint</li>
          <li>Vendor chunk: Node_modules dependencies</li>
          <li>Common chunk: Shared code between routes</li>
          <li>Route chunks: Page-specific code</li>
          <li>Async chunks: Lazy-loaded components</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/code-splitting-strategy.svg"
          alt="Code Splitting Strategy"
          caption="Code splitting strategy — initial, vendor, common, route, and async chunks with loading priorities"
        />
      </section>

      <section>
        <h2>Minification and Compression</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Minification</h3>
        <ul className="space-y-2">
          <li>Remove whitespace, comments, dead code</li>
          <li>Mangle variable names (shorter names)</li>
          <li>Optimize expressions and statements</li>
          <li>Tools: Terser, esbuild, swc</li>
          <li>Typical savings: 20-40%</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Compression</h3>
        <ul className="space-y-2">
          <li><strong>Gzip:</strong> Universal support, 70-80% compression</li>
          <li><strong>Brotli:</strong> Better compression (80-90%), modern browsers</li>
          <li><strong>Zstandard:</strong> Fast, emerging support</li>
          <li>Compress at build time or CDN</li>
          <li>Pre-compress static assets for faster serving</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Build Configuration</h3>
        <ul className="space-y-2">
          <li>Enable minification for production builds</li>
          <li>Configure compression in CDN or server</li>
          <li>Use <code>.br</code> files for Brotli, <code>.gz</code> for Gzip</li>
          <li>Set correct Content-Encoding headers</li>
          <li>Test compressed bundle sizes, not raw sizes</li>
        </ul>
      </section>

      <section>
        <h2>Build Performance</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Optimizing Build Times</h3>
        <ul className="space-y-2">
          <li>Use faster tools (esbuild, swc instead of Babel)</li>
          <li>Enable caching (file system cache, persistent cache)</li>
          <li>Parallelize builds (thread-loader, worker threads)</li>
          <li>Exclude node_modules from transpilation</li>
          <li>Use include/exclude to limit scope</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Caching Strategies</h3>
        <ul className="space-y-2">
          <li>File system caching (webpack 5 cache, Vite cache)</li>
          <li>Dependency caching (pnpm, yarn cache)</li>
          <li>CI/CD caching (cache node_modules between runs)</li>
          <li>Docker layer caching for builds</li>
          <li>Incremental builds (only rebuild changed files)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring Build Performance</h3>
        <ul className="space-y-2">
          <li>Track build times over time</li>
          <li>Alert on build time regressions</li>
          <li>Profile slow builds (webpack --profile)</li>
          <li>Identify expensive loaders/plugins</li>
          <li>Set build time budgets (like performance budgets)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Modern JavaScript Output</h3>
        <ul className="space-y-2">
          <li>Ship ES2015+ to modern browsers</li>
          <li>Use browserslist to target specific browsers</li>
          <li>Generate legacy fallbacks for older browsers</li>
          <li>Use &lt;script type=&quot;module&quot;&gt; for modern, nomodule for legacy</li>
          <li>Reduces bundle size by 20-30%</li>
        </ul>
      </section>

      <section>
        <h2>Source Maps</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Source Map Types</h3>
        <ul className="space-y-2">
          <li><code>source-map</code>: Full source map, best for debugging</li>
          <li><code>inline-source-map</code>: Embedded in bundle, larger</li>
          <li><code>hidden-source-map</code>: Generated but not referenced</li>
          <li><code>nosources-source-map</code>: No source content, privacy</li>
          <li><code>false</code>: No source maps (production default)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Production Source Maps</h3>
        <ul className="space-y-2">
          <li>Generate source maps for production</li>
          <li>Upload to error tracking service (Sentry)</li>
          <li>Don&apos;t serve publicly (security risk)</li>
          <li>Delete after upload to tracking service</li>
          <li>Enable debugging production errors</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Considerations</h3>
        <ul className="space-y-2">
          <li>Source maps expose original source code</li>
          <li>Don&apos;t deploy source maps to production server</li>
          <li>Use nosources-source-map if needed publicly</li>
          <li>Upload to secure error tracking service</li>
          <li>Consider obfuscation for sensitive code</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you reduce JavaScript bundle size?</p>
            <p className="mt-2 text-sm">
              A: Tree-shaking (ES6 modules, side-effect-free packages), code splitting (route-based,
              component-based), replace heavy libraries (moment → dayjs, lodash-es), analyze bundles
              (webpack-bundle-analyzer), enable minification and compression. Target &lt;200KB
              initial bundle gzipped.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What bundler would you choose and why?</p>
            <p className="mt-2 text-sm">
              A: Depends on project. Vite for modern React/Vue/Svelte apps — fast HMR, simple config.
              Webpack for complex projects, legacy support, extensive plugin ecosystem. esbuild for
              fastest builds, simple projects. Rollup for libraries. Consider team familiarity,
              ecosystem, and performance needs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does tree-shaking work?</p>
            <p className="mt-2 text-sm">
              A: Static analysis of ES6 import/export statements. Bundler identifies unused exports
              and removes them from bundle. Requires ES6 module syntax — CommonJS doesn&apos;t
              tree-shake well. Mark packages as side-effect-free. Import specific functions, not
              entire libraries.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize build performance?</p>
            <p className="mt-2 text-sm">
              A: Use faster tools (esbuild, swc vs Babel), enable caching (file system, dependency),
              parallelize builds, exclude node_modules from transpilation, use include/exclude
              properly. Monitor build times, alert on regressions. Target &lt;5s dev build, &lt;30s
              production build.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s your code splitting strategy?</p>
            <p className="mt-2 text-sm">
              A: Route-based splitting (load page code on navigation), component-based for heavy
              components (charts, modals), vendor chunk for dependencies (cache long-term), common
              chunk for shared code. Use React.lazy + Suspense. Balance splitting overhead vs bundle
              size — don&apos;t over-split.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://webpack.js.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Webpack Documentation
            </a>
          </li>
          <li>
            <a href="https://vitejs.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Vite Documentation
            </a>
          </li>
          <li>
            <a href="https://esbuild.github.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              esbuild Documentation
            </a>
          </li>
          <li>
            <a href="https://web.dev/reduce-network-payloads-using-text-compression/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Text Compression
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
