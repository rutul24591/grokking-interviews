"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { MermaidDiagram } from "@/components/articles/MermaidDiagram";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-resource-hints-extensive",
  title: "Resource Hints (prefetch, preload, preconnect, dns-prefetch)",
  description: "Comprehensive guide to resource hints, covering dns-prefetch, preconnect, prefetch, preload, modulepreload, fetchpriority, and the Speculation Rules API for frontend performance optimization.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "resource-hints",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "resource-hints", "prefetch", "preload", "preconnect", "dns-prefetch", "web-performance"],
  relatedTopics: ["code-splitting", "lazy-loading", "critical-rendering-path"],
};

export default function ResourceHintsExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Resource hints</strong> are declarative HTML instructions that inform the browser about
          resources and origins it will need, allowing it to perform network operations — DNS resolution,
          connection establishment, or full resource downloads — before the browser's own parser would
          naturally discover them. They bridge the gap between what the developer knows about the page's
          resource needs and what the browser can infer from parsing HTML and CSS alone.
        </p>
        <p>
          The browser's default resource discovery process is inherently sequential. It parses HTML
          top-to-bottom, discovers a stylesheet, pauses to fetch and parse it, finds a font reference
          inside the CSS, then initiates a DNS lookup for the font CDN, performs a TCP handshake, negotiates
          TLS, and finally downloads the font file. Each step adds latency. By the time the browser starts
          downloading the font, 500-1000ms may have already passed since the initial HTML response.
          Resource hints let you short-circuit this waterfall by declaring upfront what the browser will
          need.
        </p>
        <p>
          The concept of resource hints evolved over several years. The <code>dns-prefetch</code> hint
          appeared first (Chrome 2009, standardized in 2014). <code>preconnect</code> followed in 2015.{" "}
          <code>preload</code> landed in Chrome 50 (2016) and was standardized as a W3C Candidate
          Recommendation. <code>prefetch</code> has been supported since Firefox 3.5 (2009) but was only
          widely adopted once single-page applications made next-page resource prediction practical.
          More recently, <code>modulepreload</code> (2018), <code>fetchpriority</code> (2022), and
          the <strong>Speculation Rules API</strong> (2023) have expanded the developer's ability to
          control browser loading behavior.
        </p>
        <p>
          Understanding resource hints is critical for frontend system design interviews because they
          sit at the intersection of networking, browser internals, and performance optimization — all
          favorite interview topics. They also demonstrate that you think beyond just writing components
          and consider the full page lifecycle from DNS to pixels.
        </p>
      </section>

      <section>
        <h2>How the Browser Loads Resources</h2>
        <p>
          Before diving into individual hints, it's essential to understand the stages involved when a
          browser fetches a resource from a remote origin. Each resource hint targets one or more of
          these stages.
        </p>

        <MermaidDiagram
          chart={`flowchart LR
    A[DNS Lookup<br/>20-120ms] --> B[TCP Handshake<br/>~50ms]
    B --> C[TLS Negotiation<br/>~50ms]
    C --> D[HTTP Request<br/>+ Response<br/>varies]
    D --> E[Parse / Decode<br/>varies]

    style A fill:#3b82f6,color:#fff
    style B fill:#8b5cf6,color:#fff
    style C fill:#a855f7,color:#fff
    style D fill:#ec4899,color:#fff
    style E fill:#f97316,color:#fff`}
          caption="Stages of loading a resource from an HTTPS origin. dns-prefetch covers stage 1; preconnect covers stages 1-3; prefetch and preload cover stages 1-4; modulepreload covers stages 1-5."
        />

        <p>
          For same-origin resources, the DNS and connection stages are already complete (the connection
          was established when the HTML was fetched). But for third-party origins — font CDNs, analytics,
          API servers, image CDNs — each new origin requires the full DNS + TCP + TLS setup. On a
          typical page with 5-10 third-party origins, that represents 500-3000ms of cumulative connection
          setup time, much of which can overlap if the browser knows about the origins early enough.
        </p>

        <h3 className="mt-4 font-semibold">The Preload Scanner</h3>
        <p>
          Modern browsers include a <strong>preload scanner</strong> (also called the speculative parser)
          that runs ahead of the main HTML parser. While the main parser is blocked waiting for a
          render-blocking stylesheet to download, the preload scanner continues scanning the HTML for
          resource references (<code>{"<script src>"}</code>, <code>{"<link href>"}</code>,{" "}
          <code>{"<img src>"}</code>) and starts fetching them early. However, the preload scanner has
          significant blind spots:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Resources in CSS:</strong> Font files, background images, and <code>@import</code>
            chains are invisible until the CSS is parsed.
          </li>
          <li>
            <strong>JavaScript-initiated fetches:</strong> Resources loaded by scripts (dynamic imports,
            XHR/fetch calls, programmatic image loads) can't be predicted.
          </li>
          <li>
            <strong>Third-party origin connections:</strong> The scanner discovers resource URLs but
            doesn't start connections for origins not yet seen.
          </li>
          <li>
            <strong>Conditional resources:</strong> Resources behind media queries, feature detection,
            or user interaction aren't predictable.
          </li>
        </ul>
        <p>
          Resource hints fill these gaps by giving the browser explicit information that the preload
          scanner can't infer.
        </p>
      </section>

      <section>
        <h2>dns-prefetch Deep Dive</h2>
        <p>
          The <code>dns-prefetch</code> hint tells the browser to resolve the DNS for a specified origin
          before it's actually needed. DNS resolution converts a hostname (e.g., <code>api.example.com</code>)
          to an IP address using a series of lookups through the recursive resolver, root servers, TLD
          servers, and authoritative servers. While cached lookups resolve in under 1ms, uncached lookups
          can take 20-120ms, and under poor network conditions, up to 300ms.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Basic dns-prefetch usage -->
<link rel="dns-prefetch" href="https://api.example.com" />
<link rel="dns-prefetch" href="https://cdn.example.com" />
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://www.google-analytics.com" />
<link rel="dns-prefetch" href="https://connect.facebook.net" />

