"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { MermaidDiagram } from "@/components/articles/MermaidDiagram";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-bundle-size-optimization-extensive",
  title: "Bundle Size Optimization",
  description: "Comprehensive guide to analyzing, reducing, and monitoring JavaScript bundle sizes with practical strategies, tooling, and real-world optimization workflows.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "bundle-size-optimization",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "bundle-size", "webpack", "vite", "optimization", "code-splitting"],
  relatedTopics: ["tree-shaking", "code-splitting", "lazy-loading"],
};

export default function BundleSizeOptimizationExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Bundle size optimization</strong> is the systematic practice of reducing the volume of JavaScript,
          CSS, and other assets that a web application ships to the browser. In modern single-page applications (SPAs)
          and server-rendered apps alike, the JavaScript bundle is typically the largest performance bottleneck: it
          must be downloaded, parsed, compiled, and executed before the application becomes interactive.
        </p>
        <p>
          The impact is measurable. Research from Google shows that for every 100KB of JavaScript added, Time to
          Interactive (TTI) increases by approximately 350ms on a mid-range mobile device over a 4G connection. A
          2MB JavaScript bundle — common in unoptimized React applications — translates to roughly 7 seconds of
          additional TTI. This directly impacts Core Web Vitals, user engagement, and conversion rates.
        </p>
        <p>
          Bundle size optimization isn't a single technique — it's a layered strategy combining measurement, dependency
          management, build configuration, code architecture, and continuous monitoring. The most effective teams treat
          bundle size like any other quality metric: they measure it, set budgets, and enforce those budgets in CI/CD.
        </p>
        <p>
          This article walks through the complete optimization lifecycle: from understanding what's in your bundle,
          to applying targeted reductions, to ensuring those gains persist over time.
        </p>
      </section>

      <section>
        <h2>Why Bundle Size Matters</h2>
        <p>
          JavaScript is the most expensive resource browsers process per byte. Unlike images (which can be decoded
          progressively), JavaScript must be fully downloaded, parsed, compiled to bytecode, and executed before
          it produces any visible result. This cost compounds on three axes:
        </p>

        <MermaidDiagram
          chart={`flowchart LR
    A[Download] -->|Network cost| B[Parse]
    B -->|CPU cost| C[Compile]
    C -->|CPU cost| D[Execute]
    D -->|Memory cost| E[Interactive]
    style A fill:#ef4444,color:#fff
    style B fill:#f97316,color:#fff
    style C fill:#eab308,color:#000
    style D fill:#22c55e,color:#fff
    style E fill:#3b82f6,color:#fff`}
          caption="JavaScript processing pipeline — each stage adds latency before interactivity"
        />

        <ul className="space-y-3">
          <li>
            <strong>Network cost:</strong> Every kilobyte must traverse the network. On a 3G connection (~400KB/s
            effective throughput), a 2MB bundle takes 5 seconds just to download. Even on fast 4G, parse and
            compile time dominate.
          </li>
          <li>
            <strong>CPU cost:</strong> Parsing and compiling JavaScript is CPU-intensive. A budget Android phone has
            roughly 4-6x slower JavaScript processing than a MacBook. The same 2MB bundle that takes 0.5s to process
            on desktop takes 2-3s on a mid-range phone.
          </li>
          <li>
            <strong>Memory cost:</strong> Every parsed module consumes heap memory. Large bundles push memory usage
            higher, increasing garbage collection pauses and reducing available memory for application data.
          </li>
          <li>
            <strong>Cache invalidation:</strong> When a single line of code changes in a monolithic bundle, the entire
            file's cache is busted. Users re-download the whole bundle even though 99.9% of it hasn't changed.
          </li>
        </ul>

        <h3 className="mt-6 font-semibold">The Business Impact</h3>
        <p>
          Performance directly correlates with business metrics. Studies from major companies consistently show:
        </p>
        <ul className="space-y-2">
          <li>Amazon: Every 100ms of latency costs 1% in sales</li>
          <li>Pinterest: Reducing wait time by 40% increased sign-up conversions by 15%</li>
          <li>BBC: Each additional second of page load loses 10% of users</li>
          <li>Walmart: For every 1 second improvement in load time, conversions increased by 2%</li>
        </ul>
      </section>

      <section>
        <h2>Measuring Bundle Size</h2>
        <p>
          Effective optimization starts with accurate measurement. You need to understand not just the total size,
          but the composition — which modules, libraries, and files contribute to the bundle and how much.
        </p>

        <h3 className="mt-6 font-semibold">webpack-bundle-analyzer</h3>
        <p>
          The gold standard for Webpack projects. It generates an interactive zoomable treemap where rectangle sizes
          correspond to file sizes. You can instantly spot outsized dependencies and duplicated modules.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`# Install
pnpm add -D webpack-bundle-analyzer

// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',       // Generates HTML file
      reportFilename: 'bundle-report.html',
      openAnalyzer: false,           // Don't auto-open in browser
      defaultSizes: 'gzip',         // Show gzipped sizes
    }),
  ],
};

// For Next.js — use the official plugin
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // your Next.js config
});

// Run: ANALYZE=true pnpm build`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">source-map-explorer</h3>
        <p>
          Works with any bundler that produces source maps. It parses the source map to attribute every byte in the
          output back to its original source file. Particularly useful for Vite, Rollup, and esbuild projects.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`# Install
pnpm add -D source-map-explorer

# Analyze — pass your built JS files
source-map-explorer dist/assets/index-*.js

# Generate HTML report
source-map-explorer dist/assets/index-*.js --html report.html

# Analyze multiple bundles at once
source-map-explorer dist/assets/*.js --html report.html

# For projects using Vite, ensure source maps are enabled:
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true,  // Required for source-map-explorer
  },
});`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Bundlephobia</h3>
        <p>
          A web service at <code>bundlephobia.com</code> that shows the cost of any npm package before you install it.
          It reports the minified size, minified + gzipped size, download time, and whether the package supports
          tree shaking. Use it as a decision tool when evaluating dependencies.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`# CLI alternative — check package sizes from terminal
pnpm add -D bundlesize

# Check sizes of installed packages
npx cost-of-modules

# Example output:
# ┌──────────────────┬──────────┬─────────┐
# │ name             │ children │ size    │
# ├──────────────────┼──────────┼─────────┤
# │ moment           │ 0        │ 289.7KB │
# │ lodash           │ 0        │ 71.5KB  │
# │ react-dom        │ 1        │ 42.2KB  │
# │ @mui/material    │ 15       │ 38.1KB  │
# │ react            │ 1        │ 7.3KB   │
# └──────────────────┴──────────┴─────────┘`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Import Cost (IDE Integration)</h3>
        <p>
          The "Import Cost" VS Code extension shows the size of every imported package inline in your editor as you
          code. This creates immediate feedback — developers see the cost of their import choices in real time. It
          uses Webpack under the hood to calculate the actual bundled size (including tree shaking).
        </p>
      </section>

      <section>
        <h2>Identifying Large Dependencies</h2>
        <p>
          After measuring, you'll typically find that 80% of bundle size comes from 20% of dependencies. The
          optimization strategy varies based on the type of dependency.
        </p>

        <MermaidDiagram
          chart={`pie title Typical Unoptimized Bundle (2MB)
    "moment.js" : 300
    "lodash" : 70
    "Chart library" : 200
    "React + ReactDOM" : 140
    "UI component library" : 250
    "Rich text editor" : 300
    "Application code" : 340
    "Other node_modules" : 400`}
          caption="Common bundle composition before optimization — third-party code dominates"
        />

        <h3 className="mt-6 font-semibold">Categories of Heavy Dependencies</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Examples</th>
                <th className="p-3 text-left">Typical Size</th>
                <th className="p-3 text-left">Optimization Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3">Date/Time</td>
                <td className="p-3">moment.js, luxon</td>
                <td className="p-3">70–300KB</td>
                <td className="p-3">Replace with date-fns or native Intl</td>
              </tr>
              <tr>
                <td className="p-3">Utilities</td>
                <td className="p-3">lodash, underscore, ramda</td>
                <td className="p-3">25–70KB</td>
                <td className="p-3">Use ES module version or native methods</td>
              </tr>
              <tr>
                <td className="p-3">Charting</td>
                <td className="p-3">chart.js, d3, highcharts</td>
                <td className="p-3">100–500KB</td>
                <td className="p-3">Lazy-load, use lighter libraries</td>
              </tr>
              <tr>
                <td className="p-3">Rich Text</td>
                <td className="p-3">quill, draft-js, tiptap</td>
                <td className="p-3">150–400KB</td>
                <td className="p-3">Lazy-load, load only when editing</td>
              </tr>
              <tr>
                <td className="p-3">UI Frameworks</td>
                <td className="p-3">MUI, Ant Design, Chakra</td>
                <td className="p-3">100–300KB</td>
                <td className="p-3">Tree-shake, import components directly</td>
              </tr>
              <tr>
                <td className="p-3">Maps</td>
                <td className="p-3">mapbox-gl, google-maps</td>
                <td className="p-3">200–600KB</td>
                <td className="p-3">Lazy-load, load only on map pages</td>
              </tr>
              <tr>
                <td className="p-3">Polyfills</td>
                <td className="p-3">core-js, regenerator-runtime</td>
                <td className="p-3">50–150KB</td>
                <td className="p-3">Use browserslist, polyfill.io for targeted loading</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 font-semibold">Detecting Duplicates</h3>
        <p>
          Duplicate dependencies are a hidden source of bloat. If two libraries depend on different versions of the
          same package, both versions end up in your bundle.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`# Find duplicate packages in your bundle
npx duplicate-package-checker-webpack-plugin

# With pnpm — deduplicate dependencies
pnpm dedupe

# Inspect why a package is installed (dependency chain)
pnpm why lodash

# Example output:
# dependencies:
#   react-table 7.8.0
#     dependencies:
#       lodash 4.17.21
#   formik 2.4.5
#     dependencies:
#       lodash 4.17.21  ← duplicate!

# Fix: hoist to a single version in package.json
# or use pnpm overrides to force a single version
{
  "pnpm": {
    "overrides": {
      "lodash": "4.17.21"
    }
  }
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Replacing Heavy Libraries with Lighter Alternatives</h2>
        <p>
          The most impactful optimization is often replacing heavy third-party libraries. This section covers
          the most common replacements and the decision framework for evaluating alternatives.
        </p>

        <h3 className="mt-6 font-semibold">Date/Time Libraries</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// ❌ moment.js — 300KB, not tree-shakeable, mutable API
import moment from 'moment';
import 'moment/locale/es';  // Each locale adds more weight

const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');
const relative = moment(date).fromNow();
const isValid = moment(input, 'YYYY-MM-DD', true).isValid();

// ✅ date-fns — ~3KB per function, fully tree-shakeable, immutable
import { addDays, format, formatDistanceToNow, isValid, parse } from 'date-fns';

const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
const relative = formatDistanceToNow(date, { addSuffix: true });
const valid = isValid(parse(input, 'yyyy-MM-dd', new Date()));

// ✅ Native Intl — 0KB, excellent browser support
const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
const formatted = formatter.format(date);

const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const relative = relativeFormatter.format(-1, 'day');  // "yesterday"`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Utility Libraries</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// ❌ Full lodash import — 70KB
import _ from 'lodash';
const grouped = _.groupBy(items, 'status');
const unique = _.uniqBy(items, 'id');
const deep = _.cloneDeep(config);
const result = _.debounce(handler, 300);

