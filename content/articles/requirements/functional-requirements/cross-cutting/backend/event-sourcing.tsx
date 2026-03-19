"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-backend-event-sourcing",
  title: "Event Sourcing",
  description: "Guide to implementing event sourcing covering event stores, projections, and event replay.",
  category: "functional-requirements",
  subcategory: "cross-cutting",
  slug: "event-sourcing",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "cross-cutting", "event-sourcing", "architecture", "backend"],
  relatedTopics: ["cqrs", "event-driven", "audit-logging"],
};

export default function EventSourcingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Event Sourcing</strong> stores state changes as a sequence of 
          events, enabling audit trails, temporal queries, and event-driven architectures.
        </p>
      </section>

      <section>
        <h2>Event Store</h2>
        <ul className="space-y-3">
          <li><strong>Append-Only:</strong> Events are immutable, appended only.</li>
          <li><strong>Versioning:</strong> Event schema versioning.</li>
          <li><strong>Snapshots:</strong> Periodic state snapshots for performance.</li>
        </ul>
      </section>

      <section>
        <h2>Projections</h2>
        <ul className="space-y-3">
          <li><strong>Read Models:</strong> Project events to queryable views.</li>
          <li><strong>Multiple Views:</strong> Different projections for different queries.</li>
          <li><strong>Rebuild:</strong> Rebuild projections from events.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When should you use event sourcing?</p>
            <p className="mt-2 text-sm">A: Audit requirements, temporal queries, event-driven architecture, complex business logic. Not for simple CRUD.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle event schema changes?</p>
            <p className="mt-2 text-sm">A: Upcast events on read, version events, maintain backward compatibility, event migration for major changes.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
