"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-backend-messaging-service",
  title: "Messaging Service",
  description: "Guide to implementing messaging services covering message delivery, ordering, and offline handling.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "messaging-service",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "communication", "messaging", "backend", "real-time"],
  relatedTopics: ["websockets", "message-queues", "offline-support"],
};

export default function MessagingServiceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Messaging Service</strong> handles message routing, delivery, 
          and persistence for real-time communication, ensuring reliable message 
          delivery even in challenging network conditions.
        </p>
      </section>

      <section>
        <h2>Message Flow</h2>
        <ul className="space-y-3">
          <li><strong>Ingestion:</strong> Receive message via API.</li>
          <li><strong>Validation:</strong> Check content, rate limits.</li>
          <li><strong>Delivery:</strong> Push via WebSocket to online recipients.</li>
          <li><strong>Queue:</strong> Store for offline recipients.</li>
        </ul>
      </section>

      <section>
        <h2>Message Ordering</h2>
        <ul className="space-y-3">
          <li><strong>Sequence Numbers:</strong> Per-conversation ordering.</li>
          <li><strong>Timestamps:</strong> Server timestamps for consistency.</li>
          <li><strong>Deduplication:</strong> Handle duplicate sends.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure message delivery?</p>
            <p className="mt-2 text-sm">A: Acknowledgments, retry with backoff, persistent queue, offline queue for later delivery.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle message ordering?</p>
            <p className="mt-2 text-sm">A: Single writer per conversation, sequence numbers, server timestamps, handle clock skew.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
