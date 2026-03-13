"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-bundle-size-optimization-concise",
  title: "Bundle Size Optimization",
  description: "Quick overview of techniques for analyzing, reducing, and monitoring JavaScript bundle sizes in modern web applications.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "bundle-size-optimization",
  version: "concise",
  wordCount: 2800,
  readingTime: 12,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "bundle-size", "webpack", "vite", "optimization", "code-splitting"],
  relatedTopics: ["tree-shaking", "code-splitting", "lazy-loading"],
};

export default function BundleSizeOptimizationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Bundle size optimization</strong> is the practice of minimizing the amount of JavaScript (and other
          assets) shipped to the browser. Every kilobyte matters: large bundles increase download time, parsing time,
          and memory usage — directly impacting Time to Interactive (TTI) and Core Web Vitals.
        </p>
        <p>
          A typical unoptimized React application can easily ship 2MB+ of JavaScript. With systematic optimization,
          the same application can often be reduced to 300–500KB — a 75–85% reduction. The key is measuring first,
          then applying targeted techniques based on what the data reveals.
        </p>
      </section>

      <section>
        <h2>Measuring Bundle Size</h2>
        <p>
          You can't optimize what you can't measure. Three essential tools for understanding your bundle composition:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>webpack-bundle-analyzer:</strong> Generates an interactive treemap visualization of your bundle,
            showing exactly which modules consume space and how they relate to each other.
          </li>
          <li>
            <strong>source-map-explorer:</strong> Analyzes source maps to attribute bundle bytes back to original
            source files. Works with any bundler that produces source maps.
          </li>
          <li>
            <strong>Bundlephobia:</strong> A web tool (<code>bundlephobia.com</code>) that shows the download size,
            install size, and tree-shakeability of any npm package before you add it.
          </li>
        </ul>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`# Install webpack-bundle-analyzer
pnpm add -D webpack-bundle-analyzer

# For Next.js projects, use the dedicated plugin
pnpm add -D @next/bundle-analyzer

// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({ /* your config */ });

// Run the analysis
ANALYZE=true pnpm build

# For source-map-explorer (works with any bundler)
pnpm add -D source-map-explorer
source-map-explorer dist/assets/*.js`}</code>
        </pre>
      </section>

      <section>
        <h2>Identifying Large Dependencies</h2>
        <p>
          After running a bundle analysis, look for the biggest rectangles in the treemap. Common offenders include
          date libraries, charting libraries, rich text editors, and utility libraries imported in full.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-3 text-left">Heavy Library</th>
                <th className="p-3 text-left">Size (minified)</th>
                <th className="p-3 text-left">Lighter Alternative</th>
                <th className="p-3 text-left">Size (minified)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3">moment.js</td>
                <td className="p-3">~300KB</td>
                <td className="p-3">date-fns</td>
                <td className="p-3">~3KB per function</td>
              </tr>
              <tr>
                <td className="p-3">lodash (full)</td>
                <td className="p-3">~70KB</td>
                <td className="p-3">lodash-es (tree-shaken)</td>
                <td className="p-3">~2KB per function</td>
              </tr>
              <tr>
                <td className="p-3">chart.js</td>
                <td className="p-3">~200KB</td>
                <td className="p-3">lightweight-charts / recharts</td>
                <td className="p-3">~40-80KB</td>
              </tr>
              <tr>
                <td className="p-3">numeral.js</td>
                <td className="p-3">~30KB</td>
                <td className="p-3">Intl.NumberFormat (native)</td>
                <td className="p-3">0KB</td>
              </tr>
              <tr>
                <td className="p-3">uuid</td>
                <td className="p-3">~12KB</td>
                <td className="p-3">crypto.randomUUID() (native)</td>
                <td className="p-3">0KB</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Replacing Heavy Libraries</h2>
        <p>
          The fastest way to shrink your bundle is to replace heavy dependencies with lighter alternatives or native
          browser APIs:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// ❌ moment.js — 300KB, not tree-shakeable
import moment from 'moment';
const formatted = moment(date).format('YYYY-MM-DD');

// ✅ date-fns — ~3KB per function, tree-shakeable
import { format } from 'date-fns';
const formatted = format(date, 'yyyy-MM-dd');

// ✅ Native Intl API — 0KB additional
const formatted = new Intl.DateTimeFormat('en-CA').format(date);

// ❌ lodash full import — 70KB
import _ from 'lodash';
const result = _.groupBy(items, 'category');

// ✅ lodash-es individual import — ~2KB
import { groupBy } from 'lodash-es';
const result = groupBy(items, 'category');

