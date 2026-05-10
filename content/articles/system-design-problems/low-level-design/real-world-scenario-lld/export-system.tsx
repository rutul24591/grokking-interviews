"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-export-system",
  title: "Design Export System (CSV/PDF)",
  description:
    "Production-grade export with format support, async processing, large dataset streaming, and download delivery.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "export-system",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-06",
  tags: ["lld", "export", "csv", "pdf", "async"],
  relatedTopics: ["bulk-editing-ui", "audit-log-viewer-ui"],
};

export default function ExportSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Data export is a fundamental enterprise feature: users need to take their data out of the system for analysis, reporting, archival, or migration. The challenges are format-specific (CSV needs proper escaping, encoding, and column mapping; PDF needs layout, pagination, and styling) and scale-specific (a 1-million-row export cannot be generated synchronously in a 30-second request window). The frontend must handle the async nature of large exports (request → job → poll → download) without making users feel like the export silently failed.</p>
        <p>Security is a cross-cutting concern: an export endpoint that accepts arbitrary filter criteria must apply the same access control as the UI. A user who can see only their team's data in the UI must receive only their team's data in an export—the export system cannot be a backdoor to data they shouldn't access. The export must also apply column-level visibility rules (PII columns may be excluded for certain roles).</p>
        <p><strong>Explicit assumptions:</strong> Exports are user-initiated from a data table or report view. The filters and columns visible in the UI at export time define the export contents. Small exports (under 1000 rows) can be generated synchronously; large exports are async with progress tracking. Files are generated server-side and stored in object storage (S3); the client downloads via a signed URL. File retention is 24 hours.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Format selection:</strong> User chooses CSV or PDF (or Excel/XLSX for financial data). Each format has appropriate generation strategy.</li>
          <li><strong>Column selection:</strong> User selects which columns to include. Respects column-level access control (PII columns hidden for non-admin roles).</li>
          <li><strong>Filter inheritance:</strong> Export applies the same filters currently active in the data view (date range, status, search query).</li>
          <li><strong>Async processing with progress:</strong> For large exports, show progress (rows processed, estimated completion time) while the server generates the file.</li>
          <li><strong>Download delivery:</strong> On completion, trigger browser download via signed URL. Optionally email the link for very long exports.</li>
          <li><strong>Export history:</strong> Show the user's recent exports (last 10) with download links valid for 24 hours.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Small export latency:</strong> Exports under 1000 rows complete within 5 seconds; the download begins without polling.</li>
          <li><strong>Large export scalability:</strong> Exports of 1 million rows complete within 5 minutes; the server streams rows to S3 without loading all rows into memory simultaneously.</li>
          <li><strong>Security:</strong> Exports apply the same RBAC as the UI. Signed URLs expire after 24 hours and require authentication to generate.</li>
          <li><strong>Correctness:</strong> CSV exports properly escape commas, quotes, and newlines in data values. UTF-8 BOM included for Excel compatibility.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>The export flow has a synchronous path (small exports) and an asynchronous path (large exports). On export initiation, the server checks the estimated row count. If below the threshold (1000 rows), it generates the file synchronously, stores it in S3, and returns a signed URL in the response—the browser downloads immediately. If above the threshold, the server creates an export job, returns a jobId with 202 Accepted, and the client polls for progress. On job completion, the signed URL is available in the job status response and the browser initiates the download.</p>
        <p>CSV generation streams rows from the database to S3 in chunks (1000 rows per chunk) to avoid loading the entire dataset into memory. PDF generation uses a headless browser (Puppeteer) or a PDF library (pdfmake) to render the data into a paginated document. Both approaches write the output incrementally to S3 using multipart upload, which allows streaming uploads of arbitrary size.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/export-system.svg"
          alt="Export system showing async pipeline with job creation, worker streaming to S3, SSE progress delivery, signed URL download, and CSV vs PDF generation strategies"
          caption="Export system showing async pipeline with job creation, worker streaming to S3, SSE progress delivery, signed URL download, and CSV vs PDF generation strategies"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Export Job Lifecycle</h3>
        <p>An export job record contains: jobId (UUID), userId, format (csv, pdf, xlsx), status (queued, processing, completed, failed), rowsProcessed, totalRows, s3Key (set on completion), signedUrl (generated on completion, expires 24h), errorMessage (on failure), createdAt, completedAt, and expiresAt (24h after completedAt). The job is inserted into the database when the export request is received and updated as processing progresses.</p>
        <p>Progress updates during processing are published to a Redis pub/sub channel keyed by jobId. The application server subscribes to this channel and streams progress to the client via Server-Sent Events (SSE). This avoids polling the database on every progress check—the worker publishes updates every 5% completion or every 10 seconds (whichever is sooner), and the SSE stream delivers them to the client in real-time.</p>
        <p>On job completion, the worker updates the job record with the final s3Key and generates a pre-signed S3 URL (valid 24 hours). The SSE stream delivers a final "completed" event with the signed URL. The client closes the SSE connection and initiates the download by setting window.location.href to the signed URL (which triggers a browser download without navigation away from the current page, since the S3 URL returns with Content-Disposition: attachment).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">CSV Generation: Streaming and Encoding</h3>
        <p>CSV generation is a database-to-S3 stream. The worker opens a database cursor (a server-side cursor that fetches rows in batches without loading all into memory), processes each batch through a CSV encoder, and uploads the encoded chunks to S3 using S3's multipart upload API. S3 multipart upload allows splitting a file into parts uploaded in separate requests; the file is finalized when all parts are combined. The minimum part size is 5MB; the worker buffers up to 5MB of CSV before uploading a part.</p>
        <p>CSV encoding correctness requires: escaping any field that contains a comma, double-quote, or newline by wrapping the field in double quotes and escaping internal double-quotes as pairs (""). Including a UTF-8 BOM (bytes EF BB BF) at the start of the file so Excel correctly opens the file as UTF-8 (without the BOM, Excel may misinterpret non-ASCII characters). Writing the header row first (column names as specified by the user's column selection). Ensuring dates are formatted consistently (ISO 8601 or the locale's format based on user preference).</p>
        <p>Column access control is applied at the query level: the SQL query only selects columns the user is authorized to see. The user's column selection is intersected with their authorized columns before the query is constructed. Never construct the query using user-provided column names directly (SQL injection risk)—maintain a mapping of display column names to database column names and use the mapped names in the query.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">PDF Generation</h3>
        <p>PDF exports are appropriate for human-readable reports (invoices, compliance reports) rather than data-heavy exports (use CSV for data analysis). PDF generation using Puppeteer renders an HTML template as a headless Chrome page and exports it to PDF. The template applies consistent styling (company branding, page headers, footers, page numbers) and paginates the content automatically. Puppeteer's PDF output supports custom page sizes, margins, and header/footer templates.</p>
        <p>For large PDFs (1000+ rows), Puppeteer memory usage can be significant. Alternatives: pdfmake (a JavaScript library that generates PDFs programmatically without a browser, lower memory but less CSS-rich styling) or reportlab (Python, mature for table-heavy PDFs). For most application-level PDFs, pdfmake provides a good balance: it streams output and has lower memory footprint than Puppeteer. The choice depends on design requirements—if the PDF must match the application's exact visual design, Puppeteer's HTML rendering is hard to beat.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Client-Side Progress UI</h3>
        <p>When an export job is created asynchronously, the client establishes an SSE connection to GET /exports/:jobId/progress. The SSE stream delivers: rowsProcessed and totalRows (for progress bar), status changes (processing → completed/failed), and the final signedUrl on completion. The client renders a modal or sidebar panel showing the progress bar, the estimated completion time (calculated from the current rate: (rowsProcessed / elapsed_seconds) extrapolated to totalRows), and an option to email the download link when ready (for very long exports).</p>
        <p>The progress modal should not block the user from continuing their work. Display it as a non-modal notification panel or a minimizable progress indicator in the corner. The user should be able to close the panel; on close, the job continues server-side. If the user navigates away, an in-progress job should not be cancelled—it runs to completion and the user can access the download from the export history page.</p>
        <p>If the user has no active tab during export generation (they closed the browser), the download link is available in the export history page on their next visit (within the 24-hour expiry window). For very long exports where users are unlikely to wait, offering email delivery of the signed URL when ready is a practical alternative to real-time progress tracking.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Security and Access Control</h3>
        <p>Every export request must be authenticated and authorized. The server extracts the userId from the session and applies the same RBAC rules as the UI: the query WHERE clauses must include the userId or orgId ownership filter. A user requesting an export of "all orders" should receive only the orders they are authorized to view—not all orders in the database. This is enforced at the query layer, not the application layer (do not filter results after fetching all rows—that defeats the purpose and wastes resources).</p>
        <p>Signed S3 URLs expire after 24 hours. They are personal (generated for a specific user's download request) and should not be shared publicly. The download endpoint should validate that the user requesting the download is the same user who created the export job. Generating a new signed URL (after the original expires) requires re-authentication. Export jobs older than 24 hours should show "Download expired. Re-run export" in the export history, not attempt to serve a stale file.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Synchronous versus always-async: some teams simplify by always using the async path (jobId + polling), even for small exports. This eliminates the branching logic but adds latency for small exports (the user waits for polling rather than an immediate download). The better approach is the hybrid: synchronous for small exports (better UX), async for large (necessary for correctness). The row-count threshold should be set conservatively (1000 rows, not 10,000) because generation time depends on query complexity, not just row count.</p>
        <p>SSE versus polling for progress: SSE is simpler for one-way progress delivery (server pushes, client receives). Polling (GET /exports/:jobId every 2 seconds) is simpler to implement and more compatible with environments that don't support SSE (some CDNs and proxies buffer SSE). For export progress, the update frequency is low enough (every 5-10 seconds) that polling is perfectly adequate and eliminates the SSE connection management complexity. Use SSE if real-time progress is important to UX; polling is often sufficient.</p>
        <p>File storage versus streaming download: storing the file in S3 and serving a signed URL is the standard approach. An alternative is streaming the file directly from the server to the client as it's generated (no S3). Streaming is lower latency for small exports and avoids S3 costs but requires the server to maintain the connection for the duration of generation (potentially minutes for large files), which ties up server resources. S3 is the correct choice for large exports; streaming is acceptable only for small ones.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A production export system uses a hybrid approach: synchronous generation and immediate download for small exports, async job processing with SSE progress and signed URL delivery for large ones. CSV exports stream rows from the database to S3 via multipart upload, apply proper CSV encoding (commas escaped, UTF-8 BOM for Excel), and enforce column-level access control at the SQL query layer. PDF exports use pdfmake or Puppeteer for formatted, paginated output. The export job lifecycle (queued → processing → completed/failed) is tracked in the database and streamed to the client via SSE. Security requires applying the same RBAC as the UI at the query layer, not as a post-processing filter. Signed URLs expire after 24 hours; an export history page provides access to recent exports. The user experience should allow closing the progress modal without cancelling the job—exports continue server-side.</p>
      </section>
    </ArticleLayout>
  );
}
