"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-frontend-upvote-downvote",
  title: "Upvote/Downvote UI",
  description: "Guide to implementing upvote/downvote systems covering vote toggling, score display, and sorting.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "upvote-downvote-ui",
  version: "extensive",
  wordCount: 5000,
  readingTime: 20,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "interaction", "voting", "engagement", "frontend"],
  relatedTopics: ["ranking", "content-quality", "community-moderation"],
};

export default function UpvoteDownvoteUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Upvote/Downvote UI</strong> enables community-driven content quality 
          assessment, surfacing valuable content and demoting low-quality content through 
          collective voting.
        </p>
      </section>

      <section>
        <h2>Vote Controls</h2>
        <ul className="space-y-3">
          <li><strong>Toggle:</strong> Upvote, downvote, remove vote.</li>
          <li><strong>Visual:</strong> Arrow icons, color change on vote.</li>
          <li><strong>Score:</strong> Display net score (up - down).</li>
        </ul>
      </section>

      <section>
        <h2>Sorting</h2>
        <ul className="space-y-3">
          <li><strong>Top:</strong> Highest score first.</li>
          <li><strong>New:</strong> Most recent first.</li>
          <li><strong>Controversial:</strong> High upvotes AND downvotes.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you calculate hot ranking?</p>
            <p className="mt-2 text-sm">A: Score with time decay (Reddit algorithm), newer posts need fewer votes to rank high.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent vote manipulation?</p>
            <p className="mt-2 text-sm">A: One vote per user, detect vote rings, weight votes by account age/karma, rate limit voting.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
