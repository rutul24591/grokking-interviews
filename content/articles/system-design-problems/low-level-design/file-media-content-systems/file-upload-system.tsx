"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-file-upload-system",
  title: "Design a File Upload System",
  description:
    "LLD for chunked, resumable file uploads: drag-and-drop ingest, parallel chunk transport, progress UI, retry with backoff, integrity, and accessibility.",
  category: "low-level-design",
  subcategory: "file-media-content-systems",
  slug: "file-upload-system",
  wordCount: 7000,
  readingTime: 37,
  lastUpdated: "2026-04-29",
  tags: ["lld", "file-upload", "chunked", "resumable", "drag-and-drop", "react"],
  relatedTopics: [
    "file-input-system",
    "file-explorer-ui",
    "offline-form-sync-system",
  ],
};

export default function FileUploadSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a file upload system — the
          client-side runtime that takes files from a user
          (via drag-drop, picker, paste, or capture) and
          ships them reliably to a backend with chunked
          transport, resumability across interruptions,
          parallel uploads for throughput, accurate
          progress reporting, and clean retry on failure.
          The component is the workhorse of any product
          that accepts files — document storage,
          attachments, photo uploads, video uploads, bulk
          imports — and the difference between a delightful
          and a frustrating product comes down to how this
          system handles real-world network conditions:
          spotty WiFi, mobile cell handoffs, browser
          backgrounding, server-side hiccups.
        </p>
        <p>
          The hard problems are: chunking files into
          appropriately sized pieces; uploading chunks in
          parallel without saturating the network or
          server; persisting upload state so a refresh or
          tab close doesn&rsquo;t lose progress; resuming
          after disconnect by querying which chunks
          arrived; integrity verification (hashes match
          server-side); progress reporting that&rsquo;s
          accurate including for the resumed-from-50%
          case; backpressure when the server is
          overloaded; and accessibility for the upload
          UI. The component is more about networking and
          state machines than UI; getting the resilience
          right is what separates production-grade upload
          from prototype-grade upload.
        </p>

        <h3>User Context</h3>
        <p>
          End users upload files of all sizes — from a
          1KB CSV to a 5GB video. They expect the upload
          to start immediately, show clear progress, and
          recover gracefully from network blips without
          forcing them to start over. Internal users
          (engineers integrating the system) consume the
          uploader through a hook-based API: declare a
          target endpoint, optional configuration
          (chunk size, parallelism, retry policy), and a
          progress callback; the runtime handles the
          orchestration.
        </p>

        <h3>Assumptions</h3>
        <p>
          The backend supports a chunked upload protocol
          (custom or via tus.io / S3 multipart) with
          resumability semantics — the client can ask
          which chunks have arrived. Per-chunk size is
          configurable (typically 5–10 MB; smaller for
          mobile, larger for desktop). Files can be up to
          several GB. Modern browsers; we use
          <code> File.slice</code> for chunking,
          <code> SubtleCrypto</code> for hashing,
          <code> fetch</code> with abort signals for
          requests, IndexedDB for state persistence, and
          Background Fetch where available for resilience
          across tab close.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement the backend chunked upload
          protocol — we consume one. We do not implement
          the file ingest UI (drag-and-drop zone, file
          picker, validation) — that&rsquo;s the File
          Input System. We do not implement post-upload
          processing (transcoding, virus scanning,
          thumbnail generation) — those are server
          concerns we don&rsquo;t orchestrate from the
          client.
        </p>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Accept files from any source (typically the File
          Input System emits FileEntry items; we consume
          them). Initiate upload immediately on add.
          Chunk each file into configurable-size pieces.
          Upload chunks in parallel (configurable
          concurrency, typically 3–6 per file plus a
          per-batch global cap). Per-chunk retry with
          exponential backoff on network errors. Compute
          per-chunk hash (or per-file hash) for integrity.
          Resume after disconnect by asking the server
          which chunks have arrived. Progress reporting:
          per-chunk and per-file. Pause and resume
          actions per file. Cancel per file (aborts
          in-flight chunks). Persistence: upload state
          survives reload (queued, in-progress, completed
          chunks reconcile on next mount).
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Background uploads via Service Worker
          Background Fetch where available, so uploads
          continue after tab close. Bandwidth throttling
          (user-configurable cap so uploads don&rsquo;t
          starve other network activity). Direct-to-S3
          (presigned URLs) integration. Server-side
          deduplication (skip uploading chunks the server
          already has from another user). Drag-and-drop
          reordering of upload queue (prioritize this
          file). Adaptive chunking (start small, grow if
          conditions are good).
        </p>

        <h3>Out of Scope</h3>
        <p>
          The drag-and-drop UI for ingesting files (File
          Input System), post-upload server processing,
          file storage architecture, audit logging.
        </p>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Throughput maximizes available bandwidth via
          parallel chunks. Hashing runs in a Web Worker
          so the main thread stays free. Progress updates
          throttled to ~10 fps so they don&rsquo;t flood
          React. Upload starts within ~100 ms of file add.
        </p>

        <h3>Reliability</h3>
        <p>
          Network failures recovered via retry + backoff.
          Resumability across refresh, tab close, and
          device sleep. At-most-once semantics from the
          user&rsquo;s perspective: an upload completed
          state means the server has the complete file.
          Integrity verification end-to-end (client hash
          matches server hash).
        </p>

        <h3>Security</h3>
        <p>
          Upload requests authenticated. CSRF tokens or
          signed URLs prevent unauthorized uploads.
          Per-chunk hashes detect tampering. Content-Type
          enforced server-side. Quota and rate limits
          per user.
        </p>

        <h3>Accessibility</h3>
        <p>
          Upload progress announces via polite live
          region. Pause, resume, cancel actions are
          keyboard-accessible with proper labels. Upload
          status is perceivable without color (icons +
          text).
        </p>

        <h3>Maintainability</h3>
        <p>
          The orchestrator is a state machine; transitions
          are exhaustively testable. Adapters for
          different backend protocols (tus, S3 multipart,
          custom). Configuration declarative.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/file-upload-widget-architecture.svg"
        alt="File Upload System Architecture"
        caption="File ingest → Chunker (File.slice) → Hash worker → Upload queue with concurrency cap → Per-chunk uploader (fetch + AbortController + retry/backoff) → Server resume probe on reconnect → Progress aggregator. State persists to IndexedDB so refresh resumes mid-upload."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The system is structured as a <strong>per-file
          state machine</strong> orchestrating a
          <strong> chunked upload pipeline</strong>: file
          → chunks → hash → parallel uploads → completion.
          State persists to IndexedDB so any interruption
          can resume. The pipeline reuses well-known
          primitives (Promise pools, AbortController, fetch
          retry) but combines them carefully for
          resilience.
        </p>
        <p>
          On <strong>file add</strong>, the orchestrator
          creates an upload record:{" "}
          <code>{` { id, file, status: "queued", chunks: [...], totalBytes, uploadedBytes } `}</code>.
          The chunks array enumerates the chunk index,
          size, and status (pending, uploading, complete,
          error). The record is persisted to IndexedDB.
          The orchestrator then transitions to
          <code> initializing</code>: it asks the server
          to create the upload session (protocol-specific
          request that returns an upload id and any
          server-side capabilities). On success, the
          record gets the upload id and transitions to
          <code> hashing</code>.
        </p>
        <p>
          On <strong>hashing</strong>, we compute per-chunk
          hashes in a Web Worker via SubtleCrypto. Hashing
          can run concurrently with early chunk uploads
          for very large files; we don&rsquo;t need to
          finish all hashes before starting. Per-chunk
          hashes go in the chunk record and ship with the
          chunk to the server for integrity verification.
          The whole-file hash is finalized at the end and
          sent in the completion request.
        </p>
        <p>
          On <strong>uploading</strong>, the orchestrator
          maintains a chunk queue per file and a
          concurrency cap. Up to N chunks (default 4)
          upload in parallel per file; a global cap (e.g.
          12 across all files) prevents one bulk upload
          batch from saturating. Each chunk upload is
          a fetch with the chunk body and the chunk hash
          in headers; on success, mark complete; on
          failure, retry with exponential backoff (1s,
          2s, 4s, capped at 30s). After several failures,
          mark the chunk error and surface a Retry action.
          The orchestrator picks the next pending chunk
          from the queue when one completes.
        </p>
        <p>
          On <strong>chunk complete</strong>, update
          uploadedBytes for progress calculation. When all
          chunks complete, send a completion request to
          the server with the whole-file hash. The server
          verifies hashes and stitches chunks. On success,
          transition to <code>complete</code>; on failure
          (hash mismatch), the orchestrator can identify
          which chunk failed via per-chunk verification
          and re-upload only that chunk.
        </p>
        <p>
          <strong>Resume after disconnect</strong>: on
          mount or after a network reconnect, the
          orchestrator reads the persisted upload records
          from IndexedDB. For each in-progress upload, it
          probes the server for the current state
          (which chunks have arrived; what&rsquo;s the
          server-side completion state). The local record
          reconciles with the server&rsquo;s view: chunks
          marked complete locally that the server doesn&rsquo;t
          have are reset to pending; chunks marked pending
          locally that the server has are marked complete
          (saving the upload). The upload then continues
          from where it left off.
        </p>
        <p>
          <strong>Pause and resume</strong>: pause sets
          the upload status to
          <code> paused</code>, aborts in-flight chunks
          via AbortController. The chunks revert to
          pending. Resume restarts the upload from the
          first pending chunk. Cancel sets status to
          <code> cancelled</code>, aborts all chunks,
          asks the server to delete any partial data, and
          removes the persisted record.
        </p>
        <p>
          <strong>Background Fetch</strong>: where
          supported (Chromium-based browsers as of 2025),
          we register the upload as a Background Fetch via
          a Service Worker. The Service Worker continues
          the upload after tab close. On tab reopen, we
          query Background Fetch state and resume
          orchestration. This is the gold standard for
          resilience but isn&rsquo;t universally available;
          the IndexedDB-based resume covers the rest.
        </p>
        <p>
          <strong>Adaptive parallelism</strong>: we monitor
          per-chunk upload duration. If chunks are taking
          significantly longer than expected (suggesting
          bandwidth saturation), reduce concurrency. If
          chunks are completing very fast (suggesting
          headroom), cautiously increase concurrency up
          to the cap. This adapts to varying network
          conditions without user intervention.
        </p>
        <p>
          <strong>Progress reporting</strong> aggregates per
          file (sum of uploaded bytes / total bytes) and
          per batch (sum across files). Reporting throttles
          to ~10 fps so React doesn&rsquo;t flood with
          updates; intermediate progress is collapsed.
          Time-remaining estimates use a rolling-window
          throughput average.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>UploadOrchestrator</strong> is the
          per-file state machine; tracks chunks,
          concurrency, retries.
          <strong> ChunkPipeline</strong> handles slicing,
          hashing (off-main), uploading (fetch with
          abort).
          <strong> RetryPolicy</strong> implements
          exponential backoff with jitter.
          <strong> PersistenceAdapter</strong> stores
          state in IndexedDB.
          <strong> ProtocolAdapter</strong> abstracts the
          backend protocol (tus, S3 multipart, custom).
          <strong> ServiceWorkerBridge</strong> handles
          Background Fetch where available.
          <strong> ProgressAggregator</strong> computes
          and throttles progress events.
          <strong> UploadList</strong> is the UI
          component listing active uploads with controls.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Upload records (per file) live in the
          orchestrator&rsquo;s external store and mirror
          to IndexedDB. UI subscribes via selector hooks
          per upload id. Progress aggregates are
          throttled-published to subscribers. Service
          Worker state (when applicable) syncs back to
          the main-thread store on visibility change.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Public API:{" "}
          <code>{` upload(file, options) → { id, status, progress, pause, resume, cancel } `}</code>.
          Protocol adapter contract:
          <code>{` { initSession, uploadChunk, complete, probe, abort } `}</code>.
          Each method returns a Promise; abort signals
          accepted for cancellation.
        </p>
      </section>

      <section>
        <h2>⚡ Performance Strategy</h2>
        <p>
          Hashing in a Web Worker keeps the main thread
          free for input. Chunk concurrency parallelizes
          throughput up to network capacity. Adaptive
          parallelism adjusts to conditions. Progress
          reporting throttled at the source. IndexedDB
          writes are debounced (one per chunk completion
          batch). Memory is bounded: we only hold the
          current chunk(s) in memory; the rest stays as
          File references with offsets.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Each upload renders as a row with name,
          progress bar, percentage, time remaining,
          pause/resume/cancel buttons, and status (queued,
          uploading, paused, complete, error). Errors
          surface inline with a Retry action; the upload
          stays in the list. Completed uploads optionally
          fade out after a delay or remain for the
          session. Bulk operations (pause all, cancel
          all) are available when many uploads are
          active.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Each upload row has an accessible name (the
          filename). Progress bars use
          <code> role=&quot;progressbar&quot;</code> with
          <code> aria-valuenow</code>. Pause, Resume,
          Cancel are real buttons with labels.
          Status changes (started, paused, completed,
          failed) announce via polite live region with
          throttling so we don&rsquo;t flood. Keyboard
          access for all controls.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Authenticated requests (session cookie or
          token). CSRF tokens for cookie-based auth.
          Per-chunk hashes detect tampering in transit.
          Server-side authorization on every chunk
          (the upload session is tied to a user; the
          server rejects chunks for sessions the user
          doesn&rsquo;t own). Quota enforcement
          server-side. Content-Type sniffing server-side
          to prevent type-spoofing attacks.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for the state machine: every
          transition (queued → initializing → hashing →
          uploading → complete; pause/resume; cancel;
          retry). Chunking correctness for representative
          file sizes. Hashing correctness against
          reference vectors. Retry/backoff timing.
          Integration tests with a mock server: simulate
          chunk failures, verify retry; simulate
          disconnect, verify resume on reconnect; simulate
          tab close (with persistence verification).
          End-to-end tests in real browsers for Background
          Fetch. Performance tests for concurrent
          large-file uploads.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases &amp; Failure Handling</h2>
        <p>
          Mid-upload disconnect: orchestrator detects via
          fetch error, transitions to
          <code> waiting-for-network</code>, retries on
          online event, probes server, resumes from
          missing chunks. Tab refresh during upload:
          IndexedDB has the state; on next mount,
          re-load and continue. Server returns
          unexpected error mid-upload: surface error,
          allow retry; don&rsquo;t silently corrupt.
          File deleted from disk while uploading
          (browser-specific, rare): we detect via fetch
          error, surface a clear message. Network goes
          from WiFi to cellular: continues on cellular;
          adaptive parallelism may downshift. Hash
          mismatch on completion: server rejects; we
          identify which chunk via per-chunk hash, re-
          upload only that one. Upload completes but
          server post-processing fails (e.g., transcoding
          error): the upload itself is complete from our
          perspective; server-side concern surfaces
          separately. Concurrent uploads from two tabs
          for the same file: each tab has its own
          upload session; the second is independent or
          (with deduplication) recognizes the first&rsquo;s
          progress and joins. Quota exceeded server-side
          mid-upload: server rejects; we surface and
          allow user action.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability &amp; Extensibility</h2>
        <p>
          Protocol adapter lets us plug in any backend
          chunked upload protocol. Custom progress
          renderers. Custom retry policies. The
          orchestrator is generic over file source —
          works for files from a picker, a drop zone, a
          paste, a programmatic add.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Status strings, action labels, time-remaining
          estimates via i18n. File sizes formatted via
          <code> Intl.NumberFormat</code>. RTL flips the
          progress bar direction via CSS logical
          properties.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Chunked vs single-request upload</h3>
        <p>
          Chunked is essential for resumability and
          parallel throughput; single-request is simpler
          but breaks for large files and any
          interruption. We always chunk; the chunk size
          is configurable.
        </p>

        <h3>Per-chunk hashes vs whole-file hash only</h3>
        <p>
          Per-chunk hashes localize integrity failures —
          if one chunk corrupts in transit, we know
          which and re-upload only that. Whole-file hash
          alone forces re-uploading everything on
          mismatch. We use both: per-chunk for
          localization, whole-file for end-to-end
          verification.
        </p>

        <h3>Adaptive vs fixed parallelism</h3>
        <p>
          Adaptive responds to varying network
          conditions; fixed is simpler but suboptimal
          on bad networks. We adaptive with a cap to
          prevent runaway concurrency.
        </p>

        <h3>IndexedDB persistence vs memory-only</h3>
        <p>
          IndexedDB enables resume across refresh and
          tab close. Memory-only would lose progress.
          Persistence is essential for any non-trivial
          upload flow.
        </p>

        <h3>Background Fetch vs in-tab uploads only</h3>
        <p>
          Background Fetch via Service Worker continues
          uploads after tab close — ideal but not
          universally supported. We layer it as an
          enhancement; the IndexedDB resume covers the
          baseline.
        </p>

        <h3>Direct-to-S3 vs through-server uploads</h3>
        <p>
          Direct-to-S3 (presigned URLs) bypasses the
          application server, scales independently,
          reduces server load. Through-server gives
          finer control (auth, scanning) at the cost of
          throughput. Choose per product; the protocol
          adapter handles either.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          WebTransport for lower-latency streams.
          Compression of compressible files (text,
          structured data) before upload. Smart
          deduplication: skip chunks the server already
          has via content-addressable storage. Estimated
          finish time improvements via per-network-type
          modeling. Cross-tab upload sharing (multiple
          tabs see the same upload progress).
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. Why chunk uploads?</strong> Chunking
          enables resumability (re-upload only failed
          chunks), parallelism (multiple chunks at
          once), and bounded retry (smaller units mean
          smaller failure cost). Single-request uploads
          break at the first interruption for any
          large file.
        </p>

        <p>
          <strong>2. How does resume after disconnect
          work?</strong> Persist upload state to
          IndexedDB. On reconnect, probe the server to
          ask which chunks have arrived. Reconcile
          local and server state. Continue from the
          first missing chunk.
        </p>

        <p>
          <strong>3. How is integrity verified?</strong>{" "}
          Per-chunk hashes (SHA-256) shipped with each
          chunk; server verifies. Whole-file hash sent
          on completion; server verifies the assembled
          file. Per-chunk failures localize the problem
          to one chunk for re-upload.
        </p>

        <p>
          <strong>4. How do you handle concurrency without
          saturating the network?</strong> Configurable
          per-file concurrency (default 4) plus a
          global cap across all uploads (default 12).
          Adaptive parallelism adjusts based on
          observed chunk durations.
        </p>

        <p>
          <strong>5. How does background upload after tab
          close work?</strong> Where supported,
          Background Fetch via a Service Worker. The
          service worker continues the upload
          independently. On tab reopen, we query its
          state and resume orchestration. Where not
          supported, IndexedDB-based resume kicks in
          on next mount.
        </p>

        <p>
          <strong>6. How is progress accurate including
          for resumed uploads?</strong> The orchestrator
          tracks completed bytes (sum of completed
          chunk sizes). On resume, we know which chunks
          were complete from server probe; progress
          starts at the right point.
        </p>

        <p>
          <strong>7. What happens on retry-spam (server
          5xx loop)?</strong> Exponential backoff with
          jitter and a max retry count. After max
          retries, mark the chunk error; user must
          explicitly Retry. This prevents the client
          from hammering an unhealthy server.
        </p>

        <p>
          <strong>8. How does this scale to many concurrent
          uploads?</strong> Global concurrency cap
          serializes excess uploads. Per-file
          concurrency parallelizes within budget.
          Memory is bounded (chunks held only when
          active). The orchestrator scales linearly
          with active upload count.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A file upload system is a{" "}
          <strong>per-file state machine</strong>{" "}
          orchestrating a chunked, parallel,
          resumable upload pipeline with persisted
          state. Chunking enables resumability and
          parallelism; per-chunk hashes give
          integrity localization; IndexedDB
          persistence covers refresh and tab close;
          Service Worker Background Fetch covers
          tab-close-and-leave when available; adaptive
          parallelism handles varying network
          conditions. The result is uploads that
          feel reliable: nothing is lost, progress
          is accurate, and recovery is automatic
          across the messy real-world conditions
          users face.
        </p>
      </section>
    </ArticleLayout>
  );
}
