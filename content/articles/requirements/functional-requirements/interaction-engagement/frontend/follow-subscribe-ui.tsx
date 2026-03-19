"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-frontend-follow-ui",
  title: "Follow/Subscribe UI",
  description: "Guide to implementing follow/subscribe interfaces covering follow buttons, suggestions, and follow management.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "follow-subscribe-ui",
  version: "extensive",
  wordCount: 5000,
  readingTime: 20,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "interaction", "follow", "subscribe", "frontend"],
  relatedTopics: ["social-graph", "notifications", "feed-generation"],
};

export default function FollowSubscribeUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Follow/Subscribe UI</strong> enables users to build their social 
          graph by following other users, creators, or topics, driving feed personalization 
          and engagement.
        </p>
      </section>

      <section>
        <h2>Follow Button</h2>
        <ul className="space-y-3">
          <li><strong>Toggle:</strong> Follow/unfollow with state change.</li>
          <li><strong>Confirmation:</strong> Confirm for large accounts ("Follow @celebrity?").</li>
          <li><strong>Pending:</strong> Show pending for private accounts.</li>
        </ul>
      </section>

      <section>
        <h2>Follow Management</h2>
        <ul className="space-y-3">
          <li><strong>Following List:</strong> View all followed accounts.</li>
          <li><strong>Suggestions:</strong> "Who to follow" based on social graph.</li>
          <li><strong>Cleanup:</strong> Suggest unfollowing inactive accounts.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you generate follow suggestions?</p>
            <p className="mt-2 text-sm">A: Friends of friends, similar interests, popular in your network, collaborative filtering.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle follow/unfollow at scale?</p>
            <p className="mt-2 text-sm">A: Async processing, update follower counts eventually, cache social graph, rate limit to prevent abuse.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
