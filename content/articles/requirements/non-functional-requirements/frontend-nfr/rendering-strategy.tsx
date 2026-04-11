"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-rendering-strategy",
  title: "Rendering Strategy",
  description:
    "Comprehensive guide to frontend rendering strategies: CSR, SSR, SSG, ISR, and hybrid approaches. Learn to choose the right strategy for your use case.",
  category: "frontend",
  subcategory: "nfr",
  slug: "rendering-strategy",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-11",
  tags: [
    "frontend",
    "nfr",
    "rendering",
    "csr",
    "ssr",
    "ssg",
    "isr",
    "performance",
  ],
  relatedTopics: ["page-load-performance", "perceived-performance", "seo"],
};

export default function RenderingStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Rendering Strategy</strong> determines where and when an
          application&apos;s HTML is generated — on the server, in the browser,
          at build time, or at request time. This fundamental architectural
          decision impacts performance (how quickly users see content), SEO
          (whether search engines can index the content), user experience
          (interactivity timing), development complexity (server infrastructure,
          debugging), and infrastructure costs (server compute, CDN usage). For
          staff and principal engineers, rendering strategy decisions have
          long-term implications — choosing incorrectly leads to poor SEO, slow
          performance, high infrastructure costs, or development bottlenecks
          that are expensive to correct.
        </p>
        <p>
          The evolution of rendering strategies reflects the web&apos;s changing
          demands. Early websites were server-rendered (PHP, ASP, JSP) — the
          server generated complete HTML for every request. The rise of Single
          Page Applications around 2010 shifted toward Client-Side Rendering
          (CSR) with frameworks like AngularJS, React, and Vue, moving rendering
          to the browser for rich interactivity. However, CSR&apos;s SEO
          limitations and slow initial load led to a resurgence of server
          rendering with modern frameworks like Next.js, Nuxt, and SvelteKit
          offering hybrid approaches that combine the best of server and client
          rendering.
        </p>
        <p>
          Today&apos;s frontend engineers must understand multiple rendering
          strategies and choose based on content type (static, dynamic, or
          user-specific), SEO requirements (does content need to be indexed by
          search engines), performance goals (target metrics for LCP, TTI, and
          Core Web Vitals), infrastructure (available server resources, CDN
          usage, edge computing), and development experience (team familiarity,
          debugging complexity). The modern approach is hybrid rendering —
          different pages within the same application use different rendering
          strategies based on their individual requirements.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Client-Side Rendering sends a minimal HTML shell to the browser, and
          JavaScript builds the entire UI dynamically. The browser downloads the
          HTML shell, then downloads and executes the JavaScript bundle, which
          fetches data from APIs and renders the UI. Subsequent navigation
          happens entirely client-side — the JavaScript router intercepts link
          clicks, fetches new data, and updates the DOM without a full page
          reload. CSR provides rich interactivity with instant navigation after
          the initial load and simple static hosting (no server needed). The
          trade-off is slow initial load (must download JavaScript before seeing
          content), poor SEO (search engines may not execute JavaScript), and a
          blank screen during JavaScript download and execution.
        </p>
        <p>
          Server-Side Rendering generates HTML on the server for each request.
          The browser receives fully-rendered HTML and can display content
          immediately, achieving fast First Contentful Paint. JavaScript then
          downloads and &quot;hydrates&quot; the page — attaching event
          listeners to the static HTML to make it interactive. SSR provides
          excellent SEO (full HTML available to crawlers), social sharing (meta
          tags work correctly), and progressive enhancement (works even if
          JavaScript fails). The trade-off is increased server load (must render
          on every request), higher TTFB (server processing adds latency), and
          complex infrastructure (need server capacity for traffic spikes).
        </p>
        <p>
          Static Site Generation pre-renders HTML at build time and caches it
          on a CDN. No server processing occurs at request time — the CDN serves
          the pre-built HTML directly. SSG provides the fastest possible FCP
          (pre-built HTML served from the edge), excellent SEO, simple hosting
          (static files on CDN), low cost (no server processing per request),
          and infinite scalability (CDN handles any traffic volume). The
          trade-off is stale content (must rebuild to update), build time that
          scales with the number of pages, inability to personalize per user,
          and deploy complexity for content changes.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/rendering-strategy-spectrum.svg"
          alt="Rendering Strategy Spectrum"
          caption="Rendering strategies on a spectrum from static to dynamic, and server to client — showing where CSR, SSR, SSG, and ISR fit"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Incremental Static Regeneration combines SSG&apos;s performance with
          dynamic updates. Pages are pre-generated at build time and served from
          the CDN. After a revalidation period expires (e.g., 60 seconds), the
          next request triggers background regeneration — the old page continues
          serving while a new version is generated. When regeneration completes,
          the new page replaces the old one in the CDN cache for future
          requests. ISR provides fresh content without full rebuilds, maintains
          SSG-level performance for cached pages, and scales efficiently because
          only popular pages regenerate (unpopular pages are regenerated only
          when requested). The trade-off is a brief stale window (users may see
          old content for one request cycle), slower first request for
          ungenerated pages (initial generation happens on demand), and the
          complexity of managing revalidation periods across different content
          types.
        </p>
        <p>
          Hybrid rendering combines multiple strategies within a single
          application. Different pages use different rendering based on their
          requirements: SSG for marketing pages and blog posts (static content,
          SEO critical), SSR for product pages and search results (dynamic
          content, SEO critical), ISR for product listing pages (frequently
          changing but not real-time), and CSR for dashboard and settings pages
          (user-specific, SEO not needed). Modern frameworks make hybrid
          rendering straightforward — Next.js uses <code>getStaticProps</code>{" "}
          for SSG, <code>getServerSideProps</code> for SSR, and{" "}
          <code>revalidate</code> for ISR, configured per-page.
        </p>
        <p>
          The decision framework for selecting rendering strategy follows a
          logical flow. First, determine whether content is user-specific — if
          yes, use CSR or SSR. If no, check whether SEO is needed — if no, CSR
          is fine (dashboards, admin panels). If SEO is needed, check how often
          content changes — never or rarely means SSG, periodically means ISR,
          and every request means SSR. Finally, consider infrastructure — CDN
          only limits you to SSG or ISR, while server availability enables SSR
          or hybrid. This framework ensures each page uses the most appropriate
          rendering strategy for its specific requirements.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/rendering-strategy-decision-tree.svg"
          alt="Rendering Strategy Decision Tree"
          caption="Decision tree for choosing rendering strategy — is content user-specific, does it need SEO, how often does it change, and what infrastructure is available"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Performance comparison across rendering strategies reveals clear
          patterns. SSG provides the fastest FCP (pre-built HTML from CDN) and
          fast TTI (minimal hydration). SSR provides fast FCP but medium TTI
          (hydration adds time after the HTML arrives). ISR matches SSG
          performance for cached pages. CSR has the slowest FCP and TTI (must
          download and execute all JavaScript before displaying content). For
          SEO, SSR, SSG, and ISR all provide excellent HTML for crawlers, while
          CSR provides poor SEO because the initial HTML is empty. For server
          load, CSR and SSG require no server processing per request, ISR
          requires occasional regeneration, and SSR requires processing on every
          request.
        </p>
        <p>
          The hydration process in SSR and SSG is a critical performance
          consideration. Hydration is when JavaScript attaches event listeners
          to server-rendered HTML, making it interactive. Until hydration
          completes, the page is visible but not interactive — users can see
          content but cannot click buttons, fill forms, or navigate. The time
          between FCP and TTI is the hydration gap, and minimizing it is key to
          good SSR/SSG performance. Strategies include partial hydration
          (hydrating only interactive components), progressive hydration
          (hydrating components as they enter the viewport), and islands
          architecture (hydrating independent &quot;islands&quot; of
          interactivity within a static page).
        </p>
        <p>
          Core Web Vitals implications vary by rendering strategy. SSG and ISR
          have the best LCP because pre-built HTML arrives from the CDN
          immediately. SSR has good LCP but TTFB can suffer if server processing
          is slow. CSR has the worst LCP because it must wait for JavaScript
          download and execution. For INP, CSR can be best after initial load
          because there are no server round-trips for navigation — all
          interactions are handled locally. For CLS, SSR and SSG have an
          advantage because the HTML structure is known upfront, allowing proper
          layout reservation, while CSR may experience layout shift as
          JavaScript renders content dynamically.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/rendering-strategy-comparison.svg"
          alt="Rendering Strategy Comparison"
          caption="Side-by-side comparison of CSR, SSR, SSG, and ISR across FCP, TTI, SEO, server load, scalability, and best use case dimensions"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Adopt hybrid rendering as the default architecture for most
          applications. Use SSG for static content (marketing pages, blog posts,
          documentation), ISR for periodically updated content (product
          listings, news articles), SSR for dynamic content that needs SEO
          (search results, personalized product pages), and CSR for
          authenticated areas (dashboards, settings, admin panels). Configure
          rendering per-page using your framework&apos;s built-in mechanisms —
          this provides the right rendering strategy for each page&apos;s
          specific requirements without over-engineering the entire application.
        </p>
        <p>
          Optimize hydration to minimize the gap between FCP and TTI. Use
          React 18&apos; selective hydration to prioritize interactive
          components. Split JavaScript into route-level chunks so that only the
          JavaScript for the current page is hydrated. Defer hydration of
          below-the-fold components using Intersection Observer. For
          content-heavy pages where interactivity is not immediately needed
          (blog posts, articles), consider partial hydration — hydrate only the
          components that need interactivity (comments, share buttons) while
          leaving the article text as static HTML.
        </p>
        <p>
          Monitor rendering strategy impact on Core Web Vitals continuously.
          Track LCP, TTI, and CLS separately for pages using different rendering
          strategies to identify which strategy performs best for your specific
          content and infrastructure. Use RUM data (not just lab data) to
          understand real-user experience across devices and networks. Set
          performance budgets per rendering strategy — SSR pages must have TTFB
          under 600ms, CSR pages must have initial bundle under 200KB gzipped,
          SSG pages must have LCP under 1.5s. Alert when pages exceed their
          budget.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Using CSR for public-facing content is the most common rendering
          mistake. Marketing pages, blog posts, product pages, and any content
          that benefits from search engine indexing should never be CSR-only
          because search engines may not execute JavaScript and social media
          previews will be broken (empty HTML means no title, description, or
          image in the preview). The fix is to use SSR, SSG, or ISR for public
          content and reserve CSR for authenticated areas where SEO does not
          matter. If migrating an existing CSR application, incrementally adopt
          server rendering for critical pages first (homepage, landing pages,
          product pages).
        </p>
        <p>
          Over-using SSR when SSG or ISR would suffice creates unnecessary
          server load and higher TTFB. If a page&apos;s content does not change
          per request (product detail pages that update daily, blog posts that
          are published and then static), there is no reason to render on every
          request — pre-render at build time (SSG) or regenerate periodically
          (ISR). The server resources spent on redundant rendering can be
          redirected to pages that truly need dynamic rendering (search results,
          personalized content).
        </p>
        <p>
          Neglecting the hydration experience creates a frustrating gap between
          seeing content and being able to interact with it. A page that
          displays content in 500ms but takes 5 seconds to hydrate feels broken
          — users click buttons that do not respond, forms that do not accept
          input, and links that do not navigate. The fix is to monitor hydration
          time separately from FCP, optimize JavaScript bundle size (code
          splitting, tree-shaking), use partial or progressive hydration for
          content-heavy pages, and provide loading indicators for interactive
          elements that are not yet hydrated.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          E-commerce platforms use hybrid rendering to balance SEO, performance,
          and dynamic content needs. Product detail pages use ISR — statically
          generated with periodic revalidation for price and inventory updates,
          providing CDN-fast performance with reasonably fresh data. Product
          listing pages use ISR with shorter revalidation periods (30-60
          seconds) for frequently changing catalog data. Marketing and
          informational pages use SSG for maximum speed. Cart and checkout use
          CSR because they are user-specific, authenticated, and SEO is not
          needed. Search results use SSR because they are dynamic and benefit
          from SEO indexing. This hybrid approach optimizes each page type for
          its specific requirements.
        </p>
        <p>
          News and media websites prioritize content delivery speed and SEO. The
          Washington Post and The New York Times use SSG for article pages —
          articles are pre-rendered at publish time and served from CDN,
          providing instant load for readers and full HTML for search engine
          crawlers. Homepage and section pages use ISR with short revalidation
          periods (1-5 minutes) to surface new articles without full rebuilds.
          Interactive features (polls, quizzes, comment sections) use CSR for
          rich client-side interactivity. The result is article pages that load
          in under 1 second with excellent SEO and social sharing.
        </p>
        <p>
          SaaS dashboards and admin panels use CSR because they are
          authenticated, user-specific applications where SEO does not matter.
          The initial load is a one-time cost (users typically keep dashboards
          open for hours), and subsequent navigation is instant because the
          JavaScript router handles it client-side without server round-trips.
          Frameworks like Next.js allow mixing CSR dashboard pages with SSR
          marketing pages in the same application, providing the right rendering
          strategy for each section.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When would you choose CSR over SSR?
            </p>
            <p className="mt-2 text-sm">
              A: Choose CSR for authenticated applications where SEO does not
              matter — dashboards, admin panels, internal tools, real-time
              collaborative apps. CSR is simpler to host (static CDN), has clear
              frontend/backend separation, and provides fast subsequent
              navigation after the initial load. Avoid CSR for public content
              that needs SEO or social sharing. If a page benefits from search
              engine indexing, use SSR, SSG, or ISR.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between SSG and ISR?
            </p>
            <p className="mt-2 text-sm">
              A: SSG generates all pages at build time — content is static until
              the next deploy. ISR also generates at build time but can
              regenerate individual pages in the background after a revalidation
              period, without a full rebuild. ISR gives you SSG performance with
              dynamic updates, ideal for large sites where full rebuilds are
              impractical (thousands of product pages, news articles). The
              trade-off is a brief stale window where users may see old content
              for one request cycle.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does hydration work in SSR?</p>
            <p className="mt-2 text-sm">
              A: Hydration is when JavaScript attaches event listeners to
              server-rendered HTML to make it interactive. The server sends
              complete HTML for fast FCP. The browser displays it immediately.
              Then JavaScript downloads and hydrates the static HTML. Until
              hydration completes, the page is visible but not interactive —
              users can see content but cannot click buttons or fill forms.
              Minimize the hydration gap by splitting JavaScript into chunks,
              using selective hydration (React 18), and deferring below-the-fold
              component hydration.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What rendering strategy for an e-commerce site?
            </p>
            <p className="mt-2 text-sm">
              A: Hybrid approach. Product pages: ISR for fresh prices with CDN
              performance. Marketing pages: SSG for static, fast delivery. Cart
              and checkout: CSR for user-specific, authenticated areas. Search
              results: SSR or ISR depending on personalization needs. This
              balances SEO (SSG/ISR/SSR for public pages), performance (SSG/ISR
              from CDN), and dynamic requirements (CSR for authenticated areas,
              SSR for real-time search).
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the Core Web Vitals implications of each strategy?
            </p>
            <p className="mt-2 text-sm">
              A: SSG/ISR have best LCP (pre-built HTML from CDN). SSR has good
              LCP but TTFB can suffer from slow server processing. CSR has worst
              LCP (must wait for JS). For INP, CSR can be best after initial
              load (no server round-trips). For CLS, SSR/SSG have advantage
              (HTML structure known upfront for layout reservation). Optimize
              each strategy&apos;s weaknesses — reduce TTFB for SSR, minimize
              JS bundle for CSR, and ensure proper layout reservation for all.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://web.dev/articles/rendering-on-the-web"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — Rendering on the Web
            </a>
          </li>
          <li>
            <a
              href="https://nextjs.org/docs/app/building-your-application/rendering"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js Documentation — Rendering Strategies
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/2021/06/ssg-ssr-hybrid-rendering/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Smashing Magazine — SSG, SSR, and Hybrid Rendering
            </a>
          </li>
          <li>
            <a
              href="https://patterns.dev/posts/rendering-patterns/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              patterns.dev — Rendering Patterns
            </a>
          </li>
          <li>
            <a
              href="https://www.gatsbyjs.com/docs/conceptual/rendering-options/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gatsby — Rendering Options Explained
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
