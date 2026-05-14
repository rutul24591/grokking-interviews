"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";

const metadata = {
  id: "article-hld-data-export-report-generation-system",
  title: "Design a Data Export / Report Generation System",
  description:
    "Staff-level design of an async data export pipeline: cursor-paginated reads from OLAP/replicas, S3 multipart streaming render (CSV/Excel/PDF/Parquet), presigned download URLs, scheduled report cron, and delivery semantics.",
  category: "high-level-design",
  subcategory: "data-import-export-systems",
  slug: "data-export-report-generation-system",
  wordCount: 5000,
  readingTime: 18,
  lastUpdated: "2026-05-14",
  readTime: "18 min read",
  difficulty: "Advanced",
  tags: ["Export Pipeline", "S3 Multipart", "OLAP", "Cursor Pagination", "Presigned URL"],
};

export default function DataExportReportGenerationSystem() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">
          A data export system sounds simple on the surface: the user picks a
          filter, presses Export, and receives a file. The engineering challenges
          emerge at scale. A naïve implementation queries the primary database
          synchronously, holds the entire result set in memory, serialises it to
          CSV, and returns it as a large HTTP response. This breaks in multiple
          ways: the query holds a long-lived transaction lock on the primary DB,
          the API server runs out of memory for result sets beyond a few thousand
          rows, the HTTP connection times out for large exports, and the file is
          gone the moment the response is delivered (no retry).
        </HighlightBlock>
        <p>Clarify scope with the interviewer:</p>
        <ul>
          <li>
            <strong>Output formats:</strong> CSV, Excel (.xlsx), PDF, Parquet?
            Each has a different renderer and file-size profile.
          </li>
          <li>
            <strong>Dataset size:</strong> Thousands of rows (dashboard widget
            export) vs. millions of rows (full-table dump)?
          </li>
          <li>
            <strong>Latency:</strong> Synchronous (client waits &lt;5 s) for small
            exports, async job for anything larger?
          </li>
          <li>
            <strong>Scheduling:</strong> One-off on demand, or recurring (daily /
            weekly reports sent by email)?
          </li>
          <li>
            <strong>Security:</strong> Who can export what data? Is the export
            tenant-scoped? Are PII fields masked or redacted?
          </li>
          <li>
            <strong>File retention:</strong> How long is the download link valid?
            How long is the file kept in storage?
          </li>
        </ul>
        <p>
          For this design: CSV / Excel / Parquet output; up to 10 M rows per
          export; async job for anything &gt;1,000 rows; scheduled recurring
          exports via cron; presigned S3 download links valid 15 minutes; 7-day
          S3 lifecycle retention; tenant-scoped with PII masking rules.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3>Functional</h3>
        <ul>
          <li>
            Client submits export parameters (report type, filters, column list,
            format) and receives a <code>jobId</code> immediately (HTTP 202).
          </li>
          <li>
            Worker fetches data from a read replica or OLAP store, renders to the
            requested format, and streams the result to S3 using multipart upload.
          </li>
          <li>
            Client polls or subscribes via SSE for job status (% rows fetched).
          </li>
          <li>
            On completion the client receives a presigned S3 URL (15-minute TTL)
            for direct download, and an email with the link.
          </li>
          <li>
            Recurring exports are triggered by a cron scheduler and re-use the
            same job pipeline.
          </li>
          <li>Files are deleted after 7 days via S3 lifecycle policy.</li>
        </ul>
        <h3>Non-functional</h3>
        <ul>
          <li>
            <strong>Throughput:</strong> 100 K rows / minute per worker;
            10 M-row export completes in &lt;100 minutes.
          </li>
          <li>
            <strong>Memory:</strong> O(1) — worker memory is bounded by page size
            (10 K rows), not export size.
          </li>
          <li>
            <strong>Source isolation:</strong> Queries target read replicas or
            OLAP stores, never the primary write database.
          </li>
          <li>
            <strong>Reliability:</strong> Failed export jobs are retried up to 3
            times from the last flushed S3 part.
          </li>
          <li>
            <strong>Security:</strong> Presigned URL binds to the requesting
            tenant; ownership verified before URL generation.
          </li>
        </ul>
      </section>

      <section>
        <h2>High-Level Design</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-import-export-systems/data-export-report-generation-system.svg"
          alt="Data Export / Report Generation System sequence diagram"
          caption="Async job → cursor-paginated OLAP query → streaming S3 multipart render → presigned delivery"
        />
        <p>The pipeline has four stages:</p>
        <ol>
          <HighlightBlock as="li" tier="important">
            <strong>Job creation:</strong> The Export API validates the request,
            estimates row count to enforce quotas, creates a job record, enqueues
            to a worker queue, and returns HTTP 202 with the jobId.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Data fetch:</strong> An Export Worker opens a server-side
            cursor on the read replica, fetching pages of 10,000 rows. Each page
            is streamed into a format renderer without buffering the full result.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Streaming write:</strong> The renderer flushes to an S3
            multipart upload every 5 MB (one S3 part). The cursor loop continues
            until the DB returns zero rows, at which point the worker calls S3
            CompleteMultipartUpload.
          </HighlightBlock>
          <li>
            <strong>Delivery:</strong> The API generates a presigned S3 URL on
            demand. An email is sent on job completion. Scheduled exports run
            through the identical pipeline triggered by a cron service.
          </li>
        </ol>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3>Export Job Creation</h3>
        <p>
          The client calls <code>POST /exports</code> with:
        </p>
        <ul>
          <li>
            <code>reportType</code> — a named report template (e.g.,{" "}
            <code>orders_by_date</code>, <code>user_activity</code>) or a custom
            query builder spec.
          </li>
          <li>
            <code>filters</code> — date ranges, status enums, tenant-scoped IDs.
          </li>
          <li>
            <code>columns</code> — ordered list of fields to include; unlisted
            fields are excluded (including PII fields unless the caller has
            explicit permission).
          </li>
          <li>
            <code>format</code> — <code>csv</code>, <code>xlsx</code>,{" "}
            <code>parquet</code>.
          </li>
        </ul>
        <p>The API server:</p>
        <ol>
          <li>
            Authorises the request: the caller must own the tenantId and have the{" "}
            <code>exports:create</code> permission. PII columns are cross-checked
            against a field-level permissions table.
          </li>
          <li>
            Estimates row count by running a <code>SELECT COUNT(*)</code> with the
            same filters on the OLAP store (cheap because OLAP maintains
            pre-aggregated statistics). Rejects if estimated count exceeds the
            tenant&rsquo;s export quota (default: 10 M rows / day).
          </li>
          <li>
            Creates a job record: <code>status=queued</code>,{" "}
            <code>estimatedRows</code>, <code>format</code>,{" "}
            <code>requestedBy</code>, <code>createdAt</code>.
          </li>
          <li>
            Enqueues a message to the export worker queue containing the jobId and
            a serialised query spec.
          </li>
          <li>
            Returns HTTP 202 <code>&#123;"jobId":"...","statusUrl":"/exports/...&#125;</code>.
          </li>
        </ol>

        <h3>Read Source: Read Replica vs. OLAP</h3>
        <HighlightBlock as="p" tier="important">
          Small exports (&lt;500 K rows, &lt;10 filters) run against the
          PostgreSQL read replica. Large or complex exports (window functions, many
          joins, aggregations) target a dedicated OLAP store (e.g., ClickHouse,
          BigQuery, Redshift). The routing decision is made at job creation time
          based on the report type's metadata configuration.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Using a read replica / OLAP instead of the primary write database is
          non-negotiable: a 10 M-row scan with a long-held cursor would block
          autovacuum, autanalyze, and replication on a primary under write load.
          The replica adds at most a few seconds of replication lag, which is
          acceptable for export use cases.
        </HighlightBlock>

        <h3>Cursor-Paginated Query</h3>
        <HighlightBlock as="p" tier="important">
          The worker issues a keyset-paginated query rather than OFFSET-based
          pagination. OFFSET becomes progressively slower as the offset grows
          because the DB must scan and discard all preceding rows. Keyset
          pagination is O(log n) per page:
        </HighlightBlock>
        <ul>
          <li>
            First page:{" "}
            <code>SELECT … WHERE tenant_id=$1 AND created_at &gt;= $2 ORDER BY id LIMIT 10000</code>
          </li>
          <li>
            Subsequent pages:{" "}
            <code>SELECT … WHERE tenant_id=$1 AND created_at &gt;= $2 AND id &gt; &#123;lastId&#125; ORDER BY id LIMIT 10000</code>
          </li>
        </ul>
        <HighlightBlock as="p" tier="important">
          The cursor value (<code>lastId</code>) is the max ID from the last page.
          The worker stores the cursor in the job record after every page flush so
          that retries can resume mid-export.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          For PostgreSQL the worker can also use a server-side cursor (
          <code>DECLARE my_cursor CURSOR FOR SELECT …; FETCH 10000 FROM my_cursor</code>
          ) within a single transaction, which avoids re-running the query
          predicate per page. The trade-off: the transaction holds a snapshot for
          its duration, which prevents autovacuum from reclaiming dead tuples
          generated during the export. For very long exports (&gt;30 minutes)
          keyset pagination is safer.
        </HighlightBlock>

        <h3>Streaming Format Renderers</h3>
        <p>
          Each page of rows flows through a format-specific renderer:
        </p>
        <ul>
          <HighlightBlock as="li" tier="important">
            <strong>CSV:</strong> Rows are serialised line-by-line. The renderer
            writes directly to a stream backed by the S3 multipart upload buffer.
            No intermediate file is created. Header row is written on the first
            page only.
          </HighlightBlock>
          <li>
            <strong>Excel (.xlsx):</strong> ExcelJS streaming writer appends rows
            to an in-progress worksheet backed by the same S3 stream. The XLSX
            format requires a ZIP container, so ExcelJS buffers the current sheet
            XML chunk (not the full workbook) per page. Excel is limited to ~1 M
            rows per sheet; for larger exports the worker creates multiple sheets
            or rejects the format in favour of CSV.
          </li>
          <li>
            <strong>Parquet:</strong> Apache Arrow / parquet-wasm writer appends
            row groups (default 100 K rows = one row group). Parquet is the most
            space-efficient format (columnar + Snappy compression) and ideal for
            data-warehouse consumers.
          </li>
        </ul>
        <p>
          The renderer flushes to S3 when its internal buffer exceeds 5 MB. This
          creates one S3 part per flush. S3 multipart upload requires a minimum
          part size of 5 MB (except the last part), so this aligns perfectly.
        </p>

        <h3>S3 Multipart Upload Lifecycle</h3>
        <HighlightBlock as="p" tier="important">
          The worker initiates a multipart upload at job start, receiving an
          <code>uploadId</code>. It stores the uploadId in the job record. For
          each 5 MB flush the worker calls <code>UploadPart</code> and records the{" "}
          <code>PartNumber</code> and <code>ETag</code> in the job&rsquo;s part
          manifest (stored in Redis or the job record as a JSON array). On
          completion it calls <code>CompleteMultipartUpload</code> with the full
          part manifest.
        </HighlightBlock>
        <p>
          If the worker crashes after uploading some parts, it resumes by:
        </p>
        <ol>
          <li>Reading the last cursor value and part manifest from the job record.</li>
          <li>
            Re-initiating the same uploadId (or starting a new multipart upload if
            the uploadId expired—S3 TTL is 7 days).
          </li>
          <li>
            If reusing the uploadId: re-uploading only the parts after the last
            flushed part by re-querying from the stored cursor.
          </li>
          <li>Completing the upload after all parts are re-uploaded.</li>
        </ol>

        <h3>Job Status and SSE Progress</h3>
        <p>
          The worker publishes progress events to a Redis channel{" "}
          <code>export:&#123;jobId&#125;</code> after every page commit. Each
          event contains:
        </p>
        <ul>
          <li>
            <code>fetchedRows</code> — cumulative rows read from DB so far.
          </li>
          <li>
            <code>estimatedRows</code> — from the job record (approximate).
          </li>
          <li>
            <code>s3PartsUploaded</code> — number of S3 parts completed.
          </li>
        </ul>
        <HighlightBlock as="p" tier="important">
          The Export API subscribes to the channel and forwards events to SSE
          clients connected to{" "}
          <code>GET /exports/&#123;jobId&#125;/events</code>. A 60-second
          Last-Event-ID replay buffer handles reconnects.
        </HighlightBlock>

        <h3>Download and Presigned URL</h3>
        <HighlightBlock as="p" tier="important">
          On job completion the worker stores the S3 key in{" "}
          <code>jobs.s3_key</code> and sets <code>status=ready</code>. The client
          calls <code>GET /exports/&#123;jobId&#125;/download</code>. The API
          server verifies that the requesting user owns the job (or has admin
          access), then calls S3{" "}
          <code>GeneratePresignedUrl(GetObject, TTL=15m)</code> and returns an
          HTTP 302 redirect to the presigned URL.
        </HighlightBlock>
        <p>
          The 15-minute TTL is intentionally short to prevent link sharing and to
          limit exposure if the link leaks. If the user needs more download
          attempts, they simply call the download endpoint again to get a fresh
          presigned URL (the S3 object is still live for 7 days).
        </p>
        <p>
          For very large files (&gt;1 GB) the client should use an HTTP client
          that supports range requests so the download can be resumed if the
          connection drops. The presigned URL supports this natively (S3 allows{" "}
          <code>Range</code> headers on presigned GET URLs).
        </p>

        <h3>Scheduled Exports (Cron Pipeline)</h3>
        <p>
          Recurring reports (daily sales summary, weekly active users) are
          configured as schedule definitions stored in a{" "}
          <code>scheduled_exports</code> table:
        </p>
        <ul>
          <li>
            <code>cron_expression</code> — standard cron (e.g.,{" "}
            <code>0 8 * * 1</code> = Monday 08:00 UTC).
          </li>
          <li>
            <code>report_template_id</code> — references a report type with
            pre-defined filters, columns, and format.
          </li>
          <li>
            <code>delivery</code> — email list or webhook URL for delivery.
          </li>
        </ul>
        <HighlightBlock as="p" tier="important">
          A cron service (Kubernetes CronJob or a scheduler embedded in the
          orchestrator) evaluates due schedules every minute. For each due
          schedule it issues a <code>POST /exports</code> with the template
          parameters, creating a normal async export job. The delivery config is
          attached to the job so the notification service knows where to send the
          finished file link.
        </HighlightBlock>
        <p>
          This design means scheduled exports have identical reliability and
          monitoring characteristics as on-demand exports—there is no separate
          code path to maintain.
        </p>

        <h3>PII Masking</h3>
        <HighlightBlock as="p" tier="important">
          Field-level permissions are configured per report type. When the worker
          generates the SELECT query, it applies masking transformations at the
          DB query level rather than in application code:
        </HighlightBlock>
        <ul>
          <li>
            <code>email</code> → <code>CONCAT(LEFT(email, 2), '***@', SPLIT_PART(email, '@', 2))</code>
          </li>
          <li>
            <code>phone</code> → <code>CONCAT('***-***-', RIGHT(phone, 4))</code>
          </li>
          <li>
            Entirely restricted columns are omitted from the SELECT list rather
            than returned and masked in application code (defence in depth: the
            raw value never leaves the DB).
          </li>
        </ul>

        <h3>Quota and Rate Limiting</h3>
        <p>
          Tenants are limited by:
        </p>
        <ul>
          <HighlightBlock as="li" tier="important">
            <strong>Concurrency:</strong> Maximum 2 simultaneous export jobs per
            tenant. Excess requests receive HTTP 429 with a{" "}
            <code>Retry-After</code> header.
          </HighlightBlock>
          <li>
            <strong>Daily row quota:</strong> Redis counter incremented at job
            creation based on estimated row count. Resets at midnight UTC. Exact
            row count is reconciled post-completion.
          </li>
          <li>
            <strong>File size:</strong> S3 object size limit checked post-upload;
            jobs that produce &gt;5 GB are terminated and the user is directed to
            use Parquet format or narrow the filter range.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs and Alternatives</h2>
        <h3>Synchronous Small-File Exports</h3>
        <HighlightBlock as="p" tier="important">
          For exports under 1,000 rows (e.g., a filtered dashboard widget with
          visible rows) a synchronous response (direct file attachment) is
          acceptable and simpler for the client. The two approaches can coexist:
          the API checks <code>estimatedRows &lt;= 1000</code> and, if true, runs
          the query inline and returns a streaming HTTP response with{" "}
          <code>Content-Disposition: attachment</code>. The async pipeline is
          used only for larger exports. This avoids creating job records and
          polling complexity for the majority of export interactions.
        </HighlightBlock>

        <h3>Pre-rendered Cached Reports vs. On-demand</h3>
        <HighlightBlock as="p" tier="important">
          For popular recurring reports (e.g., the same daily summary queried by
          every user), pre-rendering the report once and caching the S3 object
          eliminates redundant DB queries. The trade-off: pre-rendered reports are
          point-in-time snapshots that may be stale. The cache key must incorporate
          all filter parameters and the report generation timestamp. For
          tenant-specific reports with unique filters, pre-rendering is rarely
          beneficial.
        </HighlightBlock>

        <h3>OFFSET Pagination vs. Keyset Pagination</h3>
        <HighlightBlock as="p" tier="important">
          OFFSET pagination is easy to implement but slow at large offsets:
          fetching page 10,000 at 10 K rows/page means skipping 100 M rows. For
          a 10 M-row export this is catastrophic. Keyset pagination using a
          monotonically increasing ID has O(log n) cost per page (index seek).
          The constraint: the data must be sortable by a stable key, and the
          export cannot interleave inserts between pages (which is acceptable for
          exports that represent a point-in-time snapshot).
        </HighlightBlock>

        <h3>Excel vs. CSV for Large Exports</h3>
        <HighlightBlock as="p" tier="important">
          Excel has a hard row limit of 1,048,576 rows per sheet. For exports
          beyond this, either split across multiple sheets (complex, confusing for
          users) or reject Excel and suggest CSV or Parquet. Parquet is superior
          for analytics consumers (BI tools, data lakes) but not human-readable.
          CSV is universally compatible and trivially resumable. The best default
          for large bulk exports is CSV or Parquet; Excel should be limited to
          &lt;500 K rows.
        </HighlightBlock>

        <h3>Spark for Massive Exports</h3>
        <HighlightBlock as="p" tier="important">
          For exports &gt;100 M rows the single-worker streaming approach with a
          cursor becomes a bottleneck (hours). Apache Spark can partition the
          source table by ID range and generate Parquet part files in parallel
          across many executors. The resulting Parquet dataset can be zipped or
          provided as a manifest of S3 part URIs. The trade-off: Spark cluster
          startup overhead (~2–5 minutes) makes it impractical for interactive
          exports; it is appropriate only for large scheduled data dumps.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="crucial">
          A scalable data export system is built on three principles: never block
          the primary write path, never buffer the full result set in memory, and
          never lose partially-completed work. The design achieves this through
          async job processing, cursor-paginated reads from read replicas or OLAP
          stores, streaming S3 multipart upload with per-page checkpointing, and
          presigned URL delivery with short TTLs. Scheduled exports are first-class
          citizens that re-use the same pipeline, eliminating dual code paths.
          At staff level, the interview insight is that export systems impose
          unique read pressure—a single large export can pin a DB connection for
          hours—so isolating exports to dedicated read infrastructure is
          architecturally mandatory, not a nice-to-have optimisation.
        </HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