// ✅ lodash-es — tree-shakeable, only include what you use
import { groupBy, uniqBy, cloneDeep, debounce } from 'lodash-es';

// ✅ Native alternatives — 0KB
// groupBy → Object.groupBy (Stage 4, widely supported)
const grouped = Object.groupBy(items, (item) => item.status);

// uniqBy → Set + Map
const unique = [...new Map(items.map(i => [i.id, i])).values()];

// cloneDeep → structuredClone (native, all modern browsers)
const deep = structuredClone(config);

// debounce — small custom implementation (~20 lines)
function debounce(fn, ms) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Other Common Replacements</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// ❌ uuid — 12KB
import { v4 as uuidv4 } from 'uuid';
const id = uuidv4();

// ✅ Native crypto — 0KB
const id = crypto.randomUUID();

// ❌ axios — 14KB (when fetch is sufficient)
import axios from 'axios';
const { data } = await axios.get('/api/users');

// ✅ Native fetch — 0KB (covers most use cases)
const data = await fetch('/api/users').then(r => r.json());

// ❌ classnames — 2KB (simple cases don't need it)
import cn from 'classnames';
const cls = cn('btn', { 'btn-active': isActive });

// ✅ Template literal — 0KB
const cls = \`btn \${isActive ? 'btn-active' : ''}\`.trim();

// ❌ numeral.js — 30KB
import numeral from 'numeral';
const formatted = numeral(1234567).format('0,0');

// ✅ Native Intl.NumberFormat — 0KB
const formatted = new Intl.NumberFormat('en-US').format(1234567);`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Decision Framework</h3>
        <p>
          Before replacing a library, evaluate these factors:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Size delta:</strong> How much will you actually save? Use Bundlephobia to compare.
            If the savings are under 5KB, the engineering effort may not be worth it.
          </li>
          <li>
            <strong>API surface used:</strong> If you use 2 functions from a 300KB library, replacement is high
            value. If you use 50 features extensively, the migration cost is high.
          </li>
          <li>
            <strong>Browser support:</strong> Native APIs like <code>Object.groupBy()</code> and
            <code>crypto.randomUUID()</code> are widely supported but verify against your browserslist.
          </li>
          <li>
            <strong>Correctness:</strong> Date handling and number formatting have edge cases. Native APIs
            follow the Unicode CLDR standard and handle locales correctly — sometimes better than libraries.
          </li>
        </ul>
      </section>

      <section>
        <h2>Dynamic Imports for Conditional Features</h2>
        <p>
          Dynamic <code>import()</code> is the primary mechanism for moving code out of the main bundle into
          on-demand chunks. The bundler creates a separate file for each dynamic import, loaded only when the
          import expression is evaluated at runtime.
        </p>

        <MermaidDiagram
          chart={`flowchart TD
    A[Main Bundle<br/>200KB] --> B[User lands on page]
    B --> C{User action?}
    C -->|Views dashboard| D[Load chart-chunk.js<br/>150KB]
    C -->|Opens editor| E[Load editor-chunk.js<br/>200KB]
    C -->|Exports PDF| F[Load pdf-chunk.js<br/>100KB]
    C -->|No action| G[No extra JS loaded]
    style A fill:#3b82f6,color:#fff
    style D fill:#f97316,color:#fff
    style E fill:#f97316,color:#fff
    style F fill:#f97316,color:#fff
    style G fill:#22c55e,color:#fff`}
          caption="Dynamic imports split conditional features into separate chunks loaded on demand"
        />

        <h3 className="mt-6 font-semibold">Route-Level Code Splitting</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// React Router with lazy routes
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Each route gets its own chunk — loaded when user navigates
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));  // includes chart library
const Settings = lazy(() => import('./pages/Settings'));
const Editor = lazy(() => import('./pages/Editor'));         // includes rich text editor

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// Next.js App Router does this automatically —
// each page.tsx in app/ is its own chunk`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Component-Level Code Splitting</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Lazy-load heavy components within a page
import { lazy, Suspense, useState } from 'react';

