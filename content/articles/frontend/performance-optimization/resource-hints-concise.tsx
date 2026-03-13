"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-resource-hints-concise",
  title: "Resource Hints (prefetch, preload, preconnect, dns-prefetch)",
  description: "Quick overview of resource hints for optimizing how browsers discover, prioritize, and fetch critical resources.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "resource-hints",
  version: "concise",
  wordCount: 2800,
  readingTime: 12,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "resource-hints", "prefetch", "preload", "preconnect", "dns-prefetch", "web-performance"],
  relatedTopics: ["code-splitting", "lazy-loading", "critical-rendering-path"],
};

export default function ResourceHintsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Resource hints</strong> are declarative instructions you place in your HTML (usually as{" "}
          <code>{"<link>"}</code> elements in the <code>{"<head>"}</code>) that tell the browser to perform
          network operations earlier than it normally would. Without hints, the browser discovers resources
          only when the HTML parser or CSS parser encounters them — which can be too late for critical assets
          like fonts, API domains, or next-page bundles.
        </p>
        <p>
          There are four primary resource hints: <code>dns-prefetch</code>, <code>preconnect</code>,{" "}
          <code>prefetch</code>, and <code>preload</code>. Each operates at a different stage of the
          resource-loading pipeline and serves a distinct purpose. Using them correctly can shave hundreds
          of milliseconds off your page load; using them incorrectly wastes bandwidth and can actually
          hurt performance.
        </p>
        <p>
          Modern browsers also support <code>modulepreload</code> for ES modules, the{" "}
          <code>fetchpriority</code> attribute for fine-grained priority control, and the emerging{" "}
          <strong>Speculation Rules API</strong> for full page prerenders.
        </p>
      </section>

      <section>
        <h2>The Four Resource Hints</h2>

        <h3 className="mt-4 font-semibold">1. dns-prefetch</h3>
        <p>
          Resolves the DNS for an external domain ahead of time. DNS resolution typically takes 20-120ms
          per domain. If your page references multiple third-party origins (analytics, CDN, API), resolving
          them early removes that latency from the critical path.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Resolve DNS for your API domain and CDN --&gt;
<link rel="dns-prefetch" href="https://api.example.com" />
<link rel="dns-prefetch" href="https://cdn.example.com" />
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />

<!-- Cost: negligible (just a DNS lookup, ~1KB UDP packet)
     Benefit: saves 20-120ms per domain on first request
     Browser support: universal (even IE11) --&gt;`}</code>
        </pre>
        <p>
          <strong>When to use:</strong> For any third-party domain your page will contact. It is so cheap
          that there is almost no downside — use it liberally for external origins.
        </p>

        <h3 className="mt-6 font-semibold">2. preconnect</h3>
        <p>
          Establishes the full connection to a remote origin: DNS resolution + TCP handshake + TLS
          negotiation. This is more aggressive than <code>dns-prefetch</code> and saves 100-300ms for
          HTTPS origins. However, each open connection consumes resources on both the client and the
          server, so limit preconnects to 2-4 critical origins.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Full connection setup for critical external origins --&gt;
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preconnect" href="https://api.example.com" />

<!-- The crossorigin attribute matters!
     Without it: connection is for non-CORS requests (scripts, images)
     With it: connection is for CORS requests (fonts, fetch API)
     Google Fonts needs BOTH origins — .googleapis.com for CSS,
     .gstatic.com (crossorigin) for the font files themselves --&gt;

<!-- Cost: DNS + TCP + TLS (~100-300ms of work done early)
     Connections idle-timeout after ~10s if unused
     Limit to 2-4 origins to avoid resource waste --&gt;`}</code>
        </pre>
        <p>
          <strong>When to use:</strong> For origins where you <em>know</em> you will fetch resources within
          the next few seconds. Fonts, critical API calls, and your CDN are prime candidates.
        </p>

        <h3 className="mt-6 font-semibold">3. prefetch</h3>
        <p>
          Downloads a resource that will be needed for a <strong>future navigation</strong>, not the
          current page. The browser fetches it at <strong>low priority</strong> during idle time and stores
          it in the HTTP cache. When the user navigates to the next page, the resource is already cached.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Prefetch the next page's JS bundle --&gt;
<link rel="prefetch" href="/static/js/dashboard.chunk.js" />

<!-- Prefetch a data endpoint for the likely next page --&gt;
<link rel="prefetch" href="/api/dashboard/summary" as="fetch" crossorigin />

<!-- Prefetch CSS for the next page --&gt;
<link rel="prefetch" href="/static/css/dashboard.css" as="style" />

<!-- Dynamic prefetch on hover (common pattern) --&gt;
<script>
document.querySelectorAll('a[data-prefetch]').forEach(link =&gt; {
  link.addEventListener('mouseenter', () =&gt; {
    const prefetchLink = document.createElement('link');
    prefetchLink.rel = 'prefetch';
    prefetchLink.href = link.href;
    document.head.appendChild(prefetchLink);
  }, { once: true });
});
</script>

