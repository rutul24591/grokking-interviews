"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-frontend-performance-architecture",
  title: "Frontend Performance Architecture",
  description:
    "Production-grade frontend performance covering Core Web Vitals (LCP, INP, CLS), bundle optimization and code splitting, image and font loading strategies, runtime performance patterns, and measurement with RUM and Lighthouse CI.",
  category: "low-level-design",
  subcategory: "architecture-system-level-lld",
  slug: "frontend-performance-architecture",
  wordCount: 5500,
  readingTime: 33,
  lastUpdated: "2026-05-16",
  tags: ["performance", "core-web-vitals", "lcp", "inp", "cls", "bundle-optimization", "lld"],
};

export default function FrontendPerformanceArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        Frontend performance is not about making things feel fast — it is about measurable, quantified improvements
        to specific metrics that correlate with user behavior and revenue. At FAANG scale, a 100 ms improvement in
        LCP correlates with a 1–2% conversion rate increase. Staff-level engineers are expected to know not just
        the techniques but the metrics, the thresholds, the tooling, and how to diagnose performance problems
        systematically rather than guessing.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/architecture-system-level-lld/frontend-performance-architecture.svg"
        alt="Frontend performance architecture diagram"
        caption="Core Web Vitals, bundle optimization, image/font loading, and runtime performance measurement"
      />

      <h2>Core Web Vitals</h2>
      <p>
        Google's Core Web Vitals are the industry-standard performance metrics for user experience. They are measured
        in field data (real users) via the Chrome User Experience Report (CrUX) and directly affect Google Search
        ranking. Understanding them at a mechanical level — not just the threshold numbers — is expected at
        staff level.
      </p>

      <h3>LCP — Largest Contentful Paint</h3>
      <p>
        LCP measures the time from navigation start until the largest visible content element finishes rendering.
        "Largest" is measured by element area in the viewport. The qualifying elements are: images, video poster
        frames, block-level text, and background images loaded via CSS.
      </p>
      <p>
        <strong>Threshold:</strong> Good &lt;2.5 s | Needs improvement 2.5–4.0 s | Poor &gt;4.0 s
      </p>
      <p>
        <strong>LCP candidates are almost always:</strong> The hero image above the fold (product photo, banner),
        or the largest text block if no image is present. Identify the LCP element in Chrome DevTools Performance
        tab (look for the purple LCP marker) or in Lighthouse.
      </p>
      <p>
        <strong>LCP optimization playbook:</strong>
      </p>
      <ul>
        <li>
          <strong>Preload the LCP resource:</strong> Add <code>&lt;link rel="preload" as="image"&gt;</code> in the
          document head for the LCP image. This moves the image discovery from whenever the parser encounters the
          <code>&lt;img&gt;</code> tag to immediately. In Next.js, use <code>priority={true}</code> on the Image
          component — it automatically generates a preload tag.
        </li>
        <li>
          <strong>Eliminate render-blocking resources:</strong> CSS in the <code>&lt;head&gt;</code> blocks rendering.
          Inline critical CSS (above-the-fold styles) and defer the rest with <code>media="print" onload</code>
          trick or use a critical CSS extractor (Critters, Penthouse). Move non-critical scripts to
          <code>defer</code> or <code>async</code>.
        </li>
        <li>
          <strong>Serve from the edge:</strong> If the HTML takes 800 ms to arrive from a distant origin, LCP cannot
          be fast regardless of image optimization. Deploy SSR at the CDN edge to reduce TTFB to under 200 ms.
        </li>
        <li>
          <strong>Image format and size:</strong> Use AVIF (50% smaller than JPEG) or WebP (30% smaller) with a
          JPEG fallback. Serve at the exact display size — a 2400px image in a 400px container wastes 36× the
          bandwidth needed.
        </li>
        <li>
          <strong>No lazy loading on LCP element:</strong> Never put <code>loading="lazy"</code> on the hero image.
          It delays the browser from discovering and fetching the image until it is in the viewport — which it already
          is, defeating the optimization.
        </li>
      </ul>

      <h3>INP — Interaction to Next Paint</h3>
      <p>
        INP (replacing FID in 2024) measures the latency of all user interactions (clicks, key presses, taps) during
        the page lifetime, reporting the 98th percentile. It captures the full interaction: the time from the user
        event until the next frame is painted.
      </p>
      <p>
        <strong>Threshold:</strong> Good &lt;200 ms | Needs improvement 200–500 ms | Poor &gt;500 ms
      </p>
      <p>
        <strong>Root cause of poor INP:</strong> Long tasks on the main thread blocking the browser from processing
        the event and painting. A "long task" is any synchronous work that takes more than 50 ms. Sources:
        JavaScript execution (framework reconciliation, complex computations), layout thrash (forcing layout in a loop),
        large paint areas.
      </p>
      <p>
        <strong>INP optimization playbook:</strong>
      </p>
      <ul>
        <li>
          <strong>Break long tasks:</strong> Use <code>scheduler.yield()</code> (or <code>setTimeout(0)</code> as
          fallback) to yield control back to the browser between chunks of work. A 300 ms synchronous task becomes
          three 100 ms tasks with yields in between — the browser can paint between each chunk.
        </li>
        <li>
          <strong>Move computation off main thread:</strong> Use Web Workers for expensive operations — JSON parsing,
          filtering large arrays, image manipulation, compression. The worker runs on a separate thread; the main
          thread stays responsive.
        </li>
        <li>
          <strong>Debounce and throttle:</strong> Keypress handlers that trigger search, resize handlers that trigger
          layout, scroll handlers that trigger parallax effects — all must be debounced or throttled to avoid
          per-keystroke or per-frame work.
        </li>
        <li>
          <strong>React rendering:</strong> Large React trees reconcile synchronously. Use <code>React.memo</code>,
          <code>useMemo</code>, and <code>useCallback</code> to prevent unnecessary reconciliation. Use
          <code>startTransition</code> to mark non-urgent updates — React defers them and yields to browser events.
        </li>
        <li>
          <strong>Avoid layout thrash:</strong> Never read layout properties (offsetWidth, getBoundingClientRect)
          and then write DOM properties in the same synchronous block. Batch all reads before all writes, or use
          <code>requestAnimationFrame</code>.
        </li>
      </ul>

      <h3>CLS — Cumulative Layout Shift</h3>
      <p>
        CLS measures unexpected layout shifts — elements moving while the user is reading or interacting. Each shift
        is scored as the product of the impact fraction (how much of the viewport shifted) and the distance fraction
        (how far elements moved). CLS is the sum of all shift scores.
      </p>
      <p>
        <strong>Threshold:</strong> Good &lt;0.1 | Needs improvement 0.1–0.25 | Poor &gt;0.25
      </p>
      <p>
        <strong>CLS causes and fixes:</strong>
      </p>
      <ul>
        <li>
          <strong>Images without dimensions:</strong> The browser doesn't know the image's aspect ratio until it loads,
          so it gives it zero height initially, then shifts layout when the image arrives. Fix: always include
          <code>width</code> and <code>height</code> attributes on <code>&lt;img&gt;</code>, or use
          <code>aspect-ratio: auto</code> in CSS. Next.js Image component handles this automatically.
        </li>
        <li>
          <strong>Web font Flash of Unstyled Text (FOUT):</strong> When a web font loads, the fallback font is swapped
          out — if the two fonts have different metrics, text reflows. Fix: <code>font-display: optional</code> (never
          swaps, uses fallback if font not ready) or <code>size-adjust</code> + <code>ascent-override</code> to match
          fallback font metrics exactly.
        </li>
        <li>
          <strong>Dynamic content insertion:</strong> Injecting a cookie banner, an alert, or an ad above existing
          content pushes everything down. Fix: reserve space for these elements (a placeholder div of fixed height)
          before the content loads, so no shift occurs when they appear.
        </li>
        <li>
          <strong>Animations that shift layout:</strong> Animating <code>height</code>, <code>margin</code>,
          <code>top</code>, or <code>left</code> causes layout and CLS. Use <code>transform: translate()</code> and
          <code>opacity</code> instead — they run on the compositor thread with zero CLS impact.
        </li>
      </ul>

      <HighlightBlock as="p" tier="crucial">
        CLS is the most counterintuitive CWV. A site can have fast LCP and low INP but catastrophic CLS from a
        dynamically injected banner. Always reserve space for dynamic content before it arrives.
      </HighlightBlock>

      <h2>Bundle Optimization</h2>

      <h3>Code Splitting Strategy</h3>
      <p>
        The initial JavaScript bundle size is the single largest controllable factor in LCP (blocks parsing) and
        overall load time. The target is under 170 KB gzipped for the initial bundle — beyond this threshold,
        mobile devices on 3G take over 3 seconds to parse and execute.
      </p>
      <p>
        Code splitting layers:
      </p>
      <ul>
        <li>
          <strong>Route-based splitting:</strong> Each route is a separate chunk loaded on demand. In Next.js
          (App Router), this is automatic — each page is its own chunk. In React Router, use
          <code>React.lazy(() =&gt; import('./CheckoutPage'))</code> per route.
        </li>
        <li>
          <strong>Component-based splitting:</strong> Heavy components (rich text editors, map libraries, PDF viewers,
          chart libraries) are imported with <code>dynamic()</code> in Next.js or <code>React.lazy()</code>. They
          load only when rendered — not on initial page load.
        </li>
        <li>
          <strong>Vendor chunk separation:</strong> Separate the stable vendor libraries (React, routing) from
          application code. The vendor chunk changes rarely and can be cached long-term. Application code changes on
          every deploy but is smaller.
        </li>
        <li>
          <strong>Shared chunk extraction:</strong> Code shared by multiple routes (shared utilities, shared
          components) is extracted into a separate chunk. Without this, shared code is duplicated in each route chunk.
        </li>
      </ul>

      <h3>Tree Shaking</h3>
      <p>
        Tree shaking eliminates unused exports from the final bundle. Requirements: ES module syntax (import/export),
        not CommonJS (require/module.exports). Mark side-effect-free packages in <code>package.json</code> with
        <code>"sideEffects": false</code> — this tells webpack it can safely drop unused exports from the package.
      </p>
      <p>
        Common tree shaking failures:
      </p>
      <ul>
        <li>
          <strong>Barrel imports:</strong> <code>import {'{'} Button, Input, Modal {'}'} from '@/components'</code>
          with a barrel <code>index.ts</code> that re-exports everything causes webpack to import the entire component
          library. Use direct imports: <code>import Button from '@/components/Button'</code>.
        </li>
        <li>
          <strong>Lodash:</strong> <code>import _ from 'lodash'</code> imports all 70 KB of lodash. Use
          <code>import debounce from 'lodash-es/debounce'</code> (ESM version) for proper tree shaking.
        </li>
        <li>
          <strong>moment.js:</strong> 232 KB uncompressed, includes all locale data. Replace with
          <code>date-fns</code> (modular, tree-shakeable) or the native <code>Intl.DateTimeFormat</code> API.
        </li>
      </ul>

      <h3>Bundle Analysis</h3>
      <p>
        Use webpack-bundle-analyzer or Next.js's built-in bundle analyzer (<code>ANALYZE=true pnpm build</code>) to
        visualize what's in each chunk. Key questions: Why is this chunk so large? What is this library doing in the
        initial bundle? Are any packages duplicated across chunks?
      </p>

      <h2>Image Optimization</h2>

      <h3>Format Selection</h3>
      <p>
        Image format selection is the highest-leverage image optimization: switching from JPEG to AVIF typically
        reduces file size by 40–60% at the same visual quality. Browser support as of 2025: AVIF is supported in
        all major browsers. Always provide a JPEG fallback for older browsers using the HTML
        <code>&lt;picture&gt;</code> element with multiple sources.
      </p>

      <h3>Responsive Images</h3>
      <p>
        The browser selects the appropriate image resolution for the current display using the <code>srcset</code>
        and <code>sizes</code> attributes. The <code>srcset</code> lists available sizes; <code>sizes</code> tells
        the browser how wide the image will be rendered at each viewport breakpoint. Without <code>sizes</code>,
        the browser defaults to 100vw — it will download the largest image for high-DPI screens even if the image
        renders at 400px.
      </p>

      <h3>Lazy Loading</h3>
      <p>
        Images below the fold should use <code>loading="lazy"</code>. The browser defers their download until they
        are near the viewport (approximately 1200px below the fold on Chrome). This reduces the data transferred on
        initial load for pages with many images. Never use lazy loading on the LCP element.
      </p>

      <h3>Blur Placeholder</h3>
      <p>
        A blurred low-quality image placeholder (LQIP) is generated at build time — typically an 8×8 pixel version
        of the image encoded as base64. It is inlined in the HTML and shown immediately as a placeholder. When the
        full-resolution image loads, it fades in over the placeholder. This eliminates layout shift (the space is
        reserved) and provides visual progress feedback. Next.js Image component implements this with
        <code>placeholder="blur"</code>.
      </p>

      <h2>Font Loading Optimization</h2>
      <p>
        Web fonts are a common source of CLS, render blocking, and layout instability. The optimal strategy depends on
        whether the font is self-hosted or served from Google Fonts/Adobe Fonts.
      </p>
      <ul>
        <li>
          <strong>Self-host fonts:</strong> Hosting your own fonts eliminates the third-party DNS lookup and connection
          overhead (typically 100–300 ms). In Next.js, use the built-in font optimization which downloads Google Fonts
          at build time and self-hosts them.
        </li>
        <li>
          <strong>font-display: swap:</strong> Shows the fallback font immediately and swaps to the web font when
          ready. Eliminates invisible text (FOIT) but causes layout shift on swap.
        </li>
        <li>
          <strong>font-display: optional:</strong> Uses the web font only if it is available immediately (e.g., from
          cache); falls back to the system font permanently if not. Zero CLS, zero FOIT. Best for body text where
          pixel-perfect typography matters less than stability. Not suitable for brand-critical display fonts.
        </li>
        <li>
          <strong>Font metric adjustment:</strong> CSS <code>size-adjust</code>, <code>ascent-override</code>,
          and <code>descent-override</code> adjust the fallback font to match the web font's metrics. When the swap
          happens, text occupies the same space — zero layout shift. Chrome DevTools has a font metric override tool
          to find the correct values.
        </li>
        <li>
          <strong>Unicode-range subsetting:</strong> If serving Latin-only content, restrict the font download to
          the Latin character range. A full web font including CJK glyphs is 2+ MB; the Latin subset is under 30 KB.
        </li>
      </ul>

      <h2>Runtime Performance</h2>

      <h3>List Virtualization</h3>
      <p>
        Rendering 10,000 list items creates 10,000 DOM nodes — each with layout, paint, and memory cost. Even
        with efficient React rendering, this causes janky scrolling and high memory usage. Virtualization renders
        only the visible rows plus a small overscan buffer (typically ±5 rows):
      </p>
      <p>
        Libraries: <code>@tanstack/react-virtual</code> (lightweight, headless), <code>react-window</code> (simple),
        <code>react-virtuoso</code> (dynamic heights, grouping). The virtualizer measures the container height,
        calculates which rows are visible based on scroll position, and renders only those rows — positioned with
        absolute coordinates within the container.
      </p>

      <h3>React Rendering Optimization</h3>
      <p>
        React re-renders a component whenever its props or state change. In large trees, unnecessary re-renders
        compound into noticeable frame drops. The optimization toolkit:
      </p>
      <ul>
        <li>
          <strong>React.memo:</strong> Wraps a component in a shallow-equal comparison. If props are reference-equal
          to the previous render, the component is skipped. Most effective for leaf components that render frequently
          with stable props.
        </li>
        <li>
          <strong>useMemo:</strong> Memoizes the result of an expensive computation. Only recalculates when
          dependencies change. Use for: sorting/filtering large arrays, computing derived data, building complex
          objects passed as props.
        </li>
        <li>
          <strong>useCallback:</strong> Memoizes a function reference. Essential when passing callbacks to
          memoized child components — without it, a new function reference is created on every render, invalidating
          the memo.
        </li>
        <li>
          <strong>startTransition:</strong> Marks a state update as non-urgent. React yields to user events during
          the update, keeping the UI responsive. Use for: search result updates, tab switching, filter changes.
        </li>
        <li>
          <strong>State colocation:</strong> Keep state as close to its consumer as possible. State at the top of a
          large tree triggers re-renders across the entire tree. Split into multiple smaller state atoms with Zustand
          or Jotai for fine-grained subscriptions.
        </li>
      </ul>

      <HighlightBlock as="p" tier="important">
        Premature optimization with React.memo/useMemo/useCallback is a common antipattern. Memoization has a cost —
        the comparison work. Profile first with React DevTools Profiler to identify actual slow renders before adding
        memoization. The Profiler's "Ranked" view shows which components take the most time.
      </HighlightBlock>

      <h3>Web Workers for Heavy Computation</h3>
      <p>
        The main thread handles rendering, event handling, and JavaScript execution. Blocking it with expensive
        computation directly impacts INP. Web Workers run on separate threads with access to a subset of Web APIs
        (no DOM, no window). Use them for:
      </p>
      <ul>
        <li>Parsing large JSON or CSV files</li>
        <li>Image processing (resize, filter, compression via Canvas in OffscreenCanvas)</li>
        <li>Cryptographic operations (hashing, encryption)</li>
        <li>Full-text search over large local datasets</li>
        <li>Running machine learning inference (TensorFlow.js)</li>
      </ul>
      <p>
        Communication is via <code>postMessage</code> / <code>onmessage</code>. For structured data passing, use
        Transferable objects (ArrayBuffer) which transfer ownership to the worker without copying — zero-copy
        transfer is critical for large binary data.
      </p>

      <h2>Performance Measurement and Budgets</h2>

      <h3>Real User Monitoring (RUM)</h3>
      <p>
        Lab data (Lighthouse, WebPageTest) measures performance on a controlled machine with a simulated connection.
        Field data (RUM) measures what real users experience on real devices, real networks, and real geographic
        locations. Field data consistently shows worse performance than lab data — real users have slower CPUs,
        competing background processes, and variable network conditions.
      </p>
      <p>
        The <code>web-vitals</code> library from Google captures CWV from the browser's performance APIs:
      </p>
      <p>
        Each metric callback fires with the measured value. Report to your analytics system or a dedicated RUM service
        (Datadog RUM, Sentry Performance, New Relic Browser). Track P75 (75th percentile) — Google's CWV thresholds
        are defined at P75, not the median.
      </p>

      <h3>Performance Budget</h3>
      <p>
        A performance budget is a set of thresholds that the CI pipeline enforces. If a PR causes any metric to
        exceed the budget, the build fails. Common budget dimensions:
      </p>
      <ul>
        <li><strong>Total JavaScript:</strong> &lt;300 KB gzipped (initial load)</li>
        <li><strong>Initial bundle:</strong> &lt;170 KB gzipped</li>
        <li><strong>Largest image:</strong> &lt;200 KB</li>
        <li><strong>Total page weight:</strong> &lt;1.5 MB</li>
        <li><strong>Lighthouse Performance score:</strong> &gt;90</li>
        <li><strong>LCP (lab):</strong> &lt;2.5 s on simulated 4G</li>
      </ul>
      <p>
        Implement with Lighthouse CI: run Lighthouse on each PR in CI, compare results against the budget defined
        in <code>lighthouserc.js</code>, fail the pipeline if any assertion fails. This prevents performance
        regressions from reaching production undetected.
      </p>

      <h3>Profiling Workflow</h3>
      <p>
        When a performance regression is reported:
      </p>
      <ol>
        <li>
          <strong>Identify the affected metric:</strong> Check CrUX data (Search Console) or your RUM dashboard
          to confirm which CWV degraded and when it started.
        </li>
        <li>
          <strong>Reproduce in Chrome DevTools:</strong> Open Performance tab, set CPU throttle to 4×, network
          throttle to "Slow 4G", record a page load. Look for: long tasks (red marks), render-blocking resources,
          the LCP element and what delayed it, layout shifts and their causes.
        </li>
        <li>
          <strong>Bundle analysis:</strong> Run the bundle analyzer to identify any new large dependencies added
          since the regression started.
        </li>
        <li>
          <strong>Fix, measure, verify:</strong> Apply the fix, verify with Lighthouse in the same conditions,
          deploy, and confirm RUM improves over 24–48 hours (CrUX data has a 28-day rolling window — improvements
          take time to show in Search Console).
        </li>
      </ol>

      <h2>Interview Q&A</h2>

      <h3>Q: Your LCP is 4.2 seconds. Walk me through how you would diagnose and fix it.</h3>
      <p>
        First, identify the LCP element using Chrome DevTools Performance tab or Lighthouse — it will label the LCP
        candidate. Common LCP elements: hero image, h1 text, video poster.
      </p>
      <p>
        Then trace the cause using the Performance waterfall:
      </p>
      <ul>
        <li>
          <strong>High TTFB (&gt;600 ms):</strong> The server or CDN is slow. Fix: enable edge caching, move SSR
          to edge, add a CDN. This is the most common cause at 4+ second LCP.
        </li>
        <li>
          <strong>Image discovered late:</strong> The LCP image is not in the initial HTML (it's injected by
          JavaScript, or it's a CSS background). The browser can't discover it until JS executes. Fix: put the LCP
          image in the initial HTML with a <code>preload</code> tag. Or, move the image from CSS background to an
          <code>&lt;img&gt;</code> tag.
        </li>
        <li>
          <strong>Image download takes long:</strong> The image is not compressed, not in a modern format, or not
          served from a CDN. Fix: serve AVIF/WebP, resize to display dimensions, serve from CDN close to users.
        </li>
        <li>
          <strong>Render blocked by CSS/JS:</strong> Large CSS files in head, synchronous JS before LCP content.
          Fix: inline critical CSS, defer non-critical CSS, move scripts to defer/async.
        </li>
      </ul>

      <h3>Q: How do you fix an INP of 600 ms on a search results page?</h3>
      <p>
        An INP of 600 ms means some user interaction takes 600 ms between the event and the next paint. First,
        identify which interaction using Chrome DevTools → Performance tab → record user interactions → look for
        long tasks triggered by interactions.
      </p>
      <p>
        For a search results page, the likely culprit is the keypress/input handler:
      </p>
      <ul>
        <li>
          <strong>Not debounced:</strong> Every keystroke triggers a search fetch and a full results re-render. Add
          300 ms debounce on the input handler.
        </li>
        <li>
          <strong>Synchronous large re-render:</strong> Updating results causes React to synchronously reconcile a
          large component tree. Wrap the state update in <code>startTransition</code> — React will yield to user
          events during the reconciliation, keeping the input responsive.
        </li>
        <li>
          <strong>Too many DOM nodes:</strong> 500 result items renders 500+ DOM nodes. Use virtualization to
          render only the visible ~20 results.
        </li>
        <li>
          <strong>Expensive computations on filter change:</strong> Client-side filtering of 10k items synchronously.
          Move to a Web Worker.
        </li>
      </ul>

      <h3>Q: A product manager asks why adding a cookie consent banner hurt Search Console performance. Explain and fix it.</h3>
      <p>
        The cookie consent banner appeared above the page content when it loaded, pushing everything below it down
        by the banner's height. This creates a layout shift — the impact fraction is large (the entire page content
        moved), so the CLS score spikes significantly.
      </p>
      <p>
        Fix options in order of preference:
      </p>
      <ol>
        <li>
          <strong>Reserve space upfront:</strong> Add a fixed-height <code>&lt;div&gt;</code> placeholder at the top
          of the page (same height as the banner) in the initial HTML. The banner fills this space when it loads —
          no shift occurs because the space was already allocated. When the user accepts/dismisses, animate the
          banner out, then remove the placeholder (this causes a shift, but it's a user-expected interaction shift
          which does not count toward CLS).
        </li>
        <li>
          <strong>Fixed positioning:</strong> Position the banner with <code>position: fixed</code> at the bottom of
          the viewport. A fixed element does not affect document flow — other content does not shift when it appears.
          Ensure the banner does not overlap main content (add padding-bottom to the page equal to the banner height).
        </li>
        <li>
          <strong>Check if shift is a "user interaction shift":</strong> If the banner appears only after a user
          interaction (clicking a cookie settings link), that shift is excluded from CLS by the browser's
          interaction window heuristic. Re-triggering the banner from a user click avoids CLS.
        </li>
      </ol>

      <h3>Q: Design a performance monitoring system for a high-traffic e-commerce frontend.</h3>
      <p>
        The monitoring system has three tiers:
      </p>
      <p>
        <strong>Tier 1 — Real User Monitoring:</strong> Instrument the production application with the web-vitals
        library. On each metric observation, POST to an analytics endpoint with the metric name, value, rating
        (good/needs-improvement/poor), URL, connection type, device memory, and user ID (or anonymous session ID).
        Store in a time-series database (ClickHouse or BigQuery for scale). Dashboard shows P75 per metric per
        page type (product page vs category page vs checkout) over time.
      </p>
      <p>
        <strong>Tier 2 — Synthetic Monitoring:</strong> Run Lighthouse CI on every deployment and on a schedule (every
        6 hours) from a controlled environment. Alert on any metric that degrades more than 10% from the baseline.
        This catches regressions before they reach many real users, and separates performance regressions from network
        variance in RUM data.
      </p>
      <p>
        <strong>Tier 3 — Alerts and Incident Response:</strong> Alert when the P75 LCP in RUM exceeds 3.0 s for
        more than 10 consecutive minutes on the product page (to avoid noise from spikes). Alert when INP P75
        exceeds 400 ms. Page the on-call engineer with a dashboard link, the affected pages, and the RUM data
        showing when the degradation started — which correlates with the deployment that caused it.
      </p>
    </ArticleLayout>
  );
}
