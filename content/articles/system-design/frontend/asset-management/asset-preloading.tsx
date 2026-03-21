"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-asset-preloading-extensive",
  title: "Asset Preloading",
  description:
    "Comprehensive guide to asset preloading strategies including resource hints, preload scanner mechanics, fetchpriority, service worker precaching, and the Speculation Rules API for staff-level frontend interviews.",
  category: "frontend",
  subcategory: "asset-management",
  slug: "asset-preloading",
  wordCount: 4800,
  readingTime: 22,
  lastUpdated: "2026-03-21",
  tags: [
    "frontend",
    "asset-preloading",
    "resource-hints",
    "preload",
    "prefetch",
    "preconnect",
    "fetchpriority",
    "performance",
    "service-worker",
    "speculation-rules",
  ],
  relatedTopics: [
    "resource-hints",
    "lazy-loading",
    "code-splitting",
    "service-workers",
    "critical-css",
    "above-the-fold-optimization",
  ],
};

export default function AssetPreloadingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* 1. Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Asset preloading</strong> is the practice of instructing the browser to fetch, connect
          to, or prepare resources before the browser would naturally discover them. In a standard page
          load, the browser follows a strict sequence: download HTML, parse it, discover stylesheets and
          scripts in the markup, fetch those, parse them, discover further dependencies (fonts referenced
          in CSS, images referenced in JS), and fetch those. Each step in this chain adds latency.
        </p>
        <p>
          Preloading breaks these sequential dependency chains by giving the browser advance notice of
          resources it will need. This is achieved through <strong>resource hints</strong> (declarative{" "}
          <code>{"<link>"}</code> elements), the <strong>Priority Hints API</strong> (<code>fetchpriority</code>{" "}
          attribute), <strong>service worker precaching</strong>, and the newer{" "}
          <strong>Speculation Rules API</strong> for full-page navigation prefetch and prerender.
        </p>
        <p>
          At the staff/principal level, the key challenge is not knowing <em>that</em> preloading exists,
          but understanding <em>when to apply each technique</em>, how the browser&apos;s built-in preload
          scanner already works, and how to avoid the common pitfall of over-preloading which wastes
          bandwidth and actually degrades performance by creating contention for critical resources.
        </p>
      </section>

      {/* 2. Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Resource Hints</strong> &mdash; Declarative <code>{"<link>"}</code> elements that
            instruct the browser to perform connection or fetch operations earlier than discovery would
            normally trigger. The five types are <code>dns-prefetch</code>, <code>preconnect</code>,{" "}
            <code>preload</code>, <code>prefetch</code>, and <code>modulepreload</code>. Each operates at
            a different level of the network stack and carries different cost/benefit trade-offs.
          </li>
          <li>
            <strong>Preload Scanner (Speculative Parser)</strong> &mdash; A secondary, lightweight HTML
            parser that runs ahead of the main parser. When the main parser is blocked (e.g., executing a
            synchronous script), the preload scanner continues scanning raw HTML bytes to discover
            subresources like <code>{"<script>"}</code>, <code>{"<link>"}</code>, and{" "}
            <code>{"<img>"}</code> tags and starts fetching them speculatively. Understanding this mechanism
            is critical because it means some resources are already being preloaded by the browser
            automatically.
          </li>
          <li>
            <strong>Critical Request Chain</strong> &mdash; The sequence of dependent network requests
            that must complete before the browser can render meaningful content. Preloading&apos;s primary
            goal is to flatten this chain: turning a 4-deep waterfall into parallel fetches. Tools like
            Lighthouse visualize this chain and identify bottleneck resources.
          </li>
          <li>
            <strong>fetchpriority Attribute (Priority Hints)</strong> &mdash; An HTML attribute that lets
            developers signal relative importance of a resource to the browser&apos;s resource prioritizer.
            Values are <code>high</code>, <code>low</code>, and <code>auto</code> (default). This is
            particularly impactful for LCP images and non-critical scripts.
          </li>
          <li>
            <strong>Service Worker Precaching</strong> &mdash; Programmatically caching a set of URLs
            during the service worker <code>install</code> event so that subsequent navigations can be
            served instantly from cache. Tools like Workbox automate manifest generation.
          </li>
          <li>
            <strong>Speculation Rules API</strong> &mdash; A JSON-based API (replacing the older{" "}
            <code>{"<link rel=\"prerender\">"}</code>) that lets developers declare prefetch and prerender
            rules for future navigations. Chrome 109+ supports it. Unlike prefetch, prerender actually
            renders the page in a hidden tab, making navigation near-instant.
          </li>
          <li>
            <strong>Resource Timing API</strong> &mdash; The <code>PerformanceResourceTiming</code>{" "}
            interface exposes timing data for every fetched resource, including DNS, TCP, TLS, request,
            and response phases. This is how you measure whether your preloading strategy is actually
            working.
          </li>
        </ul>
      </section>

      {/* 3. Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3 className="mt-4 font-semibold">Resource Hints Taxonomy</h3>
        <p>
          The five resource hint types operate at different levels of the network stack. Understanding
          their cost and scope is essential for choosing the right hint for each situation.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/asset-management/asset-preloading-diagram-1.svg"
          alt="Resource hints taxonomy showing preload, prefetch, preconnect, dns-prefetch, and modulepreload with use cases and cost levels"
          caption="Resource Hints Taxonomy: Five hint types ordered by network cost and specificity."
        />

        <h3 className="mt-6 font-semibold">Preload Scanner &amp; Critical Request Chain</h3>
        <p>
          The browser&apos;s preload scanner is a speculative parser that runs in parallel with the main
          HTML parser. When the main parser is blocked by synchronous script execution or stylesheet
          evaluation, the preload scanner continues scanning ahead in the HTML to discover subresources
          and initiate their fetch. This is why moving <code>{"<script>"}</code> tags to the bottom of the
          body or using <code>defer</code> still results in early script discovery &mdash; the preload
          scanner found them while the main parser was busy.
        </p>
        <p>
          However, the preload scanner can only discover resources explicitly referenced in HTML markup.
          It cannot discover resources referenced inside JavaScript (dynamic imports, programmatic image
          loads) or CSS (font-face declarations, background images). These &quot;late-discovered&quot;
          resources are prime candidates for <code>rel=&quot;preload&quot;</code> hints.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/asset-management/asset-preloading-diagram-2.svg"
          alt="Preload scanner and critical request chain showing browser parsing, speculative preload, and waterfall reduction"
          caption="Without preload hints, resources are discovered sequentially creating a waterfall. With hints, they load in parallel."
        />

        <h3 className="mt-6 font-semibold">Priority Hints &amp; Fetch Priority</h3>
        <p>
          Even when the browser knows about multiple resources simultaneously, it must decide what order
          to fetch them in. Browsers use internal heuristics based on resource type (CSS is Highest,
          images in viewport are Low, prefetch is Lowest). The <code>fetchpriority</code> attribute
          gives developers a way to nudge these defaults. For example, marking your LCP image with{" "}
          <code>fetchpriority=&quot;high&quot;</code> tells Chrome to boost it from Low to High priority,
          which typically improves LCP by 30-100ms. Conversely, marking below-fold images with{" "}
          <code>fetchpriority=&quot;low&quot;</code> yields bandwidth to critical resources.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/asset-management/asset-preloading-diagram-3.svg"
          alt="Priority hints and fetch priority flow showing fetchpriority high, low, auto and resource prioritization"
          caption="Browser priority queue: fetchpriority shifts resources up or down by one priority level."
        />
      </section>

      {/* Resource-Specific Preloading Strategies */}
      <section>
        <h2>Preloading Strategies by Resource Type</h2>

        <h3 className="mt-4 font-semibold">Fonts</h3>
        <p>
          Fonts are the classic preload candidate because they are late-discovered (referenced in CSS,
          not HTML) and render-blocking for text. Without preloading, the browser must: parse HTML &rarr;
          fetch CSS &rarr; parse CSS &rarr; discover <code>@font-face</code> &rarr; fetch font. Preload
          collapses this to a parallel fetch alongside CSS.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Font preload: must include crossorigin even for same-origin -->
