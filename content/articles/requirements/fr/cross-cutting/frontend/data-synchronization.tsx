"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-frontend-data-synchronization",
  title: "Data Synchronization",
  description: "Guide to implementing data sync covering optimistic updates, conflict resolution, and offline sync.",
  category: "functional-requirements",
  subcategory: "cross-cutting",
  slug: "data-synchronization",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "cross-cutting", "sync", "offline", "frontend"],
  relatedTopics: ["offline-first", "conflict-resolution", "real-time"],
};

export default function DataSynchronizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Data Synchronization</strong> keeps client and server data in sync 
          across devices and network conditions, handling conflicts and offline scenarios.
        </p>
      </section>

      <section>
        <h2>Sync Strategies</h2>
        <ul className="space-y-3">
          <li><strong>Optimistic:</strong> Update UI immediately, sync in background.</li>
          <li><strong>Pessimistic:</strong> Wait for server confirmation.</li>
          <li><strong>Hybrid:</strong> Optimistic for safe operations, pessimistic for critical.</li>
        </ul>
      </section>

      <section>
        <h2>Conflict Resolution</h2>
        <ul className="space-y-3">
          <li><strong>Last-write-wins:</strong> Simple but can lose data.</li>
          <li><strong>Merge:</strong> Combine changes when possible.</li>
          <li><strong>User Choice:</strong> Present conflicts for user resolution.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle offline edits?</p>
            <p className="mt-2 text-sm">A: Queue changes locally, sync on reconnect, detect conflicts, resolve automatically or prompt user.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you sync across multiple tabs?</p>
            <p className="mt-2 text-sm">A: BroadcastChannel API, localStorage events, shared worker, centralized state management.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