<!-- dns-prefetch resolves ONLY the DNS — it does NOT open a TCP
     connection or perform TLS negotiation. This makes it extremely
     cheap: a single UDP packet to the DNS resolver. -->`}</code>
        </pre>

        <h3 className="mt-4 font-semibold">How DNS Caching Works</h3>
        <p>
          DNS results are cached at multiple levels: the OS resolver cache (minutes to hours, depending
          on TTL), the browser's internal DNS cache (typically 60 seconds in Chrome), and potentially
          your ISP's recursive resolver. The <code>dns-prefetch</code> hint is most valuable when the
          DNS result is not already cached — which happens on the user's first visit, after cache
          expiration, or when visiting from a different network.
        </p>

        <h3 className="mt-4 font-semibold">Combining with preconnect</h3>
        <p>
          A common pattern is to use both <code>dns-prefetch</code> and <code>preconnect</code> for the
          same origin. The <code>dns-prefetch</code> serves as a fallback for browsers that don't support{" "}
          <code>preconnect</code> (essentially just older Android browsers at this point):
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Fallback pattern: dns-prefetch for old browsers,
     preconnect for modern browsers -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />

<!-- Modern browsers use preconnect and ignore dns-prefetch.
     Old browsers ignore preconnect and use dns-prefetch. -->`}</code>
        </pre>

        <h3 className="mt-4 font-semibold">When NOT to Use dns-prefetch</h3>
        <ul className="space-y-2">
          <li>
            <strong>Same-origin resources:</strong> The DNS is already resolved from the page load itself.
          </li>
          <li>
            <strong>Origins you already preconnect to:</strong> Preconnect includes DNS resolution, so
            adding dns-prefetch is redundant (though harmless as a fallback).
          </li>
          <li>
            <strong>Origins you might not actually contact:</strong> While cheap, every hint the browser
            processes has a small CPU cost. For conditional third-party scripts behind user interaction,
            add the hint dynamically.
          </li>
        </ul>
      </section>

      <section>
        <h2>preconnect Deep Dive</h2>
        <p>
          The <code>preconnect</code> hint instructs the browser to establish a full connection to a
          remote origin: DNS resolution, TCP handshake, and TLS negotiation. For HTTPS origins, this
          saves 100-300ms by completing three round trips before the resource is actually requested.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- preconnect to critical third-party origins -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preconnect" href="https://api.example.com" />

<!-- Understanding crossorigin behavior:

  Without crossorigin:
    - Opens a non-CORS connection
    - Used for: <script>, <img>, <link rel="stylesheet">
    - Credentials: cookies sent for same-site

  With crossorigin (or crossorigin="anonymous"):
    - Opens a CORS connection
    - Used for: fonts, fetch(), <img crossorigin>
    - Credentials: no cookies by default

  With crossorigin="use-credentials":
    - Opens a CORS connection WITH credentials
    - Used for: authenticated cross-origin requests

  IMPORTANT: The crossorigin value must match how the resource
  will actually be requested. A mismatch means the preconnected
  connection WON'T be reused, wasting the effort. -->

<!-- Google Fonts needs TWO preconnects:
     1. fonts.googleapis.com (serves CSS) — no crossorigin
     2. fonts.gstatic.com (serves font files) — with crossorigin
        because fonts ALWAYS use CORS -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`}</code>
        </pre>

        <h3 className="mt-4 font-semibold">Connection Pooling and Limits</h3>
        <p>
          Browsers maintain connection pools per origin. Chrome allows up to 6 concurrent connections
          per HTTP/1.1 origin and a single multiplexed connection for HTTP/2 origins. Preconnected
          connections are placed in the pool and reused by the first request to that origin. However,
          unused connections are closed after approximately 10 seconds. This means:
        </p>
        <ul className="space-y-2">
          <li>
            If the resource request happens within 10 seconds of the preconnect, the connection is
            reused and you save the full setup time.
          </li>
          <li>
            If the resource request happens after 10 seconds, the connection has been closed and the
            preconnect effort was wasted.
          </li>
          <li>
            Each open connection consumes ~4KB of memory on the client side and a slot in the server's
            connection pool.
          </li>
        </ul>

        <h3 className="mt-4 font-semibold">How Many preconnects Is Too Many?</h3>
        <p>
          The general recommendation is to limit preconnects to <strong>2-4 critical origins</strong>.
          Chrome's Lighthouse audits flag pages with excessive preconnects. The cost isn't just memory —
          multiple concurrent TLS handshakes compete for CPU on both client and server, and on mobile
          devices with limited processing power, this can delay the critical rendering path rather than
          help it.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Measuring preconnect impact in Chrome DevTools:
// 1. Open Network panel → filter by domain
// 2. Look at the "Connection Start" timing
// 3. With preconnect: Connection Start should be ~0ms
//    (connection was already established)
// 4. Without preconnect: Connection Start shows DNS + TCP + TLS time

// You can also check via the PerformanceObserver API:
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name.includes('api.example.com')) {
      console.log('DNS:', entry.domainLookupEnd - entry.domainLookupStart);
      console.log('TCP:', entry.connectEnd - entry.connectStart);
      console.log('TLS:', entry.secureConnectionStart
        ? entry.connectEnd - entry.secureConnectionStart : 0);
      console.log('TTFB:', entry.responseStart - entry.requestStart);
    }
  }
});
observer.observe({ type: 'resource', buffered: true });`}</code>
        </pre>
      </section>

      <section>
        <h2>prefetch Deep Dive</h2>
        <p>
          The <code>prefetch</code> hint tells the browser to download a resource in the background at
          low priority, storing it in the HTTP cache for use during a <strong>future navigation</strong>.
          Unlike preload, prefetch does not affect the current page — it is purely speculative, preparing
          for where the user might go next.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Static prefetch hints in HTML -->
