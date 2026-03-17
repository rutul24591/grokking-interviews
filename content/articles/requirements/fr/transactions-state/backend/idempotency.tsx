"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-backend-idempotency",
  title: "Idempotency",
  description: "Guide to implementing idempotency covering idempotency keys, deduplication, and safe retries.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "idempotency",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "transactions", "idempotency", "reliability", "backend"],
  relatedTopics: ["payments", "api-design", "reliability"],
};

export default function IdempotencyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Idempotency</strong> ensures that repeated requests with the same 
          parameters produce the same result, preventing duplicate charges and data 
          corruption from retries.
        </p>
      </section>

      <section>
        <h2>Idempotency Keys</h2>
        <ul className="space-y-3">
          <li><strong>Generation:</strong> Client generates unique key per operation.</li>
          <li><strong>Storage:</strong> Store key with response (24h TTL).</li>
          <li><strong>Lookup:</strong> Return cached response for duplicate key.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <ul className="space-y-3">
          <li><strong>Header:</strong> Idempotency-Key header.</li>
          <li><strong>Lock:</strong> Prevent concurrent same-key requests.</li>
          <li><strong>Atomic:</strong> Atomic write of key and result.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle idempotency for different operations?</p>
            <p className="mt-2 text-sm">A: POST (create) - return same resource, PUT (replace) - naturally idempotent, DELETE - return success even if already deleted.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How long should you store idempotency keys?</p>
            <p className="mt-2 text-sm">A: Based on retry window (24h typical). Long enough for client retries, short enough to limit storage.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
