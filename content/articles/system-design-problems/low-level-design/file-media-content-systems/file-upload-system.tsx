"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
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

export default function FileUploadSystemArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a File Upload System</h1><h2>Definition &amp; Context</h2><p>Design a File Upload System is an implementation-heavy low-level design problem covering file intake, validation, preview, multipart session creation, chunk scheduling, pause-resume, retry, checksum verification, and completion. A principal-level answer must explain state ownership, browser or worker boundaries, scale limits, consistency, rollback, privacy, cost, and observability.</p><p>Represent every file as a state machine with stable identity, upload session, confirmed chunk ledger, retry budget, and abort handles. The core structures are file queue, validation result, preview URL, upload session, chunk ledger, checksum, concurrency semaphore, retry schedule, abort controllers, and completion receipt.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/file-media-content-systems/file-upload-system-runtime.svg" alt="Design a File Upload System runtime" caption="Topic-specific runtime from source intake through guarded projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific implementation mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement the backend chunked upload
          protocol — we consume one. We do not implement
          the file ingest UI (drag-and-drop zone, file
          picker, validation) — that&rsquo;s the File
          Input System. We do not implement post-upload
          processing (transcoding, virus scanning,
          thumbnail generation) — those are server
          concerns we don&rsquo;t orchestrate from the
          client.
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          The drag-and-drop UI for ingesting files (File
          Input System), post-upload server processing,
          file storage architecture, audit logging.
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Throughput maximizes available bandwidth via
          parallel chunks. Hashing runs in a Web Worker
          so the main thread stays free. Progress updates
          throttled to ~10 fps so they don&rsquo;t flood
          React. Upload starts within ~100 ms of file add.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Network failures recovered via retry + backoff.
          Resumability across refresh, tab close, and
          device sleep. At-most-once semantics from the
          user&rsquo;s perspective: an upload completed
          state means the server has the complete file.
          Integrity verification end-to-end (client hash
          matches server hash).
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="crucial">
          Upload requests authenticated. CSRF tokens or
          signed URLs prevent unauthorized uploads.
          Per-chunk hashes detect tampering. Content-Type
          enforced server-side. Quota and rate limits
          per user.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          Upload progress announces via polite live
          region. Pause, resume, cancel actions are
          keyboard-accessible with proper labels. Upload
          status is perceivable without color (icons +
          text).
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          The orchestrator is a state machine; transitions
          are exhaustively testable. Adapters for
          different backend protocols (tus, S3 multipart,
          custom). Configuration declarative.
        </HighlightBlock>
      </section>

      

      <section>
        <h3>🧠 Solution Approach</h3>
        <HighlightBlock as="p" tier="important">
          The system is structured as a <strong>per-file
          state machine</strong> orchestrating a
          <strong> chunked upload pipeline</strong>: file
          → chunks → hash → parallel uploads → completion.
          State persists to IndexedDB so any interruption
          can resume. The pipeline reuses well-known
          primitives (Promise pools, AbortController, fetch
          retry) but combines them carefully for
          resilience.
        </HighlightBlock>
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
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>chunk complete</strong>, update
          uploadedBytes for progress calculation. When all
          chunks complete, send a completion request to
          the server with the whole-file hash. The server
          verifies hashes and stitches chunks. On success,
          transition to <code>complete</code>; on failure
          (hash mismatch), the orchestrator can identify
          which chunk failed via per-chunk verification
          and re-upload only that chunk.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
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
        <HighlightBlock as="p" tier="important">
          <strong>Progress reporting</strong> aggregates per
          file (sum of uploaded bytes / total bytes) and
          per batch (sum across files). Reporting throttles
          to ~10 fps so React doesn&rsquo;t flood with
          updates; intermediate progress is collapsed.
          Time-remaining estimates use a rolling-window
          throughput average.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial"><strong> ProtocolAdapter</strong> abstracts the
          backend protocol (tus, S3 multipart, custom).
          <strong> ServiceWorkerBridge</strong> handles
          Background Fetch where available.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important"><strong> ProgressAggregator</strong></Highlight> computes
          and throttles progress events.
          <strong> UploadList</strong> is the UI
          component listing active uploads with controls.</HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="crucial">Progress aggregates are
          throttled-published to subscribers. Service
          Worker</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">state (when applicable) syncs back to
          the main-thread store on visibility change.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="crucial">Public API:{" "}
          <code>{` upload(file, options) → { id, status, progress, pause, resume, cancel } `}</code>.</HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="important">Protocol adapter contract:</Highlight>{" "}
          <code>{` { initSession, uploadChunk, complete, probe, abort } `}</code>. Each
          method returns a Promise; abort signals accepted for cancellation.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance Strategy</h3>
        <HighlightBlock as="p" tier="crucial">IndexedDB
          writes are debounced (one per chunk completion
          batch). Memory is bounded: we</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">only hold the
          current chunk(s) in memory; the rest stays as
          File references with offsets.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="crucial">Completed uploads optionally
          fade out after a delay or remain for the
          session. Bulk</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">operations (pause all, cancel
          all) are available when many uploads are
          active.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">Status changes (started, paused, completed,
          failed) announce via polite live region</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">with
          throttling so we don&rsquo;t flood. Keyboard
          access for all controls.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="crucial">Server-side authorization on every chunk
          (the upload session is tied to a user; the
          server rejects chunks for sessions the user</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">doesn&rsquo;t own). Quota enforcement
          server-side. Content-Type sniffing server-side
          to prevent type-spoofing attacks.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="crucial">Integration tests with a mock server: simulate
          chunk failures, verify retry; simulate
          disconnect, verify resume on reconnect; simulate
          tab close</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">(with persistence verification).
          End-to-end tests in real browsers for Background
          Fetch. Performance tests for concurrent
          large-file uploads.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases &amp; Failure Handling</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">separately. Concurrent uploads from two tabs for the same file: each tab has its own upload</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">session; the second is independent or (with deduplication) recognizes the first&rsquo;s progress and</HighlightBlock>
<HighlightBlock as="p" tier="important">joins. Quota exceeded server-side mid-upload: server rejects; we surface and allow user action.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability &amp; Extensibility</h3>
        <HighlightBlock as="p" tier="crucial">Protocol adapter lets us plug in any backend
          chunked upload protocol. Custom progress
          renderers. Custom retry policies.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">The
          orchestrator is generic over file source —
          works for files from a picker, a drop zone, a
          paste, a programmatic add.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Status strings, action labels, time-remaining
          estimates via i18n. File <Highlight tier="important">sizes formatted via
          </Highlight><code> Intl.NumberFormat</code>. RTL flips</Highlight> the
          progress bar direction via CSS logical
          properties.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Chunked vs single-request upload</h3>
        <HighlightBlock as="p" tier="important">
          Chunked is essential for resumability and
          parallel throughput; single-request is simpler
          but breaks for large files and any
          interruption. We always chunk; the chunk size
          is configurable.
        </HighlightBlock>

        <h3>Per-chunk hashes vs whole-file hash only</h3>
        <HighlightBlock as="p" tier="crucial">
          Per-chunk hashes localize integrity failures —
          if one chunk corrupts in transit, we know
          which and re-upload only that. Whole-file hash
          alone forces re-uploading everything on
          mismatch. We use both: per-chunk for
          localization, whole-file for end-to-end
          verification.
        </HighlightBlock>

        <h3>Adaptive vs fixed parallelism</h3>
        <p>
          Adaptive responds to varying network
          conditions; fixed is simpler but suboptimal
          on bad networks. We adaptive with a cap to
          prevent runaway concurrency.
        </p>

        <h3>IndexedDB persistence vs memory-only</h3>
        <HighlightBlock as="p" tier="important">
          IndexedDB enables resume across refresh and
          tab close. Memory-only would lose progress.
          Persistence is essential for any non-trivial
          upload flow.
        </HighlightBlock>

        <h3>Background Fetch vs in-tab uploads only</h3>
        <HighlightBlock as="p" tier="important">
          Background Fetch via Service Worker continues
          uploads after tab close — ideal but not
          universally supported. We layer it as an
          enhancement; the IndexedDB resume covers the
          baseline.
        </HighlightBlock>

        <h3>Direct-to-S3 vs through-server uploads</h3>
        <HighlightBlock as="p" tier="important">
          Direct-to-S3 (presigned URLs) bypasses the
          application server, scales independently,
          reduces server load. Through-server gives
          finer control (auth, scanning) at the cost of
          throughput. Choose per product; the protocol
          adapter handles either.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="crucial">Estimated
          finish time improvements via per-network-type
          modeling.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Cross-tab upload sharing (multiple
          tabs see the same upload progress).</Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate durable source data, transient interaction state, derived render state, remote or worker effects, and bounded telemetry. Every object URL, request, worker, listener, timer, cache entry, and decoder task needs an explicit owner and cleanup path.</p><p>Represent every file as a state machine with stable identity, upload session, confirmed chunk ledger, retry budget, and abort handles. Commit durable changes only after policy validation and preserve enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/file-media-content-systems/file-upload-system-recovery.svg" alt="Design a File Upload System recovery" caption="Recovery flow: classify failure, preserve stable state, and degrade predictably." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Single-request upload is simplest for small files; multipart resume is justified when file size and unreliable networks make restart cost unacceptable.</p><p>Confirmed chunks are server-authoritative and idempotent. The client resumes only from acknowledged ledger entries; completion requires server verification. Scale pressure comes from multi-gigabyte files, duplicates, flaky networks, expired sessions, refresh recovery, checksum mismatch, quotas, and server backpressure. Bound work, reject stale effects, cap memory, and degrade predictably.</p><p>Use optimistic projection only when rollback is deterministic and visible. Keep authorization, validation, and destructive actions server-side.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, typed states, generation guards, bounded queues, abortable effects, semantic HTML, and idempotent cleanup. Test accessibility, stale work, retries, unmount, constrained devices, large files, and corrupted input.</p><p>Measure latency, memory, queue pressure, stale drops, retries, fallbacks, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include treating rendered output as durable truth, leaking resources, accepting stale worker completion, unbounded prefetch, and hiding degraded behavior.</p><p>For this topic, revoke previews, bound concurrency, refresh sessions, retry transient chunks with jitter, surface terminal rejection, and persist safe resume metadata. Validate untrusted content, authorize durable mutations, and minimize sensitive retention.</p></section>
<section><h2>Real-world use cases</h2><p>This runtime applies to content-heavy product surfaces where browser APIs, workers, networks, and remote policy fail independently. Reuse the controller boundary while injecting product-specific fallback and retention policy.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Represent every file as a state machine with stable identity, upload session, confirmed chunk ledger, retry budget, and abort handles.</p><h3>What breaks at scale?</h3><p>multi-gigabyte files, duplicates, flaky networks, expired sessions, refresh recovery, checksum mismatch, quotas, and server backpressure. I would bound work and reject obsolete effects.</p><h3>What consistency model applies?</h3><p>Confirmed chunks are server-authoritative and idempotent. The client resumes only from acknowledged ledger entries; completion requires server verification.</p><h3>How do you recover?</h3><p>I would revoke previews, bound concurrency, refresh sessions, retry transient chunks with jitter, surface terminal rejection, and persist safe resume metadata.</p><h3>Why this architecture?</h3><p>Single-request upload is simplest for small files; multipart resume is justified when file size and unreliable networks make restart cost unacceptable.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API" target="_blank" rel="noreferrer">MDN Web Workers API</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}
