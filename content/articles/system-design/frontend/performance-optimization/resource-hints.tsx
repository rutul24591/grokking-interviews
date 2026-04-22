"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-resource-hints",
  title: "Resource Hints (prefetch, preload, preconnect, dns-prefetch)",
  description: "Comprehensive guide to resource hints for optimizing how browsers discover, prioritize, and fetch critical resources.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "resource-hints",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "performance", "resource-hints", "prefetch", "preload", "preconnect", "dns-prefetch", "web-performance"],
  relatedTopics: ["code-splitting", "lazy-loading", "critical-rendering-path", "web-vitals"],
};

export default function ResourceHintsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Resource hints</strong> are declarative instructions you place in your HTML (typically as 
          <code>&lt;link&gt;</code> elements in the <code>&lt;head&gt;</code>) that tell the browser to perform 
          <Highlight tier="important">network operations earlier</Highlight> than it normally would. Without hints, the browser discovers resources 
          only when the HTML parser or CSS parser encounters them — which can be too late for critical assets 
          like fonts, API domains, or next-page bundles.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          There are four primary resource hints: <code>dns-prefetch</code>, <code>preconnect</code>, 
          <code>prefetch</code>, and <code>preload</code>. Each operates at a different stage of the 
          resource-loading pipeline and serves a distinct purpose. Using them correctly can shave hundreds 
          of milliseconds off your page load; using them incorrectly wastes bandwidth and can actually 
          hurt performance.
        </HighlightBlock>
        <p>
          The performance impact of resource hints is significant:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>dns-prefetch:</strong> Saves 20-120ms per domain by resolving DNS early.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>preconnect:</strong> Saves 100-300ms by establishing full connection (DNS + TCP + TLS) early.
          </HighlightBlock>
          <li>
            <strong>preload:</strong> Eliminates late-discovery delay for critical resources like fonts and LCP images.
          </li>
          <li>
            <strong>prefetch:</strong> Makes next-page navigation feel instant by downloading resources during idle time.
          </li>
        </ul>
        <p>
          Modern browsers also support <code>modulepreload</code> for ES modules, the 
          <code>fetchpriority</code> attribute for fine-grained priority control, and the emerging 
          <strong>Speculation Rules API</strong> for full page prerenders.
        </p>
        <p>
          In system design interviews, resource hints demonstrate understanding of the browser loading pipeline, 
          network optimization, and the trade-offs between early fetching and bandwidth efficiency.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="crucial">
          Core concept: hints change when the browser does work. Preload is{" "}
          <Highlight tier="important">mandatory for current-page critical</Highlight>; prefetch is{" "}
          <Highlight tier="important">optional for future</Highlight>. The common senior failure mode is
          over-hinting and harming the true critical path.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The interview-ready distinction: preload = current page and high priority; prefetch = future navigation and low priority.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Hints only matter if they change discovery time. Preloading something already discovered early is usually wasted markup.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/resource-hints-overview.svg"
          alt="Diagram showing four resource hints cards: dns-prefetch, preconnect, prefetch, and preload with their characteristics and use cases"
          caption="Four key resource hints: dns-prefetch and preconnect for connection setup, prefetch and preload for resource downloads"
          captionTier="important"
        />

        <h3>The Four Resource Hints</h3>

        <h4>1. dns-prefetch</h4>
        <p>
          Resolves the DNS for an external domain ahead of time. DNS resolution typically takes 20-120ms 
          per domain. If your page references multiple third-party origins (analytics, CDN, API), resolving 
          them early removes that latency from the critical path.
        </p>
        <p>
          <strong>When to use:</strong> For any third-party domain your page will contact. It is so cheap 
          that there is almost no downside — use it liberally for external origins.
        </p>
        <p>
          <strong>Cost:</strong> Negligible (just a DNS lookup, approximately 1KB UDP packet).
        </p>

        <h4>2. preconnect</h4>
        <p>
          Establishes the full connection to a remote origin: DNS resolution + TCP handshake + TLS 
          negotiation. This is more aggressive than <code>dns-prefetch</code> and saves 100-300ms for 
          HTTPS origins. However, each open connection consumes resources on both the client and the 
          server, so limit preconnects to 2-4 critical origins.
        </p>
        <p>
          <strong>When to use:</strong> For origins where you know you will fetch resources within 
          the next few seconds. Fonts, critical API calls, and your CDN are prime candidates.
        </p>
        <p>
          <strong>Cost:</strong> Low (open socket that idle-timeouts after approximately 10 seconds if unused).
        </p>

        <h4>3. prefetch</h4>
        <p>
          Downloads a resource that will be needed for a <strong>future navigation</strong>, not the 
          current page. The browser fetches it at <strong>low priority</strong> during idle time and stores 
          it in the HTTP cache. When the user navigates to the next page, the resource is already cached.
        </p>
        <p>
          <strong>When to use:</strong> For resources needed by the next likely navigation. Great for 
          multi-step flows (checkout, onboarding) where you can predict the next page.
        </p>
        <p>
          <strong>Cost:</strong> Full resource size, but fetched at low priority during idle time.
        </p>

        <h4>4. preload</h4>
        <p>
          Downloads a resource needed for the <strong>current page</strong> at <strong>high priority</strong>. 
          Unlike prefetch, preload is mandatory — the browser must fetch it. Use preload for resources the 
          browser would discover too late: fonts referenced in CSS, images in below-the-fold CSS, or scripts 
          loaded by other scripts.
        </p>
        <p>
          <strong>When to use:</strong> For resources critical to the current page that the browser 
          discovers late. The canonical example is web fonts — the browser only learns about them after 
          parsing the CSS file that references them, adding 200-500ms of delay.
        </p>
        <p>
          <strong>Cost:</strong> Full resource size, fetched immediately at high priority.
        </p>

        <h3>The &quot;as&quot; Attribute</h3>
        <p>
          For <code>preload</code>, the <code>as</code> attribute is required. It tells the browser:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>What type of resource:</strong> <code>script</code>, <code>style</code>, <code>font</code>, 
            <code>image</code>, <code>fetch</code>, etc.
          </li>
          <li>
            <strong>Fetch priority:</strong> Without <code>as</code>, the browser fetches at low priority.
          </li>
          <li>
            <strong>CSP compliance:</strong> Content Security Policy checks the <code>as</code> value.
          </li>
        </ul>
        <p>
          Without the <code>as</code> attribute, the browser may double-fetch the resource: once as a 
          generic fetch (due to preload), and again as the correct type when actually needed.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          The flow to explain: resource discovery timing → priority queue → connection warm-up → fetch/parse.
          You should be able to read a network waterfall and justify each hint.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Architecture includes constraints: Save-Data, metered connections, and third-party origins. Your hint strategy should respect user intent and bandwidth.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Explain how hints interact with SSR/streaming: server-rendered HTML can expose critical resources earlier, reducing the need for aggressive hints.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/resource-hints-timeline.svg"
          alt="Timeline showing when each resource hint operates during page load: dns-prefetch during HTML parse, preconnect early, preload immediately, prefetch during idle time"
          caption="Resource hints timeline: each hint operates at different stages of the page load lifecycle"
        />

        <h3>Resource Discovery Flow</h3>
        <p>
          Without resource hints, the browser follows this discovery pattern:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Parse HTML:</strong> Browser starts building the DOM.
          </li>
          <li>
            <strong>Discover resource:</strong> Parser encounters a <code>&lt;link&gt;</code>, 
            <code>&lt;script&gt;</code>, or <code>&lt;img&gt;</code> tag.
          </li>
          <li>
            <strong>Queue download:</strong> Resource is added to the download queue.
          </li>
          <li>
            <strong>Download:</strong> Resource is fetched (may wait for earlier resources).
          </li>
          <li>
            <strong>Process:</strong> Resource is parsed, executed, or rendered.
          </li>
        </ol>
        <p>
          This sequential discovery means resources deep in the HTML or referenced in CSS are discovered 
          late, adding 200-500ms of delay.
        </p>
        <p>
          Resource hints change this flow by telling the browser about resources <strong>before</strong> 
          the parser would naturally discover them. This eliminates the discovery delay.
        </p>

        <h3>Connection Setup Flow</h3>
        <p>
          For third-party resources, the browser must first establish a connection:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>DNS Lookup:</strong> Resolve domain name to IP address (20-120ms).
          </li>
          <li>
            <strong>TCP Handshake:</strong> Establish TCP connection (1-2 round trips).
          </li>
          <li>
            <strong>TLS Negotiation:</strong> Establish secure connection (1-2 round trips for HTTPS).
          </li>
          <li>
            <strong>Request/Response:</strong> Finally fetch the resource.
          </li>
        </ol>
        <p>
          Without <code>preconnect</code>, this entire sequence happens when the resource is discovered. 
          With <code>preconnect</code>, steps 1-3 are completed early, so step 4 can begin immediately 
          when the resource is needed.
        </p>

        <h3>Framework Integration</h3>
        <p>
          Modern frameworks provide built-in support for resource hints:
        </p>

        <h4>Next.js</h4>
        <p>
          Next.js handles many resource hints automatically:
        </p>
        <ul className="space-y-1">
          <li>• <code>next/font</code> automatically preloads and self-hosts fonts</li>
          <li>• <code>next/link</code> prefetches linked pages when visible in viewport</li>
          <li>• <code>next/script</code> controls loading priority with strategy prop</li>
          <li>• Metadata API supports link tags for preconnect, prefetch, etc.</li>
        </ul>

        <h4>React (Vite / CRA)</h4>
        <p>
          For React applications without framework-level support:
        </p>
        <ul className="space-y-1">
          <li>• Add resource hints in <code>public/index.html</code></li>
          <li>• Use React Helmet for dynamic hint injection</li>
          <li>• Implement hover-based prefetching for navigation links</li>
          <li>• Use <code>requestIdleCallback</code> for idle-time prefetching</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>

        <HighlightBlock as="p" tier="crucial">
          Resource hints are about{" "}
          <Highlight tier="important">manipulating the browser&apos;s priority queue</Highlight>. The failure
          mode is predictable: you over-hint and accidentally delay the true critical path. In interviews,
          explain how you decide what is LCP-critical vs &quot;nice to have&quot; and how you validate with
          network waterfalls and field data.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Preload is the sharpest tool: it changes fetch priority and can steal bandwidth from CSS/HTML if overused.
          Use it for a small set of truly critical assets (fonts, LCP image, critical scripts) and ensure the browser
          can actually reuse the response (correct <code>as</code>, <code>crossorigin</code> when needed, and proper caching).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Prefetch is a bet: it can make navigation feel instant, but on slow/metered networks it&apos;s pure waste.
          Senior answers mention conditional prefetch (Save-Data, effectiveType), and measuring real navigation hit rate.
        </HighlightBlock>

        <h3>Comparison Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
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
                <td className="p-3 font-medium"><code>dns-prefetch</code></td>
                <td className="p-3">DNS lookup only</td>
                <td className="p-3">N/A</td>
                <td className="p-3">Future/current</td>
                <td className="p-3">Negligible</td>
                <td className="p-3">Any third-party domain</td>
              </tr>
              <tr>
                <td className="p-3 font-medium"><code>preconnect</code></td>
                <td className="p-3">DNS + TCP + TLS</td>
                <td className="p-3">N/A</td>
                <td className="p-3">Current page</td>
                <td className="p-3">Low (open socket)</td>
                <td className="p-3">Critical origins (2-4 max)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium"><code>prefetch</code></td>
                <td className="p-3">Full download</td>
                <td className="p-3">Low (idle)</td>
                <td className="p-3">Future navigation</td>
                <td className="p-3">Full resource size</td>
                <td className="p-3">Next-page JS/CSS/data</td>
              </tr>
              <tr>
                <td className="p-3 font-medium"><code>preload</code></td>
                <td className="p-3">Full download</td>
                <td className="p-3">
                  <Highlight tier="important">High (mandatory)</Highlight>
                </td>
                <td className="p-3">Current page</td>
                <td className="p-3">Full resource size</td>
                <td className="p-3">Late-discovered critical resources</td>
              </tr>
              <tr>
                <td className="p-3 font-medium"><code>modulepreload</code></td>
                <td className="p-3">Download + parse module</td>
                <td className="p-3">High</td>
                <td className="p-3">Current page</td>
                <td className="p-3">Full module size</td>
                <td className="p-3">ES modules in import chains</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>When to Use What</h3>
        <ul className="space-y-2">
          <li>
            <strong>Third-party domains you&apos;ll contact:</strong> Use <code>dns-prefetch</code> 
            liberally, <code>preconnect</code> for critical ones.
          </li>
          <li>
            <strong>Fonts referenced in CSS:</strong> Use <code>preload</code> with <code>as=&quot;font&quot;</code> 
            and <code>crossorigin</code>.
          </li>
          <li>
            <strong>LCP image:</strong> Use <code>preload</code> with <code>as=&quot;image&quot;</code> 
            if it&apos;s in CSS or discovered late.
          </li>
          <li>
            <strong>Next page in a flow:</strong> Use <code>prefetch</code> for predictable navigation 
            (checkout steps, onboarding).
          </li>
          <li>
            <strong>ES module dependencies:</strong> Use <code>modulepreload</code> for module chains.
          </li>
        </ul>

        <h3>Common Mistakes</h3>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/resource-hints-mistakes.svg"
          alt="Diagram showing four common resource hints mistakes: too many preloads, missing crossorigin on fonts, using preload for next page, and too many preconnects"
          caption="Common mistakes: over-hinting, missing attributes, and using wrong hint type for the use case"
        />

        <ul className="space-y-2">
          <li>
            <strong>Over-hinting:</strong> Preloading 10+ resources dilutes priority and wastes bandwidth. 
            Limit to 3-5 truly critical resources.
          </li>
          <li>
            <strong>Missing crossorigin on font preloads:</strong> Fonts are fetched with CORS. Without 
            <code>crossorigin</code> on the preload, the browser double-fetches.
          </li>
          <li>
            <strong>Using preload for next-page resources:</strong> Preload is for the current page. 
            Use <code>prefetch</code> for future navigation.
          </li>
          <li>
            <strong>Preconnecting to too many origins:</strong> Each preconnect holds an open socket. 
            Limit to 2-4 critical origins.
          </li>
          <li>
            <strong>Missing the &quot;as&quot; attribute:</strong> Without <code>as</code>, preload 
            fetches at low priority and may double-fetch.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="crucial">
          Best practices: preload only a few truly critical resources, preconnect to 2-4 origins max, respect
          Save-Data, and continuously audit hints for unused preloads.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Treat hints like production config: revisit quarterly, remove unused preloads, and validate via waterfalls and field data.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Use preload for LCP-critical assets (fonts/hero image) and avoid preloading non-critical JS that can steal bandwidth from LCP.
        </HighlightBlock>

        <h3>Preconnect Sparingly</h3>
        <p>
          Limit <code>preconnect</code> to 2-4 critical origins. Each open connection consumes memory 
          and socket resources. Connections idle-timeout after approximately 10 seconds if unused.
        </p>
        <p>
          Good candidates for preconnect:
        </p>
        <ul className="space-y-1">
          <li>• Your API domain (if called early)</li>
          <li>• Font CDN (Google Fonts, Adobe Fonts)</li>
          <li>• Image CDN (Cloudinary, Imgix)</li>
          <li>• Your own CDN domain</li>
        </ul>

        <h3>Always Use crossorigin for Fonts</h3>
        <p>
          Font files are fetched with CORS. Your preload must match:
        </p>
        <ul className="space-y-1">
          <li>• <code>&lt;link rel=&quot;preload&quot; href=&quot;font.woff2&quot; as=&quot;font&quot; crossorigin&gt;</code></li>
        </ul>
        <p>
          Without <code>crossorigin</code>, the browser makes a non-CORS preload request (wasted), 
          then a CORS request when the CSS triggers the actual font load.
        </p>

        <h3>Preload Only Late-Discovered Resources</h3>
        <p>
          Don&apos;t preload resources the browser already discovers early. Good candidates:
        </p>
        <ul className="space-y-1">
          <li>• Fonts (discovered after CSS parses)</li>
          <li>• LCP images in CSS backgrounds</li>
          <li>• Critical scripts loaded by other scripts</li>
          <li>• Key CSS files referenced in JavaScript</li>
        </ul>

        <h3>Prefetch Likely Next Pages</h3>
        <p>
          Use <code>prefetch</code> for resources needed by the next likely navigation:
        </p>
        <ul className="space-y-1">
          <li>• Next step in a multi-step flow (checkout, onboarding)</li>
          <li>• Pages linked in primary navigation</li>
          <li>• Resources for likely user actions (edit, view details)</li>
        </ul>
        <p>
          Implement hover-based prefetching: when a user hovers over a link for 100-200ms, prefetch 
          the linked page. This provides near-instant navigation for intentional clicks.
        </p>

        <h3>Use modulepreload for ES Modules</h3>
        <p>
          For ES module imports, use <code>modulepreload</code> instead of <code>preload</code>:
        </p>
        <ul className="space-y-1">
          <li>• <code>modulepreload</code> fetches and parses the module</li>
          <li>• Handles module dependencies correctly</li>
          <li>• Prevents double-parsing of modules</li>
        </ul>

        <h3>Measure the Impact</h3>
        <p>
          Always verify that hints are helping:
        </p>
        <ul className="space-y-1">
          <li>• Check Chrome DevTools Network panel for timing improvements</li>
          <li>• Use WebPageTest waterfall charts to see resource discovery timing</li>
          <li>• Run Lighthouse to catch preload/prefetch issues</li>
          <li>• Monitor for preload warnings (unused within 3 seconds)</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3>Over-Hinting</h3>
        <HighlightBlock as="p" tier="crucial">
          Preloading too many resources dilutes the priority of each one. If you preload 10 resources, 
          the browser may not prioritize the truly critical ones. Chrome even logs a console warning if 
          a preloaded resource isn&apos;t used within 3 seconds.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Limit preloads to 3-5 truly critical resources. Audit your preloads 
          quarterly and remove unused ones.
        </p>

        <h3>Confusing prefetch and preload</h3>
        <HighlightBlock as="p" tier="important">
          Using <code>preload</code> for a next-page resource wastes bandwidth (it fetches at high 
          priority for something you don&apos;t need yet). Using <code>prefetch</code> for a current-page 
          critical resource means it loads too late.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Remember: <strong>preload = current page, high priority</strong>. 
          <strong>prefetch = future page, low priority</strong>.
        </p>

        <h3>Not Handling Prefetch on Metered Connections</h3>
        <HighlightBlock as="p" tier="important">
          Prefetching on slow or metered connections can waste user bandwidth. Some browsers honor the 
          <code>Save-Data</code> header and skip prefetch, but not all do.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Check <code>navigator.connection.saveData</code> before injecting 
          dynamic prefetch hints. Respect user preferences.
        </p>

        <h3>Preloading Without Need</h3>
        <p>
          Preloading resources the browser already discovers early provides no benefit and adds markup 
          bloat. For example, preloading a script that&apos;s already in the HTML head is redundant.
        </p>
        <p>
          <strong>Solution:</strong> Only preload resources that would otherwise be discovered late 
          (fonts in CSS, images in CSS, scripts loaded by scripts).
        </p>

        <h3>Ignoring Browser Caching</h3>
        <p>
          Preloaded resources that aren&apos;t used may still be cached. On subsequent navigations, 
          the cached resource is used without a new preload. This is usually fine, but be aware of 
          caching behavior.
        </p>
        <p>
          <strong>Solution:</strong> Understand your cache headers. Preloaded resources follow normal 
          HTTP caching rules.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="crucial">
          Use cases: speeding up LCP fonts/images (preload), reducing third-party handshake latency (preconnect),
          and making common navigation paths feel instant (prefetch).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Use cases should include what you measured: LCP delta, navigation latency delta, and whether INP regressed.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Mention the failure mode: over-hinting and wasting bandwidth. Show how you prevented it (limits, audits).
        </HighlightBlock>

        <h3>Font Optimization for News Site</h3>
        <p>
          A news publisher&apos;s LCP was 3.2s, with web fonts loading 400ms after CSS parse. They 
          implemented font preloading:
        </p>
        <ul className="space-y-1">
          <li>• Added <code>&lt;link rel=&quot;preload&quot; as=&quot;font&quot; crossorigin&gt;</code> for primary font</li>
          <li>• Used <code>font-display: swap</code> with size-adjust fallback</li>
          <li>• Preconnected to font CDN</li>
        </ul>
        <p>
          Results: LCP improved from 3.2s to 2.4s (25% improvement). Font-related layout shift eliminated.
        </p>

        <h3>E-Commerce Checkout Flow</h3>
        <p>
          An e-commerce site implemented prefetching for their multi-step checkout:
        </p>
        <ul className="space-y-1">
          <li>• Cart page prefetches shipping page</li>
          <li>• Shipping page prefetches payment page</li>
          <li>• Payment page prefetches confirmation page</li>
        </ul>
        <p>
          Results: Checkout step transitions felt instant (200ms → 50ms). Cart abandonment decreased 8%.
        </p>

        <h3>SaaS Dashboard API Optimization</h3>
        <p>
          A SaaS dashboard preconnected to their API domain and prefetched user data:
        </p>
        <ul className="space-y-1">
          <li>• Preconnected to <code>api.example.com</code> in HTML head</li>
          <li>• Prefetched user profile API on login</li>
          <li>• Used <code>fetchPriority=&quot;high&quot;</code> for critical API calls</li>
        </ul>
        <p>
          Results: Time to first API response: 450ms → 180ms. Dashboard interactive 60% faster.
        </p>

        <h3>Image-Heavy Portfolio Site</h3>
        <p>
          A photography portfolio site optimized LCP image loading:
        </p>
        <ul className="space-y-1">
          <li>• Preloaded hero image with <code>as=&quot;image&quot;</code></li>
          <li>• Used <code>fetchPriority=&quot;high&quot;</code> for LCP image</li>
          <li>• Prefetched gallery images for likely next navigation</li>
        </ul>
        <p>
          Results: LCP improved from 4.1s to 1.9s. Bounce rate decreased 15%.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview bar: explain each hint, the cost model, and how you verify hints helped (waterfalls + field data) without harming LCP/INP.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Strong answers stress restraint: 3–5 preloads max, 2–4 preconnects, and Save-Data awareness.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Call out the most common mistake: confusing preload and prefetch.
        </HighlightBlock>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What are resource hints and why are they important?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Resource hints are declarative instructions (<code>&lt;link&gt;</code> tags) that tell the 
              browser to perform network operations earlier than normal. The four main types are:
            </p>
            <ul className="space-y-1">
              <li>• <strong>dns-prefetch:</strong> Resolve DNS early (saves 20-120ms)</li>
              <li>• <strong>preconnect:</strong> Establish full connection early (saves 100-300ms)</li>
              <li>• <strong>prefetch:</strong> Download future-page resources at low priority</li>
              <li>• <strong>preload:</strong> Download current-page critical resources at high priority</li>
            </ul>
            <p className="mt-3">
              They&apos;re important because they eliminate resource discovery delays. Without hints, the 
              browser only discovers resources when the parser encounters them — which can be too late for 
              critical assets like fonts or LCP images.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What&apos;s the difference between preload and prefetch?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <HighlightBlock as="p" tier="crucial" className="mb-3">
              The key differences:
            </HighlightBlock>
            <ul className="space-y-1">
              <li>• <strong>preload:</strong> For the <em>current page</em>. Fetches at HIGH priority. Mandatory — browser must fetch it.</li>
              <li>• <strong>prefetch:</strong> For <em>future navigation</em>. Fetches at LOW priority during idle time. Optional — browser may skip it.</li>
            </ul>
            <p className="mt-3">
              Use preload for resources the current page needs but would discover late (fonts, LCP images). 
              Use prefetch for resources the next page will need (next step in checkout, linked pages).
            </p>
            <HighlightBlock as="p" tier="important" className="mt-3">
              Confusing these is a common mistake — preloading next-page resources wastes bandwidth, while 
              prefetching current-page critical resources means they load too late.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: Why is the &quot;as&quot; attribute required for preload?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The <code>as</code> attribute tells the browser:
            </p>
            <ul className="space-y-1">
              <li>• <strong>Resource type:</strong> <code>script</code>, <code>style</code>, <code>font</code>, <code>image</code>, etc.</li>
              <li>• <strong>Fetch priority:</strong> Without <code>as</code>, browser fetches at low priority</li>
              <li>• <strong>CSP compliance:</strong> Content Security Policy checks the <code>as</code> value</li>
            </ul>
            <p className="mt-3">
              Without <code>as</code>, the browser may double-fetch: once as a generic preload, and again 
              as the correct type when actually needed. This wastes bandwidth and defeats the purpose of preloading.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: Why should you limit preconnect to 2-4 origins?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Each preconnect opens a TCP connection that:
            </p>
            <ul className="space-y-1">
              <li>• Consumes memory on both client and server</li>
              <li>• Holds a socket open for approximately 10 seconds (idle timeout)</li>
              <li>• Requires server resources to maintain</li>
            </ul>
            <p className="mt-3">
              Preconnecting to 10+ origins means maintaining 10+ open sockets, most of which may never 
              be used. The overhead of unused connections outweighs the benefit.
            </p>
            <p className="mt-3">
              Limit to 2-4 truly critical origins: your API, font CDN, image CDN, and maybe your own CDN.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: Why do font preloads need the crossorigin attribute?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Font files are always fetched with CORS (Cross-Origin Resource Sharing). If your preload 
              omits <code>crossorigin</code>:
            </p>
            <ol className="space-y-2">
              <li>
                Browser makes a non-CORS preload request (wasted — fonts require CORS)
              </li>
              <li>
                When CSS references the font, browser makes a CORS request (actual font download)
              </li>
              <li>
                Result: double-fetch, wasting bandwidth and negating preload benefit
              </li>
            </ol>
            <p className="mt-3">
              Always add <code>crossorigin</code> to font preloads:
            </p>
            <ul className="space-y-1">
              <li>• <code>&lt;link rel=&quot;preload&quot; href=&quot;font.woff2&quot; as=&quot;font&quot; crossorigin&gt;</code></li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How would you implement hover-based prefetching?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Hover-based prefetching fetches resources when a user hovers over a link:
            </p>
            <ol className="space-y-2">
              <li>
                <strong>Add event listener:</strong> Listen for <code>mouseenter</code> or <code>focus</code> on navigation links.
              </li>
              <li>
                <strong>Debounce:</strong> Wait 100-200ms before prefetching (avoids prefetching for accidental hovers).
              </li>
              <li>
                <strong>Create link tag:</strong> Dynamically create <code>&lt;link rel=&quot;prefetch&quot;&gt;</code> and append to head.
              </li>
              <li>
                <strong>Cache:</strong> Track which URLs have been prefetched to avoid duplicate requests.
              </li>
            </ol>
            <p className="mt-3">
              This provides near-instant navigation for intentional clicks while avoiding wasteful prefetching 
              for passing hovers.
            </p>
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
              href="https://web.dev/preconnect-and-dns-prefetch/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              web.dev — Establish Network Connections Early
            </a>
            <p className="text-sm text-muted mt-1">
              Google&apos;s guide on preconnect and dns-prefetch best practices.
            </p>
          </li>
          <li>
            <a 
              href="https://web.dev/preload-critical-assets/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              web.dev — Preload Critical Assets
            </a>
            <p className="text-sm text-muted mt-1">
              Comprehensive guide on using preload for fonts, images, and scripts.
            </p>
          </li>
          <li>
            <a 
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/prefetch" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              MDN — Link Prefetching
            </a>
            <p className="text-sm text-muted mt-1">
              Documentation on prefetch, preload, preconnect, and dns-prefetch.
            </p>
          </li>
          <li>
            <a 
              href="https://developer.chrome.com/docs/web-platform/speculation-rules/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Chrome Developers — Speculation Rules API
            </a>
            <p className="text-sm text-muted mt-1">
              Emerging API for page prerendering and advanced prefetching.
            </p>
          </li>
          <li>
            <a 
              href="https://nextjs.org/docs/app/api-reference/components/link#prefetch" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Next.js — Link Component Prefetching
            </a>
            <p className="text-sm text-muted mt-1">
              Next.js automatic prefetching behavior and configuration.
            </p>
          </li>
          <li>
            <a 
              href="https://www.smashingmagazine.com/2019/04/optimization-performance-resource-hints/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Smashing Magazine — Resource Hints Optimization
            </a>
            <p className="text-sm text-muted mt-1">
              Practical guide to implementing resource hints in production.
            </p>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
