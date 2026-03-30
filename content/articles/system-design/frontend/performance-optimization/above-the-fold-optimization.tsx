"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-above-fold-optimization",
  title: "Above-the-Fold Optimization",
  description: "Comprehensive guide to above-the-fold optimization techniques for improving perceived performance and Core Web Vitals including critical CSS, resource prioritization, and LCP optimization.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "above-the-fold-optimization",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "performance", "critical-rendering-path", "above-the-fold", "core-web-vitals", "LCP", "FCP"],
  relatedTopics: ["critical-css", "image-optimization", "web-vitals", "resource-hints"],
};

export default function AboveTheFoldOptimizationArticle() {
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
          src="/diagrams/system-design-concepts/frontend/performance-optimization/above-fold-rendering-pipeline.svg"
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
          When the HTML parser encounters a stylesheet link tag, the browser must
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
          nodes — elements with display none are excluded (though elements with
          visibility hidden or opacity 0 are included because they still affect
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
          compositor layer (via will-change, transform, or opacity
          animations) can be composited independently without triggering layout or paint on other elements.
        </p>

        <h3>Render-Blocking vs. Parser-Blocking Resources</h3>
        <p>
          Understanding the distinction between these two types of blocking is essential:
        </p>
        <p>
          <strong>CSS stylesheets</strong> are render-blocking but not parser-blocking. The HTML parser continues
          building the DOM, but the browser won&apos;t paint anything until CSS is loaded and parsed.
        </p>
        <p>
          <strong>Synchronous JavaScript</strong> (script tags without defer or async) is both parser-blocking and
          render-blocking. It stops the HTML parser (preventing further DOM construction) and since the render
          tree depends on the DOM, it also blocks rendering. This is why moving scripts to the bottom of
          body or using defer is so impactful.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Critical CSS
          ============================================================ */}
      <section>
        <h2>Critical CSS</h2>
        <p>
          Critical CSS is the technique of extracting only the CSS rules needed to render above-the-fold
          content, inlining them in the HTML document&apos;s head, and deferring the load
          of the remaining CSS. This eliminates the render-blocking CSS problem and allows the browser to
          paint above-the-fold content after a single network round-trip.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/critical-css-flow.svg"
          alt="Diagram showing critical CSS extraction process: full stylesheet split into inlined critical CSS and asynchronously loaded non-critical CSS"
          caption="Critical CSS flow: extract above-the-fold styles, inline in head, defer remaining CSS"
        />

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
        <p>
          The <strong>critical</strong> npm package is the most popular tool. It uses Puppeteer to render pages
          and extract CSS rules that apply to above-the-fold elements. It supports multiple viewport sizes to
          ensure critical CSS covers mobile, tablet, and desktop.
        </p>

        <h3>Critters: Build-Time Critical CSS for Webpack/Next.js</h3>
        <p>
          Critters takes a different approach from critical: instead of using a headless browser,
          it analyzes the HTML and CSS at build time to determine which rules are used. This is faster but
          less accurate — it includes all CSS rules that match elements in the HTML, regardless of whether
          those elements are above the fold. In practice, this over-inclusion is acceptable because the CSS
          is still significantly smaller than the full stylesheet.
        </p>
        <p>
          Next.js uses Critters internally when the optimizeFonts and optimizeCss experimental flags are enabled.
        </p>

        <h3>Manual Inlining Strategy</h3>
        <p>
          For maximum control, you can manually inline critical CSS. This is common in Next.js App Router
          where you want to ensure the initial HTML payload is optimized. The approach involves identifying
          the CSS rules needed for above-the-fold content and placing them in a style tag in the head.
        </p>

        <h3>Async Loading Non-Critical CSS</h3>
        <p>
          After inlining critical CSS, the remaining stylesheet must be loaded without blocking render.
          There are several patterns:
        </p>
        <p>
          <strong>Preload with onload:</strong> Use link rel=&quot;preload&quot; with an onload handler
          that switches the rel to &quot;stylesheet&quot; once loaded. This is the modern approach.
        </p>
        <p>
          <strong>Print media trick:</strong> Load the stylesheet with media=&quot;print&quot; and switch
          to media=&quot;all&quot; on load. This works because print stylesheets don&apos;t block rendering.
        </p>
        <p>
          <strong>JavaScript injection:</strong> Create the link element dynamically with JavaScript after
          page load. This defers the CSS download until after the initial render.
        </p>
        <p>
          Always include a noscript fallback for users with JavaScript disabled.
        </p>
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
          src="/diagrams/system-design-concepts/frontend/performance-optimization/above-fold-resource-priority.svg"
          alt="Table showing browser resource priority levels for CSS, fonts, scripts, images, and other resource types"
          caption="Browser resource priority varies by type — use hints to override defaults for above-fold content"
        />

        <h3>Preload: Fetch Critical Resources Early</h3>
        <p>
          The preload link relation tells the browser to fetch a resource immediately because you
          know it will be needed soon. Without preload, the browser discovers resources only when the parser
          encounters them in the HTML or when CSS is parsed. Preload moves the discovery earlier.
        </p>
        <p>
          Use preload for fonts, LCP images, and critical scripts that the browser would otherwise discover
          late. Always include the &quot;as&quot; attribute to specify the resource type.
        </p>

        <h3>Preconnect: Warm Up Third-Party Connections</h3>
        <p>
          The preconnect link relation performs DNS lookup, TCP handshake, and TLS negotiation
          to a third-party origin before any resources from that origin are requested. This can save
          200-500ms per connection on mobile networks.
        </p>
        <p>
          Use preconnect for font CDNs, image CDNs, and API endpoints. Limit to 2-4 critical origins to avoid
          resource contention.
        </p>

        <h3>Prefetch: Load Resources for Future Navigation</h3>
        <p>
          The prefetch link relation is a low-priority hint telling the browser to fetch a
          resource during idle time for use in future navigations. Unlike preload, prefetch is not
          for the current page — it is for the next likely page the user will visit.
        </p>
        <p>
          Use prefetch for next-page JavaScript, CSS, or data. Don&apos;t prefetch for the current page — use
          preload instead.
        </p>

        <h3>fetchpriority: Fine-Grained Control</h3>
        <p>
          The fetchpriority attribute (part of the Priority Hints API) lets you explicitly
          set the priority of a resource relative to other resources of the same type. This is the most
          direct tool for above-the-fold optimization.
        </p>
        <p>
          Use fetchpriority=&quot;high&quot; for the LCP image, fetchpriority=&quot;low&quot; for
          below-the-fold images. This helps the browser prioritize critical resources.
        </p>
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
          The LCP element can be any of these types: img tags, image tags inside
          SVG, video poster images, elements with a CSS background-image, or
          a block-level element containing text. You can identify the LCP element using Chrome DevTools
          Performance panel or Lighthouse.
        </p>

        <h3>Image Optimization for LCP</h3>
        <p>
          When the LCP element is an image (which it is in approximately 72% of pages according to HTTP
          Archive data), optimizing that image delivery is critical:
        </p>
        <p>
          Use modern formats (WebP, AVIF) with JPEG fallback. Serve responsive images with srcset.
          Compress to quality 75-85. Set explicit width and height to prevent layout shift.
        </p>

        <h3>Preloading the LCP Image</h3>
        <p>
          One of the most common LCP issues is late discovery. The browser cannot start downloading an
          image until it discovers the img tag during HTML parsing, which may be
          delayed by CSS-in-JS execution, JavaScript rendering, or simply being deep in the HTML. Preload
          solves this by moving discovery earlier.
        </p>
        <p>
          Add a preload link in the head for the LCP image with as=&quot;image&quot; and
          fetchpriority=&quot;high&quot;.
        </p>

        <h3>SSR Impact on LCP</h3>
        <p>
          Client-side rendering (CSR) has a devastating impact on LCP because the browser must: download
          HTML → download JS bundle → execute JS → render components → discover image → download image →
          paint. With SSR, the HTML already contains the img tag, so the browser can
          discover and start downloading the image immediately during HTML parsing. This alone can improve
          LCP by 1-3 seconds on typical pages.
        </p>
        <p>
          For optimal LCP, use SSR or SSG for above-the-fold content. Stream SSR for even faster initial
          HTML delivery.
        </p>
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
        <p>
          The defer attribute tells the browser to download the script during HTML parsing but
          execute it after parsing completes. Scripts with defer maintain execution order.
        </p>
        <p>
          The async attribute tells the browser to download the script and execute it immediately
          upon completion, potentially interrupting HTML parsing. Execution order is not guaranteed.
        </p>
        <p>
          For above-the-fold optimization, defer is almost always the right choice for
          application JavaScript. It allows the browser to parse and render HTML (showing above-the-fold
          content) while JavaScript downloads in the background. Scripts execute after the DOM is ready,
          in document order.
        </p>

        <h3>Dynamic Import for Below-Fold Components</h3>
        <p>
          Use dynamic import() to code-split below-fold components. This defers JavaScript
          execution until the component is needed, reducing initial bundle size and main thread work.
        </p>
        <p>
          Combine with React.lazy and Suspense for React components. Show a loading state while the
          chunk downloads.
        </p>

        <h3>IntersectionObserver for Lazy Initialization</h3>
        <p>
          For components that need JavaScript to become interactive but are below the fold, you can defer
          their initialization until they scroll into view using IntersectionObserver.
        </p>
        <p>
          This pattern is useful for heavy components like charts, maps, or rich text editors that aren&apos;t
          needed immediately.
        </p>

        <h3>Next.js Script Component</h3>
        <p>
          Next.js provides a Script component with strategy prop for controlling script loading:
          &quot;beforeInteractive&quot; (critical scripts), &quot;afterInteractive&quot; (default, most
          scripts), and &quot;lazyOnload&quot; (non-essential scripts).
        </p>
        <p>
          Use &quot;afterInteractive&quot; for most application scripts. Reserve &quot;beforeInteractive&quot;
          for critical scripts that must run before the page becomes interactive.
        </p>
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
        <p>
          The font-display CSS property controls font loading behavior:
        </p>
        <p>
          <strong>swap:</strong> Show fallback font immediately, swap when web font loads. Best for LCP
          improvement. May cause layout shift if font metrics differ.
        </p>
        <p>
          <strong>optional:</strong> Show fallback font, only swap if web font is already cached. Best for
          CLS. May never show web font on slow connections.
        </p>
        <p>
          <strong>fallback:</strong> Hide text briefly (100ms), then show fallback. Compromise between FOIT
          and FOUT.
        </p>

        <h3>Preloading Fonts</h3>
        <p>
          Preload critical fonts to reduce font loading delay. Use preload with as=&quot;font&quot;
          and crossorigin attributes. Include font-display: swap in CSS.
        </p>

        <h3>next/font: Automatic Font Optimization</h3>
        <p>
          Next.js provides next/font for automatic font optimization. It downloads fonts at build time
          and self-hosts them, eliminating layout shift and improving performance.
        </p>

        <h3>Font Subsetting</h3>
        <p>
          Font subsetting removes unused characters from a font file, dramatically reducing file size.
          A full Inter font with all weights and characters can be 300KB+. Subsetting to Latin characters
          brings it under 20KB.
        </p>
        <p>
          Use font subsetting for better performance, especially for non-Latin scripts.
        </p>

        <h3>Reducing CLS from Font Swaps</h3>
        <p>
          To reduce CLS from font swaps, use size-adjust, ascent-override, or
          descent-override CSS properties to match fallback font metrics to web font metrics.
          This prevents layout shift when the font swaps.
        </p>
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
        <p>
          Server-side rendering generates HTML on the server for each request. The browser receives fully
          rendered HTML and can begin painting immediately. This is the most effective way to improve LCP
          and FCP.
        </p>
        <p>
          Use SSR for dynamic content that changes per user or per request. Next.js, Remix, and Nuxt provide
          SSR out of the box.
        </p>

        <h3>SSG for Static Content</h3>
        <p>
          Static Site Generation generates HTML at build time. The browser receives pre-rendered HTML with
          zero server computation. This is the fastest option for content that doesn&apos;t change frequently.
        </p>
        <p>
          Use SSG for marketing pages, documentation, blog posts, and product listings that don&apos;t change
          per user.
        </p>

        <h3>Streaming SSR</h3>
        <p>
          Streaming SSR sends HTML in chunks as it&apos;s generated. The above-the-fold HTML is sent first,
          allowing the browser to begin rendering before the entire page is ready. This is especially powerful
          for pages with slow data dependencies.
        </p>
        <p>
          React 18+ supports streaming SSR with Suspense. Next.js App Router uses streaming by default.
        </p>

        <h3>Edge Rendering</h3>
        <p>
          Edge rendering moves SSR computation to CDN edge locations closer to users. This reduces TTFB
          (Time to First Byte) by eliminating network latency to origin servers.
        </p>
        <p>
          Use edge rendering for global audiences. Vercel Edge Functions, Cloudflare Workers, and AWS
          Lambda@Edge enable edge SSR.
        </p>
      </section>

      {/* ============================================================
          SECTION 9: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>

        <h3>Inline Critical CSS</h3>
        <p>
          Extract and inline CSS needed for above-the-fold content. Keep it under 14KB compressed to fit
          in the first TCP congestion window.
        </p>

        <h3>Preload LCP Image</h3>
        <p>
          Add preload link for the LCP image with fetchpriority=&quot;high&quot;. Don&apos;t lazy-load
          the LCP element.
        </p>

        <h3>Use SSR or SSG</h3>
        <p>
          Avoid CSR for above-the-fold content. Use SSR for dynamic content, SSG for static content.
        </p>

        <h3>Defer Non-Critical JavaScript</h3>
        <p>
          Use defer for application scripts. Code-split below-fold components with dynamic import.
        </p>

        <h3>Optimize Fonts</h3>
        <p>
          Use font-display: swap. Preload critical fonts. Consider next/font for automatic
          optimization.
        </p>

        <h3>Set Explicit Dimensions</h3>
        <p>
          Always set width and height for images and embeds to prevent CLS. Use aspect-ratio
          for responsive images.
        </p>

        <h3>Monitor Core Web Vitals</h3>
        <p>
          Use Lighthouse for lab data, CrUX for field data. Set performance budgets and enforce in CI/CD.
        </p>
      </section>

      {/* ============================================================
          SECTION 10: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3>Lazy-Loading the LCP Image</h3>
        <p>
          The hero/LCP image must load eagerly. Lazy-loading it adds 1-3 seconds to LCP because the
          image won&apos;t start downloading until JavaScript executes and the Intersection Observer
          triggers.
        </p>
        <p>
          <strong>Solution:</strong> Use fetchpriority=&quot;high&quot; and loading=&quot;eager&quot;
          for the LCP image. Never lazy-load above-the-fold hero images.
        </p>

        <h3>Inlining Too Much CSS</h3>
        <p>
          Inlining more than 30 KB of CSS defeats the purpose — the HTML becomes slow to download, negating the
          benefit of eliminating the CSS request.
        </p>
        <p>
          <strong>Solution:</strong> Be aggressive about what&apos;s truly &quot;above-the-fold.&quot; Use tools
          that show extracted CSS size and set a hard limit of 14KB compressed.
        </p>

        <h3>Blocking JavaScript</h3>
        <p>
          Synchronous script tags in the head block HTML parsing and rendering.
        </p>
        <p>
          <strong>Solution:</strong> Use defer or async for all scripts. Move critical inline scripts
          to the end of body if absolutely necessary.
        </p>

        <h3>Font Loading Blocking Text</h3>
        <p>
          Without font-display: swap, text may be invisible for seconds while fonts load.
        </p>
        <p>
          <strong>Solution:</strong> Always use font-display: swap or optional. Preload critical fonts.
        </p>

        <h3>Images Without Dimensions</h3>
        <p>
          Images without width/height cause Cumulative Layout Shift as they load.
        </p>
        <p>
          <strong>Solution:</strong> Always specify width and height, or use CSS aspect-ratio to
          reserve space.
        </p>

        <h3>Not Testing on Real Devices</h3>
        <p>
          Above-the-fold optimization that works on desktop may fail on mobile due to different viewport
          sizes and slower networks.
        </p>
        <p>
          <strong>Solution:</strong> Test on real mobile devices with network throttling. Use Lighthouse
          mobile preset.
        </p>
      </section>

      {/* ============================================================
          SECTION 11: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is above-the-fold optimization and why does it matter?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Above-the-fold optimization prioritizes loading and rendering content visible in the initial
              viewport without scrolling. It matters because <strong>perceived performance matters more than
              total load time</strong> — users judge page quality within 2-3 seconds.
            </p>
            <p className="mb-3">
              Techniques include critical CSS inlining, LCP image optimization, SSR/SSG, font optimization,
              and JavaScript deferral. These directly improve Core Web Vitals (LCP, FCP, CLS).
            </p>
            <p>
              Business impact is significant: Amazon found every 100ms latency cost 1% in sales. Google found
              500ms delay reduced traffic by 20%.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is critical CSS and how does it work?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Critical CSS is the minimum CSS needed to render above-the-fold content, inlined in the HTML
              head. It eliminates render-blocking CSS by providing styles immediately without waiting for
              an external stylesheet.
            </p>
            <p className="mb-3">
              How it works: (1) Extract CSS rules for above-the-fold elements, (2) Inline in style tag
              in head, (3) Load remaining CSS asynchronously with preload or JavaScript.
            </p>
            <p>
              Target: Keep critical CSS under 14KB compressed to fit in the first TCP congestion window,
              enabling rendering after a single network round-trip.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you optimize the LCP element?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Identify LCP:</strong> Use Lighthouse or Chrome DevTools Performance panel to
                identify the LCP element.
              </li>
              <li>
                <strong>Preload:</strong> Add preload link with fetchpriority=&quot;high&quot; for
                LCP image.
              </li>
              <li>
                <strong>Optimize Image:</strong> Use WebP/AVIF, compress to quality 75-85, serve
                responsive images with srcset.
              </li>
              <li>
                <strong>SSR/SSG:</strong> Render LCP element on server so HTML includes img tag
                for early discovery.
              </li>
              <li>
                <strong>Don&apos;t Lazy-Load:</strong> Never lazy-load the LCP element — it must
                load eagerly.
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What is the impact of SSR on above-the-fold performance?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              SSR has the most significant impact on above-the-fold performance because it eliminates
              client-side JavaScript execution before rendering:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>CSR:</strong> Download HTML → Download JS → Execute JS → Render → Discover
                images → Download images → Paint (3-5 seconds)
              </li>
              <li>
                <strong>SSR:</strong> Download HTML (with content) → Discover images → Download images
                → Paint (1-2 seconds)
              </li>
            </ul>
            <p>
              SSR can improve LCP by 1-3 seconds on typical pages. Streaming SSR sends HTML in chunks,
              allowing even faster initial rendering.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you prevent CLS from font swaps?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>font-display: swap:</strong> Show fallback font immediately, swap when web font
                loads. Prevents invisible text but may cause layout shift.
              </li>
              <li>
                <strong>size-adjust:</strong> Scale fallback font to match web font metrics. Prevents
                layout shift when fonts swap.
              </li>
              <li>
                <strong>Preload fonts:</strong> Start font download early with preload link. Reduces
                time until font loads.
              </li>
              <li>
                <strong>next/font:</strong> Next.js font optimization automatically handles font
                subsetting and fallback metrics.
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What resource hints would you use for above-the-fold optimization?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>preload:</strong> For LCP image, critical fonts, critical scripts. Fetches
                immediately with high priority.
              </li>
              <li>
                <strong>preconnect:</strong> For font CDN, image CDN, API endpoints. Warms up
                connections before resources are requested.
              </li>
              <li>
                <strong>prefetch:</strong> For next-page resources. Low-priority fetch during idle time.
              </li>
              <li>
                <strong>fetchpriority:</strong> Set &quot;high&quot; for LCP image, &quot;low&quot; for
                below-the-fold images. Fine-grained priority control.
              </li>
            </ul>
            <p>
              Limit preconnect to 2-4 origins. Don&apos;t overuse preload (3-5 resources max).
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 12: References
          ============================================================ */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/above-the-fold/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Above-the-Fold Content
            </a> — Guide to optimizing above-the-fold content for Core Web Vitals.
          </li>
          <li>
            <a href="https://web.dev/critical-css/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Critical CSS
            </a> — Techniques for extracting and inlining critical CSS.
          </li>
          <li>
            <a href="https://web.dev/optimize-lcp/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Optimize LCP
            </a> — Strategies for improving Largest Contentful Paint.
          </li>
          <li>
            <a href="https://web.dev/font-optimization/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Font Optimization
            </a> — Guide to optimizing web font loading.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Preload
            </a> — Documentation on preload resource hints.
          </li>
          <li>
            <a href="https://nextjs.org/docs/app/building-your-application/optimizing/font" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Next.js — Font Optimization
            </a> — next/font documentation for automatic font optimization.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
