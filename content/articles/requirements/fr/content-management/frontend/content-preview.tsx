"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-frontend-content-preview",
  title: "Content Preview",
  description: "Guide to implementing content preview covering live preview, responsive preview, and preview modes.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "content-preview",
  version: "extensive",
  wordCount: 5000,
  readingTime: 20,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "preview", "frontend"],
  relatedTopics: ["create-content-ui", "edit-content-ui", "responsive-design"],
};

export default function ContentPreviewArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Content Preview</strong> shows users how their content will appear when 
          published, enabling them to catch formatting issues and optimize presentation 
          before going live.
        </p>
      </section>

      <section>
        <h2>Preview Modes</h2>
        <ul className="space-y-3">
          <li><strong>Live Preview:</strong> Real-time preview alongside editor.</li>
          <li><strong>Full Preview:</strong> Dedicated preview page.</li>
          <li><strong>Responsive Preview:</strong> Mobile, tablet, desktop views.</li>
          <li><strong>Social Preview:</strong> How it appears when shared.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <ul className="space-y-3">
          <li><strong>Render Pipeline:</strong> Same rendering as published content.</li>
          <li><strong>Draft Watermark:</strong> Indicate this is preview, not live.</li>
          <li><strong>Performance:</strong> Debounce preview updates, lazy load.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle preview for dynamic content?</p>
            <p className="mt-2 text-sm">A: Mock dynamic components, use preview data, note limitations in preview mode.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent preview abuse?</p>
            <p className="mt-2 text-sm">A: Rate limit preview requests, require authentication, don't index preview URLs.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