<link rel="prefetch" href="/static/js/dashboard.chunk.js" />
<link rel="prefetch" href="/static/css/dashboard.css" as="style" />
<link rel="prefetch" href="/api/dashboard/summary" as="fetch" crossorigin />

<!-- Prefetch a full page (HTML document) -->
<link rel="prefetch" href="/dashboard" as="document" />`}</code>
        </pre>

        <h3 className="mt-4 font-semibold">How Prefetch Priority Works</h3>
        <p>
          Prefetched resources are assigned the <strong>lowest priority</strong> in the browser's
          fetch queue. They use idle network bandwidth and will not compete with resources needed for
          the current page. In Chrome, prefetch requests are made with the <code>Purpose: prefetch</code>
          header, and servers can use this to adjust caching behavior or logging.
        </p>
        <p>
          The prefetched resource is stored in the HTTP cache (not a special prefetch cache). It respects
          standard cache headers (<code>Cache-Control</code>, <code>Expires</code>). If the resource has{" "}
          <code>Cache-Control: no-store</code>, the prefetch is effectively wasted. Chrome stores
          prefetched resources for approximately 5 minutes or until the cache is evicted.
        </p>

        <h3 className="mt-4 font-semibold">Dynamic Prefetching Patterns</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Pattern 1: Prefetch on hover (intent signal)
function prefetchOnHover(element, url) {
  let prefetched = false;
  element.addEventListener('mouseenter', () => {
    if (prefetched) return;
    prefetched = true;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }, { once: true });
}

// Apply to all navigation links
document.querySelectorAll('nav a').forEach(anchor => {
  prefetchOnHover(anchor, anchor.href);
});

// Pattern 2: Prefetch on intersection (viewport-based)
const prefetchObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = entry.target.dataset.prefetch;
      document.head.appendChild(link);
      prefetchObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '200px' });

document.querySelectorAll('[data-prefetch]').forEach(el => {
  prefetchObserver.observe(el);
});

// Pattern 3: Prefetch after idle (when main work is done)
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    const routes = ['/dashboard', '/settings', '/profile'];
    routes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      link.as = 'document';
      document.head.appendChild(link);
    });
  }, { timeout: 3000 });
}

// Pattern 4: Respect user preferences
function shouldPrefetch() {
  const conn = navigator.connection;
  if (conn) {
    // Don't prefetch on Save-Data
    if (conn.saveData) return false;
    // Don't prefetch on slow connections
    if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') {
      return false;
    }
  }
  return true;
}`}</code>
        </pre>

        <h3 className="mt-4 font-semibold">prefetch vs Cache Warming</h3>
        <p>
          A common question is how prefetch differs from simply calling <code>fetch()</code> to warm the
          cache. The key differences:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Priority:</strong> <code>prefetch</code> uses idle bandwidth (lowest priority).{" "}
            <code>fetch()</code> uses the "high" priority by default and competes with current-page resources.
          </li>
          <li>
            <strong>Cache behavior:</strong> Both store in the HTTP cache, but <code>prefetch</code> is
            specifically designed for cross-navigation caching.
          </li>
          <li>
            <strong>Browser intelligence:</strong> Browsers may skip prefetch under memory pressure, on
            slow connections, or when Save-Data is enabled. A <code>fetch()</code> call always executes.
          </li>
          <li>
            <strong>Developer tools:</strong> Prefetched resources show a distinct "prefetch" indicator
            in Chrome DevTools, making debugging easier.
          </li>
        </ul>
      </section>

      <section>
        <h2>preload Deep Dive</h2>
        <p>
          The <code>preload</code> hint downloads a resource needed for the <strong>current page</strong>
          at <strong>high priority</strong>. It is the most powerful and most dangerous resource hint —
          powerful because it can eliminate discovery latency for critical resources, dangerous because
          misuse directly wastes bandwidth and can delay other critical resources.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Preload a critical web font -->
<link
  rel="preload"
  href="/fonts/Inter-Bold.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

<!-- Preload the LCP hero image -->
<link
  rel="preload"
  href="/images/hero-banner.webp"
  as="image"
  type="image/webp"
  fetchpriority="high"
/>

<!-- Preload a critical script loaded by another script -->
<link rel="preload" href="/static/js/critical-widget.js" as="script" />

<!-- Preload with responsive images -->
<link
  rel="preload"
  href="/images/hero-mobile.webp"
  as="image"
  media="(max-width: 768px)"
/>
<link
  rel="preload"
  href="/images/hero-desktop.webp"
  as="image"
  media="(min-width: 769px)"
/>

