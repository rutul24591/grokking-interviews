"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-large-file-upload-resume",
  title: "Design a Large File Upload System with Resume Capability",
  description:
    "End-to-end architecture for resumable large file uploads: chunking, multipart S3, progress tracking, virus scanning, CDN distribution, and failure recovery.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "large-file-upload-system-with-resume-capability",
  wordCount: 5500,
  readingTime: 33,
  lastUpdated: "2026-05-10",
  tags: ["hld", "file-upload", "resumable", "multipart-s3", "chunking", "virus-scan"],
  relatedTopics: ["file-upload-api-layer", "export-system"],
};

export default function LargeFileUploadSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Uploading a 5GB video file over a residential internet connection takes 15–60 minutes depending on upload speed. If the upload fails at 95% completion due to a brief network interruption and must restart from zero, the user will abandon the feature. Resumable uploads are not a nice-to-have for large file systems; they are a fundamental reliability requirement. The system must be able to pause, resume, and recover uploads across browser sessions, page refreshes, and network interruptions without losing progress.</p>
        <p>Beyond resumability, large file uploads create backend challenges: files cannot be buffered in memory (a 5GB file in server memory is not viable), files must be scanned for malware before being made available, files must be transcoded or processed (for video, images, or documents), and files must be efficiently distributed via CDN for subsequent reads. The frontend upload progress UI must be accurate (not lying about progress based on bytes transmitted when processing may take additional time) and must handle concurrent uploads, upload prioritization, and upload cancellation.</p>
        <p><strong>Explicit assumptions:</strong> Maximum file size is 5GB. The storage backend is Amazon S3 (multipart upload API). Files require virus scanning (ClamAV or a managed service) before being marked available. Videos require transcoding (multiple quality levels) after upload. The user can upload from a browser (using the File API) or from a mobile app. Progress must survive browser tab refresh (the upload state is persisted to localStorage).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Chunked upload:</strong> Files are split into chunks (default 5MB, the S3 multipart minimum). Each chunk is uploaded independently, enabling resume from the last successfully uploaded chunk.</li>
          <li><strong>Resume capability:</strong> If the upload is interrupted (network failure, browser close, tab crash), resuming the upload continues from the last successful chunk without re-uploading completed chunks.</li>
          <li><strong>Concurrent chunk upload:</strong> Up to 3 chunks upload simultaneously to maximize throughput on connections with high bandwidth but high latency (RTT dominates when uploading one chunk at a time).</li>
          <li><strong>Progress reporting:</strong> Accurate progress percentage based on bytes successfully uploaded to S3 (not just bytes transmitted from the browser—accounts for chunk retry).</li>
          <li><strong>Post-upload processing:</strong> Automatic virus scan and (for video) transcoding pipeline triggered after the final chunk is uploaded and S3 multipart is completed.</li>
          <li><strong>Upload cancellation:</strong> User can cancel an in-progress upload. All uploaded parts are cleaned up from S3 to avoid orphaned storage costs.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Throughput:</strong> Achieve &gt;80% of available upload bandwidth utilization. Concurrent chunks and adaptive chunk sizing ensure bandwidth is saturated.</li>
          <li><strong>Reliability:</strong> A chunk failure is retried up to 3 times before the upload is marked as failed. Transient network errors should not require user intervention.</li>
          <li><strong>Storage efficiency:</strong> Incomplete uploads (abandoned after partial progress) are cleaned up after 24 hours. S3 lifecycle rules delete incomplete multipart uploads.</li>
          <li><strong>Security:</strong> Upload URLs are pre-signed (time-limited, user-scoped). Uploaded files are inaccessible until virus scanning completes (stored in a quarantine bucket).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The upload architecture has three phases. The initiation phase: the client requests an upload session from the backend, which creates an S3 multipart upload (receiving an UploadId from S3), stores the session state (which chunks have been uploaded, the multipart UploadId, the target S3 key), and returns to the client a session token and the first batch of pre-signed part URLs. The upload phase: the client uploads each chunk directly to S3 using the pre-signed URLs, reports chunk completion to the backend, and receives the ETag returned by S3 for each part. The completion phase: once all chunks are uploaded, the client sends a complete request to the backend, which calls S3's CompleteMultipartUpload API (assembling the parts into a final object) and then triggers the post-upload processing pipeline (virus scan, transcoding).</p>
        <p>Direct-to-S3 upload (the client uploads directly using pre-signed URLs, bypassing the backend for data transfer) is the correct architecture for large files. Routing the file data through the backend server would require the backend to buffer the entire file and then re-upload to S3, doubling transfer time and consuming server resources proportional to file size. Direct-to-S3 eliminates the backend as a data transfer bottleneck; the backend is only involved in session management and chunk tracking.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/large-file-upload-system-with-resume-capability-architecture.svg"
          alt="Large file upload architecture showing three phases: initiation (client → backend → S3 CreateMultipartUpload → session store → pre-signed part URLs), upload (client → S3 directly using pre-signed URLs, chunk progress tracked in backend session), and completion (client → backend CompleteMultipartUpload → quarantine bucket → virus scan → transcoding pipeline → CDN distribution). Resume path from localStorage session state shown."
          caption="File upload architecture: direct-to-S3 chunked upload with backend session management, virus scanning in quarantine, and post-upload processing pipeline"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Chunking Strategy and Adaptive Chunk Sizing</h3>
        <p>The default chunk size is 5MB (S3 multipart minimum, except for the last part which can be smaller). For very large files (1GB+) on high-bandwidth connections, larger chunks (10MB, 25MB) reduce per-chunk HTTP overhead and improve throughput. Adaptive chunk sizing measures the time to upload the first chunk: if it completes in under 2 seconds, increase chunk size for subsequent chunks; if it takes more than 10 seconds, decrease. This adaptation converges on a chunk size that saturates the connection in approximately 5-second round trips, balancing throughput against the progress update granularity (larger chunks mean fewer progress updates).</p>
        <p>The file is sliced using the File.slice() API (or Blob.slice()), which creates a view into the file without copying it into memory. This is critical for large files: a 5GB file should not be read entirely into JavaScript memory. Instead, only the current batch of chunks being uploaded (3 × 5MB = 15MB) is in memory at any time. The slice operation is O(1)—it creates a Blob reference to a byte range within the original File, which the browser reads from disk on demand during the XMLHttpRequest or fetch upload.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Resume Mechanism and Session Persistence</h3>
        <p>The upload session state is persisted to localStorage on every chunk completion: the session token (enabling backend session lookup), the fileId, the file's name and size, the set of completed chunk numbers, and the upload's logical timestamp. On page load, the client checks localStorage for incomplete upload sessions. For each found session, the client shows a "Resume upload?" prompt with the file name and completion percentage. If the user accepts, the client contacts the backend to validate the session (check if the S3 multipart upload is still active and which chunks have been confirmed), reconciles with the local state, and resumes from the first incomplete chunk.</p>
        <p>Session reconciliation is necessary because the local localStorage state and the server state can diverge: a chunk may have been received by S3 but the client crashed before the backend could be notified. The backend validates against S3 directly: it calls S3's ListParts API for the UploadId to get the canonical list of uploaded parts (with their ETags). The client updates its local state to match the server's confirmed list and resumes from the next unconfirmed chunk. ListParts is the ground truth; localStorage is a UX optimization for fast resume (avoiding the ListParts round trip when the local state is already correct).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pre-Signed URL Management</h3>
        <p>Pre-signed S3 part URLs have a limited validity window (typically 1–4 hours). For very large files, the initial batch of pre-signed URLs may expire during upload. The backend issues URLs in batches: the initiation response includes pre-signed URLs for the first 20 chunks. As the upload progresses, when the client has 5 or fewer pre-signed URLs remaining, it requests the next batch. The backend generates new pre-signed URLs for the remaining parts and returns them. This lazy generation strategy avoids generating thousands of pre-signed URLs upfront (which is wasteful if the upload is abandoned) while ensuring the client always has URLs ready for the next batch of chunks.</p>
        <p>Pre-signed URLs are scoped to the user's session and the specific S3 key for this upload. They cannot be used to upload to other S3 keys or by other users. The signature includes the S3 key, the part number, the UploadId, the expiry timestamp, and an HMAC signature using the backend's AWS credentials. A stolen pre-signed URL can only upload a specific part of a specific multipart upload for the validity window—it cannot be used for arbitrary S3 writes.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Progress Tracking and Accurate UI</h3>
        <p>The XMLHttpRequest upload progress event (or the fetch API's ReadableStream) provides bytes-transmitted progress for each chunk. True progress is based on chunks successfully confirmed by the backend (which has received the ETag from S3), not just bytes transmitted. The distinction matters for retried chunks: if chunk 3 fails and is retried, the "bytes transmitted" count briefly exceeds "bytes successfully uploaded" during the retry. The progress bar tracks confirmed bytes (sum of sizes of confirmed chunks) rather than transmitted bytes to provide an accurate, never-decreasing progress indicator.</p>
        <p>The progress UI shows three elements: a percentage and progress bar (0–100% of file bytes confirmed uploaded), an estimated time remaining (current upload rate extrapolated to remaining bytes), and a status text ("Uploading – 3 chunks in progress" / "Processing – virus scan in progress" / "Complete"). The status transitions from "Uploading" to "Processing" after the final chunk completes (when the file is in the quarantine bucket awaiting virus scan) and to "Complete" after the virus scan and transcoding pipeline signal completion via a webhook callback. The frontend polls the file status endpoint after the upload phase ends to detect processing completion.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Virus Scanning and Quarantine</h3>
        <p>Files are uploaded to a quarantine S3 bucket that is not publicly accessible and not CDN-distributed. After CompleteMultipartUpload, the backend enqueues a virus scan job. The virus scanner (running on an EC2 instance or a managed scanning service like AWS GuardDuty Malware Protection) downloads the file from the quarantine bucket, scans it, and reports the result. If clean, the backend moves the file to the public distribution bucket and marks the file as available in the database. If infected, the file is deleted from the quarantine bucket, the file record is marked as infected, and the uploader is notified.</p>
        <p>For video files, the transcoding pipeline runs after the virus scan: the backend enqueues a transcoding job (via AWS Elastic Transcoder, MediaConvert, or FFmpeg on a dedicated worker). The job produces multiple output renditions (480p, 720p, 1080p as MP4 and HLS segments) and thumbnails. These outputs are stored in the distribution bucket and the database record is updated with the available renditions and their S3 keys. The frontend video player uses the highest-quality rendition that fits the available bandwidth (adaptive bitrate streaming).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Upload Cancellation and Cleanup</h3>
        <p>When the user cancels an upload, the client sends a cancel request to the backend, which calls S3's AbortMultipartUpload API. This releases all parts that were uploaded to S3, freeing storage immediately. The local session state is cleared from localStorage. Without explicit cancellation, incomplete multipart uploads accumulate in S3 at cost (S3 charges for parts even when the multipart upload is not completed). An S3 lifecycle rule provides a safety net: incomplete multipart uploads older than 24 hours are automatically aborted by S3, preventing orphaned storage accumulation from abandoned uploads (browser crash, tab close without cancellation).</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/large-file-upload-system-with-resume-capability-reliability.svg"
          alt="File upload reliability mechanisms showing chunk retry (up to 3 retries with exponential backoff), session reconciliation on resume (ListParts API vs localStorage state), pre-signed URL batch refresh before expiry, S3 lifecycle rule for 24-hour incomplete multipart cleanup, virus scan quarantine flow, and bandwidth adaptation via adaptive chunk sizing"
          caption="Upload reliability: chunk retry, session reconciliation via ListParts, adaptive chunk sizing, quarantine scanning, and lifecycle cleanup for abandoned uploads"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Direct-to-S3 versus server-mediated upload: direct-to-S3 removes the backend from the data path (only session management and tracking go through the backend), dramatically reducing server resource consumption for large files. The trade-off is that the backend loses the ability to inspect file content before it reaches S3 (content type validation, image dimension checks must be done post-upload in the processing pipeline, not pre-upload in the server middleware). For sensitive applications where pre-upload content inspection is required, server-mediated upload is necessary despite the cost.</p>
        <p>S3 multipart versus tus protocol: tus (https://tus.io) is an open-source resumable upload protocol with implementations for both client and server, supporting arbitrary storage backends. Using tus would allow switching from S3 to any storage backend without changing the client; it also provides a standardized protocol that clients across platforms (web, mobile, desktop) can implement uniformly. The trade-off is that tus requires a server-side endpoint that manages state, whereas S3 multipart can be done with pre-signed URLs (no server in the data path). For organizations committed to S3, native S3 multipart with pre-signed URLs is simpler and eliminates the extra network hop through a tus server.</p>
        <p>Chunk size and memory usage: the S3 minimum part size of 5MB means at least one 5MB buffer must be in memory per concurrent chunk upload (3 concurrent = 15MB minimum). For applications running on memory-constrained devices (older mobile phones), this may be the practical limit on concurrency. The S3 maximum of 10,000 parts per multipart upload constrains minimum chunk size for very large files: a 10GB file with 5MB chunks requires 2000 parts (within the limit); a 50GB file with 5MB chunks requires 10,000 parts (at the limit). Files larger than 50GB require chunk sizes above 5MB to stay within the 10,000-part limit.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A resumable large file upload system uses S3 multipart upload with direct-to-S3 chunk transfer via pre-signed URLs, removing the backend from the data path. The client slices files into 5MB chunks using Blob.slice() (no memory copy), uploads 3 chunks concurrently, and confirms each completed chunk with the backend (which records the S3 ETag). Upload session state is persisted to localStorage for resume across browser refreshes; on resume, ListParts reconciles the local state against S3's confirmed part list. Progress is tracked based on confirmed bytes (not transmitted bytes) for an accurate, non-decreasing indicator. Pre-signed URLs are generated lazily in batches to handle long-duration uploads without URL expiry. Files are uploaded to a quarantine bucket, virus-scanned before promotion to the distribution bucket, and (for video) transcoded to multiple quality levels. Abandoned multipart uploads are cleaned up by S3 lifecycle rules after 24 hours.</p>
      </section>
    </ArticleLayout>
  );
}
