"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

const BASE_PATH = "/diagrams/system-design-concepts/backend/caching-performance";

export const metadata: ArticleMetadata = {
  id: "article-backend-page-caching",
  title: "Page Caching",
  description:
    "Comprehensive guide to full-page caching, fragment caching, edge-side includes, personalization challenges, cache invalidation on content changes, and CDN page caching patterns for production systems.",
  category: "backend",
  subcategory: "caching-performance",
  slug: "page-caching",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-03",
  tags: [
    "backend",
    "caching",
    "performance",
    "page-caching",
    "fragment-caching",
    "edge-caching",
    "cdn",
  ],
  relatedTopics: [
    "http-caching",
    "cdn-caching",
    "caching-strategies",
    "cache-invalidation",
  ],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Page caching</strong> is the practice of storing the complete
          rendered response of a web request -- typically an HTML page or a JSON
          payload that represents a full page -- so that subsequent requests for
          the same page can be served directly from cache without re-executing
          the rendering pipeline. Unlike memoization, which caches individual
          function results, or application-level caching, which caches specific
          data queries, page caching operates at the highest level of the
          response hierarchy: it caches the final output that would be sent to
          the client, bypassing every layer of computation, database query,
          template rendering, and serialization that would normally be required
          to produce that output.
        </p>
        <p>
          Page caching is most effective for content-heavy pages where the
          rendering cost is dominated by aggregating data from multiple sources
          (database queries, API calls, template rendering) and where the content
          changes infrequently relative to the request rate. A news article page,
          a product detail page, a blog post, or a documentation page are
          textbook candidates: they are expensive to render (multiple database
          joins, rich text parsing, related content lookups, sidebar widget
          aggregation) but change rarely once published, meaning the same cached
          page can serve thousands or millions of requests without staleness
          concerns. The performance benefit is dramatic: serving a cached HTML
          page takes sub-millisecond time from the cache layer, compared to
          tens or hundreds of milliseconds for the full rendering pipeline.
        </p>
        <p>
          The fundamental challenge of page caching is <strong>personalization</strong>.
          Modern web applications rarely serve identical pages to all users.
          Pages include user-specific navigation (greeting the user by name,
          showing their cart contents, highlighting their subscription tier),
          region-specific content (localized currency, language, availability),
          experiment-specific variations (A/B test buckets, feature flag
          rollouts), and permission-dependent information (admin panels,
          draft content, private sections). Each dimension of personalization
          fragments the cache: instead of one cached page, the system must
          maintain a separate cached version for every unique combination of
          personalization dimensions. If a page varies by user authentication
          state (logged-in vs. anonymous), locale (ten languages), device class
          (desktop vs. mobile), and A/B test variant (four buckets), the cache
          must store 2 x 10 x 2 x 4 = 160 distinct versions of every page. This
          combinatorial explosion is the primary reason page caching becomes
          operationally complex at scale.
        </p>
        <p>
          For staff and principal engineers, page caching is a systems design
          problem that spans multiple architectural layers. Decisions about cache
          placement (CDN edge, reverse proxy, application server), cache key
          design (which dimensions to include, which to exclude), invalidation
          strategy (TTL-based, tag-based, event-driven), and personalization
          handling (full-page vs. fragment caching, edge-side includes, client-side
          composition) have profound implications for latency, cache hit ratio,
          origin load, and operational complexity. This article examines each
          dimension in depth, with production patterns drawn from large-scale
          content delivery systems.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <p>
          <strong>Full-page caching</strong> is the simplest form of page caching:
          the entire rendered response is stored in a cache and served to all
          requests that match the cache key. The cache key is typically derived
          from the request URL, normalized to remove tracking parameters, session
          identifiers, and other query strings that do not affect the page content.
          Full-page caching delivers the highest performance benefit because it
          bypasses the entire rendering pipeline, but it is only applicable to
          pages that are identical for all users -- static content pages,
          marketing landing pages, published articles, and public documentation.
          Any dimension of personalization invalidates full-page caching for that
          page unless the system is willing to cache a separate version for every
          personalization combination, which is rarely practical.
        </p>

        <p>
          <strong>Fragment caching</strong> addresses the personalization problem
          by caching individual sections of a page independently. The page is
          decomposed into fragments -- the header, the main content area, the
          sidebar, the footer, the personalized recommendation widget -- and each
          fragment is cached with its own key and TTL. When a request arrives,
          the system assembles the page by fetching each fragment from cache (or
          rendering it if it is not cached) and composing the fragments into the
          final HTML. Fragment caching allows the system to cache the stable
          portions of a page (the article body, the navigation structure, the
          footer) while rendering the dynamic portions (the user greeting, the
          cart summary, the personalized recommendations) on every request. The
          trade-off is increased assembly complexity and the risk that the
          composition overhead negates the caching benefit if too many fragments
          must be rendered per request.
        </p>

        <p>
          <strong>Edge-side includes (ESI)</strong> is a specification, originally
          developed by Akamai and later adopted by other CDN and reverse proxy
          vendors, that enables fragment caching at the edge. ESI allows a page
          to contain special tags that reference cached fragments. When the CDN
          edge node receives a request, it fetches the main page, parses the ESI
          tags, fetches each referenced fragment from cache (or from the origin
          if not cached), and assembles the final response at the edge before
          sending it to the client. ESI moves the fragment composition from the
          origin server to the CDN edge, reducing origin load and leveraging the
          CDN&apos;s global distribution for both the main page and the fragments.
          The ESI specification supports conditional includes (include a fragment
          only if a cookie or header matches a value), error handling (serve a
          fallback if a fragment fetch fails), and TTL control per fragment.
        </p>

        <p>
          <strong>Cache invalidation</strong> is the mechanism by which cached
          pages are removed or updated when the underlying content changes. It is
          widely regarded as one of the hardest problems in computer science, and
          page caching amplifies the difficulty because a single content change
          (updating an article&apos;s headline) may require invalidating multiple
          cached pages (the article page itself, the category listing page, the
          homepage&apos;s featured articles section, the RSS feed, the sitemap).
          Three invalidation strategies dominate production systems. TTL-based
          invalidation assigns a time-to-live to each cached page; when the TTL
          expires, the page is treated as absent and re-rendered on the next
          request. This strategy is simple to implement and guarantees that stale
          content will not persist indefinitely, but it means that content changes
          are not visible until the TTL expires. Tag-based invalidation associates
          each cached page with one or more tags (e.g., &quot;article-123&quot;,
          &quot;category-tech&quot;, &quot;homepage&quot;); when content changes,
          the system purges all pages with the relevant tag, providing immediate
          visibility of the change without flushing the entire cache. Event-driven
          invalidation triggers cache purges in response to specific events (a
          content management system publishes an update, a product&apos;s price
          changes, a feature flag is toggled), providing the most precise
          invalidation but requiring tight integration between the content
          management system and the caching infrastructure.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/page-caching-fragmentation.svg`}
          alt="Cache fragmentation diagram showing how personalization dimensions multiply cached page versions"
          caption="Cache fragmentation -- each personalization dimension (auth state, locale, device, A/B variant) multiplies the number of cached page versions, creating combinatorial explosion"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>

        <p>
          A production page caching architecture is a multi-layer system where
          caching occurs at the CDN edge, the reverse proxy, and the application
          server, each layer serving a different purpose and operating with
          different constraints. Understanding how these layers interact, how
          cache keys flow through them, and how invalidation propagates across
          them is essential for designing a system that delivers low latency,
          high cache hit ratios, and correct content delivery.
        </p>

        <p>
          The <strong>CDN edge layer</strong> is the outermost cache layer and
          the first point of contact for client requests. CDNs like Cloudflare,
          Fastly, AWS CloudFront, and Akamai operate thousands of edge nodes
          distributed globally, each maintaining a local cache of pages. When a
          request arrives at an edge node, the node checks its local cache for a
          matching entry. If found (a cache hit), the node serves the cached
          response immediately, often in single-digit milliseconds, without
          contacting the origin server. If not found (a cache miss), the node
          forwards the request to the origin, caches the response, and serves it
          to the client. The CDN layer is the most impactful for global
          applications because it serves users from geographically proximate edge
          nodes, minimizing network latency. CDN caches are typically configured
          with HTTP cache headers (Cache-Control, Vary, ETag) that the origin
          server sets to communicate caching instructions to the CDN.
        </p>

        <p>
          The <strong>reverse proxy layer</strong> (NGINX, Varnish, Envoy, HAProxy)
          sits between the CDN and the application server and provides a second
          cache layer that can serve requests that miss the CDN cache. The reverse
          proxy cache is particularly valuable for two scenarios: first, when CDN
          cache misses occur (either because the page was not cached at the edge
          or because the edge node&apos;s cache was evicted), the reverse proxy
          can serve the page without hitting the application server; second, when
          the CDN is bypassed (internal traffic, API requests, health checks), the
          reverse proxy provides caching at the infrastructure level. Reverse proxy
          caches are configured with rules that map URL patterns, headers, and
          cookies to caching behavior, and they support advanced features like
          conditional caching, stale-while-revalidate, and grace period serving
          (serving stale content while fetching fresh content in the background).
        </p>

        <p>
          The <strong>application server layer</strong> implements the finest-grained
          caching control because it has full knowledge of the page&apos;s content,
          the user&apos;s context, and the personalization requirements.
          Application-level page caching can be implemented as middleware that
          intercepts the request before the rendering pipeline, checks the cache
          for a matching entry, and returns the cached response if found. This
          layer is where fragment caching and ESI composition occur: the
          application determines which fragments are cacheable, fetches them from
          cache, renders the non-cacheable fragments, and assembles the final
          response. The application server also sets the HTTP cache headers that
          instruct the CDN and reverse proxy how to cache the response, making it
          the source of truth for caching policy.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/page-caching-multi-layer.svg`}
          alt="Multi-layer page caching architecture showing CDN edge, reverse proxy, and application server with cache flow"
          caption="Multi-layer page caching -- CDN edge (global distribution, lowest latency), reverse proxy (origin shield, second-layer cache), application server (fragment composition, finest-grained control)"
        />

        <p>
          <strong>Cache key construction</strong> at each layer must account for
          all dimensions that affect the page content. The base key is the
          normalized URL (scheme, host, path, and relevant query parameters with
          tracking parameters removed). Beyond the URL, the cache key must include
          the Accept-Language header (or its equivalent locale identifier) to
          serve localized content, the device class (derived from the User-Agent
          header or a cookie) to serve mobile-optimized pages, the authentication
          state (logged-in vs. anonymous, or a more granular permission tier) to
          serve permission-dependent content, and the A/B test variant assignment
          (stored in a cookie or header) to serve experiment-specific page
          variations. The Vary HTTP header communicates these key dimensions to
          the CDN and reverse proxy, instructing them to maintain separate cache
          entries for each combination of varying factors. Overly granular cache
          keys (including every cookie, every query parameter, every header)
          fragment the cache and reduce hit ratios to near zero. Underly granular
          keys (omitting a dimension that affects content) cause incorrect pages
          to be served, potentially leaking personalized content to the wrong
          user. The design challenge is to include exactly the dimensions that
          affect content and no others.
        </p>

        <p>
          <strong>Invalidation flow</strong> in a multi-layer caching architecture
          requires coordination across all layers. When content changes, the
          invalidation signal must reach the CDN edge nodes (to purge the cached
          pages at the edge), the reverse proxy (to purge its local cache), and
          the application server (to clear any in-memory page cache). Tag-based
          invalidation is the most practical approach at scale: the content
          management system publishes an event with the tags affected by the
          change (e.g., &quot;article-456&quot;, &quot;author-john-doe&quot;),
          and each cache layer independently purges entries matching those tags.
          CDNs like Fastly and Cloudflare provide tag-based purge APIs that
          accept a tag pattern and asynchronously purge matching entries across
          all edge nodes. The purge is not instantaneous across all nodes -- CDN
          purge propagation can take seconds to minutes depending on the number
          of edge nodes and the volume of cached entries -- so the system must
          tolerate a brief window of stale content during purge propagation.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/page-caching-invalidation-flow.svg`}
          alt="Cache invalidation flow showing content change event propagating through tag-based purge to CDN, reverse proxy, and application cache layers"
          caption="Invalidation flow -- content management system publishes change event, tag-based purge propagates through CDN, reverse proxy, and application cache layers with staggered timing"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>

        <p>
          Page caching strategies exist on a spectrum from maximum caching with
          no personalization to maximum personalization with minimal caching. The
          choice of strategy depends on the proportion of the page that is
          identical for all users, the cost of rendering the personalized
          portions, the acceptable staleness window for the static portions, and
          the operational complexity the team is willing to manage. Understanding
          the trade-offs between full-page caching, fragment caching, ESI
          composition, and client-side assembly is essential for selecting the
          right approach for a given application.
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Strategy</th>
              <th className="p-3 text-left">Strengths</th>
              <th className="p-3 text-left">Weaknesses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Full-Page Caching</strong>
              </td>
              <td className="p-3">
                Maximum performance (sub-millisecond from CDN). Simplest
                invalidation (single key purge). Lowest origin load. No
                composition overhead.
              </td>
              <td className="p-3">
                No personalization possible. Any user-specific content breaks
                caching. Ineffective for dynamic applications.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Fragment Caching</strong>
              </td>
              <td className="p-3">
                Balances caching with personalization. Stable portions cached,
                dynamic portions rendered per request. Granular TTL control per
                fragment.
              </td>
              <td className="p-3">
                Composition overhead increases with fragment count. Complex
                invalidation (each fragment has its own key and tags). Risk of
                inconsistent fragment versions during partial purges.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Edge-Side Includes (ESI)</strong>
              </td>
              <td className="p-3">
                Fragment composition at the edge (reduces origin load). CDN
                handles fragment caching and assembly. Supports conditional
                includes and error fallbacks.
              </td>
              <td className="p-3">
                Vendor lock-in (ESI support varies by CDN). ESI parsing adds
                latency at the edge. Debugging ESI composition failures is
                difficult. Limited to CDNs that support ESI.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Client-Side Assembly</strong>
              </td>
              <td className="p-3">
                Server serves a minimal shell page. Client fetches personalized
                fragments via API calls. Maximum flexibility for personalization.
                Progressive rendering possible.
              </td>
              <td className="p-3">
                Higher initial page load time (multiple API calls). SEO
                implications (search engines may not execute JavaScript).
                Increased client-side complexity. Poor performance on slow
                networks.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Stale-While-Revalidate</strong>
              </td>
              <td className="p-3">
                Serves stale content immediately while fetching fresh content
                in the background. Eliminates cache miss latency spikes. Smooth
                user experience during content updates.
              </td>
              <td className="p-3">
                Users see stale content during revalidation window. Background
                fetch consumes origin resources. Staleness duration is
                unpredictable under high load.
              </td>
            </tr>
          </tbody>
        </table>

        <p>
          The personalization problem has driven the industry toward a hybrid
          approach that combines a cacheable page shell with dynamically injected
          personalized content. In this pattern, the server renders a page
          skeleton that includes all the static content (article body, navigation,
          footer, metadata) and leaves placeholders for personalized sections
          (user greeting, recommendations, cart summary). The skeleton is fully
          cacheable at the CDN and reverse proxy layers because it contains no
          user-specific content. The client then fills the placeholders by making
          API calls to fetch personalized fragments, either during initial page
          load (via JavaScript that executes after the skeleton renders) or via
          server-side composition at the edge (using ESI or edge compute functions
          like Cloudflare Workers or Vercel Edge Functions). This approach
          maximizes the cacheable surface area of the page while preserving the
          ability to serve personalized content, and it is the dominant pattern
          in modern web architecture.
        </p>

        <p>
          The trade-off between TTL-based and event-driven invalidation is
          another critical decision. TTL-based invalidation is simpler to
          implement and more forgiving of operational errors (if an invalidation
          event is lost, the content will eventually be refreshed when the TTL
          expires), but it means that content changes are not visible until the
          TTL expires, which may be unacceptable for time-sensitive content
          (breaking news, flash sales, stock prices). Event-driven invalidation
          provides immediate content visibility but is more complex to implement
          and more fragile (if the invalidation event is not delivered or the
          purge API fails, stale content persists indefinitely). Most production
          systems combine both: they use event-driven invalidation for immediate
          content updates and a short TTL (minutes to hours) as a safety net to
          ensure that stale content is eventually refreshed even if the
          invalidation event fails.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>

        <p>
          Design cache keys with the minimum set of dimensions necessary to
          ensure content correctness. Start with the normalized URL, then add
          each dimension (locale, device class, authentication state, A/B variant)
          only if the page content actually varies along that dimension. Test
          each addition by measuring its impact on cache hit ratio: if adding a
          dimension reduces the hit ratio below the threshold where caching
          provides benefit (typically 60-70%), consider whether the content can
          be restructured to avoid varying along that dimension. Remove tracking
          parameters (utm_source, ref, fbclid, gclid) from the cache key, as
          these create unique URLs for the same content and fragment the cache
          unnecessarily. Implement URL normalization as a middleware layer that
          runs before cache key construction, stripping or normalizing parameters
          that do not affect content.
        </p>

        <p>
          Use tag-based invalidation for all content changes and assign tags
          systematically. Every cached page should have at least three tags: a
          content-specific tag (identifying the primary entity on the page, such
          as an article ID or product ID), a category tag (identifying the
          broader category or section the page belongs to), and a page-type tag
          (identifying whether the page is an article, a listing, a homepage, a
          feed). When content changes, purge the content-specific tag to
          invalidate the affected page, purge the category tag to invalidate
          listing pages that may reference the changed content, and purge the
          homepage tag if the changed content was featured on the homepage. This
          systematic tagging ensures that invalidation is comprehensive (all
          pages that reference the changed content are purged) without being
          overly broad (pages that do not reference the changed content remain
          cached).
        </p>

        <p>
          Implement stale-while-revalidate (stale-while-revalidate and
          stale-if-error HTTP cache directives) to smooth the latency profile
          during cache misses. When a cached page&apos;s TTL expires,
          stale-while-revalidate instructs the cache to serve the stale entry
          immediately while fetching a fresh version in the background. The next
          request receives the fresh version. This eliminates the latency spike
          that occurs when a popular page is evicted from the cache and must be
          re-rendered, which can take hundreds of milliseconds or seconds for
          complex pages. stale-if-error instructs the cache to serve a stale
          entry if the origin returns an error (5xx) when fetching a fresh
          version, providing graceful degradation during origin outages. Both
          directives are widely supported by CDNs and reverse proxies and should
          be included in the Cache-Control header for all cacheable pages.
        </p>

        <p>
          Monitor cache hit ratio by page type, by region, and by personalization
          dimension. The overall hit ratio can mask problems: a high overall hit
          ratio might be driven by static pages while personalized pages have near-zero
          hit ratios, indicating that the personalization strategy needs to be
          rethought. Break down hit ratio by page type (article, listing, homepage,
          profile) to identify which pages benefit from caching and which do not.
          Break down by region to identify geographic disparities in cache coverage
          (regions with fewer edge nodes may have lower hit ratios). Break down by
          personalization dimension to identify which dimensions are causing the most
          cache fragmentation (e.g., if A/B test variants are fragmenting the cache
          more than expected, consider reducing the number of concurrent experiments).
        </p>

        <p>
          Plan for bursty invalidation during high-traffic events. When a major
          content update occurs (a breaking news story, a product launch, a
          flash sale), the invalidation system may need to purge thousands of
          cached pages simultaneously, which can overwhelm the CDN purge API and
          cause a surge of cache misses at the origin. Stagger purges over time
          rather than issuing them all at once: purge the most critical pages
          first (the homepage, the affected article), then purge secondary pages
          (category listings, related content) over the next few seconds. Monitor
          origin load during purge events and throttle the purge rate if the
          origin approaches capacity. Implement a purge queue that serializes
          purge requests and limits the rate at which they are sent to the CDN,
          protecting both the CDN API and the origin server from overload.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>

        <p>
          Serving personalized content to the wrong user due to incorrect cache
          keys is the most dangerous pitfall of page caching. This occurs when
          the cache key omits a dimension that affects the page content, causing
          two different users to receive the same cached page. If that page
          contains user-specific information (account details, purchase history,
          private messages), the result is a privacy violation and a potential
          data breach. The fix is to include every user-distinguishing dimension
          in the cache key (at minimum, authentication state and user ID or
          permission tier) and to test cache key correctness systematically by
          requesting the same URL as different users and verifying that the
          responses differ. Automated tests should run as part of the CI/CD
          pipeline, simulating requests from anonymous, logged-in, and
          admin-level users and asserting that the cache keys differ.
        </p>

        <p>
          Cache fragmentation from overly granular keys is the flip side of the
          key design problem. If the cache key includes too many dimensions
          (every query parameter, every cookie, every header value), each unique
          combination creates a separate cache entry, and the hit ratio collapses
          because the probability of two requests having identical keys becomes
          vanishingly small. This is particularly common when the cache key
          includes tracking parameters (utm_source, referrer, session ID) that
          vary per request but do not affect the page content. The fix is to
          normalize the URL and the request headers before cache key
          construction, stripping parameters that do not affect content and
          grouping headers into broad categories (e.g., locale from
          Accept-Language rather than the full header value, device class from
          User-Agent rather than the full user agent string). Monitor cache key
          cardinality (the number of distinct keys observed over time) to detect
          fragmentation: a rapidly growing cardinality indicates that the key
          construction is too granular and needs to be simplified.
        </p>

        <p>
          Thundering herd after bulk invalidation occurs when a large number of
          cached pages are purged simultaneously (e.g., during a site-wide
          content refresh or a CDN cache flush), and the resulting cache misses
          flood the origin server with requests. The origin, which was protected
          by the cache, suddenly faces the full request load and may become
          overwhelmed, leading to increased latency, timeouts, or crashes. The
          prevention strategy is to stagger invalidations over time rather than
          purging all affected pages at once. Prioritize purging the most
          frequently accessed pages first (homepage, top articles, popular
          products), then purge less-accessed pages in subsequent batches.
          Implement request queuing or rate limiting at the reverse proxy layer
          to protect the origin from a sudden influx of cache misses. Use
          stale-while-revalidate to serve stale content during the purge window,
          reducing the number of origin requests.
        </p>

        <p>
          Inconsistent fragment versions during partial purges is a subtle
          pitfall of fragment caching. When a content change triggers a purge of
          some but not all fragments that compose a page, the page may be
          assembled from a mix of fresh and stale fragments, producing an
          inconsistent view. For example, if an article&apos;s title is updated
          and the title fragment is purged but the article listing fragment
          (which shows the article&apos;s title in a summary) is not, the article
          page shows the new title while the listing shows the old title. The
          fix is to use coordinated tagging: when purging a content-specific
          fragment, also purge all fragments that reference that content, using
          a shared tag. This requires a systematic mapping between content
          entities and the fragments that reference them, which is maintained by
          the content management system and communicated to the caching
          infrastructure during content updates.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <p>
          <strong>News and media websites</strong> are among the most common and
          demanding users of page caching. A major news site like The New York
          Times, The Guardian, or CNN serves millions of concurrent readers,
          most of whom are viewing the same set of articles, category pages, and
          the homepage. The content is largely identical for all readers (the
          article body, the headline, the author byline, the publication date),
          making it an excellent candidate for full-page caching at the CDN. The
          personalization layer is limited to a few elements: the reader&apos;s
          subscription status (paywall vs. free), comment section state, and
          personalized ad targeting. These are handled via fragment caching or
          client-side injection. The invalidation challenge is significant:
          breaking news stories are updated continuously, requiring frequent
          cache purges of the article page, the homepage, the category page, and
          the &quot;latest news&quot; widget. News sites use tag-based
          invalidation with staggered purges to manage this, purging the most
          critical pages first and allowing less-accessed pages to refresh
          naturally via TTL expiration.
        </p>

        <p>
          <strong>E-commerce product pages</strong> combine static content
          (product descriptions, specifications, images, reviews) with dynamic
          content (pricing, availability, personalized recommendations, cart
          state). The static portions are cached at the CDN and reverse proxy
          layers with long TTLs (hours to days), while the dynamic portions are
          rendered per request or fetched via client-side API calls. The cache
          key includes the product ID and the locale, but not the user ID (since
          the product page is largely the same for all users). Pricing and
          availability are injected client-side after the cached page loads,
          ensuring that users always see current values without invalidating the
          cache on every price change. Personalized recommendations are fetched
          via a separate API call that is not cached at the page level but may
          benefit from its own application-level cache. The invalidation
          strategy uses product-specific tags: when a product&apos;s description
          is updated, the product page is purged; when a product&apos;s category
          is changed, the category listing page is purged; when a product goes
          out of stock, only the availability fragment is updated (not the entire
          page), avoiding a full page purge.
        </p>

        <p>
          <strong>Documentation and knowledge-base sites</strong> like Stripe
          Docs, AWS Documentation, and internal engineering wikis are ideal
          candidates for page caching. The content is entirely static between
          updates (no personalization, no user-specific content), making
          full-page caching at the CDN the natural choice. The cache TTL can be
          set to days or weeks, with event-driven invalidation triggered by the
          content management system when a document is published or updated. The
          cache key is simply the normalized URL, with no personalization
          dimensions. The primary operational concern is ensuring that cache
          invalidation is reliable: when a documentation update is published,
          the old version must be purged from all CDN edge nodes promptly to
          prevent users from seeing outdated information. Documentation sites
          typically implement a publish pipeline that automatically triggers
          CDN purges as part of the deployment process, ensuring that cache
          invalidation is tightly coupled to content publication.
        </p>

        <p>
          <strong>Social media feeds</strong> present one of the most challenging
          page caching scenarios because the feed is inherently personalized and
          rapidly changing. Each user&apos;s feed is a unique composition of
          posts from their connections, promoted content, and algorithmic
          recommendations, making full-page caching impossible. Fragment caching
          is more applicable: individual posts are cached (since the same post
          appears in many users&apos; feeds), and the feed assembly logic
          composes cached posts with user-specific ranking and filtering. The
          post-level cache key is the post ID, and the cache TTL is long (hours
          to days) because posts do not change after publication. The feed
          assembly logic runs per request, fetching cached posts and applying
          the user-specific ranking algorithm. This pattern is used by
          platforms like Twitter and Reddit, where the individual content units
          (tweets, posts) are cacheable but the composition (the feed) is not.
        </p>

        <p>
          <strong>Enterprise SaaS dashboards</strong> combine heavy
          personalization (every user sees different metrics, widgets, and data)
          with some cacheable elements (dashboard layout, widget definitions,
          static reference data). The page shell (layout, navigation, widget
          frames) is cached with a user-specific key, while the data within each
          widget is fetched via API calls that have their own caching strategy.
          The dashboard layout changes infrequently (when the user rearranges
          widgets), so the layout cache has a long TTL. The widget data changes
          frequently (real-time metrics, recent activity), so the widget data
          cache has a short TTL (seconds to minutes) or uses
          stale-while-revalidate to serve cached data while fetching fresh data
          in the background. This layered approach ensures that the dashboard
          shell loads quickly from cache while the data refreshes at an
          appropriate cadence for each widget.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle page caching for a page that has both public
              content and user-specific elements?
            </p>
            <p className="mt-2 text-sm">
              A: The standard approach is the cacheable shell pattern: cache the
              public portion of the page (article body, navigation, footer,
              metadata) at the CDN with a key based on the URL and locale only,
              and inject the user-specific elements (greeting, cart,
              subscription status) either via edge-side includes (ESI) that
              compose personalized fragments at the CDN, or via client-side API
              calls that fetch personalized data after the cached shell loads.
              The key insight is that the majority of the page is usually
              identical for all users, and only a small fraction is personalized.
              By caching the common portion and dynamically injecting the
              personalized portion, the system achieves high cache hit ratios
              while preserving personalization. The trade-off is a slightly more
              complex rendering pipeline and a brief period during which the user
              sees the unpersonalized shell before the personalized elements load.
              For SEO-critical pages, server-side composition via ESI or edge
              compute functions is preferred because it ensures the fully
              assembled page (including personalized elements for logged-in users
              with crawler access) is served to search engines.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: A news site needs to update breaking news articles immediately
              after cache. How do you design the invalidation system?
            </p>
            <p className="mt-2 text-sm">
              A: The system needs a multi-layer invalidation strategy. First, the
              content management system (CMS) publishes a content-change event
              when an article is updated, containing the article ID and the list
              of pages affected (the article page itself, the homepage, the
              category page, the &quot;latest news&quot; widget). An invalidation
              service consumes these events and issues tag-based purge requests
              to the CDN API. The purge requests are staggered: the article page
              is purged first (highest priority, most time-sensitive), followed
              by the homepage and category pages (secondary priority), followed
              by the latest news widget (lowest priority). The stagger is
              implemented via a priority queue with rate limiting, ensuring that
              the CDN API is not overwhelmed and the origin server can handle the
              resulting cache misses without overload. As a safety net, all pages
              have a short TTL (e.g., 60 seconds) so that even if the purge
              event is lost, the stale content is refreshed within a minute. The
              system also monitors purge success rate and origin load during
              purge events, with alerts if purges fail or the origin approaches
              capacity.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you decide between fragment caching and ESI for a
              personalized page?
            </p>
            <p className="mt-2 text-sm">
              A: The decision depends on the CDN vendor, the complexity of
              fragment composition, and the performance requirements. ESI is
              appropriate when the CDN supports it (Fastly has excellent ESI
              support, Cloudflare supports it via Edge Side Includes, Akamai
              pioneered it) and when fragment composition at the edge provides a
              meaningful reduction in origin load. ESI moves the composition work
              from the origin to the CDN edge, which is beneficial for global
              applications where the origin is centralized but the CDN edges are
              distributed. However, ESI introduces vendor lock-in (the page
              templates contain ESI-specific tags that only work with ESI-capable
              CDNs), and debugging ESI composition failures is difficult because
              the composition happens inside the CDN infrastructure, not in the
              application. Fragment caching with application-level composition is
              more portable (the composition logic is in the application code,
              not in CDN-specific tags) and easier to debug, but it requires the
              origin server to perform the composition work, increasing origin
              load. The recommendation is to start with application-level
              fragment caching for portability and ease of debugging, and migrate
              to ESI only if origin load becomes a bottleneck and the CDN vendor
              provides strong ESI support and tooling.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is stale-while-revalidate, and when should you use it?
            </p>
            <p className="mt-2 text-sm">
              A: stale-while-revalidate is an HTTP Cache-Control directive that
              instructs the cache to serve a stale entry immediately while
              fetching a fresh version in the background. The directive takes a
              time value (e.g., stale-while-revalidate=300 means the stale entry
              can be served for up to 300 seconds after TTL expiration while the
              background fetch is in progress). It should be used for pages where
              the latency of a cache miss (re-rendering the page from scratch)
              is unacceptable for the user experience, and where a brief period
              of staleness is acceptable. News articles, product pages, and
              documentation pages are good candidates: serving an article that is
              30 seconds old is fine if it means the page loads in 10ms instead
              of 500ms. It should not be used for pages where content freshness
              is critical (stock prices, live sports scores, real-time
              dashboards), because the staleness window would serve outdated
              information. The stale-while-revalidate duration should be tuned
              based on the page render time: set it to 2-3 times the typical
              render time so that the background fetch has enough time to
              complete before the stale entry expires.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you prevent cache stampedes when a popular page is
              purged?
            </p>
            <p className="mt-2 text-sm">
              A: A cache stampede (or thundering herd) occurs when a popular
              cached page is purged and the resulting wave of cache misses
              overwhelms the origin server. Prevention requires multiple
              strategies working together. First, use stale-while-revalidate so
              that when the cached entry expires, the cache serves the stale
              version immediately while fetching a fresh version in the
              background, eliminating the cache miss for most requests. Second,
              implement request coalescing at the reverse proxy or origin layer:
              when multiple requests miss the cache simultaneously, only one
              request proceeds to render the page, and the others wait for its
              result. Third, stagger purges over time rather than purging all
              affected pages at once, spreading the cache miss wave across
              several seconds or minutes. Fourth, use a cache lock mechanism
              (e.g., Varnish&apos;s vcl_miss with a mutex, or Redis-based locking
              for application-level caches) to ensure that only one origin
              request renders the page at a time. Finally, monitor origin load
              during purge events and throttle the purge rate if the origin
              approaches capacity, ensuring that the purge process itself does
              not cause an outage.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you measure the effectiveness of page caching in
              production?
            </p>
            <p className="mt-2 text-sm">
              A: Effectiveness is measured through a combination of cache
              metrics, latency metrics, and origin load metrics. The primary
              cache metric is the hit ratio, broken down by page type, region,
              and personalization dimension. A healthy system has an overall hit
              ratio above 70%, with static pages above 90% and personalized
              pages above 40%. The secondary metric is the cache miss latency
              distribution (p50, p95, p99), which should show that cache misses
              are rare and that when they occur, the latency is dominated by the
              page render time, not by cache lookup overhead. The tertiary metric
              is origin load (requests per second hitting the origin server),
              which should be significantly lower than the total request rate --
              a good target is 10-20% of total traffic reaching the origin, with
              80-90% served from cache. Additionally, monitor invalidation
              effectiveness: the time between a content change and the cache
              purge completion (purge latency), the percentage of purges that
              succeed (purge success rate), and the rate of stale content
              complaints from users. Dashboards should display all of these
              metrics with alerts configured for hit ratio drops, origin load
              spikes, and purge failures.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.w3.org/TR/esi-lang"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C -- Edge Side Includes (ESI) Language Specification
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN -- HTTP Cache-Control Header Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.fastly.com/products/edge-side-includes"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fastly -- Edge Side Includes Implementation Guide
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/cloudfront/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS CloudFront -- CDN Caching and Invalidation Documentation
            </a>
          </li>
          <li>
            <a
              href="https://varnish-cache.org/docs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Varnish Cache -- Reverse Proxy Caching and VCL Configuration
            </a>
          </li>
          <li>
            <a
              href="https://tools.ietf.org/html/rfc5861"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 5861 -- HTTP Cache-Control Extensions for Stale Content
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