// These components are NOT in the main bundle
const MarkdownEditor = lazy(() => import('./MarkdownEditor'));
const PDFExporter = lazy(() => import('./PDFExporter'));
const DataVisualizer = lazy(() => import('./DataVisualizer'));

function DocumentPage({ document }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showViz, setShowViz] = useState(false);

  return (
    <div>
      <h1>{document.title}</h1>

      {/* Editor loaded only when user clicks Edit */}
      {isEditing ? (
        <Suspense fallback={<div>Loading editor...</div>}>
          <MarkdownEditor content={document.content} />
        </Suspense>
      ) : (
        <div>
          <div dangerouslySetInnerHTML={{ __html: document.html }} />
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}

      {/* Visualization loaded only when toggled */}
      <button onClick={() => setShowViz(true)}>Show Analytics</button>
      {showViz && (
        <Suspense fallback={<div>Loading charts...</div>}>
          <DataVisualizer data={document.analytics} />
        </Suspense>
      )}
    </div>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Event-Driven Dynamic Imports</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Load libraries on-demand for one-off features

// CSV export — loaded only when user clicks "Export"
async function handleExportCSV(data) {
  const { stringify } = await import('csv-stringify/browser/esm');
  const csv = stringify(data, { header: true });
  downloadFile(csv, 'export.csv', 'text/csv');
}

// PDF generation — loaded only when user clicks "Download PDF"
async function handleDownloadPDF(element) {
  const { default: html2pdf } = await import('html2pdf.js');
  html2pdf().from(element).save('document.pdf');
}

// Syntax highlighting — loaded when code block enters viewport
function CodeBlock({ code, language }) {
  const [highlighted, setHighlighted] = useState(code);

  useEffect(() => {
    let cancelled = false;
    import('highlight.js/lib/core').then(async (hljs) => {
      // Load only the language grammar needed
      const lang = await import(\`highlight.js/lib/languages/\${language}\`);
      hljs.default.registerLanguage(language, lang.default);
      if (!cancelled) {
        setHighlighted(hljs.default.highlight(code, { language }).value);
      }
    });
    return () => { cancelled = true; };
  }, [code, language]);

  return <pre><code dangerouslySetInnerHTML={{ __html: highlighted }} /></pre>;
}

// Prefetch on hover — load chunk before user clicks
function NavLink({ to, children }) {
  const handleMouseEnter = () => {
    // Webpack magic comment to prefetch the chunk
    import(/* webpackPrefetch: true */ \`./pages/\${to}\`);
  };

  return (
    <Link to={to} onMouseEnter={handleMouseEnter}>
      {children}
    </Link>
  );
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Performance Budgets in CI/CD</h2>
        <p>
          Performance budgets are the single most effective tool for preventing bundle size regression. Without
          automated enforcement, bundles grow inexorably as developers add features and dependencies. A performance
          budget sets a hard ceiling that fails the build when exceeded.
        </p>

        <MermaidDiagram
          chart={`flowchart LR
    A[Developer pushes code] --> B[CI builds project]
    B --> C{Bundle size check}
    C -->|Under budget| D[Tests pass ✓]
    C -->|Over budget| E[Build fails ✗]
    E --> F[Developer optimizes]
    F --> A
    D --> G[Deploy]`}
          caption="Performance budget enforcement in the CI/CD pipeline"
        />

        <h3 className="mt-6 font-semibold">Webpack Built-in Budgets</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// webpack.config.js
module.exports = {
  performance: {
    // Maximum size for any individual asset (JS, CSS, images)
    maxAssetSize: 250_000,        // 250KB

    // Maximum combined size of all assets for an entry point
    maxEntrypointSize: 500_000,   // 500KB

    // 'error' fails the build; 'warning' just logs
    hints: 'error',

    // Only check JS and CSS files (ignore images, fonts)
    assetFilter: function (assetFilename) {
      return /\\.(js|css)$/.test(assetFilename);
    },
  },
};

// Build output when budget is exceeded:
// ERROR in entrypoint size limit: The following entrypoint(s)
// combined asset size exceeds the recommended limit (500 kB).
// main (687 kB)
//   main.js (687 kB)`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">bundlesize — Granular CI Checks</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// package.json — granular per-file budgets
{
  "bundlesize": [
    {
      "path": "dist/main.*.js",
      "maxSize": "150KB",
      "compression": "gzip"
    },
    {
      "path": "dist/vendor.*.js",
      "maxSize": "200KB",
      "compression": "gzip"
    },
    {
      "path": "dist/pages/*.js",
      "maxSize": "50KB",
      "compression": "gzip"
    },
    {
      "path": "dist/**/*.css",
      "maxSize": "30KB",
      "compression": "gzip"
    }
  ],
  "scripts": {
    "check:bundle": "bundlesize"
  }
}

// GitHub Actions workflow
// .github/workflows/bundle-check.yml
// name: Bundle Size Check
// on: [pull_request]
// jobs:
//   check:
//     runs-on: ubuntu-latest
//     steps:
//       - uses: actions/checkout@v4
//       - uses: pnpm/action-setup@v2
//       - run: pnpm install
//       - run: pnpm build
//       - run: pnpm check:bundle
//         env:
//           BUNDLESIZE_GITHUB_TOKEN: \${{ secrets.BUNDLESIZE_GITHUB_TOKEN }}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Size Limit — Zero Config Alternative</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`# Install size-limit with the appropriate preset
pnpm add -D size-limit @size-limit/preset-app

// package.json
{
  "size-limit": [
    {
      "path": "dist/assets/index-*.js",
      "limit": "150 KB"
    },
    {
      "path": "dist/assets/vendor-*.js",
      "limit": "200 KB"
    }
  ],
  "scripts": {
    "size": "size-limit",
    "size:why": "size-limit --why"  // Opens bundle analyzer
  }
}

// CI output:
//   Package size: 143.2 KB (gzip)
//   Size limit:   150 KB
//   ✓ Under the limit

// When budget is exceeded:
//   Package size: 167.8 KB (gzip)
//   Size limit:   150 KB
//   ✗ Over the limit by 17.8 KB
//   exit code 1 → CI fails`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Setting Realistic Budgets</h3>
        <p>
          Start by measuring your current bundle sizes, then set budgets slightly below current values. Ratchet
          them down over time as you optimize:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Initial page load (entry point):</strong> Target under 200KB gzipped for the main JS bundle.
            This translates to roughly 3 seconds TTI on a mid-range mobile device over 4G.
          </li>
          <li>
            <strong>Route chunks:</strong> Target under 50KB gzipped per route. Users will wait briefly for
            navigation, but chunks over 50KB create noticeable delays.
          </li>
          <li>
            <strong>Total JavaScript:</strong> Target under 500KB gzipped for all JavaScript combined (including
            lazy-loaded chunks). This is the "all pages visited" ceiling.
          </li>
        </ul>
      </section>

      <section>
        <h2>Webpack Optimization Configuration</h2>
        <p>
          Webpack provides extensive configuration for controlling how bundles are split, optimized, and compressed.
          Understanding these options is essential for production builds.
        </p>

        <h3 className="mt-6 font-semibold">Complete Production Configuration</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// webpack.config.js — production optimization
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  mode: 'production',

  optimization: {
    // Minification
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,      // Remove console.log
            drop_debugger: true,     // Remove debugger statements
            pure_funcs: ['console.info', 'console.debug'],
          },
          mangle: {
            safari10: true,          // Work around Safari 10 bugs
          },
          output: {
            comments: false,         // Remove all comments
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],

    // Tree shaking
    usedExports: true,

    // Scope hoisting — merges modules for better dead code elimination
    concatenateModules: true,

    // Module IDs — deterministic for long-term caching
    moduleIds: 'deterministic',

    // Runtime chunk — extract Webpack runtime for better caching
    runtimeChunk: 'single',

    // Split chunks strategy
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 25,
      maxAsyncRequests: 25,
      minSize: 20_000,            // 20KB minimum chunk size

      cacheGroups: {
        // React ecosystem — changes rarely, cache aggressively
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 40,
        },

        // Router — changes with route structure updates
        router: {
          test: /[\\/]node_modules[\\/](react-router|react-router-dom)[\\/]/,
          name: 'router',
          chunks: 'all',
          priority: 30,
        },

        // Other vendor code — moderate cache lifetime
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 10,
        },

        // Shared application code used by multiple routes
        common: {
          name: 'common',
          minChunks: 2,            // Must be used by 2+ chunks
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  },

  plugins: [
    // Generate gzip and Brotli compressed versions
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\\.(js|css|html|svg)$/,
      threshold: 10240,            // Only compress files > 10KB
      minRatio: 0.8,
    }),
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      test: /\\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
      filename: '[path][base].br',
    }),
  ],
};`}</code>
        </pre>
      </section>

      <section>
        <h2>Vite Optimization Configuration</h2>
        <p>
          Vite uses Rollup for production builds, which has excellent tree shaking out of the box. However,
          you can still tune chunk splitting and compression settings.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// vite.config.ts — production optimization
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    // Bundle visualization (only in analyze mode)
    process.env.ANALYZE && visualizer({
      open: true,
      gzipSize: true,
      filename: 'dist/stats.html',
    }),
    // Pre-compress assets
    viteCompression({ algorithm: 'gzip' }),
    viteCompression({ algorithm: 'brotliCompress' }),
  ],

  build: {
    // Target modern browsers — avoids unnecessary polyfills
    target: 'es2020',

    // Warn on large chunks
    chunkSizeWarningLimit: 500, // KB

    // CSS code splitting — each async chunk gets its own CSS
    cssCodeSplit: true,

    rollupOptions: {
      output: {
        // Manual chunk splitting
        manualChunks: {
          // React core — cached long-term
          react: ['react', 'react-dom'],

          // Router — cached separately
          router: ['react-router-dom'],

          // State management
          state: ['zustand'],
        },

        // Or use a function for dynamic chunk assignment
        // manualChunks(id) {
        //   if (id.includes('node_modules')) {
        //     // Group by package name
        //     const packageName = id.match(
        //       /node_modules\\/(.+?)\\//
        //     )?.[1];
        //
        //     if (['react', 'react-dom'].includes(packageName)) {
        //       return 'react';
        //     }
        //     return 'vendor';
        //   }
        // },
      },
    },

    // Minification — esbuild is faster, terser produces smaller output
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});`}</code>
        </pre>
      </section>

      <section>
        <h2>External Modules & CDN Loading</h2>
        <p>
          Externalizing large, stable libraries (like React) removes them from your bundle entirely. They're
          loaded from a CDN instead, which provides two benefits: reduced bundle size and shared caching across
          sites that use the same CDN.
        </p>

        <h3 className="mt-6 font-semibold">Webpack Externals</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// webpack.config.js
module.exports = {
  externals: {
    // key = import name, value = global variable on window
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};

// In your HTML template, add CDN script tags:
// <script crossorigin src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script>
// <script crossorigin src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js"></script>

// Your application code continues to use normal imports:
import React from 'react';
import ReactDOM from 'react-dom/client';
// Webpack resolves these to the global variables at runtime`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Import Maps (Modern Alternative)</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Import maps — native browser feature, no bundler plugin needed -->
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom": "https://esm.sh/react-dom@18.2.0",
    "react-dom/client": "https://esm.sh/react-dom@18.2.0/client"
  }
}
</script>

