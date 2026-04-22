"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-code-splitting",
  title: "Code Splitting",
  description: "Comprehensive guide to code splitting strategies for optimizing JavaScript bundle delivery and improving application performance.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "code-splitting",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "performance", "code-splitting", "lazy-loading", "webpack", "bundling", "optimization"],
  relatedTopics: ["lazy-loading", "tree-shaking", "bundle-size-optimization", "resource-hints"],
};

export default function CodeSplittingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Code splitting</strong> is a build optimization technique that breaks a monolithic JavaScript bundle into smaller, 
          <Highlight tier="important">logically-separated chunks</Highlight> that are{" "}
          <Highlight tier="important">loaded on-demand</Highlight> rather than all at once during initial page load. Instead of shipping 
          a single bundle containing every component, route, library, and feature in your application, code splitting enables you to 
          deliver only the code required for the current view, deferring the download of unused code until it is actually needed.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The fundamental problem code splitting addresses is the <strong>bundle size bottleneck</strong>. Modern single-page 
          applications (SPAs) built with frameworks like React, Angular, or Vue can easily accumulate 1-5 megabytes of JavaScript 
          when all dependencies, components, and routes are bundled together. On a fast broadband connection, this might add only 
          1-2 seconds to load time. However, on a 3G mobile connection (common in many parts of the world), downloading and parsing 
          2 megabytes of JavaScript can take 10-30 seconds — during which the page is completely unresponsive and unusable.
        </HighlightBlock>
        <p>
          Code splitting directly impacts several critical performance metrics:
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Time to Interactive (TTI):</strong> By reducing the initial JavaScript payload, the browser spends less time 
            downloading, parsing, compiling, and executing JavaScript before the page becomes interactive. A 500 KB reduction in 
            initial bundle can improve TTI by 1-3 seconds on mid-tier mobile devices.
          </HighlightBlock>
          <li>
            <strong>First Contentful Paint (FCP):</strong> Smaller bundles mean the browser can begin rendering content sooner, 
            as the main thread is blocked for shorter durations by JavaScript execution.
          </li>
          <li>
            <strong>Total Blocking Time (TBT):</strong> Less JavaScript to parse and execute means fewer long tasks blocking the 
            main thread, directly improving this Core Web Vital metric.
          </li>
          <li>
            <strong>Cache Efficiency:</strong> When code is split into logical chunks, changes to one part of the application 
            invalidate only that specific chunk&apos;s cache, not the entire bundle. This means returning users download less code 
            on subsequent visits.
          </li>
        </ul>
        <p>
          The primary mechanism for code splitting in modern JavaScript applications is the <strong>dynamic import()</strong> syntax, 
          which is a stage-4 ECMAScript proposal supported by all major bundlers (Webpack, Vite, Rollup, esbuild) and natively in 
          modern browsers. When a bundler encounters a dynamic import, it creates a separate chunk that is fetched asynchronously 
          at runtime when the import statement is executed.
        </p>
        <p>
          In the context of system design interviews, code splitting demonstrates understanding of resource prioritization, 
          network constraints, progressive enhancement, and the trade-offs between initial load time and navigation latency. 
          It is a critical technique for building performant applications at scale.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="crucial">
          Internalize three ideas: a <Highlight tier="important">split point</Highlight> is a new network
          request, chunk graphs can create <Highlight tier="important">waterfalls</Highlight>, and the UX
          outcome is governed by <Highlight tier="important">prefetch + loading states</Highlight>.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Optimize for what ships on the first view: move non-critical code behind interactions, routes, or
          feature flags, but keep the initial render path simple and predictable.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Think in terms of constraints: network RTT, cache behavior, and CPU parse/execute. Chunking that
          improves LCP but harms INP is not a win.
        </HighlightBlock>
        
        <h3>Static vs Dynamic Imports</h3>
        <p>
          Understanding the distinction between static and dynamic imports is fundamental to code splitting:
        </p>
        <p>
          <strong>Static imports</strong> use the <code>import</code> statement at the top level of a module. The bundler 
          analyzes these at build time and includes the imported code in the dependency graph. All statically imported code 
          is bundled together and loaded upfront, regardless of whether it is immediately needed.
        </p>
        <p>
          <strong>Dynamic imports</strong> use the <code>import()</code> function-like syntax, which returns a Promise that 
          resolves to the imported module. Because dynamic imports can be conditional and executed at any point during runtime, 
          the bundler cannot include this code in the main bundle. Instead, it creates a separate chunk that is fetched over 
          the network when the dynamic import is executed.
        </p>

        <h3>Chunk Types</h3>
        <p>
          A typical code-split application produces several types of chunks:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Entry Chunk (Main):</strong> The initial bundle containing the application entry point, runtime code, and 
            critical dependencies needed for the first render. This is the only chunk that blocks initial page load.
          </li>
          <li>
            <strong>Vendor Chunk:</strong> Contains third-party libraries from node_modules that are shared across multiple 
            parts of the application. Separating vendor code allows it to be cached independently from application code, which 
            changes more frequently.
          </li>
          <li>
            <strong>Route Chunks:</strong> Each route or page in the application becomes its own chunk. When the user navigates 
            to a route, the corresponding chunk is downloaded.
          </li>
          <li>
            <strong>Component Chunks:</strong> Individual heavy components (rich text editors, chart libraries, image galleries) 
            can be split into their own chunks and loaded only when the component is rendered.
          </li>
          <li>
            <strong>Async Chunks:</strong> Chunks created for dynamic imports that are not tied to specific routes, such as 
            features loaded conditionally based on user roles or feature flags.
          </li>
        </ul>

        <h3>Split Points</h3>
        <p>
          A <strong>split point</strong> is a location in your code where the bundler creates a new chunk. Each split point 
          represents a trade-off: it reduces initial bundle size but introduces a network request when that code is needed. 
          Strategic placement of split points is crucial for optimal performance.
        </p>
        <p>
          Common split point strategies include route-level splitting (one chunk per route), component-level splitting (heavy 
          components loaded on demand), and library-level splitting (large dependencies like charting libraries or date pickers 
          loaded separately).
        </p>

        <h3>Chunk Loading Mechanisms</h3>
        <p>
          Modern bundlers implement chunk loading using several techniques:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>JSONP Loading:</strong> Webpack&apos;s default mechanism creates a script tag with a callback function. The 
            chunk is served as JavaScript that calls the callback with the module exports.
          </li>
          <li>
            <strong>Fetch + Eval:</strong> Some bundlers use the Fetch API to download the chunk as text, then evaluate it. 
            This allows for more control but has security implications with Content Security Policy.
          </li>
          <li>
            <strong>ES Module Loading:</strong> Modern bundlers can output ES modules and use dynamic <code>import()</code> 
            natively in browsers that support it.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          The flow you should be able to explain end-to-end: route render → missing chunk → fetch → parse →
          execute → hydrate/paint, plus what you do when chunk load fails (retry, refresh, backoff).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          SSR adds a constraint: the server must know which chunks to preload so hydration doesn&apos;t mismatch.
          Your architecture should make chunk discovery deterministic.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Production readiness includes failure handling: chunk load errors (deploy race), offline, and flaky
          networks must have user-safe fallbacks.
        </HighlightBlock>
        
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/code-splitting-architecture.svg"
          alt="Comparison diagram showing traditional single bundle approach versus code splitting with multiple on-demand chunks"
          caption="Traditional bundling delivers all code upfront versus code splitting which loads chunks on demand"
          captionTier="important"
        />

        <h3>Traditional Bundling Architecture</h3>
        <p>
          In a traditional bundling architecture, all application code flows through a single pipeline: source files and 
          dependencies are analyzed, transformed, and concatenated into one or two large bundles (often called main.js and 
          vendor.js). When a user visits the application, the browser must download the entire bundle before any meaningful 
          rendering can occur.
        </p>
        <p>
          This approach has a critical flaw: users download code for features they may never use. A user who visits the 
          homepage and immediately bounces still downloads the dashboard, settings, admin panel, and every other route in 
          the application. On content-heavy sites or complex applications, this can mean downloading 5-10 times more code 
          than necessary for the initial interaction.
        </p>

        <h3>Code Splitting Architecture</h3>
        <p>
          Code splitting transforms this architecture by introducing a <strong>chunk registry</strong> and <strong>async 
          loading mechanism</strong>. The build process produces a manifest file that maps module identifiers to chunk URLs. 
          At runtime, when a dynamic import is encountered, the bundler&apos;s runtime checks if the chunk is already loaded. 
          If not, it initiates a network request to fetch the chunk, then executes the module code and resolves the import 
          Promise.
        </p>
        <p>
          The architecture consists of several layers:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Build-Time Analysis:</strong> The bundler performs static analysis to identify dynamic imports and creates 
            a dependency graph for each chunk. It determines which modules go into which chunks and generates the chunk manifest.
          </li>
          <li>
            <strong>Runtime Loader:</strong> A small runtime (typically 5-15 KB) is included in the entry chunk. This runtime 
            manages chunk loading, caching, and module resolution. It ensures that chunks are loaded only once and handles 
            error states.
          </li>
          <li>
            <strong>Chunk Manifest:</strong> A JSON file (often inlined in the HTML or entry chunk) that maps module IDs to 
            chunk URLs. This allows the runtime to know where to fetch each chunk.
          </li>
          <li>
            <strong>Network Layer:</strong> Chunks are served as static assets from a CDN or web server. They are typically 
            content-hashed (e.g., dashboard.a1b2c3d4.js) to enable aggressive caching with cache-busting on updates.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/code-splitting-flow.svg"
          alt="Flow diagram showing the five-step process of code splitting during user navigation from initial load to chunk execution"
          caption="The code splitting flow: initial load, user navigation triggers dynamic import, chunk is fetched, then executed"
        />

        <h3>Navigation Flow with Code Splitting</h3>
        <p>
          The navigation flow in a code-split application follows a predictable pattern:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Initial Page Load:</strong> The browser downloads the HTML document, which references the entry chunk 
            (main.js) and vendor chunk. These are parsed and executed, bootstrapping the application and rendering the 
            initial view.
          </li>
          <li>
            <strong>User Interaction:</strong> The user clicks a navigation link (e.g., &quot;Dashboard&quot;). The router 
            intercepts this navigation event before the browser performs a full page reload.
          </li>
          <li>
            <strong>Route Resolution:</strong> The router determines which component is responsible for the target route. 
            If that component was dynamically imported, the router triggers the dynamic import.
          </li>
          <li>
            <strong>Chunk Fetch:</strong> The bundler runtime checks its internal cache. If the chunk is not already loaded, 
            it creates a script tag (or uses fetch) to download the chunk from the server. This is an asynchronous operation 
            that typically takes 100-500ms depending on chunk size and network conditions.
          </li>
          <li>
            <strong>Module Execution:</strong> Once the chunk is downloaded, the bundler runtime executes the module code, 
            registers the exports, and resolves the import Promise. The router then renders the component.
          </li>
          <li>
            <strong>Subsequent Navigations:</strong> If the user navigates away and back to the same route, the chunk is 
            already in memory and loads instantly without a network request.
          </li>
        </ol>

        <h3>Framework Integration Patterns</h3>
        <p>
          Different frameworks provide different levels of built-in support for code splitting:
        </p>
        <p>
          <strong>Next.js</strong> provides automatic route-based code splitting out of the box. Each file in the app/ or 
          pages/ directory becomes its own chunk. Next.js also provides a dynamic() function that wraps React.lazy with 
          additional features like SSR support and custom loading states.
        </p>
        <p>
          <strong>React Router</strong> works with React.lazy and Suspense to enable route-based splitting. Developers 
          manually wrap route components with lazy() and provide Suspense boundaries with loading fallbacks.
        </p>
        <p>
          <strong>Vite</strong> uses Rollup under the hood and supports code splitting via dynamic imports. It also provides 
          advanced features like manualChunks configuration for fine-grained control over chunk creation.
        </p>
        <p>
          <strong>Angular</strong> has built-in support for lazy-loaded routes via the loadChildren property in route 
          configuration. The Angular compiler automatically creates chunks for lazy routes.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>

        <HighlightBlock as="p" tier="crucial">
          Code splitting is fundamentally a{" "}
          <Highlight tier="important">cost-shifting strategy</Highlight>: you trade{" "}
          <Highlight tier="important">initial load</Highlight> bytes for{" "}
          <Highlight tier="important">on-demand navigation</Highlight> bytes. At staff/principal level, the
          question is not &quot;should we split?&quot; but{" "}
          <Highlight tier="important">where to place split points</Highlight> and{" "}
          <Highlight tier="important">how to hide navigation latency</Highlight>{" "}
          (prefetch, skeletons, and priority hints).
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/code-splitting-tradeoffs.svg"
          alt="Comparison chart showing benefits versus trade-offs of implementing code splitting in web applications"
          caption="Code splitting provides significant benefits but introduces trade-offs that must be carefully managed"
          captionTier="important"
        />

        <h3>Benefits of Code Splitting</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Faster Initial Load:</strong> The most significant benefit. By reducing the initial JavaScript payload 
            by 50-80%, pages become interactive much faster. For e-commerce sites, this directly correlates with conversion 
            rates — Amazon found that every 100ms of latency cost them 1% in sales.
          </HighlightBlock>
          <li>
            <strong>Improved Cache Efficiency:</strong> When code is split into logical chunks, deploying a bugfix to one 
            component invalidates only that component&apos;s chunk cache. Users retain cached vendor chunks and unchanged 
            route chunks, reducing bandwidth on subsequent visits.
          </li>
          <li>
            <strong>Better Core Web Vitals:</strong> Code splitting directly improves TTI (less JavaScript to execute), FCP 
            (main thread is blocked for shorter duration), and TBT (fewer long tasks during initial load).
          </li>
          <li>
            <strong>Bandwidth Savings:</strong> Users on mobile or metered connections only download code for the features 
            they actually use. A user who never visits the admin panel never downloads admin code.
          </li>
          <li>
            <strong>Parallel Downloads:</strong> With HTTP/2, multiple chunks can be downloaded in parallel over a single 
            connection, making the overhead of multiple requests less significant than with HTTP/1.1.
          </li>
        </ul>

        <h3>Trade-offs and Costs</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Navigation Latency:</strong> The primary trade-off. When a user navigates to a route whose chunk is not 
            yet loaded, they experience a delay while the chunk downloads. This delay ranges from 100ms (small chunk, fast 
            connection) to 2+ seconds (large chunk, slow connection). Without proper loading states, this creates a perceived 
            &quot;frozen&quot; UI.
          </HighlightBlock>
          <li>
            <strong>Increased HTTP Requests:</strong> Each chunk requires a separate HTTP request. While HTTP/2 mitigates 
            this with multiplexing, excessive splitting (dozens of tiny chunks) can still introduce overhead from connection 
            management and request headers.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Loading Waterfalls:</strong> If chunks have dependencies on other chunks, they load sequentially rather 
            than in parallel. For example, if a route chunk depends on a vendor chunk that wasn&apos;t preloaded, the route 
            chunk must wait for the vendor chunk to finish downloading first. This waterfall effect can multiply latency.
          </HighlightBlock>
          <li>
            <strong>SSR Complexity:</strong> React.lazy does not work with server-side rendering out of the box because the 
            server needs to know which chunks to preload before sending HTML. Solutions like Next.js&apos;s dynamic() or 
            loadable-components add complexity to the build pipeline.
          </li>
          <li>
            <strong>Cache Fragmentation:</strong> While splitting improves cache efficiency for updates, having many small 
            chunks can reduce overall cache hit rates. Browsers have limited cache storage, and many tiny files may be evicted 
            more aggressively than fewer larger files.
          </li>
          <li>
            <strong>Debugging Complexity:</strong> Source maps become more complex with code splitting. Error tracking tools 
            must correlate errors across multiple chunks, and debugging network issues requires understanding chunk loading 
            failures.
          </li>
        </ul>

        <h3>Comparison: Splitting Strategies</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Strategy</th>
                <th className="p-3 text-left">Initial Bundle</th>
                <th className="p-3 text-left">Navigation Speed</th>
                <th className="p-3 text-left">Complexity</th>
                <th className="p-3 text-left">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">No Splitting</td>
                <td className="p-3">Large (1-5 MB)</td>
                <td className="p-3">Instant</td>
                <td className="p-3">Low</td>
                <td className="p-3">Small apps, internal tools</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Route-Level Only</td>
                <td className="p-3">Medium (200-500 KB)</td>
                <td className="p-3">Fast (100-300ms)</td>
                <td className="p-3">Low</td>
                <td className="p-3">Most SPAs, content sites</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Route + Component</td>
                <td className="p-3">Small (100-300 KB)</td>
                <td className="p-3">Variable</td>
                <td className="p-3">Medium</td>
                <td className="p-3">Apps with heavy components</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Aggressive Splitting</td>
                <td className="p-3">Minimal (&lt;100 KB)</td>
                <td className="p-3">Slow (300-1000ms)</td>
                <td className="p-3">High</td>
                <td className="p-3">Mobile-first, emerging markets</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="crucial">
          Best practices are about hiding latency: choose sensible chunk sizes, prefetch likely next routes,
          avoid waterfalls, and make SSR-compatible choices when SEO or first paint matters.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Prefer a few meaningful chunks over dozens of tiny ones. Over-splitting often creates waterfalls and
          hurts the median and the tail.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Validate with metrics: TBT/INP for CPU cost, and route navigation latency for chunk fetch cost.
        </HighlightBlock>

        <h3>Start with Route-Level Splitting</h3>
        <p>
          Route-based splitting provides the highest impact with the lowest complexity. Each major route (homepage, dashboard, 
          settings, admin) should be its own chunk. This ensures users only download code for the views they actually visit. 
          Most modern frameworks provide this automatically or with minimal configuration.
        </p>

        <h3>Identify Heavy Components for Splitting</h3>
        <p>
          Profile your bundle to identify components that contribute significantly to bundle size. Rich text editors, chart 
          libraries, date pickers, image galleries, and map components are common candidates. If a component is larger than 
          50 KB and is not needed on initial render, consider splitting it.
        </p>

        <h3>Implement Prefetching for Likely Routes</h3>
        <p>
          Prefetching eliminates navigation latency by downloading chunks before the user navigates. Common patterns include:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Idle-Time Prefetching:</strong> Use requestIdleCallback or setTimeout to prefetch chunks during browser 
            idle time. This avoids competing with critical resources.
          </li>
          <li>
            <strong>Hover/Focus Prefetching:</strong> When a user hovers over a navigation link for 100-200ms, prefetch the 
            corresponding chunk. This provides near-instant navigation for intentional clicks.
          </li>
          <li>
            <strong>Viewport-Based Prefetching:</strong> Prefetch chunks for routes linked by elements visible in the viewport. 
            This assumes users are likely to click visible links.
          </li>
          <li>
            <strong>Webpack Prefetch Hints:</strong> Use magic comments like import(/* webpackPrefetch: true */) to hint 
            to the bundler that a chunk should be prefetched automatically.
          </li>
        </ul>

        <h3>Provide Meaningful Loading States</h3>
        <p>
          Never let users stare at a blank screen while chunks load. Always wrap lazy-loaded components in Suspense boundaries 
          with appropriate fallback UIs:
        </p>
        <ul className="space-y-2">
          <li>
            Use skeleton screens that match the layout of the loading component.
          </li>
          <li>
            Show progress indicators for large chunks or slow connections.
          </li>
          <li>
            Implement optimistic UI updates where possible (e.g., navigate immediately, show loading state within the page).
          </li>
        </ul>

        <h3>Configure Vendor Chunk Splitting</h3>
        <p>
          Separate third-party libraries into their own chunk(s). This allows vendor code to be cached independently from 
          application code. Consider further splitting large vendors (React, Moment.js, Lodash) into their own chunks if they 
          are not needed for initial render.
        </p>

        <h3>Monitor Chunk Sizes</h3>
        <p>
          Use bundle analysis tools (webpack-bundle-analyzer, rollup-plugin-visualizer) in your CI/CD pipeline to catch chunk 
          bloat before it reaches production. Set performance budgets that fail builds when chunks exceed size thresholds 
          (e.g., no route chunk larger than 150 KB).
        </p>

        <h3>Limit Total Chunk Count</h3>
        <p>
          As a general guideline, aim for 5-15 chunks total for most applications. Fewer than 5 suggests under-splitting; 
          more than 15 suggests over-splitting. The optimal number depends on your application&apos;s complexity and user 
          navigation patterns.
        </p>

        <h3>Use HTTP/2 or HTTP/3</h3>
        <p>
          HTTP/2&apos;s multiplexing allows multiple chunks to be downloaded in parallel over a single connection, dramatically 
          reducing the overhead of multiple requests. HTTP/3 further improves performance with QUIC protocol. Ensure your 
          server and CDN support these protocols.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3>Over-Splitting</h3>
        <HighlightBlock as="p" tier="important">
          Creating too many tiny chunks introduces significant overhead. Each chunk requires a separate HTTP request, and the 
          cumulative latency of multiple round-trips can exceed the cost of downloading a slightly larger bundle. A common 
          mistake is splitting every component into its own chunk — this creates dozens of requests and loading waterfalls.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Group related components into logical chunks. Aim for chunks in the 50-150 KB range 
          (uncompressed). Use bundler configuration to control minimum chunk sizes and prevent over-splitting.
        </p>

        <h3>Loading Waterfalls</h3>
        <HighlightBlock as="p" tier="important">
          A loading waterfall occurs when chunks have sequential dependencies. For example, if a route chunk imports a 
          component chunk, which imports a utility chunk, the browser must download them one after another. Three 50 KB 
          chunks with waterfall loading take 3x the latency of a single 150 KB chunk.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Flatten your import chains. Use bundler features like splitChunks to hoist shared 
          dependencies into common chunks. Preload critical dependent chunks to parallelize downloads.
        </p>

        <h3>Missing Loading States</h3>
        <p>
          Without proper Suspense boundaries and fallback UIs, users see blank screens or frozen interfaces while chunks 
          load. This creates a perception of slowness even if actual load times are acceptable.
        </p>
        <p>
          <strong>Solution:</strong> Always wrap lazy components in Suspense with skeleton screens or loading spinners. 
          Consider showing the previous page&apos;s UI with a loading overlay during navigation.
        </p>

        <h3>Breaking SSR</h3>
        <HighlightBlock as="p" tier="crucial">
          React.lazy does not work with server-side rendering out of the box. During SSR, the server needs to know which 
          chunks to preload in the HTML it sends. Using React.lazy without SSR support results in hydration mismatches 
          and flash-of-unstyled-content.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Use framework-specific solutions like Next.js&apos;s dynamic() or libraries like 
          @loadable/component that provide SSR-compatible lazy loading.
        </p>

        <h3>Splitting Too Little</h3>
        <p>
          The opposite problem: only splitting at the route level misses opportunities. Heavy components like rich text 
          editors, chart libraries, or date pickers can add 100-500 KB to route chunks even when not immediately visible.
        </p>
        <p>
          <strong>Solution:</strong> Profile your bundle and identify components larger than 50 KB that are not needed for 
          initial render. Split these components even within already-split routes.
        </p>

        <h3>Ignoring Prefetching</h3>
        <HighlightBlock as="p" tier="important">
          Code splitting without prefetching means users experience navigation latency on every first visit to a route. 
          This is especially problematic for primary navigation paths (e.g., homepage to product page).
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Implement prefetching for likely next routes. Use hover-based prefetching for navigation 
          links and idle-time prefetching for secondary routes.
        </p>

        <h3>Not Handling Chunk Load Errors</h3>
        <p>
          Chunk loading can fail due to network issues, CDN outages, or cache corruption. Without error handling, the 
          application crashes silently or shows a blank screen.
        </p>
        <p>
          <strong>Solution:</strong> Implement error boundaries around lazy-loaded components. Provide retry mechanisms 
          and fallback UIs for chunk load failures. Monitor chunk load error rates in production.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="crucial">
          Use cases are where interviewers check judgment: segment users (admin vs regular), split heavy
          editors/charts, and measure the impact on TTI/TBT/INP, not just bundle size.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Call out &quot;what stayed in the entry chunk&quot; explicitly (shell, nav, auth gating) and why.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Mention how you prefetch the next step in critical flows (checkout, onboarding) to remove perceived
          navigation latency.
        </HighlightBlock>

        <h3>E-Commerce Platform</h3>
        <p>
          A large e-commerce site with 50+ routes (homepage, category pages, product pages, cart, checkout, user profile, 
          order history, reviews, etc.) implemented route-based code splitting. Before splitting, the initial bundle was 
          2.1 MB. After splitting, the homepage loaded with only 180 KB of JavaScript, while product pages loaded an 
          additional 120 KB chunk, and checkout loaded a separate 200 KB chunk.
        </p>
        <p>
          Results:
        </p>
        <ul className="space-y-1">
          <li>• Initial load time on 3G: 12s → 3.5s (71% improvement)</li>
          <li>• Time to Interactive: 8s → 2.8s (65% improvement)</li>
          <li>• Bounce rate: decreased by 18%</li>
          <li>• Conversion rate: increased by 12%</li>
        </ul>

        <h3>SaaS Dashboard Application</h3>
        <p>
          A B2B SaaS application with complex data visualizations implemented component-level splitting for chart libraries. 
          The main dashboard loaded without any charting code. When users clicked to view analytics, the chart library 
          (280 KB) was loaded on-demand.
        </p>
        <p>
          Results:
        </p>
        <ul className="space-y-1">
          <li>• Dashboard initial load: 4.2s → 1.8s</li>
          <li>• Users who never viewed analytics saved 280 KB download</li>
          <li>• Chart load latency (300ms) was acceptable with skeleton loading state</li>
        </ul>

        <h3>Content Publishing Platform</h3>
        <p>
          A Medium-like publishing platform implemented aggressive splitting for the editor. The reading experience loaded 
          with minimal JavaScript (~80 KB), while the rich text editor (650 KB including ProseMirror, plugins, and upload 
          handlers) was loaded only when users clicked &quot;Write New Post.&quot;
        </p>
        <p>
          Results:
        </p>
        <ul className="space-y-1">
          <li>• Article page load time: 5.1s → 1.4s</li>
          <li>• Editor load time: instant → 800ms (acceptable for intentional action)</li>
          <li>• Mobile traffic increased 35% due to improved performance in emerging markets</li>
        </ul>

        <h3>Enterprise Admin Panel</h3>
        <p>
          An enterprise admin panel with role-based features implemented conditional splitting. Admin-only features (user 
          management, audit logs, system configuration) were split into chunks that were only loaded for users with admin 
          roles. Regular users never downloaded admin code.
        </p>
        <p>
          Results:
        </p>
        <ul className="space-y-1">
          <li>• Regular user bundle: 1.8 MB → 450 KB</li>
          <li>• Admin user bundle: 1.8 MB → 1.2 MB (admin chunks loaded on demand)</li>
          <li>• Reduced attack surface by not shipping admin code to non-admin users</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview bar: define split points, explain the navigation latency trade-off, and describe how you
          mitigate it (prefetch, loading states, SSR-safe chunking) while validating with metrics.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Strong answers are structured: what to split, why, how to measure, and how to prevent regressions.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Mention real production failure modes: chunk load errors after deploys, cache invalidation, and
          waterfall dependencies.
        </HighlightBlock>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is code splitting and why is it important for performance?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <HighlightBlock as="p" tier="important" className="mb-3">
              Code splitting is a technique that breaks a monolithic JavaScript bundle into smaller chunks that are loaded 
              on-demand rather than all at once. Instead of shipping one large bundle containing every route, component, and 
              library, code splitting enables the application to load only the code needed for the current view.
            </HighlightBlock>
            <p className="mb-3">
              It is important for performance because:
            </p>
            <ul className="space-y-1">
              <li>• <strong>Reduces initial load time:</strong> Users download less JavaScript upfront, which means faster 
              Time to Interactive. A typical SPA can go from 2 MB to 200-400 KB initial load with proper splitting.</li>
              <li>• <strong>Improves Core Web Vitals:</strong> Less JavaScript to parse and execute means better FCP, TTI, 
              and TBT scores.</li>
              <li>• <strong>Saves bandwidth:</strong> Users only download code for features they actually use. A user who 
              never visits the admin panel never downloads admin code.</li>
              <li>• <strong>Better caching:</strong> When code changes, only the affected chunk&apos;s cache is invalidated, 
              not the entire bundle.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What are the trade-offs of code splitting? When might you NOT want to split code?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <HighlightBlock as="p" tier="crucial" className="mb-3">
              The primary trade-off is <strong>navigation latency</strong>. When a user navigates to a route whose chunk 
              is not yet loaded, they experience a delay (100-1000ms) while the chunk downloads. Without proper loading 
              states, this creates a poor user experience.
            </HighlightBlock>
            <p className="mb-3">
              Other trade-offs include increased HTTP requests (mitigated by HTTP/2), loading waterfalls if chunks have 
              dependencies, SSR complexity, and debugging overhead.
            </p>
            <p className="mb-3">
              You might NOT want to split code when:
            </p>
            <ul className="space-y-1">
              <li>• The application is small (total bundle &lt; 200 KB) — splitting adds complexity without meaningful benefit.</li>
              <li>• Users typically visit all routes in a single session — they will download all chunks anyway, plus the 
              overhead of multiple requests.</li>
              <li>• The application is used primarily on fast, reliable networks (e.g., internal enterprise tools on corporate 
              LAN) — navigation latency matters more than initial load.</li>
              <li>• SEO is critical and SSR is not properly configured for lazy loading — search engines may not execute 
              JavaScript to load split chunks.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How would you decide what to split and what to keep in the initial bundle?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              I would use a data-driven approach:
            </p>
            <ol className="space-y-2">
              <li>
                <strong>Profile the bundle:</strong> Use webpack-bundle-analyzer or similar tools to identify the largest 
                modules and dependencies.
              </li>
              <li>
                <strong>Analyze user behavior:</strong> Use analytics to understand which routes and features users actually 
                access. Routes with low traffic are candidates for splitting.
              </li>
              <li>
                <strong>Start with routes:</strong> Split by route first — this provides the highest impact with lowest 
                complexity. Each major page becomes its own chunk.
              </li>
              <li>
                <strong>Identify heavy components:</strong> Components larger than 50 KB that are not needed for initial 
                render (modals, editors, charts, maps) should be split.
              </li>
              <li>
                <strong>Consider user roles:</strong> Features only used by specific user types (admin panels, premium 
                features) should be split and loaded conditionally.
              </li>
              <li>
                <strong>Keep critical path in initial bundle:</strong> Anything needed for the first interaction (header, 
                navigation, above-the-fold content) should remain in the initial bundle.
              </li>
            </ol>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you handle loading states and errors with code splitting?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              For loading states, I wrap lazy-loaded components in React Suspense boundaries with appropriate fallback UIs:
            </p>
            <ul className="space-y-1">
              <li>• Use skeleton screens that match the layout of the loading component for perceived performance.</li>
              <li>• Show progress indicators for large chunks or when network is slow.</li>
              <li>• Implement optimistic navigation — transition immediately and show loading state within the page.</li>
            </ul>
            <p className="mb-3">
              For error handling:
            </p>
            <ul className="space-y-1">
              <li>• Wrap lazy components in Error Boundaries that catch chunk load failures.</li>
              <li>• Provide retry mechanisms — chunk loads can fail transiently due to network issues.</li>
              <li>• Show user-friendly error messages with options to retry or navigate elsewhere.</li>
              <li>• Monitor chunk load error rates in production using error tracking tools.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What is prefetching and how does it complement code splitting?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Prefetching is a technique that downloads chunks before the user navigates to them, eliminating navigation 
              latency. It complements code splitting by addressing its main trade-off: the delay when loading a chunk on 
              demand.
            </p>
            <p className="mb-3">
              Common prefetching strategies:
            </p>
            <ul className="space-y-1">
              <li>• <strong>Hover prefetching:</strong> When a user hovers over a navigation link for 100-200ms, prefetch 
              the corresponding chunk. This provides near-instant navigation for intentional clicks.</li>
              <li>• <strong>Idle-time prefetching:</strong> Use requestIdleCallback to prefetch chunks during browser idle 
              time, avoiding competition with critical resources.</li>
              <li>• <strong>Viewport-based prefetching:</strong> Prefetch chunks for routes linked by elements visible in 
              the viewport.</li>
              <li>• <strong>Route-based prefetching:</strong> Frameworks like Next.js automatically prefetch linked pages 
              when they appear in the viewport.</li>
            </ul>
            <p className="mb-3">
              The key is balancing prefetching aggressiveness — prefetch too little and users experience latency; prefetch 
              too much and you waste bandwidth on routes users never visit.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How does code splitting work with Server-Side Rendering?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Code splitting with SSR is more complex because the server needs to know which chunks to preload before sending 
              HTML. The basic flow is:
            </p>
            <ol className="space-y-2">
              <li>
                <strong>Server renders the component tree:</strong> During SSR, the server encounters lazy-loaded components.
              </li>
              <li>
                <strong>Chunk manifest is consulted:</strong> The server determines which chunks are needed for the rendered 
                components using a chunk manifest.
              </li>
              <li>
                <strong>Preload hints are added to HTML:</strong> The server adds &lt;link rel=&quot;preload&quot;&gt; or 
                &lt;link rel=&quot;modulepreload&quot;&gt; tags for required chunks in the HTML head.
              </li>
              <li>
                <strong>Client hydrates:</strong> The browser downloads the HTML, discovers preload hints, and fetches 
                required chunks in parallel.
              </li>
            </ol>
            <p className="mb-3">
              React.lazy does not support SSR out of the box. Solutions include:
            </p>
            <ul className="space-y-1">
              <li>• Next.js dynamic() function — wraps React.lazy with SSR support.</li>
              <li>• @loadable/component — provides SSR-compatible lazy loading with chunk extraction.</li>
              <li>• React Server Components — a newer approach that handles splitting at the component level with built-in 
              SSR support.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References</h2>
        <ul className="space-y-3">
          <li>
            <a 
              href="https://web.dev/reduce-javascript-payloads-with-code-splitting/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              web.dev — Reduce JavaScript Payloads with Code Splitting
            </a>
            <p className="text-sm text-muted mt-1">
              Google&apos;s comprehensive guide on code splitting strategies and their impact on Core Web Vitals.
            </p>
          </li>
          <li>
            <a 
              href="https://webpack.js.org/guides/code-splitting/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Webpack Documentation — Code Splitting
            </a>
            <p className="text-sm text-muted mt-1">
              Official Webpack guide covering bundle splitting, splitChunks optimization, and dynamic imports.
            </p>
          </li>
          <li>
            <a 
              href="https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Next.js Documentation — Lazy Loading
            </a>
            <p className="text-sm text-muted mt-1">
              Next.js-specific implementation of code splitting with SSR support and the dynamic() function.
            </p>
          </li>
          <li>
            <a 
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              MDN — Dynamic Imports
            </a>
            <p className="text-sm text-muted mt-1">
              ECMAScript specification and browser compatibility for the dynamic import() syntax.
            </p>
          </li>
          <li>
            <a 
              href="https://philipwalton.com/articles/normalizing-cache-behavior-across-browsers-with-service-workers/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Philip Walton — Normalizing Cache Behavior
            </a>
            <p className="text-sm text-muted mt-1">
              Deep dive into browser caching behavior and how code splitting affects cache efficiency.
            </p>
          </li>
          <li>
            <a 
              href="https://www.smashingmagazine.com/2019/04/code-splitting-lazy-loading-components-react/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Smashing Magazine — Code Splitting in React
            </a>
            <p className="text-sm text-muted mt-1">
              Practical guide to implementing code splitting patterns in React applications.
            </p>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
