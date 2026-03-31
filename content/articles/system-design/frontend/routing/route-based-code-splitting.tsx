"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "route-based-code-splitting",
  title: "Route-Based Code Splitting",
  description:
    "How route-based code splitting reduces initial bundle size by lazy-loading route components on demand, including chunking strategies, prefetching, and Suspense integration.",
  category: "frontend",
  subcategory: "routing",
  slug: "route-based-code-splitting",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-30",
  tags: ["code splitting", "lazy loading", "dynamic import", "Suspense", "bundling"],
  relatedTopics: ["client-side-routing", "nested-routes", "dynamic-routes"],
};

export default function RouteBasedCodeSplittingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p className="mb-4">
          Route-based code splitting is the technique of splitting your JavaScript bundle along
          route boundaries so that each route&apos;s code is loaded only when the user navigates to
          that route. Instead of shipping one monolithic bundle containing every page&apos;s
          components, styles, and logic, the bundler creates separate chunks — one per route (or
          group of routes) — that are fetched on demand via dynamic <code>import()</code>.
        </p>
        <p className="mb-4">
          This is the highest-impact code splitting strategy because routes represent natural
          boundaries in an application. A user visiting the homepage doesn&apos;t need the admin
          dashboard code. A user browsing products doesn&apos;t need the checkout flow. Route-based
          splitting ensures users download only the JavaScript they need for the page they&apos;re
          viewing, dramatically reducing the initial bundle size and improving Time to Interactive.
        </p>
        <p>
          Modern bundlers (Webpack, Vite, Turbopack) automatically create split points at dynamic{" "}
          <code>import()</code> boundaries. React provides <code>React.lazy()</code> to integrate
          these dynamic imports with component rendering, and <code>Suspense</code> to manage
          loading states. Next.js and Remix handle route-based splitting automatically at the
          framework level.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/route-based-code-splitting-diagram-1.svg"
        alt="Bundle comparison: monolithic vs route-split showing reduced initial download"
        caption="Figure 1: Monolithic bundle vs route-split bundles — only the current route's chunk is downloaded initially, with other routes loaded on demand."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Dynamic import() as Split Points</h3>
        <p className="mb-4">
          The <code>import()</code> expression (distinct from the <code>import</code> declaration)
          returns a Promise that resolves to the module. Bundlers recognize this as a split point
          and extract the imported module and its dependency tree into a separate chunk. When the
          code executes, the browser fetches the chunk over the network and resolves the Promise.
        </p>
        <p className="mb-4">
          For route-based splitting, each route component is wrapped in a dynamic import:{" "}
          <code>{"const Dashboard = React.lazy(() => import('./pages/Dashboard'))"}</code>. The
          bundler creates a separate chunk for <code>Dashboard</code> and everything it imports.
          When the user navigates to the dashboard route, React triggers the import, shows the
          Suspense fallback while the chunk loads, and renders the component once it arrives.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Chunk Naming and Caching</h3>
        <p className="mb-4">
          Bundlers assign content-based hashes to chunk filenames (e.g.,{" "}
          <code>dashboard.a1b2c3.js</code>). When a route&apos;s code changes, only that chunk&apos;s
          hash changes — other chunks remain cacheable. This means deploying a change to the
          settings page doesn&apos;t invalidate the cached dashboard chunk. Webpack supports
          magic comments (<code>{"/* webpackChunkName: \"dashboard\" */"}</code>) to give chunks
          human-readable names for debugging.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Prefetching Strategies</h3>
        <p>
          The latency of loading a route chunk on navigation can create a noticeable delay.
          Prefetching mitigates this by loading chunks before the user navigates. Common
          strategies: <strong>link hover prefetch</strong> (start loading when the user hovers
          over a navigation link — typically gives 200-400ms head start),{" "}
          <strong>viewport-based prefetch</strong> (prefetch routes for links visible in the
          viewport using Intersection Observer), and <strong>idle prefetch</strong> (load all
          route chunks during browser idle time via <code>requestIdleCallback</code>). Next.js
          prefetches linked routes automatically when their <code>{"<Link>"}</code> enters the
          viewport.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/route-based-code-splitting-diagram-2.svg"
        alt="Prefetching strategies timeline showing hover, viewport, and idle approaches"
        caption="Figure 2: Prefetching strategies — hover prefetch provides the best balance of resource efficiency and perceived performance."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Suspense Integration</h3>
        <p className="mb-4">
          React Suspense is the rendering mechanism for lazy-loaded components. When a lazy
          component&apos;s chunk hasn&apos;t loaded yet, it &quot;suspends&quot; — React catches
          the thrown Promise, traverses up the tree to find the nearest <code>{"<Suspense>"}</code>{" "}
          boundary, and renders the <code>fallback</code> UI. Once the chunk loads and the Promise
          resolves, React replaces the fallback with the actual component.
        </p>
        <p className="mb-4">
          Place Suspense boundaries strategically. A single boundary at the route level shows a
          full-page loading indicator — simple but jarring. Nested boundaries allow partial loading:
          the layout renders immediately while only the content area shows a skeleton. The ideal
          placement depends on the visual hierarchy — loading states should replace the smallest
          meaningful unit of content.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Shared Chunks and Commons Splitting</h3>
        <p className="mb-4">
          When multiple routes import the same library (e.g., a chart library used in both
          Analytics and Dashboard), the bundler can extract it into a shared chunk rather than
          duplicating it in both route chunks. Webpack&apos;s <code>splitChunks</code>{" "}
          configuration controls this: <code>chunks: &quot;all&quot;</code> with{" "}
          <code>minSize</code> and <code>minChunks</code> thresholds determine what gets extracted.
          The trade-off: more shared chunks mean more HTTP requests but smaller total download size.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Framework-Level Splitting</h3>
        <p>
          Next.js performs route-based splitting automatically. Each page in the <code>pages/</code>{" "}
          or <code>app/</code> directory becomes its own chunk. The framework also splits per-layout
          in the App Router — nested layouts are separate chunks that persist across child route
          changes. Remix splits per-route and includes the data loader in the route chunk. Vite
          uses Rollup&apos;s <code>manualChunks</code> for fine-grained control.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/routing/route-based-code-splitting-diagram-3.svg"
        alt="Chunk dependency graph showing route chunks and shared vendor chunks"
        caption="Figure 3: Chunk dependency graph — shared libraries are extracted into common chunks, loaded once and cached across route navigations."
      />

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs &amp; Comparisons</h2>
        <div className="my-6 overflow-x-auto rounded-lg border border-theme">
          <table className="min-w-full text-sm">
            <thead className="bg-panel-soft">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Aspect</th>
                <th className="px-4 py-3 text-left font-semibold">No Splitting</th>
                <th className="px-4 py-3 text-left font-semibold">Route Splitting</th>
                <th className="px-4 py-3 text-left font-semibold">Component Splitting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="px-4 py-3 font-medium">Initial bundle</td><td className="px-4 py-3">Large (all code)</td><td className="px-4 py-3">Small (current route only)</td><td className="px-4 py-3">Smallest (per-component)</td></tr>
              <tr><td className="px-4 py-3 font-medium">Navigation latency</td><td className="px-4 py-3">None (pre-loaded)</td><td className="px-4 py-3">Chunk load time (prefetchable)</td><td className="px-4 py-3">Multiple chunk loads possible</td></tr>
              <tr><td className="px-4 py-3 font-medium">Complexity</td><td className="px-4 py-3">None</td><td className="px-4 py-3">Low (framework handles it)</td><td className="px-4 py-3">High (manual boundary decisions)</td></tr>
              <tr><td className="px-4 py-3 font-medium">Cache efficiency</td><td className="px-4 py-3">Poor (any change invalidates all)</td><td className="px-4 py-3">Good (per-route invalidation)</td><td className="px-4 py-3">Best (per-component invalidation)</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Route-based splitting is the recommended default. It provides the best complexity-to-impact
          ratio. Add component-level splitting only for heavy components within a route (chart
          libraries, rich text editors, map widgets) that not every user on that route will interact
          with.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Split at route boundaries first — this gives the biggest bang for the complexity buck</li>
          <li>Use React.lazy() with Suspense fallbacks that match the layout skeleton of the loading page</li>
          <li>Prefetch likely-next routes on link hover or viewport intersection</li>
          <li>Name chunks explicitly (via magic comments or config) for easier debugging and bundle analysis</li>
          <li>Extract shared vendor code into common chunks to avoid duplication</li>
          <li>Monitor bundle sizes in CI with tools like bundlesize, size-limit, or Webpack Bundle Analyzer</li>
          <li>Set performance budgets — alert when a route chunk exceeds a threshold (e.g., 150KB gzipped)</li>
          <li>Preload critical route chunks in the HTML head using <code>{"<link rel=\"modulepreload\">"}</code></li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Missing Suspense boundary:</strong> Using React.lazy() without a Suspense boundary causes an error. Always wrap lazy routes in Suspense</li>
          <li><strong>Over-splitting:</strong> Creating dozens of tiny chunks increases HTTP request overhead. Balance chunk count with chunk size — the overhead of an extra request often exceeds the cost of a few extra KB</li>
          <li><strong>Stale chunks after deploy:</strong> After a deployment, old chunk filenames no longer exist. If a user&apos;s cached app references an old chunk, the fetch fails. Implement chunk load error recovery — catch the error and force a full page reload</li>
          <li><strong>Loading waterfall:</strong> If a route component lazy-loads another component that lazy-loads data, you get a serial waterfall. Use data loaders or parallel Suspense boundaries to break the chain</li>
          <li><strong>No loading indicator:</strong> A blank screen during chunk loading feels broken. Always provide meaningful Suspense fallbacks — skeletons, spinners, or at minimum a loading message</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Next.js Automatic Splitting</h3>
          <p>
            Next.js splits every page into its own chunk automatically. The App Router goes further
            by splitting at the layout level — shared layouts are separate chunks that persist across
            child navigations. A user navigating between <code>/dashboard/analytics</code> and{" "}
            <code>/dashboard/settings</code> only downloads the child page chunk; the dashboard
            layout chunk is already loaded and cached.
          </p>
        </div>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Airbnb</h3>
          <p>
            Airbnb aggressively splits their application along route boundaries. The search results
            page, listing detail page, booking flow, and host management tools are all separate
            chunks. They combine this with granular prefetching — when search results render,
            Airbnb prefetches the listing detail chunk for the first few visible results, making
            the click-through feel instant.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does route-based code splitting improve performance?</p>
            <p className="mt-2 text-sm">
              A: It reduces the initial JavaScript bundle size by only loading the code needed for
              the current route. This decreases download time, parse time, and execution time —
              directly improving Time to Interactive and First Contentful Paint. Subsequent route
              chunks are loaded on demand (or prefetched), so the user pays only for the code they
              actually use.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What happens when a chunk fails to load after a deployment?</p>
            <p className="mt-2 text-sm">
              A: After a deployment, old chunk filenames (with content hashes) no longer exist on
              the server. A user with a cached version of the app may try to load a chunk that no
              longer exists, causing a ChunkLoadError. Handle this by catching dynamic import errors
              and triggering a full page reload, which fetches the latest HTML with updated chunk
              references.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you decide what to split?</p>
            <p className="mt-2 text-sm">
              A: Start with route boundaries — this is automatic in frameworks like Next.js. Then
              analyze the bundle: use Webpack Bundle Analyzer or Vite&apos;s rollup-plugin-visualizer
              to identify large dependencies. Split heavy components that aren&apos;t needed on
              initial render (charts, editors, modals). Avoid splitting small components — the HTTP
              overhead outweighs the size savings.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prefetch route chunks to eliminate navigation latency?</p>
            <p className="mt-2 text-sm">
              A: Three strategies in order of resource efficiency: (1) Hover prefetch — start loading
              the chunk when the user hovers over a navigation link, giving 200-400ms head start.
              (2) Viewport prefetch — use Intersection Observer to prefetch chunks for links visible
              in the viewport (Next.js does this automatically with its Link component).
              (3) Idle prefetch — load all route chunks during browser idle time via
              requestIdleCallback. Hover prefetch offers the best balance of resource efficiency
              and perceived performance.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent shared dependencies from being duplicated across route chunks?</p>
            <p className="mt-2 text-sm">
              A: Configure the bundler&apos;s chunk splitting to extract shared modules into common
              chunks. In Webpack, use <code>splitChunks</code> with <code>chunks: &quot;all&quot;</code>{" "}
              and tune <code>minSize</code>/<code>minChunks</code> thresholds. When multiple route
              chunks import the same library (e.g., a date library), the bundler extracts it into a
              shared vendor chunk that&apos;s loaded once and cached. The trade-off: more shared chunks
              mean more HTTP requests on first load, but smaller total download size across navigations.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the loading waterfall problem with lazy routes, and how do you solve it?</p>
            <p className="mt-2 text-sm">
              A: A waterfall occurs when a lazy-loaded route component triggers its own lazy-loaded
              child component, which then fetches data — creating a serial chain: load route chunk →
              render → load child chunk → render → fetch data → render. Each step waits for the
              previous one. Solutions: use data routers where loaders run in parallel with chunk
              loading, colocate data requirements at the route level instead of component level,
              use parallel Suspense boundaries so independent parts load concurrently, and prefetch
              both the chunk and its data on navigation intent.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References &amp; Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>React documentation — Code Splitting with React.lazy and Suspense</li>
          <li>Webpack — Code Splitting guide and splitChunks configuration</li>
          <li>Next.js — Automatic code splitting and lazy loading</li>
          <li>web.dev — Reduce JavaScript payloads with code splitting</li>
          <li>Vite — Code splitting and chunk strategies</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