<!-- Application imports resolve to the CDN URLs above -->
<script type="module" src="/app.js"></script>`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Trade-offs of CDN Loading</h3>
        <ul className="space-y-2">
          <li>
            <strong>Pro — Reduced bundle size:</strong> React + ReactDOM are ~42KB gzipped. Externalizing them
            saves that from every build and deployment.
          </li>
          <li>
            <strong>Pro — Shared caching:</strong> If a user visited another site using the same CDN URL,
            the library is already cached in their browser.
          </li>
          <li>
            <strong>Con — Additional DNS lookup:</strong> Loading from a CDN requires a DNS lookup, TCP connection,
            and TLS handshake to a new origin. This adds 100-300ms on the first load.
          </li>
          <li>
            <strong>Con — CDN reliability:</strong> Your application now depends on a third-party CDN being available.
            If the CDN goes down, your app breaks. Mitigate with a local fallback script.
          </li>
          <li>
            <strong>Con — Version management:</strong> You must manually keep CDN versions in sync with your
            package.json. Version mismatches can cause subtle runtime errors.
          </li>
          <li>
            <strong>Con — No tree shaking:</strong> CDN-loaded libraries ship their full UMD build. You can't
            tree-shake React itself (though it's already lean).
          </li>
        </ul>
      </section>

      <section>
        <h2>Compression: Gzip vs Brotli</h2>
        <p>
          Server-side compression dramatically reduces transfer size. All modern browsers support gzip; most also
          support Brotli, which achieves 15-25% better compression ratios for JavaScript and CSS.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Nginx configuration for Brotli + gzip
// nginx.conf
http {
  # Enable gzip (fallback)
  gzip on;
  gzip_types text/plain text/css application/json
             application/javascript text/xml;
  gzip_min_length 1000;
  gzip_comp_level 6;

  # Enable Brotli (preferred)
  brotli on;
  brotli_types text/plain text/css application/json
               application/javascript text/xml;
  brotli_comp_level 6;

  # Serve pre-compressed files if available
  # (generated by CompressionPlugin during build)
  brotli_static on;
  gzip_static on;
}

// Express.js with compression middleware
import compression from 'compression';
import shrinkRay from 'shrink-ray-current'; // Brotli support

// gzip only
app.use(compression());

// Brotli + gzip with shrink-ray
app.use(shrinkRay());`}</code>
        </pre>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-3 text-left">Metric</th>
                <th className="p-3 text-left">Uncompressed</th>
                <th className="p-3 text-left">Gzip</th>
                <th className="p-3 text-left">Brotli</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3">Typical JS bundle</td>
                <td className="p-3">500KB</td>
                <td className="p-3">~150KB (70% reduction)</td>
                <td className="p-3">~125KB (75% reduction)</td>
              </tr>
              <tr>
                <td className="p-3">Browser support</td>
                <td className="p-3">N/A</td>
                <td className="p-3">~100%</td>
                <td className="p-3">~97%</td>
              </tr>
              <tr>
                <td className="p-3">Compression speed</td>
                <td className="p-3">N/A</td>
                <td className="p-3">Fast</td>
                <td className="p-3">Slower (pre-compress at build time)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Monitoring Bundle Size Over Time</h2>
        <p>
          One-time optimization is not enough. Bundles grow naturally as features are added and dependencies updated.
          Continuous monitoring detects regressions early.
        </p>

        <MermaidDiagram
          chart={`flowchart TD
    A[Every PR] --> B[Build project]
    B --> C[Record bundle sizes]
    C --> D[Compare to baseline]
    D --> E{Size increased?}
    E -->|No| F[✓ Merge allowed]
    E -->|Yes| G{Within budget?}
    G -->|Yes| H[⚠ Warning comment on PR]
    H --> F
    G -->|No| I[✗ Block merge]
    I --> J[Developer investigates]
    J --> K[Optimize or justify]
    K --> A`}
          caption="Continuous bundle size monitoring workflow"
        />

        <h3 className="mt-6 font-semibold">Tracking with GitHub Actions</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`# .github/workflows/bundle-size.yml
name: Bundle Size Report
on: pull_request

jobs:
  bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install
      - run: pnpm build

      # Compare bundle size to main branch
      - uses: andresz1/size-limit-action@v1
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          # Posts a comment on the PR with size diff:
          # | File         | Size (main) | Size (PR) | Diff    |
          # |------------- |-------------|-----------|---------|
          # | main.js      | 142.3 KB    | 148.7 KB  | +6.4 KB |
          # | vendor.js    | 198.1 KB    | 198.1 KB  | 0 KB    |`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Recording Historical Data</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Custom script to track bundle sizes over time
