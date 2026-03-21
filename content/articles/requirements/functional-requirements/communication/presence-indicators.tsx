"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-frontend-presence-indicators",
  title: "Presence Indicators",
  description: "Guide to implementing presence indicators covering online status, typing indicators, and last seen.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "presence-indicators",
  version: "extensive",
  wordCount: 5000,
  readingTime: 20,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "communication", "presence", "real-time", "frontend"],
  relatedTopics: ["real-time", "chat", "websockets"],
};

export default function PresenceIndicatorsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Presence Indicators</strong> show user availability and activity 
          status, enabling real-time awareness in communication features.
        </p>
      </section>

      <section>
        <h2>Status Types</h2>
        <ul className="space-y-3">
          <li><strong>Online:</strong> Currently active (green).</li>
          <li><strong>Away:</strong> Idle for X minutes (yellow).</li>
          <li><strong>Offline:</strong> Not connected (gray).</li>
          <li><strong>Busy:</strong> Do not disturb (red).</li>
        </ul>
      </section>

      <section>
        <h2>Typing Indicators</h2>
        <ul className="space-y-3">
          <li><strong>Trigger:</strong> After 500ms of typing.</li>
          <li><strong>Display:</strong> "User is typing..." with animation.</li>
          <li><strong>Timeout:</strong> Hide after 3s of inactivity.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you track presence at scale?</p>
            <p className="mt-2 text-sm">A: WebSocket heartbeats, Redis with TTL, pub/sub for broadcasting, shard by user_id.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle privacy for presence?</p>
            <p className="mt-2 text-sm">A: User settings (hide online status), per-contact visibility, invisible mode, respect privacy choices.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
