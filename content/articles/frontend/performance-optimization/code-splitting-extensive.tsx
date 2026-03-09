"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { MermaidDiagram } from "@/components/articles/MermaidDiagram";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-code-splitting-extensive",
  title: "Code Splitting",
  description: "Comprehensive guide to code splitting strategies, implementation patterns, and optimization techniques for frontend performance.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "code-splitting",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "code-splitting", "lazy-loading", "webpack", "bundling"],
  relatedTopics: ["lazy-loading", "tree-shaking", "bundle-size-optimization"],
};

export default function CodeSplittingExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Code splitting</strong> is a performance optimization technique that breaks a monolithic JavaScript
          bundle into smaller, independently loadable chunks. Rather than forcing users to download every line of
          JavaScript your application contains on the first page load, code splitting ensures they only receive
          the code required for their current view, deferring everything else until it's actually needed.
        </p>
        <p>
          The technique emerged as JavaScript applications grew from simple scripts into full-featured applications
          with hundreds of components, dozens of routes, and megabytes of third-party libraries. Early SPAs shipped
          everything in one file — a practice that became untenable as bundle sizes exceeded 2-5 MB. Webpack 1.x
          introduced code splitting via <code>require.ensure()</code> around 2014, but the real inflection point came
          with the ECMAScript dynamic <code>import()</code> proposal (Stage 4, 2020), which gave developers a
          standard, promise-based mechanism that all modern bundlers understand.
        </p>
        <p>
          Today, code splitting is a foundational technique in every serious frontend architecture. Frameworks like
          Next.js and Remix apply route-based splitting automatically, while libraries like React provide first-class
          primitives (<code>React.lazy</code>, <code>Suspense</code>) for component-level splitting. Understanding
          when, where, and how to split is a critical skill for frontend system design interviews.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>Code splitting rests on several fundamental ideas that you need to understand before diving into implementation:</p>
        <ul className="space-y-3">
          <li>
            <strong>Entry Points:</strong> Every application has at least one entry point — the initial JavaScript file
            the browser executes. Bundlers start here and follow all imports to build a dependency graph. Without
            splitting, this graph produces one giant output file.
          </li>
          <li>
            <strong>Chunks:</strong> A chunk is an output file produced by the bundler. The "main" chunk loads on
            initial page load. "Async" chunks are created by dynamic imports and load on demand. "Vendor" chunks
            contain third-party code separated for caching benefits.
          </li>
          <li>
            <strong>Dynamic Imports:</strong> The <code>import()</code> expression tells the bundler to create a
            split point. It returns a Promise that resolves to the module's exports. The bundler automatically
            creates a separate chunk for everything reachable from that import.
          </li>
          <li>
            <strong>Loading Runtime:</strong> Bundlers inject a small runtime (~2-5KB) into the main chunk that
            manages loading async chunks — creating script tags, tracking loaded modules, and resolving promises.
          </li>
          <li>
            <strong>Chunk Deduplication:</strong> If two async chunks share a common dependency (e.g., both import
            lodash), the bundler can extract it into a shared chunk to prevent duplicate downloads.
          </li>
          <li>
            <strong>Chunk Naming:</strong> Chunks get hashed filenames (e.g., <code>dashboard.a3f2b1.js</code>) for
            cache busting. When code changes, only affected chunk hashes change, preserving browser cache for
            unchanged chunks.
          </li>
        </ul>
      </section>

      <section>
        <h2>How Bundlers Create Chunks</h2>
        <p>
          Understanding the bundler's perspective helps you make better splitting decisions. Here's how Webpack
          (the most common bundler) processes your code:
        </p>

        <MermaidDiagram
          chart={`flowchart TD
    A[Entry Point: index.js] --> B[Static Analysis]
    B --> C[Build Dependency Graph]
    C --> D{Dynamic import found?}
    D -->|Yes| E[Create Split Point]
    D -->|No| F[Add to Current Chunk]
    E --> G[New Async Chunk]
    G --> H{Shared Dependencies?}
    H -->|Yes| I[Extract to Shared Chunk]
    H -->|No| J[Self-contained Chunk]
    F --> K[Main Bundle]
    I --> L[Output Files]
    J --> L
    K --> L
    L --> M[main.abc123.js]
    L --> N[dashboard.def456.js]
    L --> O[vendors-shared.ghi789.js]`}
          caption="How bundlers process code splitting — from entry point analysis to chunk output"
        />

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// What you write:
import Home from './Home';                    // Static → main chunk
const Dashboard = lazy(() => import('./Dashboard'));  // Dynamic → new chunk
const Settings = lazy(() => import('./Settings'));    // Dynamic → new chunk

