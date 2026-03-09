"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { MermaidDiagram } from "@/components/articles/MermaidDiagram";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-web-vitals-extensive",
  title: "Web Vitals (LCP, FID, CLS, TTFB, INP)",
  description: "Comprehensive guide to Core Web Vitals, performance measurement, optimization strategies, and real-user monitoring.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "web-vitals",
  version: "extensive",
  wordCount: 11500,
  readingTime: 46,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "web-vitals", "LCP", "CLS", "INP", "TTFB", "Core Web Vitals"],
  relatedTopics: ["image-optimization", "critical-css", "code-splitting"],
};

export default function WebVitalsExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Web Vitals</strong> is an initiative by Google to provide unified guidance for quality signals
          that are essential to delivering a great user experience on the web. First introduced in May 2020,
          Web Vitals defines a set of measurable metrics that capture real-world user experience across three
          dimensions: <strong>loading</strong>, <strong>interactivity</strong>, and <strong>visual stability</strong>.
        </p>
        <p>
          The <strong>Core Web Vitals</strong> are the subset of Web Vitals that Google considers most important.
          As of 2024, they are: <strong>LCP</strong> (Largest Contentful Paint), <strong>INP</strong> (Interaction
          to Next Paint), and <strong>CLS</strong> (Cumulative Layout Shift). These three metrics became a Google
          search ranking factor in June 2021, making performance optimization directly tied to SEO and organic
          traffic.
        </p>
        <p>
          The metrics evolved over time. FID (First Input Delay) was an original Core Web Vital but was replaced
          by INP in March 2024 because FID only measured the delay of the <em>first</em> interaction, while INP
          captures the worst interaction across the entire page lifecycle — a much more representative signal of
          real-world responsiveness.
        </p>
        <p>
          What makes Web Vitals particularly powerful is the dual measurement approach: <strong>lab data</strong>
          (Lighthouse, Chrome DevTools) provides reproducible diagnostic results during development, while
          <strong>field data</strong> (Chrome UX Report, Real User Monitoring) captures the actual experience of
          real users across diverse devices and network conditions. Google uses field data (specifically the 75th
          percentile of CrUX data) for search ranking.
        </p>
      </section>

      <section>
        <h2>Performance Timeline</h2>
        <MermaidDiagram
          chart={`sequenceDiagram
    participant B as Browser
    participant S as Server
    participant U as User Screen

    Note over B,U: Navigation Start
    B->>S: HTTP Request
    Note right of B: ⏱ TTFB starts
    S-->>B: First byte received
    Note right of B: ⏱ TTFB ends

    B->>B: Parse HTML
    B->>S: Fetch CSS, JS, Fonts
    B->>U: First paint (background color)
    Note right of U: ⏱ FP (First Paint)

    B->>U: First text/image rendered
    Note right of U: ⏱ FCP (First Contentful Paint)

    B->>S: Fetch hero image
    S-->>B: Hero image loaded
    B->>U: Hero image rendered
    Note right of U: ⏱ LCP (Largest Contentful Paint)

    Note over B,U: User Interaction
    U->>B: Click button
    B->>B: Event handler runs (long task)
    B->>U: UI updates
    Note right of U: ⏱ INP (Interaction to Next Paint)

    Note over B,U: Throughout Lifecycle
    B->>U: Layout shift (ad loads)
    B->>U: Layout shift (image loads without dimensions)
    Note right of U: ⏱ CLS (accumulated shifts)`}
          caption="Performance metric timeline — showing when each Web Vital is measured during a page's lifecycle"
        />
      </section>

      <section>
        <h2>LCP — Largest Contentful Paint</h2>
        <p>
          LCP measures the time from when the user initiates loading the page until the largest image, video, or
          text block is rendered within the viewport. It's the primary metric for perceived load speed — when
          users judge "this page loaded," they're implicitly measuring something close to LCP.
        </p>

        <h3 className="mt-4 font-semibold">What Qualifies as an LCP Element</h3>
        <ul className="space-y-2">
          <li><code>{'<img>'}</code> elements (including inside <code>{'<picture>'}</code>)</li>
          <li><code>{'<image>'}</code> elements inside <code>{'<svg>'}</code></li>
          <li><code>{'<video>'}</code> elements (poster image or first displayed frame)</li>
          <li>Elements with <code>background-image</code> loaded via CSS</li>
          <li>Block-level text elements (<code>{'<p>'}</code>, <code>{'<h1>'}</code>, etc.)</li>
        </ul>

        <h3 className="mt-6 font-semibold">Thresholds</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Rating</th>
              <th className="p-3 text-left">LCP</th>
              <th className="p-3 text-left">Percentile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3 text-green-600 font-semibold">Good</td>
              <td className="p-3">≤ 2.5 seconds</td>
              <td className="p-3">75th percentile of field data</td>
            </tr>
            <tr>
              <td className="p-3 text-yellow-600 font-semibold">Needs Improvement</td>
              <td className="p-3">2.5 – 4.0 seconds</td>
              <td className="p-3">—</td>
            </tr>
            <tr>
              <td className="p-3 text-red-600 font-semibold">Poor</td>
              <td className="p-3">&gt; 4.0 seconds</td>
              <td className="p-3">—</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-6 font-semibold">LCP Breakdown</h3>
        <MermaidDiagram
          chart={`gantt
    title LCP Breakdown (2.5s budget)
    dateFormat X
    axisFormat %Ls

    section TTFB
    Server processing + Network    :0, 800

    section Resource Load Delay
    Discovering the LCP resource    :800, 100

    section Resource Load
    Downloading the LCP image       :900, 1200

    section Render Delay
    Rendering the element           :2100, 400`}
          caption="LCP can be broken into four sub-parts — each is an optimization target"
        />

        <h3 className="mt-6 font-semibold">Optimization Strategies</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === 1. Eliminate resource load delay — preload the LCP image ===
