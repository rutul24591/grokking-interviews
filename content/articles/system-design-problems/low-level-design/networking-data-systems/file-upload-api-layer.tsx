"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-file-upload-api-layer",
  title: "Design a File Upload API Layer",
  description:
    "Production-grade file upload system with chunking, resumability, progress tracking, cancellation, and error handling for large files.",
  category: "low-level-design",
  subcategory: "networking-data-systems",
  slug: "file-upload-api-layer",
  wordCount: 6800,
  readingTime: 40,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "file-upload",
    "chunking",
    "resumability",
    "progress-tracking",
    "large-files",
  ],
  relatedTopics: [
    "data-fetching-hook",
    "request-deduplication-system",
    "retry-mechanism",
    "global-api-error-handling",
  ],
};

export default function FileUploadAPILayerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">
          User uploads 500MB video. Naive: send entire file in one HTTP request. Problems: browser memory exhausted, network timeout after 10 minutes (entire upload lost), no progress feedback, can't resume or cancel. Better: chunk file (split into 10MB pieces), upload chunks independently, retry failed chunks, track progress, allow cancellation/resumption. If upload pauses mid-chunk, resume from next chunk (not from start).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Chunking benefits: (1) Memory efficient (process 10MB at a time, not 500MB). (2) Parallelizable (upload 4 chunks simultaneously on fast network). (3) Resumable (network fails after 400MB, resume from 410MB—not from start). (4) Progress trackable (show "410MB/500MB uploaded"). (5) Cancellable (user clicks cancel, in-flight chunks aborted).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Challenges: (1) Chunk size tuning (too small = overhead, too large = timeout risk). (2) Parallel vs sequential (parallel faster but riskier—congestion). (3) Server assembly (collect chunks, reassemble in order, verify integrity). (4) Resumability (server must remember which chunks received across sessions). (5) Deduplication (user uploads same file twice—reuse chunks?).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Explicit assumptions:</strong> Files 1MB-1GB. Network unreliable. Progress/cancellation expected. Parallel upload desired. Chunk size ~5-10MB. Server supports resumable uploads (persistent state).
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Chunking:</strong> Split file into chunks (e.g., 5MB each).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Resumability:</strong> Resume upload from last successful chunk if
            interrupted.
          </HighlightBlock>
          <li>
            <strong>Progress Tracking:</strong> Report progress (bytes uploaded,
            percentage, ETA).
          </li>
          <li>
            <strong>Cancellation:</strong> User can cancel in-progress upload.
          </li>
          <li>
            <strong>Parallel Uploads:</strong> Upload multiple chunks concurrently
            (e.g., 4 concurrent).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Chunk Retry:</strong> Retry failed chunks with exponential backoff.
          </HighlightBlock>
          <li>
            <strong>Server Assembly:</strong> Server assembles chunks into final file.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Memory Efficient:</strong> Stream chunks, not load entire file
            into memory.
          </HighlightBlock>
          <li>
            <strong>Bandwidth Efficient:</strong> Parallel uploads maximize throughput.
          </li>
          <li>
            <strong>Fault Tolerant:</strong> Handle network interruptions gracefully.
          </li>
          <li>
            <strong>Browser Compatible:</strong> Work on all modern browsers.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Network drops mid-upload → resume from last successful chunk.</li>
          <HighlightBlock as="li" tier="important">Chunk retry exhausted → surface error, expose manual retry.</HighlightBlock>
          <li>Browser crashes mid-upload → resume from persisted state on restart.</li>
          <li>Server has partial chunks → detect and skip already-uploaded chunks.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">Split file into chunks (5-10MB each). Generate upload ID and chunk IDs.
          For each chunk, send HTTP POST request to server with chunk data and
          metadata. Upload multiple chunks in parallel (4 concurrent). If chunk fails,
          retry with exponential backoff.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Track progress and report to UI. On
          completion, notify server to assemble chunks. For resumability, persist
          upload state (completed chunks) to localStorage. On page reload, resume
          from persisted state.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Chunking Strategy</h3>
        <p>
          Files are split into fixed-size chunks for upload.
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Chunk Size:</strong> Configurable (default 5MB). Balance between
            memory usage and overhead.
          </HighlightBlock>
          <li>
            <strong>Chunk ID:</strong> Sequential ID (0, 1, 2...) for ordering.
          </li>
          <li>
            <strong>Upload ID:</strong> Unique ID (UUID) for upload session. Allows
            resuming same upload.
          </li>
          <li>
            <strong>Metadata:</strong> File name, size, hash, chunk count, chunk index.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Parallel Upload Control</h3>
        <p>
          Limit concurrent chunk uploads to avoid overwhelming network/server.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Concurrency Limit:</strong> Upload 4 chunks simultaneously (default).
            Configurable per use case.
          </li>
          <li>
            <strong>Queue:</strong> Queue pending chunks. When a chunk completes,
            dequeue and start next.
          </li>
          <li>
            <strong>Adaptive Concurrency:</strong> Dynamically adjust based on network
            speed (fast network → more concurrent).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Resumability</h3>
        <p>
          Track which chunks uploaded successfully. Resume from last successful chunk.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Completion Tracking:</strong> Set of successfully uploaded chunk
            IDs.
          </li>
          <li>
            <strong>Persistence:</strong> Store to localStorage so page reload resumes
            upload.
          </li>
          <li>
            <strong>Server State Sync:</strong> Query server for already-received
            chunks to resume accurately.
          </li>
          <li>
            <strong>Cleanup:</strong> After upload completes, remove from localStorage.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Progress Reporting</h3>
        <p>
          Report upload progress to UI component for visual feedback.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Bytes Uploaded:</strong> Sum of completed chunk sizes.
          </li>
          <li>
            <strong>Percentage:</strong> (bytesUploaded / fileSize) * 100.
          </li>
          <li>
            <strong>Speed:</strong> bytes per second. Calculate from timestamp
            deltas.
          </li>
          <li>
            <strong>ETA:</strong> (remainingBytes / speed) in seconds.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Update Frequency:</strong> Emit progress every 500ms to avoid
            excessive updates.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cancellation</h3>
        <p>
          User can cancel upload at any time.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Cancel Signal:</strong> Abort in-flight chunk uploads via
            AbortController.
          </li>
          <li>
            <strong>Cleanup:</strong> Clear upload state and localStorage entry.
          </li>
          <li>
            <strong>Server Cleanup:</strong> Optionally notify server to delete
            partial chunks.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Retry Strategy</h3>
        <HighlightBlock as="p" tier="important">
          Retry failed chunks with exponential backoff.
        </HighlightBlock>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Transient Failures:</strong> Network errors, timeouts. Retry.
          </HighlightBlock>
          <li>
            <strong>Permanent Failures:</strong> 4xx errors. Don't retry.
          </li>
          <li>
            <strong>Exponential Backoff:</strong> Delays: 1s, 2s, 4s, 8s. Cap at 32s.
          </li>
          <li>
            <strong>Max Retries:</strong> 5 retries per chunk. After that, surface error.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Server Assembly</h3>
        <p>
          After all chunks uploaded, notify server to assemble into final file.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Assemble Endpoint:</strong> POST /uploads/{"{uploadId}"}/assemble
            with list of chunks.
          </li>
          <li>
            <strong>Verification:</strong> Server verifies all chunks received and
            checksums match.
          </li>
          <li>
            <strong>Assembly:</strong> Concatenate chunks in order to produce final
            file.
          </li>
          <li>
            <strong>Cleanup:</strong> Delete temporary chunk files from server.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Error Handling</h3>
        <p>
          Handle various failure scenarios gracefully.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Network Error:</strong> Connection failed. Retry or allow resume.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Timeout:</strong> Chunk upload took too long. Retry or increase
            timeout.
          </HighlightBlock>
          <li>
            <strong>400 Bad Request:</strong> Chunk corrupted or invalid. Don't retry.
          </li>
          <li>
            <strong>413 Payload Too Large:</strong> Chunk exceeds server limit.
            Reduce chunk size.
          </li>
          <li>
            <strong>Server Error:</strong> 5xx. Retry.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Integrity Verification</h3>
        <p>
          Verify file integrity after upload.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Client Hash:</strong> Compute MD5 or SHA256 of file before upload.
          </li>
          <li>
            <strong>Server Hash:</strong> Server computes hash of assembled file.
          </li>
          <li>
            <strong>Comparison:</strong> Compare hashes. If mismatch, upload failed.
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Browser APIs</h3>
        <HighlightBlock as="p" tier="important">
          Use File API (File, Blob), Slice API for chunking, and AbortController for
          cancellation.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Multipart Upload</h3>
        <HighlightBlock as="p" tier="important">
          Alternative to manual chunking: use multipart/form-data with multiple file
          parts. Server handles assembly. Simpler but less control.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Large File Support</h3>
        <HighlightBlock as="p" tier="important">
          For very large files (1GB+), consider streaming from disk (Node.js fs.streams)
          or using service workers on client.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring</h3>
        <HighlightBlock as="p" tier="crucial">
          Track upload success/failure rates, average chunk size, retry rates,
          cancellation rates.
        </HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Distributed Storage & Multi-Region</h3>
        <p>
          Upload chunks to S3 or distributed storage, not single server. Chunks may
          land on different servers. Use upload ID to correlate. Implement
          cross-region replication for resilience. Chunks must survive one region
          failure.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Resumability Guarantees</h3>
        <p>
          Client persists uploaded chunk IDs to IndexedDB. On reconnect, query
          server for received chunks. Resume from last successful. But what if
          server cleaned partial upload? Implement TTL: keep partial uploads 24hr,
          then delete. Document to user: resume window 24 hours.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Checksum Verification</h3>
        <p>
          Verify each chunk via hash (MD5, SHA256). Detect corruption mid-upload.
          Also verify final file. Hash mismatch → retry. Essential for reliability.
          Trade: CPU overhead for integrity.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Adaptive Chunk Size</h3>
        <HighlightBlock as="p" tier="important">
          Detect network speed, adjust chunk size. Fast network → larger chunks
          (more throughput). Slow network → smaller chunks (more resilient).
          Monitor: if most uploads retry, chunks too large or network bad.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring Upload Metrics</h3>
        <HighlightBlock as="p" tier="important">
          Track: success rate, avg upload time, retry rate, cancel rate, resumption
          frequency. High cancel rate: upload too slow. High retry: network issues.
          Monitor S3/storage API quota—uploads can burn quota fast.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Large Uploads</h3>
        <HighlightBlock as="p" tier="important">
          Test 100MB, 1GB uploads. Simulate network interruptions mid-chunk. Test
          resumption. Test checksum mismatch. Use fake network conditions (latency,
          packet loss). Performance test: doesn't block UI during upload.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Pitfalls</h3>
        <HighlightBlock as="p" tier="crucial">
          Common: memory leak from timers/event listeners during upload. Another:
          upload succeeds on server but fails client-side validation (checksum
          mismatch). Another: resuming old partial upload from wrong session
          (security issue). Another: unbounded retry loop exhausts server storage.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Security Considerations</h3>
        <HighlightBlock as="p" tier="important">
          Validate file type server-side (MIME type checked). Limit file size to
          prevent DoS. Implement rate limiting per user (can't upload 1TB/second).
          Scan uploads for malware (integrate with antivirus service). Require
          authentication before upload.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Integration with Background Jobs</h3>
        <p>
          After chunks uploaded and assembled, queue background job: scan malware,
          generate thumbnails, transcode video. Don't block response waiting for
          this. Return "upload complete" immediately, background work async.
        </p>
      </section>

      <section>
        <h2>Upload Phases & Error Handling</h2>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/networking-data-systems/file-upload-progression.svg"
          alt="File upload phases and error handling strategies diagram"
        />

        <HighlightBlock as="p" tier="crucial">
          Interview signal: treat uploads as a state machine (init session → upload chunks → verify → complete → post-process). Every transition must be resumable and idempotent, otherwise retries create duplicates or corrupt state.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Resumability hinges on durable client state (chunk offsets/ETags in IndexedDB) and a server probe endpoint to reconcile what was received before continuing.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Error handling should be tiered: transient (retry with backoff + jitter), user-correctable (auth expired, file too large), and permanent (integrity mismatch) with clear UX actions (resume/cancel/restart).
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Simplicity vs Features</h3>
        <HighlightBlock as="p" tier="important">
          Simple: single HTTP PUT. Complex: chunking, resumability, parallel. Choose
          based on file size and reliability needs.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Server Complexity</h3>
        <HighlightBlock as="p" tier="important">
          Chunking requires server-side logic to handle chunks and assembly. Simpler
          for single uploads.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Chunk Size</h3>
        <HighlightBlock as="p" tier="crucial">
          Small chunks (1MB) = many requests, high overhead. Large chunks (50MB) = few
          requests but retry one large chunk is painful. 5-10MB is typical.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">The system must handle network interruptions gracefully and provide clear feedback</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">to users. Real-world implementations often use libraries like tus.io or Uppy, but understanding the core design helps when building custom solutions or debugging issues.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