<!-- Preload via HTTP header (earlier than HTML parsing) -->
<!-- In your server response headers: -->
<!-- Link: </fonts/Inter.woff2>; rel=preload; as=font; crossorigin -->
<!-- Link: </critical.css>; rel=preload; as=style -->`}</code>
        </pre>

        <h3 className="mt-4 font-semibold">The "as" Attribute Is Mandatory</h3>
        <p>
          The <code>as</code> attribute serves three purposes:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Priority assignment:</strong> The browser uses <code>as</code> to determine the fetch
            priority. <code>as="style"</code> gets "Highest", <code>as="script"</code> gets "High",{" "}
            <code>as="image"</code> gets "Low" (unless it's the LCP image).
          </li>
          <li>
            <strong>Request matching:</strong> When the resource is actually needed, the browser must
            match the preload response with the actual request. The <code>as</code> value must match the
            resource type, or the browser will discard the preloaded response and re-fetch.
          </li>
          <li>
            <strong>Content-Security-Policy:</strong> The <code>as</code> value determines which CSP
            directive applies. <code>as="script"</code> checks <code>script-src</code>,{" "}
            <code>as="style"</code> checks <code>style-src</code>, etc.
          </li>
        </ul>

        <h3 className="mt-4 font-semibold">Common Preload Targets</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-3 text-left">Resource</th>
                <th className="p-3 text-left">Why Preload</th>
                <th className="p-3 text-left">as Value</th>
                <th className="p-3 text-left">Typical Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3">Web fonts</td>
                <td className="p-3">Hidden inside CSS, discovered late</td>
                <td className="p-3"><code>font</code></td>
                <td className="p-3">200-500ms</td>
              </tr>
              <tr>
                <td className="p-3">LCP image</td>
                <td className="p-3">May be in CSS background or lazy-loaded</td>
                <td className="p-3"><code>image</code></td>
                <td className="p-3">100-400ms</td>
              </tr>
              <tr>
                <td className="p-3">Critical JS</td>
                <td className="p-3">Loaded dynamically by another script</td>
                <td className="p-3"><code>script</code></td>
                <td className="p-3">100-300ms</td>
              </tr>
              <tr>
                <td className="p-3">CSS (imported)</td>
                <td className="p-3">Loaded via @import inside another CSS file</td>
                <td className="p-3"><code>style</code></td>
                <td className="p-3">100-300ms</td>
              </tr>
              <tr>
                <td className="p-3">API data</td>
                <td className="p-3">Component needs data before it can render</td>
                <td className="p-3"><code>fetch</code></td>
                <td className="p-3">200-600ms</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 font-semibold">Preload via HTTP Headers</h3>
        <p>
          Preload can also be specified as an HTTP response header, which is even earlier than an HTML{" "}
          <code>{"<link>"}</code> tag because the browser processes headers before parsing the body. This is
          particularly useful for resources served by a CDN or edge worker:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Express middleware to add preload headers
app.use((req, res, next) => {
  // Preload critical font
  res.setHeader('Link', [
    '</fonts/Inter-Bold.woff2>; rel=preload; as=font; type="font/woff2"; crossorigin',
    '</critical.css>; rel=preload; as=style',
  ].join(', '));
  next();
});

// In a Next.js middleware or API route
export function middleware(request) {
  const response = NextResponse.next();
  response.headers.set('Link',
    '</fonts/Inter.woff2>; rel=preload; as=font; crossorigin'
  );
  return response;
}

// With 103 Early Hints (bleeding edge)
// The server sends a 103 informational response BEFORE the main response
// This allows preloading to start even before the HTML is generated
// Supported in Chrome 103+, Cloudflare, and some CDNs
//
// HTTP/2 103 Early Hints
// Link: </fonts/Inter.woff2>; rel=preload; as=font; crossorigin
// Link: </critical.css>; rel=preload; as=style
//
// (server continues processing...)
//
// HTTP/2 200 OK
// Content-Type: text/html
// <html>...`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">The 3-Second Warning</h3>
        <p>
          Chrome logs a console warning if a preloaded resource is not used within 3 seconds of the
          window's <code>load</code> event:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Chrome DevTools Console warning:
// "The resource https://example.com/font.woff2 was preloaded
//  using link preload but not used within a few seconds from
//  the window's load event. Please make sure it has an appropriate
//  'as' value and it is preloaded intentionally."

// Common causes of this warning:
// 1. Preloaded resource is for a different page (use prefetch instead)
// 2. Preloaded resource type doesn't match 'as' attribute
// 3. crossorigin mismatch (especially for fonts)
// 4. Preloaded resource is conditionally used (media query, A/B test)
// 5. Resource URL in preload doesn't match the actual request URL`}</code>
        </pre>
      </section>

      <section>
        <h2>modulepreload & fetchpriority</h2>

        <h3 className="mt-4 font-semibold">modulepreload</h3>
        <p>
          The <code>modulepreload</code> hint is designed specifically for JavaScript ES modules. Unlike
          regular <code>preload as="script"</code>, <code>modulepreload</code> not only downloads the
          module but also <strong>parses and compiles it</strong> into the module map, making it ready
          for instantiation. It also fetches the module's static import dependencies, avoiding the
          module-loading waterfall that plagues deep import chains.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Without modulepreload: sequential waterfall -->
<!-- Browser downloads app.js → discovers utils.js → downloads →
     discovers math.js → downloads → finally executes -->

<!-- With modulepreload: parallel + pre-parsed -->
<link rel="modulepreload" href="/js/app.js" />
<link rel="modulepreload" href="/js/utils.js" />
<link rel="modulepreload" href="/js/math.js" />
<script type="module" src="/js/app.js"></script>

<!-- Vite automatically generates modulepreload hints -->
<!-- In your built HTML: -->
<link rel="modulepreload" crossorigin href="/assets/index-abc123.js" />
<link rel="modulepreload" crossorigin href="/assets/vendor-def456.js" />
<link rel="modulepreload" crossorigin href="/assets/utils-ghi789.js" />
<script type="module" crossorigin src="/assets/index-abc123.js"></script>