// The browser can't discover the LCP image until HTML is parsed
// and CSS is evaluated. Preload tells it to start downloading immediately.

// In HTML <head>
<link
  rel="preload"
  as="image"
  href="/hero.avif"
  type="image/avif"
  fetchpriority="high"
/>

// In Next.js — use priority prop
import Image from 'next/image';
<Image src="/hero.jpg" priority alt="Hero" width={1200} height={600} />

// === 2. Reduce resource load time — optimize the image ===
// Use modern formats, responsive sizing, CDN delivery
<picture>
  <source srcSet="/hero.avif" type="image/avif" />
  <source srcSet="/hero.webp" type="image/webp" />
  <img
    src="/hero.jpg"
    alt="Hero"
    width={1200}
    height={600}
    fetchPriority="high"
    loading="eager"
    decoding="async"
  />
</picture>

// === 3. Reduce TTFB ===
// Use CDN, enable HTTP/2, cache HTML at edge, optimize server
// Target: TTFB < 800ms

// === 4. Eliminate render-blocking resources ===
// Inline critical CSS in <head>
// Defer non-critical CSS: <link rel="preload" as="style" onload="...">
// Async/defer JavaScript: <script defer src="...">

// === 5. Don't lazy-load the LCP element! ===
// ❌ BAD: loading="lazy" on hero image
// ✅ GOOD: loading="eager" + fetchPriority="high"`}</code>
        </pre>
      </section>

      <section>
        <h2>INP — Interaction to Next Paint</h2>
        <p>
          INP measures the latency of the single worst interaction (click, tap, or keyboard event) during the
          page's lifetime. Unlike FID which only captured the first interaction's input delay, INP measures the
          entire interaction lifecycle: input delay + processing time + presentation delay.
        </p>

        <MermaidDiagram
          chart={`sequenceDiagram
    participant U as User
    participant M as Main Thread
    participant P as Pixel Pipeline

    U->>M: Click event fired
    Note over M: Input Delay<br/>(waiting for main thread)

    M->>M: Event handler executes
    Note over M: Processing Time<br/>(running JS handler)

    M->>P: Layout → Paint → Composite
    Note over P: Presentation Delay<br/>(rendering update)

    P->>U: Next frame painted
    Note over U,P: Total = INP`}
          caption="INP measures three phases: input delay, processing time, and presentation delay"
        />

        <h3 className="mt-6 font-semibold">Why INP Replaced FID</h3>
        <ul className="space-y-2">
          <li><strong>FID only measured input delay</strong> — the time the main thread was busy when the user first interacted. It didn't measure the actual handler execution time or rendering time.</li>
          <li><strong>FID only measured the first interaction</strong> — a page could pass FID because the first click happened before heavy JS loaded, but all subsequent interactions were slow.</li>
          <li><strong>INP measures the full interaction</strong> — from user input to next paint, including handler execution and rendering. It reports the worst interaction (technically the 98th percentile).</li>
        </ul>

        <h3 className="mt-6 font-semibold">Optimization Strategies</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === 1. Break up long tasks ===
