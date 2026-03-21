"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-frontend-create-content",
  title: "Create Content UI",
  description: "Guide to implementing content creation interfaces covering editors, media upload, drafts, and content validation.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "create-content-ui",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "create", "frontend", "editor"],
  relatedTopics: ["edit-content-ui", "rich-text-editor", "media-upload"],
};

export default function CreateContentUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Create Content UI</strong> is the primary interface for users to generate new 
          content on the platform. It must provide an intuitive, powerful editing experience 
          while enforcing content policies and guiding users toward quality submissions.
        </p>
      </section>

      <section>
        <h2>Core Requirements</h2>
        <ul className="space-y-3">
          <li><strong>Editor:</strong> Rich text or markdown support with formatting toolbar.</li>
          <li><strong>Media:</strong> Image/video upload with preview and embedding.</li>
          <li><strong>Validation:</strong> Real-time character count, required field indicators.</li>
          <li><strong>Drafts:</strong> Auto-save every 30 seconds, manual save option.</li>
          <li><strong>Preview:</strong> Show how content will appear when published.</li>
        </ul>
      </section>

      <section>
        <h2>UX Best Practices</h2>
        <ul className="space-y-3">
          <li><strong>Progressive Disclosure:</strong> Show basic options first, advanced on demand.</li>
          <li><strong>Keyboard Shortcuts:</strong> Bold (Ctrl+B), save (Ctrl+S), etc.</li>
          <li><strong>Clear CTAs:</strong> Prominent "Publish" and "Save Draft" buttons.</li>
          <li><strong>Error Prevention:</strong> Warn before navigating away with unsaved changes.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle auto-save conflicts?</p>
            <p className="mt-2 text-sm">A: Use optimistic locking with version numbers. If conflict, show user both versions and let them choose.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you support offline content creation?</p>
            <p className="mt-2 text-sm">A: Store drafts in IndexedDB, queue for sync when online, handle conflicts on reconnect.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
