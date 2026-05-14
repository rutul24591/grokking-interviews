"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";

const metadata = {
  id: "article-hld-bulk-data-import-system",
  title: "Design a Bulk Data Import System (CSV/Excel Uploads)",
  description:
    "End-to-end design of a production-grade bulk import pipeline: presigned S3 uploads, async worker validation, streaming batch ingestion, idempotency, error reporting, and retry semantics for millions of rows.",
  category: "high-level-design",
  subcategory: "data-import-export-systems",
  slug: "bulk-data-import-system",
  wordCount: 5000,
  readingTime: 18,
  lastUpdated: "2026-05-14",
  readTime: "18 min read",
  difficulty: "Advanced",
  tags: ["ETL", "S3", "Async Jobs", "Idempotency", "Bulk Import"],
};

export default function BulkDataImportSystem() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">
          Bulk data import sits at the intersection of file handling, distributed
          job processing, database write amplification, and user experience. The
          naive approach—receiving a file in a synchronous HTTP request and
          inserting rows inline—fails at scale: timeouts kill large uploads,
          parsing blocks the API thread, and a single bad row may abort an
          otherwise valid million-row file. A production-grade system must handle
          each concern independently.
        </HighlightBlock>
        <p>
          Before diving into design, clarify scope with the interviewer:
        </p>
        <ul>
          <li>
            <strong>File types and size:</strong> CSV, Excel (.xlsx), JSON lines,
            or Parquet? Typical enterprise ceiling is 200 MB / 1 M rows. Larger
            files need a different chunked-upload protocol.
          </li>
          <li>
            <strong>Latency expectations:</strong> Is near-real-time ingestion
            required, or is a best-effort async job (minutes) acceptable?
          </li>
          <li>
            <strong>Conflict handling:</strong> Insert-only, upsert (update
            existing records), or de-duplicate?
          </li>
          <li>
            <strong>Error policy:</strong> Abort on the first error, collect
            errors and continue, or abort once an error-rate threshold is
            exceeded?
          </li>
          <li>
            <strong>Column mapping:</strong> Does the client supply field mappings
            at request time, or are columns inferred from the header row?
          </li>
          <li>
            <strong>Tenancy:</strong> Single-tenant SaaS vs. multi-tenant with
            per-tenant quotas and isolation?
          </li>
        </ul>
        <p>
          For this design we assume: CSV and Excel, up to 200 MB / 1 M rows,
          async job with &lt; 5-minute SLA for 100 K rows, upsert semantics,
          collect-and-report error policy with a 5% abort threshold, client-supplied
          column mappings, and multi-tenant with per-tenant row quotas.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3>Functional</h3>
        <ul>
          <li>
            Client uploads a file (CSV or Excel) and receives a{" "}
            <code>jobId</code> immediately; the actual processing happens
            asynchronously.
          </li>
          <li>
            Client can poll or receive SSE push for job progress (% rows
            validated, % rows inserted, error count).
          </li>
          <li>
            Rows are validated against a schema derived from client-supplied
            column mappings (required fields, type constraints, value ranges).
          </li>
          <li>
            Valid rows are bulk-upserted into the target table; invalid rows are
            collected in an error report downloadable as a CSV.
          </li>
          <li>
            If the error rate exceeds 5% the job aborts; otherwise, it continues
            and reaches a &ldquo;partial&rdquo; completion state.
          </li>
          <li>
            The operation is idempotent: re-submitting the same file produces the
            same outcome without duplicating rows.
          </li>
          <li>
            Failed jobs can be retried from the last committed checkpoint without
            re-uploading the file.
          </li>
        </ul>
        <h3>Non-functional</h3>
        <ul>
          <li>
            <strong>Throughput:</strong> 100 K rows / minute per worker; 10 K
            rows / minute end-to-end for a 1 M-row file under a 10-minute SLA.
          </li>
          <li>
            <strong>Reliability:</strong> At-least-once delivery with idempotent
            writes; no row is silently dropped.
          </li>
          <li>
            <strong>Isolation:</strong> One tenant&rsquo;s large job must not
            starve other tenants; dedicated worker pools or fair-share scheduling.
          </li>
          <li>
            <strong>Scalability:</strong> Horizontally scalable worker pool; each
            worker is stateless beyond a local streaming buffer.
          </li>
          <li>
            <strong>File retention:</strong> S3 source file kept for 7 days after
            job completion; error CSV kept 30 days.
          </li>
        </ul>
      </section>

      <section>
        <h2>High-Level Design</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-import-export-systems/bulk-data-import-system.svg"
          alt="Bulk Data Import System sequence diagram"
          caption="Upload → Validate → Ingest pipeline with async workers, S3 streaming, and error reporting"
        />
        <p>
          The pipeline has four distinct stages, each independently scalable:
        </p>
        <ol>
          <HighlightBlock as="li" tier="important">
            <strong>Upload:</strong> Client obtains a presigned S3 PUT URL and
            streams bytes directly to S3, bypassing the API server entirely. The
            API creates an import job record in the database and returns a{" "}
            <code>jobId</code> with HTTP 202 before the upload even begins.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Validate:</strong> A worker dequeues the job, streams the S3
            file in 10 MB chunks, validates each row&rsquo;s schema and types,
            and records errors with row numbers. It aborts early if the error rate
            exceeds 5%.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Ingest:</strong> Valid rows are batched in 1,000-row chunks
            and bulk-upserted using <code>INSERT … ON CONFLICT DO UPDATE</code>.
            Each batch is committed transactionally. Progress is published via SSE
            after each commit.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Completion:</strong> Job record is updated to{" "}
            <code>completed</code> or <code>partial</code>. An error-report CSV
            is written to S3 and a notification is sent via email or webhook with
            a presigned download link.
          </HighlightBlock>
        </ol>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3>Upload: Presigned S3 PUT</h3>
        <HighlightBlock as="p" tier="important">
          The client calls <code>POST /imports</code> with metadata: file name,
          estimated row count, column mappings (source column → target field name
          and type), and conflict resolution policy (<code>upsert</code> or{" "}
          <code>skip</code>). The API server:
        </HighlightBlock>
        <ol>
          <li>
            Checks the tenant&rsquo;s per-month row quota against a counter in
            Redis (<code>INCRBY</code> with a <code>GET</code> check first).
            Rejects with HTTP 429 if exceeded.
          </li>
          <li>
            Creates an import job row with <code>status=awaiting_upload</code>,
            stores column mappings as JSONB.
          </li>
          <li>
            Calls S3 <code>CreatePresignedUrl</code> for a PUT with a 60-minute
            expiry and a max-content-length policy (200 MB).
          </li>
          <li>
            Returns HTTP 202 <code>&#123;jobId, uploadUrl&#125;</code>.
          </li>
        </ol>
        <HighlightBlock as="p" tier="important">
          The client uploads directly to S3. On completion it calls{" "}
          <code>POST /imports/&#123;jobId&#125;/start</code>, which transitions
          the job to <code>status=queued</code> and enqueues a message to the
          worker queue containing the S3 key and jobId. This two-step handshake
          (upload first, then start) ensures the file is fully written before the
          worker begins.
        </HighlightBlock>
        <p>
          For very large files (&gt;100 MB) the client may use S3 multipart upload
          with the presigned URL set accordingly. The API does not need to change;
          S3 handles reassembly before the worker streams it.
        </p>

        <h3>Job Queue and Worker Architecture</h3>
        <HighlightBlock as="p" tier="important">
          Jobs are placed on an SQS FIFO queue partitioned by tenant. Each tenant
          gets a MessageGroupId, ensuring tenant-level ordering while allowing
          parallel execution across tenants. A fleet of stateless worker pods
          (Kubernetes Deployments) long-poll the queue. Workers are autoscaled
          based on queue depth (target: &lt; 2-minute queue wait).
        </HighlightBlock>
        <p>
          To avoid one large job blocking a tenant&rsquo;s subsequent smaller
          jobs, the orchestrator maintains a per-tenant in-flight limit (default:
          2 concurrent jobs). Overflow jobs stay queued without blocking other
          tenants.
        </p>

        <h3>Streaming File Parse</h3>
        <HighlightBlock as="p" tier="important">
          Workers stream the S3 object using a range-request or streaming SDK
          (e.g., <code>S3.GetObject</code> → Node.js stream). Files are never
          fully buffered in memory. The parse pipeline:
        </HighlightBlock>
        <ul>
          <li>
            <strong>CSV:</strong> Pipe through a streaming CSV parser (papaparse
            in streaming mode, or fast-csv). Each row is emitted as a JavaScript
            object.
          </li>
          <li>
            <strong>Excel (.xlsx):</strong> ExcelJS streaming reader reads one row
            at a time. Streaming Excel parsing uses the SAX-based approach under
            the hood; the full sheet is never materialised.
          </li>
          <HighlightBlock as="li" tier="important">
            Memory buffer: at most two 10 MB chunks in flight simultaneously
            (current chunk being parsed + next chunk being fetched). Total worker
            heap consumption: &lt; 50 MB regardless of file size.
          </HighlightBlock>
        </ul>

        <h3>Validation Engine</h3>
        <HighlightBlock as="p" tier="important">
          For each row the worker evaluates a validation pipeline derived from the
          column mappings supplied at job creation:
        </HighlightBlock>
        <ul>
          <li>
            <strong>Required fields:</strong> Reject if the mapped column is
            empty or null when the target field has NOT NULL constraint.
          </li>
          <li>
            <strong>Type coercion:</strong> Attempt to parse strings to the target
            type (integer, float, date ISO-8601, boolean). Record a type error if
            coercion fails.
          </li>
          <li>
            <strong>Value constraints:</strong> Enum membership, max-length, range
            checks defined in the mapping schema.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Referential integrity hints:</strong> Optional foreign-key
            lookup cache (loaded at job start) to flag dangling references without
            a DB round-trip per row.
          </HighlightBlock>
        </ul>
        <p>
          Valid rows flow to the ingest buffer. Invalid rows are appended to an
          in-memory error accumulator (row number, column name, error message).
          After every 10,000 rows, the error accumulator is flushed to a
          staging table; the error count is compared to total rows processed. If
          the ratio exceeds 5%, the job transitions to{" "}
          <code>status=failed</code> and the worker stops. Otherwise it continues
          until EOF.
        </p>

        <h3>Bulk Upsert with Idempotency</h3>
        <p>
          Validated rows are assembled into batches of 1,000. Each batch is
          inserted using a single parameterised{" "}
          <code>INSERT … ON CONFLICT (natural_key) DO UPDATE SET …</code>{" "}
          statement. This provides:
        </p>
        <ul>
          <li>
            <strong>Throughput:</strong> A single DB round-trip per 1,000 rows
            rather than 1,000 individual inserts.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Idempotency:</strong> If the worker crashes mid-batch and
            re-processes from the last committed checkpoint, re-inserting already-
            upserted rows produces no duplicates (the ON CONFLICT clause updates
            to the same value).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Checkpoint tracking:</strong> After each commit the worker
            updates <code>jobs.last_committed_row_index</code> in the same
            transaction. On retry, the worker seeks to{" "}
            <code>last_committed_row_index + 1</code> in the S3 object via a
            byte-offset map built during parsing.
          </HighlightBlock>
        </ul>
        <p>
          For Postgres the idempotency key is the composite natural key (e.g.,{" "}
          <code>(tenant_id, external_id)</code>). If no natural key exists, a
          deterministic key is derived from <code>(jobId, rowIndex)</code> to
          guarantee stable upsert targets across retries.
        </p>
        <p>
          When using PostgreSQL COPY for maximum throughput (typically 3–5×
          faster than parameterised INSERT), idempotency requires a staging
          table:
        </p>
        <ol>
          <li>
            COPY 1,000 rows into a temp table{" "}
            <code>import_staging_&#123;jobId&#125;</code>.
          </li>
          <li>
            Execute <code>INSERT … SELECT FROM staging ON CONFLICT DO UPDATE</code>.
          </li>
          <li>Truncate staging table; commit.</li>
        </ol>
        <p>
          This staging pattern also enables pre-commit validation hooks (e.g., FK
          checks against live data) before rows touch the target table.
        </p>

        <h3>Progress Reporting via SSE</h3>
        <p>
          Clients connect to <code>GET /imports/&#123;jobId&#125;/events</code>{" "}
          which opens a Server-Sent Events stream. The API server maintains a
          Redis pub/sub channel keyed by <code>jobId</code>. After each 1,000-row
          batch commit, the worker publishes:
        </p>
        <ul>
          <li>
            <code>&#123;"event":"progress","insertedRows":5000,"totalRows":100000,"errorCount":12&#125;</code>
          </li>
        </ul>
        <p>
          The API server is subscribed and forwards the message to any active SSE
          connections for that job. This decouples the worker from the HTTP layer.
          If no SSE client is connected, messages are buffered in Redis for 60
          seconds to handle reconnects with the <code>Last-Event-ID</code> header.
        </p>
        <p>
          For polling clients, <code>GET /imports/&#123;jobId&#125;</code> returns
          the current job snapshot from the database: status, insertedRows,
          errorCount, duration.
        </p>

        <h3>Error Report Generation</h3>
        <p>
          The error accumulator staged to the DB during processing is materialised
          into a CSV error report at job completion. The worker executes:
        </p>
        <ol>
          <li>
            <code>SELECT row_num, column_name, error_message FROM import_errors WHERE job_id = $1 ORDER BY row_num</code>
          </li>
          <li>
            Streams the result into an S3 object at{" "}
            <code>imports/errors/&#123;jobId&#125;.csv</code> using multipart
            upload.
          </li>
          <li>
            Stores the S3 key in <code>jobs.error_report_s3_key</code>.
          </li>
        </ol>
        <p>
          Client downloads via <code>GET /imports/&#123;jobId&#125;/errors</code>,
          which returns a presigned S3 URL with a 24-hour TTL. The presigned URL
          avoids routing large download traffic through the API server.
        </p>

        <h3>Retry and Checkpoint Resume</h3>
        <HighlightBlock as="p" tier="important">
          The worker maintains a byte-offset index: for every 10,000th row it
          records the byte offset in the S3 stream. On retry, the worker:
        </HighlightBlock>
        <ol>
          <li>
            Reads <code>jobs.last_committed_row_index</code> from the DB.
          </li>
          <li>
            Looks up the nearest recorded byte offset at or before that row.
          </li>
          <li>
            Issues an S3 range-request (<code>Range: bytes=&#123;offset&#125;-</code>)
            to skip already-processed data.
          </li>
          <li>
            Skips rows until reaching <code>last_committed_row_index + 1</code>.
          </li>
        </ol>
        <p>
          This ensures O(1) retry cost relative to remaining work, not total file
          size.
        </p>

        <h3>Notification and Webhooks</h3>
        <HighlightBlock as="p" tier="important">
          On job terminal state (completed, partial, failed) the worker enqueues a
          notification event. The notification service reads from this queue and:
        </HighlightBlock>
        <ul>
          <li>
            Sends an email with a summary table (rows inserted, rows failed, error
            report link) if the tenant has email configured.
          </li>
          <li>
            POSTs a webhook payload to the tenant&rsquo;s configured endpoint with
            an HMAC-SHA256 signature. Retries with exponential backoff up to 24
            hours.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs and Alternatives</h2>
        <h3>Synchronous Inline Processing vs. Async Job</h3>
        <HighlightBlock as="p" tier="important">
          Synchronous processing is simpler to implement and easier for clients to
          handle (wait for HTTP 200). However, it fails for files &gt;10 K rows
          due to HTTP timeouts (load balancer default: 60 s), memory pressure on
          the API pod, and the inability to retry partially-completed imports. The
          async job model is strictly superior for any bulk use case.
        </HighlightBlock>

        <h3>Direct-to-API Upload vs. Presigned S3 URL</h3>
        <HighlightBlock as="p" tier="crucial">
          Direct-to-API upload (multipart form POST) keeps the server in the
          data path, which allows instant validation feedback but caps throughput
          at the API server&rsquo;s network bandwidth and memory. Presigned S3 PUT
          offloads all bandwidth to S3 (which handles 5 GB/s per prefix), removes
          memory pressure from API pods, and enables client-side resumable upload
          libraries (AWS S3 Resumable Upload). The main downside: the API cannot
          inspect the file before it reaches S3—content-type and size validation
          must be enforced via S3 pre-signed URL policy conditions.
        </HighlightBlock>

        <h3>ON CONFLICT Upsert vs. COPY for Throughput</h3>
        <HighlightBlock as="p" tier="crucial">
          PostgreSQL COPY is 3–5× faster than parameterised INSERT for bulk loads
          because it bypasses the query planner. The trade-off is that COPY does
          not support ON CONFLICT natively; you need the staging-table pattern
          (add latency, extra storage). For write-once imports (no upsert) COPY is
          the clear winner. For upsert-heavy workloads the staging pattern adds
          ~15% overhead but preserves idempotency.
        </HighlightBlock>

        <h3>Error Threshold Policy</h3>
        <p>
          A fixed 5% threshold is easy to reason about but may be wrong for
          specific use cases: a 1 M-row file might tolerate 50 K errors, while a
          100-row file should abort on the first error. Consider making the
          threshold configurable per import job, or using an absolute-count cap
          (e.g., abort after 5,000 errors regardless of total rows).
        </p>

        <h3>Quota Enforcement</h3>
        <HighlightBlock as="p" tier="important">
          Enforcing row quotas at job creation time (based on the estimated row
          count) is simple but inaccurate—the estimate may differ from the actual
          count. Alternatively, enforce quota atomically during ingestion using a
          Redis INCRBY per committed batch, and roll back partial quota if the job
          fails. The ingest-time approach is more accurate but adds a Redis
          round-trip per batch.
        </HighlightBlock>

        <h3>Spark / Flink for Very Large Files</h3>
        <HighlightBlock as="p" tier="important">
          For files in the GB range (tens of millions of rows), a single-worker
          streaming approach may be too slow. Apache Spark or Flink can split S3
          files across many executors for parallel processing. The trade-off is
          significant operational complexity, higher infrastructure cost, and a
          much longer startup time per job. For files under 200 MB the single-
          worker approach with 10 MB streaming chunks is faster end-to-end due to
          zero orchestration overhead.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="crucial">
          A production bulk import system separates four concerns—upload, validate,
          ingest, notify—into independent stages connected by a job queue. Key
          design decisions are: presigned S3 upload to remove bandwidth pressure
          from the API tier; streaming parse with bounded memory buffers; 1,000-
          row transactional batches with natural-key upsert for idempotency; byte-
          offset checkpointing for O(remaining work) retries; and SSE progress
          events via Redis pub/sub. The error-threshold policy (abort at &gt;5%)
          balances user experience (some bad rows are tolerable) against data
          integrity (a file that is mostly garbage should fail fast). At staff
          level, the key insight is that every stage must be independently
          restartable without duplicating already-committed work—idempotency is not
          a feature, it is the correctness invariant the entire system rests on.
        </HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
