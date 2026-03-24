"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-frontend-media-upload",
  title: "Media Upload",
  description:
    "Comprehensive guide to implementing media upload covering drag-drop interfaces, progress indicators, client-side validation (file type, size, dimensions), image optimization (client-side resize, compression), multipart upload for large files, resumable uploads, retry logic, and security patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "media-upload",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "content",
    "media",
    "upload",
    "frontend",
    "optimization",
  ],
  relatedTopics: ["create-content-ui", "file-attachments", "media-processing"],
};

export default function MediaUploadArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Media Upload</strong> enables users to attach images, videos,
          and documents to their content providing rich media capabilities
          beyond text. It must handle large files efficiently, provide clear
          progress feedback, validate files for security, and optimize media for
          delivery. Media upload is critical for user experience — slow or
          unreliable upload causes frustration and abandonment, while fast and
          reliable upload with clear progress encourages content creation.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/media-upload-flow.svg"
          alt="Media Upload Flow"
          caption="Media Upload Flow — showing file selection, client-side validation, multipart upload with progress, server-side processing, and completion notification"
        />

        <p>
          For staff and principal engineers, implementing media upload requires
          deep understanding of drag-drop interfaces with visual feedback on
          drag over and drop zones, progress indicators showing per-file
          progress with percentage, speed, and time remaining, client-side
          validation checking file type by magic bytes not extension, size
          limits preventing storage abuse, and image dimensions ensuring
          appropriate resolution. Image optimization encompasses client-side
          resize reducing upload size, compression balancing quality with file
          size, and format conversion to WebP/AVIF for efficiency. Multipart
          upload splits large files into chunks typically 5MB each enabling
          parallel upload, resumable upload recovering from network
          interruptions, and retry logic with exponential backoff handling
          transient failures. Security patterns include file type validation
          preventing malicious uploads, virus scanning protecting users, access
          control ensuring authorized uploads, and rate limiting preventing
          abuse. The implementation must balance user experience with security
          and performance.
        </p>

        <p>
          Modern media upload has evolved from simple form submission to
          sophisticated upload systems with drag-drop, real-time progress,
          client-side optimization, and resumable uploads. Platforms like
          Dropbox provide seamless sync with chunked upload and resume,
          Instagram applies client-side compression before upload reducing
          bandwidth, and Google Photos uses smart upload scheduling based on
          network conditions. Security requirements have driven standardized
          virus scanning, file type validation by magic bytes, and access
          control through signed upload URLs.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Media upload is built on fundamental concepts that determine how files
          are selected, validated, uploaded, and secured. Understanding these
          concepts is essential for designing effective upload experiences.
        </p>

        <p>
          <strong>File Selection:</strong> Drag-drop provides intuitive file
          selection by dragging files to upload area with visual feedback on
          drag over highlighting the drop zone and drop initiating upload. File
          picker dialog serves as fallback through click to open system file
          dialog supporting all browsers with multiple file selection enabled.
          Multiple file selection allows selecting multiple files at once with
          per-file progress tracking and batch operations. Paste from clipboard
          enables pasting images directly from clipboard (screenshot,
          copy-paste) with automatic file creation and upload initiation.
        </p>

        <p>
          <strong>Client-Side Validation:</strong> File type validation checks
          magic bytes (file signature) not extension preventing extension
          spoofing attacks where .exe is renamed to .jpg. Size limits enforce
          per-file maximum (typically 10-100MB) and total upload maximum
          preventing storage abuse through large file uploads. Image dimensions
          validate minimum and maximum resolution ensuring appropriate image
          quality (min 100x100 for usability, max 4000x4000 preventing excessive
          upload size). Aspect ratio validation ensures images meet requirements
          for specific contexts (square for profile pictures, 16:9 for cover
          images).
        </p>

        <p>
          <strong>Image Optimization:</strong> Client-side resize reduces image
          dimensions before upload decreasing upload time and bandwidth usage
          through canvas-based resize or WebWorkers for non-blocking operation.
          Compression applies JPEG quality adjustment (typically 80-85%
          balancing quality with size) or WebP conversion achieving 30% smaller
          files than JPEG. Format conversion produces WebP or AVIF formats with
          JPEG fallback for older browser support. Metadata stripping removes
          EXIF data (GPS, camera info) reducing file size and protecting
          privacy.
        </p>

        <p>
          <strong>Multipart Upload:</strong> Splits large files into chunks
          typically 5MB each enabling parallel upload of multiple chunks
          simultaneously maximizing bandwidth utilization. Resumable upload
          tracks uploaded chunks enabling resume from checkpoint after network
          interruption rather than restarting entire upload. Retry logic
          implements exponential backoff (1s, 2s, 4s, 8s) for transient failures
          with maximum retry limit (typically 5 attempts) before failing
          permanently. Progress tracking aggregates chunk progress into overall
          progress showing percentage, speed, and time remaining.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Media upload architecture separates file selection, validation,
          upload, and processing enabling modular implementation with clear
          security boundaries. This architecture is critical for user
          experience, security, and scalability.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/media-upload-flow.svg"
          alt="Media Upload Flow"
          caption="Media Upload Flow — showing file selection, client-side validation, multipart upload with progress, server-side processing, and completion notification"
        />

        <p>
          Upload flow begins with user selecting files through drag-drop or file
          picker. Frontend performs client-side validation checking file type by
          magic bytes, size within limits, and image dimensions appropriate. For
          images, client-side optimization resizes large images and applies
          compression reducing upload size. Upload initiates with progress
          indicator showing per-file progress. For large files (&gt;10MB),
          multipart upload splits file into chunks uploading in parallel with
          resumable capability. Server receives chunks validating each with
          checksum reassembling into complete file. Server-side validation
          rechecks file type and size scanning for viruses. On successful
          upload, file is stored in object storage with unique key. Processing
          pipeline triggers asynchronously generating variants (thumbnails,
          different formats). User receives notification on completion with file
          URLs.
        </p>

        <p>
          Client-side optimization architecture includes canvas-based resize
          drawing image to smaller canvas then exporting as compressed
          JPEG/WebP. WebWorkers perform optimization off main thread preventing
          UI blocking during processing. Quality adjustment applies JPEG quality
          80-85% or WebP compression achieving 30-50% size reduction. Format
          conversion detects browser support through canvas toBlob method
          producing WebP with JPEG fallback. Metadata stripping removes EXIF
          data through canvas export which naturally strips metadata protecting
          privacy and reducing size.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/multipart-upload.svg"
          alt="Multipart Upload"
          caption="Multipart Upload — showing file chunking, parallel upload, progress tracking, resumable capability, and server reassembly"
        />

        <p>
          Multipart upload architecture includes chunking splitting file into
          fixed-size chunks (typically 5MB) with chunk metadata (index, total,
          checksum). Parallel upload sends multiple chunks simultaneously
          (typically 3-6 concurrent) maximizing bandwidth utilization. Progress
          tracking aggregates chunk progress (uploaded chunks / total chunks)
          into overall progress with speed calculation (bytes per second) and
          time remaining estimation. Resumable capability stores uploaded chunk
          indices enabling resume from checkpoint through chunk status API.
          Retry logic implements per-chunk retry with exponential backoff
          independent of other chunks. Server reassembles chunks validating
          checksums producing complete file.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing media upload involves trade-offs between user experience,
          security, performance, and complexity. Understanding these trade-offs
          is essential for making informed architecture decisions.
        </p>

        <p>
          Client-side versus server-side validation presents immediacy versus
          security trade-offs. Client-side validation provides immediate
          feedback rejecting invalid files before upload saving bandwidth and
          user time but can be bypassed by malicious users through browser
          modification or direct API calls. Server-side validation provides
          authoritative security checking file type by magic bytes, scanning for
          viruses, and enforcing quotas but occurs after upload wasting
          bandwidth for invalid files. The recommendation is both client-side
          validation for user experience with immediate feedback and server-side
          validation for security as authoritative check never trusting client
          validation.
        </p>

        <p>
          Client-side optimization versus upload original presents bandwidth
          versus quality trade-offs. Client-side optimization (resize,
          compression, format conversion) reduces upload size 50-80% saving
          bandwidth and upload time especially for mobile users with limited
          data plans but permanently modifies original losing quality and
          flexibility for downstream processing. Upload original preserves full
          quality enabling server-side processing with different optimization
          strategies but requires more bandwidth and storage with slower upload
          especially for large images from modern cameras. The recommendation is
          client-side optimization for user-generated content where upload speed
          matters with server-side optimization for professional content where
          quality is critical.
        </p>

        <p>
          Single-part versus multipart upload presents simplicity versus
          resilience trade-offs. Single-part upload sends file in single request
          with simple implementation and lower server complexity but fails
          entirely on network interruption requiring full restart and provides
          limited progress granularity. Multipart upload splits file into chunks
          enabling resumable upload recovering from interruptions, parallel
          upload maximizing bandwidth, and granular progress per chunk but adds
          complexity for chunk management and server reassembly. The
          recommendation is multipart for files &gt;10MB where resilience
          matters with single-part for small files where simplicity is
          preferred.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing media upload requires following established best
          practices to ensure user experience, security, and performance.
        </p>

        <p>
          File selection provides intuitive drag-drop with visual feedback
          highlighting drop zone on drag over and clear drop target. Support
          file picker as fallback for all browsers. Enable multiple file
          selection with per-file progress and batch operations. Support paste
          from clipboard for images enabling screenshot and copy-paste workflow.
          Show file preview thumbnail before upload enabling user confirmation.
        </p>

        <p>
          Client-side validation checks file type by magic bytes not extension
          preventing extension spoofing. Enforce size limits (per-file 10-100MB,
          total upload limit) preventing storage abuse. Validate image
          dimensions (min 100x100, max 4000x4000) ensuring appropriate quality.
          Check aspect ratio for specific contexts (square for profile, 16:9 for
          cover). Reject invalid files immediately with clear error message.
        </p>

        <p>
          Image optimization resizes large images client-side before upload
          reducing upload size and time. Apply JPEG quality 80-85% or WebP
          compression achieving 30-50% size reduction. Strip EXIF metadata
          protecting privacy and reducing size. Use WebWorkers for non-blocking
          optimization preventing UI freeze. Show optimization progress for
          large images.
        </p>

        <p>
          Multipart upload splits large files (&gt;10MB) into chunks (5MB each)
          enabling parallel upload and resumable capability. Upload 3-6 chunks
          concurrently maximizing bandwidth. Track per-chunk progress
          aggregating to overall progress. Enable resume from checkpoint after
          network interruption. Implement per-chunk retry with exponential
          backoff.
        </p>

        <p>
          Progress indicators show per-file progress with percentage, speed
          (MB/s), and time remaining. Update progress smoothly (100-200ms
          intervals) avoiding flicker. Enable cancellation of in-progress
          uploads. Show aggregate progress for batch uploads. Display upload
          queue with pending, uploading, and completed states.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing media upload to ensure
          user experience, security, and performance.
        </p>

        <p>
          Validating file type by extension only allows extension spoofing
          attacks. Fix by validating file type by magic bytes (file signature)
          not extension. Block dangerous file types by signature (.exe, .bat,
          .scr) regardless of extension. Revalidate on server-side never
          trusting client validation.
        </p>

        <p>
          No file size limits enables storage abuse through large file uploads.
          Fix by enforcing per-file size limits (typically 10-100MB based on use
          case) and total upload limits. Reject oversized files before upload
          with clear error message indicating limit.
        </p>

        <p>
          No progress indicator leaves users uncertain about upload status. Fix
          by showing per-file progress with percentage, speed, and time
          remaining. Update smoothly avoiding flicker. Enable cancellation of
          in-progress uploads. Show aggregate progress for batch uploads.
        </p>

        <p>
          No retry logic fails permanently on transient network errors. Fix by
          implementing retry with exponential backoff (1s, 2s, 4s, 8s) and
          maximum retry limit (5 attempts). For multipart upload, retry failed
          chunks independently. Show retry status to user.
        </p>

        <p>
          No resumable upload requires restarting entire upload on network
          interruption. Fix by implementing resumable upload tracking uploaded
          chunks enabling resume from checkpoint. Store chunk status client-side
          or server-side. Show resume option on interrupted upload.
        </p>

        <p>
          No client-side optimization uploads full-size images wasting
          bandwidth. Fix by implementing client-side resize and compression for
          user-generated content. Reduce upload size 50-80% improving upload
          speed especially for mobile. Preserve quality for professional
          content.
        </p>

        <p>
          No virus scanning allows malware distribution through uploads. Fix by
          scanning all uploads server-side with quarantine for infected files.
          Notify user of infected file. Maintain malware signature database
          updates.
        </p>

        <p>
          No access control allows unauthorized uploads. Fix by verifying user
          has upload permission before generating upload URL. Use signed upload
          URLs with expiration. Enforce storage-level access control. Log all
          upload attempts.
        </p>

        <p>
          No rate limiting enables upload abuse and DoS attacks. Fix by
          implementing per-user rate limits (uploads per hour, bandwidth per
          hour). Return 429 Too Many Requests when limit exceeded. Show
          remaining quota to user.
        </p>

        <p>
          No error handling leaves users uncertain on upload failure. Fix by
          showing clear error messages indicating failure reason (network error,
          file too large, invalid type). Provide retry option. Log errors for
          debugging.
        </p>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Media upload is critical for content creation across different
          domains. Here are real-world implementations from production systems
          demonstrating different approaches to upload challenges.
        </p>

        <p>
          Dropbox upload addresses seamless file sync with chunked upload and
          resume. The solution uses drag-drop upload with background sync,
          splits files into chunks (typically 4MB) enabling resumable upload,
          deduplicates chunks storing identical chunks once saving storage,
          syncs across devices with selective sync choosing which folders to
          sync locally, and provides bandwidth throttling preventing network
          saturation. The result is seamless file sync with efficient storage
          and bandwidth usage.
        </p>

        <p>
          Instagram upload addresses mobile image optimization with consistent
          quality. The solution applies client-side compression reducing upload
          size, resizes images to standard sizes (feed, story, thumbnail) before
          upload, applies consistent filters through preset filters (Clarendon,
          Juno, Lark), uploads in background enabling continued app usage, and
          provides upload progress with retry on failure. The result is
          consistent image quality across billions of daily uploads with
          efficient mobile upload.
        </p>

        <p>
          YouTube upload addresses large video files with resumable upload. The
          solution uses chunked upload (typically 8MB chunks) enabling resumable
          upload for large videos, provides upload progress with speed and time
          remaining, processes video asynchronously with notification on
          completion, supports draft videos enabling publish after processing,
          and provides upload queue for multiple videos. The result is reliable
          upload for videos up to 256GB with resume capability.
        </p>

        <p>
          Google Photos upload addresses unlimited photo storage with smart
          upload. The solution uses client-side compression (High Quality mode)
          reducing storage usage, uploads in background with smart scheduling
          based on network conditions (WiFi preferred), provides face
          recognition and organization during upload, enables album creation
          during upload, and provides cross-device sync. The result is efficient
          photo storage with smart organization.
        </p>

        <p>
          Slack upload addresses team file sharing with preview. The solution
          uses drag-drop upload with progress indicator, generates thumbnails
          for images and documents enabling preview without download, provides
          search indexing for file content, integrates file sharing with
          threaded conversations, and enforces file size limits based on plan
          (free vs paid). The result is integrated file sharing within team
          conversations with preview capability.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of media upload design,
          implementation, and security concerns for staff and principal engineer
          interviews.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement drag-drop upload?
            </p>
            <p className="mt-2 text-sm">
              A: Add dragover, dragleave, drop event listeners to drop zone.
              Prevent default browser behavior (open file). Highlight drop zone
              on dragover. Handle drop event extracting files from
              dataTransfer.files. Support multiple files. Show file preview
              thumbnails. Provide file picker as fallback for all browsers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you validate file type?</p>
            <p className="mt-2 text-sm">
              A: Check magic bytes (file signature) not extension. Read first
              few bytes using FileReader. Compare against known signatures
              (JPEG: FFD8FF, PNG: 89504E47, GIF: 474946). Block dangerous types
              (.exe, .bat, .scr) by signature. Revalidate on server-side never
              trusting client validation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement progress indicator?
            </p>
            <p className="mt-2 text-sm">
              A: Use XMLHttpRequest progress event or Fetch with ReadableStream
              for upload progress. Calculate percentage (loaded / total * 100).
              Track speed (bytes per second) through sampling. Estimate time
              remaining (remaining bytes / speed). Update UI smoothly (100-200ms
              intervals). Show per-file progress for batch uploads.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement multipart upload?
            </p>
            <p className="mt-2 text-sm">
              A: Split file into chunks (typically 5MB each) using File.slice().
              Upload chunks in parallel (3-6 concurrent) maximizing bandwidth.
              Track uploaded chunk indices. Aggregate chunk progress into
              overall progress. Reassemble chunks on server validating
              checksums. Enable resumable upload storing uploaded chunk indices.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement resumable upload?
            </p>
            <p className="mt-2 text-sm">
              A: Track uploaded chunk indices client-side (localStorage) or
              query server for uploaded chunks. On resume, skip uploaded chunks
              uploading only remaining. Use chunked upload API supporting chunk
              status query. Store upload session ID linking chunks. Show resume
              option on interrupted upload.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement client-side image optimization?
            </p>
            <p className="mt-2 text-sm">
              A: Load image into Image object. Draw to canvas at target size.
              Export as JPEG/WebP with quality parameter (0.8-0.85). Use
              WebWorkers for non-blocking optimization. Strip EXIF metadata
              through canvas export. Show optimization progress. Reduce upload
              size 50-80%.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle upload retry?</p>
            <p className="mt-2 text-sm">
              A: Implement retry with exponential backoff (1s, 2s, 4s, 8s) and
              maximum retry limit (5 attempts). For multipart upload, retry
              failed chunks independently. Show retry status and count to user.
              Provide manual retry option. Log failures for debugging.
              Distinguish transient errors (retry) from permanent errors (fail).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you secure file uploads?</p>
            <p className="mt-2 text-sm">
              A: Validate file type by magic bytes client and server-side.
              Enforce size limits. Scan for viruses server-side. Use signed
              upload URLs with expiration. Verify user has upload permission.
              Implement rate limiting per user. Log all upload attempts. Store
              files outside webroot preventing direct execution.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle large file uploads?
            </p>
            <p className="mt-2 text-sm">
              A: Use multipart upload splitting into chunks (5MB each). Upload
              chunks in parallel (3-6 concurrent). Enable resumable upload
              tracking uploaded chunks. Show detailed progress (percentage,
              speed, time remaining). Implement per-chunk retry. Consider
              client-side compression for images/videos reducing size.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP File Upload Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/File_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - File API
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - XMLHttpRequest Progress
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Input Validation Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/fast/#optimize-your-content"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev Image Optimization
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Access Control Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Multifactor Authentication
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Forgot Password Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Credential Stuffing Prevention
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Logging Cheat Sheet
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
