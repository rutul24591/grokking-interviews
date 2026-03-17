"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-frontend-draft-saving",
  title: "Draft Saving",
  description: "Guide to implementing draft saving covering auto-save, local storage, sync, and version management.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "draft-saving",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "drafts", "auto-save", "frontend"],
  relatedTopics: ["create-content-ui", "content-versioning", "offline-support"],
};

export default function DraftSavingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Draft Saving</strong> automatically preserves work-in-progress content to 
          prevent data loss from browser crashes, network issues, or accidental navigation. 
          It provides peace of mind and enables users to work across sessions.
        </p>
      </section>

      <section>
        <h2>Implementation Strategies</h2>
        <ul className="space-y-3">
          <li><strong>Auto-save Interval:</strong> Every 30-60 seconds, or on blur.</li>
          <li><strong>Local Storage:</strong> IndexedDB for offline drafts, sync when online.</li>
          <li><strong>Server Sync:</strong> Save to server periodically, conflict resolution.</li>
          <li><strong>Version Tracking:</strong> Each auto-save creates version, limit retained.</li>
        </ul>
      </section>

      <section>
        <h2>UX Considerations</h2>
        <ul className="space-y-3">
          <li><strong>Status Indicator:</strong> "Saving...", "Saved", "Offline".</li>
          <li><strong>Manual Save:</strong> Ctrl+S shortcut, save button.</li>
          <li><strong>Recovery:</strong> Show recovered drafts on return, list by date.</li>
          <li><strong>Conflict:</strong> If server version newer, show diff, let user choose.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle auto-save conflicts?</p>
            <p className="mt-2 text-sm">A: Timestamp comparison, show both versions, merge if possible, let user choose if not.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How long should drafts be retained?</p>
            <p className="mt-2 text-sm">A: 30 days for unpublished drafts, indefinitely for published. Auto-delete abandoned drafts after notice.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