// What the bundler produces:
// main.abc123.js      → Home + framework + routing + loading runtime
// dashboard.def456.js → Dashboard + its unique dependencies
// settings.ghi789.js  → Settings + its unique dependencies
// shared.jkl012.js    → Dependencies shared between Dashboard and Settings

// At runtime, when user navigates to /dashboard:
// 1. Loading runtime creates: <script src="/dashboard.def456.js">
// 2. Browser fetches the chunk
// 3. Module resolves and React renders the Dashboard component`}</code>
        </pre>
      </section>

      <section>
        <h2>Splitting Strategies</h2>
        <p>
          There are four primary strategies for code splitting, each targeting different optimization opportunities.
          A well-optimized application typically uses all four in combination.
        </p>

        <h3 className="mt-6 font-semibold">1. Route-Based Splitting</h3>
        <p>
          The most impactful and straightforward strategy. Every route becomes a separate chunk, so users only
          download the code for the page they're viewing. This is the <strong>first thing to implement</strong> and
          provides the biggest performance win with minimal effort.
        </p>

        <MermaidDiagram
          chart={`flowchart LR
    subgraph Initial Load
        A[main.js<br/>120KB] --> B[Home Page]
    end
    subgraph On Demand
        C[dashboard.js<br/>85KB] --> D[Dashboard]
        E[settings.js<br/>45KB] --> F[Settings]
        G[profile.js<br/>30KB] --> H[Profile]
        I[admin.js<br/>200KB] --> J[Admin Panel]
    end
    B -.->|Navigate| C
    B -.->|Navigate| E
    B -.->|Navigate| G
    B -.->|Navigate| I`}
          caption="Route-based splitting — each page is a separate chunk loaded on navigation"
        />

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === React Router with React.lazy ===
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageSkeleton } from './components/PageSkeleton';

