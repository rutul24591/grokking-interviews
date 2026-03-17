"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-backend-content-versioning",
  title: "Content Versioning",
  description: "Guide to implementing content versioning covering snapshot vs diff, version history, and rollback patterns.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "content-versioning",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "versioning", "history", "backend"],
  relatedTopics: ["draft-saving", "edit-content-ui", "content-lifecycle"],
};

export default function ContentVersioningArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Content Versioning</strong> maintains a history of content changes, enabling 
          users to view past versions, compare changes, and restore previous states. It is 
          essential for collaboration, audit trails, and recovery from mistakes.
        </p>
      </section>

      <section>
        <h2>Versioning Strategies</h2>
        <ul className="space-y-3">
          <li><strong>Full Snapshots:</strong> Store complete content per version. Simple, fast restore, more storage.</li>
          <li><strong>Diff-based:</strong> Store only changes. Less storage, complex restore.</li>
          <li><strong>Hybrid:</strong> Full snapshot every N versions, diffs in between.</li>
        </ul>
      </section>

      <section>
        <h2>Version Metadata</h2>
        <ul className="space-y-3">
          <li><strong>Author:</strong> Who made this version.</li>
          <li><strong>Timestamp:</strong> When it was created.</li>
          <li><strong>Change Summary:</strong> User-provided or auto-generated description.</li>
          <li><strong>Version Number:</strong> Sequential or semantic versioning.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How many versions should you keep?</p>
            <p className="mt-2 text-sm">A: Last 50 versions or 90 days. Configurable per content type. Archive older versions to cold storage.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement version comparison?</p>
            <p className="mt-2 text-sm">A: Diff algorithm (Myers diff for text), highlight additions/deletions, side-by-side or inline view.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
