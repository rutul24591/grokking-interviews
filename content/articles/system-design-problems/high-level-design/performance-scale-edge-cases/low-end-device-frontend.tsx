"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-low-end-device-frontend",
  title: "Design Frontend for Low-End Devices (India Scale)",
  description:
    "Architecture for a frontend optimized for low-end Android devices on 2G/3G networks: aggressive bundle splitting and lazy loading, WebP image serving with JPEG fallback, skeleton screens over spinners, server-side rendering to reduce JS parse time, adaptive serving based on Network Information API, critical CSS inlining, resource hints (preconnect/prefetch), lite mode detection, and feature detection over user-agent sniffing.",
  category: "high-level-design",
  subcategory: "performance-scale-edge-cases",
  slug: "low-end-device-frontend",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-12",
  tags: ["hld", "performance", "low-end-device", "india-scale", "2g", "bundle-size", "adaptive-serving", "lite-mode"],
  relatedTopics: ["high-latency-network-optimized-ui", "progressive-hydration-system"],
};

export default function LowEndDeviceFrontendArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Designing for "India scale" means targeting the median Android device — a ₹8,000–12,000 (~$100–150) phone with a Snapdragon 450 or MediaTek Helio P35 processor, 3GB of RAM, 32GB of storage, and a 2G or early 3G connection (effective bandwidth of 50–200 Kbps, latency of 300–600ms). This is not an edge case — it is the primary user for billions of people in India, Southeast Asia, Sub-Saharan Africa, and Latin America. A JavaScript bundle that takes 200ms to parse on a MacBook Pro may take 4–6 seconds to parse on a Snapdragon 450 because the CPU is 20× slower at V8 script evaluation.</p>
        <p>The fundamental constraint is that JavaScript is the most expensive resource on low-end devices — not because of download time (though that matters too on 2G), but because of parse and execution time. A 1MB JS bundle requires the browser to download, decompress, tokenize, parse, compile, and execute the JavaScript — each step consuming scarce CPU cycles. On a low-end device, this can block the main thread for 10–15 seconds, rendering the page completely unresponsive. The solution requires minimizing JavaScript fundamentally (not just compressing it) by using server-rendering, code splitting, and deferring non-critical scripts.</p>
        <p><strong>Explicit scope:</strong> Bundle optimization, adaptive serving, image delivery, skeleton screens, and critical path rendering. Not in scope: backend infrastructure optimization or native app development.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance targets:</strong> Time-to-Interactive (TTI) under 5 seconds on a 3G connection with a Moto G4-class device. First Contentful Paint (FCP) under 2 seconds. Total JavaScript under 100KB gzipped for the initial page load (remaining JS loaded on demand).</li>
          <li><strong>Adaptive serving:</strong> Detect network quality via the Network Information API (navigator.connection.effectiveType: "2g" | "3g" | "4g") and serve different asset variants: on 2G, serve text-only mode (no images, minimal CSS); on 3G, serve WebP images at 50% quality; on 4G+, serve full-quality assets. Device memory detection (navigator.deviceMemory) enables memory-appropriate rendering (reduce animation complexity on &lt;1GB devices).</li>
          <li><strong>Image delivery:</strong> All images served as WebP with JPEG fallback using &lt;picture&gt; elements. Responsive images with srcset serving appropriate resolutions (320w, 480w, 640w). Lazy loading all below-the-fold images (loading="lazy"). Hero images served at 50% quality JPEG on mobile (imperceptible quality loss, 60% file size reduction).</li>
          <li><strong>Offline capability:</strong> Service worker caches the app shell and critical assets after first load. Subsequent visits load from cache, even on no network. Stale content is served from cache with a background fetch for updates.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Bundle size:</strong> Initial JS bundle &lt;100KB gzipped. Total JS (all chunks) &lt;500KB gzipped. Per-route chunks &lt;30KB. Remove all polyfills for modern browser features that low-end Android devices support natively (most 2019+ Android devices support ES2017+).</li>
          <li><strong>Critical CSS:</strong> Inline the critical CSS (above-the-fold styles, ~14KB) in the &lt;head&gt; to eliminate the render-blocking CSS request. Remaining CSS loaded asynchronously with &lt;link rel="preload" as="style" onload="this.rel='stylesheet'"&gt;.</li>
          <li><strong>Resource hints:</strong> &lt;link rel="preconnect"&gt; for CDN and API origins to pre-establish TCP connections during DNS lookup. &lt;link rel="prefetch"&gt; for likely-next-page resources during idle time.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The architecture differentiates between the initial page load (where the goal is maximum server-side rendering to minimize client-side JS execution) and subsequent navigations (where service-worker-cached assets eliminate network round trips). The server detects the client's capabilities via request headers (Save-Data: on, Downlink via the Client Hints ECT header) and serves different asset variants: a "lite" build with minimal CSS and no images for Save-Data mode, a "standard" build for 3G, and a "full" build for 4G+. The CDN (Cloudflare) caches each variant separately by Vary: ECT, Save-Data. The JS bundle is aggressively split: the critical path (router, above-fold component) is the only JS that blocks render; everything else is lazy-loaded when needed.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/performance-scale-edge-cases/low-end-device-frontend.svg"
          alt="Low-end device frontend architecture: adaptive serving (request headers: Save-Data:on, ECT:2g; server selects build variant: lite=no-images+minimal-CSS; standard=WebP+50%Q; full=all features; CDN Vary: ECT,Save-Data — separate cache entry per variant), bundle strategy (initial bundle &lt;100KB gzip: router+critical-component only; route chunks: lazy import() on navigation; third-party: defer all analytics/chat to after TTI; polyfill elimination: target ES2017+ only; tree shaking dead code; Brotli compression CDN), critical rendering path (inline critical CSS ~14KB in head; async non-critical CSS: link rel=preload as=style onload=rel=stylesheet; preconnect CDN + API origins; resource hints: prefetch next-page chunk during idle), image delivery (picture element: source type=image/webp srcset 320w 480w; img src=JPEG fallback; loading=lazy below fold; hero: 50% quality JPEG on 3G saves 60% bytes; serve via Cloudflare Polish auto-WebP), service worker (install: cache app shell + critical fonts + homepage JSON; fetch: cache-first for assets; stale-while-revalidate for API; offline fallback page if no cache; update: background fetch on next visit), skeleton screens (render HTML skeleton immediately from SSR; no spinners — skeleton CSS-animated placeholders match layout; content swap: when data arrives replace skeleton with real content — no layout shift)."
          caption="Adaptive serving (Vary: ECT,Save-Data variant caching), aggressive bundle splitting (&lt;100KB initial gzip), critical CSS inlining, async non-critical CSS, resource hints (preconnect/prefetch), WebP/srcset/lazy image delivery, service worker (cache-first + stale-while-revalidate), and skeleton screens over spinners"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bundle Size Optimization</h3>
        <p>The single most impactful optimization for low-end devices is reducing JavaScript. The target: initial JS bundle under 100KB gzipped (approximately 300KB uncompressed — the amount a low-end browser can parse in under 2 seconds). Strategies: (1) Route-based code splitting: each page gets its own chunk, loaded only when the route is visited. The home page chunk does not include the profile editor code. (2) Component lazy loading: heavy components (image gallery, rich text editor, video player) are loaded on-demand via dynamic import(), showing a skeleton in the meantime. (3) Third-party script deferral: analytics, chat widgets, and A/B testing scripts are loaded after the main thread is idle (using requestIdleCallback or a 3-second setTimeout), so they do not block TTI. (4) Polyfill elimination: most Android devices from 2019+ support ES2017 natively. Removing polyfills for Array.flat(), Object.entries(), Promise, fetch, and IntersectionObserver saves 15–30KB. Use @babel/preset-env with browserslist targets matching the actual user base.</p>
        <p>Brotli compression reduces bundle sizes by 20–30% compared to gzip. Brotli-compressed files are served to clients that include Accept-Encoding: br (all modern browsers). The CDN (Cloudflare) applies Brotli compression at the edge, so origin servers serve uncompressed files and the CDN handles compression with cached compressed responses. This offloads CPU compression from origin servers.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Adaptive Image Serving</h3>
        <p>The &lt;picture&gt; element provides format and resolution switching without JavaScript. For a product image: &lt;picture&gt;&lt;source type="image/webp" srcset="img-320.webp 320w, img-640.webp 640w" sizes="(max-width: 480px) 320px, 640px"&gt;&lt;img src="img-640.jpg" loading="lazy" decoding="async" alt="Product"&gt;&lt;/picture&gt;. The browser selects WebP if supported, falls back to JPEG if not. The srcset with sizes causes the browser to select the appropriate resolution based on the device's display width and pixel density — a 360px wide screen gets the 320w WebP, not the full 640w image. On 2G (detected server-side via Client Hints), images are omitted entirely from the initial HTML (replaced with colored placeholder divs) and loaded lazily after the page is interactive.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Critical Rendering Path</h3>
        <p>The critical rendering path for above-the-fold content must complete in under 2 seconds on 3G (600ms network latency + 1.4 seconds for content). Every render-blocking resource in the &lt;head&gt; adds to this budget. Strategy: (1) Inline critical CSS (above-the-fold styles only, extracted by PurgeCSS + Critical) directly in the &lt;head&gt; — eliminates the render-blocking CSS request. (2) Load remaining CSS asynchronously: &lt;link rel="preload" as="style" href="styles.css" onload="this.rel='stylesheet'"&gt;. (3) All non-critical scripts use defer or async attributes. (4) Preconnect to CDN and API origins: &lt;link rel="preconnect" href="https://cdn.example.com" crossorigin&gt; — establishes TCP + TLS handshake during DNS lookup, saving 200–500ms on first resource fetch. (5) The HTML sent from the server includes the above-the-fold content (rendered server-side) so the user sees real content at FCP, not a blank page waiting for JS.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Service Worker and Offline Strategy</h3>
        <p>After the first visit, a service worker takes over all network requests for assets. Cache strategy per resource type: (1) App shell (HTML, CSS, core JS): Cache-first — serve from cache immediately, no network. (2) API responses: Stale-while-revalidate — serve cached response immediately, fetch update in background. (3) Images: Cache-first with fallback to network, cache response if successful. (4) Offline page: If a navigation request fails (no network, no cache), serve a pre-cached offline.html page that explains the situation and provides a "try again" button.</p>
        <p>On 2G connections, the service worker's stale-while-revalidate strategy is particularly valuable: the user sees last-known content instantly (from cache) while the network slowly fetches the update. Without the service worker, the user on 2G would stare at a spinner for 5–10 seconds before seeing anything. The difference between "instant stale content" and "5-second spinner" is the difference between an app feeling usable and feeling broken.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>SSR vs. CSR for low-end devices: CSR (client-side rendering) requires downloading, parsing, and executing JavaScript before any content is visible. On a low-end device, this can mean 10+ seconds to First Contentful Paint. SSR sends pre-rendered HTML from the server — the user sees content immediately as the HTML streams in, before any JavaScript executes. For low-end devices, SSR is strongly preferred for the initial page load. The trade-off: SSR requires server infrastructure and increases server costs. For high-traffic applications serving low-end device users, the improved user retention from faster TTI typically justifies the SSR server cost.</p>
        <p>Feature detection vs. user-agent sniffing: User-agent strings are unreliable (spoofed, outdated, ambiguous) and do not reflect actual device capabilities. Feature detection uses JavaScript APIs to check capabilities directly: if (navigator.connection) to check Network Information API support; if (navigator.deviceMemory &lt; 1) for low-memory detection. For server-side detection, Client Hints (Accept-CH: ECT, Device-Memory, Viewport-Width request headers) provide structured device capability data from the browser to the server — more reliable than User-Agent parsing.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A frontend optimized for low-end devices (India scale) targets TTI &lt;5s on 3G with Moto G4-class devices through four primary strategies: (1) JavaScript minimization (initial bundle &lt;100KB gzip via route splitting, component lazy loading, third-party deferral after TTI, polyfill elimination for ES2017+ targets, Brotli compression); (2) adaptive serving (ECT + Save-Data Client Hints → server selects lite/standard/full build variant; CDN Vary header caches per variant); (3) critical rendering path (inline critical CSS ~14KB, async non-critical CSS via preload/onload, preconnect for CDN/API origins, SSR for above-fold content); and (4) service worker (cache-first app shell, stale-while-revalidate API, offline fallback page). Skeleton screens (CSS-animated placeholders from SSR) replace spinners, eliminating the perception of blank loading time. The defining insight: JavaScript parse/execute time, not download time, is the primary bottleneck on low-end devices — the fastest JavaScript is the JavaScript you never ship.</p>
      </section>
    </ArticleLayout>
  );
}
