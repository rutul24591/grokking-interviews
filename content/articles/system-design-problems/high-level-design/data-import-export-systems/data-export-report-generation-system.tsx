"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";

const metadata = {
  id: "article-hld-data-export-report-generation-system",
  title: "Design a Data Export / Report Generation System",
  description:
    "Principal-level design of an async export and report-generation pipeline with governed requests, cursor reads, streaming renderers, object storage delivery, scheduled jobs, and audit controls.",
  category: "high-level-design",
  subcategory: "data-import-export-systems",
  slug: "data-export-report-generation-system",
  wordCount: 5600,
  readingTime: 32,
  lastUpdated: "2026-05-22",
  readTime: "32 min read",
  difficulty: "Advanced",
  tags: ["Export Pipeline", "S3 Multipart", "OLAP", "Cursor Pagination", "Presigned URL"],
};

export default function DataExportReportGenerationSystem() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Data Export / Report Generation System around system boundary, state ownership, failure handling, scalability, security, and observable recovery. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock>
        <p>
          A data export and report-generation system lets users create CSV, Excel, PDF, Parquet, or scheduled reports from filtered product data. It is used for finance reports, customer exports, compliance evidence, analytics extracts, operational snapshots, and scheduled executive reporting.
        </p>
        <HighlightBlock as="p" tier="crucial">
          Large exports should be asynchronous jobs, not long HTTP responses. The API should accept export intent, validate permissions, enqueue work, stream output to durable storage, and return a secure download link when the file is ready.
        </HighlightBlock>
        <p>
          Exports are high-risk because they move data out of the application boundary. A design that focuses only on file generation misses the main concerns: permission recheck, row-level security, masking, quotas, audit trails, download expiration, scheduled delivery, and operational cost.
        </p>
        <p>
          Interviewers usually probe how to avoid primary database load, how to stream huge results without memory blowups, how to handle failed jobs, how to secure downloads, and how to support scheduled recurring reports without bypassing current permissions.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: the design must preserve correctness under latency, concurrency, partial failure, and changing permissions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Data Export / Report Generation System, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>
        <p>
          An export request captures report type, filters, selected columns, format, requester, tenant, permission context, and delivery mode. The request is validated immediately, but execution happens in workers. The API returns a job id and status endpoint quickly.
        </p>
        <p>
          The data reader should page through results using cursor pagination, source-specific streaming, or warehouse export primitives. It should avoid loading the whole result set into memory. For OLTP systems, exports should read from replicas or analytical stores rather than the primary transactional database.
        </p>
        <HighlightBlock as="p" tier="important">
          The renderer should stream output. CSV and JSONL are naturally streamable. Parquet can be written in row groups. Excel is harder because workbook structures can be memory-heavy. PDF report generation is a separate rendering path that usually uses dashboard snapshots or server-side HTML rendering.
        </HighlightBlock>
        <p>
          Object storage is the delivery boundary. Workers write generated files to storage, then the API creates short-lived signed download URLs after rechecking access. The file can survive browser refreshes, worker retries, and email delivery.
        </p>
        <p>
          Scheduled reports store a report template and schedule, not a static permission grant. At each scheduled run, the system should re-resolve permissions, row-level security, recipients, filters, and masking policies. A user losing access should stop receiving future reports.
        </p>
        <p>
          Audit logs are mandatory for sensitive exports. Record who requested the export, which tenant, which filters, selected columns, row counts, masking policy, generated file, download events, recipients, and expiration.
        </p>
        <p>
          A principal-level export design distinguishes report generation from data extraction. Data extraction answers what rows are allowed for this actor at this point in time. Report generation answers how those rows should be transformed, aggregated, formatted, and delivered. Mixing the two leads to brittle systems where a PDF renderer has to understand authorization or where a query service has to understand page layout. Strong designs create a permissioned snapshot or cursor plan first, then pass a bounded, auditable dataset into format-specific renderers.
        </p>
        <p>
          Exports also have product semantics. A financial statement may need point-in-time repeatability, exact totals, and legal retention. A dashboard CSV may tolerate slightly stale warehouse data. A customer support export may need masking and reason codes. These semantics should be captured in the export job definition rather than buried in renderer-specific code.
        </p>
        <p>
          Data classification is part of export intent. The same user may be allowed to view a dashboard but not download raw underlying rows; a support engineer may be allowed to export a single customer&apos;s audit history but not all customers in a segment. Export jobs should record dataset classification, selected columns, masking policy, legal basis or business reason when required, and whether the result leaves the tenant boundary through email or external storage.
        </p>
        <p>
          Report templates need versioning. A scheduled board report, regulatory export, or finance reconciliation file may need to reproduce the exact column order, filters, formulas, and layout used at a previous date. If template changes overwrite old definitions in place, historical reports become impossible to explain. The design should version templates and link each generated file to the template version and data snapshot used.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: state model, API contracts, cache policy, async workflow, authorization, rollout, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        <p>
          The architecture has five planes. The request plane validates export intent and creates jobs. The queue plane schedules work and handles retries. The execution plane reads data and renders files. The delivery plane stores files and issues signed URLs or emails. The governance plane enforces permissions, masking, quotas, retention, and audit.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-import-export-systems/data-export-report-generation-system.svg"
          alt="Data export and report generation architecture with API, job queue, workers, cursor reads, renderers, object storage, signed URLs, scheduled reports, and audit."
          caption="Data export is an asynchronous governed pipeline: validate request, enqueue work, stream data through a renderer, write to storage, and deliver through expiring links or schedules."
        />
        <p>
          The user submits an export request. The API validates permission, format, selected columns, filter scope, expected size, and quota. It records an export job and enqueues a message. The worker claims the job, resolves a snapshot of the query and policy, then streams rows from the chosen data source.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-import-export-systems/data-export-streaming-flow.svg"
          alt="Export streaming flow with cursor reads, batch processing, format renderer, multipart object storage upload, progress events, and retry-safe job state."
          caption="Streaming exports keep memory bounded by reading pages, rendering chunks, uploading parts, and checkpointing progress instead of materializing the full file."
        />
        <p>
          Progress is emitted after meaningful checkpoints such as rows read, bytes written, parts uploaded, or render stage completed. On success, the worker marks the job ready and records file metadata. On failure, it records error class, retryability, and safe diagnostic information. Users can poll the job status or subscribe to progress events.
        </p>
        <p>
          Download is a separate permissioned action. When a user requests the file, the API verifies that the user can still access the export, then issues a short-lived signed URL or streams the object through an authenticated proxy. For scheduled email delivery, the system sends links with expiration rather than attaching huge files when possible.
        </p>
        <p>
          Large exports should be generated through streaming pipelines rather than loading all rows into application memory. The query layer emits pages or partitions, the transformation layer applies masking and formatting incrementally, and the renderer writes chunks to temporary storage. The job coordinator tracks checkpoints so a worker failure restarts from the last safe partition rather than beginning the entire export again.
        </p>
        <p>
          For repeatability, some export types need an explicit snapshot contract. A compliance report should be reproducible from a recorded data version, warehouse partition, or query timestamp. An operational CSV may be allowed to reflect latest data at execution time. The export job should record which consistency model it used because support, finance, and auditors will ask why a regenerated report differs from the original.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-import-export-systems/data-export-scheduled-delivery.svg"
          alt="Scheduled report delivery with cron scheduler, permission recheck, template execution, report rendering, recipients, signed links, and audit trail."
          caption="Scheduled reports re-enter the same export pipeline and recheck permissions at run time, preventing stale schedules from bypassing access controls."
        />
        <p>
          Privacy and legal workflows often attach to exports. A subject access request, retention export, or audit evidence package may require approval, immutable tracking, customer-specific scoping, and deletion after a policy-defined window. The export system should support approval gates and case identifiers without special one-off scripts. This is a common principal-interview gap: candidates design the file pipeline but not the governance workflow around the file.
        </p>
        <p>
          Delivery should be policy-driven. Some exports are safe to deliver through a short-lived link in the application. Others require password-protected archives, secure mailbox delivery, customer-managed storage destinations, watermarking, or no email delivery at all. The architecture should let product and compliance teams define delivery rules by data classification and tenant policy rather than embedding delivery behavior in each report type.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>
        <p>
          Direct synchronous download is simple for small exports and should remain available for bounded result sets. It becomes unreliable for large exports because of timeouts, memory pressure, and retry limitations. Async export adds operational complexity but supports large data, progress, retries, and durable delivery.
        </p>
        <p>
          CSV is universal and streamable but loses type information and formatting. Excel is user-friendly but has row limits and higher renderer memory risk. Parquet is efficient for analytical reuse but less accessible to business users. PDF is good for presentation snapshots but poor for downstream data analysis.
        </p>
        <HighlightBlock as="p" tier="important">
          Exporting raw rows is more sensitive than exporting chart images or aggregated reports. The product should apply stricter permissions, masking, quotas, and audit controls to raw data exports.
        </HighlightBlock>
        <p>
          Reading from replicas protects the primary database but can return stale data. Reading from warehouses scales better for large exports but may not include the newest writes. The UI should show export freshness and source clearly when users rely on reports for decisions.
        </p>
        <p>
          Signed URLs are efficient and cheap but can be forwarded unless scoped carefully and expired quickly. Authenticated proxy downloads provide stronger access checks at download time but consume application bandwidth.
        </p>
        <p>
          Scheduled reports improve operational workflows but create governance risk. The system must recheck recipient permissions and data scope on every run, and it must stop schedules owned by disabled users or removed roles.
        </p>
        <p>
          Download authorization has a subtle trade-off. Embedding all authorization in a signed URL is fast, but a leaked URL may remain valid until expiry. Re-checking permission through an application endpoint on every download is safer, but adds latency and operational dependency. For sensitive exports, short-lived signed URLs minted only after an application permission check are a reasonable balance.
        </p>
        <p>
          Precomputing reports improves latency and reduces database load, but it can leak stale or unauthorized data if permissions or data visibility change after the report is generated. On-demand generation is fresher and safer but more expensive. Mature systems support both: precompute common aggregate reports with freshness labels, and generate sensitive user-scoped exports on demand.
        </p>
        <p>
          Renderer choice changes correctness risk. CSV output is mostly about escaping, delimiter safety, and formula injection prevention. Excel output needs sheet limits, cell typing, formatting, and protection against formulas that execute when opened. PDF output needs layout fidelity, pagination, fonts, and accessibility. Treating every format as a thin serialization target underestimates the operational work of making reports trustworthy.
        </p>
        <p>
          Snapshot isolation has a cost trade-off. Strong repeatability may require database snapshots, warehouse time travel, materialized intermediate tables, or object-storage manifests. Those choices cost storage and can delay generation, but they give support and auditors a stable answer. For exploratory exports, latest-available data with a freshness label may be enough. The interview answer should tie consistency level to report purpose.
        </p>
        <p>
          Approval workflows also trade speed for control. A sales manager may expect immediate exports, while compliance may require manager approval for high-volume personal-data exports. A mature system applies approval only when risk justifies it, based on row count, selected columns, recipient domain, data classification, and actor role. Blanket approval requirements make the product unusable; no approvals make sensitive exfiltration too easy.
        </p>
      </section>

      <section>
        <h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: latency, error rate, fallback rate, conversion, stale-state duration, and rollback success.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>
        <p>
          Cap synchronous exports and route larger requests to async jobs. Make the threshold explicit and based on estimated rows, file size, format, and source cost.
        </p>
        <p>
          Stream both input rows and output bytes. Use cursor reads, warehouse export APIs, or server-side cursors where appropriate, and write files incrementally to storage.
        </p>
        <p>
          Treat generated files as sensitive artifacts. Apply expiration by default, encrypt at rest, scope storage paths by tenant, tag files with data classification, and capture access audit records. If exports include personal data, the system should support deletion workflows and retention policies that align with privacy commitments.
        </p>
        <p>
          Apply permission, row-level-security, and masking policies at request time and execution time. Scheduled reports and delayed jobs should not rely only on the requester&apos;s original access.
        </p>
        <p>
          Use quotas. Limit concurrent exports per tenant, rows per export, scheduled report frequency, retained files, and download count. Exports are easy to abuse accidentally.
        </p>
        <p>
          Make progress and failure actionable. Show queued, running, rendering, uploading, ready, failed, expired, or cancelled states, along with safe error categories rather than internal stack traces.
        </p>
        <p>
          Retain files for a bounded time and clean them automatically. Sensitive exports should have short retention and download expiration by default.
        </p>
        <p>
          Defend against spreadsheet injection. Any field that begins with formula-like prefixes should be escaped or neutralized for CSV and Excel exports unless the product explicitly supports formulas. This matters in system design interviews because exports often cross from a web application into desktop tools where the threat model changes.
        </p>
        <p>
          Make exported files self-describing. Include generated-at time, data freshness, filters, tenant or account scope, column definitions, masking status, report template version, and job id where the format supports it. This metadata reduces support ambiguity when a file is forwarded, compared, or re-opened weeks later.
        </p>
        <p>
          Use separate capacity controls for interactive and scheduled exports. A large nightly scheduled report should not starve an administrator trying to export a small urgent CSV. Queues can be partitioned by tenant, priority, data source, and report class, with admission control before expensive warehouse queries begin.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: stale state, hidden partial failure, unbounded retries, ownership ambiguity, and missing observability.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>
        <p>
          A common pitfall is querying the primary database with a long-running export. This can affect normal product traffic. Large exports should use replicas, warehouses, snapshots, or read-optimized stores.
        </p>
        <p>
          Another pitfall is building the entire file in memory. This fails for large files and creates unpredictable memory pressure. Renderers should stream.
        </p>
        <p>
          Scheduled reports can become permission bypasses if recipient access is not rechecked on every run. Access changes must affect future deliveries.
        </p>
        <p>
          Presigned URLs with long lifetimes increase leakage risk. Use short expirations, audit download events, and prefer authenticated proxy downloads for highly sensitive data.
        </p>
        <p>
          Export systems often forget cancellation. Users should be able to cancel queued or running jobs where the worker can stop safely.
        </p>
        <p>
          Another pitfall is treating scheduled report recipients as static strings. Recipients can lose access, leave the company, change roles, or point to distribution lists with unknown membership. The scheduler should resolve and validate recipient authorization at each run, not only when the schedule is created.
        </p>
        <p>
          Teams also overlook downstream copies. Once a file is generated, it may be downloaded, emailed, attached to tickets, or uploaded to external storage. The export system cannot fully control every copy, but it can reduce risk through short retention, watermarking, audit trails, classification labels, and least-privilege delivery choices.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>
        <p>
          Finance teams export monthly revenue, invoices, payments, and reconciliation reports. These require correctness, repeatability, audit, and clear freshness.
        </p>
        <p>
          Customer success teams export account usage, health scores, renewal data, and support history. Row-level security and recipient control matter because these datasets are customer-sensitive.
        </p>
        <p>
          Data teams export analytical datasets to object storage in columnar formats for downstream processing. Parquet and partitioned output are useful here.
        </p>
        <p>
          Compliance teams generate evidence packages and scheduled reports. These require immutable job history, masking policies, retention limits, and traceable delivery.
        </p>
        <p>
          Customer-facing SaaS products use exports as a trust feature. Enterprise customers expect admins to export audit logs, access reviews, billing records, and configuration snapshots. Those exports must be permissioned, repeatable, and auditable because customers may use them for their own compliance evidence.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>
        <h3 className="mt-6 mb-3 text-lg font-semibold">1. How would you design large exports without timing out?</h3>
        <p>
          I would accept the request, validate permissions and size, create a durable job, enqueue it, and let workers stream rows from a read-optimized source into a format renderer. The renderer writes incrementally to object storage. The user tracks progress and downloads through a short-lived signed link when ready.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">2. How do you keep memory bounded?</h3>
        <p>
          Use cursor or streaming reads and write output incrementally. CSV and JSONL can flush rows continuously. Parquet writes row groups. Large uploads to object storage should use multipart upload. Avoid accumulating all rows or the full file in application memory.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">3. How do you secure exports?</h3>
        <p>
          Reuse the same permission and row-level-security logic as the UI, apply column masking, enforce quotas, audit request and download events, use short-lived download links, and recheck access when the file is downloaded or delivered. Scheduled reports must recheck access on every run.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">4. How would you support scheduled reports?</h3>
        <p>
          Store a schedule, report template, filters, recipients, owner, and delivery policy. A scheduler creates normal export jobs at due times. The job revalidates permissions and recipient scope, generates the file, sends expiring links, and records audit events. Disabled owners or unauthorized recipients stop future delivery.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">5. What failures should the job model represent?</h3>
        <p>
          The model should distinguish queued, running, rendering, uploading, ready, cancelled, expired, retrying, failed retryable, and failed permanent. It should record safe error categories, retry count, worker heartbeat, and enough progress to avoid confusing users.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">6. What would you monitor?</h3>
        <p>
          Monitor queue age, export duration, rows per second, renderer errors, object-storage upload failures, file size, download success, scheduled delivery failures, quota rejections, source query latency, retry rate, and sensitive export volume by tenant and actor.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html" target="_blank" rel="noreferrer">AWS S3: Multipart Upload Overview</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html" target="_blank" rel="noreferrer">AWS S3: Sharing Objects with Presigned URLs</a></li>
          <li><a href="https://arrow.apache.org/docs/" target="_blank" rel="noreferrer">Apache Arrow Documentation</a></li>
          <li><a href="https://parquet.apache.org/docs/" target="_blank" rel="noreferrer">Apache Parquet Documentation</a></li>
          <li><a href="https://pptr.dev/" target="_blank" rel="noreferrer">Puppeteer Documentation</a></li>
          <li><a href="https://cloud.google.com/bigquery/docs/exporting-data" target="_blank" rel="noreferrer">BigQuery: Exporting Data</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