// ✅ Native — 0KB
const result = Object.groupBy(items, (item) =&gt; item.category);`}</code>
        </pre>
      </section>

      <section>
        <h2>Dynamic Imports for Conditional Features</h2>
        <p>
          Not every feature is needed on page load. Use dynamic <code>import()</code> to load code only when the user
          needs it. This moves code out of the main bundle into separate chunks loaded on demand.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// ❌ Static import — always in main bundle
import { PDFViewer } from './PDFViewer';
import { MarkdownEditor } from './MarkdownEditor';

// ✅ Dynamic import — loaded only when needed
const PDFViewer = React.lazy(() =&gt; import('./PDFViewer'));
const MarkdownEditor = React.lazy(() =&gt; import('./MarkdownEditor'));

// ✅ Event-driven dynamic import for one-off features
async function handleExportCSV() {
  const { exportToCSV } = await import('./csvExporter');
  exportToCSV(data);
}

// ✅ Conditionally load heavy libraries
async function handleChartRender(data) {
  const { Chart } = await import('chart.js/auto');
  new Chart(canvasRef.current, {
    type: 'line',
    data: { datasets: [{ data }] },
  });
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Performance Budgets in CI/CD</h2>
        <p>
          A performance budget sets hard limits on bundle sizes that fail the CI build when exceeded. This prevents
          gradual bundle bloat over time — the most common way bundles grow out of control.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// webpack.config.js — built-in performance budgets
module.exports = {
  performance: {
    maxAssetSize: 250_000,      // 250KB per asset
    maxEntrypointSize: 500_000, // 500KB per entry point
    hints: 'error',             // Fail the build (not just warn)
  },
};

// bundlesize — CI integration for any bundler
// package.json
{
  "bundlesize": [
    { "path": "dist/main.*.js", "maxSize": "150KB" },
    { "path": "dist/vendor.*.js", "maxSize": "300KB" },
    { "path": "dist/**/*.css", "maxSize": "50KB" }
  ]
}

// GitHub Action step
// - name: Check bundle size
//   run: npx bundlesize`}</code>
        </pre>
      </section>

      <section>
        <h2>Bundler Optimization Config</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Webpack — key optimization settings
module.exports = {
  mode: 'production',  // Enables tree shaking, minification
  optimization: {
    usedExports: true,           // Mark unused exports
    concatenateModules: true,    // Scope hoisting
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 20,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
        // Separate large libraries into own chunks
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 10,
        },
      },
    },
  },
};

// Vite — already optimized by default, but you can tune
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 500, // KB
  },
});`}</code>
        </pre>
      </section>

      <section>
        <h2>External Modules & CDN Loading</h2>
        <p>
          For widely-used libraries like React, you can exclude them from your bundle and load them from a CDN.
          This leverages shared browser caching and reduces your bundle size significantly.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// webpack.config.js — mark React as external
module.exports = {
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};

// index.html — load from CDN
// <script crossorigin src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
// <script crossorigin src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>

// Vite equivalent — using vite-plugin-cdn-import
import cdn from 'vite-plugin-cdn-import';

export default defineConfig({
  plugins: [
    cdn({
      modules: [
        { name: 'react', var: 'React', path: 'umd/react.production.min.js' },
        { name: 'react-dom', var: 'ReactDOM', path: 'umd/react-dom.production.min.js' },
      ],
    }),
  ],
});`}</code>
        </pre>
      </section>

      <section>
        <h2>Real-World Strategy: 2MB to 500KB</h2>
        <p>
          Here's a typical optimization journey for a React application that starts at 2MB:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Analyze:</strong> Run webpack-bundle-analyzer. Discover moment.js (300KB), lodash (70KB),
            a charting library (200KB), and unminified source maps in production.
          </li>
          <li>
            <strong>Replace moment with date-fns:</strong> -290KB (only import 3 functions used).
          </li>
          <li>
            <strong>Switch to lodash-es:</strong> -60KB (tree shaking removes unused functions).
          </li>
          <li>
            <strong>Lazy-load charts:</strong> -200KB from main bundle (loaded on-demand when user visits dashboard).
          </li>
          <li>
            <strong>Split vendor chunks:</strong> -100KB from initial load (React/router in separate cached chunk).
          </li>
          <li>
            <strong>Remove duplicate dependencies:</strong> Run <code>pnpm dedupe</code> to eliminate duplicated
            packages. Saves -50KB.
          </li>
          <li>
            <strong>Enable gzip/Brotli compression:</strong> Server-side compression reduces transfer size by ~70%.
          </li>
          <li>
            <strong>Result:</strong> 2MB → ~500KB (uncompressed), ~150KB over the wire with Brotli.
          </li>
        </ol>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-2">
          <li>
            Always measure before optimizing — use webpack-bundle-analyzer or source-map-explorer to identify what's
            actually consuming space in your bundle.
          </li>
          <li>
            The biggest wins come from replacing heavy libraries (moment → date-fns, lodash → lodash-es) and
            leveraging native browser APIs (Intl, crypto.randomUUID, structuredClone).
          </li>
          <li>
            Dynamic imports via <code>React.lazy()</code> and <code>import()</code> move non-critical code out of
            the main bundle, reducing initial load time without removing features.
          </li>
          <li>
            Performance budgets in CI/CD prevent bundle size regression — they fail the build when any chunk exceeds
            the configured limit.
          </li>
          <li>
            Bundler config matters: split vendor chunks for caching, enable scope hoisting, and configure
            <code>splitChunks</code> to prevent duplicated modules across lazy-loaded routes.
          </li>
          <li>
            In production, server-side compression (Brotli/gzip) reduces transfer size by ~70%, but doesn't reduce
            parse time — you still need to minimize the uncompressed bundle size.
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/reduce-javascript-payloads-with-code-splitting/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Reduce JavaScript Payloads
            </a>
          </li>
          <li>
            <a href="https://webpack.js.org/configuration/performance/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Webpack — Performance Configuration
            </a>
          </li>
          <li>
            <a href="https://bundlephobia.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Bundlephobia — Find the Cost of Adding a npm Package
            </a>
          </li>
          <li>
            <a href="https://vitejs.dev/guide/build.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Vite — Building for Production
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
