"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-frontend-media-sharing",
  title: "Media Sharing in Chat",
  description:
    "Comprehensive guide to implementing media sharing in chat covering image/video sharing, file attachments, upload optimization, media gallery, compression strategies, and security considerations for rich messaging experiences.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "media-sharing-chat",
  version: "extensive",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "communication",
    "media",
    "chat",
    "frontend",
    "file-upload",
    "image-processing",
  ],
  relatedTopics: ["chat-interface", "file-upload", "media-processing", "content-delivery"],
};

export default function MediaSharingChatArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Media sharing in chat enables users to share images, videos, and files within conversations, transforming text-only communication into rich multimedia experiences. Users share photos from events, documents for collaboration, videos for entertainment, and files for work. Media sharing increases engagement—messages with images receive 2x more responses than text-only. The feature requires efficient upload, preview generation, secure storage, and fast delivery.
        </p>
        <p>
          The complexity of media sharing stems from handling diverse file types, sizes, and formats. Images need compression and thumbnail generation. Videos need transcoding for playback compatibility. Files need virus scanning and type validation. Upload must handle poor network conditions with retry logic. Storage must scale to petabytes for large platforms. Delivery must be fast globally via CDN. Security must prevent malware distribution while respecting user privacy.
        </p>
        <p>
          For staff and principal engineers, media sharing implementation involves distributed systems challenges. Upload infrastructure must handle traffic spikes (holiday photo sharing). Processing pipelines must scale independently (image compression, video transcoding). Storage must be cost-effective (hot storage for recent, cold for old). CDN integration ensures fast global delivery. Security scanning must be thorough without adding latency. The architecture must balance quality with performance—high-resolution images look better but take longer to upload.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Media Types and Formats</h3>
        <p>
          Images: JPEG, PNG, GIF, WebP, HEIC. JPEG for photos (lossy compression, small size). PNG for graphics (lossless, transparency). GIF for animations (limited colors). WebP for modern browsers (better compression). HEIC for iOS (efficient but limited support). Convert to WebP/JPEG for compatibility.
        </p>
        <p>
          Videos: MP4, MOV, AVI, WebM. MP4 (H.264) for universal compatibility. MOV for iOS. WebM for web (open format). Transcode uploads to MP4 for consistency. Generate multiple resolutions (360p, 720p, 1080p) for adaptive streaming. Thumbnail extraction for preview.
        </p>
        <p>
          Documents: PDF, DOCX, XLSX, PPTX, TXT. PDF for universal viewing. Office formats for editing. TXT for simple text. Preview generation for documents (first page thumbnail). Virus scanning mandatory for all documents.
        </p>
        <p>
          Other files: ZIP, audio files, APK, etc. ZIP for archives (scan contents). Audio files (MP3, M4A) with inline player. APK and executables often blocked for security. File type detection via magic bytes, not just extension.
        </p>

        <h3 className="mt-6">Upload Flow</h3>
        <p>
          Client-side preparation: compress images before upload (reduce bandwidth). Generate thumbnail locally (immediate preview). Validate file type and size (fail fast). Chunk large files (resume support). Progress tracking for user feedback.
        </p>
        <p>
          Upload process: multipart upload for large files (parallel chunks). Retry on failure (exponential backoff). Server receives chunks, reassembles. Virus scanning in quarantine (not visible until clean). Generate server-side thumbnail (fallback). Store metadata (size, type, dimensions).
        </p>
        <p>
          Post-upload: upload to CDN for delivery. Generate multiple sizes (thumbnail, preview, full). Store in object storage (S3, GCS). Send message with media URL to recipient. Recipient downloads from CDN (fast).
        </p>

        <h3 className="mt-6">Compression Strategies</h3>
        <p>
          Image compression: client-side compression before upload (80% quality, max 1920px). Reduces upload time 5-10x. Server-side further compression if needed. WebP conversion (25% smaller than JPEG). Original preserved for download.
        </p>
        <p>
          Video compression: transcode to H.264/AAC (universal). Reduce resolution based on original (don't upscale). Bitrate optimization (quality vs size). Generate multiple resolutions for adaptive streaming. Thumbnail from keyframe.
        </p>
        <p>
          Document compression: PDF optimization (remove embedded fonts, compress images). Office formats: extract and compress embedded images. ZIP files: don't recompress (already compressed). Text files: no compression needed.
        </p>

        <h3 className="mt-6">Media Gallery</h3>
        <p>
          Conversation gallery: all media shared in conversation. Grid layout (3-4 columns). Infinite scroll (lazy load). Filter by type (images, videos, files). Search within gallery (filename, date). Tap to view full-screen.
        </p>
        <p>
          Media viewer: full-screen image/video viewer. Swipe to navigate (previous/next). Zoom (pinch for images). Download option. Share option. Metadata display (size, date, sender).
        </p>
        <p>
          Storage management: show storage used per conversation. Clear media option (free space). Auto-download settings (WiFi only, never, always). Cached media management (clear old cache).
        </p>

        <h3 className="mt-6">Security Considerations</h3>
        <p>
          Virus scanning: all files scanned on upload. Quarantine until clean. Block infected files. Notify sender of infection. Regular signature updates.
        </p>
        <p>
          Content moderation: image/video scanning for inappropriate content. NSFW detection (blur or block). CSAM detection (hash matching, report to authorities). User reporting for missed content.
        </p>
        <p>
          Access control: media URLs signed (temporary access). Prevent hotlinking. Owner can delete media (removes for all). Expiring media (disappearing messages). Encryption for sensitive content.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Media sharing architecture spans client upload, processing pipeline, storage, and delivery. Client prepares and uploads media. Processing pipeline compresses, transcodes, scans. Storage holds originals and derivatives. CDN delivers to recipients.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/media-sharing-chat/media-sharing-architecture.svg"
          alt="Media Sharing Architecture"
          caption="Figure 1: Media Sharing Architecture — Client upload, processing pipeline, storage, and CDN delivery"
          width={1000}
          height={500}
        />

        <h3>Client Upload</h3>
        <p>
          File selection: native file picker (mobile: camera/gallery, desktop: file browser). Multiple selection support. Preview before send (thumbnail grid). Remove individual files. Add caption per file.
        </p>
        <p>
          Client-side processing: image compression (WebP, 80% quality, max 1920px). Thumbnail generation (256x256). Video thumbnail extraction (first frame). File type validation (magic bytes). Size check (fail if over limit).
        </p>
        <p>
          Upload implementation: XMLHttpRequest or Fetch API with progress events. Multipart upload for files &gt;10MB (parallel chunks). Retry logic (3 retries, exponential backoff). Pause/resume support (store chunk progress). Background upload (continue when app backgrounded).
        </p>

        <h3 className="mt-6">Processing Pipeline</h3>
        <p>
          Upload server receives media. Validates content type (magic bytes). Stores in quarantine (not visible). Publishes to processing queue. Returns upload ID to client (optimistic send).
        </p>
        <p>
          Image processor: downloads from quarantine. Generates thumbnail (256x256). Generates preview (1024px). Converts to WebP. Stores original + derivatives. Updates metadata (dimensions, file size).
        </p>
        <p>
          Video processor: downloads from quarantine. Extracts thumbnail (keyframe). Transcodes to MP4 (H.264). Generates multiple resolutions (360p, 720p, 1080p). Stores original + derivatives. Updates metadata (duration, resolution, codec).
        </p>
        <p>
          Document processor: downloads from quarantine. Generates thumbnail (first page). Extracts text for search. Virus scan (if not done). Stores original + thumbnail. Updates metadata (page count, author).
        </p>

        <h3 className="mt-6">Storage Architecture</h3>
        <p>
          Object storage (S3, GCS, Azure Blob): stores originals and derivatives. Bucket organization: by date (year/month/day) or by conversation_id. Lifecycle policies: move to cold storage after 90 days, delete after 1 year (configurable). Versioning enabled (recover accidental deletes).
        </p>
        <p>
          CDN (CloudFront, Cloudflare, Fastly): caches media for delivery. Edge locations worldwide. Signed URLs for access control. Cache TTL: 1 year for media (immutable). Invalidation on delete.
        </p>
        <p>
          Metadata database: stores media metadata. Fields: media_id, conversation_id, sender_id, file_type, file_size, storage_url, thumbnail_url, created_at, expires_at. Indexed by conversation_id (gallery query).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/media-sharing-chat/upload-flow.svg"
          alt="Upload Flow"
          caption="Figure 2: Upload Flow — Client preparation, server processing, and delivery"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Media Gallery Implementation</h3>
        <p>
          Gallery query: fetch media for conversation ordered by date. Pagination (50 items per page). Lazy loading (load next page on scroll). Filter by type (images, videos, files, links). Search by filename or date range.
        </p>
        <p>
          Grid layout: 3-4 columns (responsive). Aspect ratio preservation (square crop for uniformity). Lazy load images (Intersection Observer). Blurhash for placeholder (colored blur while loading). Tap to open viewer.
        </p>
        <p>
          Media viewer: full-screen overlay. Swipe gesture (previous/next). Pinch to zoom (images). Video controls (play, pause, scrub). Download button. Share button. Delete button (owner only). Metadata overlay (tap to show/hide).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/media-sharing-chat/compression-strategies.svg"
          alt="Compression Strategies"
          caption="Figure 3: Compression Strategies — Client-side and server-side compression for different media types"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Media sharing design involves trade-offs between quality, performance, storage cost, and user experience. Understanding these trade-offs enables informed decisions aligned with product goals and user expectations.
        </p>

        <h3>Compression: Quality vs Size</h3>
        <p>
          High quality: minimal compression (90%+ quality). Pros: Best visual quality, user satisfaction. Cons: Large files, slow upload, high storage cost. Best for: Professional use, photography apps.
        </p>
        <p>
          Balanced: moderate compression (70-80% quality). Pros: Good quality, reasonable size. Cons: Some quality loss. Best for: Most consumer apps (WhatsApp, Instagram).
        </p>
        <p>
          High compression: aggressive compression (50-60% quality). Pros: Fast upload, low storage. Cons: Visible quality loss. Best for: Data-conscious users, emerging markets.
        </p>

        <h3>Storage: Original vs Compressed Only</h3>
        <p>
          Store original + compressed: keep original for download, compressed for viewing. Pros: Best of both worlds, users can download original. Cons: 2x storage cost. Best for: Most production apps.
        </p>
        <p>
          Compressed only: discard original after compression. Pros: Half storage cost. Cons: Can't provide original download. Best for: Storage-constrained apps.
        </p>
        <p>
          Original only: no compression, store original. Pros: Maximum quality. Cons: Slow delivery, high storage. Best for: Professional/enterprise apps.
        </p>

        <h3>Upload: Immediate vs Background</h3>
        <p>
          Immediate upload: upload before sending message. Pros: Message sends with media ready. Cons: User waits for upload. Best for: WiFi connections, small files.
        </p>
        <p>
          Background upload: send message immediately, upload in background. Pros: Instant send, user continues chatting. Cons: Recipient sees placeholder until upload completes. Best for: Mobile, large files.
        </p>
        <p>
          Hybrid: small files immediate, large files background. Pros: Balances speed with UX. Cons: More complex logic. Best for: Most production apps.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/media-sharing-chat/security-considerations.svg"
          alt="Security Considerations"
          caption="Figure 4: Security Considerations — Virus scanning, content moderation, and access control"
          width={1000}
          height={450}
        />

        <h3>CDN: Managed vs Self-Hosted</h3>
        <p>
          Managed CDN (CloudFront, Cloudflare): Pros: Global edge locations, DDoS protection, easy setup. Cons: Cost at scale, less control. Best for: Most apps.
        </p>
        <p>
          Self-hosted CDN: Pros: Cost control, full control. Cons: Operational complexity, limited edge locations. Best for: Very large scale (100M+ users).
        </p>
        <p>
          Hybrid: managed CDN + origin shielding. Pros: Best of both. Cons: More complex. Best for: Large apps optimizing cost.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Compress client-side:</strong> Compress images before upload (80% quality, max 1920px). Reduces upload time 5-10x. Generate thumbnail locally for instant preview.
          </li>
          <li>
            <strong>Use multipart upload:</strong> For files &gt;10MB, use multipart upload. Parallel chunks, resume on failure. Better reliability for large files.
          </li>
          <li>
            <strong>Implement retry logic:</strong> Retry failed uploads (3 retries, exponential backoff). Store progress for resume. Inform user of retry.
          </li>
          <li>
            <strong>Scan for viruses:</strong> All files scanned before visible. Quarantine until clean. Block infected files. Notify sender.
          </li>
          <li>
            <strong>Generate multiple sizes:</strong> Thumbnail (256px), preview (1024px), full (original). Serve appropriate size for context. Saves bandwidth.
          </li>
          <li>
            <strong>Use CDN for delivery:</strong> CDN caches media at edge. Fast global delivery. Signed URLs for access control. Invalidate on delete.
          </li>
          <li>
            <strong>Implement lazy loading:</strong> Gallery lazy loads images (Intersection Observer). Blurhash placeholders. Reduces initial load time.
          </li>
          <li>
            <strong>Support background upload:</strong> Continue upload when app backgrounded. iOS: background upload tasks. Android: WorkManager. Better UX for large files.
          </li>
          <li>
            <strong>Validate file types:</strong> Check magic bytes, not just extension. Block executables. Limit file types by context (images for photos, documents for files).
          </li>
          <li>
            <strong>Provide storage management:</strong> Show storage used. Clear media option. Auto-download settings. Help users manage space.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No compression:</strong> Uploading original files wastes bandwidth. Solution: Client-side compression, server-side optimization.
          </li>
          <li>
            <strong>No retry logic:</strong> Failed uploads frustrate users. Solution: Implement retry with exponential backoff, resume support.
          </li>
          <li>
            <strong>No virus scanning:</strong> Malware distribution risk. Solution: Scan all files in quarantine before visible.
          </li>
          <li>
            <strong>Blocking UI during upload:</strong> User can't chat while upload in progress. Solution: Background upload, optimistic send.
          </li>
          <li>
            <strong>No thumbnail generation:</strong> Slow gallery load. Solution: Generate thumbnails, lazy load full images.
          </li>
          <li>
            <strong>Direct S3 uploads:</strong> Exposed credentials, no validation. Solution: Use presigned URLs, server validates first.
          </li>
          <li>
            <strong>No CDN:</strong> Slow delivery for distant users. Solution: Use CDN for global caching.
          </li>
          <li>
            <strong>No access control:</strong> Media URLs guessable, hotlinking. Solution: Signed URLs with expiration.
          </li>
          <li>
            <strong>No storage management:</strong> Users can't clear space. Solution: Provide storage settings, auto-download controls.
          </li>
          <li>
            <strong>Extension-only validation:</strong> .exe renamed to .jpg bypasses check. Solution: Check magic bytes, not just extension.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>WhatsApp Media Sharing</h3>
        <p>
          WhatsApp compresses images heavily (WebP, ~100KB). Videos transcoded to MP4. Documents up to 100MB (2GB for Premium). Media stored encrypted. Gallery per conversation. Auto-download settings (WiFi/cellular/never).
        </p>

        <h3 className="mt-6">Instagram Direct</h3>
        <p>
          Instagram uses existing Instagram CDN for media. Images compressed, multiple resolutions. Videos transcoded with adaptive streaming. Ephemeral media (disappearing photos/videos). Reactions on media messages.
        </p>

        <h3 className="mt-6">Slack File Sharing</h3>
        <p>
          Slack supports 1GB per file (paid plans). Preview generation for 100+ file types. Search within documents. Threaded discussions on files. Enterprise key management for encryption.
        </p>

        <h3 className="mt-6">Telegram Media</h3>
        <p>
          Telegram allows up to 2GB per file. Cloud storage (access from any device). No compression option (send as file). Streaming for videos (watch while downloading). Secret chats: end-to-end encrypted media.
        </p>

        <h3 className="mt-6">WeChat Moments</h3>
        <p>
          WeChat compresses images/videos for Moments. Auto-play videos (muted). Tag people in photos. Location tagging. Privacy controls (who can see). Integrated with WeChat Pay for commerce.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle large file uploads?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Multipart upload: split file into 5-10MB chunks, upload in parallel. Each chunk retried independently. Resume from last successful chunk on failure. Background upload continues when app backgrounded. Progress tracking per chunk. Server reassembles chunks, processes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize image delivery?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Client-side compression before upload (80% quality, max 1920px). Server generates multiple sizes (thumbnail 256px, preview 1024px, full). CDN caches at edge. Serve appropriate size for context (thumbnail in gallery, preview in chat, full on tap). WebP format for 25% savings.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure media security?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Virus scanning on all uploads (quarantine until clean). Content moderation (NSFW detection, CSAM hash matching). Signed URLs with expiration (prevent hotlinking). Access control (only conversation members can view). Encryption at rest and in transit.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement media gallery?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Query media by conversation_id, ordered by date. Pagination (50 per page). Grid layout with lazy loading (Intersection Observer). Blurhash placeholders. Filter by type. Tap to open full-screen viewer with swipe navigation. Cache thumbnails locally.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle video sharing?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Extract thumbnail (first keyframe). Transcode to MP4 (H.264) for compatibility. Generate multiple resolutions (360p, 720p, 1080p) for adaptive streaming. Stream instead of download (HLS/DASH). Compress audio (AAC). Limit video length if needed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you manage storage costs?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Lifecycle policies: move to cold storage after 90 days, delete after 1 year (configurable). Compress aggressively. Deduplicate identical files (hash-based). User storage quotas. Auto-delete viewed ephemeral media. Offer cloud backup as paid feature.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/File_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — File API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/s3/features/multipart-upload/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS — S3 Multipart Upload
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/speed/webp"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google — WebP Image Format
            </a>
          </li>
          <li>
            <a
              href="https://cloud.google.com/media-transcoder"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Cloud — Media Transcoder API
            </a>
          </li>
          <li>
            <a
              href="https://www.clamav.net/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ClamAV — Open Source Virus Scanner
            </a>
          </li>
          <li>
            <a
              href="https://blurha.sh/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              BlurHash — Compact Placeholder for Images
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
