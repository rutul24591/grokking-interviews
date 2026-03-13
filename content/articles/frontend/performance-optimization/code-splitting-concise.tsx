"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-code-splitting-concise",
  title: "Code Splitting",
  description: "Quick overview of code splitting strategies for frontend performance optimization.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "code-splitting",
  version: "concise",
  wordCount: 2800,
  readingTime: 12,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "code-splitting", "lazy-loading", "webpack", "bundling"],
  relatedTopics: ["lazy-loading", "tree-shaking", "bundle-size-optimization"],
};

export default function CodeSplittingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Code splitting</strong> is a technique that breaks your JavaScript bundle into smaller chunks
          that are loaded on demand rather than all at once. Instead of shipping one massive bundle containing
          every page, component, and library in your app, you split it so users only download the code they
          actually need for the current view.
        </p>
        <p>
          Modern bundlers like Webpack, Vite, and Rollup support code splitting natively. The primary mechanism
          is <strong>dynamic imports</strong> (<code>import()</code>), which tell the bundler to create a separate
          chunk that loads asynchronously at runtime.
        </p>
      </section>

      <section>
        <h2>Why It Matters</h2>
        <p>
          A typical single-page application can have bundles of 1-5 MB of JavaScript. On a 3G connection, that
          means 10-30 seconds before the page becomes interactive. Code splitting directly improves:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Time to Interactive (TTI):</strong> Less JavaScript to parse and execute on initial load.
          </li>
          <li>
            <strong>First Contentful Paint (FCP):</strong> Smaller initial bundle means faster rendering.
          </li>
          <li>
            <strong>Cache Efficiency:</strong> Changed code only invalidates its specific chunk, not the entire bundle.
          </li>
          <li>
            <strong>Bandwidth:</strong> Users on mobile or slow networks download only what they need.
          </li>
        </ul>
      </section>

      <section>
        <h2>Key Strategies</h2>

        <h3 className="mt-4 font-semibold">1. Route-Based Splitting</h3>
        <p>
          The most common and highest-impact strategy. Each route gets its own chunk, so navigating to
          <code>/settings</code> doesn't require downloading <code>/dashboard</code> code.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// React with React.lazy and Suspense
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() =&gt; import('./pages/Home'));
const Dashboard = lazy(() =&gt; import('./pages/Dashboard'));
const Settings = lazy(() =&gt; import('./pages/Settings'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}&gt;
        <Routes>
          <Route path="/" element={<Home />} /&gt;
          <Route path="/dashboard" element={<Dashboard />} /&gt;
          <Route path="/settings" element={<Settings />} /&gt;
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// Next.js - Automatic route-based splitting
// Each file in app/ or pages/ is automatically a separate chunk
// app/dashboard/page.tsx → only loaded when visiting /dashboard`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">2. Component-Based Splitting</h3>
        <p>
          Heavy components that aren't immediately visible (modals, drawers, charts, editors) can be
          split into separate chunks and loaded when the user triggers them.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { lazy, Suspense, useState } from 'react';

// Heavy chart library (~500KB) only loads when needed
const AnalyticsChart = lazy(() =&gt; import('./AnalyticsChart'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => setShowChart(true)}&gt;
        Show Analytics
      </button>

      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}&gt;
          <AnalyticsChart />
        </Suspense>
      )}
    </div>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">3. Vendor Splitting</h3>
        <p>
          Separate third-party libraries from your application code. Vendor code changes less frequently,
          so it can be cached longer by the browser.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\\\/]node_modules[\\\\/]/,
          name: 'vendors',
          chunks: 'all',
          // Separate large libs into their own chunks
        },
        react: {
          test: /[\\\\/]node_modules[\\\\/](react|react-dom)[\\\\/]/,
          name: 'react-vendor',
          chunks: 'all',
          priority: 10,
        },
      },
    },
  },
};

// Vite handles this automatically with its default config
// node_modules are pre-bundled and cached separately`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">4. Dynamic Feature Splitting</h3>
        <p>
          Load features conditionally based on user roles, feature flags, or device capabilities.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Only load admin panel for admin users
