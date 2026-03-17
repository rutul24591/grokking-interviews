"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-backend-websocket-server",
  title: "WebSocket Server",
  description: "Guide to implementing WebSocket servers covering connection management, scaling, and heartbeats.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "websocket-server",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "communication", "websocket", "real-time", "backend"],
  relatedTopics: ["messaging-service", "presence", "scaling"],
};

export default function WebSocketServerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>WebSocket Server</strong> maintains persistent connections for 
          real-time bidirectional communication, enabling instant message delivery 
          and presence updates.
        </p>
      </section>

      <section>
        <h2>Connection Management</h2>
        <ul className="space-y-3">
          <li><strong>Handshake:</strong> HTTP upgrade to WebSocket.</li>
          <li><strong>Authentication:</strong> Token-based auth on connect.</li>
          <li><strong>Heartbeat:</strong> Ping/pong every 30s to detect dead connections.</li>
          <li><strong>Reconnect:</strong> Exponential backoff on disconnect.</li>
        </ul>
      </section>

      <section>
        <h2>Scaling</h2>
        <ul className="space-y-3">
          <li><strong>Connection Routing:</strong> Redis to find user's server.</li>
          <li><strong>Pub/Sub:</strong> Broadcast across servers.</li>
          <li><strong>Sticky Sessions:</strong> Route to same server for reconnect.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you scale WebSocket connections?</p>
            <p className="mt-2 text-sm">A: Multiple servers behind load balancer, connection routing via Redis, pub/sub for cross-server messaging.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle connection failures?</p>
            <p className="mt-2 text-sm">A: Heartbeat detection, automatic reconnect with backoff, message queue during disconnect, sync on reconnect.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