// Any task > 50ms blocks the main thread and increases INP

// ❌ BAD: One long synchronous task
function processLargeList(items) {
  items.forEach(item => {
    heavyComputation(item);  // 200ms total → blocks interactions
  });
}

// ✅ GOOD: Yield to the main thread periodically
async function processLargeList(items) {
  for (let i = 0; i < items.length; i++) {
    heavyComputation(items[i]);

    // Yield every 10 items to let the browser handle user input
    if (i % 10 === 0) {
      await scheduler.yield();  // Modern API
      // Fallback: await new Promise(r => setTimeout(r, 0));
    }
  }
}

// === 2. Use startTransition for non-urgent updates ===
import { startTransition, useState } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  function handleInput(e) {
    const value = e.target.value;
    setQuery(value);  // Urgent: update the input immediately

    startTransition(() => {
      setResults(filterResults(value));  // Non-urgent: can be deferred
    });
  }

  return (
    <>
      <input value={query} onChange={handleInput} />
      <ResultsList results={results} />
    </>
  );
}

// === 3. Move heavy computation to Web Workers ===
// main.js
const worker = new Worker('./heavy-worker.js');

function handleClick(data) {
  worker.postMessage(data);
}

worker.onmessage = (e) => {
  updateUI(e.data);  // Only the UI update runs on main thread
};

// heavy-worker.js
self.onmessage = (e) => {
  const result = expensiveComputation(e.data);
  self.postMessage(result);
};

// === 4. Reduce JavaScript execution time ===
// - Code split aggressively (load less JS)
// - Tree shake unused code
// - Defer non-critical JS with defer/async
// - Use lighter libraries (preact instead of react for simple apps)

// === 5. Avoid layout thrashing ===
// ❌ BAD: Read-write-read pattern forces synchronous layout
elements.forEach(el => {
  const height = el.offsetHeight;    // Read → forces layout
  el.style.height = height + 10 + 'px';  // Write → invalidates layout
  // Next read will force ANOTHER layout calculation
});

// ✅ GOOD: Batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight);  // Batch read
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px';  // Batch write
});`}</code>
        </pre>
      </section>

      <section>
        <h2>CLS — Cumulative Layout Shift</h2>
        <p>
          CLS quantifies how much the page's content moves around during its lifetime. Every time a visible
          element shifts position without user interaction, a layout shift score is calculated. CLS is the
          sum of the largest burst of layout shifts (using a "session window" with a max 5-second duration
          and 1-second gap).
        </p>

        <h3 className="mt-6 font-semibold">How CLS Is Calculated</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Layout shift score = impact fraction × distance fraction

// Impact fraction: % of viewport affected by the shift
// If an element occupies 25% of viewport and shifts,
// and 25% of viewport is the new area → impact = 50% (0.5)

// Distance fraction: how far the element moved as % of viewport
// If element moves 100px in a 800px viewport → distance = 12.5% (0.125)

// Score = 0.5 × 0.125 = 0.0625 per shift event

// CLS uses "session windows":
// - Groups shifts that occur within 1 second of each other
// - Max window duration: 5 seconds
// - CLS = the largest session window score

// User-initiated shifts don't count:
// - Shifts within 500ms of user input (click, tap, key)
// - Scroll-triggered shifts don't count`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Common Causes & Fixes</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === 1. Images without dimensions ===
// ❌ BAD: No dimensions → browser can't reserve space
<img src="/photo.jpg" alt="Photo" />

// ✅ GOOD: Explicit dimensions
<img src="/photo.jpg" alt="Photo" width={800} height={600} />

// ✅ GOOD: CSS aspect-ratio for responsive images
<img
  src="/photo.jpg"
  alt="Photo"
  style={{ width: '100%', height: 'auto', aspectRatio: '4/3' }}
/>

