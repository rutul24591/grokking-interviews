"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-elasticsearch-integration",
  title: "Elasticsearch Integration",
  description:
    "Deep dive into Elasticsearch Integration covering query DSL, frontend patterns, aggregation handling, and production-scale search implementation.",
  category: "frontend",
  subcategory: "search-filtering",
  slug: "elasticsearch-integration",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-01",
  tags: [
    "frontend",
    "elasticsearch",
    "search API",
    "query DSL",
    "aggregations",
    "faceted search",
  ],
  relatedTopics: [
    "client-side-search-implementation",
    "faceted-search",
    "search-suggestions-autocomplete",
  ],
};

export default function ElasticsearchIntegrationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Elasticsearch</strong> is a distributed search and analytics
          engine based on Lucene. It provides full-text search, structured
          search, aggregations, and analytics capabilities. For frontend
          engineers, Elasticsearch integration means building UIs that query
          Elasticsearch APIs, handle search responses, and provide rich search
          experiences (facets, filters, highlighting, suggestions).
        </p>
        <p>
          Elasticsearch is widely used for e-commerce search (Amazon, eBay),
          log analysis (ELK stack), documentation search (GitHub docs), and
          enterprise search (internal knowledge bases). It handles large-scale
          search (millions of documents) with sub-100ms latency, making it
          suitable for user-facing search where speed is critical.
        </p>
        <p>
          Frontend integration involves several components. <strong>Query
          construction</strong> — building Elasticsearch Query DSL from user
          input and filters. <strong>Response handling</strong> — parsing search
          hits, aggregations, and metadata. <strong>State management</strong>{" "}
          — tracking query, filters, pagination, and sort state. <strong>UI
          components</strong> — search box, filters, facets, results list,
          pagination.
        </p>
        <p>
          For staff-level engineers, Elasticsearch integration involves
          architectural decisions about query construction (client builds
          queries vs backend API), caching strategies (client cache vs CDN vs
          Elasticsearch cache), and error handling (timeouts, cluster
          unavailability). The implementation must balance flexibility (complex
          queries) with performance (latency, bandwidth).
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Query DSL:</strong> Elasticsearch&apos;s JSON-based query
            language. Key query types: <strong>match</strong> (full-text search
            with analysis), <strong>term</strong> (exact match for keywords),
            <strong>range</strong> (numeric/date ranges), <strong>bool</strong>{" "}
            (combine queries with must/should/must_not),{" "}
            <strong>multi_match</strong> (search across multiple fields).
            Frontend constructs or parameterizes these queries.
          </li>
          <li>
            <strong>Aggregations:</strong> Compute metrics over search results.
            <strong>Terms aggregation</strong> — count by field value (for
            facets). <strong>Range aggregation</strong> — count by range (for
            price histograms). <strong>Metrics aggregations</strong> — min, max,
            avg, sum. Aggregations power faceted search and analytics
            dashboards.
          </li>
          <li>
            <strong>Highlighting:</strong> Show matching portions of documents.
            Elasticsearch returns highlighted snippets with matched terms
            wrapped in &lt;em&gt; tags. Frontend renders these snippets to show
            why documents matched. Configure fragment size, number of fragments,
            and pre/post tags.
          </li>
          <li>
            <strong>Suggesters:</strong> Provide query suggestions and
            completions. <strong>Term suggester</strong> — correct spelling
            (&quot;Did you mean...&quot;). <strong>Phrase suggester</strong> —
            suggest complete phrases. <strong>Completion suggester</strong> —
            fast autocomplete (uses special index structure). Frontend displays
            suggestions in dropdown.
          </li>
          <li>
            <strong>Pagination:</strong> Elasticsearch supports from/size
            (offset/limit) for shallow pagination, and search_after for deep
            pagination. For frontend: show page numbers or &quot;load more&quot;
            button. Track total hits for &quot;X of Y results&quot; display.
          </li>
          <li>
            <strong>Sorting:</strong> Sort by relevance (_score), field values,
            or custom scripts. Frontend provides sort dropdown (Relevance,
            Price: Low-High, Date: New-Old). Translate UI sort to Elasticsearch
            sort parameter.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/search-filtering/elasticsearch-integration/elasticsearch-query-flow.svg"
          alt="Elasticsearch Query Flow showing frontend query construction, API request, and response handling"
          caption="Query flow — frontend constructs Query DSL from user input, sends to Elasticsearch API, receives hits and aggregations, renders results and facets"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Elasticsearch integration architecture consists of a query builder that
          constructs Query DSL from UI state, an API client that handles HTTP
          requests, a response parser that extracts hits and aggregations, and
          UI components that display results and filters.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/search-filtering/elasticsearch-integration/frontend-architecture.svg"
          alt="Frontend Architecture showing query builder, API client, response parser, and UI components"
          caption="Frontend architecture — query builder constructs DSL from filters, API client handles HTTP with caching, response parser extracts data, UI renders results"
          width={900}
          height={550}
        />

        <h3>Query Construction Patterns</h3>
        <p>
          Two patterns exist for constructing queries. <strong>Client-side
          construction</strong> — frontend builds full Query DSL. Provides
          flexibility but exposes query logic to users. <strong>Backend
          API</strong> — frontend sends parameters (query, filters, sort),
          backend builds Query DSL. Hides query logic, adds validation, can
          optimize queries. Most production systems use backend API.
        </p>
        <p>
          For backend API, design RESTful endpoints: <code>POST
          /api/search</code> with body containing query parameters. Or use
          GraphQL for flexible queries. Avoid exposing Elasticsearch directly to
          frontend — adds security risk and couples frontend to Elasticsearch
          schema.
        </p>
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Elasticsearch integration involves trade-offs between flexibility,
          security, and performance.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/search-filtering/elasticsearch-integration/query-construction-patterns.svg"
          alt="Query Construction Patterns comparing client-side DSL construction vs backend API parameterization"
          caption="Query patterns — client-side (flexible but exposes logic), backend API (secure, validated, optimized); most systems use backend API"
          width={900}
          height={500}
        />

        <p className="mt-4">
          The query construction patterns diagram compares two approaches.
          Client-side DSL construction offers flexibility but exposes query
          structure to users. Backend API parameterization hides query logic,
          adds validation, and enables query optimization. For production
          systems, always use backend API to prevent query injection attacks.
        </p>

        <h3>Direct vs Proxy Access</h3>
        <p>
          <strong>Direct access</strong> — frontend queries Elasticsearch
          directly. Advantages: simpler architecture, no backend needed.
          Limitations: exposes Elasticsearch to internet, requires CORS
          configuration, authentication challenges, couples frontend to
          Elasticsearch schema.
        </p>
        <p>
          <strong>Proxy access</strong> — frontend queries backend API, backend
          queries Elasticsearch. Advantages: hides Elasticsearch, adds
          authentication/authorization, can cache/optimize queries, decouples
          frontend from Elasticsearch. Limitations: more complex, adds latency.
        </p>
        <p>
          <strong>Recommendation:</strong> Always use proxy access for
          production. Direct access is only acceptable for internal tools with
          trusted users.
        </p>

        <h3>Query Caching</h3>
        <p>
          <strong>Client cache</strong> — cache responses in browser
          (localStorage, memory). Advantages: instant for repeated queries,
          works offline. Limitations: per-user cache, stale data.
        </p>
        <p>
          <strong>CDN cache</strong> — cache at CDN level (CloudFront,
          Fastly). Advantages: fast globally, reduces Elasticsearch load.
          Limitations: cache invalidation complexity, not suitable for
          personalized queries.
        </p>
        <p>
          <strong>Elasticsearch cache</strong> — Elasticsearch&apos;s internal
          query cache. Advantages: automatic, no frontend changes. Limitations:
          cache is per-node, limited size.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Backend API:</strong> Never expose Elasticsearch
            directly to frontend. Build backend API that validates input,
            constructs queries, and handles authentication. This prevents query
            injection attacks and schema exposure.
          </li>
          <li>
            <strong>Implement Query Timeout:</strong> Set timeout on Elasticsearch
            queries (3-5 seconds). Handle timeout gracefully — show partial
            results or error message. Don&apos;t let slow queries hang UI
            indefinitely.
          </li>
          <li>
            <strong>Cache Common Queries:</strong> Cache popular queries at CDN
            or backend level. Use cache key based on query parameters. Invalidate
            cache when data changes (or use TTL-based expiration).
          </li>
          <li>
            <strong>Handle Aggregation Limits:</strong> Elasticsearch limits
            aggregation bucket count (default 1000). For facets with many values,
            use composite aggregation or paginate aggregation results. Don&apos;t
            request more buckets than you&apos;ll display.
          </li>
          <li>
            <strong>Use Source Filtering:</strong> Don&apos;t return entire
            documents — use <code>_source</code> filtering to return only needed
            fields. Reduces bandwidth and improves response time.
          </li>
          <li>
            <strong>Implement Search Analytics:</strong> Track what users
            search, what they click, and when they get zero results. Use this
            data to improve search relevance and identify content gaps.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Exposing Elasticsearch Directly:</strong> This is a security
            risk — users can craft malicious queries, access unauthorized data,
            or overload the cluster. Always use backend API with authentication.
          </li>
          <li>
            <strong>Not Handling Zero Results:</strong> When search returns
            zero results, don&apos;t just show &quot;no results&quot;. Suggest
            alternatives: broaden filters, check spelling, show popular items.
            Help users recover.
          </li>
          <li>
            <strong>Ignoring Highlighting:</strong> Without highlighting, users
            don&apos;t understand why results matched. Always request and
            display highlighted snippets for full-text search.
          </li>
          <li>
            <strong>Deep Pagination:</strong> Using from/size for deep
            pagination (page 1000+) is slow — Elasticsearch must collect and
            sort all preceding results. Use search_after for deep pagination or
            limit to first 100 pages.
          </li>
          <li>
            <strong>Not Handling Errors:</strong> Elasticsearch can return
            errors (timeout, cluster unavailable, query malformed). Handle
            gracefully — show error message, suggest retry, log for debugging.
          </li>
          <li>
            <strong>Requesting Too Much Data:</strong> Don&apos;t request all
            fields, all aggregations, and all highlights in one query. Be
            selective — request only what UI needs. Large responses slow down
            rendering.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Product Search</h3>
        <p>
          E-commerce sites use Elasticsearch for product search with faceted
          filtering (brand, price, category, rating). Queries combine full-text
          search (product name, description) with filters (in stock, price
          range). Aggregations power facet counts. Highlighting shows matching
          terms in product descriptions.
        </p>

        <h3>Documentation Search</h3>
        <p>
          Documentation sites (GitHub, GitLab) use Elasticsearch for searching
          docs. Queries search title and content with boosting (title matches
          rank higher). Highlighting shows matching sections. Suggesters provide
          &quot;Did you mean&quot; for typos.
        </p>

        <h3>Log Analysis Dashboard</h3>
        <p>
          ELK stack (Elasticsearch, Logstash, Kibana) uses Elasticsearch for log
          search and analysis. Frontend (Kibana) builds complex queries with
          time ranges, filters, and aggregations. Visualizations (histograms,
          pie charts) powered by aggregation results.
        </p>

        <h3>Enterprise Search</h3>
        <p>
          Enterprise search (internal knowledge base, employee directory) uses
          Elasticsearch to search across multiple content types (documents,
          emails, profiles). Queries combine full-text search with access control
          filters (user can only see documents they have permission to view).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you construct Elasticsearch queries from frontend
              filters?
            </p>
            <p className="mt-2 text-sm">
              A: Map UI filters to Elasticsearch query types. Search box →
              multi_match query. Category filter → term query. Price range →
              range query. Brand filter (multi-select) → terms query. Combine
              with bool query (must for required filters, filter for
              non-scoring filters). Sort → sort parameter. Pagination →
              from/size or search_after.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle faceted search with Elasticsearch?
            </p>
            <p className="mt-2 text-sm">
              A: Use aggregations for facets. Terms aggregation for categorical
              facets (brand, category). Range aggregation for numeric facets
              (price). Date histogram for date facets. Request aggregations in
              same query as search. Response includes hits and aggregations.
              Frontend renders facet counts from aggregation buckets. When user
              selects facet value, add filter to query and re-execute.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement search-as-you-type with Elasticsearch?
            </p>
            <p className="mt-2 text-sm">
              A: Use completion suggester or edge n-gram tokenizer. Completion
              suggester is fastest — uses special index structure, O(1) lookup.
              Edge n-gram creates tokens for prefixes (&quot;react&quot; → &quot;r&quot;,
              &quot;re&quot;, &quot;rea&quot;, &quot;reac&quot;, &quot;react&quot;).
              Frontend: debounce input (200ms), call suggest API, display
              suggestions. Cache suggestions to reduce API calls.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle authentication with Elasticsearch?
            </p>
            <p className="mt-2 text-sm">
              A: Never put Elasticsearch credentials in frontend. Use backend
              API with authentication. Backend authenticates user, adds
              authorization filters to query (user can only see documents they
              have access to). For multi-tenant setups, add tenant filter to all
              queries. Use Elasticsearch roles and document-level security for
              fine-grained access control.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you optimize Elasticsearch queries for frontend
              performance?
            </p>
            <p className="mt-2 text-sm">
              A: Several strategies: (1) Use filter context for non-scoring
              queries (faster, cacheable). (2) Use source filtering to return
              only needed fields. (3) Limit aggregation bucket count. (4) Use
              search_after for deep pagination instead of from/size. (5) Cache
              common queries at CDN or backend. (6) Use routing to direct
              queries to specific shards (for multi-tenant setups). (7) Profile
              slow queries with Elasticsearch profile API.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle zero-result searches?
            </p>
            <p className="mt-2 text-sm">
              A: When search returns zero hits: (1) Show clear &quot;no results&quot;
              message. (2) Suggest alternatives — &quot;Did you mean...&quot;
              using suggester API. (3) Suggest broadening filters — &quot;Try
              removing the Brand filter&quot;. (4) Show popular items as
              fallback. (5) Log zero-result queries to identify content gaps.
              The goal is to help users find something, not leave them stuck.
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
              href="https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Elasticsearch Official Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Elasticsearch Query DSL Reference
            </a>
          </li>
          <li>
            <a
              href="https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Elasticsearch Aggregations Reference
            </a>
          </li>
          <li>
            <a
              href="https://github.com/elastic/elasticsearch-js"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Elasticsearch JavaScript Client
            </a>
          </li>
          <li>
            <a
              href="https://www.elastic.co/blog/practical-polyglot-persistence-with-elasticsearch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Elasticsearch Blog - Practical Polyglot Persistence
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
