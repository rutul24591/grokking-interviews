"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-native-drag-drop-file",
  title: "Native Drag-and-Drop File System",
  description: "Handling file drops from OS with validation, preview, and upload orchestration",
  category: "low-level-design",
  subcategory: "web-platform-browser-apis",
  slug: "native-drag-drop-file",
  wordCount: 5800,
  readingTime: 35,
  lastUpdated: "2026-05-06",
  tags: ["lld", "file-handling", "drag-drop", "upload", "ux"],
  relatedTopics: ["file-upload-api-layer", "background-sync"],
};

export default function NativeDragDropArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">A user wants to upload files. They drag files from their desktop to the browser window. Without native drag-drop handling, nothing happens. With poor handling, the browser opens the files in the tab (breaking the app). With good handling, files are detected, shown for preview, and uploaded seamlessly.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The challenge: implementing native drag-drop requires careful event handling (dragover, dragenter, dragleave, drop), file extraction from the DataTransfer object, validation (file type, size), and visual feedback (drop zone highlighting, progress indicators). Errors are common: files don't upload, large files crash, wrong file types are accepted, and users lack visibility into progress.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">A robust system detects file drops anywhere on the page, validates files against rules (accept only images, max 10MB), shows a preview before upload, implements chunked upload for large files, displays progress, and handles retries for failed uploads. The user has clear feedback at every step.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Key insight: native drag-drop is a browser API, but building a production-grade upload system requires orchestration: validation, preview, upload, progress, error recovery, and state management.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>Explicit assumptions:</strong> FileReader API available for previews. Fetch or XMLHttpRequest available for uploads. Large files (500MB+) supported via chunked upload. MIME type checking available. The server supports resumable uploads (if needed for very large files).</HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>File detection:</strong> Detect files dropped anywhere on the page (whole window, not just drop zone).</li>
          <li><strong>DataTransfer extraction:</strong> Extract files from DataTransfer object on drop event.</li>
          <li><strong>File validation:</strong> Validate file type (MIME), size, count (single vs multiple). Reject invalid files with clear error messages.</li>
          <li><strong>Preview generation:</strong> For images/documents, generate thumbnails or previews before upload.</li>
          <li><strong>Chunked upload:</strong> For large files, split into chunks and upload sequentially. Allow pausing/resuming.</li>
          <li><strong>Progress tracking:</strong> Show upload progress (percentage complete, bytes uploaded/remaining, estimated time).</li>
          <HighlightBlock as="li" tier="crucial"><strong>Error handling:</strong> Detect and display upload failures. Offer retry or discard options.</HighlightBlock>
          <li><strong>Duplicate detection:</strong> Prevent uploading the same file twice (via file hash or size/name comparison).</li>
          <li><strong>Visual feedback:</strong> Highlight drop zone on dragover, show file list, display upload status.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Latency:</strong> File validation and preview generation under 100ms per file (for reasonably-sized files). Upload chunk request under 50ms to send.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Throughput:</strong> Handle 1GB+ total uploads without crashing. Multiple simultaneous uploads supported.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Memory:</strong> File chunks loaded into memory only as needed; full file never fully loaded (streaming). Preview generation doesn't bloat memory.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Reliability:</strong> Failed chunks retry automatically. Network interruptions don't lose progress (resumable upload).</HighlightBlock>
          <li><strong>Browser compatibility:</strong> Chrome 3+, Firefox 3.6+, Safari 3.1+ (Drag-drop). FileReader on all modern browsers.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">The system registers dragover and drop event listeners on the document. When files are dropped, the DataTransfer.files property contains the dropped files. The system validates each file (type, size), displays them in a queue, and initiates upload. Large files are split into chunks; each chunk is uploaded with retry logic. Progress is tracked and displayed. Failed uploads offer retry. The UI shows thumbnails or previews for images.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Validation happens before upload: reject invalid files immediately with clear error messages. Preview generation is lazy: thumbnails are created on-demand as the user scrolls the file list, avoiding jank from processing 100 images upfront.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Upload strategy: for typical files (for example under about 100 MB), upload in one request. For very large files, chunk into 5-10 MB pieces and upload sequentially. Each chunk includes a file hash and sequence number for resume capability: if upload interrupts at chunk 3 of 10, resume from chunk 3 without re-uploading earlier chunks.</HighlightBlock>
      </section>

      <section>
                <h2>Diagram Walkthrough</h2>