// Each import() creates a separate chunk
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/*" element={<AdminPanel />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// === Next.js App Router ===
// Automatic! Each file in app/ directory is a separate chunk.
// app/
//   page.tsx          → chunk for /
//   dashboard/
//     page.tsx        → chunk for /dashboard
//   settings/
//     page.tsx        → chunk for /settings
//
// Next.js also supports next/dynamic for additional splitting:
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Skip SSR if component uses browser APIs
});`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">2. Component-Based Splitting</h3>
        <p>
          Target individual heavy components that aren't immediately visible or aren't needed for every user.
          This is especially valuable for components that depend on large libraries (chart libraries, rich text
          editors, PDF viewers, date pickers with locale data).
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { lazy, Suspense, useState } from 'react';

// === Modal with heavy content ===
const RichTextEditor = lazy(() => import('./RichTextEditor'));
// RichTextEditor bundles draft-js (~300KB) — only load when user opens editor

function CommentSection() {
  const [editing, setEditing] = useState(false);

  return (
    <div>
      <button onClick={() => setEditing(true)}>Write Comment</button>
      {editing && (
        <Suspense fallback={<textarea placeholder="Loading editor..." />}>
          <RichTextEditor onSubmit={handleSubmit} />
        </Suspense>
      )}
    </div>
  );
}

// === Chart that loads on scroll into view ===
const AnalyticsChart = lazy(() => import('./AnalyticsChart'));

function DashboardSection() {
  const [chartVisible, setChartVisible] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setChartVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before visible
    );

    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={chartRef}>
      {chartVisible ? (
        <Suspense fallback={<ChartSkeleton />}>
          <AnalyticsChart data={data} />
        </Suspense>
      ) : (
        <ChartSkeleton />
      )}
    </div>
  );
}

// === Conditional feature loading ===
const AdminTools = lazy(() => import('./AdminTools'));
const ModeratorTools = lazy(() => import('./ModeratorTools'));

function UserToolbar({ user }) {
  return (
    <Suspense fallback={<ToolbarSkeleton />}>
      {user.role === 'admin' && <AdminTools />}
      {user.role === 'moderator' && <ModeratorTools />}
    </Suspense>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">3. Vendor/Library Splitting</h3>
        <p>
          Third-party libraries in <code>node_modules</code> change less frequently than your application code.
          Separating them into dedicated chunks means browsers can cache vendor code across deployments — users
          only re-download chunks where your app code changed.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Webpack splitChunks configuration ===
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 25,
      minSize: 20000,
      cacheGroups: {
        // Core framework — changes rarely, cache aggressively
        framework: {
          test: /[\\\\/]node_modules[\\\\/](react|react-dom|scheduler)[\\\\/]/,
          name: 'framework',
          priority: 40,
          chunks: 'all',
        },
        // Large libraries get their own chunks
        charting: {
          test: /[\\\\/]node_modules[\\\\/](d3|recharts|chart\\.js)[\\\\/]/,
          name: 'charting',
          priority: 30,
          chunks: 'async', // Only in async chunks (loaded with routes that use charts)
        },
        // All other vendor code
        vendor: {
          test: /[\\\\/]node_modules[\\\\/]/,
          name: 'vendor',
          priority: 10,
          chunks: 'all',
          reuseExistingChunk: true,
        },
        // Shared application code used by 2+ chunks
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  },
};

// === Vite configuration ===
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'state': ['zustand', 'immer'],
        },
      },
    },
  },
});`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">4. Data-Driven / Dynamic Splitting</h3>
        <p>
          Split code based on runtime conditions — user roles, feature flags, device capabilities, or A/B test
          variants. This ensures users never download code for features they can't access.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Feature flag based splitting ===
async function loadFeatures(flags) {
  const modules = [];

  if (flags.newCheckout) {
    modules.push(import('./features/NewCheckout'));
  } else {
    modules.push(import('./features/LegacyCheckout'));
  }

  if (flags.aiAssistant) {
    modules.push(import('./features/AIAssistant'));
  }

  return Promise.all(modules);
}

// === Device capability based ===
async function loadVideoPlayer() {
  const supportsHLS = document.createElement('video')
    .canPlayType('application/vnd.apple.mpegURL');

  if (supportsHLS) {
    return import('./players/NativeHLSPlayer');
  }
  // hls.js is ~100KB — only load when native HLS isn't supported
  return import('./players/HLSJSPlayer');
}

// === Locale-based splitting for i18n ===
async function loadTranslations(locale) {
  // Each locale is a separate chunk (~20-50KB each)
  // Only the user's locale is downloaded
  const translations = await import(\`./locales/\${locale}.json\`);
  return translations.default;
}
// Webpack creates chunks: locales/en.json, locales/fr.json, locales/de.json, etc.`}</code>
        </pre>
      </section>

      <section>
        <h2>Prefetching & Preloading</h2>
        <p>
          Code splitting introduces a trade-off: smaller initial load, but latency on subsequent navigations.
          Prefetching and preloading mitigate this by downloading chunks before the user needs them.
        </p>

        <MermaidDiagram
          chart={`sequenceDiagram
    participant U as User
    participant B as Browser
    participant S as Server

    Note over U,S: Initial Page Load
    U->>B: Visit /home
    B->>S: GET main.js
    S-->>B: main.js (120KB)
    B->>B: Parse & render Home

    Note over U,S: Idle Time Prefetch
    B->>S: prefetch dashboard.js
    S-->>B: dashboard.js (85KB, cached)

    Note over U,S: User Navigates
    U->>B: Click "Dashboard"
    B->>B: dashboard.js already cached!
    B->>B: Instant render ⚡`}
          caption="Prefetching during idle time eliminates navigation latency"
        />

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Webpack Magic Comments ===

// prefetch: download during browser idle time (low priority)
const Dashboard = lazy(() =>
  import(/* webpackPrefetch: true */ './pages/Dashboard')
);
// Webpack injects: <link rel="prefetch" href="/dashboard.abc123.js">
// Downloaded AFTER main bundle loads, during idle time

