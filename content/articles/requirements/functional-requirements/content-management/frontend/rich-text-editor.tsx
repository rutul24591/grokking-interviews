"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-frontend-rich-text-editor",
  title: "Rich Text Editor",
  description: "Guide to implementing rich text editors covering WYSIWYG, markdown, collaboration features, and accessibility.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "rich-text-editor",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "editor", "rich-text", "frontend"],
  relatedTopics: ["create-content-ui", "edit-content-ui", "media-upload"],
};

export default function RichTextEditorArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Rich Text Editor</strong> provides WYSIWYG or markdown-based content creation 
          with formatting, embedding, and collaboration capabilities. It is the core component 
          of content creation interfaces.
        </p>
      </section>

      <section>
        <h2>Editor Options</h2>
        <ul className="space-y-3">
          <li><strong>Draft.js:</strong> React-based, customizable, good for collaboration.</li>
          <li><strong>ProseMirror:</strong> Powerful, schema-based, steep learning curve.</li>
          <li><strong>TipTap:</strong> Modern, headless, Vue/React support.</li>
          <li><strong>Quill:</strong> Simple, widely adopted, limited customization.</li>
          <li><strong>Markdown:</strong> Plain text with formatting syntax, developer-friendly.</li>
        </ul>
      </section>

      <section>
        <h2>Key Features</h2>
        <ul className="space-y-3">
          <li><strong>Formatting:</strong> Bold, italic, headings, lists, links.</li>
          <li><strong>Embeds:</strong> Images, videos, code blocks, mentions.</li>
          <li><strong>Collaboration:</strong> Real-time editing, comments, suggestions.</li>
          <li><strong>Accessibility:</strong> Keyboard navigation, screen reader support.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle paste from Word?</p>
            <p className="mt-2 text-sm">A: Strip formatting, convert to clean HTML/markdown, preserve basic structure (headings, lists).</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement real-time collaboration?</p>
            <p className="mt-2 text-sm">A: Operational transforms (OT) or CRDTs. WebSocket for sync. Conflict-free merging of concurrent edits.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
