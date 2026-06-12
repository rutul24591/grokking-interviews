"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-search-ui-autocomplete-filters-facets",
  title: "Design a Search UI with Autocomplete, Filters, and Facets",
  description:
    "Full-stack search UI architecture: autocomplete with debouncing, Elasticsearch-backed faceted filtering, URL state management, relevance tuning, and performance at scale.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "search-ui-with-autocomplete-filters-and-facets",
  wordCount: 6200,
  readingTime: 38,
  lastUpdated: "2026-05-20",
  tags: ["hld", "search", "autocomplete", "facets", "elasticsearch", "url-state"],
  relatedTopics: ["rate-limited-autocomplete", "audit-log-viewer-ui"],
};

export default function SearchUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Search UI with Autocomplete, Filters, and Facets around product-critical path, data ownership, user trust, latency SLOs, and safe degradation. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          A search UI with autocomplete, filters, and facets lets users express intent, refine large result sets, and
          understand what is available. It appears in commerce, documents, media libraries, marketplaces, observability
          products, admin tools, and knowledge bases. The frontend is not just an input box; it is a stateful query
          builder connected to relevance ranking, aggregation counts, URL state, analytics, and accessibility.
        </HighlightBlock>
        <p>
          Assume a catalog of 10 to 100 million items, a primary search backend such as Elasticsearch or OpenSearch, a
          separate low-latency suggestion path, server-side faceting, typo tolerance, cursor pagination, and search
          state encoded in the URL. Autocomplete should feel instant, submitted search should return the first page and
          facet counts within hundreds of milliseconds, and every filter change should preserve shareable state.
        </p>
        <p>
          In senior and principal interviews, the main distinction is between search UX and search serving. Strong
          answers discuss request cancellation, debouncing, stale response protection, query construction, facet count
          semantics, relevance boosting, zero-result recovery, pagination, observability, and URL-driven state.
        </p>
        <p>
          Principal-level answers should also treat search as a feedback system. Query logs, no-result queries,
          reformulations, facet usage, impressions, clicks, conversion, and abandonment all feed relevance tuning. The
          UI should capture these events with request ids and ranking context so search teams can diagnose whether
          failures came from matching, ranking, inventory, filters, latency, or presentation.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: the user must see a consistent product state even when derived artifacts, personalization, search, upload, or collaboration subsystems lag behind.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Search UI with Autocomplete, Filters, and Facets, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Two Query Paths</h3>
        <p>
          Autocomplete and submitted search should be separate paths. Autocomplete handles partial input and returns a
          small suggestion list from a prefix index, popularity table, or search suggest API. Submitted search executes
          the full query with filters, sorts, aggregations, pagination, and relevance logic. Combining both paths into
          one heavy search request per keystroke creates avoidable latency and backend load.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Facets and Filters</h3>
        <p>
          Filters constrain results; facets explain available refinements and counts. A selected brand filter should
          filter the result list, but the brand facet itself may need counts that let the user switch to another brand.
          This creates subtle query-construction requirements: per-facet count context can differ from the final result
          context.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">URL as Search State</h3>
        <p>
          Query text, selected filters, sort, page cursor, and view mode should be encoded in the URL. This makes search
          bookmarkable, shareable, restorable on reload, and compatible with browser back/forward. The URL should be a
          canonical representation, not a lossy copy of local component state.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Relevance and Recovery</h3>
        <p>
          Search relevance combines text matching, field boosts, freshness, popularity, personalization, inventory,
          quality, and business rules. When results are empty or poor, the system should attempt typo tolerance,
          synonyms, relaxed filters, related queries, or category suggestions while clearly explaining what changed.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: API shape, read/write model, async workflow, permission boundary, cache policy, realtime update strategy, and rollback behavior.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/search-ui-with-autocomplete-filters-and-facets-architecture.svg"
          alt="Search UI architecture with separate autocomplete and submitted search paths, URL state, facet panel, search API, suggestion API, Elasticsearch, Redis prefix index, result list, and pagination"
          caption="Architecture: autocomplete stays lightweight, submitted search builds full relevance and facet queries, and URL state drives the UI."
        />
        <p>
          The client owns query composition and state transitions. The search box emits debounced autocomplete requests
          for partial text. Selecting a suggestion or pressing Enter updates the URL and triggers the submitted search
          path. Filter changes, sort changes, and pagination also update the URL first, then fetch results for the new
          canonical state.
        </p>
        <p>
          The Suggest API reads from a precomputed suggestion corpus built from search logs, item names, categories,
          synonyms, and editorial boosts. The Search API translates URL state into a backend query: full-text matching
          across fields, filter clauses for attributes, range filters, sort rules, aggregation requests for facets, and
          pagination cursor or search-after values.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/search-ui-with-autocomplete-filters-and-facets-workflow.svg"
          alt="Search workflow showing keystroke debounce, request cancellation, suggestion selection, URL update, search API request, results and facets response, and analytics logging"
          caption="Workflow: debounce partial input, cancel stale autocomplete requests, update URL for committed state, fetch results and facets together, and log impressions."
        />
        <p>
          The response should return results, facets, total estimate, cursor, applied filters, warnings, spelling
          correction, relaxation details, and request identifiers. The client renders filter chips, facet counts, result
          cards, loading states, and no-results recovery. Analytics logs impressions and interactions with the query
          version so relevance teams can tune ranking and suggestion quality.
        </p>
        <p>
          Stale response protection is mandatory. If the user types quickly or changes filters while prior requests are
          in flight, the UI should cancel old requests when possible and ignore late responses whose request id no
          longer matches the canonical URL state. Otherwise older search results can overwrite newer state and create
          confusing or incorrect facets.
        </p>
        <p>
          Permission and availability filtering should happen before snippets, counts, and suggestions leave the
          backend. In enterprise search, even a facet count can reveal that a confidential document exists. In commerce,
          availability, region, seller eligibility, and compliance restrictions may remove results that match text
          relevance. The UI should not display a result, suggestion, or count unless the current viewer is allowed to
          know it exists.
        </p>
        <p>
          Index freshness needs a product contract. New documents, deleted listings, changed prices, and permission
          revocations have different freshness requirements. A stale product description is annoying; a deleted
          private document appearing in search is a security incident. The search API should expose freshness warnings
          or fallback behavior when the index is behind for critical mutation types.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/search-ui-with-autocomplete-filters-and-facets-performance.svg"
          alt="Search performance trade-offs showing Redis autocomplete, Elasticsearch filter cache, post filter, function score, request cancellation, URL state, and facet aggregation"
          caption="Performance trade-offs: prefix suggestions, filter-context caching, facet aggregation semantics, stale request handling, and relevance boosts."
        />
        <p>
          Client-side filtering feels instant for small datasets, but it is incorrect for large catalogs because the
          client only has a page or subset of results. Server-side filtering is required for correct result sets,
          accurate counts, ranking, pagination, and policy filtering. The frontend can optimistically update selected
          chips, but the authoritative results and facets must come from the server.
        </p>
        <p>
          Elasticsearch/OpenSearch gives deep control over mappings, analyzers, relevance, aggregations, and cost, but
          requires tuning. Managed search services can offer excellent defaults for autocomplete and facets with less
          operational burden, but cost and custom ranking constraints can become limiting at high query volume.
        </p>
        <p>
          Exact facet counts can be expensive at very large scale. Approximate counts are often acceptable for product
          discovery but not for compliance or financial reporting. Interview answers should state whether counts are
          exact, approximate, cached, or sampled, and what the UI promises to users.
        </p>
        <p>
          Personalization improves relevance, but it can make search feel inconsistent and harder to debug. The design
          should preserve a clear base relevance layer, log personalization features, and provide explainable ranking
          signals for internal debugging. For regulated or enterprise search, personalization may need to be disabled or
          constrained by policy.
        </p>
        <p>
          Immediate filter application improves discovery speed, but every filter click can trigger a backend query.
          Debounce noisy controls such as sliders, batch rapid changes where appropriate, and cancel stale requests.
          Do not delay simple checkbox filters behind an Apply button unless the domain has very expensive queries.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Principal-level decision frame</h3>
        <p>
          The central decision is which parts of search must be exact and which can be approximate. Product discovery
          can often tolerate approximate total counts, sampled facets, and relaxed spell correction. Legal discovery,
          audit search, and permissioned document search may require exact filtering, strict authorization before
          snippets, and no leakage through facet counts. A principal answer should state the product's correctness
          contract before choosing Elasticsearch-style approximations or managed search shortcuts.
        </p>
        <p>
          Relevance work should be treated as an operating loop, not a one-time query design. Query logs, no-result
          rates, click position, refinements, filter removals, conversion, and manual judgments feed relevance tuning.
          The UI and API should preserve request identifiers, query rewrites, relaxation decisions, and experiment
          versions so relevance regressions can be explained. Without that observability, search quality becomes a
          collection of subjective complaints instead of a debuggable system.
        </p>
        <p>
          Query personalization has a privacy trade-off. Personalization can improve ranking by using role, locale,
          prior clicks, purchase history, or team context, but it can also make results hard to explain and create
          filter bubbles. A principal design provides a base ranking path, logs personalization features for debugging,
          supports opt-out or policy-off modes, and avoids using sensitive attributes unless the product has a clear
          reason and governance model.
        </p>
      </section>

      <section>
        <h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: activation, completion rate, p95 interaction latency, stale-state duration, conversion lag, error rate, and rollback success.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>
        <p>
          Treat URL parsing and serialization as a typed boundary. Multi-value filters, numeric ranges, sort, cursor,
          and query text should round-trip consistently. Invalid URL parameters should be visible or safely ignored
          according to product semantics, not silently corrupt state.
        </p>
        <p>
          Use debouncing, request cancellation, and response versioning for autocomplete. A slow response for an older
          prefix must not overwrite suggestions for a newer prefix. Cache recent prefixes locally for short periods and
          rate-limit abusive or automated typing patterns.
        </p>
        <p>
          Return results and facet counts in one response where possible. Splitting them into separate requests can
          create inconsistent UI states and double latency. If the system must split them, include shared query version
          identifiers so the frontend can reject mismatched data.
        </p>
        <p>
          Invest in zero-result recovery. Try spelling correction, synonyms, relaxing the last filter, related searches,
          and popular items from the inferred category. Explain the recovery path so users understand whether they are
          seeing exact results or relaxed alternatives.
        </p>
        <p>
          Instrument search carefully: query latency, suggestion latency, abandonment, no-result rate, zero-result
          recovery usage, facet click-through, filter removal, result click position, conversion, backend timeout, and
          stale response rejection.
        </p>
        <p>
          Treat relevance configuration as versioned production data. Analyzer changes, synonym updates, field boosts,
          personalization weights, and relaxation rules should be rolled out with shadow evaluation or limited cohorts.
          A bad synonym file or boost rule can silently degrade millions of queries, so the system should support
          rollback, query replay, and segment-level monitoring before broad release.
        </p>
        <p>
          Make search explainable for internal operators. The user-facing UI can stay simple, but support and relevance
          teams need a diagnostic view showing parsed query, applied filters, spelling correction, synonym expansion,
          ranking features, permission filters, backend shard timing, and cache status. This shortens the path from
          "search is bad" to a concrete fix.
        </p>
        <p>
          Search relevance needs a controlled experimentation loop. Query suggestions, ranking features, facet ordering, typo correction, and personalization all affect user trust. The system should support offline evaluation sets, online A/B tests, guardrail metrics, and rollback for ranking changes. Principal-level answers should explain how a bad ranking model or synonym expansion is detected before it silently degrades revenue, safety, or support workflows.
        </p>
        <p>
          Permission filtering must happen before counts, snippets, and suggestions are exposed. A result item is not the only leakage path; autocomplete can reveal private names, facet counts can reveal hidden records, and snippets can expose fields the user cannot open. The query layer should apply authorization to every search-derived surface, and cache keys must include effective permission scope.
        </p>
        <p>
          Index freshness should be part of the product contract. Newly created documents, removed products, permission changes, and inventory updates may not appear instantly in every shard or suggestion index. The UI and diagnostics should distinguish indexing lag from no-result behavior, and critical permission revocations should have a faster invalidation path than ordinary relevance updates.
        </p>
        <p>
          Facet semantics should be documented and consistent. Counts can represent the current filtered result, the result set with that facet removed, or the global corpus. Each choice is valid for different products, but mixing them across facets makes the UI impossible to reason about and undermines user trust.
        </p>
        <p>
          Search analytics should respect privacy. Raw queries can contain names, secrets, account ids, or health and financial information. The system should redact, aggregate, and retain query logs according to data classification while still preserving enough signal for relevance tuning.
        </p>
        <p>
          Operational dashboards should track query latency, zero-result rate, click success, reformulation rate, index lag, and permission-filter drop rate by segment.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: partial data, stale projections, duplicate writes, permission drift, missing audit trail, and UI states that hide backend uncertainty.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>
        <p>
          A common mistake is firing a full search request on every keystroke. This increases backend load, creates
          flickering UI, and returns expensive results users never inspect. Partial input should use the lightweight
          suggestion path.
        </p>
        <p>
          Another pitfall is letting local state diverge from the URL. Back button, reload, shared links, and analytics
          become unreliable. The URL should be the committed state, while local state can hold transient typing and
          loading details.
        </p>
        <p>
          Facet counts are often implemented incorrectly. Counts should match clear semantics: current result set,
          result set excluding the facet's own filter, or global corpus. Ambiguous counts confuse users and make
          debugging difficult.
        </p>
        <p>
          Ignoring stale autocomplete responses creates a poor experience: suggestions for an older prefix can appear
          after the user has typed more characters. Use cancellation and monotonic request identifiers.
        </p>
        <p>
          Finally, no-result pages should not dead-end. They should preserve the query, show active filters, provide
          recovery suggestions, and make it easy to remove the most restrictive filter.
        </p>
        <p>
          A deeper pitfall is leaking restricted information through search metadata. Even if result documents are
          permission-filtered, facet counts, autocomplete suggestions, spelling corrections, and snippets can reveal
          the existence of private records. Permissioned search must filter all derived metadata, not only the final
          result list.
        </p>
        <p>
          Teams often optimize only for head queries and ignore tail behavior. A large product has misspellings, legacy names, SKU aliases, error codes, acronyms, and language-specific terms. Without query analytics, zero-result tracking, synonym governance, and curated redirects, the search UI feels impressive in demos but fails real users who are trying to recover from old terminology or incomplete memory.
        </p>
        <p>
          Another pitfall is letting personalization make search unexplainable. Personalized ranking can improve click-through, but it can also hide canonical results, create unfair exposure, and make support reproduction difficult. A mature design offers debuggable ranking reasons, tenant-level controls, and fallback neutral ranking for regulated or enterprise search.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>
        <p>
          E-commerce search uses autocomplete, facets, inventory-aware ranking, price ranges, promotions, and
          conversion analytics. Facet correctness and relevance directly affect revenue.
        </p>
        <p>
          Document and knowledge-base search prioritizes permissions, freshness, exact title matches, snippets,
          synonym expansion, and source filters. Results must not leak counts for documents the user cannot access.
        </p>
        <p>
          Observability and admin search often filter logs, traces, users, audits, or transactions. These domains need
          precise URL state, time ranges, saved views, and exactness around security and compliance filters.
        </p>
        <p>
          Marketplace and travel search combine text, geo, availability, price, ratings, personalization, sponsored
          placements, and dynamic inventory, so ranking and filtering must account for rapidly changing supply.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Why separate autocomplete from submitted search?
        </h3>
        <p>
          Autocomplete is latency-sensitive and works on partial input, so it should use a small suggestion corpus and
          return a few options quickly. Submitted search needs full relevance, filters, aggregations, pagination, and
          analytics. Combining them makes every keystroke an expensive full search and creates avoidable backend load.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How should facet counts work when a facet is already selected?
        </h3>
        <p>
          The semantics must be explicit. Usually other facets reflect the currently filtered result set, while the
          selected facet group may show counts excluding its own filter so the user can switch values. The backend can
          compute this with per-facet aggregation contexts rather than one naive aggregation over the final result set.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you make search state shareable and back-button friendly?
        </h3>
        <p>
          Encode committed state in the URL: query, filters, ranges, sort, cursor, and view options. Parse the URL on
          mount, update it on committed changes, and use browser history intentionally. Keep transient input state
          separate so typing in the box does not commit a search until the user submits or selects a suggestion.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you prevent stale autocomplete results?
        </h3>
        <p>
          Debounce keystrokes, cancel in-flight requests when the prefix changes, and attach a monotonic request
          version to responses. The UI should only render suggestions for the latest known prefix. Short-lived prefix
          caching can improve responsiveness without sacrificing correctness.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          What should happen when a search returns no results?
        </h3>
        <p>
          Preserve the user's query and filters, then offer structured recovery: remove or relax the most recent
          filter, apply spelling correction, expand synonyms, suggest related queries, or show popular items from the
          inferred category. The UI should explain whether displayed alternatives are exact or relaxed.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you tune relevance?
        </h3>
        <p>
          Start with field boosts and analyzers, then add business and behavioral signals such as exact title match,
          popularity, freshness, stock status, ratings, personalization, and click-through from previous searches.
          Evaluate with offline judgments and online experiments, while watching no-result rate, conversion, latency,
          and long-tail quality.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html" target="_blank" rel="noreferrer">
              Elasticsearch: Boolean query
            </a>
            , combining query and filter clauses.
          </li>
          <li>
            <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html" target="_blank" rel="noreferrer">
              Elasticsearch: Aggregations
            </a>
            , facet and count computation.
          </li>
          <li>
            <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html" target="_blank" rel="noreferrer">
              Elasticsearch: Function score query
            </a>
            , relevance boosting with business and behavioral signals.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams" target="_blank" rel="noreferrer">
              MDN: URLSearchParams
            </a>
            , URL query state parsing and serialization.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">
              MDN: AbortController
            </a>
            , canceling stale autocomplete and search requests.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
