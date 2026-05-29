"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-log-monitoring-ui",
  title: "Design a Log Monitoring UI (Datadog/Kibana-like)",
  description:
    "Principal-level design of a Datadog/Kibana-like log monitoring UI with indexed search, faceting, histograms, virtualized log lists, live tail, context expansion, trace correlation, query governance, and incident workflows.",
  category: "high-level-design",
  subcategory: "data-heavy-systems",
  slug: "log-monitoring-ui",
  wordCount: 5600,
  readingTime: 32,
  lastUpdated: "2026-05-22",
  tags: ["hld", "logging", "monitoring", "datadog", "kibana", "elasticsearch", "virtual-scroll", "log-tail"],
  relatedTopics: ["realtime-analytics-10k-datapoints", "alerting-anomaly-detection-dashboard"],
};

export default function LogMonitoringUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A log monitoring UI helps engineers search, filter, tail, inspect, and correlate log events during incidents and debugging workflows. A Datadog or Kibana-like interface usually includes a query bar, time picker, histogram, faceted sidebar, virtualized log list, detail panel, context expansion, saved searches, live tail, and links to traces or metrics.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The principal-level design goal is time-to-evidence during incidents. The system should help an engineer move from a vague symptom to relevant logs, surrounding context, correlated traces, and likely root cause within minutes, without downloading or rendering unbounded log volume.
        </HighlightBlock>
        <p>
          Log data is high-volume, semi-structured, and expensive to search. A large production system can produce millions of lines per minute. The UI cannot load all matching rows, and the backend cannot treat every search as an unlimited full-text scan. The architecture must combine indexed search, cursor pagination, aggregations, query limits, tenant isolation, and virtualized rendering.
        </p>
        <p>
          Live tail and indexed search are related but different. Live tail reads new events from a stream before or alongside indexing. Search reads from the indexed store and may lag by several seconds. The UI must explain this freshness gap so users understand why a line can appear in live tail before it appears in normal search.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          The query model combines structured filters and full-text search. Structured fields such as service, level, host, region, environment, trace id, and tenant should use exact filters. Message text and arbitrary string fields use full-text search. Treating structured fields as full-text terms wastes index performance and returns surprising results.
        </p>
        <p>
          The histogram gives situational awareness before users inspect individual lines. It shows log volume over time, usually stacked by level or grouped by field. Dragging a histogram range narrows the time window. This interaction is often faster than editing timestamps manually during an incident.
        </p>
        <HighlightBlock as="p" tier="important">
          The log list must be virtualized. Even a result page of ten thousand lines can create poor rendering performance if every row, field, and expandable detail is mounted. A virtualized list keeps only visible rows and overscan in the DOM while search pagination retrieves additional windows.
        </HighlightBlock>
        <p>
          Facets are aggregations over the current query and time range. They show counts for level, service, host, container, namespace, region, and other indexed fields. Clicking a facet updates the query, and the list, histogram, and other facets should refresh from the same search context.
        </p>
        <p>
          Context expansion retrieves logs around a selected event using timestamp and stable ordering. During debugging, the 50 lines before and after an error often reveal the cause. Context should preserve tenant filters, service scope, and ordering semantics so it does not leak or reorder unrelated data.
        </p>
        <p>
          Trace correlation connects a log line to a distributed trace through trace id or span id. This lets engineers move from a single error message to the full request path across services. Strong observability products make logs, traces, and metrics mutually navigable.
        </p>
        <p>
          Principal-level log monitoring also needs retention tiers and field governance. Debug logs, audit logs, access logs, and security logs have different retention, privacy, and search needs. High-cardinality fields should not automatically become indexed facets. Sensitive fields may need masking, hashing, or access controls. Without governance, log platforms become expensive data lakes full of risky text.
        </p>
        <p>
          Query cost should be visible. A search over all services for 30 days is a different operation from a trace-id lookup over 15 minutes. The UI should guide users toward indexed fields, recent time windows, and scoped services, and it should warn or route to background search when a query is wide or expensive. This is both a UX feature and a backend protection mechanism.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The architecture has four planes. The ingestion plane collects, parses, enriches, and indexes logs. The search plane translates UI queries to backend search DSL, enforces tenant isolation, and returns hits plus aggregations. The live plane streams new matching logs from a message bus. The UI plane renders histogram, facets, virtualized rows, details, context, and trace links.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/log-monitoring-ui.svg"
          alt="Log monitoring UI architecture with Elasticsearch search, Log API, virtual scroll, histogram, faceted sidebar, live tail, and context expansion."
          caption="A log monitoring UI combines indexed search for historical investigation with live stream tailing for near-real-time debugging."
        />
        <p>
          A normal search starts with query text, time range, selected facets, sort order, and page cursor. The Log API parses the query, validates allowed fields, injects tenant and retention predicates, translates it to the storage engine DSL, and requests hits plus aggregations. The UI receives a small window of log entries, a histogram, facet counts, and a cursor for loading more.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/log-monitoring-search-flow.svg"
          alt="Log search flow showing query parser, tenant filter, DSL generation, search backend, hits, histogram aggregation, facets, and search_after cursor."
          caption="The search path returns a bounded result window and aggregations from the same governed query, using cursor pagination for deep result sets."
        />
        <p>
          Live tail starts when the user opts in. The client sends the same query and tenant context to the Live Tail Service. The service consumes new log events from a stream, applies compiled filters, batches matches, and sends them over WebSocket or Server-Sent Events. The client prepends batches or shows a new logs banner depending on scroll position, while keeping a bounded in-memory list.
        </p>
        <p>
          Context expansion should use a stable ordering key, not timestamp alone. In high-volume systems, many logs share the same millisecond timestamp. The backend should sort by timestamp plus ingestion sequence or log id, then fetch before and after windows using that composite cursor. This prevents missing or duplicating nearby lines when the user asks for surrounding context.
        </p>
        <p>
          Saved investigations should preserve more than query text. During an incident, engineers need to share the exact time range, filters, selected log line, context window, trace link, index freshness, and whether live tail was active. A reproducible link prevents different responders from seeing subtly different evidence because relative time windows or live streams moved forward.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/log-monitoring-live-tail-flow.svg"
          alt="Live tail flow showing log stream, compiled query filter, batching, WebSocket delivery, bounded client buffer, new logs banner, and background-tab throttling."
          caption="Live tail is optimized for freshness and bounded UI work: stream filtering happens server-side, batches arrive periodically, and the client avoids unbounded memory growth."
        />
        <p>
          A principal-ready design separates ingestion, indexing, and investigation workloads. Ingestion must remain durable during traffic spikes even if search indexes lag. Indexing can apply parsing, enrichment, redaction, routing, and sampling policies. Investigation queries should run against indexed and archived data with different latency expectations. This separation lets the system preserve evidence during an incident without promising instant search over every byte.
        </p>
        <p>
          Tenant and service isolation are central. One verbose service, noisy tenant, or debug-log accident should not consume the whole ingestion budget or evict critical security logs. The architecture should support per-tenant quotas, per-source routing, priority lanes for audit and error logs, and overload behavior that sheds low-value debug logs before high-value incident evidence.
        </p>
        <p>
          The indexing pipeline should preserve failure visibility. If parsing fails, redaction fails, schema extraction fails, or an index shard rejects writes, the system should emit operational metrics and route affected logs to a quarantine path when possible. Dropping malformed logs silently is dangerous because malformed messages often appear during exactly the failures operators need to diagnose.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <p>
          Elasticsearch and OpenSearch excel at full-text search with inverted indexes, flexible structured filters, and rich aggregations. They are operationally expensive at high log volume and require careful index lifecycle management. ClickHouse and similar columnar stores are often cheaper and faster for structured filters and aggregations but weaker for arbitrary full-text search unless paired with specialized indexing.
        </p>
        <p>
          Cursor pagination is better than offset pagination for deep log results. Logs are naturally sorted by timestamp and id, so search-after cursors can continue from the last hit without scanning discarded rows. Offset pagination is simpler but becomes expensive and unstable as new logs arrive.
        </p>
        <HighlightBlock as="p" tier="important">
          Live tail freshness and indexed search consistency are different guarantees. Live tail can show events before the search index refreshes. The UI should label index lag and avoid pretending both paths are perfectly synchronized.
        </HighlightBlock>
        <p>
          Rich parsing improves search and facets but increases ingestion cost and schema management. Not every log field should become an indexed facet. High-cardinality fields such as request id or raw user id can explode index size. The platform needs field governance and sampling or indexing policies.
        </p>
        <p>
          Virtualized rows improve performance but complicate find-in-page, keyboard navigation, copy ranges, and screen-reader behavior. A production design needs explicit interactions for copying selected logs, exporting a result window, and moving focus through rows.
        </p>
        <p>
          Server-side live filtering protects the browser from receiving all logs, but it consumes gateway CPU per live subscription. For very popular queries, the service can share compiled filters or fanout groups. For highly unique queries, per-session filtering is necessary but should be rate-limited.
        </p>
        <p>
          Indexing everything gives flexible search, but it is often unaffordable. Indexing too little makes incidents slower. A mature platform uses tiered indexing: core dimensions are indexed for all logs, selected fields are indexed by schema policy, raw payload remains retrievable by id or narrow time window, and cold logs move to cheaper storage with slower background search.
        </p>
        <p>
          Exporting logs has a different risk profile from viewing logs. An engineer may need a small context window for an incident, but a broad export can include credentials, personal data, customer identifiers, and secrets accidentally written by applications. Exports should be capped, audited, masked where possible, and sometimes routed through approval for sensitive environments.
        </p>
        <p>
          Query language power is a trade-off. Full regex, joins, and arbitrary aggregations make investigations flexible but can be expensive and hard to govern. A constrained query builder is safer for most users but may slow expert operators. Mature products offer guided filters for common dimensions, saved investigations for incidents, and an advanced query mode protected by budgets and explain plans.
        </p>
        <p>
          Sampling is also subtle. Sampling low-value success logs protects cost, but sampling errors or security events can destroy the evidence needed for a postmortem. The design should support policy-based sampling by severity, service criticality, tenant tier, and incident mode rather than a single global percentage.
        </p>
        <p>
          Cold storage search trades cost for latency. Keeping all logs in hot indexes is expensive, while moving older logs to object storage slows investigations. A mature product offers fast search over recent windows, slower background search over archived logs, clear retention labels, and export controls for cold results. Users should know whether a search is complete or still scanning archives.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <p>
          Make time range explicit and default to recent windows. Most incident searches begin with the last 15 minutes or one hour. Wide ranges should warn users about cost and may require slower background searches.
        </p>
        <p>
          Separate structured filters from full-text terms in the query compiler. Exact fields should map to keyword filters, while message search should use text search. This improves performance and correctness.
        </p>
        <p>
          Return hits, histogram, and facets from the same logical query. This keeps the UI consistent: counts, bars, and rows all reflect the same filters and time window.
        </p>
        <p>
          Keep live tail bounded. Batch updates, cap visible entries, pause or throttle in background tabs, show new-log banners when the user is scrolled away from the top, and expose a clear pause button.
        </p>
        <p>
          Preserve context and correlation. Detail panels should show parsed fields, raw JSON, trace links, related metrics, host or container metadata, and surrounding log context without forcing users to leave the search flow.
        </p>
        <p>
          Protect sensitive logs. Apply tenant isolation, retention policy, field masking, role-based access, query audit logs, and export restrictions. Logs often contain tokens, emails, IPs, customer ids, or regulated data.
        </p>
        <p>
          Make redaction observable. The platform should track redaction rule version, dropped-field counts, suspected secret detections, and samples of redaction failures through secure review workflows. If redaction silently breaks after a new log format ships, the UI may expose credentials or personal data. Treating redaction as a monitored pipeline keeps log search useful without weakening security.
        </p>
        <p>
          Make investigation reproducible. Saved searches, pinned time ranges, copied context windows, and links to trace and metric views should preserve query, filters, freshness, and permissions. During an incident, teams need to share the same evidence without screenshots or ambiguous manual steps.
        </p>
        <p>
          Separate operator and support views. Platform engineers may need broad service logs and raw payloads, while support teams may need account-scoped logs with masked fields and guided queries. Serving both personas from the same query backend is fine, but the UI should expose different defaults, permissions, and export controls so convenience does not become overexposure.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          A common pitfall is returning too many log rows to the browser. Even if the backend can search quickly, rendering thousands of complex rows and detail components will degrade the incident workflow.
        </p>
        <p>
          Another pitfall is treating full-text search and structured filtering the same. Field filters should use exact indexed fields where possible; otherwise users see slow and imprecise searches.
        </p>
        <p>
          Teams often forget index lag. When live tail and search disagree, users lose trust unless the UI explains freshness and provides a catch-up or refresh path.
        </p>
        <p>
          Facets can be expensive over wide ranges. Running high-cardinality aggregations on every keypress can overload the search backend. Facets need limits, debounce, caching, and field governance.
        </p>
        <p>
          Context expansion can leak data if it ignores tenant or service filters. The before and after queries must apply the same security and scope constraints as the original search.
        </p>
        <p>
          Teams also fail by making retention one-dimensional. Debug logs, audit logs, security logs, and customer-support logs have different retention, legal hold, and deletion requirements. A single retention knob is either too expensive or too risky. Principal-level designs classify logs and enforce retention by class and tenant policy.
        </p>
        <p>
          Another pitfall is over-indexing high-cardinality fields because they are useful during one incident. Request ids, user ids, session ids, and raw payload keys can explode index size if promoted globally. Field governance should allow targeted indexing for important services while keeping rare dimensions searchable through narrow raw retrieval or trace correlation.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <p>
          Incident response teams search recent errors by service, region, deployment version, and trace id to understand failures quickly. Histogram and facets narrow the investigation before opening individual rows.
        </p>
        <p>
          Platform teams use log monitoring to debug Kubernetes workloads, container restarts, host failures, and noisy dependencies. Context expansion and host metadata help correlate application and infrastructure signals.
        </p>
        <p>
          Security teams search logs for suspicious IP addresses, user agents, account ids, and error patterns. They need strong audit trails, retention policies, and export controls.
        </p>
        <p>
          Customer support and operations teams use scoped log views to diagnose account-specific failures without broad production access. Field masking and permissioned saved searches are important in these workflows.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">1. How would you design fast log search?</h3>
        <p>
          I would put a Log API between the UI and search backend. It parses the user query, validates fields, injects tenant filters, translates to backend DSL, and returns a bounded result page plus histogram and facets. Structured filters use exact keyword fields, free-text terms use full-text search, and pagination uses a stable cursor such as timestamp and id.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">2. How would you render millions of matching log entries?</h3>
        <p>
          I would not render millions. The backend returns small pages, and the frontend uses virtualized rows so only visible entries and overscan exist in the DOM. Loading more uses cursor pagination. Expanded details are mounted only for selected rows, and long-running live sessions keep bounded client memory.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">3. How does live tail differ from normal search?</h3>
        <p>
          Live tail reads new log events from a stream and filters them before they are necessarily searchable in the index. Normal search reads from the indexed store and may lag by the index refresh interval. Live tail optimizes for freshness; search optimizes for historical retrieval and aggregations. The UI should label index lag and keep both paths scoped by the same query and tenant context.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">4. How would you implement facets and histograms?</h3>
        <p>
          The search request should include aggregations for the histogram and selected facets from the same logical query. The histogram uses date buckets and often level breakdowns. Facets use terms aggregations on governed fields such as service, level, host, or environment. High-cardinality facets need limits and may be disabled or sampled.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">5. How do you support context expansion?</h3>
        <p>
          When a user selects a log entry, the API uses its timestamp and stable id to query N entries before and after it, applying the same tenant, retention, and optional service scope filters. The result is shown in a detail panel with the selected log highlighted. This lets engineers inspect surrounding events without losing their search context.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">6. What production risks would you monitor?</h3>
        <p>
          I would monitor search latency, query error rate, index lag, live-tail lag, WebSocket disconnects, facet aggregation latency, slow queries by field, virtualized render latency, memory growth during live tail, context query failures, trace-link success, tenant isolation failures, and export/audit volume.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html" target="_blank" rel="noreferrer">Elasticsearch: Query DSL</a></li>
          <li><a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/paginate-search-results.html" target="_blank" rel="noreferrer">Elasticsearch: Paginate Search Results</a></li>
          <li><a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html" target="_blank" rel="noreferrer">Elasticsearch: Aggregations</a></li>
          <li><a href="https://opentelemetry.io/docs/concepts/signals/logs/" target="_blank" rel="noreferrer">OpenTelemetry: Logs</a></li>
          <li><a href="https://tanstack.com/virtual/latest" target="_blank" rel="noreferrer">TanStack Virtual Documentation</a></li>
          <li><a href="https://clickhouse.com/docs/en/observability" target="_blank" rel="noreferrer">ClickHouse: Observability</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
