"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-large-file-upload-resume",
  title: "Design a Large File Upload System with Resume Capability",
  description:
    "End-to-end architecture for resumable large file uploads: chunking, multipart S3, progress tracking, virus scanning, CDN distribution, and failure recovery.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "large-file-upload-system-with-resume-capability",
  wordCount: 6200,
  readingTime: 37,
  lastUpdated: "2026-05-20",
  tags: ["hld", "file-upload", "resumable", "multipart-s3", "chunking", "virus-scan"],
  relatedTopics: ["file-upload-api-layer", "export-system"],
};

export default function LargeFileUploadSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          A large file upload system lets users reliably upload multi-gigabyte files over unreliable networks without
          restarting from zero after a tab refresh, mobile app restart, transient network failure, or expired upload
          credential. The main challenge is not just moving bytes. The system must preserve progress, avoid backend
          bandwidth bottlenecks, validate ownership, clean up abandoned storage, quarantine untrusted content, and show
          progress that distinguishes upload completion from post-upload processing.
        </HighlightBlock>
        <p>
          A 5 GB video upload can take tens of minutes on home broadband or mobile networks. If the connection drops
          at 95 percent and the product starts again, users will abandon the flow. Resumability is therefore a product
          reliability requirement. It also changes system design: the client needs durable session state, the backend
          needs an upload session model, storage must support partial objects, and the completion step must be
          idempotent.
        </p>
        <p>
          The common production baseline is direct-to-object-storage multipart upload. The backend manages identity,
          policy, upload sessions, pre-signed part URLs, and completion. The browser or mobile client sends file chunks
          directly to S3-compatible storage. After all parts are uploaded, the backend completes the multipart upload,
          keeps the object in quarantine, runs malware scanning and processing, and only then marks the file available
          for download, preview, streaming, or CDN distribution.
        </p>
        <p>
          In interviews, define scale and constraints early. A practical scope is files up to 5 GB, chunked uploads
          using the browser File API, three to five concurrent part uploads, retry with backoff, progress surviving
          browser refresh, cleanup for abandoned uploads, virus scanning before availability, and video transcoding for
          media files. Principal-level answers should also cover credential expiry, stale local state, mobile
          background limits, storage lifecycle cost, and the difference between confirmed uploaded bytes and bytes
          merely sent over a failing connection.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Multipart Upload Sessions</h3>
        <p>
          A multipart upload splits a file into numbered parts. Each part is uploaded independently and object storage
          returns an ETag or checksum for that part. Completion assembles the final object from the ordered list of
          uploaded parts. The upload session record should include user ID, tenant ID, object key, upload ID, file
          name, size, content type, part size, total parts, completed parts, created time, expiration, status, and
          policy decisions such as maximum size and allowed file type.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Client-Side Chunking Without Full Memory Reads</h3>
        <p>
          Browser clients should use `Blob.slice()` or equivalent platform APIs to create chunk views over the file.
          The entire file should never be read into JavaScript memory. With three 8 MB chunks in flight, the memory
          pressure is bounded to active upload buffers and browser overhead. This is important on low-memory devices,
          especially when users upload videos while the page also renders previews, forms, or progress lists.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Resume Requires Reconciliation</h3>
        <p>
          Local persisted state is not the source of truth. A browser may crash after S3 accepts a part but before the
          backend records completion. On resume, the backend should reconcile against object storage with ListParts or
          an equivalent API, then return the canonical completed-part set. The client can use local state for quick UX,
          but it must accept that storage has the final answer for which parts already exist.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Availability Is a Post-Processing State</h3>
        <p>
          Upload completion does not mean the file is safe or usable. Files should land in quarantine, then pass
          malware scanning, content validation, optional transcoding, metadata extraction, and policy checks. The UI
          should show "uploading," "processing," "available," "rejected," or "failed" distinctly. Otherwise progress
          appears to reach 100 percent and then mysteriously stalls.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/large-file-upload-system-with-resume-capability-architecture.svg"
          alt="Large file upload architecture with session initiation, direct-to-S3 multipart upload, session tracking, completion, quarantine scanning, processing, and CDN promotion"
          caption="Architecture: backend controls sessions and policy while clients send chunks directly to object storage; processing promotes clean files from quarantine."
        />
        <p>
          The initiation flow starts when the client sends file metadata to the backend: name, size, content type,
          checksum if available, target folder or entity, and requested processing type. The backend checks quota,
          authorization, file type policy, and tenant limits. It creates an object-storage multipart upload in a
          quarantine bucket, stores the upload session, and returns a session token plus pre-signed URLs for the first
          batch of part numbers.
        </p>
        <p>
          During upload, the client slices the file into parts and uploads several parts concurrently. Each successful
          part returns a part ETag or checksum. The client reports completion to the backend, which records confirmed
          parts. The client persists session token, file fingerprint, part size, total parts, and completed part
          numbers in durable local storage. If the page refreshes, the user can pick the same file and resume the
          session after server reconciliation.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/large-file-upload-system-with-resume-capability-workflow.svg"
          alt="Upload workflow showing create session, batch signed URLs, concurrent part uploads, record ETags, complete multipart, scan, transcode, and mark available"
          caption="Workflow: progress moves from session creation to part upload, multipart completion, scanning, processing, and final availability."
        />
        <p>
          Completion should be backend-owned. The client tells the backend it believes all parts are done. The backend
          fetches or verifies the part list, calls CompleteMultipartUpload with the ordered parts, marks the session as
          completing, and enqueues post-upload processing. Completion must be idempotent because clients can retry
          after timeouts. If completion already succeeded, the backend should return the existing file record instead
          of attempting to complete the multipart upload again.
        </p>
        <p>
          Post-upload processing should be asynchronous and observable. Malware scanning should run before the file is
          available to other users. Video transcoding can then produce HLS or DASH renditions, thumbnails, and duration
          metadata. Document uploads may trigger text extraction or preview conversion. The file record should include
          processing state, failure reason, retry eligibility, and safe user-facing messages.
        </p>
        <p>
          Cancellation and cleanup are part of the core flow. If the user cancels, the backend should call
          AbortMultipartUpload and mark the session canceled. If the user disappears, object storage lifecycle rules
          should abort incomplete multipart uploads after a retention window such as 24 hours. The backend should also
          expire upload sessions and reject stale pre-signed URL generation for abandoned sessions.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/large-file-upload-system-with-resume-capability-reliability.svg"
          alt="Upload reliability mechanisms showing retries, ListParts reconciliation, signed URL refresh, adaptive chunks, quarantine scanning, and lifecycle cleanup"
          caption="Reliability: retries, reconciliation, credential refresh, adaptive chunk sizing, quarantine scanning, and lifecycle cleanup address different failure classes."
        />
        <p>
          Direct-to-storage upload removes the application backend from the byte path, which is the main scalability
          win. The backend handles small control-plane requests while object storage absorbs large data transfer. The
          trade-off is that the backend cannot inspect bytes before they land in quarantine. Validation that depends on
          file content, dimensions, malware status, or media duration happens after upload. Sensitive products may use
          a server-mediated path for selected uploads, accepting higher cost for stronger inline control.
        </p>
        <p>
          Native S3 multipart upload is simple when the platform is committed to S3-compatible storage. The tus
          protocol gives a standardized resumable upload API across storage backends and clients, but it usually puts a
          tus server in the data path or at least requires more server-managed state. For web and mobile products on
          S3, pre-signed multipart is often the pragmatic choice. For multi-cloud products, developer platforms, or
          offline-first clients, tus may be worth the protocol uniformity.
        </p>
        <p>
          Chunk size is a throughput, memory, and retry trade-off. Small chunks provide frequent progress updates and
          cheaper retries but create more HTTP overhead and hit object-storage part limits. Large chunks improve
          throughput and reduce per-part overhead but increase memory usage and make retries more expensive. Adaptive
          chunk sizing can start conservatively and increase size when early parts complete quickly. The system must
          also respect storage limits such as S3's 10,000-part maximum.
        </p>
        <p>
          Progress based on transmitted bytes feels responsive but can be dishonest after retries. Progress based on
          confirmed bytes is monotonic and accurate but less smooth. A good UI can show both concepts: the primary
          progress bar reflects confirmed bytes, while per-part sub-progress shows active transfer. After the final
          part, the UI moves to processing rather than declaring the file available.
        </p>
        <p>
          Pre-signing all part URLs upfront simplifies the client but wastes backend work and increases expiry risk for
          long uploads. Generating URLs in batches reduces waste and handles long sessions, but the client needs a URL
          refresh path before it runs out. A robust client asks for the next batch when the remaining signed URLs fall
          below a threshold and pauses new part starts if credentials expire.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Principal-level decision frame</h3>
        <p>
          The main architectural decision is whether the upload service owns only control-plane state or also owns the
          byte path. Control-plane-only is the default for consumer scale because storage and CDN providers absorb the
          expensive transfer. Byte-path ownership is justified when inline DLP, encryption transforms, tenant-specific
          routing, bandwidth shaping, or compliance inspection must happen before bytes land. The principal answer
          should identify which tenants or file classes require the expensive path rather than routing every upload
          through application servers.
        </p>
        <p>
          SLOs should distinguish upload completion from content availability. A user may finish uploading in minutes,
          while malware scanning, transcoding, OCR, or policy review can take longer. The product should expose states
          such as uploaded, scanning, processing, blocked, failed, and available instead of collapsing all work into a
          single progress bar. This framing prevents bad promises and gives operators clear queues to scale during
          import spikes.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <p>
          Make every control-plane operation idempotent. Session initiation can use a client-generated upload request
          ID so accidental double-clicks do not create duplicate sessions. Part confirmation should tolerate duplicate
          reports for the same part and ETag. Completion should return the existing final file when already completed.
          Cancellation should be safe to retry after the storage abort call times out.
        </p>
        <p>
          Fingerprint the local file before resume. A saved session token alone is not enough because the user may pick
          a different file with the same name. The client should compare size, last modified time, and ideally a cheap
          partial hash or full hash when feasible. The backend should verify expected size and part count before
          completion. For high-integrity workflows, each part should include checksums and the final object should be
          validated against an expected digest.
        </p>
        <p>
          Use backpressure and adaptive concurrency. Three concurrent parts may be reasonable on desktop broadband,
          while one part may be better on memory-constrained mobile devices. The client can reduce concurrency after
          repeated failures, HTTP 429s, battery saver signals, or tab backgrounding. The backend can return retry-after
          hints when tenants exceed rate limits.
        </p>
        <p>
          Treat quarantine as a hard boundary. Files in quarantine should not be publicly readable, CDN-distributed, or
          available through share links. Processing workers should have least-privilege access to quarantine objects
          and write outputs to controlled destination prefixes. Infected or policy-rejected files should be deleted or
          retained according to security policy, with user-facing status that does not expose sensitive scanner internals.
        </p>
        <p>
          Instrument the upload funnel. Track initiation success, part upload latency, retry rate by network type,
          resume success, credential refresh failures, completion failures, scan latency, processing failures,
          abandoned sessions, lifecycle cleanup volume, and user cancellation. These metrics reveal whether failures
          come from client networks, credential expiry, object storage, backend state, or post-processing.
        </p>
        <p>
          Plan for tenant and regional isolation. Large upload systems can saturate egress, object storage request
          limits, virus scanners, and transcoders. Per-tenant quotas, regional upload endpoints, queue priorities, and
          backpressure signals keep one bulk import or abusive tenant from degrading normal users. This is especially
          important for enterprise imports and media-heavy products.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          A common pitfall is trusting localStorage as the source of truth for resume. Local state can be stale,
          deleted, copied, or ahead of backend state. Always reconcile with the backend and storage before resuming.
          The canonical completed-part list should come from object storage or a backend record verified against
          storage.
        </p>
        <p>
          Another pitfall is marking a file available immediately after multipart completion. At that point the system
          has a complete object, not a safe object. Malware scanning, policy validation, and media processing may still
          fail. The UI should set expectations by moving from "uploading" to "processing" and then to "available" or
          "rejected."
        </p>
        <p>
          Teams often forget cleanup economics. Incomplete multipart uploads can accumulate storage charges. Failed
          processing outputs can leave orphaned thumbnails, HLS segments, or temporary conversion files. Use storage
          lifecycle policies plus explicit cleanup workers tied to session state transitions.
        </p>
        <p>
          Another pitfall is assuming a resumed upload means a valid upload. The client may resume from a different
          file, a stale session, or an object whose parts were partially cleaned up. Resume must reconcile file
          fingerprint, expected size, confirmed parts, URL expiry, and backend session state before starting new
          transfer work.
        </p>
        <p>
          Pre-signed URL expiry can silently break long uploads. If a client receives 1,000 part URLs with a one-hour
          TTL and the upload takes longer, later parts fail even though earlier progress is valid. Generate URLs in
          batches and refresh before expiry. The client should classify expiry separately from network failure so it
          requests fresh credentials instead of wasting retries.
        </p>
        <p>
          Finally, progress bars often lie. Counting bytes sent by the network stack can exceed confirmed bytes when a
          chunk fails near the end and retries. A reliable product uses confirmed parts for durable progress and shows
          processing status separately after upload completion.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <p>
          Video platforms use resumable upload for creator workflows. The upload path must handle large files, unstable
          home networks, background tab throttling, virus scanning, transcoding, thumbnail extraction, copyright checks,
          and delayed publish availability. The creator dashboard needs separate states for uploaded, processing, ready,
          failed, and rejected.
        </p>
        <p>
          Enterprise document systems use large upload for PDFs, CAD files, design assets, evidence bundles, and data
          exports. These products emphasize authorization, retention, auditability, malware scanning, and folder quota
          enforcement more than media transcoding. Resume matters because enterprise users often upload from VPNs or
          managed devices with intermittent connectivity.
        </p>
        <p>
          Cloud drive and backup products use resumable upload at much larger scale. They need deduplication, content
          hashes, bandwidth scheduling, background sync, file change detection, conflict handling, and per-device
          upload queues. The same multipart principles apply, but the client scheduler becomes more sophisticated.
        </p>
        <p>
          Support and marketplace products use upload for attachments, identity verification, returns evidence, and
          seller media. These workflows often need strict file type policy, virus scanning before agent access, image
          normalization, and clear failure messages because users may be blocked from completing a transaction until
          upload succeeds.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Why should large uploads go directly to object storage instead of through the backend?
        </h3>
        <p>
          Direct-to-storage upload keeps the backend out of the high-bandwidth data path. The backend remains the
          control plane for authorization, quotas, session state, pre-signed URLs, and completion, while object storage
          handles large byte transfer. This avoids buffering multi-gigabyte files in application servers and reduces
          bandwidth cost. The trade-off is that content inspection happens after upload in quarantine, so the product
          must not expose the file until scanning and policy checks pass.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How does resume work after a browser refresh?
        </h3>
        <p>
          The client persists upload session metadata locally, including session token, file fingerprint, part size,
          and completed parts. On resume, the user selects the same file or the app recovers it where platform APIs
          allow. The backend validates the session and reconciles completed parts against object storage using
          ListParts or equivalent. The client then skips confirmed parts, requests fresh signed URLs for missing parts,
          and resumes upload. Local state speeds up UX but storage reconciliation is the source of truth.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How would you handle URL expiry during a long upload?
        </h3>
        <p>
          I would issue pre-signed URLs in batches rather than all upfront. The client tracks expiry and remaining URL
          count. When the queue falls below a threshold or expiry approaches, it requests a fresh batch for remaining
          part numbers. If a part upload fails with an expiry-related error, the client should classify it as a
          credential refresh problem, not a network retry problem, and fetch new URLs before continuing.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          What should the progress UI show?
        </h3>
        <p>
          The primary progress bar should show confirmed uploaded bytes, computed from successfully completed parts.
          Active part progress can be shown as secondary feedback, but it should not make durable progress move beyond
          what storage has accepted. After all parts are uploaded and the multipart object is completed, the UI should
          switch to processing states such as scanning, transcoding, ready, failed, or rejected. This avoids the common
          "100 percent but still not done" confusion.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you clean up abandoned uploads?
        </h3>
        <p>
          The backend should expire stale sessions and stop issuing new signed URLs after the allowed window. User
          cancellation should call AbortMultipartUpload immediately. Object storage lifecycle rules should abort
          incomplete multipart uploads after a retention period as a safety net. Processing workers should also clean
          up temporary outputs and failed derived artifacts. Metrics should track abandoned sessions and cleanup volume
          because they directly affect storage cost.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you choose chunk size and concurrency?
        </h3>
        <p>
          Start with a conservative chunk size that satisfies storage minimums, such as 5 to 8 MB for S3 multipart,
          and a small concurrency such as three parts. Increase chunk size when early parts finish quickly and network
          quality is good. Decrease concurrency after repeated failures, low memory signals, mobile backgrounding, or
          server rate-limit hints. The design must respect object-storage part limits and avoid loading too much file
          data into memory.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html" target="_blank" rel="noreferrer">
              Amazon S3 multipart upload overview
            </a>
            , multipart session, part, completion, and abort semantics.
          </li>
          <li>
            <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html" target="_blank" rel="noreferrer">
              Amazon S3 presigned URL documentation
            </a>
            , scoped temporary upload credentials.
          </li>
          <li>
            <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpu-abort-incomplete-mpu-lifecycle-config.html" target="_blank" rel="noreferrer">
              Amazon S3 lifecycle rules for incomplete multipart uploads
            </a>
            , abandoned upload cleanup.
          </li>
          <li>
            <a href="https://tus.io/protocols/resumable-upload" target="_blank" rel="noreferrer">
              tus resumable upload protocol
            </a>
            , standardized resumable upload trade-offs.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Blob/slice" target="_blank" rel="noreferrer">
              MDN: Blob.slice
            </a>
            , browser-side file chunking.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
