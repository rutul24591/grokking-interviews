"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-backend-offline-message-queue",
  title: "Offline Message Queue",
  description: "Guide to implementing offline message queues covering storage, sync, and delivery on reconnect.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "offline-message-queue",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "communication", "offline", "queue", "backend"],
  relatedTopics: ["messaging-service", "sync", "mobile"],
};

export default function OfflineMessageQueueArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Offline Message Queue</strong> stores messages for offline users 
          and delivers them when the user reconnects, ensuring no messages are lost 
          during disconnection.
        </p>
      </section>

      <section>
        <h2>Queue Storage</h2>
        <ul className="space-y-3">
          <li><strong>Persistent:</strong> Store in database (not just memory).</li>
          <li><strong>TTL:</strong> Expire after 7-30 days.</li>
          <li><strong>Priority:</strong> High priority messages first.</li>
        </ul>
      </section>

      <section>
        <h2>Sync on Reconnect</h2>
        <ul className="space-y-3">
          <li><strong>Last Message ID:</strong> Client sends last received ID.</li>
          <li><strong>Batch Delivery:</strong> Send missed messages in batches.</li>
          <li><strong>Ack:</strong> Client acknowledges received messages.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How long should you store offline messages?</p>
            <p className="mt-2 text-sm">A: 7-30 days depending on use case. Configurable per user/subscription. Notify before deletion.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle large message backlogs?</p>
            <p className="mt-2 text-sm">A: Paginate delivery, prioritize recent messages, summarize old messages, offer skip to latest.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
