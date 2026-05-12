"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-faceted-search-large-datasets",
  title: "Design Faceted Search for Large Datasets",
  description:
    "Architecture for a faceted search system for large datasets: facet panel design (checkboxes, range sliders, date pickers, hierarchical facets), facet count computation and caching, URL-driven filter state for shareability, client-side versus server-side facet application, Elasticsearch aggregations for facet counts, real-time facet count updates on selection, result ranking with applied facets, pagination reset on filter change, and breadcrumb-style applied filter chips.",
  category: "high-level-design",
  subcategory: "search-discovery-systems",
  slug: "faceted-search-large-datasets",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-11",
  tags: ["hld", "faceted-search", "elasticsearch", "filters", "aggregations", "url-state", "large-datasets"],
  relatedTopics: ["google-like-search-frontend", "semantic-search-ui"],
};

export default function FacetedSearchLargeDatasetsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Faceted search is the filtering paradigm used by e-commerce sites, job boards, real estate platforms, and any product that has a large catalog of structured items. Unlike full-text search (where the user types a query and gets ranked results), faceted search allows the user to narrow results by selecting values from predefined dimensions (facets): brand, price range, color, size, rating, location, upload date. The defining UX principle is that every filter selection must immediately update both the result count and the available filter values — if the user selects "Brand: Nike," the size filter should show only sizes available in Nike products, not all sizes across all brands.</p>
        <p>The performance challenge is facet count computation: for each visible facet value, the system must count how many results match that value within the current filter context. For a dataset with 10 million products and 50 facet dimensions, computing counts for all combinations in real time would be prohibitively expensive. The solution involves Elasticsearch aggregations (which compute facet counts in parallel with the result query) and strategic caching of facet count results. The UI challenge is state management: applied filters must be reflected in the URL (for shareability and bookmarkability), in the facet panel (selected values highlighted), in result count updates, and in a "breadcrumb" bar of applied filter chips — all synchronized without inconsistency.</p>
        <p><strong>Explicit scope:</strong> Facet panel design, URL-driven filter state, Elasticsearch aggregations for counts, result pagination with facets, and applied filter chips. Not in scope: the search indexing pipeline, ML-based result ranking, or A/B testing of facet layouts.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Facet panel:</strong> Left sidebar with collapsible facet groups. Facet types: checkbox list (Brand, Color, Size), range slider (Price, Rating), date range picker (Listing date), hierarchical tree (Category: Electronics &gt; Phones &gt; Smartphones), and toggle (In Stock, Free Shipping). Each checkbox shows the option label and the result count for that option given the current filters.</li>
          <li><strong>Applied filters chips:</strong> A horizontal bar below the search box showing each applied filter as a removable chip ("Brand: Nike ×", "Price: $50–$200 ×", "Color: Blue ×"). A "Clear all" button removes all filters. Clicking a chip removes that specific filter. Chips are the secondary representation of filter state (primary is the checked state in the facet panel).</li>
          <li><strong>Result count updates:</strong> When a filter is applied, the total result count updates ("Showing 847 results") and each unselected facet value shows the count that would result from additionally applying that value ("Nike (234)", "Adidas (156)"). Selected facet values show a checkmark and do not show a count (the count would be trivially the current result count).</li>
          <li><strong>Pagination:</strong> Results paginate at 24 items per page. Applying a filter resets to page 1. The current page is in the URL (?page=2). Sort order is also in the URL (?sort=price_asc) and is preserved when filters change.</li>
          <li><strong>URL state:</strong> All filter state is encoded in the URL query string (?brand=nike&brand=adidas&price_min=50&price_max=200&color=blue). Sharing the URL with another user shows the same filtered view. The browser Back button restores the previous filter state.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Filter application latency:</strong> Results and facet counts update within 300ms of applying a filter. The result list shows a loading state (skeleton cards) during the update, not a blank page.</li>
          <li><strong>Facet count accuracy:</strong> Facet counts are computed server-side (not estimated) using Elasticsearch aggregations for datasets up to 10 million items. For larger datasets, approximate counts (using Elasticsearch cardinality aggregations with a max_doc_count of 40,000) are acceptable with a ±5% error displayed as "~234".</li>
          <li><strong>Zero-result prevention:</strong> Facet values that would produce zero results (given the current filter context) are greyed out and non-selectable, not hidden — users can see that the option exists but understand it has no results in their current context.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The faceted search system uses Elasticsearch as the search and aggregation backend. A single Elasticsearch query returns both the result set (paginated) and the facet counts (aggregations) in one request. The frontend sends the current filter state (parsed from the URL) to the Search API, which constructs an Elasticsearch query with: a bool/filter for the applied filters, a multi-bucket aggregation for each facet dimension, and a top-hits aggregation for the result items. The response includes both the result items and the facet counts. The URL is the single source of truth for all filter state — the React component reads filter state from the URL (using a useSearchParams hook), not from a Zustand store. This means direct URL navigation always shows the correct state without any state synchronization.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/search-discovery-systems/faceted-search-large-datasets.svg"
          alt="Faceted search architecture showing URL state management (URL: ?q=shoes&brand=nike&price_min=50&price_max=200&color=blue&sort=price_asc&page=1; useSearchParams hook reads URL → build filter state object; all filter changes → pushState URL → re-fetch; browser Back → previous URL state), Elasticsearch query construction (Search API: parse filter state → build ES query: {bool:{filter:[{term:{brand:'nike'}},{range:{price:{gte:50,lte:200}}},{term:{color:'blue'}}]}}; aggregations: {brand_counts:{terms:{field:'brand',size:50}}, price_histogram:{histogram:{field:'price',interval:50}}, color_counts:{terms:{field:'color',size:20}}}; response: {hits:{total:847 items:[...]}, aggregations:{brand_counts:{buckets:[{key:'nike',doc_count:234},{key:'adidas',doc_count:156}...]}}}), facet panel rendering (collapsible groups; checkbox facet: iterate buckets → render option+count; selected: checkmark no count; zero-count: greyed out non-selectable; range slider: price_histogram buckets → slider with histogram bars; hierarchical: category tree depth-first expansion; date range: from/to date pickers → range filter; in-stock toggle; show more: collapse to top 5 + Show N more button), applied filter chips (derive chips from URL params: brand=nike → chip 'Brand: Nike'; price_min+price_max → chip 'Price: $50–$200'; click chip → remove param from URL → re-fetch; Clear all → remove all filter params → re-fetch), result list (skeleton cards 300ms loading state during re-fetch; result count: 'Showing 847 of 10,204'; sort dropdown: price_asc price_desc relevance newest; pagination: reset to page=1 on filter change; preserve sort on filter change; preserve filters on page change), zero-result prevention (each unselected facet value: compute count within current filter context; count=0 → render greyed non-clickable; count&gt;0 → clickable; post-filter aggregation: selected facets not filtered from their own aggregation, so user can de-select), cache strategy (Redis: cache key=SHA256(filter_state); TTL 2min; cache hit: return immediately; cache miss: ES query → store result; invalidate on index update via Kafka consumer; high-traffic: pre-warm cache for top 100 filter combinations)."
          caption="URL-driven filter state (useSearchParams, pushState on change), single ES query (bool/filter + multi-bucket aggregations for counts), facet panel (checkbox with counts, range slider with histogram bars, hierarchical tree, greyed zero-count options), applied filter chips (derived from URL params), skeleton loading (300ms), page-reset on filter change, and Redis result cache (SHA256 key, 2min TTL)"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">URL-Driven Filter State</h3>
        <p>The URL is the single source of truth for all filter state, enabling shareability, bookmarkability, and correct browser Back/Forward navigation. The URL encoding: checkbox filters use repeated parameters (?brand=nike&brand=adidas), range filters use min/max parameters (?price_min=50&price_max=200), sort uses a single parameter (?sort=price_asc), and page uses a single parameter (?page=2). A useSearchParams hook (from Next.js or React Router) reads the URL on every navigation and derives the current filter state. When the user changes a filter (checks a checkbox, adjusts a slider), the filter change is encoded into the URL using window.history.pushState — this updates the URL without a page reload, triggers a re-render with the new URL state, and adds a history entry so the browser Back button restores the previous filter state.</p>
        <p>The filter state object is derived from URL params on every render — there is no separate filter state in React state or Zustand. This eliminates an entire class of state synchronization bugs (where URL state and React state diverge). The trade-off: every URL change triggers a re-render and a new Elasticsearch query. To prevent excessive queries during slider drag (the user drags a price slider, firing many intermediate values), range slider changes are debounced (300ms) before updating the URL.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Elasticsearch Query and Aggregation Design</h3>
        <p>A single Elasticsearch query serves both the result items and the facet counts. The query structure: a bool/filter clause applies all current filters to the result set. Each facet aggregation (terms aggregation for checkbox facets, histogram aggregation for range facets) computes counts across the filtered result set. The critical nuance is that selected facet values should not filter their own aggregation — if the user has selected "Brand: Nike," the brand aggregation should still show all brands (so the user can see how many Adidas items exist and can switch to Adidas if desired). This is implemented using Elasticsearch post-filter: the filter is applied after aggregations are computed, so aggregations always run on the full result set, and only the returned hits are filtered. This is sometimes called the "exclude selected" pattern.</p>
        <p>Facet count accuracy: for datasets up to 10 million items, Elasticsearch terms aggregations are exact. For larger datasets, the size parameter (how many buckets to return) must be balanced against accuracy — requesting size=1000 for a brand aggregation is accurate but slow. Elasticsearch's shard_size parameter (how many buckets to collect per shard before global merging) can be tuned for the accuracy/performance trade-off. For very high-cardinality facets (e.g., seller name in a marketplace with 100K sellers), a filter-only approach (show only the top 20 sellers, let the user search within the facet) is preferable over returning all 100K with counts.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Facet Panel Rendering</h3>
        <p>The facet panel renders different control types based on the facet dimension type. Checkbox facets (brand, color, size) render a scrollable list of checkboxes, each showing the option label and its result count. The list is collapsed to the top 5 items by default with a "Show N more" button that expands the full list. Items are sorted by count (descending) by default, but selected items are pinned to the top so the user can see what they've applied. Zero-count items are greyed out and non-interactive (not hidden — hiding them would confuse users who remember seeing an option).</p>
        <p>Range slider facets (price, rating) render a dual-thumb slider with a histogram of item distribution overlaid on the track. The histogram is derived from the histogram aggregation in the Elasticsearch response (e.g., price values grouped in $50 buckets). The visual histogram helps users understand where items are concentrated in the price range. The slider thumbs snap to histogram bucket boundaries when dragging for better UX (smaller steps feel meaningless when there are no items in that price band). Date range facets render from/to date pickers. Hierarchical facets (category tree) render as an expandable tree: clicking a top-level category (Electronics) expands it to show subcategories (Phones, Laptops, Tablets) with their counts. Selecting a subcategory narrows the filter to that level.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Result Caching Strategy</h3>
        <p>Faceted search results are highly cacheable because filter combinations repeat across users (many users filter for Nike shoes in size 10, price under $150). The cache key is SHA256(filter_state_JSON + query + sort + page), normalized so that equivalent filter states produce the same key regardless of parameter order. Results are cached in Redis with a 2-minute TTL. Cache invalidation: when new items are indexed or existing items are updated (e.g., an item goes out of stock), a Kafka event triggers cache invalidation for affected keys. For high-traffic facet combinations (top 100 most common filter sets, computed from analytics), a background job pre-warms the cache every minute, ensuring that common filters are always served from cache. The cache pre-warming job runs the Elasticsearch queries and stores results ahead of user requests.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Client-side versus server-side facet application: client-side faceting (download all items once, filter in the browser using JavaScript) is only feasible for small datasets (under 10,000 items). For larger datasets, server-side faceting is required — the browser cannot download 10 million items to filter client-side. The client-side approach has one advantage: filter application is instant (no network latency), making the UI feel highly responsive. The hybrid approach (client-side filter for the currently loaded page of results, server-side re-fetch for subsequent pages) is used by some implementations but creates a confusing experience where filtering within the current page is instant but getting more results requires a server round-trip.</p>
        <p>Facet ordering (by count versus alphabetical versus business priority): by default, facets are ordered by count (most results first), which helps users navigate to the most populated filters quickly. However, business logic may override this: a seller might want their own brand listed first in the brand facet, or an e-commerce platform might want to promote premium brands. The facet ordering algorithm should be configurable per facet dimension, supporting count-based, alphabetical, explicit order lists (pinned items at top), and promoted items (business-priority items that appear above the count-sorted list).</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>Faceted search for large datasets uses URL as the single source of truth for all filter state (useSearchParams → filter state object → Elasticsearch query → pushState on change). A single Elasticsearch query returns both results and facet counts using post-filter (aggregations run pre-filter so selected facet values don't suppress their own counts). The facet panel renders checkbox lists (with top-5 collapse + "Show more"), range sliders with histogram overlays (from histogram aggregations), hierarchical category trees, and date range pickers. Zero-count facet options are greyed out, not hidden. Applied filters are surfaced as removable chips derived from URL params. Redis caches results at SHA256(filter_state) with 2-minute TTL, invalidated on index updates via Kafka; top-100 filter combinations are pre-warmed. The core design constraint: every filter interaction must update counts, results, chips, and the URL atomically in one operation — the URL is the state, not React state, ensuring Back navigation always works correctly.</p>
      </section>
    </ArticleLayout>
  );
}
