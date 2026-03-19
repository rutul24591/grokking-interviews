"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-frontend-media-sharing",
  title: "Media Sharing in Chat",
  description: "Guide to implementing media sharing in chat covering image/video sharing, file attachments, and media gallery.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "media-sharing-chat",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "communication", "media", "chat", "frontend"],
  relatedTopics: ["chat", "media-upload", "file-attachments"],
};

export default function MediaSharingChatArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Media Sharing in Chat</strong> enables users to share images, 
          videos, and files within conversations, requiring efficient upload, 
          preview, and gallery features.
        </p>
      </section>

      <section>
        <h2>Media Types</h2>
        <ul className="space-y-3">
          <li><strong>Images:</strong> Inline preview, tap to expand.</li>
          <li><strong>Videos:</strong> Thumbnail with play button, inline playback.</li>
          <li><strong>Files:</strong> Icon, filename, size, download.</li>
          <li><strong>Voice:</strong> Audio player with waveform.</li>
        </ul>
      </section>

      <section>
        <h2>Media Gallery</h2>
        <ul className="space-y-3">
          <li><strong>Shared Media:</strong> All media in conversation.</li>
          <li><strong>Grouped:</strong> By type (photos, videos, documents).</li>
          <li><strong>Search:</strong> Search within shared media.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize media in chat?</p>
            <p className="mt-2 text-sm">A: Compress before send, thumbnail for preview, lazy load, cache viewed media.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle large file transfers?</p>
            <p className="mt-2 text-sm">A: Multipart upload, progress indicator, resume on failure, size limits, cloud storage links.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
