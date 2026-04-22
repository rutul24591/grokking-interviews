"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-critical-css",
  title: "Critical CSS",
  description: "Comprehensive guide to critical CSS extraction, inlining strategies, and eliminating render-blocking stylesheets for faster first paint.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "critical-css",
  wordCount: 6100,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "performance", "critical-css", "render-blocking", "css-optimization", "web-vitals", "fcf"],
  relatedTopics: ["above-the-fold-optimization", "code-splitting", "resource-hints", "font-optimization"],
};

export default function CriticalCssArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Critical CSS</strong> is the{" "}
          <Highlight tier="important">minimum set of CSS rules</Highlight> required to render the above-the-fold content 
          of a webpage. Instead of forcing the browser to download, parse, and apply the entire stylesheet before 
          painting anything, critical CSS is{" "}
          <Highlight tier="important">inlined directly in the HTML</Highlight>{" "}
          <code>&lt;head&gt;</code> and the 
          remaining CSS is loaded asynchronously. This eliminates CSS as a render-blocking resource, dramatically 
          improving First Contentful Paint (FCP) and Largest Contentful Paint (LCP).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          By default, browsers treat every <code>&lt;link rel=&quot;stylesheet&quot;&gt;</code> as render-blocking — 
          they won&apos;t paint any pixels until all linked stylesheets are downloaded and parsed. This is by design: 
          rendering HTML without CSS would produce a Flash of Unstyled Content (FOUC), which is jarring. However, for 
          a typical site with 200-300 KB of CSS, this can add 500ms-2s to the first render on slower connections, 
          even though only 10-30 KB of those styles are needed for the initial viewport.
        </HighlightBlock>
        <p>
          Critical CSS solves this by splitting the stylesheet into two parts:
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Critical CSS (Inlined):</strong> The 10-30 KB needed for above-the-fold content, placed directly 
            in a <code>&lt;style&gt;</code> tag in the HTML head. This is available immediately with no network request.
          </HighlightBlock>
          <li>
            <strong>Non-Critical CSS (Async):</strong> The remaining 170-270 KB for below-the-fold content, loaded 
            asynchronously without blocking render using techniques like preload or the print media trick.
          </li>
        </ul>
        <p>
          The performance impact is substantial:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>FCP Improvement:</strong> Eliminating render-blocking CSS can improve FCP by 500ms-1.5s on 3G 
            connections.
          </li>
          <li>
            <strong>LCP Improvement:</strong> Since LCP often depends on CSS for layout and styling, critical CSS 
            indirectly improves LCP by allowing earlier rendering.
          </li>
          <li>
            <strong>Perceived Performance:</strong> Users see meaningful content faster, even if total page load 
            time is unchanged.
          </li>
        </ul>
        <p>
          In system design interviews, critical CSS demonstrates understanding of the browser rendering pipeline, 
          resource prioritization, and the trade-offs between initial load time and caching efficiency.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="crucial">
          Core concept to carry: CSS is render-blocking by default, so the game is to make above-the-fold
          styles available in the first response while keeping long-term caching sane.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Critical CSS is about sequencing: users should see styled above-the-fold content without waiting for
          a stylesheet round trip.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The main trade-off is repeat visits: inlined CSS can&apos;t be cached independently, so you pay again
          on every HTML response.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/critical-css-flow.svg"
          alt="Diagram showing critical CSS extraction process from full stylesheet through extraction tool to inlined critical CSS and async-loaded non-critical CSS"
          caption="Critical CSS flow: full stylesheet is split into inlined critical CSS (10-30 KB) and asynchronously loaded non-critical CSS"
          captionTier="important"
        />

        <h3>Render-Blocking CSS</h3>
        <p>
          CSS is render-blocking by default because browsers don&apos;t want to display unstyled content. When the 
          HTML parser encounters a <code>&lt;link rel=&quot;stylesheet&quot;&gt;</code> tag in the head, it:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Pauses HTML parsing:</strong> The parser stops building the DOM until the CSS is downloaded.
          </li>
          <li>
            <strong>Downloads the CSS:</strong> Makes a network request to fetch the stylesheet.
          </li>
          <li>
            <strong>Parses the CSS:</strong> Builds the CSS Object Model (CSSOM) from the parsed rules.
          </li>
          <li>
            <strong>Combines with DOM:</strong> Merges the DOM and CSSOM into the render tree.
          </li>
          <li>
            <strong>Proceeds to render:</strong> Only then can the browser paint pixels.
          </li>
        </ol>
        <p>
          This sequential process means a 200 KB stylesheet on a slow connection can delay first paint by seconds, 
          even if the HTML is fully downloaded.
        </p>

        <h3>Above-the-Fold Content</h3>
        <p>
          <strong>Above-the-fold</strong> refers to the portion of the webpage visible without scrolling. The term 
          originates from newspaper publishing, where the most important headlines were placed on the upper half 
          of the front page (visible when folded on a newsstand).
        </p>
        <p>
          For web pages, above-the-fold content varies by device:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Desktop (1920×1080):</strong> Typically 800-1000 pixels of vertical space.
          </li>
          <li>
            <strong>Tablet (768×1024):</strong> Typically 600-800 pixels of vertical space.
          </li>
          <li>
            <strong>Mobile (375×667):</strong> Typically 400-500 pixels of vertical space.
          </li>
        </ul>
        <p>
          Critical CSS extraction tools typically test against multiple viewport sizes to ensure the inlined CSS 
          covers all common devices.
        </p>

        <h3>CSS Critical Path</h3>
        <p>
          The <strong>critical rendering path</strong> is the sequence of steps the browser takes to convert HTML, 
          CSS, and JavaScript into pixels. Critical CSS optimizes this path by removing CSS from the critical path:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Without Critical CSS:</strong> HTML → Download CSS → Parse CSS → Build CSSOM → Combine with DOM 
            → Render
          </li>
          <li>
            <strong>With Critical CSS:</strong> HTML (with inlined CSS) → Build CSSOM immediately → Combine with DOM 
            → Render → Download remaining CSS in background
          </li>
        </ul>
        <p>
          By inlining critical CSS, the browser skips the &quot;Download CSS&quot; step for the initial render, 
          eliminating a network round-trip from the critical path.
        </p>

        <h3>Font Loading Considerations</h3>
        <p>
          Web fonts are closely related to critical CSS. Without proper handling, fonts can cause:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>FOIT (Flash of Invisible Text):</strong> Text is hidden until the font loads (up to 3 seconds).
          </li>
          <li>
            <strong>FOUT (Flash of Unstyled Text):</strong> Text appears in a fallback font, then swaps to the web 
            font, causing a visible shift.
          </li>
        </ul>
        <p>
          The <code>font-display</code> CSS property controls this behavior. Using <code>font-display: swap</code> 
          or <code>font-display: optional</code> alongside critical CSS ensures text is visible immediately.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          The flow to explain: extract critical rules → inline → async-load the rest with a safe fallback →
          verify CLS/FOUC and cache behavior. At senior level, mention variants (logged-in vs logged-out).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Production correctness means: non-critical CSS must always load (including noscript fallback), and
          extraction must cover meaningful layout variants.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Treat fonts as part of the same architecture. If fonts block text, your critical CSS work won&apos;t
          translate into perceived performance.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/critical-css-render-path.svg"
          alt="Comparison diagram showing render blocking CSS timeline versus critical CSS inline approach with network round trips and FCP times"
          caption="Render path comparison: critical CSS eliminates CSS from critical path, improving FCP by 78%"
        />

        <h3>Critical CSS Implementation Patterns</h3>
        <p>
          There are several approaches to implementing critical CSS:
        </p>

        <h4>Pattern 1: Inline Critical CSS in HTML Head</h4>
        <p>
          The core pattern: extract critical CSS and place it in a <code>&lt;style&gt;</code> tag in the document 
          head, then load the full stylesheet asynchronously.
        </p>
        <p>
          The HTML structure looks like:
        </p>
        <ul className="space-y-1">
          <li>
            <code>&lt;style&gt;</code> — Critical CSS inlined (10-30 KB)
          </li>
          <li>
            <code>&lt;link rel=&quot;preload&quot; href=&quot;styles.css&quot; as=&quot;style&quot; onload=&quot;this.onload=null;this.rel=&apos;stylesheet&apos;&quot;&gt;</code>
          </li>
          <li>
            <code>&lt;noscript&gt;&lt;link rel=&quot;stylesheet&quot; href=&quot;styles.css&quot;&gt;&lt;/noscript&gt;</code>
          </li>
        </ul>

        <h4>Pattern 2: Build-Time Extraction</h4>
        <p>
          Tools like <code>critical</code> (npm package) render the page in a headless browser, determine which 
          CSS rules apply to the above-the-fold content, and extract them automatically.
        </p>
        <p>
          The workflow:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Build the page:</strong> Generate the production HTML.
          </li>
          <li>
            <strong>Render in headless browser:</strong> Puppeteer loads the page and captures the viewport.
          </li>
          <li>
            <strong>Extract used CSS:</strong> Identify which CSS rules apply to elements in the viewport.
          </li>
          <li>
            <strong>Inline and defer:</strong> Insert critical CSS in the head, modify the stylesheet link to load 
            asynchronously.
          </li>
        </ol>

        <h4>Pattern 3: Critters (Webpack/Next.js)</h4>
        <p>
          Critters is a Webpack plugin that extracts critical CSS at build time without a headless browser. It 
          parses the HTML and CSS statically, which is faster but less accurate than browser-based extraction.
        </p>
        <p>
          Next.js uses Critters internally when the <code>optimizeCss</code> experimental flag is enabled.
        </p>

        <h4>Pattern 4: CSS-in-JS Solutions</h4>
        <p>
          Libraries like styled-components and Emotion provide automatic critical CSS during server-side rendering. 
          They extract only the CSS for components that actually render on the server and inline it in the HTML.
        </p>
        <p>
          This is effectively automatic critical CSS, though it&apos;s based on rendered components rather than 
          viewport position.
        </p>

        <h3>Async Loading Techniques</h3>
        <p>
          After inlining critical CSS, the non-critical stylesheet must be loaded without blocking render:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Preload with onload:</strong> <code>&lt;link rel=&quot;preload&quot; as=&quot;style&quot; onload=&quot;this.rel=&apos;stylesheet&apos;&quot;&gt;</code> 
            — Modern approach, works in all modern browsers.
          </li>
          <li>
            <strong>Print media trick:</strong> <code>&lt;link rel=&quot;stylesheet&quot; href=&quot;styles.css&quot; media=&quot;print&quot; onload=&quot;this.media=&apos;all&apos;&quot;&gt;</code> 
            — Older approach, still widely used.
          </li>
          <li>
            <strong>JavaScript injection:</strong> Create the link element dynamically with JavaScript after page 
            load.
          </li>
          <li>
            <strong>noscript fallback:</strong> Always include a <code>&lt;noscript&gt;</code> fallback for users 
            with JavaScript disabled.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>

        <HighlightBlock as="p" tier="crucial">
          Critical CSS is an{" "}
          <Highlight tier="important">availability-of-styles</Highlight> tactic: you are paying build and caching
          complexity to guarantee above-the-fold pixels render without waiting for a stylesheet RTT. In interviews,
          articulate the trade between{" "}
          <Highlight tier="important">repeat-visit cache efficiency</Highlight> and{" "}
          <Highlight tier="important">first-visit paint</Highlight>.
        </HighlightBlock>

        <h3>Benefits of Critical CSS</h3>
        <ul className="space-y-2">
          <li>
            <strong>Faster First Paint:</strong> Eliminating render-blocking CSS can improve FCP by 500ms-1.5s on 
            3G connections.
          </li>
          <li>
            <strong>Improved LCP:</strong> Since LCP often depends on CSS for layout, critical CSS indirectly 
            improves LCP scores.
          </li>
          <li>
            <strong>Better Perceived Performance:</strong> Users see content faster, even if total load time is 
            unchanged.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Single Round-Trip Rendering:</strong> If the HTML with inlined critical CSS fits in the first 
            TCP congestion window (~14 KB), the browser can render after a single network round-trip.
          </HighlightBlock>
        </ul>

        <h3>Trade-offs and Costs</h3>
        <ul className="space-y-2">
          <li>
            <strong>Duplicated CSS:</strong> Critical CSS is both inlined in the HTML and present in the full 
            stylesheet, adding 10-30 KB to total page size.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Caching Inefficiency:</strong> Inlined CSS can&apos;t be cached separately by the browser. On 
            repeat visits, users re-download inlined CSS with every HTML page.
          </HighlightBlock>
          <li>
            <strong>Build Complexity:</strong> Automated critical CSS extraction adds build time and complexity. 
            Headless browser rendering can be slow (2-5 seconds per page).
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Dynamic Content Challenges:</strong> If above-the-fold content changes based on user state 
            (logged-in header, personalized hero), statically extracted critical CSS may not cover all variations.
          </HighlightBlock>
          <li>
            <strong>Below-Fold Flash:</strong> If the async stylesheet fails to load or loads slowly, below-the-fold 
            content appears unstyled when the user scrolls.
          </li>
        </ul>

        <h3>Extraction Tools Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Tool</th>
                <th className="p-3 text-left">Method</th>
                <th className="p-3 text-left">Speed</th>
                <th className="p-3 text-left">Accuracy</th>
                <th className="p-3 text-left">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">critical (npm)</td>
                <td className="p-3">Headless browser</td>
                <td className="p-3">Slow (2-5s/page)</td>
                <td className="p-3">High</td>
                <td className="p-3">Static sites, build-time extraction</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Critters</td>
                <td className="p-3">Static analysis</td>
                <td className="p-3">Fast</td>
                <td className="p-3">Medium</td>
                <td className="p-3">Webpack/Next.js projects</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Penthouse</td>
                <td className="p-3">Headless browser</td>
                <td className="p-3">Medium</td>
                <td className="p-3">High</td>
                <td className="p-3">Simple pages</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">styled-components</td>
                <td className="p-3">SSR extraction</td>
                <td className="p-3">Fast</td>
                <td className="p-3">Medium</td>
                <td className="p-3">CSS-in-JS applications</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Manual</td>
                <td className="p-3">Hand-written</td>
                <td className="p-3">N/A</td>
                <td className="p-3">Variable</td>
                <td className="p-3">Small sites, full control</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/critical-css-best-practices.svg"
          alt="Diagram showing critical CSS best practices: inline critical CSS under 14KB, async load non-critical CSS, preload fonts, and provide noscript fallback"
          caption="Critical CSS best practices: keep critical CSS under 14KB, load non-critical CSS asynchronously, and always provide fallbacks"
        />
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="crucial">
          Best practices: keep inlined CSS small, ensure non-critical CSS always loads, and treat fonts as part
          of the first-paint story (otherwise critical CSS doesn&apos;t save you).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Keep the inlined payload tight (aim to fit within the first congestion window where possible).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Validate that your strategy improves FCP/LCP without regressing CLS (missing dimensions, late CSS).
        </HighlightBlock>

        <h3>Keep Critical CSS Under 14 KB</h3>
        <p>
          The first TCP congestion window is approximately 14 KB. If your HTML with inlined critical CSS fits 
          within this window, the browser can render after a single network round-trip. Aim for:
        </p>
        <ul className="space-y-1">
          <li>• Critical CSS: 10-14 KB compressed</li>
          <li>• Minimal HTML: 2-4 KB compressed</li>
          <li>• Total: Under 14 KB compressed</li>
        </ul>

        <h3>Test Multiple Viewports</h3>
        <p>
          Above-the-fold content varies by device. When extracting critical CSS, test against:
        </p>
        <ul className="space-y-1">
          <li>• Mobile: 375×667 (iPhone SE)</li>
          <li>• Mobile Large: 414×896 (iPhone 11)</li>
          <li>• Tablet: 768×1024 (iPad)</li>
          <li>• Desktop: 1300×900 (common laptop)</li>
        </ul>

        <h3>Include Font Styles in Critical CSS</h3>
        <p>
          Font declarations are often needed for above-the-fold text. Include:
        </p>
        <ul className="space-y-1">
          <li>• <code>@font-face</code> declarations for critical fonts</li>
          <li>• <code>font-display: swap</code> to prevent FOIT</li>
          <li>• Preload hints for font files</li>
        </ul>

        <h3>Always Provide noscript Fallback</h3>
        <p>
          Users with JavaScript disabled won&apos;t trigger the async CSS load. Always include:
        </p>
        <ul className="space-y-1">
          <li>• <code>&lt;noscript&gt;&lt;link rel=&quot;stylesheet&quot; href=&quot;styles.css&quot;&gt;&lt;/noscript&gt;</code></li>
        </ul>

        <h3>Monitor for CSS Bloat</h3>
        <p>
          Critical CSS extraction can sometimes include more CSS than necessary. Regularly:
        </p>
        <ul className="space-y-1">
          <li>• Review extracted critical CSS manually</li>
          <li>• Remove unused rules</li>
          <li>• Minify critical CSS</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3>Inlining Too Much CSS</h3>
        <HighlightBlock as="p" tier="crucial">
          Inlining more than 30 KB of CSS defeats the purpose — the HTML becomes slow to download, negating the 
          benefit of eliminating the CSS request.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Be aggressive about what&apos;s truly &quot;above-the-fold.&quot; Use tools 
          that show extracted CSS size and set a hard limit.
        </p>

        <h3>Missing Styles Below the Fold</h3>
        <p>
          If the async stylesheet fails to load, below-the-fold content appears unstyled when the user scrolls.
        </p>
        <p>
          <strong>Solution:</strong> Always verify the full stylesheet loads reliably. Add a <code>&lt;noscript&gt;</code> 
          fallback. Consider adding a retry mechanism for the async load.
        </p>

        <h3>Dynamic Content Mismatch</h3>
        <HighlightBlock as="p" tier="important">
          If above-the-fold content changes based on user state (logged-in header, personalized hero), statically 
          extracted critical CSS may not cover all variations.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Generate critical CSS for each significant layout variant. For highly dynamic 
          content, consider a hybrid approach with a minimal base critical CSS and component-level extraction.
        </p>

        <h3>Caching Conflicts</h3>
        <p>
          Inlined CSS can&apos;t be cached separately by the browser. On repeat visits, users re-download inlined 
          CSS with every HTML page.
        </p>
        <p>
          <strong>Solution:</strong> For sites with high return-visitor rates, consider a cookie-based approach: 
          inline on first visit, use cached external stylesheet on subsequent visits.
        </p>

        <h3>Forgetting About Fonts</h3>
        <HighlightBlock as="p" tier="important">
          You can inline all critical CSS perfectly, but if a web font blocks text rendering for 3 seconds, the 
          user still sees a blank page.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Always pair critical CSS with <code>font-display: swap</code> or 
          <code>font-display: optional</code>. Preload critical font files.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="crucial">
          In interviews, use cases should connect critical CSS to measurable FCP/LCP wins, and clearly state
          what you traded (build complexity, caching inefficiency) to get them.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Include the &quot;how we kept it maintainable&quot; part: automation, constraints, and periodic audits.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Mention how you handled personalization/layout variants (separate critical sets or hybrid strategy).
        </HighlightBlock>

        <h3>News Publisher: FCP Improvement</h3>
        <p>
          A news publisher with 250 KB of CSS implemented critical CSS extraction. The critical CSS was 18 KB, 
          inlined in the HTML. The remaining 232 KB loaded asynchronously.
        </p>
        <p>
          Results:
        </p>
        <ul className="space-y-1">
          <li>• FCP: 2.1s → 0.9s (57% improvement)</li>
          <li>• LCP: 3.2s → 1.8s (44% improvement)</li>
          <li>• Bounce rate decreased by 12%</li>
          <li>• Articles per session increased by 8%</li>
        </ul>

        <h3>E-Commerce Site: Mobile Performance</h3>
        <p>
          An e-commerce site implemented critical CSS for their product listing pages. They used the 
          <code>critical</code> npm package to extract CSS for three viewport sizes (mobile, tablet, desktop) 
          and served the appropriate critical CSS based on user agent.
        </p>
        <p>
          Results:
        </p>
        <ul className="space-y-1">
          <li>• Mobile FCP: 3.4s → 1.6s</li>
          <li>• Mobile conversion rate increased by 15%</li>
          <li>• Time to first product visible: 2.8s → 1.2s</li>
        </ul>

        <h3>SaaS Dashboard: CSS-in-JS Optimization</h3>
        <p>
          A SaaS dashboard using styled-components leveraged the library&apos;s SSR extraction to automatically 
          inline critical CSS. Only styles for components rendered on the server were inlined.
        </p>
        <p>
          Results:
        </p>
        <ul className="space-y-1">
          <li>• No manual critical CSS extraction needed</li>
          <li>• FCP improved by 400ms on average</li>
          <li>• Maintenance overhead reduced (automatic with SSR)</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview bar: describe render-blocking behavior, the inline/async split, caching trade-offs, and
          how you avoid CLS/FOUC across variants.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Strong answers reference measurable targets (FCP/LCP/CLS) and a safe loading fallback (noscript).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Call out real pitfalls: inlining too much, dynamic mismatch, and forgetting fonts.
        </HighlightBlock>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is critical CSS and why does it improve performance?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <HighlightBlock as="p" tier="important" className="mb-3">
              Critical CSS is the minimum CSS needed to render above-the-fold content, inlined directly in the 
              HTML <code>&lt;head&gt;</code> to eliminate render-blocking stylesheet downloads.
            </HighlightBlock>
            <p className="mb-3">
              It improves performance because:
            </p>
            <ul className="space-y-1">
              <li>• <strong>Eliminates render-blocking:</strong> Browsers normally wait for all CSS to download 
              before rendering. Critical CSS removes this blocking for above-the-fold content.</li>
              <li>• <strong>Reduces round-trips:</strong> The CSS is available immediately with no network request.</li>
              <HighlightBlock as="li" tier="important">
                • <strong>Single TCP window:</strong> If HTML + critical CSS fits in ~14 KB, the browser can 
                render after one network round-trip.
              </HighlightBlock>
            </ul>
            <HighlightBlock as="p" tier="important" className="mt-3">
              Typical improvement: FCP improves by 500ms-1.5s on 3G connections.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you extract critical CSS from a full stylesheet?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              There are three main approaches:
            </p>
            <ol className="space-y-2">
              <li>
                <strong>Automated Tools (critical, Penthouse):</strong> These render the page in a headless 
                browser, identify which CSS rules apply to elements in the viewport, and extract them. Most 
                accurate but slow (2-5s per page).
              </li>
              <li>
                <strong>Build-Time Analysis (Critters):</strong> Statically analyzes HTML and CSS at build time 
                to determine used rules. Faster but less accurate than headless browser approach.
              </li>
              <li>
                <strong>Manual Extraction:</strong> Hand-identify and extract above-the-fold styles. Time-consuming 
                but gives full control. Practical only for small sites.
              </li>
            </ol>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you load non-critical CSS without blocking render?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Common techniques:
            </p>
            <ul className="space-y-1">
              <li>• <strong>Preload with onload:</strong> <code>&lt;link rel=&quot;preload&quot; as=&quot;style&quot; onload=&quot;this.rel=&apos;stylesheet&apos;&quot;&gt;</code></li>
              <li>• <strong>Print media trick:</strong> <code>&lt;link rel=&quot;stylesheet&quot; media=&quot;print&quot; onload=&quot;this.media=&apos;all&apos;&quot;&gt;</code></li>
              <li>• <strong>JavaScript injection:</strong> Create link element dynamically after page load</li>
              <li>• <strong>noscript fallback:</strong> Always include <code>&lt;noscript&gt;</code> for JS-disabled users</li>
            </ul>
            <p className="mt-3">
              I recommend the preload approach for modern browsers with a noscript fallback.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What are the trade-offs of inlining critical CSS?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Benefits:
            </p>
            <ul className="space-y-1">
              <li>• Faster first paint (500ms-1.5s improvement on 3G)</li>
              <li>• Better perceived performance</li>
              <li>• Improved Core Web Vitals (FCP, LCP)</li>
            </ul>
            <p className="mb-3 mt-3">
              Trade-offs:
            </p>
            <ul className="space-y-1">
              <li>• <strong>Duplicated CSS:</strong> Critical CSS is both inlined and in the full stylesheet</li>
              <li>• <strong>Caching inefficiency:</strong> Inlined CSS can&apos;t be cached separately; re-downloaded 
              on every page</li>
              <li>• <strong>Build complexity:</strong> Automated extraction adds build time and complexity</li>
              <li>• <strong>Dynamic content challenges:</strong> Different page states may need different critical CSS</li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How does CSS-in-JS relate to critical CSS?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              CSS-in-JS libraries like styled-components and Emotion provide automatic critical CSS during SSR:
            </p>
            <ul className="space-y-1">
              <li>• During server rendering, only styles for rendered components are collected</li>
              <li>• These styles are inlined in the HTML as a <code>&lt;style&gt;</code> tag</li>
              <li>• This is effectively automatic critical CSS extraction</li>
            </ul>
            <p className="mb-3">
              However, this is based on which components render, not viewport position. A component below the 
              fold still has its CSS inlined if it renders on the server.
            </p>
            <p className="mt-3">
              For true viewport-based critical CSS, you still need dedicated extraction tools.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What size should critical CSS be?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Critical CSS should ideally be:
            </p>
            <ul className="space-y-1">
              <li>• <strong>10-14 KB compressed:</strong> Fits in the first TCP congestion window</li>
              <li>• <strong>Maximum 30 KB:</strong> Beyond this, the HTML download time negates the benefit</li>
            </ul>
            <p className="mb-3">
              If critical CSS exceeds 30 KB, you&apos;re likely including too much. Be aggressive about what&apos;s 
              truly needed for above-the-fold rendering.
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
              href="https://web.dev/extract-critical-css/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              web.dev — Extract Critical CSS
            </a>
            <p className="text-sm text-muted mt-1">
              Google&apos;s guide on critical CSS extraction techniques and tools.
            </p>
          </li>
          <li>
            <a 
              href="https://github.com/addyosmani/critical" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              critical (npm package)
            </a>
            <p className="text-sm text-muted mt-1">
              Popular Node.js tool for automating critical CSS extraction with Puppeteer.
            </p>
          </li>
          <li>
            <a 
              href="https://github.com/GoogleChromeLabs/critters" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Critters (Webpack Plugin)
            </a>
            <p className="text-sm text-muted mt-1">
              Webpack plugin for critical CSS extraction used by Next.js.
            </p>
          </li>
          <li>
            <a 
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/@font-display" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              MDN — font-display
            </a>
            <p className="text-sm text-muted mt-1">
              Documentation on font-display property for controlling font loading behavior.
            </p>
          </li>
          <li>
            <a 
              href="https://www.smashingmagazine.com/2015/08/understanding-critical-css/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Smashing Magazine — Understanding Critical CSS
            </a>
            <p className="text-sm text-muted mt-1">
              Comprehensive guide to critical CSS concepts and implementation.
            </p>
          </li>
          <li>
            <a 
              href="https://nextjs.org/docs/app/api-reference/next-config-js/optimizePackageImports" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Next.js — CSS Optimization
            </a>
            <p className="text-sm text-muted mt-1">
              Next.js documentation on CSS optimization including critical CSS.
            </p>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
