"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-frontend-chat-ui",
  title: "Chat Interface",
  description: "Guide to implementing chat interfaces covering message display, input, typing indicators, and real-time updates.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "chat-interface",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "communication", "chat", "messaging", "frontend"],
  relatedTopics: ["messaging", "real-time", "notifications"],
};

export default function ChatInterfaceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Chat Interface</strong> enables real-time text communication between 
          users, requiring responsive UI, message status indicators, and seamless 
          real-time updates.
        </p>
      </section>

      <section>
        <h2>Message Display</h2>
        <ul className="space-y-3">
          <li><strong>Bubbles:</strong> Sent (right), received (left) alignment.</li>
          <li><strong>Timestamps:</strong> Relative time (2m ago), delivery status.</li>
          <li><strong>Grouping:</strong> Group messages by time proximity.</li>
          <li><strong>Media:</strong> Inline images, videos, links with preview.</li>
        </ul>
      </section>

      <section>
        <h2>Message Input</h2>
        <ul className="space-y-3">
          <li><strong>Textarea:</strong> Auto-expand, character limit.</li>
          <li><strong>Attachments:</strong> Image, file, emoji picker.</li>
          <li><strong>Send:</strong> Enter to send, send button.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle message ordering?</p>
            <p className="mt-2 text-sm">A: Server timestamps, sequence numbers, handle clock skew, optimistic local ordering.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize chat performance?</p>
            <p className="mt-2 text-sm">A: Virtual scrolling, paginate messages, lazy load media, cache conversations.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
