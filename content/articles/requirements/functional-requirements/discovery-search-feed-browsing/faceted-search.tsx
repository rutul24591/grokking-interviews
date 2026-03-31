"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-backend-faceted-search",
  title: "Faceted Search",
  description:
    "Comprehensive guide to faceted search covering facet types, computation strategies, multi-select filtering, performance optimization, and UX best practices.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "faceted-search",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "search",
    "facets",
    "backend",
    "filtering",
  ],
  relatedTopics: ["search-indexing", "filters", "search-ranking", "elasticsearch"],
};

export default function FacetedSearchArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Faceted Search</strong> (also called faceted navigation or faceted
          browsing) enables users to filter search results by multiple dimensions called
          facets. Each facet represents a category of information—price range, brand,
          color, size, rating, date—that users can select to narrow down results. This
          powerful pattern is ubiquitous in e-commerce (Amazon, eBay), job boards
          (LinkedIn, Indeed), and content platforms.
        </p>
        <p>
          Unlike simple keyword search, faceted search provides structured exploration.
          Users don't need to know exact search terms—they can discover relevant items
          by progressively refining criteria. The challenge lies in computing facet
          counts efficiently (how many items match each facet value), updating counts
          as filters are applied, and presenting facets in an intuitive UI without
          overwhelming users.
        </p>
        <p>
          For staff-level engineers, faceted search involves complex backend challenges:
          computing facet counts across millions of items in milliseconds, handling
          multi-select logic (OR within facet, AND across facets), caching strategies
          for facet results, and maintaining consistency when underlying data changes.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Facet Types</h3>
        <p>
          Different data types require different facet UI patterns:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Categorical Facets:</strong> Discrete values like category, brand,
            color, size. UI: Checkboxes or multi-select dropdowns. Example: "Brand: Nike,
            Adidas, Puma". Supports multi-select (OR logic within facet).
          </li>
          <li>
            <strong>Numeric Facets:</strong> Continuous ranges like price, rating, weight.
            UI: Sliders or range inputs. Example: "Price: $50 - $200". Requires
            histogram buckets for distribution visualization.
          </li>
          <li>
            <strong>Temporal Facets:</strong> Date/time ranges like publication date,
            listing date. UI: Date pickers or preset ranges (Last 7 days, Last month).
            Example: "Posted: Last 24 hours, Last week".
          </li>
          <li>
            <strong>Hierarchical Facets:</strong> Nested categories with parent-child
            relationships. UI: Expandable tree. Example: "Electronics → Computers →
            Laptops → Gaming Laptops".
          </li>
          <li>
            <strong>Boolean Facets:</strong> Yes/no or true/false values. UI: Toggle
            switches or single checkboxes. Example: "In Stock", "Free Shipping".
          </li>
        </ul>

        <h3 className="mt-6">Facet Computation Strategies</h3>
        <p>
          Computing facet counts efficiently is the core challenge:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Pre-computed Facets:</strong> Calculate counts during indexing. Fast
            retrieval but stale counts. Good for slowly changing data (product categories).
          </li>
          <li>
            <strong>Real-time Facets:</strong> Compute counts at query time using search
            engine aggregations. Accurate but slower. Required for frequently changing
            data (inventory, prices).
          </li>
          <li>
            <strong>Sampled Facets:</strong> Estimate counts from sample of results.
            Faster but approximate. Used for very large result sets (1M+ items).
          </li>
          <li>
            <strong>Cached Facets:</strong> Cache facet results for common queries.
            Balance between speed and accuracy. Invalidate cache on data changes.
          </li>
        </ul>

        <h3 className="mt-6">Multi-Select Logic</h3>
        <p>
          Understanding how multiple facet selections combine is critical:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>OR Within Facet:</strong> Selecting multiple values in same facet
            uses OR logic. "Brand: Nike OR Adidas" shows items from either brand.
          </li>
          <li>
            <strong>AND Across Facets:</strong> Selections in different facets use AND
            logic. "Brand: Nike AND Price: $50-100" shows Nike items in that price range.
          </li>
          <li>
            <strong>Facet Count Updates:</strong> After selecting "Nike", facet counts
            should update to reflect only Nike items. "Adidas" count becomes 0 (since
            AND logic excludes it).
          </li>
        </ul>

        <h3 className="mt-6">Facet Display Strategies</h3>
        <p>
          How to present facets without overwhelming users:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Show Top N:</strong> Display top 5-10 facet values by count. Provide
            "Show more" for remaining values.
          </li>
          <li>
            <strong>Hide Empty Facets:</strong> Don't show facet values with 0 results.
            Reduces clutter, prevents dead ends.
          </li>
          <li>
            <strong>Relevance Sorting:</strong> Sort facet values by count (most results
            first) or alphabetically. Count sorting is more common for discovery.
          </li>
          <li>
            <strong>Selected First:</strong> Move selected facet values to top of list.
            Helps users track their selections.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          A production faceted search system involves multiple components working together
          to compute and display facets efficiently.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/faceted-search/facet-computation-architecture.svg"
          alt="Facet Computation Architecture"
          caption="Figure 1: Facet Computation Architecture — Search query with facet aggregations, caching layer, and real-time count updates"
          width={1000}
          height={500}
        />

        <h3>Component Breakdown</h3>
        <ul className="space-y-3">
          <li>
            <strong>Query Parser:</strong> Parses user's search query and selected facets.
            Builds combined filter query (search terms + facet filters).
          </li>
          <li>
            <strong>Search Engine:</strong> Executes search with facet aggregations.
            Elasticsearch aggregations, Solr facets, or custom implementation. Returns
            results + facet counts.
          </li>
          <li>
            <strong>Facet Service:</strong> Computes facet counts, applies business rules
            (hide empty, sort by count), formats for UI. May cache common facet results.
          </li>
          <li>
            <strong>Cache Layer:</strong> Caches facet results for common query + facet
            combinations. Uses query hash as cache key. TTL based on data freshness needs.
          </li>
          <li>
            <strong>UI Component:</strong> Renders facet filters, handles user interactions,
            updates URL state, triggers re-fetch on facet changes.
          </li>
        </ul>

        <h3 className="mt-6">Data Flow: Faceted Search Request</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>User Selects Facet:</strong> Clicks "Brand: Nike" checkbox. UI updates
            selected facets state.
          </li>
          <li>
            <strong>Build Query:</strong> Combine search terms + selected facets into
            filter query. "query=shoes AND brand:nike AND price:50-100".
          </li>
          <li>
            <strong>Check Cache:</strong> Look up cached results for this query hash.
            If hit, return cached facets immediately.
          </li>
          <li>
            <strong>Execute Search:</strong> Send query to search engine with facet
            aggregations. Request counts for each facet field.
          </li>
          <li>
            <strong>Compute Aggregations:</strong> Search engine computes facet counts
            across matching documents. Returns results + facet counts.
          </li>
          <li>
            <strong>Post-process Facets:</strong> Hide empty values, sort by count,
            apply "show top N" limit, format for UI.
          </li>
          <li>
            <strong>Cache Results:</strong> Store facet results with TTL. Invalidate on
            relevant data changes.
          </li>
          <li>
            <strong>Update UI:</strong> Render updated facet counts, update URL with
            new filter state.
          </li>
        </ol>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/faceted-search/multi-select-logic.svg"
          alt="Multi-Select Facet Logic"
          caption="Figure 2: Multi-Select Logic — OR within facet (Brand A OR B), AND across facets (Brand AND Price)"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Elasticsearch Faceted Search Example</h3>
        <p>
          Elasticsearch aggregations are the industry standard for facet computation:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Aggregation Type</th>
                <th className="text-left p-2 font-semibold">Use Case</th>
                <th className="text-left p-2 font-semibold">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Terms Aggregation</td>
                <td className="p-2">Categorical facets</td>
                <td className="p-2">Brand counts, category counts</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Range Aggregation</td>
                <td className="p-2">Numeric facets</td>
                <td className="p-2">Price ranges, rating buckets</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Date Histogram</td>
                <td className="p-2">Temporal facets</td>
                <td className="p-2">Items per day/week/month</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Nested Aggregation</td>
                <td className="p-2">Hierarchical facets</td>
                <td className="p-2">Category → Subcategory</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Filter Aggregation</td>
                <td className="p-2">Boolean facets</td>
                <td className="p-2">In stock, on sale</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6">Performance Optimization</h3>
        <p>
          Facet computation can be expensive. Key optimization strategies:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Limit Facet Count:</strong> Request only top N facet values (e.g.,
            top 10 brands). Reduces aggregation cost.
          </li>
          <li>
            <strong>Use Filter Context:</strong> Facet filters in filter context (not
            query context) for caching. Elasticsearch caches filter results.
          </li>
          <li>
            <strong>Pre-filter Facets:</strong> Don't compute facets that will be hidden
            (empty values). Use min_doc_count parameter.
          </li>
          <li>
            <strong>Parallel Aggregations:</strong> Run facet aggregations in parallel
            with main search. Elasticsearch does this by default.
          </li>
          <li>
            <strong>Sampling for Large Sets:</strong> For 1M+ results, use sampler
            aggregation to estimate counts from subset.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Faceted search design involves balancing accuracy, performance, and user
          experience.
        </p>

        <h3>Facet Computation Approaches</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Approach</th>
                <th className="text-left p-2 font-semibold">Accuracy</th>
                <th className="text-left p-2 font-semibold">Latency</th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Real-time Aggregation</td>
                <td className="p-2">Exact</td>
                <td className="p-2">50-200ms</td>
                <td className="p-2">E-commerce, inventory</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Pre-computed</td>
                <td className="p-2">Stale (minutes)</td>
                <td className="p-2">&lt;10ms</td>
                <td className="p-2">Static catalogs</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Sampled</td>
                <td className="p-2">Approximate (±5%)</td>
                <td className="p-2">20-50ms</td>
                <td className="p-2">Large datasets (1M+)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Cached</td>
                <td className="p-2">Exact (until expiry)</td>
                <td className="p-2">&lt;5ms (hit)</td>
                <td className="p-2">Common queries</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/faceted-search/facet-performance-optimization.svg"
          alt="Facet Performance Optimization"
          caption="Figure 3: Performance Optimization — Caching strategies, aggregation limits, and sampling for large result sets"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Facet Display Trade-offs</h3>
        <p>
          <strong>Show All Values:</strong> Complete information but overwhelming. Users
          may miss important facets in long lists. Risk: analysis paralysis.
        </p>
        <p>
          <strong>Show Top N:</strong> Cleaner UI, highlights popular options. Risk:
          long-tail values hidden. Solution: "Show more" button for expanded view.
        </p>
        <p>
          <strong>Dynamic Facets:</strong> Show/hide facets based on query relevance.
          Facets with high variance across results shown first. More sophisticated but
          harder to implement.
        </p>

        <h3 className="mt-6">Multi-Select vs Single-Select</h3>
        <p>
          <strong>Multi-Select (OR within facet):</strong> More flexible, users can
          select multiple brands/colors. Standard for e-commerce. Complexity: facet
          count updates become more complex.
        </p>
        <p>
          <strong>Single-Select:</strong> Simpler logic, clearer intent. Used for
          mutually exclusive facets (sort order, view mode). Not suitable for
          exploratory filtering.
        </p>
        <p>
          <strong>Hybrid:</strong> Multi-select for categorical facets (brand, color),
          single-select for others (sort order). Most production systems use this.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Search Engine Facets:</strong> Elasticsearch, Solr, or Algolia
            have optimized facet implementations. Don't build from scratch unless
            necessary.
          </li>
          <li>
            <strong>Cache Common Queries:</strong> Cache facet results for popular
            query + facet combinations. Use query hash as cache key. Set TTL based on
            data freshness needs.
          </li>
          <li>
            <strong>Limit Facet Values:</strong> Show top 5-10 values per facet by
            default. Provide "Show more" for expanded view. Reduces cognitive load.
          </li>
          <li>
            <strong>Hide Empty Facets:</strong> Don't show facet values with 0 matching
            results. Prevents dead ends and user frustration.
          </li>
          <li>
            <strong>Update Counts Dynamically:</strong> As users select facets, update
            counts to reflect remaining options. Shows impact of each selection.
          </li>
          <li>
            <strong>Support Clear All:</strong> Provide "Clear all filters" button.
            Users should easily reset to unfiltered state.
          </li>
          <li>
            <strong>Preserve State in URL:</strong> Encode selected facets in URL query
            params. Enables bookmarking, sharing, back button support.
          </li>
          <li>
            <strong>Mobile Optimization:</strong> Use accordions or slide-out panels
            for facets on mobile. Don't show all facets at once on small screens.
          </li>
          <li>
            <strong>Accessibility:</strong> Use proper ARIA attributes for facet
            controls. Announce count updates to screen readers. Keyboard navigation
            support.
          </li>
          <li>
            <strong>Analytics Integration:</strong> Track facet usage (which facets
            selected, which lead to conversions). Use for facet ordering optimization.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Slow Facet Computation:</strong> Computing too many facets or not
            using aggregations efficiently. Solution: Limit facet count, use filter
            context, cache results.
          </li>
          <li>
            <strong>Inconsistent Counts:</strong> Facet counts don't match actual
            results. Solution: Ensure facet aggregations use same filters as main
            query.
          </li>
          <li>
            <strong>Zero Results Dead End:</strong> User selects combination that
            yields 0 results. Solution: Show "no results" with suggestions, disable
            facet values that would lead to 0 results.
          </li>
          <li>
            <strong>Overwhelming Users:</strong> Too many facets or values shown at
            once. Solution: Show top facets first, use progressive disclosure, group
            related facets.
          </li>
          <li>
            <strong>Not Updating Counts:</strong> Facet counts stay static after
            selections. Solution: Re-compute facets on each filter change, show
            loading state.
          </li>
          <li>
            <strong>Breaking Back Button:</strong> Facet changes don't update URL.
            Solution: Push state to history on each facet change, encode in query
            params.
          </li>
          <li>
            <strong>Ignoring Mobile:</strong> Desktop facet layout on mobile. Solution:
            Use responsive design, accordions, or slide-out panels for mobile.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Amazon Product Search</h3>
        <p>
          Amazon's faceted search is industry-leading. Facets include: Department,
          Brand, Price, Customer Review, Prime eligibility, Condition, Color, Size.
          Updates counts dynamically as filters applied. Shows "X results" for each
          facet value.
        </p>
        <p>
          <strong>Key Innovation:</strong> Personalized facet ordering—facets relevant
          to user's browsing history shown first. Price ranges adapt to product
          category (electronics vs clothing).
        </p>

        <h3 className="mt-6">LinkedIn Jobs</h3>
        <p>
          LinkedIn Jobs uses facets for: Job Type (Full-time, Contract), Experience
          Level, Industry, Company, Location, Date Posted, Remote/On-site. Hierarchical
          facets for industry (Technology → Software → Web Development).
        </p>
        <p>
          <strong>Key Innovation:</strong> "Under 10 applicants" facet—unique filter
          based on real-time application count. Helps job seekers find less competitive
          positions.
        </p>

        <h3 className="mt-6">Zillow Real Estate</h3>
        <p>
          Zillow facets include: Price, Beds, Baths, Home Type, Square Feet, Lot Size,
          Year Built, Parking, HOA. Map-based facet visualization shows results
          geographically.
        </p>
        <p>
          <strong>Key Innovation:</strong> Interactive map with cluster counts—facet
          counts update as you pan/zoom the map. Combines geographic and attribute
          filtering seamlessly.
        </p>

        <h3 className="mt-6">Best Buy Electronics</h3>
        <p>
          Best Buy uses facets for: Category, Brand, Price, Customer Rating, Features,
          Color, Availability. Nested facets for category (Electronics → Computers →
          Laptops). Feature facets vary by product type.
        </p>
        <p>
          <strong>Key Innovation:</strong> Dynamic facet display—laptop facets show
          "Screen Size", "Processor", while TV facets show "Resolution", "Smart
          Platform". Context-aware facets.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you compute facet counts efficiently?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use search engine aggregations (Elasticsearch terms
              aggregation, Solr facets). Run aggregations in filter context for caching.
              Limit facet count with size parameter. Use min_doc_count to hide empty
              values. For large result sets, use sampler aggregation to estimate counts.
              Cache facet results for common query + facet combinations with appropriate
              TTL.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle multi-select facets?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> OR logic within same facet (Brand: Nike OR Adidas),
              AND logic across facets (Brand: Nike AND Price: 50-100). Update facet
              counts after each selection to reflect remaining options. Disable or hide
              facet values that would result in 0 matches. Use filter aggregation to
              compute counts for each possible selection.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle zero-result scenarios?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Prevent by disabling facet values that would lead to
              0 results (gray out, show count as 0). If user reaches 0 results (via URL
              manipulation), show helpful message with suggestions: "No results for X.
              Try removing some filters or broadening your search." Show which filters
              are most restrictive. Provide "Clear all filters" button.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize facet performance for large catalogs?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use sampling for 1M+ result sets—estimate counts from
              subset of documents. Cache facet results for popular queries. Pre-compute
              facet counts during indexing for static attributes. Use filter context
              for caching. Limit number of facet fields computed. Consider async facet
              loading—show results first, facets load shortly after.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle hierarchical facets?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use nested aggregations in Elasticsearch. Store
              hierarchy as path (electronics/computers/laptops). Show parent categories
              with counts including children. Expand on user click to show subcategories.
              Maintain selection state across levels—selecting parent selects all
              children (or provide option). Use tree UI component for navigation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you decide which facets to show?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Show facets with high variance (different values across
              results). Hide facets where all results have same value. Order by usage
              analytics (most-used facets first). Consider query intent—show relevant
              facets for query type. For "laptop", show specs; for "shirt", show size/
              color. A/B test facet ordering for conversion optimization.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Elasticsearch — Aggregations Documentation
            </a>
          </li>
          <li>
            <a
              href="https://lucidworks.com/post/faceted-search-best-practices/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lucidworks — Faceted Search Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/faceted-navigation/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Faceted Navigation Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://solr.apache.org/guide/faceting.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache Solr — Faceting Guide
            </a>
          </li>
          <li>
            <a
              href="https://www.algolia.com/doc/guides/managing-results/refine-results/faceting/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Algolia — Faceted Search Documentation
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
