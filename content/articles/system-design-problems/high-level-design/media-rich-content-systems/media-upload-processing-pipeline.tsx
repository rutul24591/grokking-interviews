"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-media-upload-processing-pipeline",
  title: "Design a Media Upload + Processing UI Pipeline",
  description:
    "Architecture for a media upload and processing pipeline: multipart S3 upload with resumability, client-side validation, per-type processing jobs (image resize/WebP/blurhash, video transcode/HLS, document text extraction/search indexing), SSE progress tracking, and CDN delivery.",
  category: "high-level-design",
  subcategory: "media-rich-content-systems",
  slug: "media-upload-processing-pipeline",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-11",
  tags: ["hld", "upload", "s3", "multipart", "transcoding", "image", "video", "processing", "cdn"],
  relatedTopics: ["video-player-system", "content-creation-studio"],
};

export default function MediaUploadProcessingPipelineArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A media upload pipeline is the infrastructure between a user selecting a file and that file being available for consumption by other users. For a single small image, this could be a direct PUT to an API. For a large video file, a PDF with hundreds of pages, or a batch of photos, the pipeline must handle: chunked upload with resumability (network failures mid-upload should not require restarting), asynchronous processing (transcoding a 2-hour video takes minutes—the user cannot wait synchronously), multiple output variants (a video needs multiple bitrate renditions; an image needs thumbnails at multiple sizes in modern formats), and progress visibility (the user must be able to see processing status and know when the media is ready to use).</p>
        <p>The three media types have distinct processing requirements. Images need resizing to multiple dimensions, format conversion (WebP and AVIF for modern browsers), EXIF metadata stripping (to protect location privacy), perceptual hashing (for deduplication and CSAM detection), and blurhash generation (a compact color preview string that renders before the image loads). Videos need transcoding to multiple bitrate renditions, HLS segmentation, thumbnail sprite sheet generation, and optional DRM encryption. Documents (PDFs, DOCX) need text extraction for search indexing, page thumbnail rendering, virus scanning, and optionally embedding into a vector index for RAG search.</p>
        <p><strong>Explicit assumptions:</strong> Files are uploaded directly to S3 using multipart upload (the application server issues presigned URLs; it never proxies the file bytes). Processing jobs run on worker instances (Lambda for short jobs, EC2 for long video transcoding). Status is communicated to the browser via SSE. Final processed assets are served from a CDN.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>File selection:</strong> Users can select files via drag-and-drop, paste (for images), or file picker. Multiple files can be queued simultaneously.</li>
          <li><strong>Client-side validation:</strong> File type (MIME type check using magic bytes, not just file extension), file size (enforced against configured maximums per media type), and count limits are validated before upload begins.</li>
          <li><strong>Resumable multipart upload:</strong> Large files are split into 5 MB parts and uploaded in parallel to S3. If the upload is interrupted (network failure, browser close), it resumes from the last successfully uploaded part on retry.</li>
          <li><strong>Processing progress:</strong> The UI shows per-file processing status (queued, uploading with percentage, processing with stage label, ready) via SSE events from the processing pipeline.</li>
          <li><strong>Processed variant delivery:</strong> Processed assets (image thumbnails, video renditions, document page thumbnails) are served from the CDN with appropriate caching headers.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Upload throughput:</strong> Upload speed should be limited only by the user's network bandwidth (client-to-S3 direct upload, no server bottleneck).</li>
          <li><strong>Image processing latency:</strong> A 10 MB JPEG should produce all variants (thumbnails, WebP, blurhash) within 10 seconds of upload completion.</li>
          <li><strong>Video processing time:</strong> A 10-minute 1080p video should complete transcoding and HLS segmentation within 5 minutes (parallelized per rendition).</li>
          <li><strong>Virus scan:</strong> All document uploads must be virus-scanned before being made available for download by other users.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The pipeline has two phases. Upload phase (client-initiated): the client requests presigned S3 URLs from the API server (one per multipart part), uploads parts in parallel directly to S3, and signals completion to the API server. The API server calls S3's CompleteMultipartUpload, which assembles the parts into the final object, and then publishes a processing job to SQS. Processing phase (server-side, asynchronous): workers consume SQS messages, execute the appropriate processing jobs for the file type, upload processed variants to the CDN origin, and emit status events via SSE to any clients watching the upload ID.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/media-rich-content-systems/media-upload-processing-pipeline-architecture.svg"
          alt="Media upload and processing pipeline showing upload pipeline (file picker drag-drop paste input → client validate type size MIME magic bytes → multipart upload 5MB chunks presigned URLs → S3 origin raw storage bucket → S3 event SQS triggers processing queue → processing workers async job queue), and processing jobs in 3 columns: image processing (resize to variants thumb 150px med 800px orig, format convert JPEG PNG to WebP AVIF, strip metadata EXIF GPS device info, perceptual hash pHash dedup CSAM, blurhash placeholder compact colour preview string, CDN publish immutable URL edge cache), video processing (probe and validate ffprobe duration codec res, transcode renditions 360p 720p 1080p H264, HLS segmentation 2s chunks m3u8 manifests, thumbnail sprite 1 frame per 10s seek preview, status events SSE queued processing ready, CDN publish segs 365d manifest 5s), document processing (text extraction PDF text DOCX HTML, page thumbnails Puppeteer render PNG pages, search indexing extracted text Elasticsearch, virus scan ClamAV quarantine if infected, embedding index chunk embed RAG search, metadata DB status variants dimensions)."
          caption="Upload pipeline (client → presigned S3 multipart → SQS → workers) + per-type processing jobs: image (resize/WebP/blurhash), video (transcode/HLS/sprite), document (extract/scan/index)"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Client-Side Validation</h3>
        <p>Validation runs before the upload starts, providing instant feedback. File type validation uses the magic bytes approach: the first 4–16 bytes of the file are read using FileReader and compared against known magic byte signatures (JPEG: FF D8 FF; PNG: 89 50 4E 47; PDF: 25 50 44 46; MP4: 66 74 79 70). This is more reliable than checking the file extension or the Content-Type header (both can be spoofed). File size validation applies per-media-type limits (images: 50 MB; videos: 5 GB; documents: 100 MB). Count validation limits the number of simultaneously queued uploads (default: 10 files). Validation errors are shown inline on the drop zone, per file, before any network request is made.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Multipart Upload Flow</h3>
        <p>For files larger than 5 MB, the client initiates a multipart upload. The flow: (1) client calls the API to initiate the upload, receiving an upload ID. (2) The client splits the file into 5 MB parts (last part may be smaller). (3) For each part, the client requests a presigned S3 PUT URL valid for 15 minutes. (4) Parts are uploaded in parallel to S3 (up to 3 concurrent PUT requests—more concurrency provides diminishing returns and can saturate the user's network). (5) Each successful PUT returns an ETag. (6) When all parts are uploaded, the client calls the API with the upload ID and the list of part ETags. The API calls S3's CompleteMultipartUpload, assembling the final object.</p>
        <p>Resumability: the upload ID and the list of successfully completed part numbers are persisted in localStorage under the key upload:&#123;fileHash&#125;. If the upload is interrupted (network failure, browser reload), the client checks localStorage on retry, identifies which parts are already complete, and resumes uploading only the remaining parts. The fileHash is computed as the SHA-256 of the first 1 MB + last 1 MB + file size (a fast proxy for the full file hash that avoids hashing the entire file before upload starts). Incomplete multipart uploads are purged after 7 days by an S3 lifecycle rule.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Processing Jobs and Queue Architecture</h3>
        <p>When S3 receives the completed multipart upload, it emits an S3 ObjectCreated event to an SQS queue. Workers poll SQS and process jobs. Job routing is based on the object key prefix: images go to the image worker pool (Lambda, scales to 0), videos go to the video worker pool (EC2 Auto Scaling Group—video transcoding requires persistent CPU for minutes), and documents go to the document worker pool (Lambda with extended timeout). Each worker updates the job status in a DynamoDB table and emits SSE events to the browser via an SSE endpoint backed by Redis pub/sub (the worker publishes to Redis; the SSE server subscribes and forwards to connected clients watching the upload ID).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Image Processing Details</h3>
        <p>Image processing runs Sharp (a Node.js bindings library for libvips) for all transform operations. For each uploaded image: (1) Read and decode the source file. (2) Strip EXIF metadata (GPS coordinates, device serial numbers, timestamps) using Sharp's withMetadata(&#123;exif: &#123;&#125;&#125;) to produce a clean output. (3) Resize to three variants: thumbnail (150×150 crop), medium (800px wide, height proportional), and original resolution. (4) Encode each variant in WebP (primary format, supported by all modern browsers) and AVIF (best compression, for browsers that support it—Chrome 85+, Firefox 93+). (5) Compute the perceptual hash (pHash) of the original image—a hash that is similar for visually similar images, even if the file bytes differ. The pHash is used for deduplication (if the same image is uploaded multiple times) and for CSAM detection (comparing against known-bad image hash databases). (6) Generate the blurhash string (a compact Base83-encoded color representation of the image, typically 30–40 characters) to use as a progressive loading placeholder before the full image loads.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Video Processing Details</h3>
        <p>Video transcoding uses FFmpeg. For each uploaded video: (1) ffprobe extracts metadata (duration, codec, resolution, framerate, audio tracks) and validates the file is a playable video. (2) FFmpeg transcodes in parallel to three renditions (360p/800kbps, 720p/2.5Mbps, 1080p/5Mbps), each in a separate subprocess. Parallelizing rendition transcoding cuts wall-clock processing time by up to 3x compared to sequential transcoding. (3) Each rendition is segmented into 2-second HLS chunks. (4) FFmpeg extracts one frame per 10 seconds and assembles them into a seek preview sprite sheet. (5) HLS master manifest and per-rendition playlists are generated and written alongside the segments. (6) All outputs are uploaded to S3 (CDN origin) and status events are emitted at each stage completion.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Upload UI States</h3>
        <p>The upload UI shows five states per file. Idle: a drop zone with instructions. Validating: instant feedback (under 100ms) on file type, size, and MIME magic bytes—shown as a checklist before upload starts. Uploading: a progress bar showing the percentage of bytes uploaded (computed from part count × part size), transfer speed, and estimated time remaining. Processing: a status label showing the current processing stage (e.g., "Transcoding 720p…"), updated via SSE events. Ready: a preview of the processed result (image thumbnail, video poster frame, document page thumbnail) with an "Insert" button to embed the asset in the current context.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/media-rich-content-systems/media-upload-processing-pipeline-ui.svg"
          alt="Upload UI states showing 5 states: idle drop zone (drag files or click to browse), validating (type size MIME checklist), uploading with progress bar Part 3/8 38% 14.2 MB/s 2.1s remaining, processing (transcoding 720p SSE progress), ready with preview. Multipart upload flow showing client splits file → API issues presigned URLs → S3 receives parts → S3 assembled; part details: min 5MB, 3 parallel parts, ETag per part for CompleteMultipartUpload, retry resumes from part boundary, upload ID expires 7 days. Resumable upload and error handling: upload ID and completed parts in localStorage keyed by fileHash, on retry skip uploaded parts resume from failed, validation errors client-side instant."
          caption="Upload UI states (idle → validating → uploading → processing → ready), multipart S3 flow with parallel parts, and resumable upload via localStorage part tracking"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Direct-to-S3 upload versus server-proxied upload: direct-to-S3 (the client puts bytes directly to S3 using presigned URLs) scales infinitely—the API server never touches file bytes, so upload throughput is not limited by API server capacity. The downside: CORS must be configured on the S3 bucket (to allow PUT requests from the browser's origin), and server-side processing (virus scanning, rate limiting) cannot happen synchronously with the upload—it must run as a post-upload job. Server-proxied upload (the API server receives the file and uploads to S3) is simpler to implement but creates a throughput bottleneck at the API layer. For any platform where large files are common, direct-to-S3 is strongly preferred.</p>
        <p>Processing failure handling: if a processing job fails (transcoding error, corrupted input file), the SQS message should be retried with exponential backoff (SQS's default retry policy). After 3 retries, the message is moved to a dead-letter queue (DLQ) and the upload record is marked as processing-failed. The browser's SSE stream receives a "status:failed, reason:transcoding_error" event and shows a retry option to the user. The retry re-queues the original S3 object for processing without requiring the user to re-upload the file.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A media upload pipeline uses direct-to-S3 multipart upload (5 MB parts, up to 3 parallel, presigned URLs from the API server) with resumability via localStorage tracking of completed parts. Client-side validation (magic bytes, size, count) runs before upload starts. Upload completion triggers an S3 ObjectCreated event to SQS; per-type workers consume the queue: image workers (Sharp on Lambda: resize variants, WebP/AVIF encode, EXIF strip, pHash, blurhash), video workers (FFmpeg on EC2: parallel rendition transcode, HLS segmentation, thumbnail sprite), and document workers (Lambda: text extraction, page thumbnail render via Puppeteer, Elasticsearch indexing, ClamAV virus scan). Status is pushed to the browser via SSE events backed by Redis pub/sub (worker publishes → SSE server subscribes → browser receives). The UI progresses through five states: idle → validating → uploading (with progress bar) → processing (with stage label) → ready (with preview). Processed assets are served from CDN with immutable segment caching (365-day TTL) and short manifest TTL (5 seconds). The defining design constraint is that the API server never proxies file bytes—upload throughput scales with the CDN and S3's capacity, not the API layer's.</p>
      </section>
    </ArticleLayout>
  );
}