<!-- modulepreload vs preload for modules:
     preload as="script": downloads only (no parse/compile)
     modulepreload: downloads + parses + compiles + fetches deps
     Result: modulepreload is significantly faster for module graphs -->`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">fetchpriority</h3>
        <p>
          The <code>fetchpriority</code> attribute (added to Chrome 101, 2022) provides fine-grained
          control over the relative priority of resource fetches. It accepts three values:{" "}
          <code>high</code>, <code>low</code>, and <code>auto</code> (default). It works on{" "}
          <code>{"<img>"}</code>, <code>{"<script>"}</code>, <code>{"<link>"}</code>, and{" "}
          <code>fetch()</code> calls.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Boost the LCP image priority -->
<img
  src="/hero.webp"
  alt="Hero banner"
  fetchpriority="high"
  width="1200"
  height="600"
/>

<!-- Lower priority for below-the-fold images -->
<img
  src="/testimonial.webp"
  alt="Testimonial"
  fetchpriority="low"
  loading="lazy"
/>

<!-- Boost a preload hint -->
<link
  rel="preload"
  href="/fonts/Inter.woff2"
  as="font"
  type="font/woff2"
  crossorigin
  fetchpriority="high"
/>

<!-- Lower priority for non-critical scripts -->
<script src="/analytics.js" fetchpriority="low" defer></script>

<!-- In fetch() API calls -->
// Critical API call for above-the-fold content
fetch('/api/hero-data', { priority: 'high' });

// Non-critical background sync
fetch('/api/analytics', { priority: 'low' });

<!-- Default browser priority heuristics (Chrome):
     CSS: Highest
     Fonts: High
     Scripts (in <head>): High
     Scripts (async/defer): Low
     Images (in viewport): High
     Images (out of viewport): Low
     fetch(): High
     XHR: High

     fetchpriority overrides these defaults -->`}</code>
        </pre>

        <MermaidDiagram
          chart={`flowchart TD
    subgraph Resource Priority Map
        A["Highest<br/>(render-blocking)"]
        B["High<br/>(important)"]
        C["Medium"]
        D["Low<br/>(deferrable)"]
        E["Lowest<br/>(idle)"]
    end

    A --- A1[CSS in head]
    A --- A2[preload as=style]
    B --- B1[Scripts in head]
    B --- B2[Fonts]
    B --- B3["Images with<br/>fetchpriority=high"]
    C --- C1[Preload as=script]
    D --- D1[Async scripts]
    D --- D2[Images out of viewport]
    D --- D3["Scripts with<br/>fetchpriority=low"]
    E --- E1[Prefetched resources]

    style A fill:#ef4444,color:#fff
    style B fill:#f97316,color:#fff
    style C fill:#eab308,color:#fff
    style D fill:#3b82f6,color:#fff
    style E fill:#6b7280,color:#fff`}
          caption="Chrome's fetch priority levels and how fetchpriority modifies the defaults"
        />
      </section>

      <section>
        <h2>Speculation Rules API</h2>
        <p>
          The <strong>Speculation Rules API</strong> (Chrome 109+) is the modern replacement for the old{" "}
          <code>{"<link rel=\"prerender\">"}</code> hint that was deprecated due to excessive resource
          consumption. It allows you to declare rules for prefetching and prerendering entire pages based
          on URL patterns, link selectors, or explicit URL lists. Prerendered pages load instantly when
          the user navigates to them because the entire page — HTML, CSS, JavaScript, and subresources —
          is already rendered in a hidden tab.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Speculation Rules via <script type="speculationrules"> -->
<script type="speculationrules">
{
  "prefetch": [
    {
      "source": "list",
      "urls": ["/dashboard", "/settings"]
    }
  ],
  "prerender": [
    {
      "source": "list",
      "urls": ["/dashboard"],
      "eagerness": "moderate"
    },
    {
      "source": "document",
      "where": {
        "selector": "a[href^='/']",
        "not": { "selector": "a[data-no-prerender]" }
      },
      "eagerness": "conservative"
    }
  ]
}
</script>

<!-- Eagerness levels:
     "immediate" — prerender as soon as the rule is observed
     "eager" — prerender with minimal delay (similar to immediate)
     "moderate" — prerender on hover (200ms delay)
     "conservative" — prerender on mousedown/touchstart

     "moderate" and "conservative" are safest for most sites
     because they limit wasted work to high-intent signals -->

<!-- Dynamic rules via JavaScript -->
<script>
function addSpeculationRule(url) {
  const script = document.createElement('script');
  script.type = 'speculationrules';
  script.textContent = JSON.stringify({
    prerender: [{
      source: 'list',
      urls: [url],
      eagerness: 'moderate',
    }],
  });
  document.head.appendChild(script);
}