// preload: download in parallel with current chunk (high priority)
const CriticalModal = lazy(() =>
  import(/* webpackPreload: true */ './CriticalModal')
);
// Webpack injects: <link rel="preload" href="/critical-modal.def456.js">
// Downloaded IN PARALLEL with the chunk that imports it

// === Manual Prefetch Strategies ===

// Prefetch on hover — gives 200-400ms head start
function NavLink({ to, chunk, children }) {
  const handleMouseEnter = () => {
    // Calling import() caches the module — subsequent calls resolve instantly
    chunk();
  };

  return (
    <Link to={to} onMouseEnter={handleMouseEnter}>
      {children}
    </Link>
  );
}

// Usage
const dashboardChunk = () => import('./pages/Dashboard');
const Dashboard = lazy(dashboardChunk);

<NavLink to="/dashboard" chunk={dashboardChunk}>
  Dashboard
</NavLink>

// === Viewport-based prefetching ===
function PrefetchOnVisible({ load, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        load(); // Trigger the dynamic import
        observer.disconnect();
      }
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [load]);

  return <div ref={ref}>{children}</div>;
}

// Prefetch dashboard chunk when the nav link scrolls into view
<PrefetchOnVisible load={dashboardChunk}>
  <NavLink to="/dashboard">Dashboard</NavLink>
</PrefetchOnVisible>

// === Route-based prefetch with React Router ===
// Prefetch all linked routes after initial render
useEffect(() => {
  // Wait for initial render to complete
  requestIdleCallback(() => {
    import('./pages/Dashboard');
    import('./pages/Settings');
    import('./pages/Profile');
  });
}, []);`}</code>
        </pre>
      </section>

      <section>
        <h2>Error Handling for Split Chunks</h2>
        <p>
          Network failures, deployment rollouts, and CDN issues can cause chunk loading to fail. Robust error
          handling is essential for code-split applications.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Error Boundary for lazy components ===
import { Component } from 'react';

class ChunkErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Check if it's a chunk loading error
      const isChunkError =
        this.state.error?.name === 'ChunkLoadError' ||
        this.state.error?.message?.includes('Loading chunk');

      if (isChunkError) {
        return (
          <div>
            <p>Failed to load this section. Please check your connection.</p>
            <button onClick={this.handleRetry}>Retry</button>
            <button onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        );
      }

      return <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// === Retry wrapper for dynamic imports ===
function retryImport(importFn, retries = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    importFn()
      .then(resolve)
      .catch((error) => {
        if (retries === 0) {
          reject(error);
          return;
        }
        setTimeout(() => {
          retryImport(importFn, retries - 1, delay * 2)
            .then(resolve)
            .catch(reject);
        }, delay);
      });
  });
}

// Usage with React.lazy
const Dashboard = lazy(() =>
  retryImport(() => import('./pages/Dashboard'))
);

// === Handle stale chunks after deployment ===
// When you deploy new code, old chunk URLs may 404
// Detect and force refresh
window.addEventListener('error', (event) => {
  if (
    event.message?.includes('Loading chunk') ||
    event.message?.includes('Failed to fetch')
  ) {
    // Store that we're refreshing to prevent infinite loops
    const lastRefresh = sessionStorage.getItem('chunk-refresh');
    const now = Date.now();
    if (!lastRefresh || now - parseInt(lastRefresh) > 10000) {
      sessionStorage.setItem('chunk-refresh', now.toString());
      window.location.reload();
    }
  }
});`}</code>
        </pre>
      </section>

      <section>
        <h2>Server-Side Rendering Considerations</h2>
        <p>
          Code splitting with SSR requires special handling because <code>React.lazy</code> doesn't support
          server-side rendering natively. The server needs to know which chunks to include in the HTML response.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Next.js dynamic imports (handles SSR automatically) ===
import dynamic from 'next/dynamic';

// SSR-compatible code splitting
const DashboardChart = dynamic(
  () => import('./DashboardChart'),
  {
    loading: () => <ChartSkeleton />,
    // ssr: true is default — component renders on server too
  }
);

// Client-only component (e.g., uses window/document)
const MapView = dynamic(
  () => import('./MapView'),
  {
    ssr: false, // Only renders on client
    loading: () => <MapSkeleton />,
  }
);

