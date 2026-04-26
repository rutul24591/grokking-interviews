"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-server-sid-extensive",
  title: "Server-Side Rendering (SSR)",
  description:
    "Comprehensive guide to Server-Side Rendering (SSR) covering concepts, hydration, implementation, and best practices.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "server-side-rendering",
  wordCount: 3400,
  readingTime: 14,
  lastUpdated: "2026-03-05",
  tags: ["frontend", "rendering", "SSR", "hydration", "performance"],
  relatedTopics: [
    "client-side-rendering",
    "static-site-generation",
    "streaming-ssr",
  ],
};

export default function ServerSideRenderingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Server-Side Rendering (SSR)</strong> is a rendering pattern
          where HTML is generated on the server for each request, sent to the
          browser as fully-formed markup, and then "hydrated" with JavaScript to
          become interactive. Unlike CSR where the browser receives an{" "}
          <Highlight tier="important">empty shell</Highlight>, SSR delivers{" "}
          <Highlight tier="important">meaningful content immediately</Highlight>
          , enabling faster First Contentful Paint and better SEO.
        </HighlightBlock>
        <p>
          SSR represents a return to traditional server rendering with a modern
          twist. In the early web (pre-2010), all rendering happened server-side
          (PHP, Rails, ASP.NET). The SPA revolution shifted rendering to
          clients, but this created SEO and performance problems. Modern SSR
          (2016+) combines the best of both worlds: server-rendered HTML for
          fast initial load plus client-side JavaScript for rich interactivity.
        </p>
        <p>
          The pattern gained mainstream adoption with frameworks like Next.js
          (2016), Nuxt.js (2016), and later SvelteKit and Remix. These
          frameworks automate the complex orchestration of rendering on servers,
          serializing state, sending HTML to browsers, and hydrating components
          with event listeners and interactivity. SSR is now the recommended
          approach for most production web applications.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>Understanding SSR requires grasping several fundamental concepts:</p>
        <ul>
          <li>
            <strong>Server Rendering:</strong> For each request, the server
            executes JavaScript (Node.js), runs React/Vue components, fetches
            data, and generates complete HTML. This HTML contains the full
            initial UI state.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Hydration:</strong> After the browser receives and displays
            HTML, JavaScript downloads and "hydrates" the static markup,
            attaching event listeners and making it interactive. The React tree
            reconciles with existing DOM instead of replacing it.
          </HighlightBlock>
          <li>
            <strong>State Serialization:</strong> Server-side data is serialized
            (typically as JSON in a script tag), sent with HTML, and reused
            client-side to avoid refetching. This ensures consistency between
            server and client renders.
          </li>
          <li>
            <strong>Double Rendering:</strong> Components render twice - once on
            server (to generate HTML) and once on client (during hydration).
            This can cause issues if renders produce different output.
          </li>
          <li>
            <strong>Time to First Byte (TTFB):</strong> SSR increases TTFB
            because the server must execute code, fetch data, and render HTML
            before responding. This is traded for faster First Contentful Paint
            (FCP).
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>The SSR architecture follows this request-response pattern:</p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">SSR Request Flow</h3>
          <ol className="space-y-3">
            <li>
              <strong>1. User Request:</strong> Browser requests
              example.com/products/123
            </li>
            <li>
              <strong>2. Server Processing:</strong> Node.js server receives
              request
            </li>
            <li>
              <strong>3. Data Fetching:</strong> Server calls APIs/databases to
              fetch product data
            </li>
            <li>
              <strong>4. Component Rendering:</strong> React/Vue renders
              components to HTML string
            </li>
            <li>
              <strong>5. State Serialization:</strong> Server serializes data as
              JSON in script tag
            </li>
            <li>
              <strong>6. HTML Response:</strong> Server sends complete HTML
              (~50-200KB) with content
            </li>
            <li>
              <strong>7. Browser Parse:</strong> Browser parses HTML and
              displays content (FCP)
            </li>
            <li>
              <strong>8. JS Download:</strong> Browser fetches JavaScript
              bundles
            </li>
            <li>
              <strong>9. Hydration:</strong> React hydrates DOM, attaches event
              listeners
            </li>
            <li>
              <strong>10. Interactive:</strong> Page becomes fully interactive
              (TTI)
            </li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/ssr-request-sequence.svg"
          alt="SSR Request Response Flow with Hydration"
          caption="SSR Request/Response Flow with Hydration: Shows the complete lifecycle from initial request through server rendering, HTML delivery, and client-side hydration. Note the gap between FCP (content visible) and TTI (fully interactive)."
        />

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/ssr-hydration-flow.svg"
          alt="SSR Hydration Process Flowchart"
          caption="SSR + Hydration Process Flowchart: Detailed step-by-step flow showing server-side rendering (blue), content display (green), and hydration phases (yellow). The hydration phase is critical for interactivity but can create a delay between visible and interactive states."
        />

        <HighlightBlock as="p" tier="crucial">
          The key advantage is step 7 happens quickly - users see content in
          0.5-2 seconds (depending on TTFB and network). In CSR, users wait
          until step 9-10 to see anything. However, SSR pages aren't interactive
          until hydration completes, creating a "uncanny valley" where content
          is visible but not clickable.
        </HighlightBlock>

        <HighlightBlock
          className="mt-6 rounded-lg border border-theme bg-panel-soft p-4"
          tier="important"
        >
          <h3 className="mb-2 font-semibold">Critical Performance Metrics</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>TTFB (Time to First Byte):</strong> Higher in SSR
              (500ms-2s) due to server processing
            </li>
            <li>
              <strong>FCP (First Contentful Paint):</strong> Fast in SSR (1-2s)
              - content in initial HTML
            </li>
            <li>
              <strong>LCP (Largest Contentful Paint):</strong> Good if images
              optimized
            </li>
            <li>
              <strong>TTI (Time to Interactive):</strong> Similar to CSR (3-5s)
              - must wait for hydration
            </li>
            <li>
              <strong>TBT (Total Blocking Time):</strong> Hydration can block
              main thread
            </li>
          </ul>
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Performance</strong>
              </td>
              <td className="p-3">
                • Fast First Contentful Paint (FCP)
                <br />
                • Content visible immediately
                <br />• Good Core Web Vitals (LCP, CLS)
              </td>
              <td className="p-3">
                • Slower Time to First Byte (TTFB)
                <br />
                • Hydration delay before interactive
                <br />• Server must process each request
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>SEO</strong>
              </td>
              <td className="p-3">
                • Perfect SEO - content in HTML
                <br />
                • Works with all crawlers
                <br />• Social media previews work perfectly
              </td>
              <td className="p-3">
                • Must handle dynamic data carefully
                <br />• Can't rely on client-only APIs
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Development</strong>
              </td>
              <td className="p-3">
                • Modern frameworks abstract complexity
                <br />
                • Integrated data fetching
                <br />• Better debugging (see HTML source)
              </td>
              <td className="p-3">
                • More complex architecture
                <br />
                • Must handle server/client differences
                <br />• Hydration mismatches can be tricky
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>User Experience</strong>
              </td>
              <td className="p-3">
                • Content appears faster
                <br />
                • Works without JavaScript
                <br />• Better perceived performance
              </td>
              <td className="p-3">
                • "Uncanny valley" - visible but not clickable
                <br />
                • Full page reloads on navigation (without SPA mode)
                <br />• Flash of unstyled content (FOUC) possible
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Infrastructure</strong>
              </td>
              <td className="p-3">
                • Can use edge computing (Vercel, Cloudflare)
                <br />
                • Reduced client device burden
                <br />• Better for slow devices
              </td>
              <td className="p-3">
                • Requires Node.js server (or serverless)
                <br />
                • Higher server costs vs static CSR
                <br />• Complex caching strategies needed
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/ssr-performance-comparison.svg"
          alt="Performance Timeline Comparison SSR vs CSR vs SSG"
          caption="Performance Timeline Comparison: SSR delivers content visibility (FCP) faster than CSR but slower than SSG. Note how SSR has a gap between FCP and TTI (the 'uncanny valley'), while CSR has FCP and TTI at the same time. SSG provides the fastest overall experience with minimal TTFB from CDN edge caching."
        />

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/ssr-strategy-comparison.svg"
          alt="Rendering Strategy Comparison Chart"
          caption="Rendering Strategy Comparison: SSR balances fast content visibility with good SEO but requires server infrastructure. CSR has the slowest FCP but lowest hosting costs. SSG provides the best performance metrics but requires build-time data availability. Choose based on your content update frequency, SEO needs, and infrastructure constraints."
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>To build performant SSR applications, follow these practices:</p>
        <ol className="space-y-3">
          <li>
            <strong>Minimize TTFB:</strong> Keep server-side data fetching fast
            ({"&lt;"}500ms). Use caching layers (Redis, CDN edge caching). Fetch
            only critical data server-side. Consider partial SSR or streaming.
          </li>
          <li>
            <strong>Optimize Hydration:</strong> Use selective hydration (React
            18 Suspense). Lazy load non-critical interactive components.
            Consider progressive hydration or islands architecture. Minimize
            hydration payload.
          </li>
          <li>
            <strong>Handle State Carefully:</strong> Serialize only necessary
            data. Avoid serializing functions or circular references. Use
            devalue or superjson for complex types. Validate deserialized data.
          </li>
          <li>
            <strong>Prevent Hydration Mismatches:</strong> Ensure server and
            client render identical output. Avoid using Date.now(),
            Math.random(), or browser-only APIs during render. Use useEffect for
            client-only logic.
          </li>
          <li>
            <strong>Implement Proper Caching:</strong> Use
            stale-while-revalidate patterns. Cache at CDN edge for
            static/semi-static pages. Implement cache invalidation strategies.
            Use ISR (Incremental Static Regeneration) for mostly-static content.
          </li>
          <li>
            <strong>Code Split Effectively:</strong> Split by route
            automatically (Next.js does this). Lazy load heavy components below
            the fold. Use dynamic imports with SSR-safe patterns. Avoid
            hydrating everything immediately.
          </li>
          <li>
            <strong>Use Streaming SSR:</strong> Stream HTML as it's generated
            (React 18 renderToPipeableStream). Send critical above-fold content
            first. Use Suspense boundaries for async components. Reduces
            perceived TTFB.
          </li>
          <li>
            <strong>Monitor Performance:</strong> Track TTFB, FCP, TTI, and
            hydration time. Use Real User Monitoring (RUM) to catch hydration
            issues. Profile server-side rendering performance. Optimize slow
            data fetches.
          </li>
          <li>
            <strong>Handle Errors Gracefully:</strong> Implement error
            boundaries for SSR failures. Fallback to CSR if SSR fails. Log
            server-side errors properly. Provide meaningful error pages (500,
            404).
          </li>
          <li>
            <strong>Secure Server-Side Code:</strong> Never expose secrets in
            serialized state. Validate user input server-side. Implement rate
            limiting on SSR endpoints. Sanitize data before rendering to prevent
            XSS.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>Avoid these common mistakes when building SSR applications:</p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/ssr-hydration-mismatch.svg"
          alt="Hydration Mismatch Scenario Flowchart"
          caption="Hydration Mismatch Scenario: Shows how using browser-only APIs, timestamps, or random values during rendering causes server and client to produce different output. This leads to hydration warnings and potential UI bugs. Solution: Use useEffect for client-only logic, or suppressHydrationWarning for intentional differences (like timestamps)."
        />

        <ul className="space-y-3">
          <li>
            <strong>Hydration Mismatches:</strong> Server renders one thing,
            client renders another. Common causes: browser-only APIs
            (localStorage, window), Date.now(), random values, or third-party
            scripts modifying DOM before hydration. Use suppressHydrationWarning
            sparingly.
          </li>
          <li>
            <strong>Slow Server-Side Data Fetching:</strong> Making slow API
            calls (5s+) server-side blocks TTFB, creating worse UX than CSR.
            Keep data fetching fast, use caching, or fetch non-critical data
            client-side.
          </li>
          <li>
            <strong>Over-Hydrating:</strong> Sending too much JavaScript for
            hydration. Not all content needs interactivity. Use islands
            architecture (Astro, Fresh) or selective hydration to hydrate only
            interactive parts.
          </li>
          <li>
            <strong>Ignoring Memory Leaks:</strong> SSR apps are long-running
            servers. Memory leaks from unclosed connections, uncleared timers,
            or cached data accumulate over time. Monitor memory usage in
            production.
          </li>
          <li>
            <strong>Exposing Secrets in Serialized State:</strong> Accidentally
            serializing API keys, tokens, or sensitive user data. Only serialize
            public data. Use environment variables correctly (NEXT_PUBLIC_
            prefix).
          </li>
          <li>
            <strong>Not Handling SSR Failures:</strong> Server errors crash the
            page. Implement graceful degradation to CSR. Use error boundaries.
            Provide fallback UI for failed SSR.
          </li>
          <li>
            <strong>Using Browser APIs Server-Side:</strong> Accessing window,
            document, localStorage during SSR causes crashes. Always check
            typeof window !== 'undefined' or use useEffect for browser-only
            code.
          </li>
          <li>
            <strong>Poor Caching Strategy:</strong> Re-rendering identical pages
            on every request wastes server resources. Implement CDN caching,
            ISR, or on-demand revalidation for semi-static content.
          </li>
          <li>
            <strong>Blocking the Server Thread:</strong> Heavy computations
            during SSR block Node.js event loop, degrading performance for all
            users. Use worker threads or offload to external services.
          </li>
          <li>
            <strong>Not Optimizing Images:</strong> Sending large unoptimized
            images in SSR HTML. Use Next.js Image component, responsive images,
            and modern formats (WebP, AVIF). Lazy load below-fold images.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>SSR excels in these scenarios:</p>
        <ul className="space-y-3">
          <li>
            <strong>E-commerce Product Pages:</strong> Amazon, Shopify, and Etsy
            use SSR for product pages. Fast initial load improves conversion.
            Perfect SEO for product discovery. Content visible even if JS fails.
          </li>
          <li>
            <strong>News & Media Sites:</strong> The New York Times, BBC, and
            CNN use SSR for articles. Critical for SEO and social sharing. Users
            see content immediately. Ads and interactive widgets hydrate
            afterward.
          </li>
          <li>
            <strong>Marketing Landing Pages:</strong> Product landing pages,
            SaaS homepages, and campaign pages need fast load and perfect SEO.
            SSR ensures good Core Web Vitals (ranking factor) and social
            previews.
          </li>
          <li>
            <strong>Social Media Platforms:</strong> Twitter/X, Reddit, and
            LinkedIn use SSR for public profiles and posts. Enables link
            previews, SEO for public content, and fast initial render.
            Authenticated views may use CSR.
          </li>
          <li>
            <strong>Documentation Sites:</strong> While often better as SSG,
            dynamic documentation (with search, personalization) benefits from
            SSR. Examples: Stripe Docs, AWS Documentation.
          </li>
          <li>
            <strong>Personalized Content:</strong> Netflix homepage, Spotify
            recommendations, or YouTube feed use SSR to show personalized
            content instantly. Server fetches user-specific data and renders
            custom HTML.
          </li>
          <li>
            <strong>Search Engines:</strong> Google Search results use SSR
            (though proprietary). Fast initial render with query results in
            HTML. Interactivity (filters, maps) hydrates afterward.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Use SSR</h3>
          <p>Avoid SSR for:</p>
          <ul className="mt-2 space-y-2">
            <li>
              • Fully authenticated apps where SEO doesn't matter (admin
              dashboards) - use CSR
            </li>
            <li>
              • Static content that rarely changes (blogs, docs) - use SSG
              instead
            </li>
            <li>
              • Real-time collaborative apps (Figma, Google Docs) - too dynamic
              for SSR
            </li>
            <li>
              • Apps with expensive server-side rendering - consider ISR or
              hybrid approaches
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is hydration and why is it needed?
            </p>
            <p className="mt-2 text-sm">
              A: Hydration is the process where client-side JavaScript attaches
              event listeners and state to server-rendered HTML. It's needed
              because SSR sends static HTML - the page is visible but not
              interactive. Hydration makes buttons clickable, forms submittable,
              and state management work. React reconciles its virtual DOM with
              existing DOM instead of replacing it.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: SSR vs CSR - when to use each?</p>
            <p className="mt-2 text-sm">
              A: Use SSR for public content needing SEO and fast initial load
              (e-commerce, news, marketing pages). Use CSR for authenticated
              apps where SEO doesn't matter and interactivity is key
              (dashboards, tools). SSR has fast FCP but slow TTFB. CSR has slow
              FCP but fast subsequent navigation. Hybrid approaches (Next.js)
              let you choose per-page.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are hydration mismatches and how do you prevent them?
            </p>
            <p className="mt-2 text-sm">
              A: Hydration mismatches occur when server-rendered HTML differs
              from client-rendered output. Causes: using Date.now(),
              Math.random(), localStorage, or browser APIs during render.
              Prevent by ensuring identical server/client output. Use useEffect
              for client-only code. Validate that random/time-based values are
              serialized from server. Use suppressHydrationWarning only when
              necessary (like timestamps).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you optimize SSR performance?
            </p>
            <p className="mt-2 text-sm">
              A: Minimize TTFB by keeping data fetching fast ({"&lt;"}500ms),
              using caching (Redis, CDN). Implement streaming SSR (React 18) to
              send HTML progressively. Use edge functions (Vercel, Cloudflare)
              for lower latency. Optimize hydration with code splitting and
              selective hydration. Consider ISR for mostly-static pages. Use CDN
              edge caching with stale-while-revalidate.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://web.dev/rendering-on-the-web/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Rendering on the Web - web.dev
            </a>
          </li>
          <li>
            <a
              href="https://nextjs.org/docs/app/building-your-application/rendering/server-components"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js Documentation - Server Components
            </a>
          </li>
          <li>
            <a
              href="https://react.dev/reference/react-dom/server"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Documentation - Server Rendering APIs
            </a>
          </li>
          <li>
            <a
              href="https://nuxt.com/docs/guide/concepts/rendering"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nuxt.js Guide - Rendering Modes
            </a>
          </li>
          <li>
            <a
              href="https://kit.svelte.dev/docs/page-options#ssr"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SvelteKit Documentation - SSR
            </a>
          </li>
          <li>
            <a
              href="https://www.patterns.dev/posts/rendering-patterns"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              patterns.dev - Rendering Patterns
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
