"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-frontend-group-chat",
  title: "Group Chat UI",
  description: "Guide to implementing group chat covering member management, mentions, and group settings.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "group-chat-ui",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "communication", "group-chat", "messaging", "frontend"],
  relatedTopics: ["chat", "mentions", "notifications"],
};

export default function GroupChatUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Group Chat UI</strong> enables multi-user conversations with 
          features for member management, mentions, and group-specific settings.
        </p>
      </section>

      <section>
        <h2>Group Features</h2>
        <ul className="space-y-3">
          <li><strong>Member List:</strong> View all members, online status.</li>
          <li><strong>Add Members:</strong> Invite new members.</li>
          <li><strong>Admin Controls:</strong> Remove members, promote admins.</li>
        </ul>
      </section>

      <section>
        <h2>Mentions</h2>
        <ul className="space-y-3">
          <li><strong>@ Mention:</strong> Tag specific members.</li>
          <li><strong>@channel:</strong> Notify all members (rate limited).</li>
          <li><strong>Highlighting:</strong> Visual highlight for mentions.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle large group chats?</p>
            <p className="mt-2 text-sm">A: Lazy load members, paginate messages, limit @channel usage, mute by default for large groups.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you notify on mentions?</p>
            <p className="mt-2 text-sm">A: Parse message for @mentions, send targeted notifications, respect user mention preferences.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