// scripts/record-bundle-size.js
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '../dist/assets');
const files = fs.readdirSync(distPath).filter(f => f.endsWith('.js'));

const sizes = files.map(file => ({
  name: file.replace(/-[a-f0-9]+\\.js$/, '.js'),
  size: fs.statSync(path.join(distPath, file)).size,
  sizeKB: (fs.statSync(path.join(distPath, file)).size / 1024).toFixed(1),
}));

const record = {
  timestamp: new Date().toISOString(),
  commit: process.env.GITHUB_SHA?.slice(0, 7),
  branch: process.env.GITHUB_REF_NAME,
  totalSize: sizes.reduce((sum, f) => sum + f.size, 0),
  files: sizes,
};

console.log(JSON.stringify(record, null, 2));

// Append to tracking file or send to a metrics service
// This data powers dashboards showing bundle size trends`}</code>
        </pre>
      </section>

      <section>
        <h2>Real-World Case Study: 2MB to 500KB</h2>
        <p>
          Here's a detailed walkthrough of optimizing a production React dashboard application from 2MB to under
          500KB. Each step includes the technique applied, the tooling used, and the measured impact.
        </p>

        <MermaidDiagram
          chart={`flowchart TD
    A["Starting point<br/>2,048 KB"] --> B["Step 1: Replace moment.js<br/>-290 KB → 1,758 KB"]
    B --> C["Step 2: Switch to lodash-es<br/>-60 KB → 1,698 KB"]
    C --> D["Step 3: Lazy-load charts<br/>-200 KB → 1,498 KB"]
    D --> E["Step 4: Lazy-load rich editor<br/>-300 KB → 1,198 KB"]
    E --> F["Step 5: Remove polyfills<br/>-100 KB → 1,098 KB"]
    F --> G["Step 6: Split vendor chunks<br/>-150 KB initial → 948 KB"]
    G --> H["Step 7: Tree-shake MUI<br/>-180 KB → 768 KB"]
    H --> I["Step 8: Remove duplicates<br/>-68 KB → 700 KB"]
    I --> J["Step 9: Minification tuning<br/>-80 KB → 620 KB"]
    J --> K["Step 10: Native API replacements<br/>-120 KB → 500 KB"]
    style A fill:#ef4444,color:#fff
    style K fill:#22c55e,color:#fff`}
          caption="Step-by-step optimization journey from 2MB to 500KB"
        />

        <h3 className="mt-6 font-semibold">Step-by-Step Breakdown</h3>
        <ol className="space-y-3">
          <li>
            <strong>Replace moment.js with date-fns (-290KB):</strong> The app used 5 moment functions. Replaced
            with date-fns equivalents. The entire moment library (including locales) was eliminated.
          </li>
          <li>
            <strong>Switch lodash to lodash-es (-60KB):</strong> Changed <code>import _ from 'lodash'</code> to
            individual imports from <code>lodash-es</code>. Tree shaking removed ~55 unused utility functions.
          </li>
          <li>
            <strong>Lazy-load charting library (-200KB):</strong> The Chart.js-based dashboard was only visible
            after clicking a "Reports" tab. Wrapped in <code>React.lazy()</code> — 200KB moved to an async chunk.
          </li>
          <li>
            <strong>Lazy-load rich text editor (-300KB):</strong> The Quill editor was only used in a settings page.
            Dynamic import removed it from the main bundle entirely.
          </li>
          <li>
            <strong>Remove unnecessary polyfills (-100KB):</strong> Updated browserslist to target only browsers with
            {'>'} 1% usage. core-js polyfills for features already supported by target browsers were eliminated.
          </li>
          <li>
            <strong>Split vendor chunks (-150KB initial):</strong> Configured splitChunks to separate React, router,
            and vendor code. Total size unchanged but initial load reduced by 150KB (deferred to cached chunks).
          </li>
          <li>
            <strong>Tree-shake MUI components (-180KB):</strong> Changed from barrel imports
            (<code>from '@mui/material'</code>) to direct path imports (<code>from '@mui/material/Button'</code>).
            Unused components and their dependencies dropped out.
          </li>
          <li>
            <strong>Remove duplicate dependencies (-68KB):</strong> <code>pnpm dedupe</code> resolved 3 packages
            that existed in multiple versions. Most impactful: two versions of <code>tslib</code> consolidated to one.
          </li>
          <li>
            <strong>Minification tuning (-80KB):</strong> Enabled <code>drop_console</code>, removed comments,
            configured Terser's <code>compress</code> options for maximum reduction.
          </li>
          <li>
            <strong>Replace libraries with native APIs (-120KB):</strong> Replaced uuid with
            <code>crypto.randomUUID()</code>, numeral.js with <code>Intl.NumberFormat</code>, and custom fetch
            wrapper eliminated axios dependency.
          </li>
        </ol>
      </section>

      <section>
        <h2>Advanced Techniques</h2>

        <h3 className="mt-6 font-semibold">Module Federation</h3>
        <p>
          Webpack Module Federation allows multiple independently-built applications to share code at runtime.
          This is particularly valuable for micro-frontend architectures where shared libraries (React, design
          system) should only be loaded once across all micro-apps.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// webpack.config.js — Host application
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        // Load dashboard micro-app at runtime
        dashboard: 'dashboard@https://cdn.example.com/dashboard/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
      },
    }),
  ],
};

