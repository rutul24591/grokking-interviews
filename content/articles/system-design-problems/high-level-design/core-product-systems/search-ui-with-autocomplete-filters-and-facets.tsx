"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-search-ui-autocomplete-filters-facets",
  title: "Design a Search UI with Autocomplete, Filters, and Facets",
  description:
    "Full-stack search UI architecture: autocomplete with debouncing, Elasticsearch-backed faceted filtering, URL state management, relevance tuning, and performance at scale.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "search-ui-with-autocomplete-filters-and-facets",
  wordCount: 5500,
  readingTime: 33,
  lastUpdated: "2026-05-10",
  tags: ["hld", "search", "autocomplete", "facets", "elasticsearch", "url-state"],
  relatedTopics: ["rate-limited-autocomplete", "audit-log-viewer-ui"],
};

export default function SearchUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Search is the primary navigation mechanism in content-heavy applications. A user searching for "running shoes under $100 in size 10" is expressing a structured intent that the search UI must decompose into a full-text query ("running shoes"), numeric filters (price &lt; 100), and attribute filters (size = 10)—and then surface the results in a way that allows iterative refinement. This is not a simple text box; it is a multi-dimensional query builder wrapped in a conversational interface.</p>
        <p>The two core challenges are query composition and result relevance. Query composition is the UI problem: how does the user express their intent? Autocomplete (suggesting completions as they type), filter chips (applying discrete constraints), and facets (showing the distribution of results by attribute) each solve a piece of this problem. Result relevance is the backend problem: given the composed query, how does the system rank results? Elasticsearch's BM25 relevance scoring handles full-text relevance, but facet-filtered results require the scoring to be combined with filter logic without degrading to a sequential scan.</p>
        <p><strong>Explicit assumptions:</strong> The product catalog has 10–100 million items. Elasticsearch is the search backend. Autocomplete suggestions are served from a separate endpoint backed by a prefix-indexed suggestion corpus (not the full Elasticsearch query). URL query parameters are the source of truth for filter state (bookmarkable, shareable). The search UI is the primary entry point for product discovery, so search latency directly impacts conversion.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Autocomplete:</strong> As the user types, show up to 8 suggestions combining popular queries, product names, and category names. Suggestions appear within 100ms of the last keystroke.</li>
          <li><strong>Full-text search:</strong> Search across product title, description, brand, and attributes. Typo-tolerance for common misspellings.</li>
          <li><strong>Faceted filtering:</strong> Dynamic facets showing available attribute values (Brand, Category, Size, Color, Price range) with result counts for each value. Selecting a facet value updates results and refines other facets.</li>
          <li><strong>Price range filter:</strong> Range slider or min/max input. Updates in real-time (debounced query on slider drag).</li>
          <li><strong>Sort:</strong> Relevance, price (asc/desc), rating, newest. Sort persists when filters change.</li>
          <li><strong>URL state:</strong> All search parameters (query, filters, sort, page) encoded in the URL. Sharing the URL reproduces the exact search state.</li>
          <li><strong>Pagination:</strong> Cursor-based pagination for large result sets. "Load more" button or infinite scroll.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Autocomplete latency:</strong> P99 &lt; 100ms. Served from a warm, in-memory prefix index (not a full Elasticsearch query per keystroke).</li>
          <li><strong>Search latency:</strong> P99 &lt; 500ms for the initial results page. Facet counts and results returned in a single response (not separate requests).</li>
          <li><strong>Relevance:</strong> The first result for a brand-name query should be the brand's flagship product, not a random item that mentions the brand name in its description.</li>
          <li><strong>Scale:</strong> Handle 10,000 concurrent search sessions without degradation. Elasticsearch shard configuration and caching strategy must be tuned for this load.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The search system has two distinct query paths. The autocomplete path handles keystroke-by-keystroke suggestions: the client sends the partial query to the Suggest API, which queries a prefix-indexed Redis sorted set or an Elasticsearch suggest endpoint, and returns results in under 50ms. The search path handles the submitted query: the client sends the full query plus all active filters to the Search API, which builds an Elasticsearch bool query combining the full-text match clause with the filter clauses, executes aggregations for facet counts, and returns results plus facet data in a single response.</p>
        <p>The URL is the single source of truth for search state. The frontend reads the search state from the URL on mount, renders accordingly, and updates the URL (via history.pushState, no page reload) whenever the state changes. This makes every search state bookmarkable and shareable. Deep linking works natively: sending a URL with ?q=running+shoes&brand=Nike&size=10&sort=price-asc reproduces the exact filtered search state.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/search-ui-with-autocomplete-filters-and-facets-architecture.svg"
          alt="Search UI architecture showing two query paths: autocomplete path (keystroke → debounce → Suggest API → Redis prefix index → suggestions dropdown) and search path (submit → Search API → Elasticsearch bool query with filter clauses and aggregations → results + facet counts). URL state management, facet panel, result list, and pagination components shown."
          caption="Search architecture: separate autocomplete and search paths, Elasticsearch faceted aggregations, URL-driven state management"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Autocomplete Architecture</h3>
        <p>Autocomplete must be fast—under 100ms end-to-end—which rules out a full Elasticsearch query per keystroke at any meaningful scale. The suggestion corpus is a precomputed set of (query text, score, type) tuples, where score reflects historical query frequency and click-through rate, and type distinguishes between search queries, product names, and categories. This corpus is indexed into a Redis sorted set keyed by prefix: every prefix of every suggestion is a key, with the suggestions as members sorted by score. A query for "run" performs ZREVRANGEBYSCORE prefix:run 0 +inf LIMIT 0 8, returning the top 8 suggestions by score.</p>
        <p>The suggestion corpus is rebuilt nightly from search logs (extracting the most popular queries from the past 30 days) and from the product catalog (indexing product names and category names as suggestions). New products and trending queries are reflected in the next nightly rebuild; autocomplete does not need real-time updates because the suggestions are popularity-based, not real-time. The corpus build is a batch job (Spark or a simple Python script) that writes the new Redis sorted sets and performs an atomic rename to swap old and new data with zero downtime.</p>
        <p>The client debounces autocomplete requests to 150ms after the last keystroke. This means a user typing "running" at normal speed generates 1–2 autocomplete requests (not 7, one per character). The debounce timer is reset on each keystroke. The autocomplete dropdown is dismissed when the user submits the search (presses Enter or clicks a suggestion) and when they click outside the input. Each keystroke cancels the previous in-flight autocomplete request (using AbortController) to prevent a fast typer from seeing suggestions for an earlier partial query after a later request has already returned.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Elasticsearch Query Construction</h3>
        <p>The Search API translates the URL parameters into an Elasticsearch bool query. The must clause contains the full-text match (multi_match across title, description, brand, with title having 3× boost). The filter clause (does not affect relevance score, cached by Elasticsearch for performance) contains all active filter conditions: term filters for discrete values (brand, category, size), range filters for price and rating. Filtering in the filter context rather than the must context means Elasticsearch can cache the filter results independently of the text query—a user filtering by Brand: Nike reuses the cached Nike filter across all queries, dramatically reducing per-query computation.</p>
        <p>Facet counts are computed via Elasticsearch aggregations in the same request as the results. A terms aggregation on the brand field returns all distinct brands in the current filtered result set along with their document counts. A range aggregation on price returns count by price bucket. This single round-trip (results + all facet counts in one Elasticsearch query) is what makes faceted search feel responsive. Splitting into separate requests for results and facets would double the latency and introduce count inconsistencies between the two responses.</p>
        <p>The critical nuance: when the user applies a Brand filter (Brand: Nike), the facet counts for all other facets (Category, Size, Price) should reflect the filtered result set (only Nike products). But the Brand facet itself should show counts for all brands in the unfiltered result set—otherwise the user cannot see that there are other brands available to switch to. This requires a global aggregation (computed without the brand filter) for the brand facet, alongside filtered aggregations for all other facets. Elasticsearch supports this via filter aggregations: post_filter applies the user's selected filters to the result documents but not to the top-level aggregations, then filter aggregations scope each facet's counts to the appropriate filter context.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">URL State Management</h3>
        <p>The search state is serialized into URL query parameters: ?q=running+shoes&brand=Nike&brand=Adidas&size=10&priceMin=50&priceMax=150&sort=price-asc&page=2. Multi-value filters (multiple brands selected) use repeated parameter names. The frontend parses these on mount using the URLSearchParams API and initializes the search state. When state changes (filter added or removed, sort changed, next page loaded), the URL is updated via history.pushState(), which does not trigger a page reload but adds a browser history entry, enabling the back button to correctly navigate back to the previous search state.</p>
        <p>URL state management must handle invalid parameters gracefully. If the URL contains ?size=99 for a product catalog that has no size 99 items, the search executes with size=99 and returns zero results for the size facet, showing an "invalid filter" message. The filter is not silently dropped (which would confuse the user who shared a link expecting specific filters) but is displayed as an inactive filter chip with an error state: "Size 99 (no results available)." The user can remove the filter and continue searching.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Facet Panel UX</h3>
        <p>The facet panel displays each filterable attribute as a group of checkboxes with result counts. Counts update every time the search executes with a new filter. Selecting a facet value executes a new search immediately (not a "Apply filters" button): the URL is updated, the new search fires, and results and updated facet counts return within 500ms. This instant-feedback model (used by Amazon, Zalando, ASOS) is consistently shown in conversion research to outperform "select multiple filters, click Apply."</p>
        <p>Long facet lists (e.g., 50 available brands) show the top 5–8 values with a "Show more" expander. The visible values are the most popular in the current result set (highest count). Showing more values expands the list in-place, not in a modal or new page. The search box within the facet panel (for facet search: "type to filter brands") is useful for long facet lists and does not trigger a new search—it filters the displayed facet values client-side against the already-fetched facet count list.</p>
        <p>Price range filtering uses a dual-thumb range slider. The slider's drag events update the URL (via pushState, with a 300ms debounce so rapid dragging doesn't fire a search per pixel). A text input alongside the slider shows the current min/max and allows precise entry. The search fires on slider release or on input blur/Enter, not on every slider tick. This matches the behavior of Booking.com and Airbnb's price filters, which feel responsive without hammering the search backend on every drag increment.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Relevance Tuning and Boosting</h3>
        <p>Default BM25 relevance ranks by term frequency, which works well for informational queries but poorly for navigational and transactional queries in e-commerce. A user searching "Nike Air Max 90" expects the exact product as the first result, not a blog post that happens to mention all three terms. The Search API applies function score boosting on top of text relevance: products with higher historical click-through rate from search (a signal that users found them relevant) get a relevance boost; exact title match gets a higher boost than partial title match; in-stock products are boosted above out-of-stock products; products with higher rating get a small boost. These boosts are configured as weights in the Elasticsearch function_score query and are tuned through offline A/B analysis of click-through rate versus result position.</p>
        <p>Typo tolerance is handled by Elasticsearch's fuzziness parameter on the multi_match query. fuzziness: AUTO applies 0 edits for 1–2 character terms (too short to fuzzy match sensibly), 1 edit for 3–5 character terms, and 2 edits for longer terms. This corrects "Nikee" to "Nike" and "runnig" to "running" without generating false matches for short terms. Synonym handling (sneakers → shoes, trainer → running shoe) is configured as a synonym filter in the Elasticsearch index settings, so a search for "sneakers" matches documents that contain "shoes" without the user needing to know the indexing terminology.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">No-Results and Partial-Match Handling</h3>
        <p>When a search returns zero results, the UI should not show an empty state and stop. The search service applies a cascade: first, try the exact query with all filters. If zero results, try the query without the most recently applied filter and show "No results found with [filter]. Showing results for [query] without this filter." If still zero results, try the query with fuzziness increased and synonyms expanded. If still zero results, suggest related searches or popular products in the category the user was browsing. The cascade logic is server-side; the client receives either results or a structured no-results response with alternative suggestions.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/search-ui-with-autocomplete-filters-and-facets-performance.svg"
          alt="Search performance architecture showing Elasticsearch filter context caching for facets, post_filter for result-only filtering, function_score relevance boosting layers, prefix-indexed Redis autocomplete corpus, request deduplication and AbortController for in-flight cancellation, and URL state serialization for deep linking"
          caption="Search performance: filter context caching, post_filter for facet independence, function_score boosting, Redis autocomplete, and URL-driven deep linking"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Client-side filter application versus server-side: some search UIs apply filters client-side on already-fetched results for instant feedback, then re-query the server for the full filtered result set. This gives the illusion of instant filtering but shows incorrect facet counts until the server responds. At scale, this approach is acceptable only for small result sets (&lt;1000 items) where the client can load all results upfront. For large catalogs (millions of products), every filter change must be a server round-trip to get correct counts and the correct full result set—client-side filtering only ever produces a subset of the true results.</p>
        <p>Elasticsearch versus Algolia: Algolia is a managed search service with excellent autocomplete, typo tolerance, and faceting out of the box, at significantly higher cost per query. Self-hosted Elasticsearch requires tuning (shard sizing, index mappings, relevance configuration) but has no per-query cost. For large query volumes (hundreds of millions of searches per month), the cost difference becomes significant. Algolia is the right choice for getting production search quality quickly; Elasticsearch is the right choice for long-term at scale operation with a team capable of tuning it.</p>
        <p>Facet count accuracy: Elasticsearch aggregations on large indices can return approximate facet counts when the index has many shards (the shard-level top-N aggregation truncates before merging, losing some counts). For product catalogs with tens of millions of items across many shards, the facet counts shown in the UI may be off by small amounts. This is acceptable for display purposes but should be documented. For applications where exact counts are required (compliance reporting, financial data), Elasticsearch is not the right tool—a traditional relational database with aggregation queries (slower but exact) is more appropriate.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A production search UI with autocomplete, filters, and facets separates the autocomplete path (150ms debounce → Suggest API → Redis prefix index → suggestions) from the search path (submit → Search API → Elasticsearch bool query with filter clauses and aggregations → results + facet counts). URL query parameters are the single source of truth for search state (bookmarkable, shareable, back-button compatible). Facet filtering uses Elasticsearch's post_filter and filter aggregations to show correct per-facet counts independently of other selected facets. Relevance tuning combines BM25 text relevance with function_score boosting for click-through rate, exact title match, stock status, and rating. Autocomplete is served from a pre-built Redis prefix index (not live Elasticsearch queries) with nightly corpus rebuilds from search logs and the product catalog. The zero-results cascade (retry without most recent filter → increase fuzziness → suggest alternatives) ensures the user always receives some useful response.</p>
      </section>
    </ArticleLayout>
  );
}