<link rel="preload" href="/fonts/inter-var.woff2"
      as="font" type="font/woff2" crossorigin />

<!-- Why crossorigin? Fonts use anonymous CORS mode by default.
     Without crossorigin, the preloaded response won't match
     the font request and will be fetched twice. -->`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Scripts &amp; ES Modules</h3>
        <p>
          For traditional scripts discovered late (e.g., loaded by another script), use{" "}
          <code>rel=&quot;preload&quot; as=&quot;script&quot;</code>. For ES modules, use{" "}
          <code>rel=&quot;modulepreload&quot;</code> which additionally parses and compiles the module into
          the module map, avoiding the parse-compile cost at execution time. Vite automatically generates
          modulepreload hints for production builds.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Traditional script preload -->
<link rel="preload" href="/js/vendor-analytics.js" as="script" />

<!-- ES Module preload (also parses & compiles) -->
<link rel="modulepreload" href="/js/chart-module.mjs" />

<!-- Vite generates these automatically in production:
<link rel="modulepreload" crossorigin href="/assets/index-a1b2c3d4.js">
<link rel="modulepreload" crossorigin href="/assets/vendor-e5f6g7h8.js">
-->`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Images (LCP Optimization)</h3>
        <p>
          The LCP image is often the single most impactful preload target. Combining{" "}
          <code>rel=&quot;preload&quot;</code> with <code>fetchpriority=&quot;high&quot;</code> and
          responsive <code>imagesrcset</code>/<code>imagesizes</code> is the gold standard for LCP
          optimization.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Preload responsive LCP image -->