// In the host app — load remote component
const DashboardApp = React.lazy(
  () => import('dashboard/App')  // Loaded from CDN at runtime
);`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Differential Loading</h3>
        <p>
          Serve different bundles to modern vs legacy browsers. Modern browsers get smaller, optimized bundles
          without polyfills. Legacy browsers get the full polyfilled version.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Modern browsers load the ES module version (smaller, no polyfills) -->
<script type="module" src="/assets/app.modern.js"></script>

<!-- Legacy browsers ignore type="module" and load this instead -->
<script nomodule src="/assets/app.legacy.js"></script>

// Vite handles this automatically with the legacy plugin:
// vite.config.ts
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
      // Generates both modern and legacy bundles
      // Modern: ~30% smaller (no polyfills, modern syntax)
      // Legacy: full polyfills for older browsers
    }),
  ],
});`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Selective Polyfilling with polyfill.io</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Load ONLY the polyfills the current browser needs -->
<!-- A modern Chrome gets an empty response (0KB) -->
<!-- An old Safari gets only the specific polyfills it's missing -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=Object.groupBy,Array.prototype.at,structuredClone"></script>

// Self-hosted alternative using core-js with browserslist
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',       // Only polyfill APIs actually used in code
      corejs: 3,
      browserslistEnv: 'production',
      // With a modern browserslist target, this adds very few polyfills
    }],
  ],
};

