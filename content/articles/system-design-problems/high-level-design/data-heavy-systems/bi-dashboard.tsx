"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-bi-dashboard",
  title: "Design a BI Dashboard (Tableau-like)",
  description:
    "Principal-level design of a Tableau-like BI dashboard with chart building, query generation, live and extract execution, cross-filtering, row-level security, caching, sharing, exports, and dashboard governance.",
  category: "high-level-design",
  subcategory: "data-heavy-systems",
  slug: "bi-dashboard",
  wordCount: 5700,
  readingTime: 33,
  lastUpdated: "2026-05-22",
  tags: ["hld", "bi", "dashboard", "tableau", "data-visualization", "query-engine", "cross-filter", "row-level-security"],
  relatedTopics: ["large-dataset-exploration-ui", "reporting-analytics-dashboard"],
};

export default function BIDashboardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a BI Dashboard (Tableau-like) around system boundary, state ownership, failure handling, scalability, security, and observable recovery. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock>
        <p>
          A BI dashboard system lets analysts build charts and dashboards from business data, then lets stakeholders view, filter, drill into, share, export, and schedule those dashboards. A Tableau-like product has two distinct surfaces: a builder experience for analysts and a viewer experience for business users. The builder optimizes for flexibility and explainability. The viewer optimizes for fast loading, safe access, and predictable interaction.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The principal-level design challenge is not drawing charts. It is safely turning visual intent into governed queries, enforcing row-level security, avoiding warehouse overload, supporting fast cross-filter interactions, and managing freshness trade-offs between live data and cached extracts.
        </HighlightBlock>
        <p>
          BI dashboards sit between product analytics, finance, sales operations, executive reporting, customer success, and data engineering. A single dashboard can be viewed by hundreds of users, query many sources, and rely on sensitive fields. That means the design must include permission-aware caching, query queues, audit logs, extract governance, and explainable freshness.
        </p>
        <p>
          Users expect spreadsheet-like freedom, but the system cannot behave like a spreadsheet internally. The frontend should hold dashboard definitions and small result sets. The query layer should push aggregation, filtering, grouping, limits, and row-level security to the data source or extract engine.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: the design must preserve correctness under latency, concurrency, partial failure, and changing permissions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a BI Dashboard (Tableau-like), the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>
        <p>
          The chart builder converts field selections into a declarative visualization specification. Fields are assigned to axes, measures, color, size, tooltip, filters, and grouping. The query builder translates that specification into a safe query using dataset metadata and a semantic model. This allows non-SQL users to build charts while still giving power users transparency into generated queries.
        </p>
        <p>
          The semantic model is the contract between raw data and dashboard users. It defines dimensions, measures, joins, default aggregations, fiscal calendars, time grains, friendly names, formatting rules, and allowed filters. Without this layer, every dashboard can interpret revenue, active user, region, and customer differently.
        </p>
        <HighlightBlock as="p" tier="important">
          Row-level security must be enforced on the server for every query and every export. The browser can receive only the data the viewer is allowed to see. Cache keys must include tenant, dashboard version, query shape, and viewer security context, otherwise cached results can leak across users.
        </HighlightBlock>
        <p>
          Live mode runs queries against the source database or warehouse at view time. It gives fresher data but has higher latency and can overload the warehouse during dashboard bursts. Extract mode materializes data into a columnar store or precomputed cube. It gives fast interaction and protects source systems, but it introduces staleness, refresh failure modes, and security-versioning concerns.
        </p>
        <p>
          Cross-filtering lets interaction in one chart affect others. A click on a bar, map region, or table row adds a filter to the dashboard state. Each dependent chart recomputes its effective query from global filters, widget filters, and cross-filter events. In extract mode this may run locally against a columnar extract. In live mode it usually triggers server-side re-queries.
        </p>
        <p>
          Export and sharing are high-risk paths. A dashboard image is lower risk than raw CSV. CSV can expose row-level data at scale. Embedded dashboards require signed tokens, scoped permissions, expiration, and origin controls. Scheduled email delivery must recheck permissions and RLS at send time, not only at schedule creation.
        </p>
        <p>
          Principal-level BI design also needs metric governance. If two teams define revenue differently, the dashboard platform can create organizational disagreement instead of clarity. The semantic layer should include metric owners, certification status, deprecation notices, lineage to source tables, and review workflow for promoted measures. Users should be able to tell whether a chart uses a certified business metric or an ad hoc draft calculation.
        </p>
        <p>
          The system also needs an explicit freshness contract. Some dashboards are operational and must show current data. Others are executive summaries over yesterday&apos;s closed books. The UI should expose refresh cadence, source lag, extract status, and last successful query. A stale chart with a green visual state is worse than a failed chart because it invites confident but wrong decisions.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: state model, API contracts, cache policy, async workflow, authorization, rollout, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        <p>
          The system has five planes. The builder plane manages schema browsing, chart authoring, layout, saved versions, and preview. The viewer plane renders published dashboard definitions and interactive filters. The query plane validates visualization specs, generates queries, injects RLS, enforces limits, and calls connectors. The cache and extract plane accelerates repeated reads. The governance plane handles permissions, audit, sharing, scheduling, and lineage.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/bi-dashboard.svg"
          alt="BI dashboard architecture with chart builder, query service, row-level security, live and extract execution, dashboard canvas, sharing, and export."
          caption="A BI system turns visual chart intent into governed queries, then serves builders and viewers through live execution, cached results, or extracts depending on freshness and latency requirements."
        />
        <p>
          The builder flow begins with a dataset connection and schema introspection. The system profiles columns, maps field types, applies semantic definitions, and lets the analyst build chart specifications. The query service validates the specification, generates source-specific SQL or query language, runs a preview query with limits, and returns a small result set for chart rendering. When the dashboard is published, the immutable dashboard version records widget layout, chart specs, parameters, data source references, and security rules.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/bi-dashboard-query-plane.svg"
          alt="BI query plane showing visual spec, semantic model, RLS injection, cache lookup, query queue, source connectors, and normalized result sets."
          caption="The query plane is the safety boundary: it validates visual intent, applies semantic definitions and RLS, checks cache, limits concurrency, and normalizes connector responses."
        />
        <p>
          The viewer flow loads a published dashboard version, resolves the viewer identity and permissions, applies default parameter values, and issues chart queries in parallel through the query service. Each chart renders independently as data arrives. Query concurrency is capped per data source, so a dashboard with many charts and many viewers does not stampede the same warehouse.
        </p>
        <p>
          Cross-filtering updates dashboard state. The client computes which charts are affected, marks them loading, and sends updated query requests with cross-filter predicates. In live mode the query service evaluates those predicates against the warehouse with cache and queue controls. In extract mode the filter may run inside a browser or worker-based columnar engine when data volume and security policy allow it.
        </p>
        <p>
          Query scheduling should be priority-aware. A dashboard preview from a builder, an executive board dashboard at 9 AM, a background scheduled PDF, and an exploratory raw SQL query should not compete equally. The query service can prioritize interactive viewer requests, cap background exports, and isolate expensive exploration from high-priority dashboards. This prevents a single analyst experiment from degrading many viewers.
        </p>
        <p>
          Dashboard publication should be treated as a governed transition. A draft can use experimental fields, broad filters, and expensive queries, but a published dashboard should pass validation for RLS, query cost, certified metric usage, broken fields, and viewer performance. This distinction keeps exploration flexible while preventing unfinished analyst work from becoming a widely shared operational dependency.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/bi-dashboard-sharing-export.svg"
          alt="BI sharing and export governance with signed links, embed tokens, scheduled delivery, PDF rendering, CSV export, RLS recheck, audit logs, and expiration."
          caption="Sharing and export re-enter the governance layer: signed links, embedded tokens, scheduled jobs, and CSV exports must recheck permissions and record audit events."
        />
        <p>
          A mature BI dashboard architecture treats the semantic layer as the contract between raw data and business interpretation. Metrics such as active users, revenue, churn, margin, and inventory availability should have definitions, owners, version history, approved dimensions, and deprecation paths. Without this, every dashboard can compute a slightly different version of the same metric and leaders lose trust in the platform.
        </p>
        <p>
          Dashboard publication should be staged. Personal exploration can be flexible and fast, team dashboards should have ownership and data-source review, and executive or external dashboards should require certified metrics, access review, freshness SLA, and change history. The UI should distinguish draft, team-owned, certified, deprecated, and archived dashboards so consumers understand how much trust to place in what they see.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>
        <p>
          Live mode prioritizes freshness and source-of-truth correctness. It is appropriate for operations dashboards, rapidly changing RLS memberships, and dashboards where stale data could cause bad decisions. Its cost is latency, warehouse load, and sensitivity to data-source outages. Query result caching helps, but cache keys must include security context and freshness requirements.
        </p>
        <p>
          Extract mode prioritizes interactivity and cost control. It is appropriate for executive dashboards, daily business reviews, and heavy cross-filter interactions over mostly stable data. Its cost is stale data, extract refresh jobs, storage overhead, and complexity around RLS changes. If RLS attributes change frequently, extracts need per-viewer slicing, fast invalidation, or a return to live mode.
        </p>
        <HighlightBlock as="p" tier="important">
          Cross-filter latency is where many BI designs fail. Viewer interactions need sub-second feedback, but live cross-filtering across many charts can trigger a warehouse query storm. A principal design should include result caching, query deduplication, per-source concurrency limits, extract acceleration, and progressive chart loading.
        </HighlightBlock>
        <p>
          Generated SQL is safer for most users, but raw SQL unlocks power and risk. Raw SQL can bypass semantic definitions, produce unbounded scans, and make lineage harder. It should be limited by permissions, query timeouts, result limits, and mandatory RLS wrapping where possible.
        </p>
        <p>
          Client-side extracts can deliver excellent interactions but increase browser memory pressure and may expose more data to the client than the current chart needs. Server-side extracts or precomputed cubes reduce client risk, but require backend compute for every filter interaction. The right choice depends on dataset size, sensitivity, viewer concurrency, and interaction depth.
        </p>
        <p>
          PDF and image export preserve the dashboard view but do not support downstream analysis. CSV export supports analysis but increases data exfiltration risk. Sensitive dashboards should restrict CSV export, mask fields, add watermarking where appropriate, and audit all export requests.
        </p>
        <p>
          Dashboard embedding has a separate security trade-off. Embeds help customers and partners consume analytics inside another product, but they require scoped tokens, allowed origins, expiration, and tenant-specific theming without leaking data. Static public links are simpler but risky for sensitive dashboards. Mature systems distinguish internal sharing, authenticated external embedding, public snapshots, and scheduled delivery, each with different controls.
        </p>
        <p>
          Drill-down depth is another trade-off. Letting viewers move from aggregate charts to raw rows improves explainability, but it can bypass the intent of aggregation and expose sensitive detail. The system should define which measures are drillable, which fields are masked, and whether a drill-down is executed as a new governed query with its own audit event.
        </p>
        <p>
          Query admission control trades exploration speed against platform stability. BI users can accidentally submit wide scans, high-cardinality group-bys, or cross-source joins that overwhelm warehouses. The query service should estimate cost, route to cached extracts when possible, cap concurrency, and show users why a query is queued or rejected. Principal-level design should protect shared analytical infrastructure while preserving useful exploration.
        </p>
        <p>
          Row-level security placement is another important trade-off. Filtering only in the browser is unacceptable, while duplicating permission logic across every connector is brittle. The semantic or query layer should enforce tenant, role, geography, and data-classification rules centrally, then audit access to sensitive datasets and exports.
        </p>
      </section>

      <section>
        <h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: latency, error rate, fallback rate, conversion, stale-state duration, and rollback success.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>
        <p>
          Build around a semantic layer. Define measures, dimensions, joins, units, time grains, and default aggregations centrally. This prevents each dashboard from redefining core business metrics differently and makes generated queries easier to govern.
        </p>
        <p>
          Enforce RLS in the query service, not in the frontend. Every query, profile, export, scheduled email, embedded view, and preview-as-user request should pass through the same security injection and audit path.
        </p>
        <p>
          Make freshness visible. Each chart should show whether it is live, cached, or extract-backed, along with last refresh time and query errors. Users should know whether they are looking at current data or an extract from the previous refresh.
        </p>
        <p>
          Use cache keys that encode security and freshness. Include tenant, dashboard version, data source version, query hash, parameter values, RLS context, and extract version. Avoid sharing cache entries across viewers with different access scopes.
        </p>
        <p>
          Limit query blast radius. Apply per-source concurrency caps, query timeouts, max result sizes, scanned-byte budgets, and deduplication for identical in-flight queries. Dashboards should degrade by showing queued or partial chart states rather than taking down the warehouse.
        </p>
        <p>
          Treat published dashboard versions as immutable. Builders can edit drafts, but viewers should load a stable published version. This makes caching, scheduled delivery, permissions, and audit history more predictable.
        </p>
        <p>
          Provide lineage and impact analysis. Before a dataset, field, or metric changes, owners should know which dashboards, scheduled reports, embedded views, and exports depend on it. This reduces silent breakage and gives dashboard owners a path to migrate before a source change lands.
        </p>
        <p>
          Make dashboard health visible to owners. A dashboard with frequent query timeouts, low cache hit rate, stale extracts, failing scheduled delivery, or fields from deprecated datasets should surface an owner-facing warning. Without ownership feedback, dashboards decay into unreliable artifacts even if the underlying query engine is healthy.
        </p>
        <p>
          Expose data quality state near the chart, not only in pipeline tools. A BI tile should be able to show that its source extract is late, a validation rule failed, or a metric definition changed. Users making decisions from the dashboard need trust context at the point of consumption.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: stale state, hidden partial failure, unbounded retries, ownership ambiguity, and missing observability.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>
        <p>
          A common pitfall is enforcing permissions only when the dashboard loads. Every chart query and export must enforce permissions because filters, raw SQL, drilldowns, and schedules create new data access paths.
        </p>
        <p>
          Another pitfall is using cache keys that ignore RLS. If two viewers run the same chart query but have different allowed regions or customers, they must not share the same cached result unless the cache is partitioned by effective security context.
        </p>
        <p>
          Teams often underestimate dashboard stampedes. A widely shared dashboard opened at 9 AM by hundreds of employees can trigger thousands of warehouse queries. The query layer needs concurrency control, deduplication, and cached refresh patterns.
        </p>
        <p>
          Cross-filtering can become inconsistent if each widget implements filtering differently. The dashboard state model should have a single definition for global filters, widget filters, cross-filter events, and parameter precedence.
        </p>
        <p>
          Export paths often bypass visualization-level limits. A chart may show 500 aggregated rows, but CSV export may request raw millions of rows. Export should have separate permissions, quotas, masking, and approval for sensitive datasets.
        </p>
        <p>
          Teams also fail to manage dashboard lifecycle. A dashboard that nobody owns can continue to drive decisions long after its source table or metric definition changed. Ownership, certification, and deprecation are core product features for BI systems at scale.
        </p>
        <p>
          Another pitfall is hiding freshness and data-quality status. A chart can render beautifully while showing yesterday&apos;s failed pipeline output or a metric with failed validation. BI dashboards should expose freshness, quality warnings, and source incidents near the affected tiles so users do not interpret stale numbers as current truth.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>
        <p>
          Executive reporting dashboards summarize revenue, growth, retention, margin, and forecast metrics. They value stable definitions, scheduled delivery, commentary, and consistent freshness more than raw interactivity.
        </p>
        <p>
          Sales and customer-success dashboards use row-level security heavily because regional managers, account owners, and executives see different customer scopes. Cache and extract design must account for those scopes.
        </p>
        <p>
          Product analytics dashboards let teams slice funnels, cohorts, experiments, and adoption metrics by segment. Cross-filtering and drilldowns matter, but raw event access may need strict governance.
        </p>
        <p>
          Operations dashboards monitor inventory, fulfillment, support queues, incident volume, and service-level metrics. They often require live mode or short TTL caching because stale values can trigger wrong operational decisions.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>
        <h3 className="mt-6 mb-3 text-lg font-semibold">1. How would you design the query layer for a BI dashboard?</h3>
        <p>
          I would have the client send declarative chart specs rather than raw SQL for normal users. The query service validates the spec against a semantic model, injects tenant and row-level-security predicates, checks cache, applies query limits, and routes to source-specific connectors. It normalizes result sets for chart renderers and records audit metadata for sensitive access.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">2. How would you handle live mode versus extract mode?</h3>
        <p>
          Live mode queries the source at view time and is best for freshness and frequently changing permissions. Extract mode materializes data into a columnar representation or cube and is best for fast interaction and warehouse protection. I would choose per dashboard or data source, show freshness clearly, and make RLS changes invalidate or bypass extracts when necessary.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">3. How do you enforce row-level security safely?</h3>
        <p>
          RLS should be enforced server-side on every query and export. Viewer identity attributes are resolved by the backend, converted into validated predicates, and injected into generated queries. Cache keys include effective RLS context. The browser never receives unrestricted raw data and cannot disable security by modifying network requests.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">4. How would you prevent a popular dashboard from overloading the warehouse?</h3>
        <p>
          I would deduplicate in-flight identical queries, cache results by query and security context, cap concurrent queries per data source, apply query timeouts and scanned-byte limits, use extracts for high-traffic stable dashboards, and progressively load charts. The dashboard should show queued or stale-but-labeled results rather than stampeding the source.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">5. How do cross-filters work across charts?</h3>
        <p>
          A cross-filter interaction adds a typed filter event to dashboard state with source chart, field, value, and mode. Each chart computes effective filters from dashboard parameters, widget filters, and active cross-filters. In live mode this creates updated server queries. In extract mode it can run locally against a columnar extract. Filter precedence and clearing behavior should be consistent across widgets.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">6. What would you monitor in production?</h3>
        <p>
          I would monitor dashboard load time, per-chart query latency, cache hit rate, warehouse concurrency, query timeout rate, scanned bytes, extract refresh success, RLS injection failures, export volume, scheduled delivery failures, cross-filter latency, and viewer errors segmented by tenant, dashboard, data source, and dashboard version.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://www.tableau.com/products/desktop" target="_blank" rel="noreferrer">Tableau: Product Concepts</a></li>
          <li><a href="https://duckdb.org/docs/api/wasm/overview.html" target="_blank" rel="noreferrer">DuckDB-WASM Documentation</a></li>
          <li><a href="https://arrow.apache.org/docs/" target="_blank" rel="noreferrer">Apache Arrow Documentation</a></li>
          <li><a href="https://cloud.google.com/bigquery/docs/row-level-security-intro" target="_blank" rel="noreferrer">BigQuery: Row-Level Security</a></li>
          <li><a href="https://docs.snowflake.com/en/user-guide/security-row-intro" target="_blank" rel="noreferrer">Snowflake: Row Access Policies</a></li>
          <li><a href="https://pptr.dev/" target="_blank" rel="noreferrer">Puppeteer Documentation</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
