"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-incrementa-extensive",
  title: "Incremental Static Regeneration (ISR)",
  description:
    "Comprehensive guide to Incremental Static Regeneration (ISR) covering stale-while-revalidate patterns, on-demand revalidation, and hybrid rendering approaches.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "incremental-static-regeneration",
  wordCount: 3450,
  readingTime: 14,
  lastUpdated: "2026-03-05",
  tags: ["frontend", "rendering", "ISR", "Next.js", "performance", "caching"],
  relatedTopics: [
    "static-site-generation",
    "server-side-rendering",
    "edge-rendering",
  ],
};

export default function IncrementalStaticRegenerationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Incremental Static Regeneration (ISR)</strong> is a hybrid
          rendering pattern that combines the performance benefits of Static
          Site Generation (SSG) with the flexibility of Server-Side Rendering
          (SSR). ISR allows you to create or update static pages <em>after</em>{" "}
          build time, on-demand or periodically, without requiring a full site
          rebuild. Pages are generated statically once, served instantly from
          cache, and regenerated in the background when stale or triggered
          explicitly.
        </HighlightBlock>
        <p>
          ISR emerged in 2020 with Next.js 9.5 as a solution to SSG&apos;s
          fundamental limitation: the need to rebuild the entire site for
          content updates. Traditional SSG forces a choice between stale content
          or frequent expensive rebuilds. ISR introduces a middle ground: serve
          static pages instantly (SSG benefits) while automatically updating
          them in the background as content changes (SSR-like freshness).
        </p>
        <p>
          The pattern implements a <strong>stale-while-revalidate</strong>{" "}
          strategy: when a page becomes stale (exceeds revalidation time), the
          next visitor receives the cached (stale) version immediately while the
          server regenerates an updated version in the background for subsequent
          visitors. This ensures zero-downtime updates and sub-100ms response
          times while keeping content reasonably fresh. ISR has become the
          default rendering strategy for content-driven applications that need
          both performance and up-to-date content.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>Understanding ISR requires grasping several fundamental concepts:</p>
        <ul>
          <li>
            <strong>Time-Based Revalidation:</strong> Pages are marked with a
            revalidation period (e.g., 60 seconds). After this time expires, the
            next request triggers background regeneration. The stale page is
            served immediately, then replaced with fresh content for future
            requests.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Stale-While-Revalidate Pattern:</strong> Inspired by HTTP
            caching, this strategy serves stale content instantly (avoiding TTFB
            delays) while asynchronously fetching fresh data and regenerating
            the page. Users never wait for regeneration—they always get instant
            responses.
          </HighlightBlock>
          <li>
            <strong>On-Demand Revalidation:</strong> Instead of waiting for
            time-based revalidation, you can explicitly trigger page
            regeneration via API calls (webhooks from CMS, admin actions). This
            provides near-instant content updates without polling or short
            revalidation periods.
          </li>
          <li>
            <strong>Background Regeneration:</strong> When revalidation
            triggers, page regeneration happens asynchronously in a separate
            process. The current cached page continues serving traffic with no
            downtime or performance impact during regeneration.
          </li>
          <li>
            <strong>Fallback Modes:</strong> For pages not pre-rendered at build
            time, ISR supports fallback behaviors: show loading state while
            generating (fallback: true), generate on first request with blocking
            (fallback: &apos;blocking&apos;), or return 404 (fallback: false).
          </li>
          <li>
            <strong>Cache Invalidation:</strong> ISR manages a persistent cache
            of generated pages. Cache entries are updated on revalidation,
            purged on-demand, or expire based on configuration. Platforms like
            Vercel and Netlify provide globally distributed cache
            infrastructure.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The ISR architecture follows these patterns for initial load and
          updates:
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            ISR Request Flow (Fresh Cache)
          </h3>
          <ol className="space-y-2 text-sm">
            <li>
              <strong>1. User Request:</strong> Browser requests /products/123
            </li>
            <li>
              <strong>2. CDN Cache Hit:</strong> Pre-generated HTML served from
              edge (10-50ms TTFB)
            </li>
            <li>
              <strong>3. Browser Display:</strong> Content appears instantly
              (FCP ~100-300ms)
            </li>
            <li>
              <strong>4. Client Hydration:</strong> JavaScript hydrates page for
              interactivity
            </li>
            <li>
              <strong>5. Check Revalidation Time:</strong> Server checks if
              revalidation period expired
            </li>
            <li>
              <strong>6. If Fresh:</strong> Done—page served from cache, no
              regeneration
            </li>
          </ol>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            ISR Request Flow (Stale Cache)
          </h3>
          <ol className="space-y-2 text-sm">
            <li>
              <strong>1. User Request:</strong> Browser requests /products/123
              (cache expired)
            </li>
            <li>
              <strong>2. Serve Stale Content:</strong> Cached HTML served
              immediately (10-50ms TTFB)
            </li>
            <li>
              <strong>3. Trigger Background Regeneration:</strong> Server queues
              async regeneration task
            </li>
            <li>
              <strong>4. User Sees Stale Content:</strong> Browser displays page
              instantly (user unaware)
            </li>
            <li>
              <strong>5. Background Process:</strong> Server fetches fresh data,
              regenerates HTML
            </li>
            <li>
              <strong>6. Update Cache:</strong> New HTML replaces old cache
              entry
            </li>
            <li>
              <strong>7. Next Visitor:</strong> Gets updated content from cache
            </li>
          </ol>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            On-Demand Revalidation Flow
          </h3>
          <ol className="space-y-2 text-sm">
            <li>
              <strong>1. Content Update:</strong> Editor publishes new content
              in CMS
            </li>
            <li>
              <strong>2. Webhook Trigger:</strong> CMS sends webhook to
              /api/revalidate endpoint
            </li>
            <li>
              <strong>3. Verify Request:</strong> Server validates webhook
              secret/token
            </li>
            <li>
              <strong>4. Queue Regeneration:</strong> Server marks pages for
              immediate regeneration
            </li>
            <li>
              <strong>5. Regenerate Pages:</strong> Fetch new data, generate
              fresh HTML
            </li>
            <li>
              <strong>6. Purge Cache:</strong> Invalidate old cache entries
              across edge network
            </li>
            <li>
              <strong>7. Update Complete:</strong> New content available in 2-10
              seconds
            </li>
          </ol>
        </div>

        <HighlightBlock
          className="mt-6 rounded-lg border border-theme bg-panel-soft p-4"
          tier="crucial"
        >
          <h3 className="mb-2 font-semibold">Performance Characteristics</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>TTFB (Time to First Byte):</strong> 10-50ms (SSG-level,
              served from CDN)
            </li>
            <li>
              <strong>FCP (First Contentful Paint):</strong> 100-300ms (instant,
              content in HTML)
            </li>
            <li>
              <strong>Content Freshness:</strong> Configurable (seconds to hours
              based on revalidation)
            </li>
            <li>
              <strong>Update Latency:</strong> Time-based: 0-revalidation
              period; On-demand: 2-10 seconds
            </li>
            <li>
              <strong>Build Time:</strong> Reduced—only pre-render critical
              pages, generate rest on-demand
            </li>
            <li>
              <strong>Cache Hit Rate:</strong> Very high (95%+) since most
              requests serve cached pages
            </li>
          </ul>
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/isr-cache-state.svg"
          alt="ISR Cache State Machine"
          caption="ISR Cache State Machine: Pages transition between fresh, stale, and regenerating states with stale-while-revalidate pattern"
        />

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/isr-time-revalidation.svg"
          alt="ISR Time Based Revalidation Sequence"
          caption="ISR Time-Based Revalidation Sequence: Stale content served instantly while background regeneration ensures freshness"
        />

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/isr-on-demand-revalidation.svg"
          alt="ISR On Demand Revalidation Flow"
          caption="ISR On-Demand Revalidation: Webhooks trigger immediate cache invalidation and regeneration for near-instant updates"
        />

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/isr-comparison.svg"
          alt="ISR vs SSG vs SSR Comparison"
          caption="ISR vs SSG vs SSR: ISR combines SSG's CDN performance with near-SSR freshness, offering the best hybrid approach for semi-dynamic content"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
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
                • SSG-level TTFB (10-50ms) from CDN
                <br />
                • Instant FCP - content pre-rendered
                <br />
                • No waiting for regeneration
                <br />• Perfect Core Web Vitals
              </td>
              <td className="p-3">
                • Slight staleness (revalidation period)
                <br />
                • Background regeneration uses server resources
                <br />• Cache storage overhead
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Content Freshness</strong>
              </td>
              <td className="p-3">
                • Near real-time with on-demand revalidation
                <br />
                • Configurable staleness tolerance
                <br />
                • No full rebuilds needed
                <br />• Webhook-driven updates
              </td>
              <td className="p-3">
                • Not truly real-time (seconds delay)
                <br />
                • Time-based revalidation has lag window
                <br />• Requires webhook setup for instant updates
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Build Time</strong>
              </td>
              <td className="p-3">
                • Fast builds - pre-render only critical pages
                <br />
                • Generate remaining pages on-demand
                <br />
                • No need to rebuild for content changes
                <br />• Scales to millions of pages
              </td>
              <td className="p-3">
                • First visitor to new page waits for generation
                <br />
                • Fallback modes add complexity
                <br />• Cold start latency for unpopular pages
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Infrastructure</strong>
              </td>
              <td className="p-3">
                • Leverages CDN caching like SSG
                <br />
                • Lower server costs than pure SSR
                <br />
                • Automatic cache management
                <br />• Edge computing compatible
              </td>
              <td className="p-3">
                • Requires serverless or Node.js backend
                <br />
                • Cache invalidation complexity
                <br />
                • Not all hosts support ISR well
                <br />• Platform-specific implementations
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Developer Experience</strong>
              </td>
              <td className="p-3">
                • Simple API (just add revalidate)
                <br />
                • Preview mode for draft content
                <br />
                • Gradual adoption from SSG
                <br />• Best of SSG and SSR
              </td>
              <td className="p-3">
                • Cache debugging can be tricky
                <br />
                • Revalidation timing requires tuning
                <br />
                • Fallback behavior needs testing
                <br />• Platform lock-in (Next.js-specific)
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">ISR vs SSG vs SSR Comparison</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Metric</th>
                <th className="p-2 text-left">ISR</th>
                <th className="p-2 text-left">SSG</th>
                <th className="p-2 text-left">SSR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">TTFB</td>
                <td className="p-2">⚡️ 10-50ms</td>
                <td className="p-2">⚡️ 10-50ms</td>
                <td className="p-2">🐢 500ms-2s</td>
              </tr>
              <tr>
                <td className="p-2">Content Freshness</td>
                <td className="p-2">🚀 Seconds to minutes</td>
                <td className="p-2">🐢 Hours to days</td>
                <td className="p-2">⚡️ Real-time</td>
              </tr>
              <tr>
                <td className="p-2">Build Time</td>
                <td className="p-2">🚀 Fast (partial)</td>
                <td className="p-2">🐢 Slow (full rebuild)</td>
                <td className="p-2">⚡️ No builds</td>
              </tr>
              <tr>
                <td className="p-2">Scalability</td>
                <td className="p-2">⚡️ Infinite (CDN)</td>
                <td className="p-2">⚡️ Infinite (CDN)</td>
                <td className="p-2">🐢 Server limited</td>
              </tr>
              <tr>
                <td className="p-2">Update Latency</td>
                <td className="p-2">🚀 2-60 seconds</td>
                <td className="p-2">🐢 5-30 minutes</td>
                <td className="p-2">⚡️ Instant</td>
              </tr>
              <tr>
                <td className="p-2">Hosting Cost</td>
                <td className="p-2">🚀 $10-50/mo</td>
                <td className="p-2">⚡️ $0-10/mo</td>
                <td className="p-2">🐢 $50-500/mo</td>
              </tr>
              <tr>
                <td className="p-2">Use Case</td>
                <td className="p-2">Semi-dynamic content</td>
                <td className="p-2">Rarely changing content</td>
                <td className="p-2">Highly dynamic content</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>To build performant ISR applications, follow these practices:</p>
        <ol className="space-y-3">
          <li>
            <strong>Choose Appropriate Revalidation Times:</strong> Set
            revalidation based on content update frequency. Use 60s for
            frequently updated content (news), 3600s (1 hour) for semi-static
            content (product pages), 86400s (1 day) for rarely changing content
            (documentation). Don&apos;t use very short times (&lt;10s) as it
            wastes server resources.
          </li>
          <li>
            <strong>Implement On-Demand Revalidation:</strong> Set up webhooks
            from CMS for instant updates on content changes. Use secure tokens
            to prevent unauthorized revalidation. Revalidate related pages
            (e.g., list pages when item changes). This is more efficient than
            short time-based revalidation.
          </li>
          <li>
            <strong>Pre-render Critical Pages:</strong> Use getStaticPaths to
            pre-render popular pages (top 100-1000 products, recent articles).
            Let less popular pages generate on-demand. This optimizes build time
            while ensuring key pages are ready immediately.
          </li>
          <li>
            <strong>Handle Fallback States Properly:</strong> Use fallback:
            &apos;blocking&apos; for better UX (no loading state, but slower
            first load) or fallback: true for faster perceived performance (show
            loading state). Avoid fallback: false unless you&apos;re certain all
            paths are pre-rendered.
          </li>
          <li>
            <strong>Monitor Cache Performance:</strong> Track cache hit rates,
            revalidation frequency, and regeneration failures. Use analytics to
            identify pages that should be pre-rendered. Monitor TTFB to ensure
            cache is working effectively. Alert on failed revalidations.
          </li>
          <li>
            <strong>Implement Cache Tags:</strong> Use cache tags (App Router)
            to group related pages for bulk revalidation. For example, tag all
            product pages with &apos;products&apos; to invalidate all when
            pricing changes. This is more efficient than path-based
            revalidation.
          </li>
          <li>
            <strong>Combine with Client-Side Updates:</strong> Use ISR for
            stable content (product details) and client-side fetching for
            rapidly changing data (inventory, prices). This hybrid approach
            balances performance with freshness. Cache static data, fetch
            dynamic data.
          </li>
          <li>
            <strong>Handle Revalidation Errors:</strong> Implement graceful
            degradation when revalidation fails (API timeout, server error).
            Keep serving stale content instead of showing errors. Log failures
            for investigation. Consider fallback data or retry logic.
          </li>
          <li>
            <strong>Optimize Data Fetching:</strong> Keep revalidation fast
            (&lt;2s) to minimize background load. Fetch only necessary data
            during regeneration. Use efficient queries and indexes. Consider
            caching API responses or using a data layer.
          </li>
          <li>
            <strong>Test Revalidation Logic:</strong> Verify time-based
            revalidation triggers correctly. Test on-demand revalidation with
            webhooks. Ensure fallback modes work as expected. Test concurrent
            revalidation requests (should dedupe). Use staging environments.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>Avoid these common mistakes when building ISR applications:</p>
        <ul className="space-y-3">
          <li>
            <strong>Over-Revalidating:</strong> Setting revalidate to very short
            times (5-10 seconds) defeats ISR benefits. Every request triggers
            regeneration, wasting server resources. Use on-demand revalidation
            instead for frequently changing content. Reserve time-based
            revalidation for reasonable intervals (60s+).
          </li>
          <li>
            <strong>Forgetting Related Pages:</strong> Updating a product but
            not revalidating the product list page, category page, or search
            results. Always identify and revalidate dependent pages. Consider
            using cache tags to group related pages for bulk invalidation.
          </li>
          <li>
            <strong>Slow Revalidation Requests:</strong> If background
            regeneration takes 10+ seconds due to slow API calls, it creates
            server load and delays updates. Optimize data fetching, use caching
            layers, or consider SSR for truly dynamic content. Target &lt;2s
            regeneration time.
          </li>
          <li>
            <strong>Not Securing Revalidation Endpoints:</strong> Exposing
            /api/revalidate without authentication allows anyone to trigger
            costly regenerations. Always verify webhook secrets, use environment
            variables, and implement rate limiting. Consider IP allowlists for
            known webhook sources.
          </li>
          <li>
            <strong>Assuming Instant Updates:</strong> Even with on-demand
            revalidation, there&apos;s a 2-10 second delay for cache purge
            across CDN edge nodes. If you need truly instant updates (&lt;1s),
            use SSR or client-side fetching. Set realistic expectations with
            stakeholders.
          </li>
          <li>
            <strong>Ignoring Cache Invalidation Failures:</strong> Revalidation
            can fail due to API errors, timeouts, or server issues. Without
            monitoring, stale content persists indefinitely. Implement error
            logging, retries, and alerts. Consider showing content freshness
            timestamps to users.
          </li>
          <li>
            <strong>Not Testing Fallback Behavior:</strong> Unexpected 404s or
            infinite loading states when fallback isn&apos;t configured
            correctly. Test pages not pre-rendered at build time. Verify loading
            states and error handling. Use fallback: &apos;blocking&apos; for
            production unless you have good loading UI.
          </li>
          <li>
            <strong>Over-Relying on ISR for Dynamic Content:</strong> Using ISR
            for highly personalized content, user dashboards, or real-time data.
            ISR works best for content with shared state. Use SSR or CSR for
            user-specific data. Consider hybrid approaches.
          </li>
          <li>
            <strong>Cache Stampede:</strong> When a popular page expires,
            multiple concurrent requests can trigger duplicate regenerations,
            overwhelming the server. Next.js deduplicates regeneration requests,
            but ensure your data sources can handle load spikes. Use caching
            layers and rate limiting.
          </li>
          <li>
            <strong>Inconsistent State Across Pages:</strong> Regenerating pages
            independently can create temporary inconsistencies. A product page
            updates but category page shows old price. Use cache tags and atomic
            revalidation for related pages. Consider eventual consistency
            acceptable for your use case.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>ISR excels in these scenarios:</p>
        <ul className="space-y-3">
          <li>
            <strong>E-commerce Product Catalogs:</strong> Large online stores
            (Shopify, WooCommerce) use ISR for product pages. Static product
            details (description, images) served instantly, while inventory and
            pricing can revalidate every 60 seconds or on-demand via CMS
            webhooks. Build time stays reasonable even with 100,000+ products.
          </li>
          <li>
            <strong>News &amp; Media Sites:</strong> News sites use ISR with
            short revalidation (60-300 seconds) for article pages and on-demand
            revalidation for breaking news. Homepage and section pages
            revalidate frequently while article content stays cached longer.
            Examples: TechCrunch-style sites, content platforms.
          </li>
          <li>
            <strong>CMS-Driven Marketing Sites:</strong> Corporate websites,
            SaaS marketing sites with headless CMS (Contentful, Sanity, Strapi).
            Editors update content, webhook triggers revalidation, content
            appears live in seconds. Perfect for marketing teams who need fast
            iteration without developer involvement.
          </li>
          <li>
            <strong>Documentation Sites:</strong> Product docs and API
            references where content updates weekly but needs search,
            versioning, and quick updates. Use ISR with 1-hour revalidation and
            on-demand revalidation for urgent fixes. Examples: documentation
            platforms, developer portals.
          </li>
          <li>
            <strong>Real Estate Listings:</strong> Property listing sites where
            listings change daily but details are relatively stable. New
            listings generate on first view, existing listings revalidate
            hourly. Images and descriptions cached aggressively. Reduces build
            time from hours to minutes.
          </li>
          <li>
            <strong>Job Boards:</strong> Sites like Indeed or LinkedIn Jobs use
            ISR patterns for job listings. New postings generate on-demand,
            existing jobs revalidate when updated (via webhook from ATS). Search
            results and aggregated pages revalidate on schedule. Balances
            freshness with performance.
          </li>
          <li>
            <strong>Recipe &amp; Food Content:</strong> Recipe sites with large
            catalogs use ISR for individual recipes. User reviews and ratings
            trigger on-demand revalidation. SEO-critical pages (top recipes)
            pre-rendered at build time. Long-tail recipes generate lazily.
            Examples: food blogs, cooking platforms.
          </li>
          <li>
            <strong>Event &amp; Conference Sites:</strong> Event schedules,
            speaker bios, and venue info use ISR. Content updates frequently
            before event (revalidate every 5 minutes) but rarely during/after (1
            hour). Handles traffic spikes on event day without server load.
            Speaker pages regenerate when profiles update.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Use ISR</h3>
          <p>Avoid ISR for:</p>
          <ul className="mt-2 space-y-2">
            <li>
              • Truly real-time content (stock tickers, live sports scores) -
              use SSR or client-side
            </li>
            <li>
              • Highly personalized pages (user dashboards, recommendations) -
              no caching benefit
            </li>
            <li>
              • Content that changes more than once per second - revalidation
              can&apos;t keep up
            </li>
            <li>
              • Static content that never changes (legal pages, about pages) -
              use pure SSG
            </li>
            <li>
              • Admin interfaces or authenticated apps - no SEO benefit, caching
              problematic
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js Documentation - Incremental Static Regeneration
            </a>
          </li>
          <li>
            <a
              href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js App Router - Data Fetching, Caching, and Revalidating
            </a>
          </li>
          <li>
            <a
              href="https://vercel.com/docs/incremental-static-regeneration"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vercel - ISR Documentation
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/stale-while-revalidate/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev - Keeping things fresh with stale-while-revalidate
            </a>
          </li>
          <li>
            <a
              href="https://www.patterns.dev/posts/incremental-static-rendering"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              patterns.dev - Incremental Static Generation
            </a>
          </li>
          <li>
            <a
              href="https://nextjs.org/blog/next-9-5"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js 9.5 Blog Post - Introducing ISR
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm">
              Q: How does ISR handle high traffic during regeneration?
            </h3>
            <p className="mt-1 text-sm">
              A: Regeneration happens in background—cached page continues
              serving all traffic. Next.js deduplicates concurrent regeneration
              requests (cache stampede prevention). Only one regeneration runs
              per page even with 1000s of requests. Users never wait.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm">
              Q: What happens if revalidation fails (API error)?
            </h3>
            <p className="mt-1 text-sm">
              A: Stale content continues serving. Failed regeneration
              doesn&apos;t break the site. Implement error logging and
              monitoring. Consider retry logic or fallback data. Show content
              freshness timestamps to users if critical.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm">
              Q: ISR vs ISG vs SSG with cache - what&apos;s the difference?
            </h3>
            <p className="mt-1 text-sm">
              A: ISR = Incremental Static Regeneration (Next.js term). ISG =
              Incremental Static Generation (same concept, different name). SSG
              with cache = static files + CDN caching only (no background
              regeneration). ISR adds automatic background updates.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
