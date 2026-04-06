"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-file-upload-widget",
  title: "Design a File Upload Widget",
  description:
    "Complete LLD solution for a production-grade file upload widget with chunked uploads, resumability, drag-and-drop, progress tracking, parallel uploads, retry logic, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "file-upload-widget",
  wordCount: 3200,
  readingTime: 21,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "file-upload",
    "chunked-upload",
    "resumable",
    "drag-and-drop",
    "progress-tracking",
    "indexeddb",
    "accessibility",
  ],
  relatedTopics: [
    "drag-and-drop",
    "progress-indicators",
    "state-management",
    "blob-handling",
  ],
};

export default function FileUploadWidgetArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable file upload widget for a large-scale web
          application. The widget must allow users to upload files via drag-and-drop
          or file picker, validate file types and sizes before upload, split large
          files into chunks for sequential upload, track per-chunk and per-file
          progress, support resumable uploads across page reloads, handle parallel
          uploads with configurable concurrency, retry failed chunks with exponential
          backoff, and allow users to cancel in-flight uploads. The widget must also
          display file previews (image thumbnails, file-type icons for non-images),
          meet accessibility requirements, and enforce security constraints.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with support for concurrent features.
          </li>
          <li>
            Files can range from a few kilobytes to several gigabytes. Files above
            50 MB should use chunked upload; smaller files upload in a single request.
          </li>
          <li>
            The server provides a pre-signed URL for each chunk, enabling direct
            upload to cloud storage (e.g., AWS S3, GCS).
          </li>
          <li>
            Multiple files can be uploaded simultaneously, with a configurable
            concurrency limit (default: 3 parallel uploads).
          </li>
          <li>
            Upload state (chunk progress, uploadId) persists in IndexedDB so that
            uploads can resume after a page reload or browser crash.
          </li>
          <li>
            The widget must work in both light and dark mode.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Drag-and-Drop Zone:</strong> Users can drag files onto a
            designated drop zone. The zone provides visual feedback (border highlight,
            background color change) on <code>dragover</code> and reverts on
            <code>dragleave</code>.
          </li>
          <li>
            <strong>File Picker:</strong> Users can click the drop zone to open a
            native file picker dialog.
          </li>
          <li>
            <strong>File Validation:</strong> Before upload, files are validated
            against allowed types (MIME type + extension) and maximum size. Invalid
            files are rejected with an error message.
          </li>
          <li>
            <strong>Chunked Upload:</strong> Files above a size threshold (default:
            5 MB per chunk) are split into chunks. Chunks upload sequentially per
            file, preserving order.
          </li>
          <li>
            <strong>Resumable Uploads:</strong> Upload progress (completed chunks,
            uploadId) is stored in IndexedDB. On page reload, the widget detects
            incomplete uploads and offers to resume or discard them.
          </li>
          <li>
            <strong>Progress Tracking:</strong> Per-file progress bar (overall
            percentage) and per-chunk progress indicators are displayed.
          </li>
          <li>
            <strong>Parallel Uploads:</strong> N files upload concurrently (default:
            3). Additional files queue and start when a slot frees up.
          </li>
          <li>
            <strong>Retry Logic:</strong> Failed chunk uploads retry with exponential
            backoff (e.g., 1s, 2s, 4s, 8s) up to a configurable max retry count
            (default: 3). After max retries, the file is marked as failed.
          </li>
          <li>
            <strong>Cancel Upload:</strong> Users can cancel an in-flight upload.
            This aborts the active <code>AbortController</code>, removes the file
            from the queue, and cleans up IndexedDB state.
          </li>
          <li>
            <strong>File Preview:</strong> Image files render a thumbnail preview.
            Non-image files display a type-specific icon (PDF, DOC, ZIP, etc.).
          </li>
          <li>
            <strong>Server Integration:</strong> The widget calls a server API to
            initiate upload (returns <code>uploadId</code> + pre-signed URLs per
            chunk), then uploads each chunk directly to the pre-signed URL.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Chunking a 1 GB file must not block the
            main thread. Use <code>Blob.slice()</code> (lazy, no memory copy) and
            process chunks on demand. UI must remain responsive during upload.
          </li>
          <li>
            <strong>Memory Efficiency:</strong> Do not load entire files into memory.
            Only the current chunk&apos;s Blob is held in memory during upload.
          </li>
          <li>
            <strong>Reliability:</strong> Upload state persists across page reloads.
            Network failures trigger automatic retries. The widget recovers from
            browser crashes.
          </li>
          <li>
            <strong>Accessibility:</strong> File selection works via keyboard (Enter/
            Space on drop zone). Progress bars use <code>role=&quot;progressbar&quot;</code>
            with <code>aria-valuenow</code>, <code>aria-valuemin</code>,
            <code>aria-valuemax</code>. Screen reader announces upload status changes.
          </li>
          <li>
            <strong>Security:</strong> File type validation on the client (MIME type
            + extension). Size limits enforced before upload. CSRF token included in
            the init request. Pre-signed URLs are short-lived (5 minutes).
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for upload state,
            chunk state, file metadata, and store actions.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            User drags a folder instead of files — should reject with a clear message.
          </li>
          <li>
            User drops 100 files at once — should queue all but only process N
            concurrently.
          </li>
          <li>
            Network disconnects mid-upload — retry logic kicks in. If the disconnect
            persists beyond max retries, the file is marked failed.
          </li>
          <li>
            Pre-signed URL expires (5-minute TTL) before chunk uploads — the widget
            must request fresh pre-signed URLs from the server.
          </li>
          <li>
            User navigates away during upload — should prompt a
            <code>beforeunload</code> confirmation. If the user proceeds, state
            persists in IndexedDB for later resume.
          </li>
          <li>
            Browser crashes mid-upload — on next visit, IndexedDB contains incomplete
            upload state. The widget offers resume or discard.
          </li>
          <li>
            Two tabs upload the same file — each tab gets its own
            <code>uploadId</code>. No deduplication across tabs (scope: single tab).
          </li>
          <li>
            File is modified on disk during upload — the Blob reference remains valid
            (File API holds an in-memory handle). The upload proceeds with the original
            file state at the time of selection.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate the <strong>upload state management</strong>
          from the <strong>upload UI rendering</strong> using a global store (Zustand)
          and a component-based rendering strategy. The store manages the file queue,
          chunk progress, retry state, and IndexedDB persistence. It exposes actions
          for adding files, starting uploads, cancelling, and resuming. The rendering
          layer subscribes to the store, renders the drag-drop zone, file list with
          progress bars, and file previews.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Single-request upload (no chunking):</strong> Simplest approach —
            POST the entire file in one request. Fails for large files (timeout,
            memory pressure on server, no resumability). Chunking is necessary for
            files above 50 MB in production systems.
          </li>
          <li>
            <strong>Server-relayed upload:</strong> Client sends chunks to the
            application server, which relays them to S3. Adds server load and latency.
            Pre-signed URLs allow direct-to-S3 upload, offloading bandwidth from the
            application server.
          </li>
          <li>
            <strong>Web Workers for chunking:</strong> Moving chunk management to a
            Web Worker avoids main-thread blocking. However, <code>Blob.slice()</code>
            is lazy and does not copy data, so chunking overhead is minimal. A Web
            Worker adds complexity (message passing, serialization) with marginal
            benefit. Only justified for files above 2 GB.
          </li>
        </ul>
        <p>
          <strong>Why Zustand + IndexedDB + Pre-signed URLs is optimal:</strong>
          Zustand provides lightweight, selector-based global state with zero
          boilerplate. IndexedDB handles structured storage of upload state with
          large capacity (unlike localStorage&apos;s 5 MB limit). Pre-signed URLs
          enable direct-to-storage uploads, eliminating server bandwidth costs and
          reducing latency. This pattern is used by production services like Uppy,
            Transloadit, and AWS Amplify Storage.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of seven modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Upload Store (<code>upload-store.ts</code>)</h4>
          <p>
            Manages the global upload state using Zustand. Exposes actions for adding
            files, starting uploads, cancelling, retrying, and resuming from IndexedDB.
            Handles the upload queue, parallel concurrency, and progress aggregation.
          </p>
          <p className="mt-3">
            <strong>State shape:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>files: Map&lt;string, UploadFile&gt;</code> — keyed by fileId
            </li>
            <li>
              <code>queue: string[]</code> — ordered array of fileIds waiting to start
            </li>
            <li>
              <code>activeCount: number</code> — currently uploading files
            </li>
            <li>
              <code>concurrencyLimit: number</code> — max parallel uploads (default: 3)
            </li>
          </ul>
          <p className="mt-3">
            <strong>Actions:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>addFiles(files: File[])</code> — validates, creates UploadFile
              entries, starts if slot available
            </li>
            <li>
              <code>startUpload(fileId: string)</code> — initializes upload, requests
              uploadId + pre-signed URLs, begins chunk uploads
            </li>
            <li>
              <code>cancelUpload(fileId: string)</code> — aborts in-flight request,
              cleans IndexedDB, removes from state
            </li>
            <li>
              <code>retryChunk(fileId: string, chunkIndex: number)</code> — retries
              a failed chunk with exponential backoff
            </li>
            <li>
              <code>resumeFromIndexedDB()</code> — loads incomplete uploads on mount
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Upload Types &amp; Interfaces (<code>upload-types.ts</code>)</h4>
          <p>
            Defines the <code>UploadStatus</code> union
            (<code>queued | uploading | paused | completed | failed | cancelled</code>),
            the <code>ChunkState</code> interface with fields for index, Blob, size,
            status, progress, retryCount, and pre-signed URL. The
            <code>UploadFile</code> interface aggregates file metadata, chunks, status,
            and progress. The <code>UploadConfig</code> interface allows callers to
            customize chunk size, concurrency, max retries, and allowed file types.
            See the Example tab for the complete type definitions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Chunk Manager (<code>chunk-manager.ts</code>)</h4>
          <p>
            Handles file slicing into chunks via <code>Blob.slice()</code>. Computes
            chunk boundaries, generates chunk metadata, and manages per-chunk upload
            execution. Each chunk upload uses its own <code>AbortController</code> for
            cancellability. The manager uploads chunks sequentially per file, updating
            progress after each chunk completes.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. IndexedDB Helper (<code>indexeddb-helper.ts</code>)</h4>
          <p>
            Wraps IndexedDB operations for persisting upload state. Stores
            <code>uploadId</code>, completed chunk indices, file metadata, and
            pre-signed URL template. On resume, reconstructs the UploadFile state
            from persisted data. Uses a dedicated object store per upload session.
            Cleanup occurs on upload completion or cancellation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Upload Service (<code>upload-service.ts</code>)</h4>
          <p>
            Handles HTTP communication: initiating upload (POST to server for
            <code>uploadId</code> + pre-signed URLs), uploading individual chunks
            (PUT to pre-signed URL), and completing the upload (POST to server with
            chunk signatures for final assembly). Includes retry logic with exponential
            backoff and timeout handling.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Drag-Drop Zone (<code>drop-zone.tsx</code>)</h4>
          <p>
            Renders the drop zone with drag event handlers (<code>onDragOver</code>,
            <code>onDragLeave</code>, <code>onDrop</code>). Visual feedback via CSS
            classes on dragover state. Clicking opens a file picker input. Keyboard
            accessible (Enter/Space triggers file picker).
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. File List Item (<code>file-list-item.tsx</code>)</h4>
          <p>
            Renders a single file entry with preview (image thumbnail or file-type
            icon), file name, size, status badge, progress bar (per-file overall
            percentage), and action buttons (cancel, retry). Per-chunk progress is
            shown as a segmented bar beneath the main progress bar.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store is the single source of truth for upload state. Files are
          stored in a <code>Map</code> keyed by fileId for O(1) lookup. The queue is
          an ordered array of fileIds. The store tracks <code>activeCount</code> to
          enforce the concurrency limit. When a file completes or fails,
          <code>activeCount</code> decrements and the next queued file starts.
        </p>
        <p>
          Progress tracking works at two levels. Each chunk has its own status
          (<code>pending | uploading | completed | failed</code>) and byte-level
          progress (via <code>XMLHttpRequest.upload.onprogress</code> or fetch with
          a ReadableStream). The file-level progress is computed as
          <code>(completedChunks / totalChunks) * 100</code>. This aggregation is
          computed on-demand via a store selector, not stored as redundant state.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/file-upload-widget-architecture.svg"
          alt="File Upload Widget Architecture"
          caption="Architecture of the file upload widget showing chunked uploads, IndexedDB persistence, and parallel upload queue"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            User drops files onto the drop zone or selects via file picker.
          </li>
          <li>
            <code>DropZone</code> calls <code>useUploadStore.getState().addFiles(files)</code>.
          </li>
          <li>
            Store validates each file, creates <code>UploadFile</code> entries with
            chunk metadata, and starts upload if a slot is available (or queues it).
          </li>
          <li>
            <code>startUpload</code> calls the upload service to POST to the server,
            receiving <code>uploadId</code> and pre-signed URLs.
          </li>
          <li>
            The chunk manager uploads chunks sequentially. After each chunk completes,
            the store updates the chunk status and persists to IndexedDB.
          </li>
          <li>
            The <code>FileListItem</code> component re-renders with updated progress
            (Zustand selector triggers re-render only for the affected file).
          </li>
          <li>
            If a chunk fails, the retry logic kicks in with exponential backoff.
            After max retries, the file status becomes <code>failed</code>.
          </li>
          <li>
            When all chunks complete, the store calls the upload service&apos;s
            <code>completeUpload</code> to notify the server. File status becomes
            <code>completed</code>, IndexedDB entry is cleaned up.
          </li>
          <li>
            If the user cancels, the <code>AbortController</code> aborts the in-flight
            request, IndexedDB state is deleted, and the file is removed from the store.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional data flow pattern. All state
          mutations flow through the Zustand store, and all rendering flows from store
          subscriptions. This ensures predictable behavior and makes the system testable
          in isolation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Upload Lifecycle</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            <strong>Initiation:</strong> <code>addFiles()</code> validates files,
            chunks them, creates entries. If <code>activeCount &lt; concurrencyLimit</code>,
            calls <code>startUpload()</code> immediately. Otherwise, pushes to queue.
          </li>
          <li>
            <strong>Server handshake:</strong> <code>startUpload()</code> POSTs to
            <code>/api/upload/init</code> with file metadata (name, size, MIME type,
            chunk count). Server returns <code>uploadId</code> and an array of
            pre-signed URLs (one per chunk).
          </li>
          <li>
            <strong>Chunk upload loop:</strong> For each chunk (index 0 to N-1):
            <ul className="ml-6 mt-1 space-y-1 list-disc list-inside">
              <li>
                Slice Blob: <code>file.slice(chunkStart, chunkEnd)</code>
              </li>
              <li>
                PUT chunk to pre-signed URL with <code>Content-Type</code> and
                <code>Content-Length</code> headers.
              </li>
              <li>
                On success: mark chunk <code>completed</code>, persist to IndexedDB,
                update progress.
              </li>
              <li>
                On failure: increment retryCount, wait
                <code>2^retryCount * 1000</code> ms, retry. After max retries, mark
                file <code>failed</code>.
              </li>
            </ul>
          </li>
          <li>
            <strong>Completion:</strong> After all chunks succeed, POST to
            <code>/api/upload/complete</code> with <code>uploadId</code> and chunk
            ETags. Server assembles the file. Store marks file <code>completed</code>,
            deletes IndexedDB entry, decrements <code>activeCount</code>, starts next
            queued file.
          </li>
        </ol>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Resume Flow</h3>
        <ul className="space-y-2">
          <li>
            On app mount, <code>resumeFromIndexedDB()</code> queries the IndexedDB
            store for incomplete uploads.
          </li>
          <li>
            For each found entry, reconstructs the <code>UploadFile</code> with
            completed chunk indices marked. Skipped chunks are set to <code>pending</code>.
          </li>
          <li>
            The user is notified of resumable uploads and can choose to resume or
            discard. On resume, the store requests fresh pre-signed URLs (old ones
            may have expired) and continues from the first pending chunk.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Pre-signed URL expiry:</strong> Pre-signed URLs have a 5-minute
            TTL. If a chunk upload takes longer (unlikely with 5 MB chunks on typical
            broadband), the PUT returns 403. The store detects this, requests fresh
            URLs from the server, and retries the chunk.
          </li>
          <li>
            <strong>Network disconnect:</strong> Fetch rejects with a
            <code>TypeError</code> (network error). The retry handler catches this,
            increments retryCount, and schedules a retry with backoff. If the network
            remains down beyond max retries, the file is marked <code>failed</code>
            and persists in IndexedDB for manual retry later.
          </li>
          <li>
            <strong>Cancel mid-upload:</strong> The <code>AbortController</code>
            associated with the in-flight chunk request is aborted. The fetch promise
            rejects with an <code>AbortError</code>, which the store handles by
            cleaning up (no retry). IndexedDB entry is deleted. The file is removed
            from the store.
          </li>
          <li>
            <strong>100 files dropped at once:</strong> All 100 are validated and
            added to the store. The first <code>concurrencyLimit</code> (default: 3)
            start uploading. The remaining 97 sit in the queue. As each file completes
            or fails, the next queued file starts. No files are dropped silently.
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module and its key design decisions.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">&#128230; Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 8 files:
            TypeScript interfaces and constants, Zustand store with queue management
            and IndexedDB integration, chunk manager with sequential upload execution,
            upload service with retry and exponential backoff, IndexedDB helper for
            resume state persistence, drag-drop zone with visual feedback, file list
            item with progress bars and file previews, and a full EXPLANATION.md
            walkthrough. Click the <strong>Example</strong> toggle at the top of the
            article to view all source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Upload Types (upload-types.ts)</h3>
        <p>
          Defines the <code>UploadStatus</code> union, <code>ChunkStatus</code> union,
          <code>ChunkState</code> interface with index, size, status, progress,
          retryCount, and pre-signed URL. The <code>UploadFile</code> interface
          aggregates file metadata, chunks array, status, progress percentage,
          <code>uploadId</code>, and <code>AbortController</code> reference.
          <code>UploadConfig</code> allows customization of chunk size (default: 5 MB),
          concurrency limit (default: 3), max retries (default: 3), allowed MIME types,
          and max file size (default: 5 GB).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Zustand Store (upload-store.ts)</h3>
        <p>
          The store is the single source of truth. Key design decisions include: using
          <code>crypto.randomUUID()</code> for stable file IDs, storing files in a
          <code>Map</code> for O(1) lookup, tracking <code>activeCount</code> for
          concurrency control, and computing per-file progress from chunk states
          (no redundant stored field). The store coordinates the entire upload lifecycle:
          validation, initiation, chunk progression, retry handling, and cleanup.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Chunk Manager (chunk-manager.ts)</h3>
        <p>
          Splits files into chunks via <code>Blob.slice()</code>, which is a lazy
          operation (no memory copy). Generates chunk metadata with byte boundaries.
          Executes chunk uploads sequentially per file, updating store state after each
          chunk. Each chunk upload gets its own <code>AbortController</code> for
          cancellability. The manager is decoupled from the store — it receives callbacks
          for progress updates rather than directly mutating state.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Upload Service (upload-service.ts)</h3>
        <p>
          Handles HTTP communication. The <code>initUpload()</code> method POSTs to
          the server with file metadata and receives <code>uploadId</code> + pre-signed
          URLs. The <code>uploadChunk()</code> method PUTs a chunk Blob to the pre-signed
          URL with proper headers. The <code>completeUpload()</code> method notifies the
          server to assemble chunks. All methods support <code>AbortSignal</code> for
          cancellation. Retry logic with exponential backoff is implemented as a wrapper
          around <code>uploadChunk()</code>.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: IndexedDB Helper (indexeddb-helper.ts)</h3>
        <p>
          Wraps IndexedDB with a Promise-based API. The object store
          <code>upload-sessions</code> stores records keyed by <code>uploadId</code>
          containing <code>fileId</code>, <code>uploadId</code>, file metadata,
          completed chunk indices, and server endpoint. <code>saveSession()</code>
          is called after each chunk completion. <code>loadSessions()</code> retrieves
          all incomplete uploads on mount. <code>deleteSession()</code> cleans up on
          completion or cancellation. Uses <code>IDBKeyRange</code> for efficient
          queries.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Drag-Drop Zone (drop-zone.tsx)</h3>
        <p>
          Renders the drop zone with drag event handlers. Uses <code>useRef</code> for
          the hidden file input, <code>useState</code> for dragover state. The
          <code>onDragOver</code> handler calls <code>e.preventDefault()</code> and
          sets dragover state to true. <code>onDragLeave</code> resets the state.
          <code>onDrop</code> extracts <code>DataTransfer.files</code>, filters out
          directories, and passes File objects to the store. Clicking the zone triggers
          the hidden file input. Keyboard support: the zone has <code>{`tabIndex={0}`}</code>
          and handles Enter/Space to open the file picker.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: File List Item (file-list-item.tsx)</h3>
        <p>
          Renders a single file entry with thumbnail preview (using
          <code>URL.createObjectURL()</code> for images, with cleanup on unmount),
          file-type icon for non-images, file name, formatted size, status badge
          (colored pill: queued/ uploading/completed/failed/cancelled), overall
          progress bar (width percentage), segmented chunk progress bar (mini blocks
          per chunk), and action buttons (cancel for in-flight, retry for failed).
          Uses <code>role=&quot;progressbar&quot;</code> with ARIA attributes for
          accessibility.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">addFiles (validation + chunking)</td>
                <td className="p-2">O(n * c) — n files, c chunks each</td>
                <td className="p-2">O(c) — chunk metadata per file</td>
              </tr>
              <tr>
                <td className="p-2">Blob.slice()</td>
                <td className="p-2">O(1) — lazy reference, no copy</td>
                <td className="p-2">O(1) — no additional memory</td>
              </tr>
              <tr>
                <td className="p-2">Upload chunk (PUT)</td>
                <td className="p-2">O(chunkSize / bandwidth)</td>
                <td className="p-2">O(chunkSize) — one chunk in memory</td>
              </tr>
              <tr>
                <td className="p-2">Progress computation</td>
                <td className="p-2">O(c) — iterate chunks</td>
                <td className="p-2">O(1) — computed on demand</td>
              </tr>
              <tr>
                <td className="p-2">IndexedDB write</td>
                <td className="p-2">O(1) — single record update</td>
                <td className="p-2">O(c) — stores completed chunk indices</td>
              </tr>
              <tr>
                <td className="p-2">Cancel upload</td>
                <td className="p-2">O(1) — abort + Map delete</td>
                <td className="p-2">O(1) — frees chunk reference</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>n</code> is number of files and <code>c</code> is chunks per file.
          For a 1 GB file with 5 MB chunks, <code>c = 200</code>. Blob.slice is O(1)
          because it creates a view, not a copy. The actual upload time depends on
          network bandwidth, not computational complexity.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Main-thread blocking during chunking:</strong> While
            <code>Blob.slice()</code> is lazy, reading the chunk data (e.g., for
            computing a hash) does require I/O. For 5 MB chunks on modern hardware,
            this takes &lt;10 ms and is not perceptible. For files above 2 GB, offload
            hashing to a Web Worker.
          </li>
          <li>
            <strong>Re-render cascades:</strong> If every chunk progress update triggers
            a store update, React re-renders the FileListItem. For 200 chunks, this is
            200 re-renders. Mitigation: throttle progress updates to every 100 ms using
            <code>requestAnimationFrame</code> or a debounce mechanism. Only the affected
            FileListItem re-renders (Zustand selector).
          </li>
          <li>
            <strong>IndexedDB write latency:</strong> Writing to IndexedDB after every
            chunk adds I/O overhead. Mitigation: batch writes — accumulate completed
            chunk indices in memory and flush to IndexedDB every 5 chunks or on page
            unload (<code>beforeunload</code> event).
          </li>
          <li>
            <strong>Pre-signed URL generation:</strong> If the server generates all
            pre-signed URLs upfront (200 for a 1 GB file), the init response is large
            (&gt;50 KB). Mitigation: generate URLs in batches (e.g., 20 at a time).
            When the current batch is exhausted, request the next batch.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Throttled progress updates:</strong> Update the store&apos;s
            progress state at most every 100 ms. This limits re-renders to 10 per
            second per file, regardless of chunk count.
          </li>
          <li>
            <strong>Lazy chunk loading:</strong> Do not read chunk data from disk until
            the chunk is about to be uploaded. <code>Blob.slice()</code> creates a
            reference; <code>blob.arrayBuffer()</code> or <code>blob.stream()</code>
            reads the data. Only call the read method when the upload begins.
          </li>
          <li>
            <strong>Object URL cleanup:</strong> Image thumbnails use
            <code>URL.createObjectURL()</code>, which creates a memory reference. Always
            call <code>URL.revokeObjectURL()</code> in the component&apos;s cleanup
            effect to prevent memory leaks.
          </li>
          <li>
            <strong>Concurrency tuning:</strong> The default concurrency limit of 3
            balances throughput and resource usage. On high-bandwidth connections
            (fiber, 5G), increasing to 5 yields marginal gains. On low-bandwidth
            connections (3G, poor Wi-Fi), reducing to 2 prevents head-of-line blocking.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">File Type Validation</h3>
        <p>
          Client-side validation checks both the MIME type (from
          <code>File.type</code>) and the file extension. However, MIME types can be
          spoofed (a malicious actor can rename a .exe to .pdf). The server must
          perform its own validation (magic number inspection, content scanning). The
          client-side check is a UX convenience, not a security boundary.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">CSRF Protection</h3>
        <p>
          The init request (<code>POST /api/upload/init</code>) and the completion
          request (<code>POST /api/upload/complete</code>) are state-changing operations
          that must include a CSRF token. The token is sent as a custom header
          (<code>X-CSRF-Token</code>) and validated by the server. Pre-signed URL PUT
          requests go directly to S3 and do not require CSRF protection (the pre-signed
          URL itself is the authorization mechanism).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Pre-signed URL Security</h3>
        <p>
          Pre-signed URLs are short-lived (5-minute TTL) and scoped to a specific
          bucket, key, and HTTP method (PUT). They cannot be reused for other files or
          operations. The server generates them with the least-privilege IAM policy.
          Even if a pre-signed URL is intercepted, the attacker can only upload to the
          specific S3 key (which the server validates during assembly).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Size Limits</h3>
        <p>
          The widget enforces a maximum file size (default: 5 GB) before initiating
          upload. This prevents accidental uploads of extremely large files and protects
          server storage quotas. The limit is configurable per application requirements.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              The drop zone has <code>tabIndex=&quot;0&quot;</code> and responds to
              Enter and Space keys by triggering the hidden file input.
            </li>
            <li>
              Each file in the list has action buttons (cancel, retry) that are native
              <code>&lt;button&gt;</code> elements, automatically keyboard-accessible.
            </li>
            <li>
              Users can tab through the file list and interact with all controls without
              a mouse.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              Progress bars use <code>role=&quot;progressbar&quot;</code> with
              <code>aria-valuenow</code>, <code>aria-valuemin</code>,
              <code>aria-valuemax</code>, and <code>aria-label</code> describing the
              file and progress (e.g., &quot;video.mp4 upload progress: 45%&quot;).
            </li>
            <li>
              Status changes (upload started, chunk completed, upload finished/failed)
              are announced via an <code>aria-live=&quot;polite&quot;</code> region.
            </li>
            <li>
              The drop zone has <code>role=&quot;button&quot;</code> with
              <code>aria-label=&quot;Drop files here or click to browse&quot;</code>.
            </li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li>
            <strong>Rate limiting on init endpoint:</strong> The server should rate-limit
            <code>POST /api/upload/init</code> per user session to prevent abuse
            (e.g., a script initiating thousands of uploads to exhaust storage quotas).
          </li>
          <li>
            <strong>Quota enforcement:</strong> Before initiating an upload, the server
            should check the user&apos;s storage quota and reject uploads that would
            exceed it.
          </li>
          <li>
            <strong>Virus scanning:</strong> Server-side virus scanning should run on
            the assembled file before it is made available to other users. The client
            cannot perform this check reliably.
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Chunk manager:</strong> Test that a 12 MB file with 5 MB chunk
            size produces 3 chunks (5 MB, 5 MB, 2 MB). Verify byte boundaries are
            correct. Test edge case: file size exactly equals chunk size (1 chunk).
          </li>
          <li>
            <strong>Upload store:</strong> Test addFiles validates file type and size,
            creates correct chunk metadata, starts upload if slot available, or queues
            otherwise. Test cancelUpload aborts the controller, removes from Map,
            deletes IndexedDB entry. Test queue management: when a file completes, the
            next queued file starts.
          </li>
          <li>
            <strong>Upload service:</strong> Mock fetch. Test initUpload sends correct
            payload and parses response. Test uploadChunk PUTs to pre-signed URL with
            correct headers. Test retry logic: mock a failed fetch, verify exponential
            backoff delays (1s, 2s, 4s), verify max retry limit is respected.
          </li>
          <li>
            <strong>IndexedDB helper:</strong> Test saveSession writes correct record.
            Test loadSessions retrieves all incomplete uploads. Test deleteSession
            removes the record. Use an in-memory IndexedDB mock or idb library test utils.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Full upload lifecycle:</strong> Render DropZone + FileList, drop a
            file, mock server responses for init + chunk PUTs + complete. Assert file
            transitions through queued &rarr; uploading &rarr; completed. Assert progress
            bar updates correctly.
          </li>
          <li>
            <strong>Retry flow:</strong> Mock first chunk upload to fail twice then
            succeed. Assert retry count increments, backoff delays are correct, final
            state is completed.
          </li>
          <li>
            <strong>Cancel flow:</strong> Start upload, call cancelUpload mid-chunk.
            Assert AbortController.signal.aborted is true, IndexedDB entry is deleted,
            file is removed from store.
          </li>
          <li>
            <strong>Resume flow:</strong> Simulate page reload by seeding IndexedDB with
            an incomplete upload. Mount the widget, assert resume prompt appears. User
            clicks resume, assert upload continues from the correct chunk.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            Drop a folder: assert it is rejected with a clear error message.
          </li>
          <li>
            Drop 100 files: assert only concurrencyLimit upload simultaneously, the
            rest queue correctly.
          </li>
          <li>
            Upload a file with an invalid MIME type: assert validation rejects before
            any network request.
          </li>
          <li>
            Network disconnect during upload: mock fetch to reject with network error,
            assert retry logic activates, file eventually marked failed after max retries.
          </li>
          <li>
            Accessibility: run axe-core automated checks on rendered components, verify
            aria-live regions, progressbar roles, keyboard navigation through drop zone
            and file list.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Uploading the entire file in one request:</strong> Candidates often
            implement a simple <code>FormData</code> POST without chunking. Interviewers
            expect discussion of chunked uploads for large files — why chunking matters
            (resumability, parallelism, memory efficiency, server load distribution).
          </li>
          <li>
            <strong>Loading entire file into memory:</strong> Using
            <code>FileReader.readAsArrayBuffer()</code> on the entire file blocks the
            main thread and consumes massive memory for large files. Interviewers look
            for candidates who know <code>Blob.slice()</code> is lazy and processes
            chunks on demand.
          </li>
          <li>
            <strong>No retry logic:</strong> Assuming uploads always succeed is a red
            flag. Production systems must handle transient network failures. Candidates
            should discuss exponential backoff, jitter, and max retry limits.
          </li>
          <li>
            <strong>Forgetting to persist upload state:</strong> Without IndexedDB (or
            similar), a page reload loses all upload progress. Interviewers expect
            candidates to discuss resumable uploads and persistent state.
          </li>
          <li>
            <strong>Not handling pre-signed URL expiry:</strong> Pre-signed URLs have a
            TTL. If the upload takes longer than the TTL, the PUT fails with 403.
            Candidates should discuss URL refresh strategies.
          </li>
          <li>
            <strong>Ignoring accessibility:</strong> File upload widgets are notorious
            for accessibility gaps. Candidates should discuss keyboard file selection,
            ARIA progressbars, and screen reader announcements.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Chunk Size: 5 MB vs 10 MB vs 1 MB</h4>
          <p>
            Smaller chunks (1 MB) mean more granular progress tracking and faster retry
            of individual chunks, but more HTTP requests (overhead from TCP handshakes,
            headers). Larger chunks (10 MB) reduce request count but make retries more
            expensive (re-uploading 10 MB on failure). 5 MB is a sweet spot — it aligns
            with S3&apos;s recommended minimum part size for multipart uploads, balances
            request overhead with retry cost, and fits comfortably within typical timeout
            thresholds. Adjust based on expected network conditions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Pre-signed URLs vs Server-Relayed Upload</h4>
          <p>
            Pre-signed URLs allow the client to upload directly to S3, bypassing the
            application server. This reduces server bandwidth costs, eliminates a hop
            (lower latency), and scales infinitely (S3 handles the load). The trade-off
            is that the server loses visibility into upload progress (it only knows when
            init and complete are called). Server-relayed uploads give the server full
            control (virus scanning, content transformation) but add cost and complexity.
            For most applications, pre-signed URLs are the right choice.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Sequential vs Parallel Chunk Upload</h4>
          <p>
            This design uploads chunks sequentially per file. This ensures chunk order
            is preserved (important for server-side assembly) and simplifies retry logic
            (only one in-flight chunk per file at a time). Parallel chunk upload is
            possible (upload all chunks simultaneously) but introduces complexity: the
            server must handle out-of-order chunk arrival, and retry logic becomes harder
            (multiple in-flight chunks to track). Sequential is the safer default;
            parallel is justified for very high-bandwidth scenarios where the upload is
            I/O-bound, not CPU-bound.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add file integrity verification (checksum) before upload?
            </p>
            <p className="mt-2 text-sm">
              A: Compute a SHA-256 hash of the file before chunking. Use
              <code>SubtleCrypto.digest()</code> (Web Crypto API) or a library like
              spark-md5 for incremental hashing. For incremental hashing, read each
              chunk, update the hash, then upload the chunk. Send the final hash to
              the server during <code>completeUpload</code>. The server computes the
              hash of the assembled file and compares. If mismatch, the server rejects
              and the client can retry. For large files, incremental hashing in a Web
              Worker avoids main-thread blocking.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support uploading to multiple storage backends (S3, GCS, Azure)?
            </p>
            <p className="mt-2 text-sm">
              A: Abstract the upload service behind an interface (<code>IUploadProvider</code>)
              with methods <code>init()</code>, <code>uploadChunk()</code>,
              <code>complete()</code>. Implement concrete providers for S3, GCS, and
              Azure Blob Storage. The provider is selected via configuration. The chunk
              manager and store interact only with the interface, not the concrete
              implementation. Pre-signed URL semantics differ per provider (S3 uses
              SigV4, GCS uses signed URLs, Azure uses SAS tokens), but the client-side
              PUT request is the same (PUT to URL with appropriate headers).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle uploading files when the user is offline?
            </p>
            <p className="mt-2 text-sm">
              A: Detect offline state via <code>navigator.onLine</code> and the
              <code>online</code>/<code>offline</code> events. When offline, queue the
              files with status <code>paused</code>. Persist the queue in IndexedDB
              (already done for resumability). Listen for the <code>online</code> event
              and automatically resume uploads. Show a clear UI indicator that uploads
              are paused due to no connection. The retry logic&apos;s exponential backoff
              already handles transient disconnections; the offline detection adds a UX
              layer on top.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add upload speed estimation and ETA calculation?
            </p>
            <p className="mt-2 text-sm">
              A: Track bytes uploaded and timestamps for each chunk. After each chunk
              completes, compute <code>bytesUploaded / elapsedSeconds</code> for an
              instantaneous speed. Smooth this with an exponential moving average (EMA)
              over the last N chunks to reduce jitter. ETA is then
              <code>remainingBytes / smoothedSpeed</code>. Display ETA as a human-readable
              string (e.g., &quot;~2 min remaining&quot;). Handle edge cases: if speed
              is zero (network down), show &quot;Paused — retrying&quot;. If speed
              fluctuates wildly, increase the EMA window for smoother estimates.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What happens if the user uploads the same file twice?
            </p>
            <p className="mt-2 text-sm">
              A: By default, treat each upload as a separate operation (different
              <code>fileId</code>, different <code>uploadId</code>). Deduplication is
              possible by computing a hash of the file content before upload. If the
              hash matches a previously completed upload (stored server-side), the
              server can skip the upload entirely and return the existing file URL.
              This is called &quot;deduplication by content hash&quot; or &quot;smart
              upload&quot;. It saves bandwidth for users who re-upload unchanged files.
              The client sends the hash during <code>initUpload</code>; the server
              checks its index and responds with either a skip signal or proceed with
              chunk upload.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle uploading very large files (50+ GB)?
            </p>
            <p className="mt-2 text-sm">
              A: Increase chunk size (e.g., 25 MB instead of 5 MB) to reduce the total
              chunk count and HTTP overhead. Offload hash computation to a Web Worker
              to avoid main-thread blocking. Implement background upload using the
              Background Sync API (Service Worker) so uploads continue even when the
              user closes the tab. Use IndexedDB to store the entire file handle
              (<code>File</code> objects are serializable in IndexedDB) so the file
              reference persists across sessions. Display more granular progress (ETA,
              speed). Consider server-side parallel assembly — the server can assemble
              chunks in parallel as they arrive, reducing final assembly time.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://uppy.io/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Uppy — Open-Source File Upload Framework
            </a>
          </li>
          <li>
            <a
              href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS S3 Multipart Upload — Documentation
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — IndexedDB API Reference
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Blob/slice"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Blob.slice() API Reference
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/upload-files-with-the-file-api"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev — File Upload Patterns and Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA — Accessible Progress Indicators
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
