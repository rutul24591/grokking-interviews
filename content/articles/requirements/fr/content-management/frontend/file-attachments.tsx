"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-frontend-file-attachments",
  title: "File Attachments",
  description: "Guide to implementing file attachments covering upload, download, versioning, and access control.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "file-attachments",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "attachments", "files", "frontend"],
  relatedTopics: ["media-upload", "content-storage", "access-control"],
};

export default function FileAttachmentsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>File Attachments</strong> enable users to attach documents, spreadsheets, 
          and other files to content. It extends content beyond text and media to include 
          downloadable resources.
        </p>
      </section>

      <section>
        <h2>Attachment Features</h2>
        <ul className="space-y-3">
          <li><strong>Upload:</strong> Drag-drop or file picker.</li>
          <li><strong>Preview:</strong> Inline preview for supported formats (PDF, images).</li>
          <li><strong>Download:</strong> Direct download with tracking.</li>
          <li><strong>Virus Scan:</strong> Scan before allowing download.</li>
        </ul>
      </section>

      <section>
        <h2>Access Control</h2>
        <ul className="space-y-3">
          <li><strong>Permissions:</strong> Who can view/download attachments.</li>
          <li><strong>Expiry:</strong> Time-limited download links.</li>
          <li><strong>Tracking:</strong> Log downloads for audit.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle large attachments?</p>
            <p className="mt-2 text-sm">A: Multipart upload, CDN delivery, streaming download, size limits per user tier.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you secure attachments?</p>
            <p className="mt-2 text-sm">A: Access control, signed URLs, virus scanning, content-type validation, download limits.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