async function loadAdminFeatures(user) {
  if (user.role === 'admin') {
    const { AdminPanel } = await import('./features/AdminPanel');
    return AdminPanel;
  }
  return null;
}

// Load polyfills only when needed
if (!('IntersectionObserver' in window)) {
  await import('intersection-observer');
}

// Load heavy library on interaction
document.getElementById('editor-trigger')
  .addEventListener('click', async () =&gt; {
    const { initEditor } = await import('./editor');
    initEditor();
  });`}</code>
        </pre>
      </section>

      <section>
        <h2>Prefetching Split Chunks</h2>
        <p>
          Code splitting introduces latency when navigating — the chunk must be downloaded first. Mitigate
          this with prefetching:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Webpack magic comments for prefetch/preload
const Settings = lazy(() =&gt;
  import(/* webpackPrefetch: true */ './pages/Settings')
);
// Adds <link rel="prefetch"> — downloads during idle time

const CriticalModal = lazy(() =&gt;
  import(/* webpackPreload: true */ './CriticalModal')
);
// Adds <link rel="preload"> — downloads in parallel with current chunk

// Manual prefetch on hover/focus
function NavLink({ to, children }) {
  const prefetch = () =&gt; {
    // Trigger the dynamic import to cache the chunk
    if (to === '/settings') import('./pages/Settings');
    if (to === '/profile') import('./pages/Profile');
  };

  return (
    <Link to={to} onMouseEnter={prefetch} onFocus={prefetch}>
      {children}
    </Link>
  );
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Measuring Impact</h2>
        <p>Key tools and metrics to verify code splitting is working:</p>
        <ul className="space-y-2">
          <li>
            <strong>Bundle Analyzer:</strong> Use <code>webpack-bundle-analyzer</code> or Vite's
            <code>rollup-plugin-visualizer</code> to see chunk sizes and composition.
          </li>
          <li>
            <strong>Network Tab:</strong> Verify chunks load on-demand in Chrome DevTools. Check that
            initial page load only fetches necessary chunks.
          </li>
          <li>
            <strong>Coverage Tab:</strong> Chrome DevTools Coverage shows how much downloaded JS is actually
            executed. Target {'&lt;'}50% unused code.
          </li>
          <li>
            <strong>Lighthouse:</strong> Check "Reduce unused JavaScript" audit. Score should improve
            after splitting.
          </li>
          <li>
            <strong>Web Vitals:</strong> Monitor TTI and TBT (Total Blocking Time) before and after splitting.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>
            <strong>Over-splitting:</strong> Too many tiny chunks create excessive HTTP requests and
            connection overhead. Group related components into logical chunks.
          </li>
          <li>
            <strong>Loading waterfalls:</strong> A split chunk that itself imports another split chunk
            creates sequential network requests. Flatten your import chains.
          </li>
          <li>
            <strong>No loading states:</strong> Users see nothing while chunks download. Always wrap
            lazy components in Suspense with meaningful fallbacks.
          </li>
          <li>
            <strong>Splitting too little:</strong> Only splitting at the route level misses opportunities.
            Heavy components like rich text editors, chart libraries, or date pickers are ideal candidates.
          </li>
          <li>
            <strong>Breaking SSR:</strong> <code>React.lazy</code> doesn't work with server-side rendering
            out of the box. Use <code>next/dynamic</code> in Next.js or loadable-components for SSR support.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-2">
          <li>
            Code splitting reduces initial bundle size by loading JavaScript on demand via dynamic <code>import()</code>.
          </li>
          <li>
            Route-based splitting is the highest-impact, lowest-effort strategy — frameworks like Next.js do it automatically.
          </li>
          <li>
            Component-level splitting targets heavy UI pieces (charts, editors, modals) that aren't needed immediately.
          </li>
          <li>
            Prefetching (<code>webpackPrefetch</code>, hover-based) eliminates the latency penalty of on-demand loading.
          </li>
          <li>
            Vendor splitting separates rarely-changing library code for better long-term caching.
          </li>
          <li>
            Over-splitting can hurt performance — balance chunk count against HTTP overhead and loading waterfalls.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
