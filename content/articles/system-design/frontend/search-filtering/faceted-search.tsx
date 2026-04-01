"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-faceted-search",
  title: "Faceted Search",
  description:
    "Comprehensive guide to Faceted Search covering filter architecture, multi-select handling, facet counting, and production-scale filtering patterns.",
  category: "frontend",
  subcategory: "search-filtering",
  slug: "faceted-search",
  wordCount: 5300,
  readingTime: 21,
  lastUpdated: "2026-04-01",
  tags: [
    "frontend",
    "faceted search",
    "filtering",
    "multi-select",
    "facet counting",
    "e-commerce",
  ],
  relatedTopics: [
    "client-side-search-implementation",
    "search-debouncing",
    "search-suggestions",
  ],
};

export default function FacetedSearchArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Faceted search</strong> (also called faceted navigation or
          faceted filtering) allows users to narrow search results by applying
          multiple filters across different categories or &quot;facets&quot;.
          Common facets include price range, brand, color, size, rating, and
          availability. Unlike simple search that returns a flat list of results,
          faceted search enables iterative refinement — users start with a broad
          query and progressively narrow down by selecting facet values.
        </p>
        <p>
          E-commerce sites pioneered faceted search (Amazon, eBay), but it&apos;s
          now standard for any application with filterable data: job boards
          (location, role, experience level), real estate (price, bedrooms,
          location), content libraries (category, author, date), and admin
          dashboards (status, type, date range). The key challenge is managing
          filter state — handling multiple simultaneous filters, updating facet
          counts as filters are applied, and maintaining a coherent URL state
          for sharing and bookmarking.
        </p>
        <p>
          Faceted search involves several technical challenges. <strong>Facet
          counting</strong> — showing how many results match each facet value
          (e.g., &quot;Nike (123)&quot;) — requires efficient computation,
          especially as filters are applied. <strong>Multi-select handling</strong>{" "}
          must support AND logic (must match all selected values) or OR logic
          (must match any selected value). <strong>Filter state management</strong>{" "}
          must track applied filters, available filters, and disabled filters
          (facet values that would return zero results).
        </p>
        <p>
          For staff-level engineers, faceted search architecture involves
          decisions about where filtering happens (client-side vs server-side),
          how facet counts are computed (pre-computed vs real-time), and how
          filter state is synchronized with URL (query params, hash, or state
          management). The optimal approach depends on dataset size, filter
          complexity, and SEO requirements.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Facets:</strong> Categories of filters — price, brand, color,
            etc. Each facet has multiple values (price: $0-50, $50-100, $100+;
            brand: Nike, Adidas, Puma). Facets can be mutually exclusive (price
            ranges) or multi-selectable (brands).
          </li>
          <li>
            <strong>Facet Values:</strong> Individual filter options within a
            facet. Each value has a count showing how many results match. Values
            can be enabled (selectable), selected (currently applied), or
            disabled (would return zero results).
          </li>
          <li>
            <strong>Facet Counts:</strong> The number of results matching each
            facet value. Counts update dynamically as filters are applied.
            Computing counts efficiently is critical — naive recomputation on
            every filter change is O(n×m) where n is results and m is facet
            values.
          </li>
          <li>
            <strong>Filter Logic:</strong> AND logic requires items to match all
            selected values within a facet (rare). OR logic matches any selected
            value within a facet (common for brands, colors). Across facets,
            AND logic is standard (must match selected brand AND selected price
            range).
          </li>
          <li>
            <strong>Applied Filters:</strong> Currently active filters displayed
            as removable chips or tags. Each chip shows the facet name and
            selected value with a remove button. Clearing all filters resets to
            unfiltered state.
          </li>
          <li>
            <strong>Disabled Facets:</strong> Facet values that would return zero
            results given current filters. These are shown but not selectable,
          often grayed out with count of 0. Prevents users from selecting
          combinations that return no results.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/search-filtering/faceted-search/facet-structure.svg"
          alt="Facet Structure showing facets, values, counts, and states"
          caption="Facet structure — each facet contains multiple values with counts; values can be enabled, selected, or disabled based on current filter state"
          width={900}
          height={500}
        />

        <p className="mt-4">
          The facet structure diagram illustrates how facets organize filter
          options. Each facet contains multiple values with counts showing how
          many results match. Values can be in one of three states: selected
          (currently applied), enabled (available to select), or disabled (would
          return zero results). This structure enables users to progressively
          narrow results while understanding the impact of each filter choice.
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Faceted search architecture consists of a filter state manager that
          tracks applied filters, a facet computation engine that calculates
          available facets and counts, and a results manager that filters and
          displays matching items. The architecture must handle filter changes
          efficiently without recomputing everything from scratch.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/search-filtering/faceted-search/filter-architecture.svg"
          alt="Faceted Search Architecture showing filter state, facet computation, and results flow"
          caption="Faceted search architecture — filter state tracks applied filters, facet engine computes available facets and counts, results manager filters and displays items"
          width={900}
          height={550}
        />

        <h3>Filter State Management</h3>
        <p>
          Filter state must track: applied filters (facet name, selected values),
          available facets (facet name, available values with counts), and UI
          state (expanded/collapsed facets, sort order). State can be stored in
          React state, Zustand, or Redux depending on application complexity.
          Critical: filter state should be synchronized with URL for shareability
          and bookmarking.
        </p>
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Faceted search implementation involves trade-offs between performance,
          complexity, and user experience.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/search-filtering/faceted-search/filter-state-flow.svg"
          alt="Filter State Flow showing state changes as filters are applied and removed"
          caption="Filter state flow — selecting a facet value updates applied filters, triggers facet recomputation, updates results, and syncs to URL"
          width={900}
          height={500}
        />

        <p className="mt-4">
          The filter state flow diagram shows how state changes propagate through
          the system. When a user selects a facet value, the applied filters
          update, which triggers facet recomputation to update available counts,
          which then filters the results. This flow must be optimized to avoid
          unnecessary recomputation — naive implementations recompute all facet
          counts on every filter change, while optimized implementations use
          incremental updates or pre-computed indexes.
        </p>

        <h3>Client-Side vs Server-Side Filtering</h3>
        <p>
          <strong>Client-side filtering</strong> loads all data upfront and
          filters in the browser. Advantages: instant filter response, works
          offline, no server load. Limitations: dataset must fit in memory
          (&lt;50,000 items), initial load is slower, facet counting can be slow
          for many facets.
        </p>
        <p>
          <strong>Server-side filtering</strong> sends filter state to server
          and receives filtered results. Advantages: handles arbitrary dataset
          size, server can optimize queries, facet counts are accurate.
          Limitations: network latency on every filter change, server load
          increases with filter complexity, requires robust API.
        </p>
        <p>
          <strong>Hybrid approach</strong> loads a subset of data client-side
          for instant feedback, with server-side filtering for comprehensive
          results. Common pattern: client-side filters for applied filters,
          server request for updated facet counts.
        </p>

        <h3>Facet Count Computation</h3>
        <p>
          <strong>Pre-computed counts:</strong> Calculate all facet counts
          upfront when data loads. Fast for user, slow initial load. Good for
          static datasets that don&apos;t change frequently.
        </p>
        <p>
          <strong>On-demand counts:</strong> Calculate counts only when facet
          is expanded. Faster initial load, slower interaction. Good for many
          facets where users only expand a few.
        </p>
        <p>
          <strong>Incremental counts:</strong> Update counts incrementally as
          filters change. Complex to implement but provides best UX. Used by
          major e-commerce sites.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Sync Filters with URL:</strong> Store filter state in query
            params (?brand=nike&price=50-100) for shareability, bookmarking, and
            back-button support. Use a library like useQueryParams or implement
            custom serialization.
          </li>
          <li>
            <strong>Show Applied Filters Prominently:</strong> Display applied
            filters as removable chips above results. Users should always know
            what filters are active and be able to remove them easily. Include
            &quot;Clear all&quot; button.
          </li>
          <li>
            <strong>Update Counts Dynamically:</strong> As filters are applied,
            update facet counts to show how many results match each remaining
            option. Gray out or disable options with zero results.
          </li>
          <li>
            <strong>Order Facets by Importance:</strong> Place most-used facets
          at the top (price, brand for e-commerce). Allow users to collapse
            less-important facets. Remember expanded/collapsed state.
          </li>
          <li>
            <strong>Support Multi-Select:</strong> Allow selecting multiple
            values within a facet (multiple brands, multiple colors). Use
            checkboxes for multi-select, radio buttons for single-select.
          </li>
          <li>
            <strong>Provide Price Range Input:</strong> For price facets,
            provide both predefined ranges ($0-50, $50-100) and custom range
            input (min-max fields or slider). Slider should show result count
            as user drags.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Not Disabling Zero-Count Facets:</strong> Allowing users to
            select facet values that return zero results creates frustration.
            Always compute and display counts, disable values with zero matches.
          </li>
          <li>
            <strong>Slow Facet Recomputation:</strong> Recomputing all facet
            counts on every filter change is O(n×m) and slow for large datasets.
            Use incremental computation or server-side counts for large datasets.
          </li>
          <li>
            <strong> Losing Filter State on Navigation:</strong> Users navigate
            to a product page, hit back, and lose all filters. Persist filter
            state in URL or state management to survive navigation.
          </li>
          <li>
            <strong>Too Many Facets:</strong> Showing 20+ facets overwhelms
            users. Limit to 5-10 most important facets. Put less-common filters
            in &quot;More filters&quot; expandable section.
          </li>
          <li>
            <strong>No Clear All Option:</strong> Users apply multiple filters
            and want to start over. Always provide &quot;Clear all filters&quot;
            button prominently.
          </li>
          <li>
            <strong>Inconsistent Filter Logic:</strong> Mixing AND and OR logic
            confuses users. Standard: OR within facets (Nike OR Adidas), AND
            across facets (Nike AND $50-100). Document behavior if non-standard.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Product Filtering</h3>
        <p>
          E-commerce sites use faceted search extensively. Amazon, eBay, and
          Shopify stores provide facets for price, brand, category, rating,
          shipping options, and product attributes (size, color, material).
          Facet counts update as filters are applied. Server-side filtering for
          large catalogs, client-side for small subsets.
        </p>

        <h3>Job Board Search</h3>
        <p>
          Job boards (LinkedIn, Indeed) use facets for location, job type
          (full-time, part-time, contract), experience level, industry, and
          remote/hybrid/onsite. Location facet often includes radius slider
          (&quot;within 25 miles&quot;). Salary range facet with min-max input.
        </p>

        <h3>Real Estate Search</h3>
        <p>
          Real estate sites (Zillow, Redfin) use facets for price, bedrooms,
          bathrooms, property type, square footage, and year built. Map view
          syncs with filter state — moving map updates location facet. Saved
          searches store filter state for alerts.
        </p>

        <h3>Content Library Filtering</h3>
        <p>
          Content management systems and documentation sites use facets for
          content type (article, video, tutorial), category, author, date range,
          and tags. Facets help users find relevant content in large libraries.
          Often combined with full-text search.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you efficiently compute facet counts as filters change?
            </p>
            <p className="mt-2 text-sm">
              A: Naive approach recomputes all counts on every filter change —
              O(n×m) where n is items and m is facet values. Better approaches:
              (1) Pre-compute a facet index mapping each facet value to item
              IDs. When filters change, intersect the item ID sets instead of
              scanning all items. (2) For server-side, use database aggregation
              queries with GROUP BY. (3) For large datasets, use approximate
              counts or cache common filter combinations. The key is avoiding
              full scans on every filter change.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle filter state synchronization with URL?
            </p>
            <p className="mt-2 text-sm">
              A: Serialize filter state to query params: ?brand=nike,adidas&price=50-100&rating=4+.
              Use a library like useQueryParams, TanStack Router, or Next.js
              useSearchParams. On mount, read query params and initialize filter
              state. On filter change, update query params without triggering
              page reload (shallow routing or history.pushState). Handle
              back/forward navigation by listening to popstate events. For
              complex filters, use JSON serialization with base64 encoding.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle &quot;no results&quot; scenarios in faceted
              search?
            </p>
            <p className="mt-2 text-sm">
              A: When filters return zero results: (1) Show clear &quot;No
              results found&quot; message. (2) Suggest which filters to remove
              — &quot;Try removing the Brand filter&quot; or &quot;Try widening
              your price range&quot;. (3) Show the closest matching items with
              an explanation — &quot;No exact matches, here are similar items&quot;.
              (4) Provide &quot;Clear all filters&quot; button prominently. (5)
              Consider showing popular items or trending products as fallback.
              The goal is to help users recover, not leave them stuck.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement a price range slider with facet counts?
            </p>
            <p className="mt-2 text-sm">
              A: Price range slider needs to show result counts as user drags.
              Implementation: (1) Pre-compute histogram of items by price
              buckets (e.g., $10 increments). (2) Render histogram as bars
              behind slider. (3) On slider change, filter items within range and
              update result count. For performance, use debouncing on slider
              change — update counts after user stops dragging for 200ms. For
              server-side, make API request with min/max params and return count.
              Show loading state during update.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle faceted search for very large datasets
              (millions of items)?
            </p>
            <p className="mt-2 text-sm">
              A: Client-side filtering is infeasible for millions of items. Use
              server-side filtering with search engine (Elasticsearch, Algolia,
              Meilisearch). These engines are optimized for faceted search —
              they maintain inverted indexes with facet information, compute
              counts efficiently, and return paginated results. Frontend sends
              filter state, receives filtered results with facet counts. For
              hybrid approach, load first 1000 items client-side for instant
              feedback, server for comprehensive results.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement &quot;show more&quot; for facets with many
              values?
            </p>
            <p className="mt-2 text-sm">
              A: For facets with many values (brands with 100+ options): (1)
              Show top 5-10 values by default (sorted by count or relevance).
              (2) Provide &quot;Show more&quot; button that expands to show all
              values. (3) Add search within facet for very long lists — type to
              filter brand names. (4) Consider virtualization for rendering many
              values — only render visible items. (5) Remember expanded state
              per facet so user&apos;s preference persists during session.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.nngroup.com/articles/faceted-search/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Nielsen Norman Group - Faceted Search Usability
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/2021/08/better-filtering-ux-ecommerce/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Smashing Magazine - Better Filtering UX for E-Commerce
            </a>
          </li>
          <li>
            <a
              href="https://algolia.com/doc/guides/building-search-ui/widgets/refinement-list/react/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Algolia - Faceted Search Implementation Guide
            </a>
          </li>
          <li>
            <a
              href="https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-terms-aggregation.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Elasticsearch - Faceted Search with Aggregations
            </a>
          </li>
          <li>
            <a
              href="https://baymard.com/blog/ecommerce-filtering-usability"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Baymard Institute - E-Commerce Filtering Research
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
