"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-frontend-comment-ui",
  title: "Comment UI",
  description: "Guide to implementing comment interfaces covering nested replies, threading, and comment actions.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "comment-ui",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "interaction", "comments", "engagement", "frontend"],
  relatedTopics: ["like-button", "threading", "notifications"],
};

export default function CommentUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Comment UI</strong> enables users to engage in discussions through 
          threaded conversations. It must handle nesting, editing, and moderation 
          gracefully.
        </p>
      </section>

      <section>
        <h2>Comment Display</h2>
        <ul className="space-y-3">
          <li><strong>Threading:</strong> Nested replies (max 2-3 levels).</li>
          <li><strong>Sorting:</strong> Top, newest, oldest options.</li>
          <li><strong>Collapsed:</strong> Collapse deep threads, show reply count.</li>
          <li><strong>Highlight:</strong> Highlight OP comments, moderator comments.</li>
        </ul>
      </section>

      <section>
        <h2>Comment Input</h2>
        <ul className="space-y-3">
          <li><strong>Expandable:</strong> Expand on focus, show character count.</li>
          <li><strong>Rich Text:</strong> Mentions (@), emoji, formatting.</li>
          <li><strong>Auto-save:</strong> Save drafts while typing.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle deep nesting?</p>
            <p className="mt-2 text-sm">A: Limit to 2-3 levels visually, flatten deeper replies, use indentation indicators.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you load comments efficiently?</p>
            <p className="mt-2 text-sm">A: Paginate (20-50 per page), lazy load replies, cursor-based pagination, cache comments.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