<!-- Cost: full resource download at LOW priority (idle time)
     Stored in HTTP cache for ~5 minutes
     Browser may ignore if user is on Save-Data or slow connection --&gt;`}</code>
        </pre>
        <p>
          <strong>When to use:</strong> For resources needed by the next likely navigation. Great for
          multi-step flows (checkout, onboarding) where you can predict the next page.
        </p>

        <h3 className="mt-6 font-semibold">4. preload</h3>
        <p>
          Downloads a resource needed for the <strong>current page</strong> at <strong>high priority</strong>.
          Unlike prefetch, preload is mandatory — the browser must fetch it. Use preload for resources the
          browser would discover too late: fonts referenced in CSS, images in below-the-fold CSS, or scripts
          loaded by other scripts.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Preload a critical font (discovered late in CSS) --&gt;
<link
  rel="preload"
  href="/fonts/Inter-Bold.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

<!-- Preload the hero image (LCP element) --&gt;
<link
  rel="preload"
  href="/images/hero-banner.webp"
  as="image"
  type="image/webp"
/>

<!-- Preload a critical script not in the initial HTML --&gt;
<link rel="preload" href="/static/js/critical-widget.js" as="script" />

<!-- Preload with media query (responsive images) --&gt;
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

<!-- The "as" attribute is REQUIRED — it sets fetch priority and
     Content-Security-Policy compliance. Without it, the browser
     fetches at low priority and may double-fetch the resource.

     Common "as" values: script, style, font, image, fetch --&gt;`}</code>
        </pre>
        <p>
          <strong>When to use:</strong> For resources critical to the current page that the browser
          discovers late. The canonical example is web fonts — the browser only learns about them after
          parsing the CSS file that references them, adding 200-500ms of delay.
        </p>
      </section>

      <section>
        <h2>When to Use What</h2>
        <p>
          This comparison table summarizes the key differences and helps you choose the right hint:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-3 text-left">Hint</th>
                <th className="p-3 text-left">What It Does</th>
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Scope</th>
                <th className="p-3 text-left">Cost</th>
                <th className="p-3 text-left">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3"><code>dns-prefetch</code></td>
                <td className="p-3">DNS lookup only</td>
                <td className="p-3">N/A</td>
                <td className="p-3">Future/current</td>
                <td className="p-3">Negligible</td>
                <td className="p-3">Any third-party domain</td>
              </tr>
              <tr>
                <td className="p-3"><code>preconnect</code></td>
                <td className="p-3">DNS + TCP + TLS</td>
                <td className="p-3">N/A</td>
                <td className="p-3">Current page</td>
                <td className="p-3">Low (open socket)</td>
                <td className="p-3">Critical API, font, CDN origins (2-4 max)</td>
              </tr>
              <tr>
                <td className="p-3"><code>prefetch</code></td>
                <td className="p-3">Full download</td>
                <td className="p-3">Low (idle)</td>
                <td className="p-3">Future navigation</td>
                <td className="p-3">Full resource size</td>
                <td className="p-3">Next-page JS/CSS/data</td>
              </tr>
              <tr>
                <td className="p-3"><code>preload</code></td>
                <td className="p-3">Full download</td>
                <td className="p-3">High (mandatory)</td>
                <td className="p-3">Current page</td>
                <td className="p-3">Full resource size</td>
                <td className="p-3">Late-discovered critical resources (fonts, LCP image)</td>
              </tr>
              <tr>
                <td className="p-3"><code>modulepreload</code></td>
                <td className="p-3">Download + parse module</td>
                <td className="p-3">High</td>
                <td className="p-3">Current page</td>
                <td className="p-3">Full module size</td>
                <td className="p-3">ES modules in import chains</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Framework Integration</h2>

        <h3 className="mt-4 font-semibold">Next.js</h3>
        <p>
          Next.js provides built-in support for many resource hints automatically. The framework handles
          font optimization, route prefetching, and script loading priorities out of the box.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// next/font automatically preloads and self-hosts fonts
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
// Generates: <link rel="preload" href="/_next/static/media/Inter.woff2"
//             as="font" type="font/woff2" crossorigin />

// next/link prefetches linked pages automatically
import Link from 'next/link';
<Link href="/dashboard">Dashboard</Link>
// When the link is visible in the viewport, Next.js prefetches
// the dashboard page's JS bundle at low priority

// Disable prefetch for less likely navigations
<Link href="/settings" prefetch={false}>Settings</Link>

// next/script controls loading priority
import Script from 'next/script';
<Script src="/analytics.js" strategy="lazyOnload" />
// strategy options: beforeInteractive, afterInteractive, lazyOnload