// === React 18+ Streaming SSR with Suspense ===
// In React 18, Suspense boundaries work on the server too.
// The server streams HTML progressively:
//   1. Sends initial HTML with Suspense fallbacks
//   2. As lazy chunks resolve, streams replacement HTML
//   3. Client hydrates each section independently

// Server entry
import { renderToPipeableStream } from 'react-dom/server';

app.get('*', (req, res) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      pipe(res);
    },
  });
});

// Client entry — hydrateRoot handles streaming HTML
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);`}</code>
        </pre>
      </section>

      <section>
        <h2>Measuring & Analyzing</h2>
        <p>
          You can't optimize what you don't measure. Use these tools to understand your bundle composition
          and verify that splitting is effective.
        </p>

        <h3 className="mt-4 font-semibold">Bundle Analysis</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Webpack Bundle Analyzer ===
// Install: pnpm add -D webpack-bundle-analyzer
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static', // Generate HTML report
      openAnalyzer: false,
      reportFilename: 'bundle-report.html',
    }),
  ],
};

// === Vite with rollup-plugin-visualizer ===
// Install: pnpm add -D rollup-plugin-visualizer
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      filename: 'bundle-stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});

// === Next.js Bundle Analyzer ===
// Install: pnpm add -D @next/bundle-analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // next.config.js options
});
// Run: ANALYZE=true pnpm build`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Performance Metrics to Track</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Metric</th>
              <th className="p-3 text-left">What It Measures</th>
              <th className="p-3 text-left">Target</th>
              <th className="p-3 text-left">How Splitting Helps</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Initial JS Size</strong></td>
              <td className="p-3">Total JavaScript downloaded on first page load</td>
              <td className="p-3">{'<'} 200KB (compressed)</td>
              <td className="p-3">Defers non-critical code to async chunks</td>
            </tr>
            <tr>
              <td className="p-3"><strong>TTI</strong></td>
              <td className="p-3">Time until page is fully interactive</td>
              <td className="p-3">{'<'} 3.8s</td>
              <td className="p-3">Less JS to parse = faster main thread availability</td>
            </tr>
            <tr>
              <td className="p-3"><strong>TBT</strong></td>
              <td className="p-3">Total time main thread is blocked during load</td>
              <td className="p-3">{'<'} 200ms</td>
              <td className="p-3">Smaller chunks = shorter blocking periods</td>
            </tr>
            <tr>
              <td className="p-3"><strong>FCP</strong></td>
              <td className="p-3">Time to first meaningful content paint</td>
              <td className="p-3">{'<'} 1.8s</td>
              <td className="p-3">Smaller initial bundle renders faster</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Cache Hit Ratio</strong></td>
              <td className="p-3">% of chunks served from browser cache</td>
              <td className="p-3">{'>'} 80% for return visits</td>
              <td className="p-3">Vendor splitting preserves cache across deploys</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Unused JS</strong></td>
              <td className="p-3">JS downloaded but never executed</td>
              <td className="p-3">{'<'} 30%</td>
              <td className="p-3">On-demand loading eliminates unused code</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Advanced Patterns</h2>

        <h3 className="mt-4 font-semibold">Named Chunk Groups</h3>
        <p>
          Use Webpack magic comments to name chunks for easier debugging and analysis:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Named chunks for clarity in bundle analysis
const Dashboard = lazy(() =>
  import(/* webpackChunkName: "page-dashboard" */ './pages/Dashboard')
);

const Settings = lazy(() =>
  import(/* webpackChunkName: "page-settings" */ './pages/Settings')
);

// Group related chunks
const Chart = lazy(() =>
  import(/* webpackChunkName: "viz-chart" */ './components/Chart')
);

const Table = lazy(() =>
  import(/* webpackChunkName: "viz-table" */ './components/DataTable')
);

// Output: page-dashboard.abc123.js, page-settings.def456.js, etc.`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Module Federation</h3>
        <p>
          Webpack 5's Module Federation enables code splitting across application boundaries — sharing
          modules between independently deployed micro-frontends at runtime.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Host application — webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        // Load dashboard from separate deployment
        dashboard: 'dashboard@https://dashboard.example.com/remoteEntry.js',
        settings: 'settings@https://settings.example.com/remoteEntry.js',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};

