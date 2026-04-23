"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-multipart-upload",
  title: "Multipart Upload",
  description:
    "Comprehensive guide to multipart upload covering chunked file transfer, resumable uploads, progress tracking, server-side assembly, and building robust file upload experiences for large files.",
  category: "frontend",
  subcategory: "networking-api-communication",
  slug: "multipart-upload",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: [
    "frontend",
    "multipart",
    "upload",
    "file-transfer",
    "chunked",
    "resumable",
    "progress",
  ],
  relatedTopics: [
    "chunked-transfer-encoding",
    "request-cancellation",
    "retry-logic-and-exponential-backoff",
    "form-data",
  ],
};

export default function MultipartUploadArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="important">
          <strong>Multipart Upload</strong> is a file transfer technique where a
          large file is divided into smaller chunks (parts), each uploaded
          independently, and then assembled on the server into the complete
          file. This approach solves fundamental limitations of single-request
          uploads: HTTP request timeouts (typically 30-60 seconds on most
          servers), memory constraints (loading entire files into memory), lack
          of progress visibility (no intermediate feedback), and inability to
          resume after failures (starting over from zero on network errors).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The term "multipart" has two related meanings in this context. First,
          <strong>multipart/form-data</strong> is the HTTP content type used for
          form submissions with file inputs, where multiple form fields and
          files are encoded in a single request with boundary-delimited parts.
          Second, <strong>multipart upload</strong> refers to the chunked
          transfer pattern popularized by cloud storage services (AWS S3
          Multipart Upload, Google Cloud Storage Resumable Uploads, Azure Block
          Blobs) where files are split into 5MB-100MB chunks, uploaded in
          parallel or sequence, and assembled server-side.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          At a staff or principal engineer level, multipart upload is not just
          about splitting files -- it is about designing resilient transfer
          systems that handle real-world conditions: unstable mobile networks
          (where connections drop mid-upload), bandwidth constraints (where
          parallel chunks saturate available capacity), server-side validation
          (where individual chunks are scanned for malware or validated for
          integrity), and user experience (where progress must be accurate and
          uploads must be pauseable/resumable). The most sophisticated
          implementations treat multipart upload as a stateful protocol with
          explicit lifecycle management: initialize upload session, transfer
          chunks with retry logic, complete assembly, and handle cleanup for
          abandoned sessions.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The business case for multipart upload is compelling for any
          application handling files larger than 10MB. Single-request uploads
          fail silently on timeout, provide no progress feedback, and waste
          bandwidth by restarting from zero after failures. Multipart upload
          enables: progress tracking (each chunk completed updates the progress
          bar), resumability (only failed chunks are retried, not the entire
          file), parallelism (multiple chunks upload simultaneously, saturating
          available bandwidth), and server-side flexibility (chunks can be
          processed/asynchronously validated while upload continues). For
          applications handling gigabyte-scale files (video editing, scientific
          datasets, backup archives), multipart upload is not optional -- it is
          the only viable transfer mechanism.
        </HighlightBlock>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="important">
          Multipart upload is built on six foundational concepts that govern how
          files are chunked, transferred, and assembled:
        </HighlightBlock>
        <ul>
          <HighlightBlock as="li" tier="crucial">
            <strong>Chunking Strategy:</strong> The file is divided into
            fixed-size chunks (typically 5MB-100MB). Chunk size involves
            trade-offs: smaller chunks (5MB) provide finer-grained progress
            tracking and faster retry (less data to re-upload on failure) but
            increase overhead (more HTTP requests, more server-side
            bookkeeping). Larger chunks (100MB) reduce request overhead but make
            progress updates coarse and retry expensive. AWS S3 recommends 5MB
            minimum, 5GB maximum per part, with 10,000 parts maximum per file.
            The optimal chunk size depends on file size, network conditions, and
            server capacity. A common strategy is adaptive chunking: start with
            10MB chunks, monitor upload speed, and increase chunk size for
            subsequent chunks if bandwidth is underutilized.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Upload Session:</strong> Before uploading chunks, the
            client initiates an upload session with the server. The server
            creates a unique session ID (or upload ID), allocates resources for
            tracking uploaded chunks, and returns the session ID to the client.
            The client includes this session ID with each chunk upload, allowing
            the server to associate chunks with the correct file. Sessions have
            a TTL (typically 24 hours to 7 days) -- if the upload is not
            completed within the TTL, the server cleans up partial chunks. This
            prevents orphaned data from abandoned uploads consuming storage
            indefinitely.
          </HighlightBlock>
          <li>
            <strong>Chunk Transfer:</strong> Each chunk is uploaded as a
            separate HTTP request (typically PUT or POST) with metadata: session
            ID, chunk index (1-based), total chunks, and optionally chunk hash
            (MD5 or SHA-256 for integrity verification). Chunks can be uploaded
            sequentially (one at a time, simpler but slower) or in parallel
            (multiple concurrent uploads, faster but requires concurrency
            control). Parallel uploads saturate available bandwidth but must
            handle out-of-order completion (chunk 5 may finish before chunk 3).
            The server acknowledges each chunk with a confirmation (often
            including an ETag or chunk ID for later assembly).
          </li>
          <li>
            <strong>Progress Tracking:</strong> Progress is calculated as
            (bytes uploaded / total bytes) * 100. For accurate progress, track
            both completed chunks and in-flight chunks (data sent but not yet
            acknowledged). Simple progress only counts completed chunks, which
            causes the progress bar to stall during chunk uploads. Accurate
            progress includes in-flight bytes: for each active upload, estimate
            bytes sent based on elapsed time and observed throughput. Display
            progress to users with both percentage and ETA (estimated time
            remaining based on current throughput).
          </li>
          <li>
            <strong>Completion/Assembly:</strong> After all chunks are uploaded,
            the client sends a "complete upload" request with a manifest listing
            all chunk IDs in order. The server validates the manifest (all
            chunks received, hashes match), assembles chunks into the final
            file, performs any post-processing (virus scanning, transcoding),
            and returns the final file URL. If validation fails (missing chunks,
            hash mismatches), the server returns an error with details, and the
            client re-uploads only the affected chunks.
          </li>
          <li>
            <strong>Resumability:</strong> When an upload fails (network error,
            browser crash, user closes tab), the client can resume by querying
            the server for uploaded chunks. The server returns a list of
            successfully uploaded chunk indices, and the client re-uploads only
            the missing chunks. This is the key advantage over single-request
            uploads: a failure at 95% completion means re-uploading 5%, not
            starting from zero. Resumability requires server-side state
            (tracking uploaded chunks per session) and client-side persistence
            (saving session ID and file metadata to localStorage or IndexedDB
            for recovery after browser restart).
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
      <p>
          The multipart upload architecture consists of several layers working
          together: a chunker that splits files into parts, a session manager
          that handles upload initiation and completion, a chunk uploader that
          transfers individual parts with retry logic, a progress tracker that
          calculates and reports upload progress, and a resumability layer that
          persists state for recovery.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Multipart Upload Lifecycle
          </h3>
          <ol className="space-y-3">
            <li>
              <strong>1. File Selection:</strong> User selects file via input
              element or drag-drop, client validates file size and type
            </li>
            <li>
              <strong>2. Session Initiation:</strong> Client sends POST
              /uploads/init with filename, fileSize, contentType; server returns
              uploadId and chunkSize
            </li>
            <li>
              <strong>3. Chunk Creation:</strong> Client splits file into chunks
              using File.slice(), creates chunk metadata (index, size, hash)
            </li>
            <li>
              <strong>4. Chunk Upload:</strong> Client uploads chunks in
              parallel (configurable concurrency), each with uploadId,
              chunkIndex, and chunk data
            </li>
            <li>
              <strong>5. Progress Updates:</strong> After each chunk completes,
              update progress tracker and notify UI
            </li>
            <li>
              <strong>6. Retry Failed Chunks:</strong> On chunk upload failure,
              retry with exponential backoff up to max attempts
            </li>
            <li>
              <strong>7. Complete Upload:</strong> After all chunks succeed,
              client sends POST /uploads/complete with uploadId and chunk
              manifest
            </li>
            <li>
              <strong>8. Server Assembly:</strong> Server validates manifest,
              assembles chunks, performs post-processing, returns final file URL
            </li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/multipart-upload-flow.svg"
          alt="Multipart Upload Flow Diagram"
          caption="Multipart Upload Flow: File is chunked, upload session initiated, chunks uploaded in parallel, progress tracked, and final assembly triggered"
        />

        <p>
          The chunking process uses the File API's slice() method, which creates
          a Blob representing a byte range of the file. For a 100MB file with
          10MB chunks, the client creates 10 slices: file.slice(0, 10MB),
          file.slice(10MB, 20MB), etc. Each slice is uploaded independently.
          Critically, slice() does not copy the underlying data -- it creates a
          view into the file, making chunking memory-efficient even for
          multi-gigabyte files.
        </p>

        <p>
          Parallel chunk upload requires concurrency control to avoid
          overwhelming the network or server. A typical configuration is 3-5
          concurrent uploads. The chunk uploader maintains a queue of pending
          chunks, dispatches up to N chunks simultaneously, and as each chunk
          completes, dispatches the next pending chunk. This is essentially a
          request queue with a concurrency limit (see the Request Queuing
          article for detailed patterns). Failed chunks are re-queued for retry
          with exponential backoff.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/multipart-parallel-upload.svg"
          alt="Parallel Chunk Upload Diagram"
          caption="Parallel Chunk Upload: Multiple chunks upload concurrently with configurable concurrency, progress aggregated across all chunks"
        />

        <p>
          For resumability, the client persists upload state to localStorage or
          IndexedDB after session initiation and after each chunk completion.
          The state includes: uploadId, file metadata (name, size, type), chunk
          size, uploaded chunk indices, and pending chunk indices. If the
          browser crashes or the user closes the tab, the client can recover on
          next visit: read persisted state, query server for uploaded chunks
          (in case server state differs), and resume uploading missing chunks.
          This pattern is essential for large files where upload may span hours
          or days.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/multipart-resume-flow.svg"
          alt="Multipart Upload Resume Flow Diagram"
          caption="Resume Flow: On recovery, client reads persisted state, queries server for uploaded chunks, and resumes uploading only missing chunks"
        />

        <p>
          Server-side assembly is the final step. The server receives the
          completion request with a manifest listing all chunk IDs in order. It
          validates: all chunks are present (no gaps), chunk hashes match (data
          integrity), and total size matches expected file size. Then it
          assembles chunks into the final file. For cloud storage like AWS S3,
          assembly is a metadata operation -- chunks are already stored in S3,
          and CompleteMultipartUpload just creates a manifest object that
          references all parts. For self-hosted storage, assembly may involve
          concatenating chunk files sequentially. After assembly, the server
          performs post-processing: virus scanning, image/video transcoding,
          thumbnail generation, and indexing. Only after post-processing
          completes is the file made available to other users.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Reliability</strong>
              </td>
              <td className="p-3">
                • Retry individual chunks instead of entire file
                <br />
                • Resume after browser crash or network failure
                <br />• Graceful degradation on unstable networks
              </td>
              <td className="p-3">
                • Server must track upload state (memory/database)
                <br />
                • Abandoned uploads consume storage until cleanup
                <br />• More complex error handling (partial failures)
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Performance</strong>
              </td>
              <td className="p-3">
                • Parallel uploads saturate available bandwidth
                <br />
                • No single-request timeout issues
                <br />• Server can process chunks asynchronously
              </td>
              <td className="p-3">
                • More HTTP requests (overhead per chunk)
                <br />
                • Server assembly adds latency after final chunk
                <br />• Parallel uploads may congest network
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>User Experience</strong>
              </td>
              <td className="p-3">
                • Accurate progress tracking (per-chunk updates)
                <br />
                • Pause/resume capability
                <br />• ETA calculation based on throughput
              </td>
              <td className="p-3">
                • More complex UI state management
                <br />
                • Must handle partial upload states
                <br />• User may see "uploading" for extended periods
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Server Complexity</strong>
              </td>
              <td className="p-3">
                • Chunks can be validated/scanned independently
                <br />
                • Assembly is separate from transfer
                <br />• Can scale chunk upload independently
              </td>
              <td className="p-3">
                • Must implement session management
                <br />
                • Must track uploaded chunks per session
                <br />• Must clean up abandoned sessions
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">
            Multipart Upload vs. Single-Request Upload
          </h3>
          <p>
            For files under 10MB, single-request upload is simpler and
            sufficient: one HTTP POST with the file as the body, server saves
            the file, done. For files over 10MB, multipart upload becomes
            necessary: HTTP timeouts (servers typically timeout requests after
            30-60 seconds, and a 100MB file on a 1Mbps connection takes 13
            minutes), no progress visibility (browser cannot report upload
            progress for XMLHttpRequest Level 1, and fetch has limited support),
            and catastrophic failure mode (any error means restarting from
            zero). The crossover point depends on your user base's network
            conditions -- for enterprise applications with fast, stable
            networks, single-request may work up to 50MB. For consumer
            applications with global users on varied networks, use multipart
            upload for anything over 5MB.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          These practices represent hard-won lessons from operating multipart
          upload systems at scale:
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Choose Chunk Size Based on File Size:</strong> Use adaptive
            chunk sizing: for files under 100MB, use 5MB chunks; for 100MB-1GB,
            use 10MB chunks; for 1GB+, use 25-50MB chunks. This balances
            overhead (fewer requests for large files) with progress granularity
            (more frequent updates for small files). AWS S3 uses 5MB minimum,
            and their SDK automatically adjusts chunk size based on file size.
          </li>
          <li>
            <strong>Limit Concurrent Uploads:</strong> Use 3-5 concurrent chunk
            uploads. More than 5 concurrent uploads provides diminishing returns
            (TCP congestion control limits total throughput) and may overwhelm
            mobile networks. Fewer than 3 underutilizes available bandwidth.
            Implement a chunk queue with a concurrency limit, and adjust based
            on observed throughput (increase concurrency if network is
            underutilized).
          </li>
          <li>
            <strong>Implement Chunk-Level Retry:</strong> Retry failed chunks
            with exponential backoff (1s, 2s, 4s, 8s) up to 3-5 attempts. Do not
            fail the entire upload due to a single chunk failure -- retry the
            chunk independently. Track retry count per chunk, not per file. After
            max retries, pause the upload and prompt the user to retry or
            cancel.
          </li>
          <li>
            <strong>Persist Upload State for Resumability:</strong> After
            session initiation and after each chunk completion, persist state to
            IndexedDB (preferred for large state) or localStorage. Store:
            uploadId, file metadata, chunk size, uploaded chunk indices, and
            pending chunk indices. On page reload or browser restart, read
            persisted state and resume upload. Clear persisted state only after
            successful completion.
          </li>
          <li>
            <strong>Calculate Accurate Progress:</strong> Include both
            completed chunks and in-flight chunks in progress calculation. For
            each active upload, estimate bytes sent based on elapsed time and
            observed throughput. Update progress UI at most 10 times per second
            (more frequent updates cause UI thrashing). Display both percentage
            and ETA (estimated time remaining).
          </li>
          <li>
            <strong>Validate Chunks Server-Side:</strong> For each chunk,
            validate: size matches expected (except final chunk which may be
            smaller), content type matches session metadata, and optionally
            compute and verify hash (MD5 or SHA-256). Reject invalid chunks
            immediately rather than discovering issues at assembly time. Return
            chunk ETag or ID for later manifest.
          </li>
          <li>
            <strong>Clean Up Abandoned Sessions:</strong> Implement server-side
            cleanup for abandoned upload sessions. Set a TTL (24 hours to 7
            days) on sessions. Run a background job that deletes sessions older
            than TTL and removes associated chunk data. Without cleanup,
            abandoned uploads consume storage indefinitely. For cloud storage
            like S3, use lifecycle policies to delete incomplete multipart
            uploads after N days.
          </li>
          <li>
            <strong>Handle Large File Edge Cases:</strong> For files over 5GB,
            be aware of browser limitations: Chrome and Firefox handle
            multi-gigabyte files well, but Safari has had issues with File API
            operations on very large files. Test on target browsers. Also
            consider mobile constraints: uploading a 4K video (500MB+) on mobile
            data may take hours and consume the user's data cap. Warn users
            before initiating large uploads on mobile.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          These mistakes appear frequently even in production applications at
          well-funded companies:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Not Handling Chunk Upload Failures:</strong> Assuming all
            chunks will succeed and not implementing retry logic. Network
            failures, server errors, and timeouts are common for large uploads.
            Without retry, a single failed chunk fails the entire upload.
            Implement per-chunk retry with exponential backoff.
          </li>
          <li>
            <strong>Not Persisting Upload State:</strong> Only keeping upload
            state in memory. If the browser crashes or the user closes the tab,
            the upload is lost and must restart from zero. Persist state to
            IndexedDB after each chunk completion to enable resumability.
          </li>
          <li>
            <strong>Inaccurate Progress Calculation:</strong> Only counting
            completed chunks, ignoring in-flight chunks. This causes the
            progress bar to stall during chunk uploads (e.g., stuck at 50% while
            chunks 6-10 are uploading). Include in-flight bytes in progress
            calculation based on observed throughput.
          </li>
          <li>
            <strong>Too Many Concurrent Uploads:</strong> Setting concurrency to
            10-20 concurrent chunk uploads, which overwhelms the network and
            causes TCP congestion. This actually reduces throughput due to
            packet loss and retransmission. Use 3-5 concurrent uploads and
            adjust based on observed performance.
          </li>
          <li>
            <strong>Not Cleaning Up Abandoned Uploads:</strong> Server does not
            implement TTL-based cleanup for incomplete upload sessions. Over
            time, abandoned uploads consume significant storage (partial chunks
            for files that were never completed). Implement server-side cleanup
            with configurable TTL.
          </li>
          <li>
            <strong>Using Wrong Content-Type for Chunks:</strong> Sending each
            chunk as multipart/form-data instead of raw binary. While
            multipart/form-data works, it adds overhead (boundary markers,
            headers per chunk). For chunk upload, send raw binary with
            Content-Type: application/octet-stream and include metadata in
            headers (uploadId, chunkIndex) or query parameters.
          </li>
          <li>
            <strong>Not Validating Chunk Order:</strong> Assuming chunks arrive
            in order and can be concatenated by upload order. With parallel
            uploads, chunks complete out of order. The manifest must specify
            chunk indices explicitly, and server assembly must use indices, not
            arrival order.
          </li>
          <li>
            <strong>Ignoring Mobile Constraints:</strong> Not warning users
            about data usage for large uploads on mobile networks. Uploading a
            500MB video on mobile data may consume the user's entire monthly
            data cap. Detect mobile networks (using Network Information API if
            available) and warn users before initiating large uploads.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Multipart upload is essential in these production scenarios:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Video Sharing Platforms (YouTube, Vimeo):</strong> Users
            upload video files ranging from 100MB to 100GB+. Implementation:
            chunk size 10MB for files under 1GB, 50MB for larger files, parallel
            uploads with 4 concurrent chunks, resumable after network failures,
            progress tracking with ETA. Server-side: chunks are stored in cloud
            storage, assembly triggers video transcoding pipeline, and video is
            processed asynchronously. Users can close the browser and return
            later to check upload status.
          </li>
          <li>
            <strong>Cloud Backup Services (Backblaze, Dropbox):</strong>
            Backup clients upload large files (disk images, database dumps)
            ranging from 1GB to TB scale. Implementation: adaptive chunk sizing
            (larger chunks for larger files), aggressive parallelism (8-16
            concurrent uploads on broadband), deduplication (chunk hashes
            checked server-side to avoid re-uploading identical data), and
            long-term resumability (uploads can resume days later). Server-side:
            chunks are deduplicated across users, assembled into encrypted
            blobs, and stored in geographically distributed storage.
          </li>
          <li>
            <strong>Scientific Data Portals:</strong> Researchers upload
            datasets (genomic sequences, telescope imagery, climate models)
            ranging from 10GB to 100TB. Implementation: specialized clients use
            multipart upload with very large chunks (100MB-1GB), checkpointing
            every hour, and integration with high-speed research networks
            (ESnet, Internet2). Server-side: chunks are assembled into
            tape archives or object storage, with metadata indexed for search.
            Uploads may take days or weeks, so resumability and progress
            tracking are critical.
          </li>
          <li>
            <strong>Enterprise Document Management:</strong> Legal and
            healthcare organizations upload large documents (discovery files,
            medical imaging) ranging from 100MB to 10GB. Implementation:
            chunked upload with virus scanning per chunk, encryption in transit
            and at rest, audit logging for compliance, and pause/resume for
            network interruptions. Server-side: chunks are scanned for malware,
            assembled, indexed for e-discovery, and stored with retention
            policies.
          </li>
          <li>
            <strong>Game Distribution Platforms (Steam, Epic):</strong> Game
            developers upload builds ranging from 1GB to 100GB+. Implementation:
            custom clients use multipart upload with delta compression (only
            changed chunks are uploaded for new builds), parallel uploads, and
            integrity verification (SHA-256 per chunk). Server-side: chunks are
            assembled, replicated to CDN edge locations, and made available for
            download. Delta compression means a 50MB patch to a 50GB game only
            uploads the changed chunks.
          </li>
          <li>
            <strong>AI/ML Model Training:</strong> Data scientists upload
            training datasets (image collections, text corpora) ranging from
            10GB to 10TB. Implementation: SDKs use multipart upload with
            automatic chunk sizing, parallel uploads, and integration with cloud
            storage (S3, GCS, Azure Blob). Server-side: chunks are assembled
            into cloud storage buckets, mounted by training clusters, and
            preprocessed for model training. Uploads are often automated as part
            of ML pipelines, so resumability and error handling are critical.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: How do you decide on chunk size for multipart upload?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> I use adaptive chunk sizing based on file
              size. For files under 100MB, I use 5MB chunks (fine-grained
              progress, low overhead). For 100MB-1GB, I use 10MB chunks. For 1GB+,
              I use 25-50MB chunks (reduces request overhead for large files).
              The trade-off is: smaller chunks mean more HTTP requests (overhead)
              but better progress granularity and faster retry. Larger chunks
              mean fewer requests but coarser progress and more data to
              re-upload on failure. AWS S3 uses 5MB minimum, and their SDK
              automatically adjusts based on file size.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: How do you handle failed chunk uploads?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> I implement per-chunk retry with
              exponential backoff. Each chunk upload is wrapped in a retry loop:
              on failure, wait 1 second and retry, then 2 seconds, then 4
              seconds, up to 3-5 attempts. I track retry count per chunk, not
              per file. If a chunk fails after max retries, I pause the upload
              and prompt the user to retry or cancel. I do not fail the entire
              upload due to a single chunk failure -- only the affected chunk is
              retried.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: How do you calculate accurate upload progress?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> I track both completed chunks and
              in-flight chunks. For completed chunks, I sum their sizes. For
              in-flight chunks, I estimate bytes sent based on elapsed time and
              observed throughput (bytes sent so far / time elapsed). Progress
              is (completed bytes + in-flight bytes) / total file size. I update
              the progress UI at most 10 times per second to avoid thrashing. I
              also display ETA based on remaining bytes and current throughput.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: How do you enable resumable uploads after browser crash?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> I persist upload state to IndexedDB after
              session initiation and after each chunk completion. The state
              includes: uploadId, file metadata (name, size, type), chunk size,
              uploaded chunk indices, and pending chunk indices. On page load, I
              check for persisted state. If found, I query the server for
              uploaded chunks (to reconcile any differences), then resume
              uploading missing chunks. I clear persisted state only after
              successful completion.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: How do you handle parallel chunk uploads without overwhelming
              the network?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> I use a chunk queue with a concurrency
              limit of 3-5 concurrent uploads. The queue maintains pending
              chunks, dispatches up to N chunks simultaneously, and as each
              chunk completes, dispatches the next pending chunk. This is
              essentially a request queue pattern. I also monitor throughput and
              adjust concurrency: if throughput is low and network is
              underutilized, I may increase concurrency; if packet loss is high,
              I decrease concurrency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: What server-side cleanup is required for multipart upload?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> The server must implement TTL-based
              cleanup for abandoned upload sessions. Each session has a
              timestamp, and a background job runs periodically (e.g., daily) to
              delete sessions older than the TTL (24 hours to 7 days) and remove
              associated chunk data. Without cleanup, abandoned uploads consume
              storage indefinitely. For cloud storage like S3, I use lifecycle
              policies to automatically delete incomplete multipart uploads
              after N days.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS S3 Multipart Upload Documentation 
            </a>
          </li>
          <li>
            <a
              href="https://cloud.google.com/storage/docs/resumable-uploads"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Cloud Storage Resumable Uploads 
            </a>
          </li>
          <li>
            <a
              href="https://docs.microsoft.com/en-us/rest/api/storageservices/put-block"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Azure Block Blob Upload 
            </a>
          </li>
          <li>
            MDN Web Docs: <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/File_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              File API 
            </a>
          </li>
          <li>
            MDN Web Docs: <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Blob/slice"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Blob.slice() 
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/XMLHttpRequest2/#the-progress-event"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              XMLHttpRequest Level 2 Progress Events 
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