<link rel="preload" as="image" fetchpriority="high"
      imagesrcset="/hero-400.webp 400w,
                   /hero-800.webp 800w,
                   /hero-1200.webp 1200w"
      imagesizes="(max-width: 600px) 100vw, 50vw" />

<!-- Or for a single image: -->
<link rel="preload" as="image" href="/hero.webp"
      fetchpriority="high" />`}</code>
        </pre>
      </section>

      {/* Route-Based Prefetching */}
      <section>
        <h2>Route-Based Prefetching</h2>
        <p>
          Modern frameworks implement route-based prefetching to load the JavaScript and data for the
          next page before the user navigates. Next.js automatically prefetches <code>{"<Link>"}</code>{" "}
          destinations that are visible in the viewport. This is a form of speculative loading that
          dramatically improves perceived navigation speed.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Route-based prefetching in React (manual implementation)
function PrefetchLink({ href, children }) {
  const prefetched = useRef(false);

  const handleMouseEnter = () => {
    if (prefetched.current) return;
    prefetched.current = true;

    // Prefetch the route's JS chunk
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = \`/chunks/\${routeToChunk(href)}.js\`;
    document.head.appendChild(link);

    // Also prefetch the route's data
    fetch(\`/api/page-data\${href}\`, { priority: 'low' })
      .then(r => r.json())
      .then(data => prefetchCache.set(href, data));
  };

  return (
    <a href={href} onMouseEnter={handleMouseEnter}
       onFocus={handleMouseEnter}>
      {children}
    </a>
  );
}

// Google's quicklink library automates this:
// Prefetches visible links during idle time
import { listen } from 'quicklink';
listen({ origins: [location.hostname] });`}</code>
        </pre>
      </section>

      {/* Service Worker Precaching */}
      <section>
        <h2>Service Worker Precaching</h2>
        <p>
          Service worker precaching downloads and caches a set of URLs during the service worker{" "}
          <code>install</code> event, before any user interaction. This enables instant page loads for
          subsequent visits and is the foundation of offline-first architectures.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Service worker precaching with Workbox
import { precacheAndRoute } from 'workbox-precaching';

// self.__WB_MANIFEST is replaced at build time with
// the list of URLs to precache (with revision hashes)
precacheAndRoute(self.__WB_MANIFEST);

// Manual precaching pattern:
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('app-shell-v2').then((cache) => {
      return cache.addAll([
        '/',
        '/offline.html',
        '/css/critical.css',
        '/js/app.js',
        '/fonts/inter-var.woff2',
      ]);
    })
  );
});