// Prerender based on analytics data showing popular next pages
const topNextPages = ['/dashboard', '/pricing'];
topNextPages.forEach(addSpeculationRule);
</script>`}</code>
        </pre>
        <p>
          The Speculation Rules API respects the user's data saving preferences and won't prerender
          on slow connections. It also manages resource limits — Chrome caps the number of concurrent
          prerenders and cancels low-confidence ones under memory pressure. From a developer perspective,
          prerendered pages must handle the fact that they execute JavaScript before the user navigates
          — use <code>document.prerendering</code> to defer side effects like analytics tracking.
        </p>
      </section>

      <section>
        <h2>Decision Matrix</h2>
        <p>
          Use this table to quickly determine which resource hint is appropriate for your situation:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-3 text-left">Scenario</th>
                <th className="p-3 text-left">Recommended Hint</th>
                <th className="p-3 text-left">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3">Third-party analytics, social widgets</td>
                <td className="p-3"><code>dns-prefetch</code></td>
                <td className="p-3">Cheap DNS resolution; low-priority resources don't warrant preconnect</td>
              </tr>
              <tr>
                <td className="p-3">Google Fonts, critical API origin</td>
                <td className="p-3"><code>preconnect</code></td>
                <td className="p-3">Full connection saves 100-300ms; resource will be fetched within seconds</td>
              </tr>
              <tr>
                <td className="p-3">Next page's JS bundle in a multi-step flow</td>
                <td className="p-3"><code>prefetch</code></td>
                <td className="p-3">Low-priority idle download for future navigation</td>
              </tr>
              <tr>
                <td className="p-3">Font file referenced in CSS</td>
                <td className="p-3"><code>preload</code> + <code>as="font"</code></td>
                <td className="p-3">Critical for current page; browser discovers it too late otherwise</td>
              </tr>
              <tr>
                <td className="p-3">LCP hero image in CSS background</td>
                <td className="p-3"><code>preload</code> + <code>fetchpriority="high"</code></td>
                <td className="p-3">Critical for LCP metric; invisible to preload scanner</td>
              </tr>
              <tr>
                <td className="p-3">ES module dependency chain</td>
                <td className="p-3"><code>modulepreload</code></td>
                <td className="p-3">Downloads + parses + resolves dependency tree in parallel</td>
              </tr>
              <tr>
                <td className="p-3">Above-the-fold images vs below-the-fold</td>
                <td className="p-3"><code>fetchpriority</code> high/low</td>
                <td className="p-3">Reprioritize within same resource type without full preload</td>
              </tr>
              <tr>
                <td className="p-3">Highly likely next page (e.g., checkout step 2)</td>
                <td className="p-3">Speculation Rules (prerender)</td>
                <td className="p-3">Instant navigation — entire page pre-rendered in background</td>
              </tr>
              <tr>
                <td className="p-3">Non-critical third-party script</td>
                <td className="p-3"><code>dns-prefetch</code> + <code>fetchpriority="low"</code></td>
                <td className="p-3">Warm DNS without competing for bandwidth</td>
              </tr>
              <tr>
                <td className="p-3">Data for immediate render (SSR hydration)</td>
                <td className="p-3"><code>preload</code> + <code>as="fetch"</code></td>
                <td className="p-3">Start API call in parallel with JS download</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Framework Integration</h2>

        <h3 className="mt-4 font-semibold">Next.js</h3>
        <p>
          Next.js has deep integration with resource hints. Many are applied automatically, but
          understanding the details lets you fine-tune performance for your specific use case.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Font Optimization (automatic preload) ===
import { Inter, Roboto_Mono } from 'next/font/google';

// next/font downloads fonts at build time, self-hosts them,
// and adds preload hints automatically
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // font-display: swap for no FOIT
});
// Generated HTML:
// <link rel="preload" href="/_next/static/media/Inter-latin.woff2"
//       as="font" type="font/woff2" crossorigin />

// === Route Prefetching (automatic via next/link) ===
import Link from 'next/link';

// Automatically prefetches when link enters viewport
<Link href="/dashboard">Dashboard</Link>

// Prefetch eagerly (production only)
<Link href="/dashboard" prefetch={true}>Dashboard</Link>

// Disable prefetch for unlikely navigations
<Link href="/terms" prefetch={false}>Terms</Link>

// === Script Loading (next/script) ===
import Script from 'next/script';

// Load before page is interactive (analytics, polyfills)
<Script src="/critical-polyfill.js" strategy="beforeInteractive" />

// Load after hydration (default — most third-party scripts)
<Script src="/analytics.js" strategy="afterInteractive" />

// Load during idle time (low-priority tracking, widgets)
<Script src="/chat-widget.js" strategy="lazyOnload" />

// Inline script with strategy
<Script id="gtag" strategy="afterInteractive">
  {\`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());\`}
</Script>

// === Image Optimization (automatic priority) ===
import Image from 'next/image';

// priority prop adds fetchpriority="high" and preload hint
<Image
  src="/hero.webp"
  alt="Hero"
  width={1200}
  height={600}
  priority  // preloads + fetchpriority="high"
/>

// Regular images get loading="lazy" by default
<Image
  src="/testimonial.webp"
  alt="Testimonial"
  width={400}
  height={300}
  // loading="lazy" is default — no preload
/>

// === Manual Preconnect / DNS-Prefetch ===
// In app/layout.tsx or via metadata
export const metadata = {
  other: {
    'link': [
      { rel: 'preconnect', href: 'https://api.example.com' },
    ],
  },
};

// Or directly in the head
import Head from 'next/head';
<Head>
  <link rel="preconnect" href="https://api.example.com" />
  <link rel="dns-prefetch" href="https://cdn.example.com" />
</Head>`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">React (Vite)</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Vite automatically adds modulepreload for chunk dependencies
// Built HTML output includes:
// <link rel="modulepreload" crossorigin href="/assets/vendor-abc.js" />
// <link rel="modulepreload" crossorigin href="/assets/utils-def.js" />

// Manual resource hints in index.html
<!DOCTYPE html>
<html>
<head>
  <link rel="preconnect" href="https://api.example.com" />
  <link rel="dns-prefetch" href="https://analytics.example.com" />
  <link rel="preload" href="/fonts/Inter.woff2" as="font"
        type="font/woff2" crossorigin />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>

// React hook for dynamic prefetching
import { useEffect, useCallback, useRef } from 'react';

function usePrefetch(urls: string[]) {
  const prefetched = useRef(new Set<string>());

  useEffect(() => {
    if (!('requestIdleCallback' in window)) return;

    const id = requestIdleCallback(() => {
      urls.forEach(url => {
        if (prefetched.current.has(url)) return;
        prefetched.current.add(url);

        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
      });
    }, { timeout: 5000 });

    return () => cancelIdleCallback(id);
  }, [urls]);
}

// Usage
function Navigation() {
  usePrefetch(['/dashboard.js', '/settings.js']);
  return <nav>...</nav>;
}

