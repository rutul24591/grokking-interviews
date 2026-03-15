"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-above-fold-extensive",
  title: "Above-the-Fold Optimization",
  description: "Comprehensive guide to above-the-fold optimization techniques for improving perceived performance and Core Web Vitals.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "above-the-fold-optimization",
  wordCount: 11000,
  readingTime: 44,
  lastUpdated: "2026-03-10",
  tags: ["frontend", "performance", "critical-rendering-path", "above-the-fold", "core-web-vitals"],
  relatedTopics: ["critical-css", "image-optimization", "web-vitals", "resource-hints"],
};

export default function AboveTheFoldOptimizationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Above-the-fold optimization</strong> is the practice of prioritizing the loading and rendering of
          content that is visible in the user&apos;s viewport without scrolling. The term originates from newspaper
          publishing, where the most important headlines and images were placed on the upper half of the front
          page — the portion visible when the paper was folded on a newsstand. In web development, &quot;the
          fold&quot; is the bottom edge of the browser viewport on initial load.
        </p>
        <p>
          The core insight behind above-the-fold optimization is that <strong>perceived performance matters
          more than total load time</strong>. A page that shows meaningful content in 800ms but finishes loading
          at 4 seconds feels dramatically faster than a page that loads nothing for 2.5 seconds then shows
          everything at 3 seconds. Users make judgments about page quality within the first 2-3 seconds — this
          is often called the &quot;3-second rule.&quot; Google research shows that 53% of mobile users abandon
          sites that take longer than 3 seconds to display content. Above-the-fold optimization targets this
          critical window.
        </p>
        <p>
          This optimization strategy directly impacts Core Web Vitals, the metrics Google uses for search
          ranking signals:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Largest Contentful Paint (LCP):</strong> Measures when the largest visible content element
            renders. Target: ≤ 2.5 seconds. Above-the-fold optimization directly targets this metric because
            the LCP element is almost always above the fold.
          </li>
          <li>
            <strong>First Contentful Paint (FCP):</strong> Measures when the browser first renders any content
            (text, image, canvas). Target: ≤ 1.8 seconds. Critical CSS inlining and render-blocking elimination
            are the primary levers.
          </li>
          <li>
            <strong>Cumulative Layout Shift (CLS):</strong> Measures visual stability as content loads. Target:
            ≤ 0.1. Above-the-fold content that shifts during load creates the most user frustration since it is
            visible throughout.
          </li>
          <li>
            <strong>Interaction to Next Paint (INP):</strong> Measures responsiveness when users interact.
            Target: ≤ 200ms. Heavy JavaScript hydration for above-the-fold interactive elements can block main
            thread responsiveness.
          </li>
        </ul>
        <p>
          The economic impact is significant. Amazon famously found that every 100ms of latency cost them 1% in
          sales. Google discovered that a 500ms increase in search result display time reduced traffic by 20%.
          For e-commerce sites, the above-the-fold content — hero images, product cards, navigation — is what
          converts browsers into buyers. Optimizing its delivery is not a nice-to-have; it is a business-critical
          concern.
        </p>
        <p>
          In a system design interview context, above-the-fold optimization demonstrates understanding of the
          browser rendering pipeline, resource prioritization, network constraints, and the tradeoffs between
          different rendering strategies (SSR, SSG, CSR, streaming). It is a topic that bridges frontend
          engineering with infrastructure decisions.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Critical Rendering Path Deep Dive
          ============================================================ */}
      <section>
        <h2>Critical Rendering Path Deep Dive</h2>
        <p>
          To optimize above-the-fold content, you need to understand exactly how a browser transforms HTML,
          CSS, and JavaScript into pixels on screen. This process is called the <strong>critical rendering
          path</strong>, and every optimization technique targets a specific stage of this pipeline.
        </p>

        <ArticleImage
          src="/diagrams/frontend/performance-optimization/above-fold-rendering-pipeline.svg"
          alt="Browser rendering pipeline showing HTML parse through DOM, CSSOM, render tree, layout, paint, and composite stages"
          caption="The browser rendering pipeline — each stage is a potential optimization target"
        />

        <h3>Step 1: HTML Parsing and DOM Construction</h3>
        <p>
          When the browser receives the first bytes of HTML (after DNS lookup, TCP handshake, TLS negotiation,
          and the HTTP request/response), it begins tokenizing the HTML into a tree structure called the
          Document Object Model (DOM). The parser processes bytes → characters → tokens → nodes → DOM tree.
          This happens incrementally — the browser does not wait for the entire HTML document before starting.
        </p>
        <p>
          The key optimization insight: the browser can start building the DOM as soon as it receives the first
          chunk of HTML. This is why streaming SSR is so powerful — it sends above-the-fold HTML first, letting
          the browser begin DOM construction immediately. The first TCP congestion window is approximately 14KB,
          so if your initial HTML (including inlined critical CSS) fits within 14KB, the browser can begin
          rendering after a single network round-trip.
        </p>

        <h3>Step 2: CSSOM Construction (Render-Blocking)</h3>
        <p>
          When the HTML parser encounters a <code>{'<link rel="stylesheet">'}</code> tag, the browser must
          download and parse that entire stylesheet before it can proceed to render anything. This is
          <strong>render-blocking</strong> behavior. The browser builds the CSS Object Model (CSSOM) from the
          parsed stylesheet, which maps selectors to computed styles.
        </p>
        <p>
          The reason CSS is render-blocking is intentional: rendering HTML without CSS would produce a Flash
          of Unstyled Content (FOUC), which is jarring. However, this means a 200KB stylesheet served from a
          slow CDN can delay the first paint by seconds, even though only 10-15KB of those styles are needed
          for above-the-fold content. This is the primary motivation behind critical CSS extraction.
        </p>

        <h3>Step 3: Render Tree Construction</h3>
        <p>
          The browser combines the DOM and CSSOM into a render tree. The render tree only contains visible
          nodes — elements with <code>display: none</code> are excluded (though elements with
          <code>visibility: hidden</code> or <code>opacity: 0</code> are included because they still affect
          layout). Each node in the render tree has its computed styles attached.
        </p>
        <p>
          Critical point: <strong>no CSSOM means no render tree, which means no pixels on screen.</strong>
          This is why eliminating render-blocking CSS is the single highest-impact above-the-fold optimization.
        </p>

        <h3>Step 4: Layout (Reflow)</h3>
        <p>
          The layout stage calculates the exact position and size of every element in the render tree.
          Starting from the root, the browser computes the geometry of each box — width, height, margins,
          padding, and position. This is also called &quot;reflow.&quot; Layout is triggered whenever the
          geometry of any element changes — adding/removing elements, changing dimensions, modifying font
          size, or resizing the viewport.
        </p>
        <p>
          For above-the-fold optimization, layout stability is critical. When images load without explicit
          width/height attributes, or when fonts swap causing text reflow, the browser must recalculate
          layout for potentially thousands of elements. This causes Cumulative Layout Shift (CLS).
        </p>

        <h3>Step 5: Paint</h3>
        <p>
          The paint stage converts each node in the render tree into actual pixels. The browser paints text,
          colors, borders, shadows, images, and other visual properties. Complex paint operations (like
          box-shadows, gradients, and filters) are more expensive than simple fills. The browser typically
          paints in layers to optimize subsequent updates.
        </p>

        <h3>Step 6: Compositing</h3>
        <p>
          Finally, the compositor combines the painted layers in the correct order, applying transforms and
          opacity. Compositing happens on the GPU and is extremely fast. Elements promoted to their own
          compositor layer (via <code>will-change</code>, <code>transform</code>, or <code>opacity</code>
          animations) can be composited independently without triggering layout or paint on other elements.
        </p>

        <h3>Render-Blocking vs. Parser-Blocking Resources</h3>
        <p>
          Understanding the distinction between these two types of blocking is essential:
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p>
          A synchronous <code>{'<script>'}</code> tag is actually <strong>both</strong> parser-blocking and
          render-blocking. It stops the HTML parser (preventing further DOM construction) and since the render
          tree depends on the DOM, it also blocks rendering. This is why moving scripts to the bottom of
          <code>{'<body>'}</code> or using <code>defer</code> is so impactful.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Critical CSS
          ============================================================ */}
      <section>
        <h2>Critical CSS</h2>
        <p>
          Critical CSS is the technique of extracting only the CSS rules needed to render above-the-fold
          content, inlining them in the HTML document&apos;s <code>{'<head>'}</code>, and deferring the load
          of the remaining CSS. This eliminates the render-blocking CSS problem and allows the browser to
          paint above-the-fold content after a single network round-trip.
        </p>

        <h3>Why It Works</h3>
        <p>
          New TCP connections start with a small congestion window — typically about 14KB (10 TCP segments of
          ~1460 bytes each). The first round-trip between client and server can transfer approximately 14KB
          of compressed data. If your HTML document (including inlined critical CSS) fits within this window,
          the browser has everything it needs to render the first paint without waiting for additional network
          round-trips.
        </p>

        <h3>Extraction Tools</h3>
        <p>
          Several tools automate critical CSS extraction by rendering the page in a headless browser and
          determining which CSS rules apply to elements in the viewport:
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>Critters: Build-Time Critical CSS for Webpack/Next.js</h3>
        <p>
          Critters takes a different approach from <code>critical</code>: instead of using a headless browser,
          it analyzes the HTML and CSS at build time to determine which rules are used. This is faster but
          less accurate — it includes all CSS rules that match elements in the HTML, regardless of whether
          those elements are above the fold. In practice, this over-inclusion is acceptable because the CSS
          is still significantly smaller than the full stylesheet.
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>Manual Inlining Strategy</h3>
        <p>
          For maximum control, you can manually inline critical CSS. This is common in Next.js App Router
          where you want to ensure the initial HTML payload is optimized:
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>Async Loading Non-Critical CSS</h3>
        <p>
          After inlining critical CSS, the remaining stylesheet must be loaded without blocking render.
          There are several patterns:
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>

      {/* ============================================================
          SECTION 4: Resource Prioritization
          ============================================================ */}
      <section>
        <h2>Resource Prioritization</h2>
        <p>
          Browsers have built-in heuristics for prioritizing resource downloads, but you can influence these
          priorities using resource hints and the Priority Hints API. Understanding and controlling resource
          priority is essential for ensuring above-the-fold content loads first.
        </p>

        <ArticleImage
          src="/diagrams/frontend/performance-optimization/above-fold-resource-priority.svg"
          alt="Table showing browser resource priority levels for CSS, fonts, scripts, images, and other resource types"
          caption="Browser resource priority varies by type — use hints to override defaults for above-fold content"
        />

        <h3>Preload: Fetch Critical Resources Early</h3>
        <p>
          <code>{'<link rel="preload">'}</code> tells the browser to fetch a resource immediately because you
          know it will be needed soon. Without preload, the browser discovers resources only when the parser
          encounters them in the HTML or when CSS is parsed. Preload moves the discovery earlier.
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>Preconnect: Warm Up Third-Party Connections</h3>
        <p>
          <code>{'<link rel="preconnect">'}</code> performs DNS lookup, TCP handshake, and TLS negotiation
          to a third-party origin before any resources from that origin are requested. This can save
          200-500ms per connection on mobile networks.
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>Prefetch: Load Resources for Future Navigation</h3>
        <p>
          <code>{'<link rel="prefetch">'}</code> is a low-priority hint telling the browser to fetch a
          resource during idle time for use in future navigations. Unlike preload, prefetch is not
          for the current page — it is for the next likely page the user will visit.
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>fetchpriority: Fine-Grained Control</h3>
        <p>
          The <code>fetchpriority</code> attribute (part of the Priority Hints API) lets you explicitly
          set the priority of a resource relative to other resources of the same type. This is the most
          direct tool for above-the-fold optimization.
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>

      {/* ============================================================
          SECTION 5: LCP Optimization
          ============================================================ */}
      <section>
        <h2>LCP Optimization</h2>
        <p>
          Largest Contentful Paint (LCP) measures when the largest content element in the viewport finishes
          rendering. In most cases, the LCP element is above the fold — it is either a hero image, a large
          text block, or a background image. Optimizing LCP is the single most impactful above-the-fold
          optimization for Core Web Vitals.
        </p>

        <h3>Identifying the LCP Element</h3>
        <p>
          The LCP element can be any of these types: <code>{'<img>'}</code>, <code>{'<image>'}</code> inside
          SVG, <code>{'<video>'}</code> poster image, element with a CSS <code>background-image</code>, or
          a block-level element containing text. You can identify the LCP element using Chrome DevTools:
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>Image Optimization for LCP</h3>
        <p>
          When the LCP element is an image (which it is in approximately 72% of pages according to HTTP
          Archive data), optimizing that image delivery is critical:
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>Preloading the LCP Image</h3>
        <p>
          One of the most common LCP issues is late discovery. The browser cannot start downloading an
          image until it discovers the <code>{'<img>'}</code> tag during HTML parsing, which may be
          delayed by CSS-in-JS execution, JavaScript rendering, or simply being deep in the HTML. Preload
          solves this:
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>SSR Impact on LCP</h3>
        <p>
          Client-side rendering (CSR) has a devastating impact on LCP because the browser must: download
          HTML → download JS bundle → execute JS → render components → discover image → download image →
          paint. With SSR, the HTML already contains the <code>{'<img>'}</code> tag, so the browser can
          discover and start downloading the image immediately during HTML parsing. This alone can improve
          LCP by 1-3 seconds on typical pages.
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>

      {/* ============================================================
          SECTION 6: JavaScript Loading Strategies
          ============================================================ */}
      <section>
        <h2>JavaScript Loading Strategies</h2>
        <p>
          JavaScript is the most expensive resource for above-the-fold performance. It is both
          parser-blocking (stops DOM construction) and CPU-intensive (blocks the main thread during
          execution). The goal is to load only the JavaScript needed for above-the-fold interactivity
          and defer everything else.
        </p>

        <h3>defer vs. async</h3>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
        <p>
          For above-the-fold optimization, <code>defer</code> is almost always the right choice for
          application JavaScript. It allows the browser to parse and render HTML (showing above-the-fold
          content) while JavaScript downloads in the background. Scripts execute after the DOM is ready,
          in document order.
        </p>

        <h3>Dynamic Import for Below-Fold Components</h3>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>IntersectionObserver for Lazy Initialization</h3>
        <p>
          For components that need JavaScript to become interactive but are below the fold, you can defer
          their initialization until they scroll into view:
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>Next.js Script Component</h3>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>

      {/* ============================================================
          SECTION 7: Font Optimization
          ============================================================ */}
      <section>
        <h2>Font Optimization</h2>
        <p>
          Web fonts are a common source of both render delays and layout shifts for above-the-fold content.
          Text is typically the first content rendered above the fold, so font loading behavior directly
          impacts FCP and CLS.
        </p>

        <h3>FOIT vs. FOUT</h3>
        <p>
          Browsers handle unloaded web fonts in two ways:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>FOIT (Flash of Invisible Text):</strong> The browser hides text until the font loads
            (default in Chrome, Firefox — 3-second timeout). This delays FCP because the user sees nothing
            where text should be.
          </li>
          <li>
            <strong>FOUT (Flash of Unstyled Text):</strong> The browser shows text in a fallback font,
            then swaps when the web font loads. This allows faster FCP but causes layout shift (CLS).
          </li>
        </ul>

        <h3>font-display Strategies</h3>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>Preloading Fonts</h3>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>next/font: Automatic Font Optimization</h3>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>Font Subsetting</h3>
        <p>
          Font subsetting removes unused characters from a font file, dramatically reducing file size.
          A full Inter font with all weights and characters can be 300KB+. Subsetting to Latin characters
          brings it under 20KB.
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>Reducing CLS from Font Swaps</h3>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>

      {/* ============================================================
          SECTION 8: Server-Side Strategies
          ============================================================ */}
      <section>
        <h2>Server-Side Strategies</h2>
        <p>
          Server-side rendering strategies are the most impactful optimization for above-the-fold content
          because they address the fundamental problem: the browser cannot render content it has not received.
          By generating HTML on the server, you eliminate the client-side JavaScript execution required to
          produce the initial DOM.
        </p>

        <h3>SSR for Above-Fold Content</h3>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>Streaming SSR</h3>
        <p>
          Streaming SSR sends HTML in chunks as it becomes available, rather than waiting for the entire
          page to render. This is particularly powerful for above-the-fold optimization because the
          above-fold HTML can be sent immediately while below-fold content and data fetching continues.
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>React Server Components</h3>
        <p>
          React Server Components (RSC) in Next.js App Router render on the server and send serialized
          component trees (not HTML) to the client. For above-the-fold optimization, the key benefit is
          that RSC output includes the rendered HTML in the initial response — no JavaScript is sent to
          the client for Server Components:
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>Edge Rendering for TTFB</h3>
        <p>
          Edge rendering runs server-side logic at CDN edge locations, reducing the physical distance
          between server and user. This dramatically improves Time to First Byte (TTFB), which cascades
          into faster FCP and LCP.
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>

      {/* ============================================================
          SECTION 9: Measuring Above-the-Fold Performance
          ============================================================ */}
      <section>
        <h2>Measuring Above-the-Fold Performance</h2>

        <ArticleImage
          src="/diagrams/frontend/performance-optimization/above-fold-optimization-timeline.svg"
          alt="Page load timeline showing FCP, LCP, TTI markers and what factors affect each metric"
          caption="Key performance markers on the page load timeline — each is affected by different optimization strategies"
        />

        <p>
          You cannot optimize what you do not measure. Above-the-fold performance is quantified through
          several complementary metrics, measured in both lab and field conditions.
        </p>

        <h3>Core Metrics</h3>
        <ul className="space-y-3">
          <li>
            <strong>Time to First Byte (TTFB):</strong> Time from navigation start to the first byte of
            the response. Target: ≤ 800ms. Affected by server processing, CDN latency, redirects.
          </li>
          <li>
            <strong>First Contentful Paint (FCP):</strong> Time until the browser renders the first
            content (text, image, canvas). Target: ≤ 1.8s. Affected by render-blocking CSS/JS, font loading.
          </li>
          <li>
            <strong>Largest Contentful Paint (LCP):</strong> Time until the largest visible content element
            renders. Target: ≤ 2.5s. Affected by image loading, preload hints, rendering strategy.
          </li>
          <li>
            <strong>Speed Index:</strong> Measures how quickly content is visually populated. It captures the
            visual progression of the page — a page that shows above-fold content early has a better (lower)
            Speed Index even if total load time is the same.
          </li>
          <li>
            <strong>Cumulative Layout Shift (CLS):</strong> Measures total unexpected layout shifts during
            the page&apos;s lifespan. Target: ≤ 0.1. Above-fold shifts are the most impactful because users
            are looking at that content.
          </li>
        </ul>

        <h3>Measurement Tools</h3>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>Lighthouse and WebPageTest</h3>
        <p>
          Lighthouse provides lab-based measurements with specific recommendations. Run it in Chrome DevTools
          (Lighthouse tab), via the CLI (<code>npx lighthouse https://example.com</code>), or in CI:
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>Chrome DevTools Performance Panel</h3>
        <p>
          The Performance panel provides the most detailed view of above-the-fold rendering. Key features:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Filmstrip view:</strong> Shows visual progression of the page at each moment. You can
            see exactly when above-fold content appears and identify what is delaying it.
          </li>
          <li>
            <strong>Main thread flame chart:</strong> Shows JavaScript execution, style recalculation,
            layout, and paint operations. Look for long tasks (&gt; 50ms) that block rendering.
          </li>
          <li>
            <strong>Network waterfall:</strong> Shows the order and timing of resource downloads.
            Check that LCP resources are requested early and at high priority.
          </li>
          <li>
            <strong>Layout Shift regions:</strong> Highlights elements that cause CLS, with a visual
            overlay showing what moved and by how much.
          </li>
        </ul>

        <h3>CrUX (Chrome User Experience Report)</h3>
        <p>
          CrUX provides real-world (field) data from Chrome users who have opted into data sharing. Unlike
          lab tools, CrUX reflects actual user experiences across different devices, networks, and locations.
          Google uses CrUX data for search ranking signals. Access CrUX data via:
        </p>
        <ul className="space-y-1">
          <li>PageSpeed Insights (pagespeed.web.dev)</li>
          <li>CrUX API (<code>https://chromeuxreport.googleapis.com/v1/records:queryRecord</code>)</li>
          <li>CrUX Dashboard (Google Data Studio template)</li>
          <li>BigQuery (for historical analysis and custom queries)</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 10: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Even experienced developers make mistakes that hurt above-the-fold performance. Understanding these
          pitfalls is valuable in interviews — it demonstrates practical experience beyond theoretical knowledge.
        </p>

        <h3>1. Layout Shifts from Images Without Dimensions</h3>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>2. Lazy-Loading the LCP Image</h3>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>3. Over-Inlining CSS</h3>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>4. Third-Party Scripts Blocking Render</h3>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>5. Font-Caused Layout Shifts</h3>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>6. Mobile Viewport Differences</h3>
        <p>
          A common mistake is optimizing above-the-fold content only for desktop viewports. Mobile devices
          have different &quot;fold&quot; positions — a phone at 375x667 shows very different content above
          the fold than a desktop at 1920x1080. Your critical CSS must cover all viewport sizes, and your
          LCP element may differ between mobile and desktop.
        </p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>

        <h3>7. Client-Side Data Fetching for Above-Fold Content</h3>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>

      {/* ============================================================
          SECTION 11: Best Practices Summary
          ============================================================ */}
      <section>
        <h2>Best Practices Summary</h2>

        <ArticleImage
          src="/diagrams/frontend/performance-optimization/above-fold-strategy-overview.svg"
          alt="Overview diagram showing all above-the-fold optimization strategies mapped to their Core Web Vitals impact"
          caption="All optimization strategies and their impact on Core Web Vitals"
        />

        <p>
          The following best practices are ordered by impact — implement them in this order for maximum
          benefit with minimum effort:
        </p>

        <h3>Tier 1: Critical (Implement First)</h3>
        <ul className="space-y-2">
          <li>
            <strong>Inline critical CSS:</strong> Extract and inline above-fold CSS in
            <code>{'<head>'}</code>. Target ≤ 14KB for the entire initial HTML payload (compressed).
            Use Critters (built into Next.js) or the <code>critical</code> npm package.
          </li>
          <li>
            <strong>Preload the LCP image:</strong> Add
            <code>{'<link rel="preload" href="/hero.webp" as="image" fetchpriority="high">'}</code>.
            In Next.js, use <code>{'<Image priority>'}</code>.
          </li>
          <li>
            <strong>Defer all JavaScript:</strong> Use <code>defer</code> for application scripts.
            Move third-party scripts to <code>afterInteractive</code> or <code>lazyOnload</code> strategy.
          </li>
          <li>
            <strong>Set explicit image dimensions:</strong> Every <code>{'<img>'}</code> must have
            <code>width</code> and <code>height</code> (or CSS <code>aspect-ratio</code>) to prevent CLS.
          </li>
          <li>
            <strong>Use SSR for above-fold content:</strong> Server-render the initial HTML so the
            browser can start rendering immediately without waiting for JavaScript.
          </li>
        </ul>

        <h3>Tier 2: Important (High Impact)</h3>
        <ul className="space-y-2">
          <li>
            <strong>Optimize fonts:</strong> Use <code>next/font</code> for automatic optimization.
            Apply <code>font-display: swap</code> or <code>optional</code>. Preload critical fonts.
            Subset to needed character sets.
          </li>
          <li>
            <strong>Preconnect to third-party origins:</strong> Add <code>preconnect</code> for CDN,
            API, font, and analytics domains.
          </li>
          <li>
            <strong>Lazy-load below-fold content:</strong> Use <code>loading=&quot;lazy&quot;</code> for
            below-fold images and <code>React.lazy</code> for below-fold interactive components.
          </li>
          <li>
            <strong>Use modern image formats:</strong> Serve WebP or AVIF with fallbacks. Use responsive
            images with <code>srcSet</code> and <code>sizes</code>.
          </li>
          <li>
            <strong>Stream SSR with Suspense:</strong> Wrap below-fold async Server Components in
            Suspense boundaries to stream them independently of above-fold content.
          </li>
        </ul>

        <h3>Tier 3: Optimization (Incremental Gains)</h3>
        <ul className="space-y-2">
          <li>
            <strong>Edge rendering:</strong> Deploy SSR to edge locations for lower TTFB globally.
          </li>
          <li>
            <strong>Priority Hints:</strong> Use <code>fetchpriority=&quot;high&quot;</code> on LCP
            elements and <code>fetchpriority=&quot;low&quot;</code> on below-fold resources.
          </li>
          <li>
            <strong>Resource budgets:</strong> Set performance budgets in CI — fail the build if
            LCP exceeds 2.5s or critical CSS exceeds 15KB.
          </li>
          <li>
            <strong>Skeleton screens:</strong> Show content placeholders immediately while data loads,
            maintaining layout stability.
          </li>
          <li>
            <strong>HTTP/2 or HTTP/3:</strong> Enable multiplexing to avoid head-of-line blocking
            and reduce connection overhead for multiple resources.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 12: Interview Talking Points
          ============================================================ */}
      <section>
        <h2>Interview Talking Points</h2>
        <p>
          When discussing above-the-fold optimization in system design interviews, these talking points
          demonstrate depth of understanding:
        </p>

        <h3>Opening Framework</h3>
        <p>
          &quot;Above-the-fold optimization is about prioritizing what the user sees first. The key insight
          is that perceived performance matters more than total load time. A page that shows meaningful
          content in under a second, even if it finishes loading at 4 seconds, feels dramatically faster
          than one that loads nothing for 2 seconds then shows everything at 3 seconds.&quot;
        </p>

        <h3>Technical Depth</h3>
        <ul className="space-y-3">
          <li>
            <strong>14KB rule:</strong> &quot;The first TCP congestion window is about 14KB. If we can fit
            our HTML plus inlined critical CSS within 14KB compressed, the browser can render the first paint
            after a single network round-trip — the theoretical minimum latency.&quot;
          </li>
          <li>
            <strong>Render-blocking elimination:</strong> &quot;CSS is render-blocking because the browser
            needs the CSSOM to build the render tree. By inlining critical CSS, we give the browser the
            styles it needs for above-fold content in the initial HTML, eliminating the need for an
            additional stylesheet request before first paint.&quot;
          </li>
          <li>
            <strong>LCP optimization:</strong> &quot;The LCP element is almost always above the fold. For
            image-heavy pages, the single biggest LCP improvement is adding a preload hint with
            fetchpriority=high — this moves the discovery of the image from parser time to preload scanner
            time, saving hundreds of milliseconds.&quot;
          </li>
          <li>
            <strong>SSR vs CSR tradeoff:</strong> &quot;Client-side rendering adds a minimum of 2 extra
            sequential steps before content appears: downloading the JavaScript bundle and executing it to
            produce DOM nodes. With SSR, the HTML already contains the content, and the browser&apos;s
            preload scanner can discover images while still parsing. This typically improves LCP by 1-3
            seconds.&quot;
          </li>
          <li>
            <strong>Streaming SSR:</strong> &quot;With streaming SSR using React Suspense boundaries, we
            can send above-fold HTML immediately while below-fold data fetching continues on the server.
            The user sees meaningful content within the first chunk, and below-fold sections stream in as
            they become ready.&quot;
          </li>
        </ul>

        <h3>Tradeoffs to Discuss</h3>
        <ul className="space-y-2">
          <li>
            <strong>Inlined CSS is not cacheable:</strong> Each page load re-downloads the inlined CSS.
            For return visitors, a cached external stylesheet would be more efficient. The tradeoff is
            worth it for FCP because the first visit experience drives user retention.
          </li>
          <li>
            <strong>SSR adds server cost:</strong> Generating HTML on every request requires server
            compute. Static Site Generation (SSG) and Incremental Static Regeneration (ISR) provide
            SSR-like FCP benefits without per-request server rendering. The tradeoff depends on content
            freshness requirements.
          </li>
          <li>
            <strong>font-display: optional skips custom fonts on slow connections:</strong> Users on
            slow networks may never see the custom font. For most applications, this is an acceptable
            tradeoff — the content is more important than the typography.
          </li>
          <li>
            <strong>Streaming SSR complexity:</strong> Streaming requires careful error boundary placement.
            If an above-fold component throws during streaming, the error can bubble up differently than
            in traditional SSR. The tradeoff is increased resilience complexity for better perceived
            performance.
          </li>
        </ul>

        <h3>Measurement and Monitoring</h3>
        <p>
          &quot;I would measure above-the-fold performance using a combination of lab and field data.
          Lighthouse CI in the build pipeline catches regressions before deployment. In production, I would
          use the <code>web-vitals</code> library to capture real user metrics (RUM) and send them to an
          analytics dashboard. CrUX data gives us the 75th percentile experience across all Chrome users
          on our site — this is what Google uses for search ranking. I would set alerts for LCP &gt; 2.5s
          at the 75th percentile.&quot;
        </p>

        <h3>When the Interviewer Asks &quot;What Would You Prioritize?&quot;</h3>
        <p>
          &quot;I would start by measuring the current state — run Lighthouse, check CrUX data, and identify
          the LCP element. The three highest-impact optimizations, in order, are: (1) inline critical CSS to
          unblock first paint, (2) preload the LCP element with fetchpriority=high, and (3) defer all
          non-critical JavaScript. These three changes alone can typically bring LCP from 4+ seconds to
          under 2.5 seconds. After that, I would set up monitoring and iterate on font optimization,
          image format modernization, and streaming SSR.&quot;
        </p>
      </section>

      {/* ============================================================
          SECTION 13: References
          ============================================================ */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <strong>Google Web Vitals documentation:</strong>
            <code>https://web.dev/vitals/</code> — Official definitions and thresholds for Core Web Vitals
            including LCP, CLS, and INP.
          </li>
          <li>
            <strong>Critical Rendering Path — Google Developers:</strong>
            <code>https://developers.google.com/web/fundamentals/performance/critical-rendering-path</code> —
            Detailed walkthrough of DOM construction, CSSOM, render tree, layout, and paint.
          </li>
          <li>
            <strong>Priority Hints specification:</strong>
            <code>https://wicg.github.io/priority-hints/</code> — W3C specification for the
            <code>fetchpriority</code> attribute.
          </li>
          <li>
            <strong>Optimize Largest Contentful Paint — web.dev:</strong>
            <code>https://web.dev/optimize-lcp/</code> — Google&apos;s guide to LCP optimization including
            preloading, SSR, and image optimization techniques.
          </li>
          <li>
            <strong>Critical CSS tools — GitHub:</strong>
            <code>https://github.com/addyosmani/critical</code> — Addy Osmani&apos;s critical CSS extraction
            tool for automated above-fold CSS inlining.
          </li>
          <li>
            <strong>Critters — Google Chrome Labs:</strong>
            <code>https://github.com/GoogleChromeLabs/critters</code> — Build-time critical CSS inliner
            used internally by Next.js.
          </li>
          <li>
            <strong>web-vitals npm package:</strong>
            <code>https://github.com/GoogleChrome/web-vitals</code> — Library for measuring Core Web Vitals
            in the field (Real User Monitoring).
          </li>
          <li>
            <strong>Next.js Font Optimization:</strong>
            <code>https://nextjs.org/docs/app/building-your-application/optimizing/fonts</code> —
            Documentation for <code>next/font</code> automatic font optimization with zero CLS.
          </li>
          <li>
            <strong>HTTP Archive Web Almanac — Performance chapter:</strong>
            <code>https://almanac.httparchive.org/en/2024/performance</code> — Annual analysis of real-world
            web performance data including LCP element distribution and resource loading patterns.
          </li>
          <li>
            <strong>Chrome for Developers — Preload, Prefetch, Preconnect:</strong>
            <code>https://developer.chrome.com/docs/devtools/network/reference</code> — Resource hints
            documentation and DevTools network analysis.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
