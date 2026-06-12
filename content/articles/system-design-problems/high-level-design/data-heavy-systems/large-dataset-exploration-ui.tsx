"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-large-dataset-exploration-ui",
  title: "Design a Large Dataset Exploration UI (Millions of Rows)",
  description:
    "Principal-level design of a large dataset exploration UI with two-dimensional virtualization, keyset pagination, predicate pushdown, profiling, grouping, export jobs, query governance, and production-scale operability.",
  category: "high-level-design",
  subcategory: "data-heavy-systems",
  slug: "large-dataset-exploration-ui",
  wordCount: 5700,
  readingTime: 33,
  lastUpdated: "2026-05-22",
  tags: ["hld", "data-exploration", "virtual-grid", "pagination", "filter-builder", "predicate-pushdown", "keyset-cursor"],
  relatedTopics: ["bi-dashboard", "time-series-visualization"],
};

export default function LargeDatasetExplorationUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Large Dataset Exploration UI (Millions of Rows) around system boundary, state ownership, failure handling, scalability, security, and observable recovery. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock>
        <p>
          A large dataset exploration UI lets analysts, data scientists, support engineers, finance teams, and operations teams inspect tabular datasets containing millions or billions of rows without downloading the dataset into the browser. The interface usually looks like a spreadsheet or database grid, but the system underneath must behave like a distributed query product: every filter, sort, aggregation, profile, and export has to be pushed to a server-side execution layer.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The principal-level constraint is simple: the browser is a viewport, not the compute engine. The frontend should render only the visible window of data, the API should enforce tenant and query governance, and the database or warehouse should perform filtering, sorting, grouping, profiling, and export scans.
        </HighlightBlock>
        <p>
          This design appears in data catalogs, internal admin tools, fraud investigation systems, logistics operations platforms, observability products, CRM exports, marketplace analytics, and machine-learning dataset inspection tools. Users expect spreadsheet-like interaction, but spreadsheet assumptions break at this scale. A page cannot fetch all rows, a browser cannot render all cells, and a server cannot run unbounded COUNT, GROUP BY, or export queries on every click.
        </p>
        <p>
          The product has to balance analyst freedom with platform safety. Analysts need fast sorting, filtering, column profiling, grouping, row details, and exports. The platform needs query limits, partition pruning, permission enforcement, cache reuse, export quotas, cost visibility, and graceful degradation when the query engine is slow or overloaded.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: the design must preserve correctness under latency, concurrency, partial failure, and changing permissions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Large Dataset Exploration UI (Millions of Rows), the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>
        <p>
          Two-dimensional virtualization is the core rendering technique. The grid renders only the rows and columns visible in the viewport plus a small overscan buffer. A table with ten million rows and five hundred columns should still keep only a few hundred visible cells in the DOM. Vertical virtualization controls row count. Horizontal virtualization controls column count. Pinned columns, variable row heights, expanded row detail, and keyboard navigation make the implementation significantly harder than a simple virtual list.
        </p>
        <p>
          Server-side pagination should use keyset cursors for normal forward and backward navigation. Offset pagination becomes slower as the user moves deeper into the dataset because the database must scan and discard earlier rows. A keyset cursor uses the last row&apos;s sort-key values and a deterministic tie-breaker, allowing the query engine to seek into an indexed order. Offset may still be used for a one-time approximate jump, but the system should switch back to keyset pagination afterward.
        </p>
        <HighlightBlock as="p" tier="important">
          Filters should be represented as a typed predicate tree, not as raw SQL. The client builds a logical tree of fields, operators, values, and AND/OR groups. The server validates the tree against dataset metadata, tenant permissions, field types, allowed operators, and query limits before translating it into parameterized SQL or a warehouse-specific query plan.
        </HighlightBlock>
        <p>
          Column profiling provides statistical context without scanning everything on every interaction. Numeric columns need min, max, mean, median, percentile, null rate, and histogram. Categorical columns need cardinality, top values, null rate, and rare-value hints. Date columns need min, max, gaps, and time distribution. These profiles should be cached by dataset version, column, filter hash, and tenant context because repeated profiling queries are expensive.
        </p>
        <p>
          Row grouping turns the grid into a lightweight aggregate exploration tool. Group headers show counts and aggregates, while expanding a group fetches a filtered row window for that group. This is not the same as loading all grouped rows. The system should issue aggregate queries for group summaries and separate keyset-paginated queries for expanded groups.
        </p>
        <p>
          Export is a backend job system, not a frontend download loop. Small exports can stream directly to the browser. Large exports should become asynchronous jobs that run under quotas, stream results to object storage, expose progress, and notify users when a signed download link is ready. This prevents a browser tab from becoming the critical path for a multi-million-row scan.
        </p>
        <p>
          Principal-level designs also include cost and blast-radius controls. Exploratory users can accidentally run expensive scans by combining wide time ranges, high-cardinality grouping, and unindexed filters. The UI should surface estimated scanned bytes, partition pruning hints, query queue state, and whether a saved view is using a cache. Administrators should be able to set per-tenant and per-dataset budgets so one analyst cannot degrade the shared warehouse.
        </p>
        <p>
          Data classification belongs in the grid. Columns can contain public, internal, confidential, or regulated values. The system should use metadata to decide which fields can be shown, copied, profiled, exported, or used in filters. A viewer may be allowed to see aggregated counts but not raw identifiers. Those distinctions must be enforced in the query API and reflected in the UI.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: state model, API contracts, cache policy, async workflow, authorization, rollout, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        <p>
          The architecture has five planes. The interaction plane contains the virtual grid, filter builder, column state, keyboard model, and profile panels. The query API plane validates user intent and translates it into safe server-side queries. The execution plane runs SQL or warehouse queries with tenant isolation and cost controls. The metadata plane stores schemas, field types, indexes, partitions, statistics, permissions, and cached profiles. The job plane handles long-running exports and heavy profiling work.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/large-dataset-exploration-ui.svg"
          alt="Large dataset exploration UI architecture with virtual grid, keyset pagination, filter predicate builder, column profiling, export jobs, and row grouping."
          caption="The UI is a bounded viewport into server-side compute: virtualization controls DOM size, keyset pagination controls page retrieval, and predicate pushdown keeps filtering in the query engine."
        />
        <p>
          On first open, the page loads dataset metadata, visible column definitions, user column preferences, saved filters, and the first page of rows. The grid computes visible row and column ranges, renders cells for that range, and starts background prefetch for nearby pages. If the user scrolls, the virtualizer keeps scroll position stable while the data layer requests only missing pages. If the user changes sorting or filters, the row cache is invalidated and the first page for the new query state is fetched.
        </p>
        <p>
          The query request contains dataset id, selected columns, filter tree, sort keys, cursor, page size, grouping state, and requested profile actions. The API validates the dataset and fields, injects tenant and row-level-security predicates, estimates query cost where possible, and translates the request to the target engine. PostgreSQL, Snowflake, BigQuery, ClickHouse, DuckDB, and Elasticsearch-like backends have different capabilities, so the API should expose a stable product contract while using engine-specific adapters internally.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/large-dataset-exploration-query-flow.svg"
          alt="Query flow from grid state to predicate validation, tenant guard, query planner, execution engine, result cache, and virtualized rows."
          caption="Every user query passes through validation, tenant guards, cost controls, and engine-specific planning before returning a small result window to the grid."
        />
        <p>
          Column profiling should be lazy. Clicking a column opens a profile panel that first checks a cache keyed by dataset version, tenant, column, and filter hash. If no valid profile exists, the API starts an aggregation query. For fast profiles, the result can return inline. For expensive profiles, the UI should show pending state and poll or subscribe for completion. The profile panel should make sampling explicit when it cannot compute exact statistics within the budget.
        </p>
        <p>
          Saved views are the collaboration unit. A saved view should record filter tree, sort keys, visible columns, grouping, profile settings, dataset version, and owner. Sharing a saved view should not grant data access; it should only share query intent. When another user opens the view, the server re-evaluates their permissions and may hide columns, reduce rows, or reject the view if it exceeds their scope.
        </p>
        <p>
          Row detail views should remain governed queries. Clicking a row may need to fetch joined entities, raw JSON, audit history, or related events. That convenience can accidentally bypass column masking or row-level policy if implemented as a separate endpoint. The detail panel should reuse the same authorization and classification metadata as the grid, with extra audit when sensitive fields are expanded.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/large-dataset-exploration-export-flow.svg"
          alt="Export flow showing small direct stream, large asynchronous export job, query execution, object storage, progress events, signed URL, and quota enforcement."
          caption="Exports split into direct streaming for small results and governed asynchronous jobs for large scans, with quotas, progress, storage, and signed delivery links."
        />
        <p>
          Principal-level dataset exploration needs a query planner between the UI and storage. The planner should understand selected columns, filters, sort order, estimated row count, index availability, tenant scope, and whether the request can use a sample, aggregate, search index, warehouse, or operational replica. This prevents the UI from sending expensive ad hoc queries directly to primary systems.
        </p>
        <p>
          The exploration surface should distinguish preview, analysis, and export modes. Preview mode can use samples and approximate counts. Analysis mode may run governed aggregate queries. Export mode moves data out of the system and should trigger stronger permissions, quotas, and audit. Treating all three as the same table view creates either excessive restrictions or unsafe data movement.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>
        <p>
          A mature grid library such as AG Grid can save months of engineering effort because it already handles virtualization, resizing, pinned columns, keyboard navigation, accessibility patterns, and edge cases. The cost is bundle size, licensing for advanced features, theming constraints, and a larger abstraction surface. A custom grid built on lower-level virtualization libraries can be lighter and more tailored, but every spreadsheet-like feature becomes engineering ownership.
        </p>
        <p>
          Keyset pagination gives stable performance for deep navigation, but it does not support arbitrary page numbers naturally. Offset pagination supports &quot;go to page 5000&quot; but becomes expensive and unstable as data changes. A practical product can support approximate jump using offset or sampled row-position indexes, then resume keyset navigation once the user lands near the desired position.
        </p>
        <HighlightBlock as="p" tier="important">
          Exact counts are expensive at scale. Showing an exact filtered row count can make every filter operation wait for a full scan. Approximate counts, cached counts, or delayed exact counts give a better user experience. Principal-level design should explain when exactness matters and when estimated counts are acceptable.
        </HighlightBlock>
        <p>
          Client-side filtering feels instant for small tables but breaks correctness and performance at scale because it filters only loaded rows or forces full downloads. Server-side predicate pushdown is slower per interaction but correct across the entire dataset and allows the warehouse to use indexes, partitions, materialized views, and statistics.
        </p>
        <p>
          Direct browser exports are simple, but they fail for large result sets, long queries, flaky networks, and closed tabs. Asynchronous export jobs add infrastructure and operational complexity, but they provide retry, quota enforcement, progress, audit logging, and reliable delivery.
        </p>
        <p>
          Heavy profiling improves analyst understanding, but aggregate scans can be expensive. Cached exact profiles are useful for stable datasets. Sampled or approximate profiles are better for frequently changing data or exploratory filters. The UI must label sampled results clearly so users do not mistake estimates for audited facts.
        </p>
        <p>
          Client-side columnar engines such as DuckDB-WASM can make local exploration very fast after a data slice is loaded, but they also move more data into the browser and increase memory pressure. Server-side execution is safer for sensitive or huge datasets. A mature product can allow client-side acceleration only for bounded, permission-approved extracts and keep sensitive datasets server-executed.
        </p>
        <p>
          Approximate answers can be valuable if they are labeled. Approximate distinct counts, sampled profiles, and estimated row counts make exploration feel responsive, but they are not acceptable for audited exports or financial totals. The UI should mark estimate type, confidence, sample size, and whether an exact computation is available as a background job.
        </p>
        <p>
          Progressive disclosure is a performance trade-off. Initial page load should show schema, sample rows, freshness, quality status, and safe filters quickly. Counts, distinct values, histograms, joins, and exports can load separately with cost estimates. This keeps the UI responsive and teaches users which actions are expensive before they trigger a warehouse-scale query.
        </p>
        <p>
          Snapshot consistency matters for exploration handoffs. A saved view opened tomorrow may run against changed data, while an investigation link may need to preserve the exact dataset version and result ordering. The product should distinguish live saved views from frozen investigation snapshots so analysts do not confuse reproducibility with convenience.
        </p>
      </section>

      <section>
        <h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: latency, error rate, fallback rate, conversion, stale-state duration, and rollback success.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>
        <p>
          Treat every query as untrusted user input. Validate fields and operators against metadata, bind values as parameters, inject tenant predicates server-side, and enforce maximum page size, maximum selected columns, maximum predicate depth, and query timeout. Query safety is a product requirement, not only a backend concern.
        </p>
        <p>
          Keep URL state shareable but compact. Filters, sort order, visible columns, grouping, and profile context should be encoded or referenced in the URL so analysts can share investigations. Very large predicate trees should be stored server-side as saved views with short identifiers rather than producing fragile URLs.
        </p>
        <p>
          Segment caches by dataset version, tenant, permissions, filter hash, and selected fields. Caching a profile or query result without row-level-security context can leak data. Cache keys should include the security scope, not only the visible query text.
        </p>
        <p>
          Design the grid for keyboard and screen-reader workflows from the beginning. Data-heavy UIs are often used by power users who depend on keyboard navigation. Focus management, row and column headers, cell coordinates, copy behavior, and pinned regions must remain coherent under virtualization.
        </p>
        <p>
          Provide query transparency. Slow-query panels, query plan summaries, scanned-byte estimates, index hints, partition filter warnings, and cache-hit indicators help expert users understand performance. These features also reduce support load because users can see why a filter is slow.
        </p>
        <p>
          Make exports auditable. Record who exported what, when, with which filters, how many rows, which fields, and which delivery link. Sensitive fields should require additional permission checks and may need masking or approval flows.
        </p>
        <p>
          Provide safe degradation. If exact count is too expensive, show an estimate with confidence. If a profile query is queued, keep the grid usable. If a filter is not supported by the source engine, explain why rather than silently falling back to client-side filtering over partial data.
        </p>
        <p>
          Keep copy and download behavior policy-aware. Copying a selected cell, copying a range, downloading visible rows, and exporting the full filtered dataset have different blast radii. The system should enforce classification-specific controls for each action instead of treating them as the same "export" capability.
        </p>
        <p>
          Provide dataset trust context at the top level. Users should see freshness, source system, schema version, quality warnings, sample status, and ownership before they begin filtering. Data-heavy exploration tools are often used during incidents and investigations; hiding trust context forces users to infer whether a table is safe from stale or partial results.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: stale state, hidden partial failure, unbounded retries, ownership ambiguity, and missing observability.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>
        <p>
          The most common pitfall is rendering too many DOM nodes. Even if data fetching is fast, thousands of rows multiplied by many columns can overwhelm layout, paint, memory, event handlers, and accessibility trees. Two-dimensional virtualization is non-negotiable for very large grids.
        </p>
        <p>
          Another pitfall is relying on offset pagination for deep navigation. It works in demos and fails on real datasets. It also produces confusing results when rows are inserted, deleted, or resorted while the user pages through data. Deterministic sort keys and stable cursors are safer.
        </p>
        <p>
          Teams often forget that profiling and counts are queries too. A UI can optimize row retrieval but then accidentally run a full-table count, distinct cardinality scan, or expensive histogram on every filter change. Profiles and counts need caching, budgets, and explicit loading states.
        </p>
        <p>
          Export paths frequently bypass the same permission checks as the UI. This is dangerous because export is the easiest way to exfiltrate data at scale. Exports should reuse validated query plans, tenant guards, masking rules, and audit logging.
        </p>
        <p>
          Virtualized grids can break accessibility and selection semantics if implemented carelessly. Because off-screen cells are not in the DOM, focus restoration, copy ranges, row numbers, and screen-reader announcements must be modeled separately from DOM presence.
        </p>
        <p>
          Another pitfall is letting infinite scroll hide query boundaries. Users may assume they are seeing a complete sorted result while the backend is returning unstable pages under concurrent data changes. Cursor pagination, snapshot identifiers, and visible result bounds help preserve correctness.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>
        <p>
          Fraud investigation tools use large dataset exploration to inspect transactions, devices, IPs, users, and risk events. Analysts need fast filtering, grouping by entity, export for case review, and strict access controls because the data is sensitive.
        </p>
        <p>
          Data catalog and lakehouse tools use exploration grids to preview tables, profile columns, detect schema quality issues, and export samples. The UI must handle many engines and make sampling or stale statistics visible.
        </p>
        <p>
          Customer support and operations platforms use large grids to investigate orders, tickets, sessions, shipments, and account events. Saved views, row grouping, and shareable filters help teams collaborate during incident triage.
        </p>
        <p>
          Machine-learning dataset tools use this pattern to inspect labels, feature distributions, missing values, outliers, and sample rows. Profiling and grouping become critical because model quality issues often begin as data quality issues.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>
        <h3 className="mt-6 mb-3 text-lg font-semibold">1. How would you render millions of rows in a browser?</h3>
        <p>
          I would not render millions of rows. I would use two-dimensional virtualization so the DOM contains only visible rows and columns plus overscan. The grid tracks scroll position, visible ranges, pinned columns, row heights, and loaded pages. Data fetching is server-side and page-based. The browser is only a viewport into the dataset, while the server and database do computation.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">2. Why prefer keyset pagination over offset pagination?</h3>
        <p>
          Offset pagination gets slower for deep pages because the database scans and discards earlier rows. Keyset pagination uses the last row&apos;s sort-key values and a deterministic tie-breaker to seek into an indexed order. It provides stable performance for next and previous navigation. The trade-off is that arbitrary page jumps are harder, so I would support approximate jump separately and then resume keyset pagination.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">3. How would you design filtering safely?</h3>
        <p>
          The client would build a typed predicate tree, not raw SQL. The server validates fields, operators, value types, predicate depth, tenant permissions, and row-level security. It then translates the tree into parameterized SQL or an engine-specific query plan. Filters are pushed down to the database so results are correct across the full dataset and so indexes or partitions can be used.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">4. How do you handle column profiling without making the UI slow?</h3>
        <p>
          Profiling should be lazy and cached. Opening a profile panel checks a cache keyed by dataset version, tenant, column, and filter hash. Fast stats can return inline; expensive stats can run as background jobs. Numeric, categorical, and date columns need different profiles. If sampling is used, the UI should label the result as sampled and show confidence or freshness where possible.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">5. How would you implement exports for huge filtered datasets?</h3>
        <p>
          Small exports can stream directly to the browser. Large exports should create an asynchronous job. The job reuses the validated query plan, enforces quotas and permissions, streams results to object storage, reports progress, and returns a signed download link. The system should audit who exported which fields and rows because export is a high-risk data access path.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">6. What would you monitor in production?</h3>
        <p>
          I would monitor grid render latency, scroll jank, page fetch latency, cache hit rate, query timeout rate, scanned bytes, slow filters, profile job duration, export job failures, memory usage, selected column count, row-level-security misses, and errors segmented by dataset, tenant, warehouse engine, and browser. For principal-level readiness, cost and data access metrics matter as much as UI latency.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.ag-grid.com/react-data-grid/server-side-model/" target="_blank" rel="noreferrer">AG Grid: Server-Side Row Model</a>
          </li>
          <li>
            <a href="https://tanstack.com/virtual/latest" target="_blank" rel="noreferrer">TanStack Virtual Documentation</a>
          </li>
          <li>
            <a href="https://use-the-index-luke.com/no-offset" target="_blank" rel="noreferrer">Use The Index, Luke: Pagination Done the Right Way</a>
          </li>
          <li>
            <a href="https://cloud.google.com/bigquery/docs/best-practices-performance-compute" target="_blank" rel="noreferrer">Google BigQuery: Query Performance Best Practices</a>
          </li>
          <li>
            <a href="https://docs.snowflake.com/en/user-guide/querying-best-practices" target="_blank" rel="noreferrer">Snowflake Documentation: Querying Best Practices</a>
          </li>
          <li>
            <a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noreferrer">OWASP Top 10: Injection and Access Control Risks</a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