// In host app — load remote module at runtime
const RemoteDashboard = lazy(() => import('dashboard/DashboardApp'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <RemoteDashboard />
    </Suspense>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Granular Hydration with Islands</h3>
        <p>
          In an islands architecture, each interactive component is a separate chunk that hydrates
          independently. Non-interactive content ships as plain HTML with zero JavaScript.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Astro-style islands — each island is code-split
// Only interactive components ship JavaScript

// Static page with interactive islands
---
// This runs at build time — zero JS shipped for static parts
const posts = await fetch('/api/posts').then(r => r.json());
---

<html>
  <body>
    <!-- Static HTML, no JS -->
    <header>My Blog</header>

    <!-- Interactive island — separate chunk, hydrates on visible -->
    <SearchBar client:visible />

    <!-- Static content -->
    {posts.map(post => <PostCard post={post} />)}

    <!-- Interactive island — separate chunk, hydrates on idle -->
    <CommentSection client:idle postId={post.id} />

    <!-- Interactive island — separate chunk, hydrates on media query -->
    <MobileNav client:media="(max-width: 768px)" />
  </body>
</html>`}</code>
        </pre>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Over-splitting (too many chunks):</strong> Each chunk requires an HTTP request. With HTTP/1.1,
            browsers limit concurrent connections (6 per domain). Even with HTTP/2 multiplexing, there's per-request
            overhead. Rule of thumb: keep initial requests under 25, and individual chunks above 20KB compressed.
          </li>
          <li>
            <strong>Loading waterfalls:</strong> Chunk A imports Chunk B, which imports Chunk C — creating a
            sequential loading chain. Each step adds full network round-trip latency. Flatten your dependency
            chains and use <code>Promise.all()</code> for parallel loading.
          </li>
          <li>
            <strong>Missing loading states:</strong> Lazy components without Suspense boundaries show nothing while
            loading. Users see blank areas or layout shifts. Always provide skeleton screens or loading indicators.
          </li>
          <li>
            <strong>Stale chunks after deployment:</strong> When you deploy new code, the old chunk filenames change.
            Users with cached HTML may request chunks that no longer exist, getting 404 errors. Implement retry logic
            and automatic page refresh for chunk load failures.
          </li>
          <li>
            <strong>Vendor chunk bloat:</strong> Throwing all <code>node_modules</code> into one vendor chunk can
            create a massive file (500KB+). Split large libraries (charting, editor, mapping) into their own chunks.
          </li>
          <li>
            <strong>Not splitting enough:</strong> Only splitting at the route level and ignoring heavy components.
            A dashboard page with a 400KB chart library loads all that JS even if the chart is below the fold.
          </li>
          <li>
            <strong>Ignoring shared dependencies:</strong> If Dashboard and Settings both import a 200KB library,
            without proper configuration, it gets duplicated in both chunks. Configure <code>splitChunks.cacheGroups</code>
            to extract shared dependencies.
          </li>
          <li>
            <strong>Flash of loading content (FOLC):</strong> Quick navigations show a brief loading state before
            the chunk resolves. Use <code>startTransition</code> (React 18) to keep showing the current page
            until the new one is ready.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Architecture</h2>
        <p>Here's how a production application might combine all splitting strategies:</p>

        <MermaidDiagram
          chart={`flowchart TD
    subgraph Initial Load - 150KB
        A[framework.js<br/>React + ReactDOM<br/>45KB gzip]
        B[main.js<br/>App Shell + Router<br/>35KB gzip]
        C[vendor.js<br/>Zustand + Utils<br/>15KB gzip]
        D[home.js<br/>Home Page<br/>25KB gzip]
        E[styles.css<br/>Critical CSS<br/>30KB gzip]
    end

    subgraph Route Chunks - On Navigation
        F[dashboard.js<br/>85KB gzip]
        G[settings.js<br/>45KB gzip]
        H[profile.js<br/>30KB gzip]
    end

    subgraph Feature Chunks - On Interaction
        I[chart-lib.js<br/>d3 + Recharts<br/>120KB gzip]
        J[editor.js<br/>Rich Text Editor<br/>180KB gzip]
        K[map.js<br/>MapboxGL<br/>200KB gzip]
    end

    subgraph Conditional Chunks
        L[admin.js<br/>Admin Panel<br/>150KB gzip]
        M[locale-fr.js<br/>French translations<br/>30KB gzip]
    end

    D -.->|Navigate| F
    D -.->|Navigate| G
    F -.->|Show Chart| I
    F -.->|Open Editor| J
    G -.->|Admin Only| L`}
          caption="Production splitting strategy — layered chunks loaded progressively based on need"
        />
      </section>

      <section>
        <h2>Best Practices Summary</h2>
        <ol className="space-y-3">
          <li>
            <strong>Start with route-based splitting:</strong> This gives the biggest win with the least effort.
            Use framework-provided mechanisms (Next.js app router, React.lazy + React Router).
          </li>
          <li>
            <strong>Split heavy components:</strong> Anything over 50KB that isn't above the fold is a splitting
            candidate. Charts, editors, maps, and date pickers are common targets.
          </li>
          <li>
            <strong>Separate vendor code:</strong> Configure cache groups to split framework, large libraries,
            and remaining vendor code into stable chunks.
          </li>
          <li>
            <strong>Prefetch aggressively:</strong> Use <code>webpackPrefetch</code> for likely-next-page chunks.
            Implement hover-based prefetching for navigation links.
          </li>
          <li>
            <strong>Always provide fallbacks:</strong> Wrap every lazy component in a Suspense boundary with a
            meaningful loading state (skeleton screen, not spinner).
          </li>
          <li>
            <strong>Handle chunk failures:</strong> Implement retry logic with exponential backoff. Add error
            boundaries that offer page reload for chunk errors.
          </li>
          <li>
            <strong>Measure everything:</strong> Use bundle analyzer to visualize chunks. Monitor TTI, TBT, and
            initial JS size in CI. Set performance budgets.
          </li>
          <li>
            <strong>Avoid over-splitting:</strong> Keep chunks above 20KB compressed. Limit initial request count
            to under 25. Group related modules into logical chunks.
          </li>
          <li>
            <strong>Use <code>startTransition</code> for navigations:</strong> Prevents flash-of-loading-content by
            keeping the current UI visible while the new chunk loads.
          </li>
          <li>
            <strong>Test on real devices:</strong> Emulate slow 3G in DevTools. Test on mid-range Android phones.
            Your MacBook Pro experience is not representative.
          </li>
        </ol>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-3">
          <li>
            Code splitting reduces initial load time by breaking one large bundle into smaller on-demand chunks
            using dynamic <code>import()</code> — the browser only downloads what's needed for the current view.
          </li>
          <li>
            There are four splitting strategies: <strong>route-based</strong> (highest impact), <strong>component-based</strong>
            (heavy UI elements), <strong>vendor</strong> (better caching), and <strong>dynamic/conditional</strong>
            (feature flags, user roles).
          </li>
          <li>
            Prefetching (idle-time download) and preloading (parallel download) eliminate the latency penalty that
            splitting introduces on navigation.
          </li>
          <li>
            Error handling is critical — implement retry logic for chunk failures, handle stale chunks after deployment,
            and use error boundaries to recover gracefully.
          </li>
          <li>
            SSR requires special handling — <code>React.lazy</code> alone doesn't work server-side. Use Next.js
            <code>dynamic()</code> or React 18 Streaming SSR with Suspense for SSR-compatible splitting.
          </li>
          <li>
            Over-splitting is a real risk — too many small chunks create HTTP overhead. Balance chunk count (under 25
            initial) and chunk size (above 20KB compressed).
          </li>
          <li>
            Bundle analysis tools (webpack-bundle-analyzer, Coverage tab) are essential for identifying what to split
            and verifying the results.
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
            <a href="https://react.dev/reference/react/lazy" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Documentation — React.lazy
            </a>
          </li>
          <li>
            <a href="https://webpack.js.org/guides/code-splitting/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Webpack — Code Splitting Guide
            </a>
          </li>
          <li>
            <a href="https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Next.js — Lazy Loading and Dynamic Imports
            </a>
          </li>
          <li>
            <a href="https://patterns.dev/posts/dynamic-import" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              patterns.dev — Dynamic Import Pattern
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
