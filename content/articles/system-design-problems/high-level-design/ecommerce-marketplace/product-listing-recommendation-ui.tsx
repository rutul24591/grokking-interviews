"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-product-listing-recommendation-ui",
  title: "Design Product Listing + Recommendation System UI",
  description:
    "Architecture for a product listing and recommendation UI: search-backed faceted filtering with Elasticsearch, real-time stock badge updates, sponsored product injection, collaborative filtering recommendation engine, two-stage retrieval-ranking pipeline, above-the-fold LCP optimization, infinite scroll with cursor pagination, and A/B tested recommendation placements.",
  category: "high-level-design",
  subcategory: "ecommerce-marketplace",
  slug: "product-listing-recommendation-ui",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-11",
  tags: ["hld", "ecommerce", "product-listing", "recommendation", "elasticsearch", "ranking", "infinite-scroll"],
  relatedTopics: ["amazon-flipkart-frontend", "cart-checkout-concurrency"],
};

export default function ProductListingRecommendationUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">A product listing page (PLP) and recommendation system must solve two related but distinct problems. The PLP is a query-driven interface: the user enters a search query or navigates to a category, and the system must return the most relevant products matching their intent, filtered by facets they select, sorted by their preferred ordering. The recommendation system is proactive: without an explicit user query, it predicts what products the user is most likely to be interested in and surfaces them at the right moment (homepage "Recommended for you", PDP "Customers also bought", cart "Frequently bought together"). The two systems share infrastructure (product catalog, user signals, ranking models) but have different latency and freshness requirements and different UI patterns (grid vs. carousel).</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The hardest engineering challenge on the PLP is facet performance: a search for "running shoes" in a catalog of 10 million products must return not just the matching products but also the counts for every possible facet value ("Brand: Nike (2,340), Adidas (1,890)...") in under 200ms. Computing these counts naively (scanning all matching products for each facet) is O(N×F) where F is the number of facets—too slow at scale. Elasticsearch solves this via aggregations computed alongside the search query using inverted index structures. The hardest challenge on the recommendation side is cold start (new users with no interaction history) and latency (a recommendation API call should complete in under 50ms to not delay page render).</HighlightBlock>
        <p><strong>Explicit scope:</strong> PLP with faceted search, infinite scroll, sponsored injection, and recommendations. Not in scope: the search indexing pipeline itself, personalized pricing, or seller-side catalog management.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Product listing:</strong> Full-text search with relevance ranking, category navigation, faceted filtering (brand, price range, rating, attributes), sort options (relevance, price asc/desc, rating, newest), real-time stock status badges, and pagination (infinite scroll for mobile, numbered pages for desktop).</li>
          <li><strong>Sponsored products:</strong> Paid placements injected at fixed positions (positions 1, 5, 17 in the result grid). Sponsored products are selected by a separate auction system; the PLP receives pre-computed sponsored SKUs and injects them at the specified positions. Click and impression events for sponsored products are tracked separately for billing.</li>
          <li><strong>Recommendations:</strong> Personalized "Recommended for you" section on homepage and PLP ("You might also like"). "Customers who viewed this also viewed" on PDP. "Frequently bought together" on cart page. Each placement uses a different recommendation algorithm appropriate to the context.</li>
          <li><strong>Real-time stock:</strong> "Only N left" and "Out of stock" badges must reflect inventory within 60 seconds. Badges update without full page reload (polling or WebSocket push).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Search latency:</strong> P99 &lt; 200ms from query to first result rendered. Facet counts returned in the same response (no second round-trip for facets).</li>
          <li><strong>Recommendation latency:</strong> P99 &lt; 50ms for recommendation API response. Recommendations must not block page render — they load asynchronously after the main content.</li>
          <li><strong>Freshness:</strong> New products indexed within 5 minutes of catalog publish. Price changes reflected in search results within 2 minutes.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="important">The PLP is backed by Elasticsearch for search and faceting. When a user applies filters or changes sort order, the frontend sends a query to the Search API (BFF layer), which translates the UI query parameters into an Elasticsearch DSL query with aggregations for facet counts. The response includes the matched products (with pagination cursor) and the facet aggregation results in a single round-trip. The Recommendation API is a separate service backed by a two-stage pipeline: a fast ANN retrieval layer (returns 200 candidates in &lt;20ms from a precomputed embedding index) followed by a lightweight ranking model (LightGBM, scores candidates in &lt;20ms). Recommendations are fetched asynchronously by the frontend after the main search results are displayed — they never block the critical rendering path.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ecommerce-marketplace/product-listing-recommendation-ui.svg"
          alt="Product listing and recommendation UI architecture showing PLP query flow (user search/filter/sort → BFF Search API → Elasticsearch DSL query + aggregations → products + facet counts in single response <200ms P99; pagination cursor-based for infinite scroll; sponsored injection at positions 1 5 17), Elasticsearch index design (product index: title description brand attributes price rating stock; analyzed fields for full-text; keyword fields for facets; nested for variants; index refresh every 2min for price/stock; aggregations: terms brand price_range rating computed alongside query O(1) not O(N*F)), two-stage recommendation pipeline (retrieval: user embedding ANN FAISS top-200 candidates <20ms; ranking: LightGBM feature engineering item affinity recency context <20ms; diversity re-rank no consecutive same-brand; cold start: global popularity + geo-trending fallback), recommendation placements (homepage You might like carousel lazy-loaded after main content; PDP also-viewed collaborative filtering viewed-viewed signals; cart frequently-bought co-purchase signals; all load async never block main render), infinite scroll (IntersectionObserver on sentinel element; cursor pagination from last item_id score; prefetch next page when 80% scrolled; skeleton cards reserve layout CLS=0; restore scroll position on browser back from session storage), real-time stock badges (initial render from ISR snapshot; CSR hydration POST /api/stock itemIds[] on page load; 60s polling for out-of-stock re-check; SSE push for flash sale inventory changes), sponsored injection (auction result pre-computed; inject sku at position 1 5 17 in result array; impression event fired on IntersectionObserver; click event separate billing pipeline)."
          caption="PLP query flow (Elasticsearch + facet aggregations in single round-trip), two-stage recommendation pipeline (ANN retrieval → LightGBM ranking), sponsored injection at fixed positions, infinite scroll with cursor pagination, async recommendation carousels (never block main render), and real-time stock badge polling"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Elasticsearch Query Design</h3>
        <HighlightBlock as="p" tier="important">The search query is a bool query combining text matching, filter clauses, and aggregations. Text matching uses a multi-match query across boosted fields: title^3, brand^2, description^1. This weights exact title matches highest, brand matches second, and description matches least. Filters are applied as filter context (not scoring, cached by Elasticsearch): price range (range filter), brand (terms filter on keyword field), rating (range filter on avg_rating field). Aggregations run in parallel with the query: a terms aggregation on brand.keyword returns the top 50 brand values with document counts; a range aggregation on price returns counts per price bucket (0–500, 500–2000, 2000+); a terms aggregation on avg_rating_bucket (a pre-computed integer field 1–5) returns rating distribution.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Cursor-based pagination: instead of offset-based pagination (which degrades with large offsets because Elasticsearch must score all N+offset documents), the PLP uses search_after pagination. The first page query returns results sorted by (relevance_score DESC, product_id ASC). The last item's (score, product_id) pair is sent as the search_after parameter in the next request, asking Elasticsearch to return the next page starting from that cursor. This is O(log N) regardless of page depth, making deep pagination in search results feasible.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Faceted Filter UX and State Management</h3>
        <HighlightBlock as="p" tier="important">Facet state is managed in the URL query string (e.g., ?brand=Nike,Adidas&price=500-2000&sort=price_asc). URL-based state has several advantages: the filtered view is bookmarkable and shareable, browser back/forward navigation works correctly, and server-side rendering can read the initial filter state from the URL without waiting for JavaScript to hydrate. When a user selects a facet, the URL is updated via router.push (shallow routing), triggering a new Elasticsearch query. The new facet counts reflect only the documents matching all currently applied filters — this is "and-filtering": selecting Brand=Nike and Price=500-2000 returns facet counts for the intersection, not for each dimension independently. A key UX detail: the selected facet's own count does not update when you select it (showing "Nike (0)" when you've just selected Nike would be misleading). The self-facet count is held at the pre-selection count or hidden when the filter is applied.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Two-Stage Recommendation Pipeline</h3>
        <HighlightBlock as="p" tier="important">Stage 1 — Candidate retrieval: the user's interest embedding (a 128-dimensional vector representing their interaction history, computed by a Matrix Factorization or two-tower model trained on purchase/click signals) is looked up from Redis. A FAISS ANN index over all product embeddings returns the 200 most similar products in under 20ms. For the "frequently bought together" placement, the candidate set is retrieved differently: a co-purchase graph (Spark-computed nightly, stored in Redis as adjacency lists) returns products frequently purchased with the current cart items.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Stage 2 — Ranking: the 200 candidates are scored by a LightGBM model with features: user-item affinity score from the embedding similarity, item popularity (global CTR), item recency (days since listing), price relative to user's historical price sensitivity, and context features (page type, device, time of day). LightGBM scores 200 candidates in under 10ms. Post-ranking, a diversity filter ensures no more than 2 consecutive items from the same brand and at least 20% of slots from outside the user's top 3 categories (exploration budget). Cold start: for users with fewer than 5 interactions, the recommendation API returns geo-trending products (most purchased items in the user's region in the past 7 days) blended with globally popular items, gradually shifting to personalized recommendations as signals accumulate.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Infinite Scroll and Performance</h3>
        <HighlightBlock as="p" tier="important">Infinite scroll is implemented with IntersectionObserver on a sentinel element 800px above the bottom of the list. When the sentinel becomes visible (user is 800px from the bottom), the next page of results is prefetched. The prefetch calls the Search API with the next cursor and stages the results in a ref; they are appended to the displayed list when the user scrolls close enough to trigger render. This two-step pattern (prefetch ahead, then render on approach) ensures the user never sees a loading spinner during normal scroll velocity. Skeleton cards are rendered for the prefetched positions while the network request is in flight, reserving layout space (preventing CLS) and giving visual feedback that more content is loading.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Scroll position restoration: when a user navigates from the PLP to a PDP (via clicking a product) and then presses back, the browser's default behavior is to scroll to the top of the PLP. To restore the user's scroll position (and avoid requiring them to re-scroll to find their place), the current scroll position and the list of loaded products (cursor state) are saved to sessionStorage on navigation. On mount, the component checks sessionStorage and restores the product list and scroll position. This is especially important on mobile where re-scrolling a long list is a significant friction point.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Sponsored Product Injection and Tracking</h3>
        <HighlightBlock as="p" tier="important">Sponsored products are injected at deterministic positions in the result grid (positions 1, 5, and 17 in the 0-indexed list). The sponsored SKUs are returned by the ad auction service as part of the Search API response (pre-computed before the API responds, not injected client-side to prevent SEO/accessibility issues with client-side-only content). Impression tracking: an IntersectionObserver fires when each sponsored product card enters the viewport (threshold: 50% visible for 1 second). At that point, an impression event is sent to the ads analytics pipeline (POST /ads/impression). Click tracking: the sponsored product's link element has a click handler that fires a click event to the ads pipeline before navigating to the PDP (the click event is sent via navigator.sendBeacon to avoid blocking navigation). The impression and click events flow to a separate analytics pipeline from the organic product events, enabling precise billing attribution for advertisers.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Offset versus cursor pagination: cursor-based pagination prevents the "page drift" problem (where a new product added while the user is browsing causes items to shift across pages) and is O(log N) regardless of depth. The downside is that users cannot jump to a specific page number (no "Page 47 of 123"), which matters for desktop users who prefer page-number navigation. The solution is to offer both: cursor-based infinite scroll for mobile (where jumping to page 47 is rare) and numbered pagination for desktop (using offset-based pagination but limited to the first 100 pages, beyond which cursor pagination takes over).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Real-time facet counts versus stale counts: recomputing facet counts on every user filter change (calling Elasticsearch on each checkbox click) adds latency and cost. An alternative is to compute facet counts once at initial load and display them as approximations that don't update as filters are applied. This is fine for broad facets (brand, price range) where the user expects the counts to reflect the full catalog. For narrow facets (e.g., size availability for a specific brand), stale counts mislead the user (showing "Size 10 (45 products)" when in reality there are 0 matching size 10 products from that brand after applying other filters). The standard practice: always recompute facet counts on filter application, cache the query at the Elasticsearch level (with query caching enabled for the filter context), and keep P99 well under the 200ms SLA.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A product listing and recommendation UI uses Elasticsearch for faceted search (bool query with aggregations for facet counts in a single round-trip, &lt;200ms P99; search_after cursor pagination for O(log N) deep page performance) and a two-stage recommendation pipeline (FAISS ANN retrieval of 200 candidates &lt;20ms + LightGBM ranking &lt;20ms, loaded asynchronously after main content). Sponsored products are pre-computed by the ad auction service and injected at fixed positions (1, 5, 17) server-side; impressions tracked via IntersectionObserver (50% visible, 1s dwell). Infinite scroll uses a prefetch-ahead pattern (sentinel 800px from bottom, two-step: prefetch → render on approach) with sessionStorage scroll position restoration for back-navigation UX. Real-time stock badges use initial CSR hydration + 60s polling + SSE for flash-sale events. Facet state lives in URL query string for shareability and server-side initial render. The defining constraints: search results and facet counts must arrive in one round-trip; recommendations must never block the main product grid render — load async, display only when ready.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
