"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-backend-media-processing",
  title: "Media Processing",
  description: "Guide to implementing media processing covering image optimization, video transcoding, and thumbnail generation.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "media-processing",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "media", "processing", "backend"],
  relatedTopics: ["media-upload", "cdn-delivery", "content-storage"],
};

export default function MediaProcessingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Media Processing</strong> transforms uploaded media into optimized formats 
          for delivery, including image compression, video transcoding, and thumbnail generation. 
          It ensures fast loading and consistent quality across devices.
        </p>
      </section>

      <section>
        <h2>Image Processing</h2>
        <ul className="space-y-3">
          <li><strong>Resize:</strong> Generate multiple sizes (thumbnail, medium, large).</li>
          <li><strong>Format Conversion:</strong> Convert to WebP/AVIF with JPEG fallback.</li>
          <li><strong>Compression:</strong> Optimize quality vs file size.</li>
          <li><strong>Metadata:</strong> Strip EXIF, preserve orientation.</li>
        </ul>
      </section>

      <section>
        <h2>Video Processing</h2>
        <ul className="space-y-3">
          <li><strong>Transcoding:</strong> Convert to HLS/DASH for adaptive streaming.</li>
          <li><strong>Multiple Bitrates:</strong> 1080p, 720p, 480p, 360p.</li>
          <li><strong>Thumbnails:</strong> Generate sprite sheets for scrubbing.</li>
          <li><strong>Async:</strong> Queue-based processing, notify on complete.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle video processing at scale?</p>
            <p className="mt-2 text-sm">A: Queue-based (SQS/Kafka), auto-scaling workers, progress tracking, CDN for delivery, retry on failure.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize images for web?</p>
            <p className="mt-2 text-sm">A: Modern formats (WebP/AVIF), responsive images (srcset), lazy loading, CDN with edge optimization.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
