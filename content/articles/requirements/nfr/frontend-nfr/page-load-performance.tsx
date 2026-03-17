"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-page-load-performance",
  title: "Page Load Performance",
  description: "Comprehensive guide to frontend page load performance optimization, covering metrics, strategies, trade-offs, RUM, and production patterns for staff/principal engineer interviews.",
  category: "frontend",
  subcategory: "nfr",
  slug: "page-load-performance",
  version: "extensive",
  wordCount: 15000,
  readingTime: 60,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "performance", "page-load", "web-vitals", "optimization", "rum"],
  relatedTopics: ["perceived-performance", "rendering-strategy", "web-vitals", "critical-css"],
};

export default function PageLoadPerformanceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Page Load Performance</strong> refers to the measurable speed at which a web page becomes
          fully interactive and usable for the end user. It encompasses the entire journey from the moment
          a user initiates navigation (typing a URL, clicking a link) to when the page is completely rendered,
          interactive, and perceived as "loaded" by the user.
        </p>
        <p>
          In the context of system design interviews, page load performance is not just a frontend concern — it's
          a critical non-functional requirement (NFR) that directly impacts business metrics. Studies by Google,
          Amazon, and Walmart consistently demonstrate that every 100ms improvement in load time correlates with
          measurable increases in conversion rates, user engagement, and revenue. For example, Walmart found that
          for every 1 second of improvement in page load time, conversions increased by 2%. Pinterest reduced
          perceived wait time by 40% and saw a 15% increase in SEO traffic and 10% increase in signups.
        </p>
        <p>
          Page load performance has evolved significantly over the past decade. In the early 2010s, pages were
          relatively simple, and load times under 3 seconds were acceptable. Today, with the rise of complex
          single-page applications (SPAs), JavaScript-heavy frameworks, and mobile-first experiences (often on
          3G/4G networks), the bar has been raised. Google's Core Web Vitals initiative (launched in 2020, updated
          in 2024) established industry-standard thresholds: Largest Contentful Paint (LCP) under 2.5 seconds,
          First Input Delay (FID) under 100ms (now replaced by Interaction to Next Paint — INP — under 200ms),
          and Cumulative Layout Shift (CLS) under 0.1.
        </p>
        <p>
          For staff and principal engineers, understanding page load performance requires a holistic view that
          spans multiple layers: network protocols (HTTP/2, HTTP/3, QUIC), server-side optimization (edge caching,
          CDN strategy, server response times), frontend architecture (rendering strategy, code splitting, lazy
          loading), browser internals (critical rendering path, paint timing, main thread scheduling), and
          real-user monitoring (RUM) to measure actual performance in production.
        </p>
      </section>

      <section>
        <h2>The Critical Rendering Path</h2>
        <p>
          To optimize page load performance, you must first understand how browsers construct and render pages.
          The <strong>Critical Rendering Path (CRP)</strong> is the sequence of steps the browser takes to convert
          HTML, CSS, and JavaScript into pixels on the screen. Optimizing this path is fundamental to improving
          load performance.
        </p>
        <p>
          The CRP consists of six key stages:
        </p>
        <ul>
          <li>
            <strong>1. HTML Parsing → DOM Construction:</strong> The browser parses HTML and builds the Document
            Object Model (DOM), a tree representation of all HTML elements. HTML parsing is incremental — the
            browser doesn't wait for the entire HTML document to arrive before starting.
          </li>
          <li>
            <strong>2. CSS Parsing → CSSOM Construction:</strong> Simultaneously, the browser parses CSS and builds
            the CSS Object Model (CSSOM), which contains styling information for every DOM node. Unlike HTML, CSS
            is render-blocking — the browser waits for all CSS to arrive before rendering.
          </li>
          <li>
            <strong>3. DOM + CSSOM → Render Tree:</strong> The browser combines the DOM and CSSOM to create the
            render tree, which contains only visible elements (excluding {'<head>'}, {'<script>'}, elements with
            display: none, etc.).
          </li>
          <li>
            <strong>4. Layout (Reflow):</strong> The browser calculates the exact position and size of every visible
            element based on the viewport dimensions. This process, called layout or reflow, determines where each
            element appears on screen.
          </li>
          <li>
            <strong>5. Paint:</strong> The browser fills in pixels — colors, text, images, shadows, borders — based
            on the render tree and layout information. This is the actual rendering step.
          </li>
          <li>
            <strong>6. Composite:</strong> For pages with multiple layers (e.g., fixed-position elements, video,
            WebGL), the browser composites layers together in the correct order to produce the final frame.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/critical-rendering-path.svg"
          alt="Critical Rendering Path Diagram"
          caption="The Critical Rendering Path — showing how HTML and CSS are transformed into pixels on screen through DOM, CSSOM, Render Tree, Layout, Paint, and Composite stages"
        />

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Key Insight: Render-Blocking Resources</h3>
          <p>
            CSS is always render-blocking — the browser won't render anything until it has the complete CSSOM.
            JavaScript is parser-blocking — when the HTML parser encounters a {'<script>'} tag, it pauses HTML
            parsing, downloads and executes the script, then resumes parsing. Understanding this blocking behavior
            is crucial for optimization.
          </p>
        </div>

        <p>
          The goal of page load optimization is to minimize the time spent in each stage and eliminate unnecessary
          blocking. This means: reducing HTML/CSS/JS payload sizes, deferring non-critical JavaScript, inlining
          critical CSS, and prioritizing above-the-fold content.
        </p>
      </section>

      <section>
        <h2>Page Load Performance Metrics</h2>
        <p>
          You can't optimize what you can't measure. Page load performance is quantified through a hierarchy of
          metrics, each capturing a different aspect of the user's experience.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Navigation Timing API — The Foundation</h3>
          <p>
            The Navigation Timing API (W3C Recommendation) provides high-resolution timestamps for key events
            during page load. These timestamps form the basis for all derived metrics:
          </p>
          <ul className="mt-3 space-y-2">
            <li><code>navigationStart</code> — Previous page unload ends, or navigation begins</li>
            <li><code>fetchStart</code> — Browser starts fetching the HTML document</li>
            <li><code>domainLookupStart/End</code> — DNS lookup timing</li>
            <li><code>connectStart/End</code> — TCP connection establishment</li>
            <li><code>secureConnectionStart</code> — SSL/TLS handshake begins</li>
            <li><code>requestStart</code> — Browser sends HTTP request</li>
            <li><code>responseStart</code> — First byte of response arrives (TTFB)</li>
            <li><code>responseEnd</code> — Last byte of HTML received</li>
            <li><code>domLoading</code> — DOM construction begins</li>
            <li><code>domInteractive</code> — DOM parsing complete, scripts can execute</li>
            <li><code>domContentLoadedEventStart/End</code> — DOMContentLoaded event</li>
            <li><code>loadEventStart/End</code> — Page load complete</li>
          </ul>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Traditional Load Metrics</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Metric</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Good Threshold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>TTFB (Time to First Byte)</strong></td>
              <td className="p-3">Time from navigation start to first byte of HTML received. Measures server responsiveness + network latency.</td>
              <td className="p-3">{'<'} 600ms</td>
            </tr>
            <tr>
              <td className="p-3"><strong>FP (First Paint)</strong></td>
              <td className="p-3">Time when browser renders first pixel. Often just background color or default UI.</td>
              <td className="p-3">{'<'} 1.5s</td>
            </tr>
            <tr>
              <td className="p-3"><strong>FCP (First Contentful Paint)</strong></td>
              <td className="p-3">Time when first meaningful content (text, image, canvas) is rendered.</td>
              <td className="p-3">{'<'} 1.8s</td>
            </tr>
            <tr>
              <td className="p-3"><strong>DOMContentLoaded</strong></td>
              <td className="p-3">Time when HTML is fully parsed and DOM is ready (scripts can safely manipulate DOM).</td>
              <td className="p-3">{'<'} 2.5s</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Load Event</strong></td>
              <td className="p-3">Time when all resources (images, stylesheets, scripts) are fully loaded.</td>
              <td className="p-3">{'<'} 4s</td>
            </tr>
            <tr>
              <td className="p-3"><strong>TTI (Time to Interactive)</strong></td>
              <td className="p-3">Time when page becomes fully interactive (main thread is idle for 5+ seconds).</td>
              <td className="p-3">{'<'} 3.8s</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Core Web Vitals (2024+)</h3>
        <p>
          Google's Core Web Vitals are the industry standard for page load performance. They focus on three
          dimensions of user experience:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>LCP (Largest Contentful Paint):</strong> Measures loading performance. The time when the
            largest image or text block visible in the viewport is rendered. <strong>Target: {'<'} 2.5s</strong>
          </li>
          <li>
            <strong>INP (Interaction to Next Paint):</strong> Measures interactivity and responsiveness. The
            longest interaction delay observed during the page lifecycle. Replaced FID in March 2024.
            <strong>Target: {'<'} 200ms</strong>
          </li>
          <li>
            <strong>CLS (Cumulative Layout Shift):</strong> Measures visual stability. The sum of all unexpected
            layout shifts during page load. <strong>Target: {'<'} 0.1</strong>
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/page-load-timeline.svg"
          alt="Page Load Performance Timeline"
          caption="Page Load Performance Timeline — showing when each metric (TTFB, FP, FCP, LCP, TTI, Load Event) occurs during page load with Google's threshold zones"
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Why Core Web Vitals Matter for Interviews</h3>
          <p>
            In staff/principal engineer interviews, you're expected to discuss performance in terms of business
            impact, not just technical metrics. Core Web Vitals are tied to Google search ranking — poor scores
            directly impact SEO and organic traffic. When discussing page load performance, always connect
            technical metrics to user experience and business outcomes.
          </p>
        </div>
      </section>

      <section>
        <h2>Optimization Strategies</h2>
        <p>
          Page load performance optimization is a multi-layered effort. The strategies below are organized by
          the layer they target, from network-level optimizations down to browser rendering.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">1. Network Layer Optimizations</h3>
        <p>Reduce latency and maximize throughput at the network level:</p>
        <ul className="space-y-3">
          <li>
            <strong>Use a CDN (Content Delivery Network):</strong> Serve static assets from edge locations close
            to users. CDNs reduce round-trip time (RTT) by caching assets geographically closer to users. Popular
            options: Cloudflare, Fastly, AWS CloudFront, Akamai. For dynamic content, use CDN with origin shield
            and intelligent caching rules.
          </li>
          <li>
            <strong>Enable HTTP/2 or HTTP/3:</strong> HTTP/2 introduces multiplexing (multiple requests over a
            single connection), header compression (HPACK), and server push. HTTP/3 (QUIC) further reduces latency
            by using UDP instead of TCP, eliminating head-of-line blocking. Most modern browsers support both.
          </li>
          <li>
            <strong>Implement Connection Reuse:</strong> Use <code>keep-alive</code> headers to reuse TCP
            connections across multiple requests. This avoids the overhead of TCP handshake (3-way handshake = 1.5
            × RTT) and TLS negotiation (2+ RTT for handshake).
          </li>
          <li>
            <strong>Reduce DNS Lookups:</strong> DNS resolution adds latency (typically 20-120ms). Use DNS prefetch
            (<code>{'<link rel="dns-prefetch" href="//cdn.example.com">'}</code>) for third-party domains.
            Consolidate assets under fewer domains to minimize unique DNS lookups.
          </li>
          <li>
            <strong>Enable Compression:</strong> Use Brotli (preferred) or Gzip for text-based resources (HTML,
            CSS, JS, JSON). Brotli provides 15-25% better compression than Gzip but requires more CPU. Typical
            compression ratios: 70-90% for text, 20-30% for already-compressed images.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">2. Server-Side Optimizations</h3>
        <p>Optimize server response time and initial payload:</p>
        <ul className="space-y-3">
          <li>
            <strong>Minimize TTFB:</strong> TTFB should be under 600ms. Optimize backend processing: use caching
            (Redis, Memcached), optimize database queries, use connection pooling, and consider edge computing
            (Cloudflare Workers, AWS Lambda@Edge) to run logic closer to users.
          </li>
          <li>
            <strong>Implement Server-Side Rendering (SSR):</strong> For content-heavy pages, SSR sends fully
            rendered HTML, improving FCP and LCP. Frameworks like Next.js, Nuxt, and SvelteKit make SSR
            straightforward. Trade-off: increased server load and complexity.
          </li>
          <li>
            <strong>Use Static Site Generation (SSG):</strong> For pages that don't change frequently, pre-render
            HTML at build time. This eliminates server processing entirely — the CDN serves static HTML. Ideal
            for blogs, documentation, marketing pages.
          </li>
          <li>
            <strong>Enable Early Hints:</strong> HTTP 103 Early Hints allow the server to send Link headers
            (preload, prefetch) before the full response is ready. This lets the browser start downloading
            critical resources while the server is still generating the HTML.
          </li>
          <li>
            <strong>Implement Streaming SSR:</strong> Instead of waiting for the entire page to render on the
            server, stream HTML chunks as they're ready. React 18+ supports streaming with Suspense boundaries.
            This improves perceived performance by showing content progressively.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">3. HTML Optimization</h3>
        <p>Structure HTML to prioritize critical content:</p>
        <ul className="space-y-3">
          <li>
            <strong>Inline Critical CSS:</strong> Extract CSS required for above-the-fold content and inline it
            in the {'<head>'}. This eliminates render-blocking for critical styles. Tools: Critical, Penthouse,
            or build plugins (webpack, Vite). Defer non-critical CSS using{' '}
            <code>{'<link rel="stylesheet" href="styles.css" media="print" onload="this.media=\'all\'">'}</code>.
          </li>
          <li>
            <strong>Defer Non-Critical JavaScript:</strong> Use <code>defer</code> or <code>async</code> attributes
            on {'<script>'} tags. <code>defer</code> downloads script in parallel and executes after HTML parsing.
            <code>async</code> downloads in parallel and executes immediately (may block parsing). Never use
            synchronous scripts in the head.
          </li>
          <li>
            <strong>Preload Critical Resources:</strong> Use <code>{'<link rel="preload" as="script" href="...">'}</code>
            to hint the browser to download critical resources early. Common use cases: hero images, web fonts,
            critical JavaScript bundles. Don't overuse — preload only what's needed for initial render.
          </li>
          <li>
            <strong>Remove Unused HTML:</strong> Eliminate unnecessary elements, comments, and whitespace. Minify
            HTML in production (html-minifier-terser). Typical savings: 5-15% reduction in HTML size.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">4. CSS Optimization</h3>
        <p>Reduce CSS blocking and payload size:</p>
        <ul className="space-y-3">
          <li>
            <strong>Extract Critical CSS:</strong> As mentioned, inline only the CSS needed for above-the-fold
            content. This is the single most impactful CSS optimization.
          </li>
          <li>
            <strong>Remove Unused CSS:</strong> Use PurgeCSS, UnCSS, or webpack's PurgeCSSPlugin to eliminate
            unused selectors. Modern frameworks (Tailwind CSS) do this automatically. Savings can be 50-90% for
            component libraries where only a subset of components are used per page.
          </li>
          <li>
            <strong>Minify CSS:</strong> Remove whitespace, comments, and apply optimizations (shorthand properties,
            color compression). Tools: cssnano, clean-css. Typical savings: 15-25%.
          </li>
          <li>
            <strong>Avoid CSS Imports:</strong>{' '}
            <code>@import</code> is render-blocking and prevents parallel downloading. Use a build tool to bundle
            CSS instead.
          </li>
          <li>
            <strong>Use CSS Containment:</strong> Apply <code>contain: layout style paint</code> to isolate complex
            components. This tells the browser that the element's subtree is independent, reducing layout and paint
            scope. Useful for widgets, carousels, and embedded content.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">5. JavaScript Optimization</h3>
        <p>Reduce JavaScript blocking and execution time:</p>
        <ul className="space-y-3">
          <li>
            <strong>Code Splitting:</strong> Split JavaScript into multiple bundles loaded on demand. Route-based
            splitting is most common: each route gets its own chunk. Component-based splitting (React.lazy,
            dynamic imports) further reduces initial bundle size. Target: initial bundle {'<'} 200KB gzipped.
          </li>
          <li>
            <strong>Tree Shaking:</strong> Eliminate dead code from bundles. Use ES6 modules (import/export) for
            static analysis. Modern bundlers (webpack, Rollup, Vite) tree-shake automatically. Ensure your
            dependencies are ES6-module compatible.
          </li>
          <li>
            <strong>Lazy Load Non-Critical Code:</strong> Defer loading of code not needed for initial render.
            Examples: analytics, chat widgets, below-the-fold components, admin features. Use IntersectionObserver
            for lazy loading based on scroll position.
          </li>
          <li>
            <strong>Reduce JavaScript Execution Time:</strong> Long tasks ({'>'} 50ms) block the main thread and
            delay TTI. Break up long tasks using techniques like: chunking (process data in batches), web workers
            (offload CPU-intensive work), and requestIdleCallback (schedule work during idle periods).
          </li>
          <li>
            <strong>Minimize JavaScript Bundle Size:</strong> Analyze bundles with webpack-bundle-analyzer or
            rollup-plugin-visualizer. Common culprits: moment.js (use dayjs), lodash (import specific functions),
            large UI libraries (tree-shake or use lighter alternatives).
          </li>
          <li>
            <strong>Use Modern JavaScript:</strong> Ship ES2015+ to modern browsers (smaller, faster code) with
            legacy fallbacks for older browsers. Use {'<script type="module">'} for modern builds and nomodule
            for legacy. This can reduce bundle size by 20-30%.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">6. Image Optimization</h3>
        <p>Images often account for 50-80% of page weight. Optimize aggressively:</p>
        <ul className="space-y-3">
          <li>
            <strong>Use Modern Formats:</strong> WebP provides 25-35% better compression than JPEG. AVIF provides
            50% better compression but has slower encoding. Use picture element for format fallbacks:
            <code>{'<picture><source srcset="image.avif" type="image/avif"><source srcset="image.webp" type="image/webp"><img src="image.jpg" alt="..."></picture>'}</code>.
          </li>
          <li>
            <strong>Implement Responsive Images:</strong> Use <code>srcset</code> and <code>sizes</code> attributes
            to serve appropriately-sized images based on viewport and pixel density. This prevents downloading
            4K images for mobile screens.
          </li>
          <li>
            <strong>Lazy Load Images:</strong> Use native lazy loading (<code>loading="lazy"</code>) for
            below-the-fold images. For above-the-fold or critical images (hero, LCP element), never lazy load —
            preload instead.
          </li>
          <li>
            <strong>Specify Image Dimensions:</strong> Always include <code>width</code> and <code>height</code>
            attributes to prevent layout shifts (CLS). Use CSS for responsive sizing while preserving aspect ratio.
          </li>
          <li>
            <strong>Use CDN Image Optimization:</strong> Services like Cloudinary, Imgix, and Cloudflare Images
            provide on-the-fly optimization: format conversion, resizing, compression, and CDN delivery.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">7. Font Optimization</h3>
        <p>Web fonts can block text rendering and cause layout shifts:</p>
        <ul className="space-y-3">
          <li>
            <strong>Use font-display: swap:</strong> This tells the browser to use a fallback font until the custom
            font loads, preventing invisible text (FOIT). Trade-off: potential layout shift if fallback and custom
            fonts have different metrics.
          </li>
          <li>
            <strong>Preload Critical Fonts:</strong> Use <code>{'<link rel="preload" as="font" href="..." type="font/woff2" crossorigin>'}</code>
            for fonts used in above-the-fold content.
          </li>
          <li>
            <strong>Subset Fonts:</strong> Remove unused glyphs to reduce font file size. Tools: fonttools,
            glyphhanger. For Latin-only sites, this can reduce font size by 50-70%.
          </li>
          <li>
            <strong>Use Variable Fonts:</strong> Variable fonts (OpenType 1.8+) pack multiple weights/styles into
            a single file, reducing HTTP requests and enabling fine-grained weight control.
          </li>
          <li>
            <strong>Consider System Fonts:</strong> For UI text, system fonts (San Francisco, Segoe UI, Roboto)
            are instantly available and eliminate font loading entirely. Many design systems (GitHub, Stripe) use
            system font stacks.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/optimization-strategies.svg"
          alt="Page Load Optimization Strategies"
          caption="Page Load Optimization Strategies — comprehensive view of optimization techniques across Network, Server, HTML/CSS, JavaScript, Image, and Font layers with performance budget targets and business impact"
        />
      </section>

      <section>
        <h2>Performance Budgets</h2>
        <p>
          A <strong>performance budget</strong> is a set of targets that define the maximum allowable values for
          performance metrics. Budgets create accountability and prevent performance regressions during development.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Example Performance Budget</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-3 text-left">Metric</th>
                <th className="p-3 text-left">Budget</th>
                <th className="p-3 text-left">Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3">LCP</td>
                <td className="p-3">{'<'} 2.5s</td>
                <td className="p-3">Core Web Vital threshold</td>
              </tr>
              <tr>
                <td className="p-3">INP</td>
                <td className="p-3">{'<'} 200ms</td>
                <td className="p-3">Core Web Vital threshold</td>
              </tr>
              <tr>
                <td className="p-3">CLS</td>
                <td className="p-3">{'<'} 0.1</td>
                <td className="p-3">Core Web Vital threshold</td>
              </tr>
              <tr>
                <td className="p-3">Initial JS Bundle</td>
                <td className="p-3">{'<'} 200KB (gzipped)</td>
                <td className="p-3">Ensures fast parse/execute on mobile</td>
              </tr>
              <tr>
                <td className="p-3">Total Page Weight</td>
                <td className="p-3">{'<'} 1MB</td>
                <td className="p-3">Reasonable for 4G networks</td>
              </tr>
              <tr>
                <td className="p-3">TTFB</td>
                <td className="p-3">{'<'} 600ms</td>
                <td className="p-3">Google's recommended threshold</td>
              </tr>
              <tr>
                <td className="p-3">Number of Requests</td>
                <td className="p-3">{'<'} 50</td>
                <td className="p-3">Reduces connection overhead</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Enforce budgets in CI/CD using tools like Lighthouse CI, webpack-bundle-analyzer with size limits, or
          custom scripts. Fail builds that exceed budgets to prevent performance regressions from reaching
          production.
        </p>
      </section>

      <section>
        <h2>Measurement & Monitoring</h2>
        <p>
          Performance optimization is iterative. You need both lab data (for development) and field data (for
          production monitoring).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Lab Tools (Development)</h3>
        <ul className="space-y-2">
          <li>
            <strong>Lighthouse:</strong> Automated auditing tool built into Chrome DevTools. Provides scores for
            Performance, Accessibility, SEO, and Best Practices. Run in incognito mode to avoid extension
            interference.
          </li>
          <li>
            <strong>Chrome DevTools Performance Panel:</strong> Record page load to analyze the critical rendering
            path, identify long tasks, and understand main thread activity.
          </li>
          <li>
            <strong>WebPageTest:</strong> Advanced testing tool with global locations, custom connection speeds,
            and filmstrip view. Excellent for deep dives and comparative testing.
          </li>
          <li>
            <strong>Lighthouse CI:</strong> Run Lighthouse in CI/CD to catch regressions before deployment.
            Integrates with GitHub Actions, GitLab CI, Jenkins.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Field Tools (Production)</h3>
        <ul className="space-y-2">
          <li>
            <strong>Chrome UX Report (CrUX):</strong> Aggregated real-user performance data from Chrome users.
            Available via BigQuery or PageSpeed Insights API. Google uses CrUX for search ranking.
          </li>
          <li>
            <strong>Real User Monitoring (RUM):</strong> Collect performance data from actual users. Tools: Google
            Analytics 4 (with web-vitals library), SpeedCurve, New Relic, Datadog RUM, Sentry Performance.
          </li>
          <li>
            <strong>Web Vitals JavaScript Library:</strong> Google's official library for measuring Core Web
            Vitals in production. Sends metrics to analytics endpoints for aggregation.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Lab vs Field Data</h3>
          <p>
            Lab data is reproducible and great for debugging, but it doesn't capture real-world diversity
            (devices, networks, geographic locations). Field data reflects actual user experience but is noisy
            and harder to debug. Use both: lab for development and debugging, field for monitoring and alerting.
          </p>
        </div>
      </section>

      <section>
        <h2>Trade-offs & Decision Framework</h2>
        <p>
          Every optimization involves trade-offs. Understanding these trade-offs is critical for making informed
          architectural decisions.
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Optimization</th>
              <th className="p-3 text-left">Benefits</th>
              <th className="p-3 text-left">Trade-offs</th>
              <th className="p-3 text-left">When to Use</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>SSR</strong></td>
              <td className="p-3">Fast FCP/LCP, better SEO, social sharing works</td>
              <td className="p-3">Higher server costs, increased TTFB risk, more complex infrastructure</td>
              <td className="p-3">Content sites, e-commerce, SEO-critical pages</td>
            </tr>
            <tr>
              <td className="p-3"><strong>SSG</strong></td>
              <td className="p-3">Fastest possible load (static files), simple hosting, cheap</td>
              <td className="p-3">Build times scale with content, stale content between builds</td>
              <td className="p-3">Blogs, docs, marketing pages, infrequently updated content</td>
            </tr>
            <tr>
              <td className="p-3"><strong>CSR</strong></td>
              <td className="p-3">Simple hosting (CDN), rich interactivity, fast subsequent navigation</td>
              <td className="p-3">Slow initial load, poor SEO, blank screen on first load</td>
              <td className="p-3">Dashboards, authenticated apps, internal tools</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Aggressive Code Splitting</strong></td>
              <td className="p-3">Smaller initial bundle, faster TTI</td>
              <td className="p-3">More HTTP requests, potential waterfall loading, complexity</td>
              <td className="p-3">Large SPAs with distinct routes/features</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Inlining Critical CSS</strong></td>
              <td className="p-3">Eliminates render-blocking, faster FCP</td>
              <td className="p-3">Increases HTML size, CSS duplication across pages</td>
              <td className="p-3">All pages (universal best practice)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Image Lazy Loading</strong></td>
              <td className="p-3">Reduces initial page weight, faster LCP</td>
              <td className="p-3">Images load as user scrolls (may cause delays if not preloaded)</td>
              <td className="p-3">Below-the-fold images, long-scroll pages</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Preloading</strong></td>
              <td className="p-3">Prioritizes critical resources, reduces LCP</td>
              <td className="p-3">Wastes bandwidth if preloaded resource isn't used</td>
              <td className="p-3">Hero images, critical fonts, above-the-fold resources</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rendering Strategy Decision Framework</h3>
        <p>Choose rendering strategy based on content characteristics:</p>
        <ul className="space-y-2">
          <li>
            <strong>Public + Content-Heavy + SEO-Critical:</strong> SSR or SSG (Next.js, Nuxt, Astro)
          </li>
          <li>
            <strong>Public + Marketing/Landing Page:</strong> SSG with incremental regeneration
          </li>
          <li>
            <strong>Authenticated + Dashboard:</strong> CSR with skeleton screens and optimistic updates
          </li>
          <li>
            <strong>Mixed (Public + Authenticated):</strong> Hybrid approach (Next.js: SSG/SSR for public, CSR
            for dashboard)
          </li>
          <li>
            <strong>Real-Time + Collaborative:</strong> CSR with WebSocket/SSE for live updates
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>Avoid these mistakes that undermine page load performance:</p>
        <ul className="space-y-3">
          <li>
            <strong>Over-optimizing for Lab Scores:</strong> Chasing 100/100 Lighthouse scores without measuring
            real-user impact. Focus on metrics that correlate with business outcomes (LCP, conversion rate).
          </li>
          <li>
            <strong>Lazy Loading Everything:</strong> Lazy loading hero images or critical content delays LCP.
            Only lazy load below-the-fold content.
          </li>
          <li>
            <strong>Too Much Code Splitting:</strong> Splitting bundles into tiny chunks creates request waterfalls
            and HTTP overhead. Find the balance — typically 1-3 chunks per route.
          </li>
          <li>
            <strong>Ignoring Mobile Performance:</strong> Testing only on fast desktop connections. Use network
            throttling (Slow 3G) and low-end device emulation in DevTools.
          </li>
          <li>
            <strong>No Performance Budget:</strong> Allowing bundles to grow unchecked. Set budgets and enforce
            them in CI.
          </li>
          <li>
            <strong>Third-Party Script Bloat:</strong> Analytics, ads, chat widgets, A/B testing tools can add
            hundreds of KB and block the main thread. Audit third-party scripts regularly and load them
            asynchronously.
          </li>
          <li>
            <strong>Not Measuring in Production:</strong> Lab performance doesn't reflect real-world conditions.
            Implement RUM to track actual user experience.
          </li>
          <li>
            <strong>Optimizing Prematurely:</strong> Optimizing before measuring. Use RUM data to identify the
            biggest bottlenecks for your specific users, then optimize those.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real User Monitoring (RUM)</h2>
        <p>
          Real User Monitoring (RUM) collects performance data from actual users in production. Unlike lab tools
          (Lighthouse, WebPageTest), RUM captures the full distribution of user experiences across devices,
          networks, and geographies.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Why RUM Matters</h3>
        <ul className="space-y-2">
          <li>
            <strong>Lab data is synthetic:</strong> Lighthouse runs on a single device/network. Your users have
            hundreds of device/network combinations.
          </li>
          <li>
            <strong>Field data reflects reality:</strong> RUM shows how real users experience your site — slow
            3G in rural areas, old Android phones, congested networks.
          </li>
          <li>
            <strong>Statistical significance:</strong> RUM aggregates thousands of page loads, showing percentiles
            (p50, p75, p95) not just averages.
          </li>
          <li>
            <strong>Business correlation:</strong> RUM data can be correlated with conversions, bounce rate, and
            revenue to quantify performance impact.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">RUM Data Sources</h3>
        <ul className="space-y-2">
          <li>
            <strong>Chrome UX Report (CrUX):</strong> Aggregated, anonymized data from Chrome users. Available via
            PageSpeed Insights API, Search Console, or BigQuery. Free, but limited to Chrome users and popular
            sites.
          </li>
          <li>
            <strong>web-vitals library:</strong> Google's JavaScript library for measuring Core Web Vitals in
            production. Send metrics to your analytics platform using navigator.sendBeacon().
          </li>
          <li>
            <strong>Commercial RUM tools:</strong> SpeedCurve, New Relic, Datadog, Akamai mPulse, Cloudflare
            Browser Insights. Provide dashboards, alerting, and analysis.
          </li>
          <li>
            <strong>Custom RUM:</strong> Build your own using the Performance API (performance.getEntriesByType('navigation'))
            and send data to your backend.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Key RUM Metrics</h3>
        <p>
          Track these metrics across percentiles (p50, p75, p95):
        </p>
        <ul className="space-y-2">
          <li><strong>LCP:</strong> Largest Contentful Paint — loading performance</li>
          <li><strong>INP:</strong> Interaction to Next Paint — interactivity and responsiveness</li>
          <li><strong>CLS:</strong> Cumulative Layout Shift — visual stability</li>
          <li><strong>FCP:</strong> First Contentful Paint — initial rendering</li>
          <li><strong>TTFB:</strong> Time to First Byte — server responsiveness</li>
          <li><strong>TBT:</strong> Total Blocking Time — main thread blocking</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Implementing RUM with web-vitals</h3>
        <p>
          Install the web-vitals package and send metrics to your analytics endpoint:
        </p>
        <ul className="space-y-2">
          <li>Import metrics: <code>onLCP, onINP, onCLS, onFCP, onTTFB</code> from web-vitals library</li>
          <li>Each callback receives metric object with value, rating, id, delta</li>
          <li>Send using <code>navigator.sendBeacon()</code> for reliability (works during page unload)</li>
          <li>Aggregate by URL, device type, network, geography</li>
          <li>Track percentiles (p75 is Google's standard for Core Web Vitals)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">RUM Best Practices</h3>
        <ul className="space-y-2">
          <li>Sample data (1-10% of users) to reduce volume and cost</li>
          <li>Respect user.compliance (GDPR, CCPA) — anonymize IPs, get consent</li>
          <li>Set up alerts for metric degradation (p75 LCP increases by 20%+)</li>
          <li>Segment by device class (desktop, mobile, tablet), network (4G, 3G), and geography</li>
          <li>Correlate with business metrics (conversion rate, bounce rate, session duration)</li>
          <li>Use p75 percentile for Core Web Vitals (Google's standard)</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/rum-data-flow.svg"
          alt="RUM Data Flow"
          caption="Real User Monitoring data flow — from browser Performance API through analytics pipeline to dashboards and alerts"
        />
      </section>

      <section>
        <h2>Real-World Case Studies</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <h3 className="mb-3 font-semibold">Pinterest: 40% Faster Perceived Load Time</h3>
            <p>
              <strong>Problem:</strong> Pinterest's performance on 3G networks was poor, with high bounce rates
              in emerging markets.
            </p>
            <p className="mt-2">
              <strong>Solution:</strong> Implemented PWA with service worker caching, code splitting, and
              aggressive image optimization. Reduced initial bundle size by 70%.
            </p>
            <p className="mt-2">
              <strong>Result:</strong> 40% reduction in perceived wait time, 15% increase in SEO traffic, 10%
              increase in signups. Core Web Vitals improved across all metrics.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <h3 className="mb-3 font-semibold">Walmart: 2% Conversion Increase per 1s Improvement</h3>
            <p>
              <strong>Problem:</strong> Slow page loads were causing cart abandonment and lost revenue.
            </p>
            <p className="mt-2">
              <strong>Solution:</strong> Optimized critical rendering path, implemented resource hints (preload,
              prefetch), reduced JavaScript bundle size, and moved to edge caching.
            </p>
            <p className="mt-2">
              <strong>Result:</strong> For every 1 second of improvement in page load time, conversions increased
              by 2%. For every 100ms improvement, revenue increased by up to 1%.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <h3 className="mb-3 font-semibold">Vodafone: 8% Increase in Sales</h3>
            <p>
              <strong>Problem:</strong> Mobile performance was lagging, with LCP times exceeding 5 seconds on
              3G networks.
            </p>
            <p className="mt-2">
              <strong>Solution:</strong> Migrated to SSR with Next.js, implemented image optimization with
              Cloudinary, reduced JavaScript by 50%, and implemented aggressive caching strategies.
            </p>
            <p className="mt-2">
              <strong>Result:</strong> LCP improved from 5.2s to 2.1s, conversion rate increased by 8%, bounce
              rate decreased by 15%.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <h3 className="mb-3 font-semibold">BBC: 10% Reduction in Bounce Rate</h3>
            <p>
              <strong>Problem:</strong> News articles were loading slowly on mobile, causing users to abandon
              pages before content appeared.
            </p>
            <p className="mt-2">
              <strong>Solution:</strong> Implemented critical CSS inlining, lazy loaded images and comments,
              reduced JavaScript payload, and optimized font loading.
            </p>
            <p className="mt-2">
              <strong>Result:</strong> 10% reduction in bounce rate, 15% improvement in return visitor rate,
              LCP reduced from 4.1s to 1.8s.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you diagnose and fix a slow page load?</p>
            <p className="mt-2 text-sm">
              A: Start by measuring — use Lighthouse for lab data and RUM for field data. Identify the biggest
              bottleneck: is it TTFB (server issue), large resources (images/JS), or render-blocking (CSS/JS)?
              Use Chrome DevTools Performance panel to analyze the critical rendering path. Common fixes: optimize
              images, code split JavaScript, inline critical CSS, enable compression, use a CDN, and implement
              caching. Always measure impact after changes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's the difference between FCP, LCP, and TTI?</p>
            <p className="mt-2 text-sm">
              A: FCP (First Contentful Paint) measures when the first content (text, image, canvas) is rendered.
              LCP (Largest Contentful Paint) measures when the largest visible element is rendered — this is
              usually the hero image or main heading, and it's a Core Web Vital. TTI (Time to Interactive)
              measures when the page becomes fully interactive (main thread is idle for 5+ seconds). FCP/LCP are
              about visual loading; TTI is about usability.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you decide between SSR, SSG, and CSR?</p>
            <p className="mt-2 text-sm">
              A: It depends on content characteristics. SSR for dynamic, SEO-critical content (e-commerce, news).
              SSG for static content that doesn't change often (blogs, docs, marketing). CSR for authenticated
              apps where SEO doesn't matter (dashboards, internal tools). For mixed use cases, use a hybrid
              approach (Next.js allows mixing SSG/SSR/CSR per page).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's critical CSS and why does it matter?</p>
            <p className="mt-2 text-sm">
              A: Critical CSS is the minimum CSS required to render above-the-fold content. By inlining it in the
              HTML head, you eliminate render-blocking for critical styles, allowing the browser to paint content
              faster. Non-critical CSS is loaded asynchronously. This can improve FCP by 30-50%.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you optimize a 5MB JavaScript bundle?</p>
            <p className="mt-2 text-sm">
              A: First, analyze the bundle (webpack-bundle-analyzer) to identify what's large. Common strategies:
              code splitting (route-based and component-based), tree shaking (remove unused code), lazy loading
              non-critical features, replacing heavy libraries (moment.js → dayjs, lodash → specific imports),
              using modern JavaScript for smaller output, and enabling compression (Brotli). Target: initial
              bundle under 200KB gzipped.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are Core Web Vitals and why do they matter?</p>
            <p className="mt-2 text-sm">
              A: Core Web Vitals are three metrics Google uses to measure user experience: LCP (loading), INP
              (interactivity), and CLS (visual stability). They matter because they're a Google search ranking
              factor — poor scores directly impact SEO and organic traffic. They also correlate with business
              metrics: faster LCP = higher conversions, lower INP = better engagement, lower CLS = fewer
              accidental clicks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent performance regressions?</p>
            <p className="mt-2 text-sm">
              A: Implement performance budgets in CI/CD using tools like Lighthouse CI. Set thresholds for key
              metrics (LCP {'<'} 2.5s, bundle size {'<'} 200KB, etc.) and fail builds that exceed them. Monitor
              production with RUM and set up alerts for metric degradation. Review performance in code reviews —
              ask "what's the performance impact?" for every PR.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/learn/performance" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Learn Performance
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/Performance" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Web Performance
            </a>
          </li>
          <li>
            <a href="https://developers.google.com/web/fundamentals/performance/critical-rendering-path" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google — Critical Rendering Path
            </a>
          </li>
          <li>
            <a href="https://web.dev/vitals/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google — Core Web Vitals
            </a>
          </li>
          <li>
            <a href="https://www.smashingmagazine.com/2021/06/performance-bulletproof-checklist/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Smashing Magazine — Performance Bulletproof Checklist
            </a>
          </li>
          <li>
            <a href="https://calendar.perfplanet.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Performance Calendar
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
