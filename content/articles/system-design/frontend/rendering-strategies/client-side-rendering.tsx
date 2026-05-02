"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { useHighlights } from "@/components/articles/HighlightsContext";
import { classNames } from "@/lib/classNames";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-client-sid-extensive",
  title: "Client-Side Rendering (CSR)",
  description:
    "Comprehensive guide to Client-Side Rendering (CSR) covering concepts, implementation, and best practices.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "client-side-rendering",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-05",
  tags: ["frontend", "rendering", "CSR", "SPA", "JavaScript"],
  relatedTopics: [
    "server-side-rendering",
    "static-site-generation",
    "progressive-hydration",
  ],
};

function ClientSideRenderingArticleContent() {
  const { highlightsOn } = useHighlights();

  return (
    <>
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Client-Side Rendering (CSR)</strong> is a rendering pattern
          where the browser downloads a{" "}
          <Highlight tier="important">minimal HTML page</Highlight>, and
          JavaScript is responsible for dynamically rendering content on the
          client. The server sends a{" "}
          <Highlight tier="important">nearly empty HTML shell</Highlight> with{" "}
          <Highlight tier="important">JavaScript bundles</Highlight>, and the
          application builds the DOM entirely in the browser.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          CSR emerged with the rise of Single Page Applications (SPAs) around
          2010-2012, pioneered by frameworks like AngularJS, Backbone.js, and
          later React, Vue, and Angular. This approach shifted rendering
          responsibility from servers to browsers, enabling rich, interactive
          experiences that felt more like native desktop applications.
        </HighlightBlock>
        <p>
          The paradigm shift was driven by several factors: improving browser
          JavaScript engines (V8, SpiderMonkey), the need for highly interactive
          web applications, reduced server costs by offloading computation to
          clients, and the desire for faster subsequent navigation after initial
          load.
        </p>
        <HighlightBlock as="p" tier="important">
          Interview framing: CSR is a deliberate trade where you accept{" "}
          <Highlight tier="important">slower first load</Highlight> for{" "}
          <Highlight tier="important">fast in-app navigation</Highlight> and a
          richer client runtime. You should be able to articulate the CSR
          critical path (HTML shell, JS parse/execute, data fetch, render) and
          where you’ll invest (bundling, caching, RUM, perf budgets).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          CSR is usually best for{" "}
          <Highlight tier="important">authenticated products</Highlight>{" "}
          (dashboards, editors, internal tools) and weaker for{" "}
          <Highlight tier="important">public SEO pages</Highlight> unless you
          layer SSR/SSG/ISR for the entry routes.
        </HighlightBlock>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding CSR requires grasping several fundamental concepts that
          define how it operates:
        </p>
        <ul>
          <HighlightBlock as="li" tier="important">
            <strong>Initial HTML Shell:</strong> The server returns minimal HTML
            (often just a div with id="root") with script tags that reference
            JavaScript bundles. This HTML contains no meaningful content.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>JavaScript Hydration:</strong> Once JS downloads and
            executes, it takes over the page, fetches data via APIs, and
            dynamically constructs the DOM tree in the browser.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Runtime Rendering:</strong> All rendering happens at runtime
            in the browser. Components mount, state updates trigger re-renders,
            and the virtual DOM reconciles changes to the actual DOM.
          </HighlightBlock>
          <li>
            <strong>Client-Side Routing:</strong> Navigation is handled by
            JavaScript routers (React Router, Vue Router) without full page
            reloads. The URL changes via History API, but no server request is
            made.
          </li>
          <li>
            <strong>API-Driven Architecture:</strong> CSR apps typically consume
            REST or GraphQL APIs, making them backend-agnostic and enabling true
            separation of concerns between frontend and backend.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Deterministic Rendering:</strong> Since HTML is produced on
            the client, you must design for{" "}
            <Highlight tier="important">loading</Highlight>,{" "}
            <Highlight tier="important">error</Highlight>, and{" "}
            <Highlight tier="important">empty</Highlight> states, and ensure
            your first paint is predictable even under slow networks, low-end
            CPUs, and partial API failure.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <HighlightBlock as="p" tier="important">
          The CSR architecture follows a distinct request-response pattern:
          meaningful UI is gated on JS download, execution, and data fetching.
        </HighlightBlock>

        <HighlightBlock
          as="div"
          tier="important"
          className="my-6 rounded-lg bg-panel-soft p-6"
        >
          <h3 className="mb-4 text-lg font-semibold">CSR Request Flow</h3>
          <ol className="space-y-3">
            <li>
              <strong>1. User Request:</strong> Browser requests example.com
            </li>
            <li>
              <strong>2. Server Response:</strong> Returns minimal HTML (~2-5KB)
              with CSS/JS links
            </li>
            <li>
              <strong>3. Parse HTML:</strong> Browser parses HTML and discovers
              script tags
            </li>
            <li>
              <strong>4. Download JavaScript:</strong> Fetches app bundles
              (vendor.js, main.js) - often 200KB-2MB
            </li>
            <li>
              <strong>5. Execute JavaScript:</strong> JS engine parses and
              executes code, initializes framework
            </li>
            <li>
              <strong>6. Render Initial UI:</strong> App renders loading state
              or skeleton UI
            </li>
            <li>
              <strong>7. Fetch Data:</strong> Makes API calls to backend
              (fetch/axios)
            </li>
            <li>
              <strong>8. Re-render with Data:</strong> Updates UI with fetched
              data
            </li>
            <li>
              <strong>9. Interactive:</strong> App becomes fully interactive
              (TTI)
            </li>
          </ol>
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/csr-flow-sequence.svg"
          alt="CSR Request Flow Sequence Diagram"
          caption="Client-Side Rendering Request Flow - Sequential steps showing the multi-stage loading process"
          captionClassName={classNames(highlightsOn && "highlight-important")}
        />

        <HighlightBlock as="p" tier="crucial">
          This multi-step process means users may experience a{" "}
          <Highlight tier="important">blank screen</Highlight> or loading
          spinner during steps 2-7, which can take 3-10 seconds on slower
          networks or devices. First Contentful Paint (FCP) is delayed until
          JavaScript executes and renders content.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Staff+ interview signal: you should talk about preventing "white
          screen" time via <Highlight tier="important">route-based splitting</Highlight>,{" "}
          <Highlight tier="important">prioritized hydration</Highlight> (or
          islands/partial hydration), and{" "}
          <Highlight tier="important">data prefetching</Highlight> for the first
          route.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          CSR also makes the API tier part of the page-load critical path; for
          robustness you typically add <Highlight tier="important">timeouts</Highlight>,{" "}
          <Highlight tier="important">retries with backoff</Highlight>, and{" "}
          <Highlight tier="important">cached fallbacks</Highlight> so a slow API
          doesn’t brick first paint.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/csr-architecture-flow.svg"
          alt="CSR Architecture Flow Diagram"
          caption="CSR Architecture Flow - Shows the dependency chain from initial request to interactivity"
          captionClassName={classNames(highlightsOn && "highlight-important")}
        />
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
            <HighlightBlock as="tr" tier="crucial">
              <td className="p-3">
                <strong>Performance</strong>
              </td>
              <td className="p-3">
                • <Highlight tier="important">Fast subsequent navigation</Highlight>{" "}
                (no page reloads)
                <br />
                • Rich interactivity with instant feedback
                <br />• Reduced server load
              </td>
              <td className="p-3">
                • Slow initial load (large JS bundles)
                <br />
                • Delayed Time to Interactive (TTI)
                <br />• Poor on slow networks/devices
              </td>
            </HighlightBlock>
            <HighlightBlock as="tr" tier="important">
              <td className="p-3">
                <strong>SEO</strong>
              </td>
              <td className="p-3">
                • Googlebot can render JS
                <br />• Dynamic meta tags via React Helmet
              </td>
              <td className="p-3">
                • Poor SEO for non-Google crawlers
                <br />
                • Content not in initial HTML
                <br />• Social media preview issues
              </td>
            </HighlightBlock>
            <tr>
              <td className="p-3">
                <strong>Development</strong>
              </td>
              <td className="p-3">
                • Clear separation of frontend/backend
                <br />
                • Easy to scale frontend independently
                <br />• Great developer experience
              </td>
              <td className="p-3">
                • Complex state management
                <br />
                • Large bundle sizes to manage
                <br />• Requires good DevOps for deployments
              </td>
            </tr>
            <HighlightBlock as="tr" tier="important">
              <td className="p-3">
                <strong>User Experience</strong>
              </td>
              <td className="p-3">
                • App-like feel with smooth transitions
                <br />
                • Optimistic UI updates
                <br />• Offline capabilities with service workers
              </td>
              <td className="p-3">
                • Blank screen on initial load
                <br />
                • Requires loading states everywhere
                <br />• Poor experience on slow connections
              </td>
            </HighlightBlock>
            <tr>
              <td className="p-3">
                <strong>Infrastructure</strong>
              </td>
              <td className="p-3">
                • Simple hosting (static files on CDN)
                <br />
                • Easy to cache and distribute
                <br />• Lower server costs
              </td>
              <td className="p-3">
                • Large CDN bandwidth costs
                <br />
                • Client devices do all the work
                <br />• Battery drain on mobile devices
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/csr-performance-gantt.svg"
          alt="CSR vs SSR Performance Timeline"
          caption="Performance comparison: CSR has delayed FCP (6s) but simpler architecture, while SSR has fast FCP (0.9s) but requires server processing"
          captionClassName={classNames(highlightsOn && "highlight-crucial")}
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>To build performant CSR applications, follow these practices:</p>
        <ol className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Code Splitting:</strong> Split bundles by route using
            dynamic imports. Load only necessary code for current page. Use
            React.lazy() or Vue's defineAsyncComponent().
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Aggressive Caching:</strong> Use service workers for offline
            support. Cache API responses with stale-while-revalidate strategy.
            Leverage HTTP cache headers for static assets.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Optimize Bundle Size:</strong> Tree-shake unused code,
            minify production builds, use modern JavaScript for modern browsers
            (with fallback), and analyze bundle with webpack-bundle-analyzer.
          </HighlightBlock>
          <li>
            <strong>Loading States:</strong> Show skeleton screens instead of
            spinners. Implement optimistic UI updates. Use Suspense boundaries
            (React 18+) for granular loading states.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Prefetching Data:</strong> Prefetch data for likely next
            routes. Use link prefetching for critical resources. Implement
            predictive prefetching based on user behavior.
          </HighlightBlock>
          <li>
            <strong>Critical CSS:</strong> Inline critical CSS in HTML head.
            Defer non-critical CSS loading. Use CSS-in-JS with SSR for automatic
            critical CSS extraction.
          </li>
          <li>
            <strong>Lazy Load Images:</strong> Use native lazy loading
            (loading="lazy"). Implement progressive image loading with blur-up
            technique. Use modern formats (WebP, AVIF).
          </li>
          <li>
            <strong>Error Boundaries:</strong> Wrap components in error
            boundaries. Gracefully handle API failures. Provide retry mechanisms
            for failed requests.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>Avoid these common mistakes when building CSR applications:</p>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Ignoring Initial Load Performance:</strong> Shipping massive
            JavaScript bundles (3MB+) that take 10+ seconds to load and parse.
            Always measure and optimize bundle size. Target {"&lt;"}200KB for
            initial JS payload.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>No SEO Strategy:</strong> Building CSR apps without
            considering SEO needs. If organic traffic matters, use SSR, SSG, or
            prerendering. CSR alone is insufficient for content-driven sites.
          </HighlightBlock>
          <li>
            <strong>Poor Error Handling:</strong> Not handling network failures,
            showing generic errors, or letting the app crash. Implement proper
            error boundaries and retry logic.
          </li>
          <li>
            <strong>Memory Leaks:</strong> Forgetting to cleanup subscriptions,
            timers, or event listeners in useEffect/lifecycle hooks. Use cleanup
            functions religiously.
          </li>
          <li>
            <strong>Over-fetching Data:</strong> Fetching more data than needed,
            making unnecessary API calls, or not caching responses. Use GraphQL
            or optimize REST endpoints. Implement request deduplication.
          </li>
          <li>
            <strong>Blocking the Main Thread:</strong> Performing heavy
            computations on the main thread, causing UI jank. Use Web Workers
            for CPU-intensive tasks. Implement throttling/debouncing.
          </li>
          <li>
            <strong>No Loading States:</strong> Showing nothing while data
            loads, creating jarring UX. Always provide feedback during async
            operations.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Not Measuring Real Users:</strong> Optimizing only via lab
            metrics (Lighthouse) and missing the real bottlenecks in production.
            For CSR-heavy apps, you typically need{" "}
            <Highlight tier="important">RUM</Highlight>, long-task tracking, and
            client error rates to catch regressions tied to devices, geos, and
            third-party scripts.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>API Coupling Without Fallbacks:</strong> When the first
            route depends on multiple APIs, a single slow dependency can cause
            a first-load meltdown. Design with{" "}
            <Highlight tier="important">cached placeholders</Highlight>,{" "}
            <Highlight tier="important">timeouts</Highlight>, and partial
            rendering so the page remains usable under partial outage.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>CSR excels in these scenarios:</p>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="important">
            <strong>Dashboard Applications:</strong> Admin panels, analytics
            dashboards, and internal tools where SEO doesn't matter and users
            are authenticated. Examples: Vercel Dashboard, Netlify UI, Stripe
            Dashboard.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Web Applications:</strong> Rich interactive apps like Gmail,
            Figma, Notion, or Linear where the experience needs to feel native
            and responsive.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Real-time Collaboration Tools:</strong> Apps like Google
            Docs, Miro, or Slack that require instant updates and maintain
            WebSocket connections.
          </HighlightBlock>
          <li>
            <strong>Progressive Web Apps:</strong> Apps that work offline, sync
            in background, and feel native on mobile. CSR + Service Workers
            enable PWA capabilities.
          </li>
          <li>
            <strong>Internal Enterprise Applications:</strong> CRM systems,
            inventory management, or HR tools used by employees behind
            authentication where public SEO is irrelevant.
          </li>
          <li>
            <strong>Media Players:</strong> Spotify Web Player, YouTube Music,
            or Netflix (for authenticated views) where interactive playback
            controls are critical.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Heavily Personalized Experiences:</strong> Experiences where
            the UI is materially different per user and SSR caching is low value
            (feature flags, user-specific navigation, rich permissions). CSR can
            simplify personalization while you control performance with budgets
            and caching.
          </HighlightBlock>
        </ul>

        <HighlightBlock
          as="div"
          tier="crucial"
          className="mt-6 rounded-lg border border-theme bg-panel-soft p-6"
        >
          <h3 className="mb-3 font-semibold">When NOT to Use CSR</h3>
          <p>Avoid CSR for:</p>
          <ul className="mt-2 space-y-2">
            <li>• Content-heavy websites (blogs, news sites, documentation)</li>
            <li>• E-commerce product pages (poor SEO = lost revenue)</li>
            <li>• Marketing landing pages (slow load = high bounce rate)</li>
            <li>
              • Public-facing content requiring social sharing (no meta tags)
            </li>
          </ul>
        </HighlightBlock>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <HighlightBlock
            as="div"
            tier="important"
            className="rounded-lg border border-theme bg-panel-soft p-4"
          >
            <p className="font-semibold">Q: Why is CSR bad for SEO?</p>
            <p className="mt-2 text-sm">
              A: Search engine crawlers receive empty HTML. Content only appears
              after JavaScript executes and data loads. While Googlebot can
              render JS, it's slow and unreliable. Other crawlers (Bing, social
              media bots) often can't execute JS at all, seeing no content.
            </p>
          </HighlightBlock>

          <HighlightBlock
            as="div"
            tier="crucial"
            className="rounded-lg border border-theme bg-panel-soft p-4"
          >
            <p className="font-semibold">
              Q: How would you optimize CSR performance?
            </p>
            <p className="mt-2 text-sm">
              A: Code splitting by route, tree shaking unused code, lazy loading
              images/components, service worker caching, compression (Brotli),
              using CDN, prefetching likely routes, skeleton screens, and
              keeping initial bundle under 200KB.
            </p>
          </HighlightBlock>

          <HighlightBlock
            as="div"
            tier="important"
            className="rounded-lg border border-theme bg-panel-soft p-4"
          >
            <p className="font-semibold">Q: CSR vs SSR - when to use each?</p>
            <p className="mt-2 text-sm">
              A: Use CSR for authenticated apps where SEO doesn't matter and
              interactivity is critical (dashboards, tools). Use SSR for public
              content, e-commerce, or marketing sites where SEO and fast initial
              load matter. Or use hybrid (Next.js) to get benefits of both.
            </p>
          </HighlightBlock>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <a
              href="https://web.dev/rendering-on-the-web/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Rendering on the Web - web.dev
            </a>
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <a
              href="https://react.dev/learn/start-a-new-react-project"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Documentation - Start a New React Project
            </a>
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <a
              href="https://vuejs.org/guide/scaling-up/ssr.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vue.js Guide - Server-Side Rendering vs Client-Side
            </a>
          </HighlightBlock>
          <li>
            <a
              href="https://developer.chrome.com/docs/lighthouse/performance/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome DevTools - Performance Auditing
            </a>
          </li>
          <li>
            <a
              href="https://patterns.dev/posts/client-side-rendering"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              patterns.dev - Client-Side Rendering Pattern
            </a>
          </li>
        </ul>
      </section>
    </>
  );
}

export default function ClientSideRenderingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <ClientSideRenderingArticleContent />
    </ArticleLayout>
  );
}