// Manual resource hints in metadata (App Router)
export const metadata = {
  other: {
    'link': [
      { rel: 'preconnect', href: 'https://api.example.com' },
      { rel: 'dns-prefetch', href: 'https://cdn.example.com' },
    ],
  },
};`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">React (Vite / CRA)</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Add resource hints in public/index.html or via React Helmet
// public/index.html
<head>
  <link rel="preconnect" href="https://api.example.com" />
  <link rel="dns-prefetch" href="https://analytics.example.com" />
  <link rel="preload" href="/fonts/Inter.woff2" as="font"
        type="font/woff2" crossorigin />
</head>

// Dynamic prefetch with React hooks
import { useCallback } from 'react';

function NavLink({ href, children }) {
  const handleMouseEnter = useCallback(() =&gt; {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }, [href]);

  return (
    <a href={href} onMouseEnter={handleMouseEnter}>
      {children}
    </a>
  );
}

// Prefetch on route-level with React.lazy + manual hint
const Dashboard = React.lazy(() =&gt; import('./pages/Dashboard'));

// Prefetch the chunk after initial load
useEffect(() =&gt; {
  const timer = requestIdleCallback(() =&gt; {
    import('./pages/Dashboard'); // warms the cache
  });
  return () =&gt; cancelIdleCallback(timer);
}, []);`}</code>
        </pre>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Over-hinting (too many preloads):</strong> Every <code>preload</code> competes for
            bandwidth with your critical resources. If you preload 10 resources, you dilute the priority
            of each one. The browser even logs a console warning if a preloaded resource isn't used within
            3 seconds. Limit preloads to 3-5 truly critical resources.
          </li>
          <li>
            <strong>Missing the <code>as</code> attribute on preload:</strong> Without <code>as</code>,
            the browser fetches at low priority and may double-fetch the resource when it's actually
            needed (once as a generic fetch, again as the correct type). Always specify{" "}
            <code>as="font"</code>, <code>as="script"</code>, <code>as="style"</code>, etc.
          </li>
          <li>
            <strong>Missing <code>crossorigin</code> on font preloads:</strong> Fonts are always fetched
            with CORS. If your <code>preload</code> tag omits <code>crossorigin</code>, the browser
            makes a non-CORS request first (wasted), then a CORS request when the CSS triggers the
            actual font load. Always add <code>crossorigin</code> to font preloads.
          </li>
          <li>
            <strong>Preconnecting to too many origins:</strong> Each preconnect opens a TCP connection
            that consumes memory and socket resources. Connections idle-timeout after ~10 seconds. More
            than 4-6 preconnects is counterproductive — the overhead of maintaining unused connections
            outweighs the benefit.
          </li>
          <li>
            <strong>Confusing prefetch and preload:</strong> Using <code>preload</code> for a next-page
            resource wastes bandwidth (it fetches at high priority for something you don't need yet).
            Using <code>prefetch</code> for a current-page critical resource means it loads too late.
            Preload = current page, high priority. Prefetch = future page, low priority.
          </li>
          <li>
            <strong>Not measuring the impact:</strong> Adding hints without verifying they helped is
            cargo-cult optimization. Use Chrome DevTools Network panel, WebPageTest waterfall charts,
            and Lighthouse to confirm that your hints actually improved load times.
          </li>
          <li>
            <strong>Prefetching on metered connections:</strong> Some browsers honor the{" "}
            <code>Save-Data</code> header and skip prefetch, but not all do. Consider checking{" "}
            <code>navigator.connection.saveData</code> before injecting dynamic prefetch hints.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-3">
          <li>
            Resource hints let you tell the browser about resources it hasn't discovered yet.{" "}
            <code>dns-prefetch</code> and <code>preconnect</code> handle connection setup;{" "}
            <code>prefetch</code> and <code>preload</code> handle full resource downloads.
          </li>
          <li>
            <strong>preload</strong> is for the current page's critical resources that the browser
            discovers late (fonts in CSS, LCP images in background styles). It fetches at high priority
            and is mandatory.
          </li>
          <li>
            <strong>prefetch</strong> is for future navigations — it downloads at low priority during
            idle time and caches the resource for when the user navigates. Great for multi-step flows.
          </li>
          <li>
            <strong>preconnect</strong> is the sweet spot for third-party origins you'll definitely hit —
            it saves 100-300ms by completing DNS + TCP + TLS early. Limit to 2-4 critical origins.
          </li>
          <li>
            The <code>as</code> attribute on preload is critical — without it, the browser double-fetches
            and applies wrong priority. The <code>crossorigin</code> attribute must match how the resource
            is actually requested (fonts always need it).
          </li>
          <li>
            Over-hinting is a real anti-pattern. Too many preloads dilute bandwidth; too many preconnects
            waste sockets. Every hint has a cost — only hint resources you are certain will be needed.
          </li>
          <li>
            Modern alternatives include <code>modulepreload</code> for ES module chains,{" "}
            <code>fetchpriority</code> for fine-grained priority control, and the Speculation Rules API
            for full page prerenders.
          </li>
          <li>
            Frameworks like Next.js handle many hints automatically — font preloading via{" "}
            <code>next/font</code>, route prefetching via <code>next/link</code>, and script priority
            via <code>next/script</code>.
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/preconnect-and-dns-prefetch/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Establish Network Connections Early
            </a>
          </li>
          <li>
            <a href="https://web.dev/preload-critical-assets/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Preload Critical Assets
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/prefetch" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Link Prefetching
            </a>
          </li>
          <li>
            <a href="https://developer.chrome.com/docs/web-platform/prerender-pages" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Chrome Developers — Speculation Rules API
            </a>
          </li>
          <li>
            <a href="https://nextjs.org/docs/app/api-reference/components/link" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Next.js — Link Component (Prefetching)
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