// === 2. Dynamic content injection ===
// ❌ BAD: Banner pushes content down after load
function Page() {
  const [showBanner, setShowBanner] = useState(false);
  useEffect(() => {
    fetchBanner().then(() => setShowBanner(true));
  }, []);

  return (
    <div>
      {showBanner && <Banner />}  {/* Shifts everything below */}
      <Content />
    </div>
  );
}

// ✅ GOOD: Reserve space for dynamic content
function Page() {
  const [banner, setBanner] = useState(null);

  return (
    <div>
      <div style={{ minHeight: 80 }}>  {/* Reserved space */}
        {banner && <Banner data={banner} />}
      </div>
      <Content />
    </div>
  );
}

// === 3. Web fonts causing FOUT ===
// ❌ BAD: Font swap causes text to reflow
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2');
  font-display: swap;  /* Text visible in fallback font, then swaps */
}

// ✅ BETTER: Use font-display with size-adjust
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2');
  font-display: optional;  /* Uses font if loaded in time, else fallback */
}

// ✅ BEST: Preload font + size-adjust fallback
<link rel="preload" href="/fonts/custom.woff2" as="font" crossOrigin="" />

@font-face {
  font-family: 'CustomFont Fallback';
  src: local('Arial');
  size-adjust: 105%;     /* Match metrics to minimize shift */
  ascent-override: 90%;
  descent-override: 20%;
}

// === 4. Animations ===
// ❌ BAD: Animating layout properties
.slide-in {
  animation: slideIn 0.3s;
}
@keyframes slideIn {
  from { height: 0; margin-top: -100px; }
  to { height: 100px; margin-top: 0; }
}

// ✅ GOOD: Animate transform (compositor-only, no layout shift)
.slide-in {
  animation: slideIn 0.3s;
}
@keyframes slideIn {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}`}</code>
        </pre>
      </section>

      <section>
        <h2>TTFB — Time to First Byte</h2>
        <p>
          TTFB measures the time from navigation start until the first byte of the HTML response is received.
          It encompasses DNS lookup, TCP/TLS connection, HTTP request, and server processing time. While not
          a Core Web Vital, TTFB is a critical prerequisite — a slow TTFB makes it impossible to achieve a
          good LCP.
        </p>

        <h3 className="mt-4 font-semibold">TTFB Breakdown</h3>
        <MermaidDiagram
          chart={`gantt
    title TTFB Breakdown (target < 800ms)
    dateFormat X
    axisFormat %Lms

    section DNS
    DNS Lookup         :0, 50

    section TCP
    TCP Handshake      :50, 30

    section TLS
    TLS Negotiation    :80, 50

    section Server
    Server Processing  :130, 400

    section Network
    Response Transit   :530, 70`}
          caption="TTFB components — server processing is usually the largest portion"
        />

        <h3 className="mt-6 font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li><strong>CDN:</strong> Serve HTML from edge locations close to users. Reduces network transit from 200-500ms to 20-50ms.</li>
          <li><strong>Server-side caching:</strong> Cache rendered HTML (Redis, Varnish) to avoid re-rendering. ISR (Incremental Static Regeneration) in Next.js.</li>
          <li><strong>Database optimization:</strong> Optimize queries, add indexes, use connection pooling. Slow queries are the #1 TTFB killer.</li>
          <li><strong>HTTP/2 or HTTP/3:</strong> Multiplexing, header compression, and 0-RTT connection resumption reduce connection overhead.</li>
          <li><strong>Early hints (103):</strong> Send <code>103 Early Hints</code> header to start preloading resources before the full response is ready.</li>
          <li><strong>Streaming SSR:</strong> Start sending HTML before the entire page is rendered. React 18's <code>renderToPipeableStream</code>.</li>
          <li><strong>Edge computing:</strong> Run server logic at the edge (Cloudflare Workers, Vercel Edge Functions) for sub-50ms server processing.</li>
        </ul>
      </section>

      <section>
        <h2>Measuring Web Vitals</h2>

        <h3 className="mt-4 font-semibold">In Code (Real User Monitoring)</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Google's web-vitals library ===
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';

// Send to your analytics endpoint
function reportVital(metric) {
  // metric.name: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB'
  // metric.value: number (ms for timing, score for CLS)
  // metric.rating: 'good' | 'needs-improvement' | 'poor'
  // metric.delta: change since last report
  // metric.entries: PerformanceEntry objects for debugging

  fetch('/api/vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      connectionType: navigator.connection?.effectiveType,
    }),
    keepalive: true,  // Survives page unload
  });
}

onLCP(reportVital);
onINP(reportVital);
onCLS(reportVital);
onFCP(reportVital);
onTTFB(reportVital);

// === Next.js built-in Web Vitals reporting ===
// app/layout.tsx or pages/_app.tsx
export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics
}

// === PerformanceObserver API (low-level) ===
// For custom metric collection
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      console.log('LCP:', entry.startTime, entry.element);
    }
    if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
      console.log('CLS shift:', entry.value, entry.sources);
    }
  }
});

observer.observe({ type: 'largest-contentful-paint', buffered: true });
observer.observe({ type: 'layout-shift', buffered: true });`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Lab Tools</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Tool</th>
              <th className="p-3 text-left">Metrics</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Lighthouse</strong></td>
              <td className="p-3">LCP, CLS, TBT, FCP, TTFB, Speed Index</td>
              <td className="p-3">Overall audit, CI/CD integration</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Chrome DevTools Performance</strong></td>
              <td className="p-3">All metrics + flame chart</td>
              <td className="p-3">Deep debugging, long task identification</td>
            </tr>
            <tr>
              <td className="p-3"><strong>WebPageTest</strong></td>
              <td className="p-3">All metrics + filmstrip + waterfall</td>
              <td className="p-3">Multi-location testing, competitor comparison</td>
            </tr>
            <tr>
              <td className="p-3"><strong>PageSpeed Insights</strong></td>
              <td className="p-3">CrUX field data + Lighthouse lab data</td>
              <td className="p-3">Quick check, field data for your URL</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Chrome UX Report (CrUX)</strong></td>
              <td className="p-3">LCP, INP, CLS, FCP, TTFB (field)</td>
              <td className="p-3">Real user data at scale, ranking signal</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Performance Budgets & CI/CD</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Lighthouse CI ===