<ArticleImage
          src="/diagrams/system-design-problems/low-level-design/web-platform-browser-apis/native-drag-drop-file.svg"
          alt="Native drag-and-drop file system showing drop zone event lifecycle, file validation pipeline, chunked upload with resume support, and progress tracking"
          caption="Native drag-and-drop file system showing drop zone event lifecycle, file validation pipeline, chunked upload with resume support, and progress tracking"
        />

        <HighlightBlock as="p" tier="crucial">
          Interview signal: the diagram captures the end-to-end flow for <strong>Native Drag-and-Drop File System</strong>. You should be able to explain the happy path and the failure paths (retries, cancellation, backpressure), not just the API surface.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Look for the &ldquo;control points&rdquo; where correctness is enforced: idempotency keys, monotonic request/version tokens, single-flight coordination, and durable persistence boundaries.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          In interviews, call out observability and operability: what you log/measure (p95 latency, error rates, retries/queue depth) and how you keep degraded modes user-safe (read-only, queued, or cached fallbacks).
        </HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Drag-Drop Event Handling</h3>
        <p>Register dragover and drop listeners on document or a specific drop zone. On dragover (file dragged over), prevent default browser behavior (would open file in tab) and highlight drop zone to provide visual feedback. On dragleave (file dragged away), remove highlight. On drop, extract files and process.</p>
        <p>Key: prevent default on dragover and drop to prevent browser from opening files. Show visual feedback (highlight, opacity change) to indicate drop zone is active. This improves UX: user knows where to drop.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">File Validation</h3>
        <HighlightBlock as="p" tier="important">Validate file properties before upload: check MIME type against accept list (e.g., image/*, audio/*), file size against limits (e.g., max 100MB), and file count (e.g., max 10 files at once). Use file.type (MIME) for type checking; for critical cases, also validate file extension as secondary check (file.name.endsWith('.jpg')).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Reject invalid files with specific error messages: "Images only (PNG, JPG)" for type mismatch, "Max 100MB per file" for oversized, "Max 10 files at once" for too many. Show rejected files in the UI in red; allow user to remove and re-try with valid files.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Preview Generation</h3>
        <p>For image files, use FileReader to read the file and generate a data URL for preview thumbnail. For documents (PDF, etc.), read the first page and generate a thumbnail (requires PDF library). For other files, show generic icons based on MIME type.</p>
        <p>Lazy preview: don't generate all previews upfront; generate on-demand as the user scrolls the file list. Use intersection observer to detect when preview is about to become visible, then generate. This avoids jank and memory overhead for large file lists.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Chunked Upload Strategy</h3>
        <HighlightBlock as="p" tier="important">For small files (for example under about 100 MB), upload in a single request. For large files, split into 5-10 MB chunks based on device bandwidth estimate. Each chunk is uploaded with a request body containing chunk data, file hash (for resumption), chunk sequence number, and total chunks. Server stores chunks and reassembles when all are received.</HighlightBlock>
        <p>Resume capability: track which chunks have been successfully uploaded (server acknowledges with 2xx status). If upload interrupts, query server for received chunks and continue from the next missing chunk. This is critical for very large uploads (GBs) over unstable networks.</p>
        <HighlightBlock as="p" tier="important"><strong>Chunk Size and Bandwidth Adaptation:</strong> Chunk size should adapt to network conditions. Start with 5MB chunks. If chunks consistently take &lt; 1 second, increase to 10MB (fewer requests overhead). If chunks take &gt; 5 seconds, decrease to 2MB (reduce timeout risk). Use exponential backoff: track average upload speed (bytes/sec) and estimate chunk completion time. If estimated time exceeds timeout (e.g., 60s), reduce chunk size. Additionally, implement parallel chunk upload: instead of uploading chunks 1-2-3 sequentially, upload chunks 1 and 2 in parallel (if bandwidth allows). This increases overall throughput. Limit parallelism to 4-8 simultaneous chunks (prevents server overload and connection limits).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Progress Tracking and Display</h3>
        <p>For each file, track bytes uploaded / total bytes. For chunked uploads, combine progress: if 3 of 10 chunks complete, show 30% progress. Display percentage, bytes remaining, and estimated time (based on upload speed average). Update progress bar in real-time as chunks complete.</p>
        <p>For multiple simultaneous uploads, show aggregate progress (total bytes across all files) and per-file progress. Allow users to pause individual uploads or all uploads.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Error Handling and Retry</h3>
        <HighlightBlock as="p" tier="crucial">On upload failure (network error, server 5xx, timeout), automatically retry with exponential backoff: immediately, then 1s, 2s, 4s, capping at 30s. After 3-5 retries, move the file to a failed state and notify the user. Offer manual retry button or discard option.</HighlightBlock>
        <p>Network detection: if the browser goes offline, pause uploads. On reconnection, resume. This ensures uploads don't fail when the network is temporarily unavailable; instead, they pause and resume when connectivity returns.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Duplicate Detection</h3>
        <p>Compute file hash (MD5 or SHA-256) of each file client-side. Before upload, query server to check if file with this hash already exists. If yes, skip upload and link to existing file (or prompt user to reuse). This prevents duplicate uploads if the user drops the same file twice or retries after success (which might not have been obvious).</p>
        <p>Hash computation is done on-demand; don't compute upfront for all files (expensive). Compute only for files selected for upload.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">State Management</h3>
        <p>Track file queue state: pending (waiting to upload), uploading (in progress), paused (user paused), completed (success), failed (upload failed). Show files in appropriate UI section (pending in queue, uploading with progress bar, completed with success checkmark, failed with retry button).</p>
        <p>Allow user to reorder queue, remove files, or cancel uploads. Implement Undo for recently removed files (allow undoing deletion within 5-10 seconds).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Browser Compatibility and Fallbacks</h3>
        <p>Modern browsers support native drag-drop and FileReader. For older browsers (IE 10), provide fallback: click to open file picker (standard input[type=file]). Graceful degradation: no drag-drop, but upload still works via file picker.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Single request vs chunked: single request is simpler but fails on large files or unstable networks. Chunked adds complexity but enables resumption and is essential for very large uploads. Use chunking only for larger files (for example above about 100 MB); smaller files use a single request.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">Client-side hashing: computing SHA-256 is expensive for 1GB files (1-2 seconds on modern devices). Compress hash computation (sample file instead of hashing entire file) or defer to server if hashing overhead is unacceptable. Trade-off: duplicate detection accuracy versus performance.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Preview generation: lazy (on-demand) is better for large file lists but adds latency when preview is needed. Precompute (all upfront) is faster for small lists but slower initially. Hybrid: precompute first 5 previews, lazy-load rest.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Validation strictness: strict client-side validation (MIME type) can false-positive (some files masqueraded as wrong type). Server should always re-validate. Client validation is UX improvement, not security; never trust client validation alone.</HighlightBlock>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 1: Drop Zone with File Queue</h3>
        <HighlightBlock as="p" tier="important">Detect drops on a designated drop zone element. Extract files, validate, and display in a queue. Each queue item shows file name, size, preview (if image), and progress bar during upload.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 2: Chunked Upload with Resumption</h3>
        <HighlightBlock as="p" tier="important">For large files, compute hash, query server for existing chunks, upload missing chunks. Store chunk metadata (file hash, chunk sequence) locally (IndexedDB) for recovery if browser crashes mid-upload.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 3: Fallback Upload via File Picker</h3>
        <HighlightBlock as="p" tier="crucial">Hide drag-drop in unsupported browsers. Provide fallback: click button to open file picker (input[type=file]). Same upload logic works for both drag-drop and file picker.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Trade-offs include single-request (simple) versus chunked (handles large files), eager preview (fast) versus lazy (memory-efficient), and client-side hash validation (UX) versus</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">server re-validation (security). Real-world systems (Google Drive, Dropbox, Figma) use these patterns. For best results, implement chunking only for larger files (for example above about 100 MB), use lazy preview generation, always re-validate on server, handle offline by pausing rather than failing, and provide clear progress and error feedback to users.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
