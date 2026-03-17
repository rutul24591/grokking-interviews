"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-frontend-media-upload",
  title: "Media Upload",
  description: "Guide to implementing media upload covering drag-drop, progress indicators, validation, and image optimization.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "media-upload",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "media", "upload", "frontend"],
  relatedTopics: ["create-content-ui", "file-attachments", "image-optimization"],
};

export default function MediaUploadArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Media Upload</strong> enables users to attach images, videos, and documents 
          to their content. It must handle large files, provide progress feedback, and optimize 
          media for delivery.
        </p>
      </section>

      <section>
        <h2>Upload Flow</h2>
        <ul className="space-y-3">
          <li><strong>Selection:</strong> File picker or drag-drop zone.</li>
          <li><strong>Validation:</strong> File type, size limits, dimensions.</li>
          <li><strong>Upload:</strong> Multipart for large files, progress indicator.</li>
          <li><strong>Processing:</strong> Compression, thumbnail generation, transcoding.</li>
          <li><strong>Insert:</strong> Embed in content with caption/alt text.</li>
        </ul>
      </section>

      <section>
        <h2>Optimization</h2>
        <ul className="space-y-3">
          <li><strong>Client-side:</strong> Compress before upload, resize images.</li>
          <li><strong>Server-side:</strong> Generate multiple sizes, convert to WebP/AVIF.</li>
          <li><strong>CDN:</strong> Serve from edge, lazy load images.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle large file uploads?</p>
            <p className="mt-2 text-sm">A: Multipart upload with chunks (5MB each), resumable on failure, progress tracking per chunk.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent malicious uploads?</p>
            <p className="mt-2 text-sm">A: Validate file type by magic bytes, virus scan, strip metadata, sanitize images, restrict executable types.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