// Run Lighthouse in CI and fail builds that regress
// .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000', 'http://localhost:3000/products'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'interactive': ['warn', { maxNumericValue: 3800 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

// GitHub Actions workflow
// .github/workflows/lighthouse.yml
// name: Lighthouse CI
// on: pull_request
// jobs:
//   lighthouse:
//     runs-on: ubuntu-latest
//     steps:
//       - uses: actions/checkout@v4
//       - run: npm ci && npm run build && npm start &
//       - run: npx @lhci/cli autorun

// === Bundle size budgets ===
// Track bundle size in CI
// bundlesize.config.json
{
  "files": [
    { "path": ".next/static/chunks/main-*.js", "maxSize": "100 kB" },
    { "path": ".next/static/chunks/framework-*.js", "maxSize": "50 kB" },
    { "path": ".next/static/css/*.css", "maxSize": "30 kB" }
  ]
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Optimizing only for lab data:</strong> Lighthouse scores can be 100 while real users have poor
            experiences. Lab runs on a high-end machine with good network; real users are on mid-range phones
            with spotty 4G. Always monitor field data.
          </li>
          <li>
            <strong>Lazy-loading the LCP image:</strong> This is the single most impactful mistake for LCP. The
            browser delays loading the image until it can determine visibility — adding 1-3 seconds. Always
            use <code>fetchPriority="high"</code> + <code>loading="eager"</code> for LCP elements.
          </li>
          <li>
            <strong>Ignoring INP:</strong> Many teams optimized for FID (which was easy to pass) and now have poor
            INP scores because their JavaScript handlers block the main thread for 200+ ms. Profile interactions
            in Chrome DevTools Performance tab.
          </li>
          <li>
            <strong>Fighting CLS with visibility:hidden:</strong> Hiding elements and revealing them still causes
            layout shifts if the element's space isn't reserved. Use <code>min-height</code>, <code>aspect-ratio</code>,
            or <code>content-visibility</code> instead.
          </li>
          <li>
            <strong>Third-party script impact:</strong> Analytics, chat widgets, and ad scripts often dominate
            performance. They add TTFB delay, block rendering, and cause layout shifts. Audit and defer non-critical
            third-party scripts.
          </li>
          <li>
            <strong>Render-blocking CSS:</strong> All CSS is render-blocking by default. A 200KB CSS file adds seconds
            to FCP. Use critical CSS inlining, media query splitting, and async loading for non-critical styles.
          </li>
          <li>
            <strong>Not measuring at P75:</strong> Google uses the 75th percentile of field data for ranking. Your
            median (P50) might be great while P75 is poor — you need to optimize for the tail, not the center.
          </li>
        </ul>
      </section>

      <section>
        <h2>Best Practices Summary</h2>
        <ol className="space-y-3">
          <li>
            <strong>Measure in the field:</strong> Deploy the <code>web-vitals</code> library and collect real user data.
            Monitor P75 values continuously. Don't rely solely on Lighthouse scores.
          </li>
          <li>
            <strong>Optimize LCP image:</strong> Preload with <code>fetchPriority="high"</code>, use modern formats
            (AVIF/WebP), responsive srcset, CDN delivery. Never lazy-load.
          </li>
          <li>
            <strong>Break up long tasks for INP:</strong> No task should block the main thread for &gt;50ms. Use
            <code>scheduler.yield()</code>, <code>startTransition</code>, Web Workers, and requestIdleCallback.
          </li>
          <li>
            <strong>Prevent CLS at the source:</strong> Set dimensions on all images/videos. Reserve space for
            dynamic content. Use <code>font-display: optional</code>. Animate transforms, not layout properties.
          </li>
          <li>
            <strong>Reduce TTFB:</strong> CDN, server caching, database optimization, HTTP/2+, edge computing.
            Target &lt;800ms.
          </li>
          <li>
            <strong>Set performance budgets:</strong> Enforce LCP ≤2.5s, CLS ≤0.1, TBT ≤200ms in CI/CD. Fail
            builds that regress.
          </li>
          <li>
            <strong>Audit third-party scripts:</strong> Defer non-critical scripts, lazy-load widgets, and use
            facades for heavy embeds (YouTube, chat, maps).
          </li>
          <li>
            <strong>Inline critical CSS:</strong> Extract and inline above-the-fold CSS. Async-load the rest.
            This directly improves FCP and LCP.
          </li>
        </ol>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-3">
          <li>
            Core Web Vitals are three user-centric metrics that affect Google search ranking: <strong>LCP</strong>
            (loading ≤2.5s), <strong>INP</strong> (interactivity ≤200ms), <strong>CLS</strong> (visual stability ≤0.1).
          </li>
          <li>
            INP replaced FID in March 2024 because FID only measured the first interaction's input delay, while INP
            captures the full lifecycle (input delay + processing + rendering) of the worst interaction.
          </li>
          <li>
            LCP is an image on 70%+ of pages. Key optimizations: preload with <code>fetchPriority="high"</code>,
            modern formats, responsive srcset, CDN, and inline critical CSS. Never lazy-load LCP.
          </li>
          <li>
            INP optimization centers on keeping the main thread responsive: break long tasks (&gt;50ms) with yield
            points, use <code>startTransition</code> for non-urgent updates, move computation to Web Workers.
          </li>
          <li>
            CLS is caused by images without dimensions, dynamically injected content, font swapping, and animating
            layout properties. Fix with explicit sizes, reserved space, and transform animations.
          </li>
          <li>
            Lab data (Lighthouse) is for debugging; field data (CrUX/RUM) is what Google uses for ranking. Google
            evaluates the 75th percentile — you need to optimize for the tail, not the average.
          </li>
          <li>
            TTFB is the foundation — a slow TTFB makes good LCP impossible. Optimize with CDN, caching, database
            optimization, and edge computing. Target &lt;800ms.
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/vitals/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Web Vitals
            </a>
          </li>
          <li>
            <a href="https://web.dev/lcp/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Largest Contentful Paint (LCP)
            </a>
          </li>
          <li>
            <a href="https://web.dev/inp/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Interaction to Next Paint (INP)
            </a>
          </li>
          <li>
            <a href="https://web.dev/cls/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Cumulative Layout Shift (CLS)
            </a>
          </li>
          <li>
            <a href="https://github.com/GoogleChrome/web-vitals" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub — web-vitals Library
            </a>
          </li>
          <li>
            <a href="https://developer.chrome.com/docs/crux/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Chrome — CrUX Documentation
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