// .browserslistrc
// > 0.5%
// last 2 versions
// not dead
// not op_mini all`}</code>
        </pre>
      </section>

      <section>
        <h2>Best Practices Summary</h2>
        <ol className="space-y-3">
          <li>
            <strong>Measure before optimizing:</strong> Always start with webpack-bundle-analyzer or source-map-explorer.
            Data-driven optimization targets the highest-impact areas first.
          </li>
          <li>
            <strong>Audit dependencies quarterly:</strong> Run <code>npx cost-of-modules</code> regularly. Libraries
            that were best-in-class a year ago may now have lighter alternatives or native replacements.
          </li>
          <li>
            <strong>Enforce performance budgets in CI:</strong> Set hard limits that fail the build. Without
            enforcement, budgets become suggestions that everyone ignores.
          </li>
          <li>
            <strong>Lazy-load everything non-critical:</strong> If a feature isn't needed on initial page load,
            use <code>React.lazy()</code> or dynamic <code>import()</code>. Charts, editors, export tools, and
            modals are prime candidates.
          </li>
          <li>
            <strong>Prefer native APIs:</strong> <code>Intl</code>, <code>structuredClone</code>,
            <code>crypto.randomUUID</code>, <code>Object.groupBy</code>, and <code>fetch</code> are free — they
            add 0KB to your bundle.
          </li>
          <li>
            <strong>Split vendor chunks strategically:</strong> Separate stable dependencies (React, router) from
            volatile ones. This maximizes browser cache hit rates across deployments.
          </li>
          <li>
            <strong>Enable Brotli compression:</strong> Pre-compress during build and configure your CDN/server
            to serve .br files. This reduces transfer size by ~75% with zero client-side cost.
          </li>
          <li>
            <strong>Use direct imports for large libraries:</strong> Import <code>@mui/material/Button</code> instead
            of <code>{'{ Button }'} from '@mui/material'</code> when tree shaking is unreliable.
          </li>
          <li>
            <strong>Monitor trends, not just snapshots:</strong> Track bundle sizes per commit in a dashboard. Spot
            gradual growth before it becomes a crisis.
          </li>
          <li>
            <strong>Consider differential loading:</strong> Ship modern ES2020+ to capable browsers and polyfilled
            bundles only to legacy browsers. Modern bundles are 20-30% smaller.
          </li>
        </ol>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-3">
          <li>
            Bundle size directly impacts Time to Interactive — every 100KB of JavaScript adds ~350ms of TTI on a
            mid-range mobile device. This affects Core Web Vitals, SEO, and conversion rates.
          </li>
          <li>
            Optimization starts with measurement. Tools like webpack-bundle-analyzer and source-map-explorer
            visualize bundle composition, revealing which dependencies consume the most space.
          </li>
          <li>
            The biggest wins come from dependency management: replacing heavy libraries (moment → date-fns),
            using native browser APIs (Intl, structuredClone, fetch), and lazy-loading conditional features.
          </li>
          <li>
            Dynamic <code>import()</code> is the primary mechanism for code splitting. Route-level splitting
            is the minimum; component-level splitting (React.lazy) targets heavy widgets like charts and editors.
          </li>
          <li>
            Performance budgets in CI/CD are essential for preventing regression. Tools like bundlesize and
            size-limit fail the build when any chunk exceeds the configured limit.
          </li>
          <li>
            Bundler configuration matters: strategic chunk splitting maximizes cache hit rates, scope hoisting
            enables cross-module dead code elimination, and minification settings (drop_console, compress) provide
            further reductions.
          </li>
          <li>
            Compression is the final multiplier — Brotli reduces transfer size by ~75%. But it doesn't reduce
            parse time, so optimizing uncompressed size is still critical.
          </li>
          <li>
            A real-world optimization typically achieves 60-80% reduction: replacing 2-3 heavy libraries (-400KB),
            lazy-loading conditional features (-500KB), tree shaking UI libraries (-200KB), and removing
            unnecessary polyfills (-100KB).
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/reduce-javascript-payloads-with-code-splitting/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Reduce JavaScript Payloads with Code Splitting
            </a>
          </li>
          <li>
            <a href="https://webpack.js.org/configuration/optimization/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Webpack — Optimization Configuration
            </a>
          </li>
          <li>
            <a href="https://webpack.js.org/configuration/performance/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Webpack — Performance Budgets
            </a>
          </li>
          <li>
            <a href="https://vitejs.dev/guide/build.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Vite — Building for Production
            </a>
          </li>
          <li>
            <a href="https://bundlephobia.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Bundlephobia — Find the Cost of Adding a npm Package
            </a>
          </li>
          <li>
            <a href="https://github.com/ai/size-limit" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Size Limit — Performance Budget Tool
            </a>
          </li>
          <li>
            <a href="https://web.dev/performance-budgets-101/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Performance Budgets 101
            </a>
          </li>
          <li>
            <a href="https://developer.chrome.com/docs/lighthouse/performance/performance-budgets" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Chrome DevTools — Lighthouse Performance Budgets
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