// Preload component for critical resources
function Preload({ href, as, type, crossOrigin }: {
  href: string;
  as: string;
  type?: string;
  crossOrigin?: string;
}) {
  useEffect(() => {
    const existing = document.querySelector(
      \`link[rel="preload"][href="\${href}"]\`
    );
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    if (crossOrigin) link.crossOrigin = crossOrigin;
    document.head.appendChild(link);

    return () => { link.remove(); };
  }, [href, as, type, crossOrigin]);

  return null;
}

// Usage in a component
function App() {
  return (
    <>
      <Preload href="/fonts/Inter.woff2" as="font"
               type="font/woff2" crossOrigin="anonymous" />
      <main>...</main>
    </>
  );
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Measuring Impact</h2>
        <p>
          Resource hints should be validated with measurements, not assumptions. Here's how to verify
          that your hints are working and quantify their impact.
        </p>

        <h3 className="mt-4 font-semibold">Chrome DevTools Analysis</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// 1. Network Panel
// - Filter by resource type (Font, Script, etc.)
// - Check "Connection Start" column — with preconnect it should be ~0
// - Check "Priority" column — preloaded resources show "High"
// - Prefetched resources show in a separate section

// 2. Performance Panel
// - Record a page load
// - Look at the "Network" row for resource timing
// - Compare waterfall with and without hints

// 3. Lighthouse
// - "Preconnect to required origins" audit
// - "Preload key requests" audit
// - "Avoid excessive preloads" warning
// - LCP breakdown showing font/image timing

// 4. Resource Timing API (programmatic measurement)
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    const dns = entry.domainLookupEnd - entry.domainLookupStart;
    const tcp = entry.connectEnd - entry.connectStart;
    const tls = entry.secureConnectionStart > 0
      ? entry.connectEnd - entry.secureConnectionStart
      : 0;
    const ttfb = entry.responseStart - entry.requestStart;
    const download = entry.responseEnd - entry.responseStart;

    console.log(\`\${entry.name}:
      DNS: \${dns.toFixed(1)}ms
      TCP: \${tcp.toFixed(1)}ms
      TLS: \${tls.toFixed(1)}ms
      TTFB: \${ttfb.toFixed(1)}ms
      Download: \${download.toFixed(1)}ms
      Total: \${(entry.responseEnd - entry.startTime).toFixed(1)}ms\`);

    // With preconnect: DNS + TCP + TLS should be ~0ms
    // Without preconnect: DNS 20-120ms, TCP ~50ms, TLS ~50ms
  }
});
observer.observe({ type: 'resource', buffered: true });

// 5. Core Web Vitals correlation
// Monitor LCP improvement from font/image preloads
new PerformanceObserver((list) => {
  const lcpEntry = list.getEntries().at(-1);
  console.log('LCP:', lcpEntry.startTime.toFixed(0), 'ms');
  console.log('LCP Element:', lcpEntry.element?.tagName);
}).observe({ type: 'largest-contentful-paint', buffered: true });`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">WebPageTest Waterfall Comparison</h3>
        <p>
          The most reliable way to measure resource hint impact is to use WebPageTest with and without
          hints and compare the waterfall charts. Key things to look for:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Connection bars:</strong> With preconnect, the green (DNS), orange (TCP), and
            purple (TLS) segments should appear at the start of the waterfall, not inline with the
            resource request.
          </li>
          <li>
            <strong>Font loading:</strong> Without preload, fonts appear late in the waterfall (after
            CSS is parsed). With preload, they start downloading in parallel with CSS.
          </li>
          <li>
            <strong>LCP timing:</strong> Check if the LCP image/text starts loading earlier with hints.
            A 200ms improvement in font preload directly translates to 200ms LCP improvement.
          </li>
          <li>
            <strong>Bandwidth utilization:</strong> The "bandwidth" view shows whether the connection
            is fully utilized or idle. Good hint placement fills idle periods with useful work.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Over-preloading (bandwidth contention):</strong> Every preloaded resource competes
            for bandwidth with other critical resources. If you preload 8 resources, they all fight for
            the same pipe, potentially delaying the most critical ones. Chrome logs warnings for unused
            preloads. Limit to 3-5 preloads maximum, prioritizing resources that are truly critical and
            truly undiscoverable by the preload scanner.
          </li>
          <li>
            <strong>Missing or wrong <code>as</code> attribute:</strong> Without the correct{" "}
            <code>as</code> value, the browser assigns the wrong priority and may double-fetch the
            resource. A preloaded font without <code>as="font"</code> downloads at low priority, then
            downloads again at high priority when the CSS requests it.
          </li>
          <li>
            <strong>crossorigin mismatch:</strong> This is the most common preload bug. Fonts always
            require <code>crossorigin</code> because the CSS Font Loading spec mandates CORS for all
            font requests. If your preload omits <code>crossorigin</code> but the CSS triggers a CORS
            request, the browser discards the preloaded response and re-fetches.
          </li>
          <li>
            <strong>Preloading next-page resources:</strong> Using <code>preload</code> instead of{" "}
            <code>prefetch</code> for resources needed on a different page. Preload fetches at high
            priority and logs a warning when the resource isn't used within 3 seconds. Use{" "}
            <code>prefetch</code> for future navigations.
          </li>
          <li>
            <strong>Excessive preconnects:</strong> More than 4-6 preconnects wastes socket resources
            and can delay the critical rendering path on mobile devices. Each TLS handshake requires
            CPU-intensive cryptographic operations. Prioritize origins that will be contacted within
            the first few seconds.
          </li>
          <li>
            <strong>Hint ordering in HTML:</strong> Place resource hints as early as possible in the{" "}
            <code>{"<head>"}</code>. If they come after render-blocking stylesheets, the browser won't
            process them until after the CSS downloads. Ideally, hints should be the first elements in{" "}
            <code>{"<head>"}</code>, even before <code>{"<meta>"}</code> tags.
          </li>
          <li>
            <strong>Not respecting Save-Data:</strong> Some users enable the Save-Data preference
            to reduce bandwidth usage. While browsers may skip <code>prefetch</code> automatically,
            custom JavaScript-based prefetching (hover, intersection observer) doesn't check for
            this. Always check <code>navigator.connection.saveData</code> before dynamic prefetching.
          </li>
          <li>
            <strong>Stale prefetch cache:</strong> Prefetched resources follow normal HTTP cache rules.
            If a resource has short cache TTLs or <code>no-store</code>, the prefetch may expire before
            the user navigates. Ensure prefetchable resources have adequate cache lifetimes (at least
            5 minutes).
          </li>
          <li>
            <strong>Preloading resources served by service workers:</strong> If a service worker
            intercepts the request, the preloaded response from the network may not match what the
            service worker would return. This can cause cache mismatches or unexpected behavior.
          </li>
          <li>
            <strong>Ignoring HTTP/2 push deprecation:</strong> HTTP/2 Server Push was conceptually
            similar to preload but has been deprecated in Chrome and removed from HTTP/3. Don't confuse
            resource hints with server push — hints are client-initiated and remain the recommended
            approach.
          </li>
        </ul>
      </section>

      <section>
        <h2>Best Practices Summary</h2>
        <ol className="space-y-3">
          <li>
            <strong>Audit your resource waterfall first:</strong> Use Chrome DevTools or WebPageTest to
            identify late-discovered resources before adding hints. Don't guess — measure.
          </li>
          <li>
            <strong>Use dns-prefetch liberally:</strong> It's nearly free. Add it for every third-party
            origin your page contacts. Combine with preconnect as a fallback pattern for critical origins.
          </li>
          <li>
            <strong>Limit preconnects to 2-4 critical origins:</strong> Preconnect to your API server,
            font CDN, and image CDN. Beyond that, use dns-prefetch instead.
          </li>
          <li>
            <strong>Preload only late-discovered critical resources:</strong> Web fonts, LCP images in
            CSS backgrounds, and critical scripts loaded by other scripts. Always include the correct{" "}
            <code>as</code> and <code>crossorigin</code> attributes.
          </li>
          <li>
            <strong>Use prefetch for predicted navigations:</strong> Multi-step flows (checkout,
            onboarding), the most popular next page (from analytics), and hover-triggered prefetching.
          </li>
          <li>
            <strong>Place hints early in <code>{"<head>"}</code>:</strong> Before render-blocking
            resources, before <code>{"<meta>"}</code> tags. Consider using HTTP Link headers or 103
            Early Hints for even earlier delivery.
          </li>
          <li>
            <strong>Leverage framework built-ins:</strong> Next.js <code>next/font</code>,{" "}
            <code>next/link</code>, <code>next/script</code>, and <code>next/image</code> handle most
            hints automatically. Understand what they do so you don't duplicate or conflict.
          </li>
          <li>
            <strong>Use fetchpriority for fine-tuning:</strong> Boost LCP images with{" "}
            <code>fetchpriority="high"</code>. Lower non-critical scripts with{" "}
            <code>fetchpriority="low"</code>. It's simpler than preload for reprioritizing known
            resources.
          </li>
          <li>
            <strong>Consider Speculation Rules for critical navigations:</strong> For high-confidence
            next-page predictions (e.g., search result → product page), prerendering provides instant
            navigation. Use conservative eagerness to limit waste.
          </li>
          <li>
            <strong>Respect user preferences:</strong> Check <code>navigator.connection.saveData</code>
            and <code>navigator.connection.effectiveType</code> before dynamic prefetching. Users on
            slow or metered connections should not pay for speculative downloads.
          </li>
          <li>
            <strong>Monitor and validate:</strong> Add resource hint effectiveness to your performance
            dashboard. Track LCP, TTFB per resource, and unused preload warnings. Remove hints that
            aren't providing measurable improvement.
          </li>
          <li>
            <strong>Prefer <code>modulepreload</code> over <code>preload as="script"</code> for ES
            modules:</strong> It parses and compiles the module and resolves the dependency tree,
            providing significantly better performance for module-heavy applications.
          </li>
        </ol>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-3">
          <li>
            Resource hints bridge the gap between developer knowledge and browser discovery.{" "}
            <code>dns-prefetch</code> resolves DNS early (20-120ms saved), <code>preconnect</code>
            completes the full connection (100-300ms saved), <code>prefetch</code> downloads resources
            for future pages at low priority, and <code>preload</code> downloads critical
            current-page resources at high priority.
          </li>
          <li>
            The <code>as</code> attribute on <code>preload</code> is not optional — it determines
            fetch priority, request matching, and CSP compliance. Missing or wrong <code>as</code>
            causes double-fetches and incorrect prioritization.
          </li>
          <li>
            The <code>crossorigin</code> attribute must match how the resource will actually be
            requested. Fonts always need it because the CSS Font Loading spec mandates CORS. A
            mismatch means the preconnected or preloaded resource is wasted.
          </li>
          <li>
            <strong>preload</strong> is for the current page, <strong>prefetch</strong> is for future
            pages. Confusing them either wastes bandwidth (preloading next-page resources) or loads
            too late (prefetching current-page resources).
          </li>
          <li>
            Over-hinting is a real anti-pattern. Too many preloads cause bandwidth contention, too many
            preconnects waste sockets and CPU. Best practice: 3-5 preloads, 2-4 preconnects, unlimited
            dns-prefetch.
          </li>
          <li>
            <code>modulepreload</code> goes beyond regular preload for ES modules — it downloads,
            parses, compiles, and resolves the dependency tree. Vite adds these automatically.
          </li>
          <li>
            The <code>fetchpriority</code> attribute provides lighter-weight priority control than
            preload. Use <code>fetchpriority="high"</code> on LCP images and{" "}
            <code>fetchpriority="low"</code> on non-critical scripts.
          </li>
          <li>
            The Speculation Rules API enables full page prerenders for predicted navigations, providing
            instant page transitions. Eagerness levels (conservative, moderate) limit wasted work.
          </li>
          <li>
            Frameworks handle many hints automatically: Next.js's <code>next/font</code> preloads
            self-hosted fonts, <code>next/link</code> prefetches routes on viewport entry, and{" "}
            <code>next/image</code> with <code>priority</code> adds preload + fetchpriority="high".
          </li>
          <li>
            Always measure impact with the Resource Timing API, Chrome DevTools waterfall, or
            WebPageTest. Resource hints without measurement is cargo-cult optimization. Track LCP,
            connection timing, and unused preload warnings.
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/preconnect-and-dns-prefetch/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Establish Network Connections Early (preconnect & dns-prefetch)
            </a>
          </li>
          <li>
            <a href="https://web.dev/preload-critical-assets/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Preload Critical Assets to Improve Loading Speed
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — rel=preload
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/prefetch" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Link Prefetching
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/modulepreload" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — modulepreload
            </a>
          </li>
          <li>
            <a href="https://web.dev/fetch-priority/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Optimizing Resource Loading with the Fetch Priority API
            </a>
          </li>
          <li>
            <a href="https://developer.chrome.com/docs/web-platform/prerender-pages" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Chrome Developers — Prerender Pages with the Speculation Rules API
            </a>
          </li>
          <li>
            <a href="https://nextjs.org/docs/app/building-your-application/optimizing/fonts" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Next.js — Font Optimization
            </a>
          </li>
          <li>
            <a href="https://nextjs.org/docs/app/api-reference/components/link" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Next.js — Link Component (Prefetching Behavior)
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/TR/resource-hints/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              W3C — Resource Hints Specification
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