// Runtime caching for dynamic content:
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({ cacheName: 'images' })
);`}</code>
        </pre>
      </section>

      {/* Speculation Rules API */}
      <section>
        <h2>Speculation Rules API</h2>
        <p>
          The <strong>Speculation Rules API</strong> (Chrome 109+) replaces the deprecated{" "}
          <code>{"<link rel=\"prerender\">"}</code> with a more powerful, JSON-based approach. It supports
          both <code>prefetch</code> (fetch the page&apos;s resources) and <code>prerender</code>{" "}
          (fully render the page in a hidden context). Prerendered pages load in near-zero time when
          the user navigates.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Speculation Rules in a script tag -->
<script type="speculationrules">
{
  "prefetch": [
    {
      "source": "list",
      "urls": ["/pricing", "/docs"],
      "eagerness": "moderate"
    }
  ],
  "prerender": [
    {
      "source": "document",
      "where": {
        "and": [
          { "href_matches": "/*" },
          { "not": { "href_matches": "/logout" } }
        ]
      },
      "eagerness": "moderate"
    }
  ]
}
</script>

<!-- Eagerness levels:
  "immediate"  - speculate as soon as rules are observed
  "eager"      - currently same as immediate (may change)
  "moderate"   - speculate on hover (200ms threshold)
  "conservative" - speculate on mousedown / touchstart
-->`}</code>
        </pre>
        <p>
          The <code>eagerness</code> property controls how aggressively the browser speculates.
          For high-confidence navigations (e.g., a multi-step checkout), use <code>eager</code>. For
          general link prefetching, <code>moderate</code> is the sweet spot &mdash; it triggers on
          hover, which gives a ~200-400ms head start before the click completes.
        </p>
      </section>

      {/* 4. Trade-offs & Comparisons */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="px-4 py-2 text-left font-semibold">Technique</th>
                <th className="px-4 py-2 text-left font-semibold">Scope</th>
                <th className="px-4 py-2 text-left font-semibold">Cost</th>
                <th className="px-4 py-2 text-left font-semibold">Best For</th>
                <th className="px-4 py-2 text-left font-semibold">Risk</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">dns-prefetch</td>
                <td className="px-4 py-2">DNS only</td>
                <td className="px-4 py-2">Negligible (~1KB)</td>
                <td className="px-4 py-2">Third-party domains</td>
                <td className="px-4 py-2">Effectively none</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">preconnect</td>
                <td className="px-4 py-2">DNS + TCP + TLS</td>
                <td className="px-4 py-2">Low (keeps socket open)</td>
                <td className="px-4 py-2">Critical origins (2-4 max)</td>
                <td className="px-4 py-2">Wasted sockets if unused</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">preload</td>
                <td className="px-4 py-2">Full resource fetch</td>
                <td className="px-4 py-2">High (bandwidth)</td>
                <td className="px-4 py-2">Current page, late-discovered</td>
                <td className="px-4 py-2">Console warning if unused in 3s</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">prefetch</td>
                <td className="px-4 py-2">Full resource fetch (idle)</td>
                <td className="px-4 py-2">Medium (low priority)</td>
                <td className="px-4 py-2">Next-page resources</td>
                <td className="px-4 py-2">Wasted bandwidth on wrong guess</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">modulepreload</td>
                <td className="px-4 py-2">Fetch + parse + compile</td>
                <td className="px-4 py-2">High (CPU + bandwidth)</td>
                <td className="px-4 py-2">ES module dependency chains</td>
                <td className="px-4 py-2">Full module graph walk cost</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">Speculation Rules</td>
                <td className="px-4 py-2">Full page prefetch/prerender</td>
                <td className="px-4 py-2">Very high (full render)</td>
                <td className="px-4 py-2">High-confidence navigations</td>
                <td className="px-4 py-2">Significant bandwidth + CPU waste</td>
              </tr>
              <tr className="border-b border-theme">
                <td className="px-4 py-2 font-medium">SW Precaching</td>
                <td className="px-4 py-2">Full app shell</td>
                <td className="px-4 py-2">High (initial install)</td>
                <td className="px-4 py-2">Repeat visitors, offline</td>
                <td className="px-4 py-2">Large initial download</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>1. Preload only late-discovered resources.</strong> Do not preload resources that
            the browser&apos;s preload scanner will already discover in HTML. Fonts referenced in CSS
            and images loaded via JavaScript are ideal preload targets. Scripts and stylesheets already
            in the HTML <code>{"<head>"}</code> are not.
          </li>
          <li>
            <strong>2. Always specify the <code>as</code> attribute on preload.</strong> Without{" "}
            <code>as</code>, the browser fetches the resource with low priority and cannot apply the
            correct Content Security Policy. Omitting it also means the resource may be fetched twice.
          </li>
          <li>
            <strong>3. Limit preconnect to 2-4 origins.</strong> Each preconnect opens a socket and
            performs a TLS handshake. Opening too many connections wastes CPU and contends with actual
            resource fetches. Use <code>dns-prefetch</code> as a fallback for less critical origins.
          </li>
          <li>
            <strong>4. Use fetchpriority on LCP images.</strong> Adding{" "}
            <code>fetchpriority=&quot;high&quot;</code> to your LCP image is one of the highest-ROI
            performance interventions. Google&apos;s internal data shows 30-100ms LCP improvement.
          </li>
          <li>
            <strong>5. Pair preload with cache headers.</strong> If a preloaded resource has no-cache
            headers, the browser may re-fetch it when the resource is actually used, defeating the
            purpose of preloading entirely.
          </li>
          <li>
            <strong>6. Measure with Resource Timing API.</strong> Use{" "}
            <code>performance.getEntriesByType(&apos;resource&apos;)</code> to verify that preloaded
            resources have zero or near-zero <code>connectStart</code> to <code>connectEnd</code> delta,
            confirming the preconnect worked.
          </li>
          <li>
            <strong>7. Use Speculation Rules progressively.</strong> Start with{" "}
            <code>eagerness: &quot;conservative&quot;</code> (mousedown) and upgrade to{" "}
            <code>moderate</code> (hover) once you have confidence in your prediction accuracy. Monitor
            the hit rate via the <code>document.prerendering</code> API.
          </li>
        </ol>
      </section>

      {/* 6. Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Over-preloading.</strong> Every preloaded resource competes for bandwidth. Preloading
            10 resources means none of them get full bandwidth, and the critical ones may load slower
            than without preloading. Chrome logs console warnings for preloaded resources not used within
            3 seconds &mdash; if you see these, you are over-preloading.
          </li>
          <li>
            <strong>Missing <code>crossorigin</code> on font preloads.</strong> Fonts use anonymous CORS
            mode. If you preload a font without <code>crossorigin</code>, the browser makes the preload
            request without CORS, then makes a second request with CORS when the font-face rule triggers.
            The preloaded response is discarded, and you have doubled your font download.
          </li>
          <li>
            <strong>Preloading resources the scanner already finds.</strong> If your CSS file is in a{" "}
            <code>{"<link>"}</code> tag in the <code>{"<head>"}</code>, the preload scanner already
            discovers it. Adding a <code>rel=&quot;preload&quot;</code> for it adds zero value and wastes
            a parser cycle.
          </li>
          <li>
            <strong>Prefetching on metered connections.</strong> Some browsers (Firefox) respect{" "}
            <code>Save-Data</code> headers and skip prefetching, but others do not. Use the Network
            Information API to conditionally disable prefetching on slow or metered connections.
          </li>
          <li>
            <strong>Ignoring HTTP/2 push deprecation.</strong> Server Push was once the server-side
            equivalent of preload, but it is deprecated in HTTP/2 and removed in HTTP/3. Use 103 Early
            Hints instead, which sends preload headers before the main response is ready.
          </li>
          <li>
            <strong>Preloading without cache-control alignment.</strong> A preloaded resource with{" "}
            <code>Cache-Control: no-store</code> will be re-fetched when actually used. The preload
            becomes pure waste. Audit preloaded URLs to ensure they have appropriate cache lifetimes.
          </li>
        </ul>
      </section>

      {/* Measuring Preload Effectiveness */}
      <section>
        <h2>Measuring Preload Effectiveness</h2>
        <p>
          The <strong>Resource Timing API</strong> exposes detailed timing for every resource fetch. By
          analyzing the timing entries for preloaded resources, you can verify that your preloading
          strategy is actually reducing latency.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Measure preload effectiveness
function analyzePreloadEffectiveness() {
  const entries = performance.getEntriesByType('resource');

  entries.forEach(entry => {
    const wasPreloaded = entry.initiatorType === 'link' ||
      document.querySelector(
        \`link[rel="preload"][href*="\${new URL(entry.name).pathname}"]\`
      );

    if (wasPreloaded) {
      console.log(\`[Preloaded] \${entry.name}\`);
      console.log(\`  DNS:     \${entry.domainLookupEnd - entry.domainLookupStart}ms\`);
      console.log(\`  Connect: \${entry.connectEnd - entry.connectStart}ms\`);
      console.log(\`  TTFB:    \${entry.responseStart - entry.requestStart}ms\`);
      console.log(\`  Total:   \${entry.responseEnd - entry.startTime}ms\`);

      // If connectEnd - connectStart ≈ 0, preconnect worked
      // If startTime is very early, preload kicked in correctly
    }
  });
}

// Check for wasted preloads (loaded but unused)
window.addEventListener('load', () => {
  setTimeout(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('preload') &&
            entry.transferSize === 0) {
          console.warn('Potential wasted preload:', entry.name);
        }
      }
    });
    observer.observe({ type: 'resource', buffered: true });
  }, 5000);
});`}</code>
        </pre>
      </section>

      {/* 7. Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Google Search</strong> &mdash; Uses Speculation Rules API to prerender the top search
            result. When you click the first result, it loads instantly because it was already rendered
            in a hidden tab. Google reported a 20% reduction in navigation time for prerendered pages.
          </li>
          <li>
            <strong>Shopify Storefront</strong> &mdash; Preloads the primary product image with{" "}
            <code>fetchpriority=&quot;high&quot;</code> and preconnects to their CDN origin. They also
            use <code>103 Early Hints</code> to send preload headers before the server has finished
            generating the HTML response, effectively starting font and CSS downloads 100-200ms earlier.
          </li>
          <li>
            <strong>Facebook / Meta</strong> &mdash; Implements aggressive route-based prefetching. When
            you hover over a link in the feed, React starts prefetching the data and code for that
            destination. Their relay framework prefetches GraphQL queries for likely navigation targets
            during idle time.
          </li>
          <li>
            <strong>Next.js</strong> &mdash; Automatically adds <code>rel=&quot;prefetch&quot;</code>{" "}
            for every <code>{"<Link>"}</code> component visible in the viewport. In production, this
            means next-page JavaScript chunks are already in the browser cache when the user clicks.
            Next.js 13+ also generates modulepreload hints for the client-side module graph.
          </li>
          <li>
            <strong>Cloudflare Pages</strong> &mdash; Uses Early Hints (103 status code) at the edge
            to send preload and preconnect headers while the origin server is still processing the
            request. This gives the browser a 100-500ms head start on resource discovery.
          </li>
        </ul>
      </section>

      {/* 8. References & Further Reading */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/articles/preload-critical-assets" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              web.dev &mdash; Preload Critical Assets to Improve Loading Speed
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/fetch-priority" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              web.dev &mdash; Optimize Resource Loading with the Fetch Priority API
            </a>
          </li>
          <li>
            <a href="https://developer.chrome.com/docs/web-platform/prerender-pages" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Chrome Developers &mdash; Prerender Pages with Speculation Rules
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/preconnect-and-dns-prefetch" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              web.dev &mdash; Establish Network Connections Early (preconnect &amp; dns-prefetch)
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/modulepreload" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              MDN &mdash; rel=modulepreload
            </a>
          </li>
          <li>
            <a href="https://developer.chrome.com/docs/web-platform/early-hints" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Chrome Developers &mdash; Early Hints (103 Status Code)
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Resource_timing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              MDN &mdash; Resource Timing API
            </a>
          </li>
        </ul>
      </section>

      {/* 9. Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: What is the difference between preload and prefetch, and when would you use each?
            </p>
            <p className="mt-2 text-sm text-muted">
              <code>preload</code> fetches a resource needed for the <strong>current</strong> page load
              at high priority. It is mandatory &mdash; if you preload something, you must use it within
              3 seconds or Chrome logs a warning. Use it for late-discovered critical resources like fonts,
              hero images, or above-fold CSS not in the HTML. <code>prefetch</code> fetches a resource
              for a <strong>future</strong> navigation at idle/low priority. It is speculative &mdash; if
              the user never navigates there, the fetch was wasted (but at low cost since it only runs
              during idle time). Use it for next-page JS bundles, route-based code splits, or likely
              navigation targets.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: How does the browser&apos;s preload scanner work, and what resources can it not discover?
            </p>
            <p className="mt-2 text-sm text-muted">
              The preload scanner is a lightweight secondary parser that runs ahead of the main HTML parser.
              When the main parser is blocked (e.g., executing a synchronous script), the preload scanner
              continues scanning raw HTML tokens to find <code>{"<script src>"}</code>,{" "}
              <code>{"<link href>"}</code>, and <code>{"<img src>"}</code> tags and initiates their fetch.
              However, it <strong>cannot</strong> discover: (1) resources loaded dynamically via JavaScript
              (dynamic imports, <code>new Image()</code>), (2) CSS subresources (fonts declared in
              <code>@font-face</code>, background images in CSS), (3) resources behind conditional logic
              or runtime decisions, and (4) resources in Shadow DOM templates. These are the resources you
              should target with explicit preload hints.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: What happens if you preload too many resources? How would you diagnose this?
            </p>
            <p className="mt-2 text-sm text-muted">
              Over-preloading creates bandwidth contention &mdash; every preloaded resource competes for
              the same TCP connections (typically 6 per origin in HTTP/1.1). This can actually make your
              critical resources load <em>slower</em> because they share bandwidth with non-critical
              preloaded assets. Symptoms include: Chrome console warnings (&quot;The resource was preloaded
              but not used within a few seconds&quot;), inflated Time to Interactive, and high network
              utilization in waterfall charts without corresponding improvements in FCP/LCP. Diagnose by:
              (1) checking Chrome DevTools Console for preload warnings, (2) comparing Resource Timing API
              entries for preloaded vs non-preloaded resources, (3) running Lighthouse which flags unused
              preloads, and (4) measuring with/without preloads in A/B tests using real user metrics.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: Explain the Speculation Rules API and how it differs from the old link rel=prerender.
            </p>
            <p className="mt-2 text-sm text-muted">
              The old <code>{"<link rel=\"prerender\">"}</code> was deprecated because it was expensive
              (rendered a full page) and had no way to control eagerness or scope. The Speculation Rules
              API (Chrome 109+) uses a JSON-based <code>{"<script type=\"speculationrules\">"}</code> block
              that supports both <code>prefetch</code> (just fetch resources) and <code>prerender</code>{" "}
              (full hidden render). Key improvements: (1) an <code>eagerness</code> property
              (immediate/eager/moderate/conservative) controls when speculation triggers, (2) a{" "}
              <code>where</code> clause with CSS selector-like matching lets you apply rules to groups of
              links, (3) it respects the user&apos;s data-saver preferences, (4) prerendered pages can
              be inspected in DevTools &gt; Application &gt; Speculative Loads, and (5) JavaScript can
              detect prerendering via <code>document.prerendering</code> to defer analytics or side effects.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: How does fetchpriority interact with the browser&apos;s default resource prioritization?
            </p>
            <p className="mt-2 text-sm text-muted">
              Browsers assign internal priority levels (Highest, High, Medium, Low, Lowest) based on
              resource type and context. For example, main CSS is Highest, sync scripts in{" "}
              <code>{"<head>"}</code> are High, async scripts are Low, and offscreen images are Lowest.
              The <code>fetchpriority</code> attribute shifts a resource&apos;s priority by approximately
              one level: <code>fetchpriority=&quot;high&quot;</code> on an image bumps it from Low to High;{" "}
              <code>fetchpriority=&quot;low&quot;</code> on a script drops it from High to Medium. It is a
              hint, not a guarantee &mdash; the browser retains final control. The most impactful use case
              is <code>fetchpriority=&quot;high&quot;</code> on the LCP image, which Google&apos;s Chrome
              team measured as improving LCP by 30-100ms in real-world deployments. You can also use it
              with the <code>fetch()</code> API: <code>fetch(url, {`{ priority: 'high' }`})</code>.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: Design a preloading strategy for an e-commerce product page. What would you preload, prefetch, and preconnect?
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Preconnect (2-3 origins):</strong> CDN for product images, payment gateway origin
              (Stripe/PayPal), and analytics origin. <strong>Preload (current page critical):</strong>{" "}
              (1) Primary product image with <code>fetchpriority=&quot;high&quot;</code> and responsive
              srcset, (2) brand font file with <code>crossorigin</code>, (3) critical above-fold CSS if
              not already in HTML. <strong>Prefetch (likely next pages):</strong> Cart page JS bundle,
              checkout page JS bundle (high conversion probability). <strong>Speculation Rules:</strong>{" "}
              Prerender the cart page on hover over &quot;Add to Cart&quot; button with{" "}
              <code>eagerness: &quot;moderate&quot;</code>. <strong>Service Worker:</strong> Precache the
              app shell (navigation chrome, common CSS/JS) on first visit. <strong>Avoid:</strong>{" "}
              Preloading below-fold product thumbnails (use lazy loading + <code>fetchpriority=&quot;low&quot;</code>),
              preloading review section data (load on scroll), preconnecting to more than 4 origins.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
