"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-audit-log-viewer-ui",
  title: "Design Audit Log Viewer UI",
  description:
    "Production-grade audit logging interface with filtering, search, tamper-evident storage, and compliance reporting.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "audit-log-viewer-ui",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-06",
  tags: ["lld", "audit-logging", "compliance", "search", "filtering"],
  relatedTopics: ["export-system", "settings-page-system"],
};

export default function AuditLogViewerUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Audit logs are a compliance and security requirement for enterprise applications: every significant action (data modification, permission change, login event, configuration change) must be recorded with who performed it, what they changed, when, and from where. The audit log viewer is the interface through which administrators, security teams, and compliance auditors review this history. It must handle potentially billions of records while providing sub-second search and filtering, and the records themselves must be tamper-evident (an attacker who compromises the application should not be able to delete or modify audit records).</p>
        <p>The UI design challenge is presenting dense, structured event data in a form that allows investigators to quickly find what they're looking for. A security analyst investigating a breach might need to find all actions taken by a specific user in a 2-hour window, or all changes to a specific record across all users and all time. A compliance auditor might need all privileged access events from the past 90 days exported to a CSV. Each query pattern requires different indexing, filtering, and export capabilities.</p>
        <p><strong>Explicit assumptions:</strong> Audit logs are append-only; no modification or deletion is permitted through the UI (admin users can query but not mutate). The backend stores logs in Elasticsearch for fast faceted search alongside a cold storage archive (S3 + Parquet) for compliance retention. The UI is accessible only to users with the "auditor" or "admin" role. Large result sets are exported asynchronously (the export system design applies).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Faceted search and filtering:</strong> Filter by actor (userId, email), event type (login, data_change, permission_change), target resource (resourceType, resourceId), date range, IP address, and outcome (success, failure).</li>
          <li><strong>Full-text search:</strong> Search across actor names, resource names, and change descriptions.</li>
          <li><strong>Event detail view:</strong> Click an event to see full details: before/after JSON diff for data changes, request metadata (IP, user agent), session information.</li>
          <li><strong>Cursor pagination:</strong> Navigate through large result sets without page-flip (load more on scroll or page navigation).</li>
          <li><strong>Export:</strong> Export filtered result set to CSV for compliance reporting. Up to millions of rows; async export with email delivery.</li>
          <li><strong>Tamper evidence:</strong> Show integrity status of each record (hash chain verification).</li>
          <li><strong>RBAC:</strong> Admins see all logs; managers see their team's logs; users see only their own actions.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Search latency:</strong> Filtered queries return within 2 seconds for up to 90-day lookback windows.</li>
          <li><strong>Retention:</strong> 7 years for compliance-sensitive events (financial, healthcare); 1 year for general events.</li>
          <li><strong>Immutability:</strong> Audit records cannot be modified or deleted by any user or application, including system administrators.</li>
          <li><strong>Availability:</strong> Audit log viewer must be available even during incidents (it is used for incident investigation); independent deployment from the main application.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>The audit log viewer is a read-only search interface backed by Elasticsearch. The application writes audit events to a Kafka topic, which is consumed by two sinks: Elasticsearch (for fast interactive search, 90-day hot window) and S3 (for long-term archival in Parquet format, queried via Athena for compliance exports beyond 90 days). The viewer UI sends search queries to an API layer that translates filter criteria into Elasticsearch queries and returns paginated results. The API enforces RBAC by injecting must_match clauses that restrict results to records the requester is authorized to see.</p>
        <p>Tamper evidence uses a hash chain: each audit record includes a hash of its own content concatenated with the hash of the previous record. If any record is modified or deleted, the hash chain breaks. The viewer periodically verifies hash chain integrity for the displayed window and shows a visual integrity indicator. A broken chain surfaces a red warning: "Log integrity verification failed between events X and Y."</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/audit-log-viewer-ui.svg"
          alt="Audit log viewer showing immutable record schema with hash chain, faceted filter UI with Elasticsearch backend, cursor pagination, RBAC scope injection, and compliance export flow"
          caption="Audit log viewer showing immutable record schema with hash chain, faceted filter UI with Elasticsearch backend, cursor pagination, RBAC scope injection, and compliance export flow"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Audit Record Schema</h3>
	        <p>Each audit record contains: eventId (UUID, immutable), timestamp (RFC 3339, millisecond precision), actorId, actorEmail, actorIp, actorUserAgent, eventType (login, logout, data read, data create, data update, data delete, permission change, config change, export), resourceType, resourceId, resourceName, outcome (success, failure, partial success), and a changeSet for update events that captures what changed (before and after values for only the affected fields). Records also include sessionId and requestId (from the API gateway), tags for categorization, and integrity fields such as a hash of the previous record and a hash of the current record so the viewer can verify a tamper-evident chain.</p>
        <p>The changeSet field is the most valuable part of a data_update event: it shows exactly what changed, enabling investigators to answer "what was the value of field X before the change?" The before and after objects should include only changed fields (not the entire record) to keep record sizes manageable. For large objects (documents, configuration blobs), store a diff (using a JSON diff algorithm like RFC 6902 JSON Patch) rather than both full copies.</p>
        <p>Sensitive values in the changeSet should be redacted: passwords (even hashed), API keys, credit card numbers, and any PII fields flagged as sensitive. The audit system should redact these at write time (replace the value with "[REDACTED]" and the field name), not at read time—read-time redaction is fragile and can expose sensitive data through query errors or middleware bypasses.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Faceted Filter UI</h3>
        <p>The filter panel on the left (desktop) or expandable bottom sheet (mobile) contains: a date range picker (quick selects: last hour, last 24h, last 7 days, custom range), actor search (autocomplete backed by the users API), event type multi-select (checkboxes for each event type category), resource type and ID search, outcome filter (success/failure/all), and IP address filter (CIDR range supported for network investigations).</p>
        <p>All filter changes update the URL query parameters (via useSearchParams / history.pushState) so the current view is bookmarkable and shareable. An investigator can share a URL that encodes specific filters, and the recipient opens the exact same filtered view. The URL encoding must handle multi-value filters (multiple selected event types) and complex values (CIDR ranges, date strings).</p>
        <p>Active filters are shown as "chips" below the search bar, each with an X to remove. This gives a persistent visual record of what filters are active and allows easy removal of individual filters without resetting all filters at once. An "active filters" count badge on the filter toggle button shows the number of active filters when the filter panel is collapsed.</p>
        <p>The result count ("2,847 events") updates as filters change. For Elasticsearch, the count is returned with every query response (hits.total.value). Displaying the count helps the investigator know if their filters are too narrow (0 results) or too broad (millions of results, requiring more filtering before export).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Event Detail View</h3>
        <p>Clicking an event row opens a detail panel (side drawer on desktop, full-screen on mobile). The detail panel shows: all event metadata in a structured format, and if the event is a data_update, a diff view of the changeSet. The diff view uses a standard format: red highlighting for removed values, green for added values, yellow for changed values. Field names are shown with their display labels (not database column names).</p>
        <p>The detail panel also shows related events: a "See related events" section that queries for other events with the same sessionId, or other events on the same resourceId around the same time. This enables investigators to follow a chain of events: "user logged in at 10:00, changed permission at 10:01, accessed report at 10:02, exported data at 10:03." This contextual view is one of the most valuable features for incident investigation.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cursor Pagination for Time-Series Data</h3>
        <p>Audit logs are naturally time-series: queries filter by date range and sort by timestamp descending (most recent first). Cursor pagination for time-series uses the (timestamp, eventId) tuple as the cursor, similar to the activity feed pattern. The query condition: events WHERE timestamp &lt; cursor.timestamp OR (timestamp = cursor.timestamp AND eventId &lt; cursor.eventId), sorted by timestamp DESC, eventId DESC, LIMIT N.</p>
	        <p>For Elasticsearch, cursor pagination uses a continuation token derived from the last item in the current page, based on the same stable sort keys used in the query (typically timestamp and eventId). Subsequent queries pass this continuation token so Elasticsearch can resume from the correct position in the sorted index without scanning and discarding all earlier pages. This remains efficient even for very deep pagination.</p>
        <p>The UI shows infinite scroll (load more on scroll) rather than page numbers. The total count is shown at the top ("2,847 events"); the user scrolls to load more. For compliance exports of large result sets (millions of events), infinite scroll is supplemented by the async export feature—the user applies filters, sees the count, and triggers an export rather than scrolling through millions of rows in the UI.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">RBAC Enforcement</h3>
	        <p>RBAC is enforced at the API query layer by injecting mandatory scope filters that cannot be overridden by client-supplied filter parameters. For example, a manager whose scope is limited to their team will always have an organization scope filter applied, and an actor scope filter limited to their team members. Client-provided filters are applied on top of these mandatory scope constraints, which means the client can only narrow the result set further, never broaden it beyond what they are authorized to see.</p>
        <p>System administrators (with full audit log access) have no mandatory scope filters. A dedicated "system admin" role is required to access another user's audit records—this itself is logged as an audit event (an admin viewing another user's audit history is itself a significant action). This creates a self-referential chain: audit access is itself audited.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Elasticsearch versus database for audit search: a relational database with appropriate indexes can support audit log queries, but Elasticsearch provides better full-text search, native faceted aggregations (counts per event type, per actor), and CIDR range queries (for IP filtering) without custom implementation. The operational overhead of running Elasticsearch is the trade-off. For applications with strict data residency requirements, a managed Elasticsearch service (Elastic Cloud, OpenSearch Serverless) may be required to avoid self-hosting.</p>
        <p>Hot versus cold storage separation: storing all audit events in Elasticsearch indefinitely is expensive. A 90-day Elasticsearch window covers the vast majority of interactive investigations; events older than 90 days are rare to query interactively and are better served from a data warehouse (Athena, BigQuery). The trade-off is query complexity: the UI must either query both systems (hot + cold) for queries spanning the boundary, or accept that the interactive UI only covers 90 days and compliance exports beyond that use a separate workflow. The latter is simpler and sufficient for most compliance auditing patterns.</p>
        <p>Hash chain integrity versus performance: computing and verifying hash chains adds CPU overhead at write time (hash of previous record required before inserting a new one, which serializes inserts) and at read time (verification requires fetching records in order). For very high-volume audit logging (millions of events per day), hash chains may create write bottlenecks. Alternatives: block-level signing (hash a batch of 1000 events together and sign the block) reduces the chain computation cost while preserving tamper evidence at block granularity.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>An audit log viewer UI is a specialized search interface for immutable, append-only records. The key technical properties are: Elasticsearch for fast faceted search with RBAC filter injection at the API layer (mandatory scope clauses that clients cannot override), hash chain integrity for tamper evidence (SHA-256 chain across records, verified on-demand in the viewer), cursor pagination using (timestamp, eventId) tuples for efficient deep pagination, and hot/cold storage separation (Elasticsearch for 90-day interactive search, S3+Parquet for long-term compliance retention). The UI provides faceted filters encoded in URL parameters (for shareability), event detail views with before/after diffs, related event traversal for incident investigation, and async export with email delivery for compliance reporting. The defining constraint is immutability: no UI action can modify or delete audit records, and even administrator access to another user's records is itself audited.</p>
      </section>
    </ArticleLayout>
  );
}
